import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { FC } from "react";

interface PageProps {
  params: { gameid: string };
}

async function getFocusedH2H(gameid: number) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_focused_h2h", {
    gameid: gameid,
  });
  if (error || !data) {
    console.error(error.message);
    return data;
  }
  return data;
}

async function getGame(gameid: number) {
    const supabase = await createClient();
    const data =  await supabase.from("games").select("*").eq("id", gameid).single()
    return data;
}

export default async function GamePage({ params }: { params: { gameid: string } }) {
  const { gameid } = params;
  const gameidNum = parseInt(gameid);
  const {data: game, error } = await getGame(gameidNum)
  const focusedH2H = await getFocusedH2H(gameidNum);

  return (
    <div>
      <h1>Game ID: {gameid}</h1>
      {/* Fetch data for this game ID or render something */}
      <h2>Last head to head matches</h2>
      {focusedH2H?.map((game) => (
        <p>
          game number: {game.id}, hteam: {game.hteamid}, score: {game.hscore},
          ateamid: {game.ateamid}, score: {game.ascore}, Winner:{" "}
          {game.winnerteamid ?? "Draw"}
        </p>
      ))}
    </div>
  );
};

