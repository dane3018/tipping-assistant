// game result string
export type gameResult = "W" | "L" | "D";

// Last 5 wins, last 5 at venue where each item is a teamID - 1
export type last5 = gameResult[][];

// key is a gameID and value is the a list of game results
// in the POV of the home team, W, L or draw for the home team.
export type last5h2h = Map<number, gameResult[]>;

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
export interface gamesCard {
  id: number;
  date: string;
  venue: string;
  hteamid: number;
  ateamid: number;
  round: number;
  last5: last5;
  last5Venue: last5;
  h2h: last5h2h;
  models: model[];
}
