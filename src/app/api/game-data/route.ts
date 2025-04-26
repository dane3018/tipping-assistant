// app/api/game-data/route.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function GET() {
  const { data: games, error: gamesError } = await supabase
    .from('games')
    .select('id, date, venue, complete, hteamid, ateamid, teams!games_hteamid_fkey(name), teams!games_ateamid_fkey(name)')
    .eq('complete', 100)
    .order('date', { ascending: false })
    .limit(5)

  if (gamesError) {
    return new Response(JSON.stringify({ error: gamesError.message }), { status: 500 })
  }

  return new Response(JSON.stringify({ games }), { status: 200 })
}
