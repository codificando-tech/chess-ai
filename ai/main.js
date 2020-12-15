document.addEventListener("gamePass", ia);

let aiColor = TEAM.BLACK;

function ia() {
    if (board.turn == aiColor) {
        setTimeout(handleBoard, 10, board);
    }
}

function handleBoard(board) {
    let boardData = new BoardData();
    boardData.mapperBoard(board);
    boardData = boardData.clone();
    board.turn = null;
    let bestBoardData = minFun(boardData, 3);
    board.turn = aiColor;
    board.getPieceAt(bestBoardData.lastMove.origin.x, bestBoardData.lastMove.origin.y).move(bestBoardData.lastMove.destination.x, bestBoardData.lastMove.destination.y, board)
}

function generateMoves(board, team) {
    return board.pieces[team].map(piece => {return {origin: piece.matrixPosition, destinations: piece.generateMoves(board)}})
}


function generateBoardsData(boardData) {
    let newBoardData;
    let boardsData = [];
    let virtualBoard = new Board();
    boardData.mapperToBoard(virtualBoard);

    let moves = generateMoves(virtualBoard, boardData.turn);

    moves.forEach(piece => {
        piece.destinations.forEach(destination => {
            newBoardData = boardData.clone();
            newBoardData.mapperToBoard(virtualBoard);
            newBoardData.movePiece(piece.origin, destination, virtualBoard);
            newBoardData.turn = virtualBoard.getEnemyTeam(newBoardData.turn);
            boardsData.push(newBoardData);
        });
    });
    if (boardsData.length == 0) {
        checkMateBoard = boardData.clone();
        checkMateBoard.mapperToBoard(virtualBoard);
        virtualBoard.getKing(checkMateBoard.turn).die();
        return [checkMateBoard];
    }
    return boardsData;
}