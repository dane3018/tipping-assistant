/**
 * Edge function to be run weekly which will do 2 things.
 * 1. Update the results of the games of the past week
 * 2. Increment the currentRound value in settings table
 */
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    console.log(`Received ${req.method}, terminating`);
    return new Response(`Method ${req.method} Not Allowed`, { status: 405 });
  }
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    const { data, error } = await supabase
      .from("settings")
      .select("value")
      .eq("id", "currentRound")
      .single();

    if (error) {
      throw error;
    }
    const curRound: number = +data.value;
    console.log(`Fetched current round as ${curRound}`);
    const nextRound = curRound + 1;

    const apiUrl = `https://api.squiggle.com.au/?q=games;year=2025;round=${curRound}`;
    const apiResponse = await fetch(apiUrl);
    if (!apiResponse.ok) {
      console.error("Error fetching Squiggle API data");
      return new Response("Failed to fetch Squiggle API", { status: 500 });
    }
    const apiJson = await apiResponse.json();
    const games = apiJson.games;

    for (let i = 0; i < games.length; i++) {
      const curGame = games[i];
      const updatedGame = {
        ascore: curGame.ascore,
        hscore: curGame.hscore,
        agoals: curGame.agoals,
        abehinds: curGame.abehinds,
        hgoals: curGame.hgoals,
        hbehinds: curGame.hbehinds,
        complete: curGame.complete,
        winnerteamid: curGame.winnerteamid,
      };

      const { error: updateErr } = await supabase
        .from("games")
        .update(updatedGame)
        .eq("id", curGame.id);

      if (updateErr) throw updateErr;
      console.log(
        `Updated gameid ${curGame.id}: ${curGame.hteam} (id=${curGame.hteamid}) vs ${curGame.ateam} (id=${curGame.ateamid})`,
      );
    }

    const { error: roundErr } = await supabase
      .from("settings")
      .update({
        value: String(nextRound),
      })
      .eq("id", "currentRound");

    if (roundErr) throw roundErr;

    console.log(`Updated currentRound from ${curRound} to ${nextRound}`);

    return new Response(
      JSON.stringify({
        data: `Successfully updated games for round ${curRound}. Round has been incremented to ${nextRound}`,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (err) {
    const errMsg = String(err?.message ?? err);
    console.error(`Error updating games or roundNum: ${errMsg}`);
    return new Response(errMsg, { status: 500 });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/update-upcoming-games' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
