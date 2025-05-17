"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Ghost } from "lucide-react";
import HeadToHead from "@/components/headToHead";
import Last5 from "@/components/last5";
import Models from "@/components/Models";
import { GameData, GamesCard } from "@/utils/types";
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

export default function Page() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [games, setGames] = React.useState<GameData[]>([]);

  useEffect(() => {
    fetch("/api/game-data")
      .then((res) => res.json())
      .then((data) => {
        setGames(data.gamesData);
      });
  }, []);

  return (
    games.map((game, i) => (
      <GameCard 
      key={i}
       gameData={game} 
       models={[]}
      ></GameCard>
    ))
  );
}
