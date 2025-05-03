
// Last 5 wins, last 5 at venue 
type last5 = string[][]

// h2h
type h2h = number | null
type last5h2h = h2h[]

// AI models 
interface model {
    modelName: string,
    winTeam: string,
    confidence: number,
    margin: number,
    err: number,
}


// "id, date, venue, complete, hteamid, ateamid, winnerteamid, round"
// Upcoming games card
// gamesCard
interface gamesCard {
    id : number,
    date: string,
    venue: string, 
    hteamid: number, 
    ateamid: number, 
    round: number,
    last5 : last5,
    last5Venue : last5, 
    h2h : last5h2h
    models: model[]
}

