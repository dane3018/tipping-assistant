"use client"
import { useState } from "react"

type Team = {
  id: number
  name: string
  ladderPosition: number
  lastFive: string[]
}

type Game = {
  id: number
  date: string
  venue: string
  home_team: Team
  away_team: Team
}

type Props = {
  games: Game[]
}

export default function GameList({ games }: Props) {
  return (
    <div className="p-4 space-y-6">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  )
}

function GameCard({ game }: { game: Game }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-gray-300 rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{game.home_team.name}</h2>
        <span className="text-sm text-gray-500">{game.date}</span>
        <h2 className="text-lg font-semibold">{game.away_team.name}</h2>
      </div>

      <div className="mt-4 bg-gray-100 rounded p-3">
        <button
          className="text-blue-600 font-medium hover:underline"
          onClick={() => setOpen(!open)}
        >
          {open ? "Hide Stats" : "Show Stats"}
        </button>

        {open && (
          <div className="mt-3 space-y-4 text-sm text-gray-700">
            <div>
              <strong>{game.home_team.name}</strong>
              <ul className="ml-4 list-disc">
                <li>Ladder Position: {game.home_team.ladderPosition}</li>
                <li>Last 5: {game.home_team.lastFive.join(", ")}</li>
              </ul>
            </div>
            <div>
              <strong>{game.away_team.name}</strong>
              <ul className="ml-4 list-disc">
                <li>Ladder Position: {game.away_team.ladderPosition}</li>
                <li>Last 5: {game.away_team.lastFive.join(", ")}</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
