import { createClient } from "@supabase/supabase-js";
import { Database } from "../../../../database.types";
import { NextResponse } from "next/server";
import { currentYear } from "@/utils/constants";
import { SquiggleModel } from "@/utils/types";
import { fetchModels } from "./fetcher";

const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SERVICE_ROLE_KEY!,
);

export async function GET() {
    const { data: models, error: modelErr } = await supabase.from("models")
        .select("*");

    if (modelErr) {
        return new NextResponse(JSON.stringify({ modelErr }));
    }

    return new NextResponse(JSON.stringify({ models }), {
        status: 200,
    });
}

// Handler for POST requests
export async function POST(request: Request) {
    // Authorization
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    // Parse incoming JSON
    let round;
    try {
        const body = await request.json();
        round = body.round;
        if (!round) {
            return new Response(
                JSON.stringify({ error: "Missing round parameter" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }
    } catch (err) {
        return new Response(JSON.stringify({ error: "Invalid JSON" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    // Fetch model data from public API
    let modelData: SquiggleModel[];
    try {
        modelData = await fetchModels(round);
        if (!modelData || modelData.length === 0) {
            return new Response(
                JSON.stringify({ error: "Model data is undefined or empty" }),
                {
                    status: 502,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }
    } catch (err) {
        return new Response(
            JSON.stringify({ error: "Failed to fetch model data" }),
            {
                status: 502,
                headers: { "Content-Type": "application/json" },
            },
        );
    }

    // Update Supabase table
      try {
        const supabaseModels = transformModels(modelData);

        const { error } = await supabase
          .from('models')
          .upsert(supabaseModels); // upsert or insert as needed

        if (error) {
            console.error("Error updating database in /models: "+error.message)
            throw error
        }
      } catch (err) {
        return new Response(JSON.stringify({ error: 'Failed to update database' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

    return new Response(
        JSON.stringify({ success: true}),
        {
            status: 200,
            headers: { "Content-Type": "application/json" },
        },
    );
}

type ModelInsert = Database['public']['Tables']['models']['Insert']

function transformModels(models: SquiggleModel[]): ModelInsert[] {
    return models.map((model) => ({
        ateamid: model.ateamid,
          confidence: Number(model.confidence),
          err: Number(model.err),
          gameid: model.gameid,
          hteamid: model.hteamid,
          round: model.round,
          source: model.source,
          sourceid: model.sourceid,
          tipteamid: model.tipteamid,
    }));
}
