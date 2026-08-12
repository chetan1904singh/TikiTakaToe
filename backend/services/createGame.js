import { boards } from "../data/boards.js";
import { generateBoard } from "../services/gemini.js";
import {startTimer,startGlobalTimer } from "../services/TimerManager.js";

//each room has diff board created here
//which contains data like turn,players
//games obj contains all that data

//game starts from here
//data=room
export async function createGame(io, games, data, player1, player2) {
    console.log(player1.user);
    let randomGrid;
        try {
            randomGrid = await generateBoard();
        } 
        catch (err) {
        console.error("Gemini failed:", err);
        
        randomGrid =boards[Math.floor(Math.random() * boards.length)];
        }
    
    games[data] = {
                board:Array(9).fill(""),
                grid:randomGrid,
                turn: "X",
                //turn timer
                turnTimeLeft: 20,
                turnTimer: null,

                // Global timer
                globalTimeLeft: 300,
                globalTimer: null,
                gameOver: false,
                
                usedPlayers: new Set(), //this games private usedPlayers
                players: [
        {
            socketId: player1.id,
            symbol: "X",
            name: player1.user.username
        },
        {
            socketId: player2.id,
            symbol: "O",
            name: player2.user.username
        }
    ],

            }
       
            // Tell Player X
            io.to(player1.id).emit("game_start", {
                
                room: data,
                board: games[data].board,
                grid:games[data].grid,
                turn: games[data].turn,
                symbol: "X",
                players: games[data].players,
                
            });

            // Tell Player O
            io.to(player2.id).emit("game_start", {
                room: data,
                board: games[data].board,
                grid:games[data].grid,
                turn: games[data].turn,
                symbol: "O",
                players: games[data].players
                
            });
            console.log("Emitting game_start");
            console.log(games[data].players);
            
//----------------Start timer when game starts
            startTimer(io, games, data);
            startGlobalTimer(io, games, data);
}

