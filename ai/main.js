document.addEventListener("gamePass", ia);

let aiColor = TEAM.BLACK;

function ia() {
    if (board.turn == aiColor) {
        setTimeout(handleBoard, 10, board);
    }
}

function handleBoard(board) {
    let virtualBoard = new Board();
    let boardData = new BoardData();
    boardData.mapperBoard(board);
    boardData = boardData.clone();
    boardData.mapperToBoard(virtualBoard);
    board.turn = null;
    let moves = generateMoves(virtualBoard, aiColor);

    board.turn = aiColor;
}

function generateMoves(board, team) {
    return board.pieces[team].map(piece => {return {origin: piece.matrixPosition, destinations: piece.generateMoves(board)}})
}

function movePiece(origin, destination, board) {
    let piece = board.getPieceAt(origin.x, origin.y);

    if (board.isPieceAt(destination.x, destination.y)) {
        let enemyPiece = board.getPieceAt(destination.x, destination.y);
        if (piece.isEnemy(piece)) {
            enemyPiece.die();
        }
    }
    piece.matrixPosition = createVector(destination.x, destination.y);
    piece.firstMovement = false;
    board.pass();
}

function moveAndScore(moves, boardData) {
    let virtualBoard = new Board();
    boardData.mapperToBoard(virtualBoard);

    moves.forEach(piece => {
        piece.destinations.forEach(destination => {
            boardData.mapperToBoard(virtualBoard);
            movePiece(piece.origin, destination, board);
        })
    });
}