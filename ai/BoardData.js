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
        let teamScore = {[TEAM.WHITE]: 0, [TEAM.BLACK]: 0};

        Object.values(TEAM).forEach(team => {
            this.pieces[team].forEach(piece => {
                if (piece.taken) {
                    teamScore[team] += piece.value;
                }

                if(piece instanceof King) {
                    if (piece.didCastling) {
                        teamScore[team] -= 1;
                    } else if (piece.firstMovement == false) {
                        teamScore[team] += 1;
                    }

                    if (piece.isInCheck && this.countPossibleMovements(team) == 0) {
                        teamScore[team] += piece.value;
                    }
                }
            });
        })


        score -= teamScore[TEAM.WHITE];
        score += teamScore[TEAM.BLACK];
        
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
        this.lastMove = {origin: origin, destination: destination};
        this.handleKingCheck(board)
    }

    handleKingCheck(board) {
        Object.values(TEAM).forEach(team => {
            let king = board.getKing(team);
            if(board.isInCheck(king)){
                king.isInCheck = true;
            } else {
                king.isInCheck = false;
            }
        });
    }

    countPossibleMovements(team) {
        let countMoves = 0;
        let pieces;
        let board = new Board();
        this.mapperToBoard(board);

        pieces = this.pieces[team].filter(piece => {if (!piece.taken) return true})

        pieces.forEach(piece => {
            countMoves += piece.generateMoves(board).length;
        });

        return countMoves;
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