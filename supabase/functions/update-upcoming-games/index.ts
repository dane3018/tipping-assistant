// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

Deno.serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data, error } = await supabase.from('settings').select("value").eq("id", "currentRound").single()

    if (error) {
      throw error
    }
    const curRound : number = +data.value;
    const nextRound = curRound + 1;

    const apiUrl = `https://api.squiggle.com.au/?q=games;year=2025;round=${nextRound}`;
    const apiResponse = await fetch(apiUrl);
    if (!apiResponse.ok) {
      console.error("Error fetching Squiggle API data");
      return new Response("Failed to fetch Squiggle API", { status: 500 });
    }
    const apiJson = await apiResponse.json();
    const games = apiJson.games;
    const returnGames = []

    for (let i = 0; i < games.length; i++) {
      const curGame = games[i]
      const updatedGame = {
        ascore: curGame.ascore,
        hscore: curGame.hscore,
        agoals: curGame.agoals,
        abehinds: curGame.abehinds,
        hgoals: curGame.hgoals,
        hbehinds: curGame.hbehinds,
        complete: curGame.complete,
        winnerteamid: curGame.winnerteamid
      }
      returnGames.push(updatedGame)
    }


    // const { error: updateEr } = await supabase.from("games").update({
      
    // }).eq(, nextRound)

    return new Response(JSON.stringify({ returnGames }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    return new Response(String(err?.message ?? err), { status: 500 })
  }
})

console.log("Hello from Functions!")


// Deno.serve(async (req) => {
//   const { name } = await req.json()
//   const data = {
//     message: `Hello ${name}!`,
//   }



//   return new Response(
//     JSON.stringify(data),
//     { headers: { "Content-Type": "application/json" } },
//   )
// })

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/update-upcoming-games' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
