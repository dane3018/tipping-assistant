// app/api/game-data/route.ts
import { createClient, PostgrestError } from "@supabase/supabase-js";
import { Database } from "../../../../database.types";
import { type } from "os";
import { currentYear } from "../../../utils/constants";
import { getLast5 } from "./last5";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function GET() {
  const { data: last5, error: gamesError } = await getLast5();

  if (gamesError) {
    return new Response(JSON.stringify({ error: gamesError.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ last5 }), {
    status: 200,
  });
}

export async function getCurRound() {
  const { data: round, error: roundError } = await supabase
    .from("settings")
    .select("value")
    .eq("id", "currentRound")
    .limit(1);

  if (roundError) {
    return roundError;
  }

  console.log(`round is ${round}`);

  const roundNum = +round[0].value;
  return roundNum;
}
