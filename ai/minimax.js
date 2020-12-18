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
            bestBoardData.score = boardDataEval.score;
        }
    }
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
            bestBoardData.score = boardDataEval.score;
        }
    }
    return bestBoardData;
}

function minimaxFunAB(boardData, isMax, alpha, beta, depth) {
    if (depth === 0 || boardData.gameStatus != GameStatus.PLAYING) {
        boardData.setScore();
        return boardData;
    }
    let boardsData = generateBoardsData(boardData);
    let bestBoardData;
    let boardDataEval;
    let targetFunction;
    let targetScore;

    if (isMax) {
        targetFunction = biggerThan;
        targetScore = -Infinity;
    } else {
        targetFunction = lessThan;
        targetScore = +Infinity;
    }
        
    for(let i = 0; i < boardsData.length; i++) {
        boardDataEval = minimaxFunAB(boardsData[i], !isMax, alpha, beta, depth - 1);

        if (targetFunction(boardDataEval.score, targetScore)) {
            targetScore = boardDataEval.score;
            bestBoardData = boardsData[i];
            bestBoardData.score = boardDataEval.score;

        } else {
            if (boardDataEval.score == targetScore && (Math.floor(Math.random() * 10) < 2)) {
                // 20% chance to choose random move when score is equal to targetScore
                bestBoardData = boardsData[i];
                bestBoardData.score = boardDataEval.score;
            }
        }

        if (isMax) {
            alpha = Math.max(boardDataEval.score, alpha);
        }
        else {
            beta = Math.min(boardDataEval.score, beta);
        }

        if (beta <= alpha) {
            return bestBoardData
        }
    }

    return bestBoardData;
}

function lessThan(a, b) {
    return a < b;
}

function biggerThan(a, b) {
    return a > b;
}