export function startTimer(io, games, room) {

    const game = games[room];
    if (!game) return;

    clearInterval(game.timer);

    game.timeLeft = 15;

    io.to(room).emit("timer_update", game.timeLeft);

    game.timer = setInterval(() => {

        const game = games[room];

        if (!game) {
            clearInterval(game.timer);
            return;
        }

        game.timeLeft--;

        io.to(room).emit("timer_update", game.timeLeft);

        if (game.timeLeft <= 0) {

            clearInterval(game.timer);

            game.turn = game.turn === "X" ? "O" : "X";

            io.to(room).emit("board_update", {
                board: game.board,
                answers: game.answers,
                turn: game.turn
            });

            startTimer(io, games, room);

        }

    }, 1000);

}