import { createClient, PostgrestError } from "@supabase/supabase-js";
import { Database } from "../../../../database.types";
import { getCurRound } from "./route";
import { currentYear } from "@/utils/constants";
import { GameData, gameResult } from "@/utils/types";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

type GameRow = Database["public"]["Tables"]["games"]["Row"];

// If your query selects: id, date, venue
type GameSubset = Pick<
  GameRow,
  | "id"
  | "date"
  | "venue"
  | "complete"
  | "hteamid"
  | "ateamid"
  | "winnerteamid"
  | "round"
  | "year"
>;

/**
 * The main function of this file. Will be called by the Get method in the
 * API route to fetch all data. will use the smaller functions then return the
 * final object that will be ready to use in the frontend
 */
export async function fetchAll() {
  // gets the current round from the options table
  const roundNum: number | PostgrestError = await getCurRound();

  if (typeof roundNum !== "number") {
    // It's a PostgrestError
    return { data: null, error: { message: "Round number is null" } };
  }
  // fetch all games for last 5 years
  const { data: allGames, error: allGamesErr } = await supabase
    .from("games")
    .select(
      "id, date, venue, complete, hteamid, ateamid, winnerteamid, round, year",
    )
    .lte("year", currentYear)
    .gte("year", currentYear - 5)
    .order("date", { ascending: false });

  if (allGamesErr || !allGames) {
    const errorMsg = allGamesErr
      ? allGamesErr.message
      : "Fetching games from last 5 years is null";
    return { data: null, error: { message: errorMsg } };
  }
  const excGames = allGames.filter(
    (game) => game.year !== currentYear || game.round < roundNum,
  );

  // const last5Games = allGames.filter((game) => game.year == currentYear && (game.round >= minRound && game.round < roundNum)
  // )
  const curRoundGames = allGames.filter(
    (game) => game.year === currentYear && game.round === roundNum,
  );

  // construct the last 5 for each team
  const cleanedLast5 = cleanLast5New(excGames);

  const finalGameData: GameData[] = [];

  // create final object, in reversed order (ascending date order)
  for (let i = curRoundGames.length - 1; i >= 0; i--) {
    const game = curRoundGames[i];
    const curLast5 = [
      cleanedLast5[game.hteamid - 1],
      cleanedLast5[game.ateamid - 1],
    ];
    finalGameData.push({
      id: game.id,
      date: game.date,
      venue: game.venue,
      hteamid: game.hteamid,
      ateamid: game.ateamid,
      round: game.round,
      last5: curLast5,
      last5Venue: [[]],
      h2h: [],
    });
  }

  return { data: finalGameData, error: null };
}

function cleanLast5New(data: GameSubset[]) {
  const last5Arr: gameResult[][] = Array.from({ length: 18 }, () => []);
  // array to check each team has searched last 5 games
  const completed = Array.from({ length: 18 }, () => false);

  for (let i = 0; i < data.length; i++) {
    const game = data[i];
    // all teams have been done
    if (!completed.includes(false)) break;

    const hteamRes = game.winnerteamid
      ? game.winnerteamid === game.hteamid
        ? "W"
        : "L"
      : "D";
    const ateamRes = game.winnerteamid
      ? game.winnerteamid === game.ateamid
        ? "W"
        : "L"
      : "D";

    if (!completed[game.hteamid - 1]) {
      last5Arr[game.hteamid - 1].push(hteamRes);
      if (last5Arr[game.hteamid - 1].length >= 5)
        completed[game.hteamid - 1] = true;
    }
    if (!completed[game.ateamid - 1]) {
      last5Arr[game.ateamid - 1].push(ateamRes);
      if (last5Arr[game.ateamid - 1].length >= 5)
        completed[game.ateamid - 1] = true;
    }
  }
  return last5Arr;
}

function cleanh2h(curRoundGames: GameSubset[], excGames: GameSubset[]) {
  const gameIdTuples = curRoundGames.map(game => [game.hteamid, game.ateamid]);
  const res = excGames.filter((game) => h2hFilter(gameIdTuples, game))
  
}

function h2hFilter(gameIdTuples: number[][], game: GameSubset) {
  for (let i = 0; i < gameIdTuples.length; i++) {
    const hteamid = gameIdTuples[i][0];
    const ateamid = gameIdTuples[i][1];
    // home and away teams match 
    if ((hteamid === game.hteamid && ateamid === game.ateamid) || (hteamid === game.ateamid && ateamid === game.hteamid)) return true;
  }
  return false;
}



function cleanLast5(data: GameSubset[]) {
  // const { data: data, error: error } = await fetchLast5();
  // TODO make data more readable

  const last5Arr: gameResult[][] = Array.from({ length: 18 }, () => []);

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

  return last5Arr;

  // store last 5 as a [[bool]], where the index = teamId and bools indicate win or loss
  // for example [[t, f, t, f, f] <- brisbane]
}

/**
 * Fetches all games for last 5 rounds
 * @returns
 */
async function fetchLast5(roundNum: number) {
  if (typeof roundNum !== "number") {
    // It's a PostgrestError
    return { data: null, error: roundNum };
  }

  const minRound = roundNum < 6 ? 1 : roundNum - 5;

  const { data: games, error: gamesError } = await supabase
    .from("games")
    .select(
      "id, date, venue, complete, hteamid, ateamid, winnerteamid, round, year",
    )
    .eq("complete", 100)
    .eq("year", currentYear)
    .gte("round", minRound)
    .lt("round", roundNum)
    .order("date", { ascending: true });

  return { data: games, error: gamesError };
}

export async function fetchSingleH2H(hteamid: number, ateamid: number) {
  const roundNum: number | PostgrestError = await getCurRound();
  if (typeof roundNum !== "number") {
    // It's a PostgrestError
    return { data: null, error: roundNum };
  }

  return await supabase
    .from("games")
    .select("id, hteamid, ateamid, winnerteamid, year, round")
    .eq("complete", 100)
    .eq("hteamid", hteamid)
    .eq("ateamid", ateamid)
    .order("date", { ascending: false })
    .limit(5);
}
