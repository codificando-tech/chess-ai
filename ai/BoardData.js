class BoardData {
    constructor(pieces, score, turn, gameStatus) {
        this.pieces = pieces;
        this.score = 0;
        this.turn = turn;
        this.gameStatus = gameStatus;
        this.lastMove = null;
    }

    mapperBoard(board) {
        this.pieces = board.pieces;
        this.score = 0;
        this.turn = board.turn;
        this.gameStatus = board.gameStatus;
    }

    mapperToBoard(board) {
        board.pieces = this.pieces;
        board.score = this.score;
        board.turn = this.turn;
        board.gameStatus = this.gameStatus;
    }

    setScore() {
        let score = 0;
        this.pieces[TEAM.WHITE].forEach(piece => {
            if (piece.taken) {
                score -= piece.value;
            }
        });
        this.pieces[TEAM.BLACK].forEach(piece => {
            if (piece.taken) {
                score += piece.value;
            }
        });
        this.score = score;
    }

    movePiece(origin, destination, board) {
        let piece = board.getPieceAt(origin.x, origin.y);
    
        if (board.isPieceAt(destination.x, destination.y)) {
            let enemyPiece = board.getPieceAt(destination.x, destination.y);
            if (piece.isEnemy(enemyPiece)) {
                enemyPiece.die();
            }
        }
        piece.matrixPosition = createVector(destination.x, destination.y);
        piece.firstMovement = false;
        board.turn = board.getEnemyTeam(board.turn);
        this.lastMove = {origin: origin, destination: destination};
    }

    clone() {
        let piecesClone = {...this.pieces};
        piecesClone[TEAM.WHITE] = piecesClone[TEAM.WHITE].map(piece => piece.clone());
        piecesClone[TEAM.BLACK] = piecesClone[TEAM.BLACK].map(piece => piece.clone());
        let boardDataClone = new BoardData(piecesClone, this.score, this.turn, this.gameStatus);
        boardDataClone.lastMove = this.lastMove;
        return boardDataClone;
    }
}