export function startTimer(io, games, room) {
    const game = games[room];

    if (!game) return;

    // Stop previous turn timer
    clearInterval(game.turnTimer);

    // Every new turn gets 20 seconds
    game.turnTimeLeft = 20;

    io.to(room).emit("turn_timer_update", game.turnTimeLeft);

    game.turnTimer = setInterval(() => {
        const currentGame = games[room];

        if (!currentGame) {
            clearInterval(game.turnTimer);
            return;
        }

        // If the entire game has already ended
        if (currentGame.gameOver) {
            clearInterval(currentGame.turnTimer);
            return;
        }

        currentGame.turnTimeLeft--;

        io.to(room).emit(
            "turn_timer_update",
            currentGame.turnTimeLeft
        );

        // Turn timer expired
        if (currentGame.turnTimeLeft <= 0) {

            clearInterval(currentGame.turnTimer);

            // Change turn
            currentGame.turn =
                currentGame.turn === "X" ? "O" : "X";

            io.to(room).emit("board_update", {
                board: currentGame.board,
                answers: currentGame.answers,
                turn: currentGame.turn
            });

            // Start timer for new player
            startTimer(io, games, room);
        }

    }, 1000);
}


export function startGlobalTimer(io, games, room) {
    const game = games[room];

    if (!game) return;

    // Stop an existing global timer
    clearInterval(game.globalTimer);

    // 3 minutes = 180 seconds
    game.globalTimeLeft = 300;

    io.to(room).emit(
        "global_timer_update",
        game.globalTimeLeft
    );

    game.globalTimer = setInterval(() => {
        const currentGame = games[room];

        if (!currentGame) {
            clearInterval(game.globalTimer);
            return;
        }

        // Game already finished
        if (currentGame.gameOver) {
            clearInterval(currentGame.globalTimer);
            return;
        }

        currentGame.globalTimeLeft--;

        io.to(room).emit(
            "global_timer_update",
            currentGame.globalTimeLeft
        );

        // 3 minutes are over
        if (currentGame.globalTimeLeft <= 0) {

            clearInterval(currentGame.globalTimer);

            // Stop turn timer too
            clearInterval(currentGame.turnTimer);

            currentGame.gameOver = true;

            io.to(room).emit("game_over", {
                reason: "time_up",
                board: currentGame.board,
                answers: currentGame.answers
            });
        }

    }, 1000);
}