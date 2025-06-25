// app/api/game-data/route.ts
import { createClient } from "@supabase/supabase-js";
import { Database } from "../../../../database.types";
import { fetchAll } from "./fetcher";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function GET() {
  const { data: gamesData, error: gamesError } = await fetchAll();
  if (gamesError) {
    return new Response(JSON.stringify({ error: gamesError.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ gamesData }), {
    status: 200,
  });
}

