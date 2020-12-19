document.addEventListener("gamePass", ia);

let aiColor = TEAM.BLACK;

function ia() {
    if (board.turn == aiColor) {
        setTimeout(handleBoard, 500, board);
    }
}

async function handleBoard(board) {
    let boardData = new BoardData();
    boardData.mapperBoard(board);
    boardData = boardData.clone();
    let bestBoardData;

    let depthLevel = +document.getElementById("depth-level-input").value;

    if (board.countPossibleMovements(board.turn) > 0) {
        if (board.turn == TEAM.BLACK) {
            bestBoardData = minimaxFunAB(boardData, isMax=false, -Infinity, +Infinity, depthLevel);
        } else if (board.turn == TEAM.WHITE) {
            bestBoardData = minimaxFunAB(boardData, isMax=true, -Infinity, +Infinity, depthLevel);
        }
        board.getPieceAt(bestBoardData.lastMove.origin.x, bestBoardData.lastMove.origin.y).move(bestBoardData.lastMove.destination.x, bestBoardData.lastMove.destination.y, board)
    }
}

function generateMoves(board, team) {
    let alivePieces = board.pieces[team].filter(pieces => !pieces.taken)
    moves = alivePieces.map(piece => {
        return {origin: piece.matrixPosition, destinations: piece.generateMoves(board)}
    });

    moves = moves.filter(move => {return move.destinations.length > 0})

    return moves
}


function generateBoardsData(boardData) {
    let newBoardData;
    let boardsData = [];
    let virtualBoard = new Board();
    boardData.clone().mapperToBoard(virtualBoard);

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