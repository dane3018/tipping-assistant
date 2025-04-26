import { createClient, PostgrestError } from '@supabase/supabase-js'
import { Database } from '../../../../database.types'
import { getCurRound } from './route';
import { currentYear } from '@/utils/constants';

const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

async function cleanLast5() {
   const { data: data, error: error} = await fetchLast5();

   // store last 5 as a [[bool]], where the index = teamId and bools indicate win or loss
   // for example [[t, f, t, f, f] <- brisbane]
}

async function fetchLast5() {
    const roundNum: number | PostgrestError = await getCurRound()

  if (typeof roundNum !== 'number') {
    // It's a PostgrestError
    return { data: null, error: roundNum}
  }


  const minRound = roundNum < 6 ? 1 : roundNum - 5;

  const { data: games, error: gamesError } = await supabase
  .from('games')
  .select('id, date, venue, complete, hteamid, ateamid, winnerteamid, round')
  .eq('complete', 100)
  .eq('year', currentYear)
  .gte('round', minRound)
  .lt('round', roundNum)
  .order('date', { ascending: false })

  console.log(`min ${minRound}, roundNum ${roundNum}`)
  console.log(games)

  return { data: games, error: gamesError}
}