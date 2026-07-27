import { boards } from "../data/boards.js";
import {startTimer} from "../services/timer.js"

//each room has diff board created here
//which contains data like turn,players
//games obj contains all that data

//game starts from here
//data=room
export function createGame(io, games, data, player1, player2) {
    
    const randomGrid =
    boards[Math.floor(Math.random()*boards.length)];
    
    games[data] = {
                board:Array(9).fill(""),
                grid:randomGrid,
                turn: "X",
                players: [
                    {socketId: player1.id,symbol: "X"},
                    {socketId: player2.id,symbol: "O"}
                ],

                timer: null,
                timeLeft: 15
            }
       
            // Tell Player X
            io.to(player1.id).emit("game_start", {
                
                room: data,
                board: games[data].board,
                grid:games[data].grid,
                turn: games[data].turn,
                symbol: "X"
            });

            // Tell Player O
            io.to(player2.id).emit("game_start", {
                room: data,
                board: games[data].board,
                grid:games[data].grid,
                turn: games[data].turn,
                symbol: "O"
            });
            console.log("Emitting game_start");
            
//----------------Start timer when game starts
            startTimer(io, games, data);
}

