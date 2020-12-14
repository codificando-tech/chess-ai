class BoardData {
    constructor(pieces, score, turn, gameStatus) {
        this.pieces = pieces;
        this.score = score;
        this.turn = turn;
        this.gameStatus = gameStatus;
    }

    mapperBoard(board) {
        this.pieces = board.pieces;
        this.score = board.score;
        this.turn = board.turn;
        this.gameStatus = board.gameStatus;
    }

    mapperToBoard(board) {
        board.pieces = this.pieces;
        board.score = this.score;
        board.turn = this.turn;
        board.gameStatus = this.gameStatus;
    }

    clone() {
        let piecesClone = {...this.pieces};
        piecesClone[TEAM.WHITE] = piecesClone[TEAM.WHITE].map(piece => piece.clone());
        piecesClone[TEAM.BLACK] = piecesClone[TEAM.BLACK].map(piece => piece.clone());
        return new BoardData(piecesClone, this.score, this.turn, this.gameStatus);
    }
}