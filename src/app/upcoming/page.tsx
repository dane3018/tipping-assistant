import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Ghost } from "lucide-react";
import HeadToHead from "@/components/headToHead";
import Last5 from "@/components/last5";
import Models from "@/components/Models";
import { GameData, GamesCard, model } from "@/utils/types";
import GameCard from "@/components/GameCard";

const mockGames = [
  {
    id: 1,
    date: "2025-04-18T19:50:00Z",
    venue: "MCG",
    home_team: {
      id: 1,
      name: "Richmond",
      ladderPosition: 6,
      lastFive: ["W", "L", "W", "W", "L"],
    },
    away_team: {
      id: 2,
      name: "Carlton",
      ladderPosition: 3,
      lastFive: ["W", "W", "W", "L", "W"],
    },
  },
];

const mockModels = [
  {
    gameId: 0,
    modelName: "Squiggle",
    winTeam: "Collingoowd",
    confidence: 52.1,
    margin: 7.01,
    err: 3.3,
  },
  {
    gameId: 0,
    modelName: "The Arc",
    winTeam: "Collingoowd",
    confidence: 54.7,
    margin: 4.01,
    err: 3.1,
  },
  {
    gameId: 0,
    modelName: "Matter of Stats",
    winTeam: "Richmond",
    confidence: 50.1,
    margin: 2.01,
    err: 3.6,
  },
];

interface GameTip {
  updated: string;
  gameid: number;
  sourceid: number;
  source: string;
  ateam: string;
  hteam: string;
  hmargin: string;
  ateamid: number;
  hteamid: number;
  tipteamid: number;
  margin: string;
  hconfidence: string;
  err: string;
  tip: string;
  date: string;
  year: number;
  round: number;
  bits: string;
  venue: string;
  confidence: string;
  correct: number;
}

// This is a Server Component

type GamesResponse =
  | {
      success: true;
      games: GameData[];
    }
  | {
      success: false;
      error: string;
    };

export async function fetchGamesData(): Promise<GamesResponse> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/game-data`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) {
      const errorBody = await res.text();
      return {
        success: false,
        error: `Failed to fetch games: ${res.status} ${res.statusText} - ${errorBody}`,
      };
    }

    const data = await res.json();

    if (!data?.gamesData || !Array.isArray(data.gamesData)) {
      return {
        success: false,
        error: "Invalid data structure returned from API",
      };
    }

    return {
      success: true,
      games: data.gamesData,
    };
  } catch (error: any) {
    console.error("Error in fetchGamesData:", error.message || error);
    return {
      success: false,
      error: "Could not load games data. Please try again later.",
    };
  }
}

async function fetchModels(): Promise<GameTip[]> {
  const res = await fetch(
    "https://api.squiggle.com.au/?q=tips;year=2025;round=6",
    {
      cache: "no-store",
    },
  );
  const data = await res.json();
  return data.tips;
}

function transformTips(models: GameTip[]): model[] {
  return models.map((model) => ({
    modelName: model.source,
    gameId: model.gameid,
    confidence: +model.confidence,
    margin: +model.margin,
    err: +model.err,
    winTeam: model.tip,
  }));
}

export default async function Page() {
  // const [games, models] = await Promise.all([fetchGamesData(), fetchModels()]);
  const gamesResponse = await fetchGamesData();

  // const shortmodels = transformTips(models);
  // console.log(models)

  return gamesResponse.success ? (
    <>
      {gamesResponse.games.map((game, i) => (
        <GameCard
          key={i}
          gameData={game}
          // models={shortmodels.filter((g) => g.gameId === game.id).slice(0, 5)}
          models={mockModels}
        />
      ))}
    </>
  ) : (
    <p>An error has occurred: {gamesResponse.error}</p>
  );
}