// app/api/game-data/route.ts
import { createClient, PostgrestError } from "@supabase/supabase-js";
import { Database } from "../../../../database.types";
import { type } from "os";
import { currentYear } from "../../../utils/constants";
import { fetchAll, fetchSingleH2H } from "./fetcher";
import { GameData, gameResult } from "@/utils/types";

type CacheType = {
  gamesData: GameData[] | null;
  expires: number;
} | null;

let cache: CacheType = null;

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function GET() {
  // if (cache && cache.expires > Date.now()) {
  //   console.log("Query is cached, returning cached result")
  //   return Response.json(cache.gamesData);
  // }

  // const { data: last5, error: gamesError } = await getLast5();
  const { data: gamesData, error: gamesError } = await fetchAll();

  cache = {
    gamesData,
    expires: Date.now() + 1000 * 60 * 60, // 1 hour
  };
  const { data: h2h, error: h2hError } = await fetchSingleH2H(14, 4);
  if (gamesError) {
    return new Response(JSON.stringify({ error: gamesError.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ gamesData }), {
    status: 200,
  });
}


async function getH2H() {}
