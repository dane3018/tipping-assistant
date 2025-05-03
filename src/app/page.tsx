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
  const [games, setGames] = React.useState<string[][]>();

  useEffect(() => {
    fetch("/api/game-data")
      .then((res) => res.json())
      .then((data) => {
        
        setGames(data.last5)
        console.log(data)
      })
  }, []);

  return (
    <div className="flex border border-gray-300 rounded-lg shadow-md p-4 flex-col justify-between m-8">
      <h2>M.C.G</h2>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Richmond</h2>
        <span className="text-sm text-gray-500">12th April</span>
        <h2 className="text-lg font-semibold">Collingwood</h2>
      </div>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant={"ghost"} size={"default"}>
            <span>More stats</span>
            <ChevronsUpDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="">
            <Last5
              hteamWins={games? games[13] : ["L", "L", "L", "L", "L"]}
              ateamWins={games? games[3] : ["L", "L", "L", "L", "L"]}
              title="Last 5 matches"
            ></Last5>
            <Last5
              hteamWins={["L", "L", "L", "L", "L"]}
              ateamWins={["L", "L", "L", "L", "L"]}
              title="Last 5 at M.C.G"
            ></Last5>
            <HeadToHead
              hteamName="Collingwood"
              ateamName="Richmond"
              h2h={[true, false, true, true, true]}
            ></HeadToHead>
            <Models models={mockModels}></Models>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
