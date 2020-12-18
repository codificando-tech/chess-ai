const GameStatus = {
    PLAYING: "playing",
    WHITE_WIN: "white_win",
    BLACK_WIN: "black_win",
    STALEMATE: "stalemate",
    DRAW: "draw",
}


class Board {
    constructor() {
        this.pieces = {
            [TEAM.WHITE]: [],
            [TEAM.BLACK]: [],
        };
        this.setupPieces();
        this.initEvents();
        this.turn = TEAM.WHITE;
        this.nullPiece = new Piece(null, null, null);
        this.gameStatus = GameStatus.PLAYING;
        
    }

    initEvents() {
        this.gamePassEvent = document.createEvent('Event');
        this.gamePassEvent.initEvent('gamePass', true, true);
    }

    setupPieces() {
        this.pieces[TEAM.BLACK].push(new King(4, 0, TEAM.BLACK, this));
        this.pieces[TEAM.BLACK].push(new Queen(3, 0, TEAM.BLACK, this));
        this.pieces[TEAM.BLACK].push(new Rook(0, 0, TEAM.BLACK, this));
        this.pieces[TEAM.BLACK].push(new Rook(7, 0, TEAM.BLACK, this));
        this.pieces[TEAM.BLACK].push(new Knight(6, 0, TEAM.BLACK, this));
        this.pieces[TEAM.BLACK].push(new Knight(1, 0, TEAM.BLACK, this));
        this.pieces[TEAM.BLACK].push(new Bishop(2, 0, TEAM.BLACK, this));
        this.pieces[TEAM.BLACK].push(new Bishop(5, 0, TEAM.BLACK, this));
        for (var i = 0; i < 8; i++) {
            this.pieces[TEAM.BLACK].push(new Pawn(i, 1, TEAM.BLACK, this));
        }

        this.pieces[TEAM.WHITE].push(new King(4, 7, TEAM.WHITE, this));
        this.pieces[TEAM.WHITE].push(new Queen(3, 7, TEAM.WHITE, this));
        this.pieces[TEAM.WHITE].push(new Rook(0, 7, TEAM.WHITE, this));
        this.pieces[TEAM.WHITE].push(new Rook(7, 7, TEAM.WHITE, this));
        this.pieces[TEAM.WHITE].push(new Knight(6, 7, TEAM.WHITE, this));
        this.pieces[TEAM.WHITE].push(new Knight(1, 7, TEAM.WHITE, this));
        this.pieces[TEAM.WHITE].push(new Bishop(2, 7, TEAM.WHITE, this));
        this.pieces[TEAM.WHITE].push(new Bishop(5, 7, TEAM.WHITE, this));
        for (var i = 0; i < 8; i++) {
            this.pieces[TEAM.WHITE].push(new Pawn(i, 6, TEAM.WHITE, this));
        }
    }

    countPossibleMovements(team) {
        let countMoves = 0;
        let pieces = [];

        pieces = this.pieces[team].filter(piece => {if (!piece.taken) return true})

        pieces.forEach(piece => {
            countMoves += piece.generateMoves(this).length;
        });

        return countMoves;
    }

    show() {
        this.pieces[TEAM.WHITE].forEach(piece => piece.show());
        this.pieces[TEAM.BLACK].forEach(piece => piece.show());
        this.showGameOver();
    }

    showGameOver() {
        let message = "";
        switch(this.gameStatus) {
            case GameStatus.PLAYING: return;
            case GameStatus.WHITE_WIN:
                message = "Fim de jogo! As brancas vencem.";
                break;
            case GameStatus.BLACK_WIN:
                message = "Fim de jogo! As Pretas vencem.";
                break;
            case GameStatus.STALEMATE:
                message =  "Empate! Rei afogado.";
                break;
            case GameStatus.DRAW:
                message = "Empate!";
                break;
            default:
                message = "Não";
                break;
        }
        setTimeout(() => {window.alert(message)}, 1)
        restartGame();
    }

    pass() {
        this.turn = this.getEnemyTeam(this.turn);
        this.handleEnPassant();
        this.handleKingCheck();
        this.handleGameStatus();
        document.dispatchEvent(this.gamePassEvent);
    }

    handleEnPassant() {
        this.pieces[this.turn].forEach(piece => {
            if (piece instanceof Pawn) {
                piece.enPassant = false;
            }
        });
    }

    handleGameStatus() {
        if (this.countPossibleMovements(this.turn) == 0) {
            if (board.getKing(this.turn).isInCheck) {
                this.checkMate(this.turn);
            } else {
                this.gameStatus = GameStatus.STALEMATE;
            }
        }
    }

    handleKingCheck() {
        Object.values(TEAM).forEach(team => {
            let king = this.getKing(team);
            if(this.isInCheck(king)){
                // checkSound.play();
                king.isInCheck = true;
            } else {
                king.isInCheck = false;
            }
        });
    }

    checkMate(loserTeam) {
        switch (loserTeam) {
            case TEAM.BLACK:
                this.gameStatus = GameStatus.WHITE_WIN;
                break;
            case TEAM.WHITE:
                this.gameStatus = GameStatus.BLACK_WIN;
                break;
        }
    }

    getEnemyTeam(team) {
        switch(team) {
            case TEAM.WHITE:
                return TEAM.BLACK;

            case TEAM.BLACK:
                return TEAM.WHITE;
        }
    }

    canDoCastling(king, rook) {
        let canDoCastlingKing = !this.isInCheck(king) && king.firstMovement;
        let canDoCastlingRook = rook.firstMovement;
        if(canDoCastlingKing && canDoCastlingRook && rook instanceof Rook){
            return true;
        }
        return false;
    }

    isInCheck(king) {
        let result = false;
        this.pieces[this.getEnemyTeam(king.team)].forEach((piece) => {
            if (!piece.taken && piece.canMove(king.matrixPosition.x, king.matrixPosition.y, board)) {
                result = true;
                return;
            }
        });
        return result;
    }

    isPieceAt(x, y) {
        let pieceFound = false
        this.pieces[TEAM.WHITE].map(piece => {
            if(piece.matrixPosition.x === x && piece.matrixPosition.y === y && !piece.taken){pieceFound = true}
        })
        this.pieces[TEAM.BLACK].map(piece => {
            if(piece.matrixPosition.x === x && piece.matrixPosition.y === y && !piece.taken){pieceFound = true}
        })
        return pieceFound
    }

    isEnemyPieceAt(x, y, piece) {
        if (this.isPieceAt(x, y)){
            return this.getPieceAt(x, y).team !== piece.team
        } else {
            return false
        }
    }

    getPieceAt(x, y) {
        for (var i = 0; i < this.pieces[TEAM.WHITE].length; i++) {
            if (!this.pieces[TEAM.WHITE][i].taken && this.pieces[TEAM.WHITE][i].isMatrixPositionAt(x, y)) {
                return this.pieces[TEAM.WHITE][i];
            }
        }
        for (var i = 0; i < this.pieces[TEAM.BLACK].length; i++) {
            if (!this.pieces[TEAM.BLACK][i].taken && this.pieces[TEAM.BLACK][i].isMatrixPositionAt(x, y)) {
                return this.pieces[TEAM.BLACK][i];
            }
        }
        
        return null;
    }

    getKing(team) {
        return this.pieces[team][0];
    }

    promotion(pawn, clazz) {
        if (pawn instanceof Pawn) {
            this.pieces[pawn.team].push(new clazz(pawn.matrixPosition.x, pawn.matrixPosition.y, pawn.team));
            pawn.die()
        }
    }
}