import { createClient, PostgrestError } from "@supabase/supabase-js";
import { Database } from "../../../../database.types";
import { currentYear } from "@/utils/constants";
import { GameData, gameResult, h2h } from "@/utils/types";

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
  console.log("round num:" + roundNum);
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

  // construct h2h for each game in the current round
  const cleanedh2h = cleanh2h(curRoundGames, excGames);

  // Construct last 5 venue
  const cleanedVenue = cleanLast5Venue(curRoundGames, excGames);

  const finalGameData: GameData[] = [];

  // create final object, in reversed order (ascending date order)
  for (let i = curRoundGames.length - 1; i >= 0; i--) {
    const game = curRoundGames[i];
    const curLast5 = [
      cleanedLast5[game.hteamid - 1],
      cleanedLast5[game.ateamid - 1],
    ];
    const cur5Venue = [
      cleanedVenue[game.hteamid - 1],
      cleanedVenue[game.ateamid - 1],
    ];
    finalGameData.push({
      id: game.id,
      date: game.date,
      venue: game.venue,
      hteamid: game.hteamid,
      ateamid: game.ateamid,
      round: game.round,
      last5: curLast5,
      last5Venue: cur5Venue,
      h2h: cleanedh2h.get(game.id) ?? [],
    });
  }

  return { data: finalGameData, error: null };
}

async function getCurRound() {
  const { data, error: roundError } = await supabase
    .from("settings")
    .select("value")
    .eq("id", "currentRound")
    .single();

  if (roundError) {
    return roundError;
  }

  const roundNum = +data.value;
  return roundNum;
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

/**
 * 
 * @param curRoundGames The games of the current round for which we are checking last 5 h2h
 * @param excGames Games to search through
 * @returns a Map where id = game.id and value is the game results of the last 5
 */
function cleanh2h(curRoundGames: GameSubset[], excGames: GameSubset[]) {
  const gameIdTuples = curRoundGames.map((game) => [
    game.id,
    game.hteamid,
    game.ateamid,
  ]);
  const h2hMap = new Map<number, h2h[]>(
    curRoundGames.map((game) => [game.id, []]),
  );
  const completed = Array.from({ length: gameIdTuples.length }, () => false);
  // loop through each current week game to check if the teams matched a past game
  // if they do, add it to the results map. order of results will be opposite of chronological order
  for (let i = 0; i < excGames.length; i++) {
    const game = excGames[i];
    if (!completed.includes(false)) break;
    for (let j = 0; j < gameIdTuples.length; j++) {
      const gameid = gameIdTuples[j][0];
      const hteamid = gameIdTuples[j][1];
      const ateamid = gameIdTuples[j][2];

      // check if the current game is a head to head
      if (
        (hteamid === game.hteamid && ateamid === game.ateamid) ||
        (hteamid === game.ateamid && ateamid === game.hteamid)
      ) {
        // if h2h is found but already have 5 can safely break from inner loop
        if (completed[j]) break;
        const gameRes = game.winnerteamid
          ? game.winnerteamid === hteamid
            ? "W"
            : "L"
          : "D";
        const h2hVal: h2h = {
          result: gameRes,
          date: game.date!,
        };

        h2hMap.get(gameid)?.push(h2hVal);
        if (h2hMap.get(gameid)!.length >= 5) completed[j] = true;
      }
    }
  }
  return h2hMap;
}

function cleanLast5Venue(curRoundGames: GameSubset[], excGames: GameSubset[]) {
  const last5Ven: gameResult[][] = Array.from({ length: 18 }, () => []);

  for (let i = 0; i < curRoundGames.length; i++) {
    const curGame = curRoundGames[i];
    // all teams have been done
    const venue = curGame.venue;
    const hGamesAtVenue = excGames
      .filter(
        (game) =>
          game.venue === venue &&
          (game.hteamid === curGame.hteamid ||
            game.ateamid === curGame.hteamid),
      )
      .slice(0, 5);
    const aGamesAtVenue = excGames
      .filter(
        (game) =>
          game.venue === venue &&
          (game.hteamid === curGame.ateamid ||
            game.ateamid === curGame.ateamid),
      )
      .slice(0, 5);
    // Convert games into game results
    hGamesAtVenue.forEach((game) => {
      // console.log("venue: "+game.venue+" hteam: "+ game.hteamid+" ateam: "+game.ateamid+" round: "+game.round + " Year: "+game.year+" winner: "+game.winnerteamid)
      const res = game.winnerteamid
        ? game.winnerteamid === curGame.hteamid
          ? "W"
          : "L"
        : "D";
      last5Ven[curGame.hteamid - 1].push(res);
    });

    aGamesAtVenue.forEach((game) => {
      const res = game.winnerteamid
        ? game.winnerteamid === curGame.ateamid
          ? "W"
          : "L"
        : "D";
      last5Ven[curGame.ateamid - 1].push(res);
    });
  }
  return last5Ven;
}

function h2hFilter(gameIdTuples: number[][], game: GameSubset) {
  for (let i = 0; i < gameIdTuples.length; i++) {
    const hteamid = gameIdTuples[i][0];
    const ateamid = gameIdTuples[i][1];
    // home and away teams match
    if (
      (hteamid === game.hteamid && ateamid === game.ateamid) ||
      (hteamid === game.ateamid && ateamid === game.hteamid)
    )
      return true;
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
