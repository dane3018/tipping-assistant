// game result string
export type gameResult = "W" | "L" | "D";

// Last 5 wins, last 5 at venue where each item is a teamID - 1
export type last5 = gameResult[][];

export type h2h = {
  result: gameResult;
  date: string;
};

// single list of game results in the perspective of the home team
// win, loss draw for the current home team of that upcoming game
export type last5h2h = h2h[];

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
export interface model {
  gameId: number;
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
  gameData: GameData;
  models: model[];
}

// Squiggle tips (models) datatype 
export type SquiggleModel = {
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
