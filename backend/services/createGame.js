
//each room has diff board created here
//which contains data like turn,players
export function createGame(io, games, data, player1, player2) {
  games[data] = {
                board: Array(9).fill(""),
                turn: "X",
                players: [
                    {socketId: player1.id,symbol: "X"},
                    {socketId: player2.id,symbol: "O"}
                ]
            }
       
            // Tell Player X
            io.to(player1.id).emit("game_start", {
                
                room: data,
                board: games[data].board,
                turn: games[data].turn,
                symbol: "X"
            });

            // Tell Player O
            io.to(player2.id).emit("game_start", {
                room: data,
                board: games[data].board,
                turn: games[data].turn,
                symbol: "O"
            });
            console.log("Emitting game_start");
}

