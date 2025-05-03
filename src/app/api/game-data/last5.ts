import { createClient, PostgrestError } from "@supabase/supabase-js";
import { Database } from "../../../../database.types";
import { getCurRound } from "./route";
import { currentYear } from "@/utils/constants";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

type gameResult = "W" | "L" | "D";

async function getLast5() {
  const { data: data, error: error } = await fetchLast5();
  // TODO make data more readable

  let last5Arr: gameResult[][] = Array.from({ length: 18 }, () => []);

  if (error) {
    // TODO handle error
    return { data: null, error: { message: "big error" } };
  }

  if (!data) {
    // TODO handle error
    return { data: null, error: { message: "big error" } };
  }

  for (let i = 0; i < data!.length; i++) {
    const game = data[i];

    if (game.winnerteamid == null) {
      last5Arr[game.hteamid - 1].push("D");
      last5Arr[game.ateamid - 1].push("D");
    } else if (game.winnerteamid == game.hteamid) {
      last5Arr[game.hteamid - 1].push("W");
      last5Arr[game.ateamid - 1].push("L");
    } else {
      last5Arr[game.hteamid - 1].push("L");
      last5Arr[game.ateamid - 1].push("W");
    }
  }

  return { data: last5Arr, error };

  // store last 5 as a [[bool]], where the index = teamId and bools indicate win or loss
  // for example [[t, f, t, f, f] <- brisbane]
}

/**
 * Fetches all games for last 5 rounds
 * @returns
 */
async function fetchLast5() {
  const roundNum: number | PostgrestError = await getCurRound();

  if (typeof roundNum !== "number") {
    // It's a PostgrestError
    return { data: null, error: roundNum };
  }

  const minRound = roundNum < 6 ? 1 : roundNum - 5;

  const { data: games, error: gamesError } = await supabase
    .from("games")
    .select("id, date, venue, complete, hteamid, ateamid, winnerteamid, round")
    .eq("complete", 100)
    .eq("year", currentYear)
    .gte("round", minRound)
    .lt("round", roundNum)
    .order("date", { ascending: true });

  return { data: games, error: gamesError };
}

export { getLast5 };
