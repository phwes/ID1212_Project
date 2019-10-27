class Game {
    constructor(player1, player2) {
        this._players = [player1, player2];
        this._choices = [null, null];

        this._sendToPlayers({msg: 'Game has started, good luck!'});

        this._players.forEach((player, index) => {
            player.on('choice', (choice) => {
                this._onTurn(index, choice);
            });
        });
    }

    _sendToPlayer(playerIndex, data) {
        this._players[playerIndex].emit('message', {
            msg: data.msg,
            result: data.result,
            choice: data.choice
        });
    }

    _sendToPlayers(data) {
        this._players.forEach((p) => {
            p.emit('message', {
                msg: data.msg,
                result: data.result,
                choice: data.data
            });
        });
    }

    _onTurn(playerIndex, choice) {
        this._choices[playerIndex] = choice;
        this._sendToPlayer(playerIndex, {msg: `You selected ${choice}...`});
        
        this._checkGameOver();
    }

    _checkGameOver() {
        const choices = this._choices;

        if(choices[0] && choices[1]) {
            this._getGameResult();
            this._choices = [null, null];
        }
    }

    _decodeTurn(choice) {
        switch(choice) {
            case 'Rock':
                return 0;
            case 'Scissor':
                return 1;
            case 'Paper':
                return 2;
            default:
                throw new Error(`Could not decode choice ${choice}`);
        }
    }

    _getGameResult() {
        const player1Choice = this._decodeTurn(this._choices[0]);
        const player2Choice = this._decodeTurn(this._choices[1]);
        const results = (player2Choice - player1Choice + 3) % 3;

        switch(results) {
            case 0:
                this._sendDrawMessage();
                break;
            case 1:
                this._sendVictoryMessage([this._players[0], this._choices[0]], [this._players[1], this._choices[1]]);
                break;
            case 2:
                this._sendVictoryMessage([this._players[1] , this._choices[1]], [this._players[0], this._choices[0]]);
                break;
            default:
                throw new Error(`Could not decode game results ${results}`);
        }
    }

    _sendVictoryMessage(winner, loser) {
        winner[0].emit('message', {
            msg: `${this._choices.join(' beats ')}. You win! 👍`,
            result: 'win',
            choice: winner[1]
        });
        loser[0].emit('message', {
            msg: `${this._choices.join(' loses to ')}. You lose. 👎`,
            result: 'lose',
            choice: loser[1]
        });
    }

    _sendDrawMessage() {
        this._sendToPlayers({
            msg: 'Its a draw. 😑', 
            result: 'draw',
            choice: this._choices[0]});
    }
}

module.exports = Game;