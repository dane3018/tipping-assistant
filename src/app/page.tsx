"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import GameList from "./GameCard"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible"
import React from "react"
import { Button } from "@/components/ui/button"
import { ChevronsUpDown, Ghost } from "lucide-react"

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
]

export default function Page() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (

    <div className="flex border border-gray-300 rounded-lg shadow-md p-4 flex-col justify-between m-8">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Richmond</h2>
        <span className="text-sm text-gray-500">12th April</span>
        <h2 className="text-lg font-semibold">Collingwood</h2>
        </div>
    
    <Collapsible 
      open={isOpen}
      onOpenChange={setIsOpen}
      >
        <CollapsibleTrigger asChild>
        <Button variant={"ghost"} size={"default"}>
        <span>More stats</span>
        <ChevronsUpDown className="h-4 w-4" />
        
        </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
        <div className="">
          <div className="rounded-lg shadow-md border-2 my-2">
            <h2>Last 5 matches</h2>
            <ol>
              <li>Richmond</li>
              <li>Collingwood</li>
              <li>Richmond</li>
              <li>Richmond</li>
              <li>Richmond</li>
            </ol>
          </div>
          <div className="rounded-lg shadow-md border-2 my-2">
            <h2>Last 5 head to head matches </h2>
            
          </div>
        </div>
        </CollapsibleContent>
    </Collapsible>

  </div>

  )
  
  
}