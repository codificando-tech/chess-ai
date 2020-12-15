function maxFun(boardData, depth) {
    if (depth === 0 || boardData.gameStatus != GameStatus.PLAYING) {
        boardData.setScore();
        return boardData;
    }
    let maxScore = -Infinity;
    let bestBoardData;
    let boardDataEval;
    let boardsData = generateBoardsData(boardData);

    for(let i = 0; i < boardsData.length; i++) {
        boardDataEval = minFun(boardsData[i], depth - 1);
        if (boardDataEval.score > maxScore) {
            maxScore = boardDataEval.score;
            bestBoardData = boardsData[i];
        }
    }
    bestBoardData.setScore();
    return bestBoardData;
}

function minFun(boardData, depth) {
    if (depth === 0 || boardData.gameStatus != GameStatus.PLAYING) {
        boardData.setScore();
        return boardData;
    }
    let minScore = +Infinity;
    let bestBoardData;
    let boardDataEval;
    let boardsData = generateBoardsData(boardData);

    for(let i = 0; i < boardsData.length; i++) {
        boardDataEval = maxFun(boardsData[i], depth - 1);
        if (boardDataEval.score < minScore) {
            minScore = boardDataEval.score;
            bestBoardData = boardsData[i];
        }
    }
    bestBoardData.setScore();
    return bestBoardData;
}