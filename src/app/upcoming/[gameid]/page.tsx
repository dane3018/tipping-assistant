
import { createClient } from '@/utils/supabase/server';
import { FC } from 'react';

interface PageProps {
  params: { gameid: string };
}



async function getFocusedH2H(gameid: number) {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('get_focused_h2h', { gameid: gameid })
    if (error || !data ) {
        console.error(error.message);
        return data
    }
    return data
}

export const GamePage: FC<PageProps> = async ({ params }) => {
  const gameid = parseInt( params.gameid)
  const focusedH2H = await getFocusedH2H(gameid);

  return (
    <div>
      <h1>Game ID: {gameid}</h1>
      {/* Fetch data for this game ID or render something */}
      <h2>Last head to head matches</h2>
      {focusedH2H?.map((game) => (
        <p>game number: {game.id}, hteam: {game.hteamid}, score: {game.hscore}, ateamid: {game.ateamid}, score: {game.ascore}, Winner: {game.winnerteamid ?? "Draw"}</p>
      ))}
    </div>
  );
};

export default GamePage;