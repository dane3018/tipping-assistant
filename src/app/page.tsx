"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import React, { useEffect, useState } from "react";
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
    modelName: "Squiggle",
    winTeam: "Collingoowd",
    confidence: 52.1,
    margin: 7.01,
    err: 3.3,
  },
  {
    modelName: "The Arc",
    winTeam: "Collingoowd",
    confidence: 54.7,
    margin: 4.01,
    err: 3.1,
  },
  {
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


// modelName: string;
//   winTeam: string;
//   confidence: number;
//   margin: number;
//   err: number;

export default function Page() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [games, setGames] = React.useState<GameData[]>([]);
  const [models, setModels] = useState<GameTip[]>([]);

  const shortmodels : model[]  = models.map((model) => {
    return {modelName: model.source,
      gameId: model.gameid,
      confidence: +model.confidence,
      margin: +model.margin,
      err: +model.err,
      winTeam: model.tip
    }
  })

  useEffect(() => {
    fetch("/api/game-data")
      .then((res) => res.json())
      .then((data) => {
        setGames(data.gamesData);
      });

    fetch("https://api.squiggle.com.au/?q=tips;year=2025;round=6")
    .then((res) => res.json())
    .then((data) => {
      setModels(data.tips);
    })
  }, []);

  return games.map((game, i) => (
    <GameCard key={i} gameData={game} models={shortmodels.filter((g) => g.gameId === game.id).splice(0,5)}></GameCard>
  ));
}
