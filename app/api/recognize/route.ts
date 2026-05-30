import { NextRequest, NextResponse } from 'next/server';

// Rate limiter — минутный и дневной лимиты
const requestCounts = new Map<string, {
  minuteCount: number;
  minuteReset: number;
  dayCount: number;
  dayReset: number;
}>();

function checkRateLimit(ip: string): { allowed: boolean; reason?: string } {
  const now = Date.now();
  const ONE_MINUTE = 60 * 1000;
  const ONE_DAY = 24 * 60 * 60 * 1000;

  const record = requestCounts.get(ip);

  if (!record) {
    requestCounts.set(ip, {
      minuteCount: 1,
      minuteReset: now + ONE_MINUTE,
      dayCount: 1,
      dayReset: now + ONE_DAY,
    });
    return { allowed: true };
  }

  // Сбрасываем минутный счётчик если время вышло
  if (now > record.minuteReset) {
    record.minuteCount = 0;
    record.minuteReset = now + ONE_MINUTE;
  }

  // Сбрасываем дневной счётчик если время вышло
  if (now > record.dayReset) {
    record.dayCount = 0;
    record.dayReset = now + ONE_DAY;
  }

  // Проверяем дневной лимит
  if (record.dayCount >= 20) {
    return { allowed: false, reason: 'daily_limit' };
  }

  // Проверяем минутный лимит
  if (record.minuteCount >= 10) {
    return { allowed: false, reason: 'rate_limit' };
  }

  record.minuteCount++;
  record.dayCount++;
  return { allowed: true };
}

export async function POST(request: NextRequest) {
  try {
    // Проверяем лимиты
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const { allowed, reason } = checkRateLimit(ip);

    if (!allowed) {
      if (reason === 'daily_limit') {
        return NextResponse.json(
          { error: 'Daily limit reached', reason: 'daily_limit' },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: 'Too many requests', reason: 'rate_limit' },
        { status: 429 }
      );
    }

    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');

    // Шаг 1 — Google Vision: извлекаем текст с обложки
    const visionResponse = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [{
            image: { content: base64Image },
            features: [{ type: 'TEXT_DETECTION', maxResults: 1 }],
          }],
        }),
      }
    );

    const visionData = await visionResponse.json();
    const extractedText = visionData.responses?.[0]?.fullTextAnnotation?.text;

    if (!extractedText) {
      return NextResponse.json({ error: 'No text found' }, { status: 422 });
    }

    // Шаг 2 — Google Books: ищем книгу по тексту
    const booksResponse = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(extractedText)}&key=${process.env.GOOGLE_API_KEY}&maxResults=1`
    );

    const booksData = await booksResponse.json();
    const book = booksData.items?.[0]?.volumeInfo;

    if (book) {
      const isbn = book.industryIdentifiers?.find(
        (id: { type: string }) => id.type === 'ISBN_13'
      )?.identifier;

      const coverUrl = isbn
        ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`
        : book.imageLinks?.thumbnail || null;

      const languageMap: { [key: string]: string } = {
        'ru': 'Русский', 'en': 'Английский', 'de': 'Немецкий',
        'fr': 'Французский', 'es': 'Испанский', 'it': 'Итальянский',
      };

      return NextResponse.json({
        title: book.title || 'Название не найдено',
        author: book.authors?.[0] || 'Автор не найден',
        language: languageMap[book.language] || book.language || 'Неизвестно',
        genre: book.categories?.[0] || 'Без жанра',
        description: book.description || 'Описание отсутствует',
        cover_url: coverUrl,
        isbn: isbn || null,
      });
    }

    // Шаг 3 — fallback: Open Library
    const openLibraryResponse = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(extractedText)}&limit=1`
    );

    const openLibraryData = await openLibraryResponse.json();
    const olBook = openLibraryData.docs?.[0];

    if (!olBook) {
      return NextResponse.json({ error: 'Book not found' }, { status: 422 });
    }

    const isbn = olBook.isbn?.[0];
    const coverUrl = isbn
      ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`
      : olBook.cover_i
      ? `https://covers.openlibrary.org/b/id/${olBook.cover_i}-L.jpg`
      : null;

    return NextResponse.json({
      title: olBook.title || 'Название не найдено',
      author: olBook.author_name?.[0] || 'Автор не найден',
      language: 'Неизвестно',
      genre: olBook.subject?.[0] || 'Без жанра',
      description: 'Описание отсутствует',
      cover_url: coverUrl,
      isbn: isbn || null,
    });

  } catch (error) {
    console.error('Recognition error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}