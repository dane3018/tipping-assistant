// app/games/round-6/page.tsx

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const teamMap = new Map<number, string>([
  [1, "Adelaide Crows"],
  [2, "Brisbane Lions"],
  [3, "Carlton, Blues"],
  [4, "Collingwood Magpies"],
  [5, "Essendon Bombers"],
  [6, "Fremantle Dockers"],
  [7, "Geelong Cats"],
  [8, "Gold Coast Suns"],
  [9, "GWS Giants"],
  [10, "Hawthorn Hawks"],
  [11, "Melbourne"],
  [12, "North Melbourne Kangaroos"],
  [13, "Port Adelaide Power"],
  [14, "Richmond Tigers"],
  [15, "St Kilda Saints"],
  [16, "Sydney Swans"],
  [17, "West Coast Eagles"],
  [18, "Western Bulldogs"],
]);

// type Game = {
//   id: number
//   home_team: string
//   away_team: string
//   venue: string
//   round: number
//   year: number
//   localtime: string // or Date, depending on your schema
// }

type Game = {
  id: number;
  date: Date;
  venue: string;
  ateamid: number;
  hteamid: number;
  away_team: {
    id: number;
    name: string;
  };
  home_team: {
    id: number;
    name: string;
  };
};

export default function Round6Games() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      //   const { data, error } = await supabase
      //     .from('games')
      //     .select('*')
      //     .eq('round', 6)
      //     .eq('year', 2025)
      const { data, error } = await supabase
        .from("games")
        .select(
          `
            id,
            date,
            venue,
            ateamid,
            hteamid,
            away_team:ateamid (
            id,
            name
            ),
            home_team:hteamid (
            id,
            name
            )
        `,
        )
        .eq("round", 6)
        .eq("year", 2025)
        .order("date", { ascending: true });

      if (error) {
        console.error("Error fetching games:", error);
      } else {
        setGames(data || []);
      }

      setLoading(false);
    };

    fetchGames();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Round 6 Games (2025)</h1>
      {games.length === 0 ? (
        <p>No games found.</p>
      ) : (
        <ul className="space-y-2">
          {games.map((game) => (
            <li key={game.id} className="border p-3 rounded shadow">
              <strong>{game.home_team.name}</strong> vs{" "}
              <strong>{game.away_team.name}</strong>
              <br />
              Venue: {game.venue}
              <br />
              Start Time: {new Date(game.date).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
