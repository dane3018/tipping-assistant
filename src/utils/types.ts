// game result string
export type gameResult = "W" | "L" | "D";

// Last 5 wins, last 5 at venue where each item is a teamID - 1
export type last5 = gameResult[][];

// single list of game results in the perspective of the home team
// win, loss draw for the current home team of that upcoming game
export type last5h2h = gameResult[];


// an array of GameData will be returned from the game-data api route 
// it describes the data for an upcoming game to be used in the frontend
export interface GameData {
  id: number;
  date: string | null;
  venue: string;
  hteamid: number;
  ateamid: number;
  round: number;
  last5: last5;
  last5Venue: last5;
  h2h: last5h2h;
}

// AI models
interface model {
  modelName: string;
  winTeam: string;
  confidence: number;
  margin: number;
  err: number;
}

// "id, date, venue, complete, hteamid, ateamid, winnerteamid, round"
// Upcoming games card
// gamesCard
export interface GamesCard {
  gameData: GameData
  models: model[];
}
