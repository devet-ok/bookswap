import { supabase } from '@/lib/supabase'

export default async function Home() {
  const { data, error } = await supabase.from('books').select('*')

  if (error) {
    return <div>Ошибка подключения: {error.message}</div>
  }

  return (
    <div>
      <h1>BookSwap работает!</h1>
      <p>Книг в базе: {data.length}</p>
    </div>
  )
}