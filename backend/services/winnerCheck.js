function checkWinner(board) {

    const winPatterns = [

        [0,1,2],
        [3,4,5],
        [6,7,8],

        [0,3,6],
        [1,4,7],
        [2,5,8],

        [0,4,8],
        [2,4,6]

    ];
    
    for (const pattern of winPatterns) {

        const [a,b,c] = pattern;

        if (board[a] && board[a] === board[b] && board[b] === board[c]) {
            return board[a];
        }
    }
    //check for draw
    let c=0;
    for(let i=0;i<9;i++){
          if(board[i])c++;
    }
    if(c==9)return 'Draw';

    return null;

}
export default checkWinner;