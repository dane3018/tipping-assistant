import {
  createClient,
  PostgrestError,
  SupabaseClient,
} from "@supabase/supabase-js";
import { last5, last5h2h } from "@/utils/types";
import { Database } from "../../../../database.types";
import { getCurRound } from "./route";
import { currentYear } from "@/utils/constants";

class GameDataDAO {
  currentRound: number;

  error: PostgrestError | null;

  last5: last5 | undefined;

  h2h: last5h2h | undefined;

  supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  constructor(currentRound: number) {
    this.currentRound = currentRound;
    this.error = null;
  }

  /**
   * The main function for the class, will fetch all data and process 
   * it to be used in the client application. Calls a number of smaller 
   * methods and updates the class fields then will create the final 
   * object to be sent back to the client of the Get request 
   */
  async fetchAll() {
    const {data: last5, error: last5Error } = await this.getLast5()
  }

  //
  async getLast5() {
    const { data: data, error: error } = await this.fetchLast5();
    // TODO make data more readable

    let last5Arr: last5 = Array.from({ length: 18 }, () => []);

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
  async fetchLast5() {
    const roundNum: number | PostgrestError = await getCurRound();

    if (typeof roundNum !== "number") {
      // It's a PostgrestError
      return { data: null, error: roundNum };
    }

    const minRound = roundNum < 6 ? 1 : roundNum - 5;

    const { data: games, error: gamesError } = await this.supabase
      .from("games")
      .select(
        "id, date, venue, complete, hteamid, ateamid, winnerteamid, round",
      )
      .eq("complete", 100)
      .eq("year", currentYear)
      .gte("round", minRound)
      .lt("round", roundNum)
      .order("date", { ascending: true });

    return { data: games, error: gamesError };
  }
}
