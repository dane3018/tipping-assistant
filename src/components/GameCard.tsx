"use client";
import { useState, useEffect } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { GamesCard } from "@/utils/types";
import { idToTeam, teamNameShort, teamToImgPath } from "@/utils/constants";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "./ui/button";
import Last5 from "./last5";
import HeadToHead from "./headToHead";
import Models from "./Models";

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

export default function GameCard(props: GamesCard) {
  const [isOpen, setIsOpen] = useState(false);
  const [games, setGames] = useState<string[][]>();
  const gameData = props.gameData;
  const models = props.models;
  const hteamShort = teamNameShort[gameData.hteamid - 1];
  const ateamShort = teamNameShort[gameData.ateamid - 1];
  const hteamName = idToTeam[gameData.hteamid - 1];
  const ateamName = idToTeam[gameData.ateamid - 1];
  const date = new Date(gameData.date!);
  return (
    <div className="flex border border-gray-300 rounded-lg shadow-md p-4 flex-col justify-between m-8">
      <h2>{gameData.venue}</h2>
      <div className="flex justify-between items-center">
        <div className="flex-col">
          <img
            src={teamToImgPath(gameData.hteamid)}
            alt={hteamShort}
            className="w-18 h-18 object-contain"
          ></img>
          <h2 className="text-lg font-semibold">{hteamShort}</h2>
        </div>

        <span className="text-sm text-gray-500">{date.toDateString()}</span>
        <div className="flex-col">
          <img
            src={teamToImgPath(gameData.ateamid)}
            alt={ateamShort}
            className="w-18 h-18 object-contain"
          ></img>
          <h2 className="text-lg font-semibold">{ateamShort}</h2>
        </div>
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
              hteamWins={gameData.last5[0]}
              ateamWins={gameData.last5[1]}
              title="Last 5 matches"
            ></Last5>
            <Last5
              hteamWins={gameData.last5Venue[0]}
              ateamWins={gameData.last5Venue[1]}
              title={`Last 5 at ${gameData.venue}`}
            ></Last5>
            <HeadToHead
              hteamid={gameData.hteamid}
              ateamid={gameData.ateamid}
              h2h={gameData.h2h}
            ></HeadToHead>
            <Models models={props.models}></Models>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
