class Ship {
    constructor(game, life, id) {
        this.id = id;
        this.life = life;
        this.game = game;
    }

    hit() {
        this.life--;
        if (this.life == 0) {
            game.removeShip(this.id);
        }
    }


}

// status -> loading, play, idle

class Game {
    constructor(loadTime, turnTime) {
        this.ships = [];
        this.loadTime = loadTime;
        this.turnTime = turnTime;
        this.gameStatus = "loading"
    }

    setGameStatus(status) {
        this.gameStatus = status;
    }

    addShip(ship) {
        this.ships.push(ship);
    }

    removeShip(id) {
        for (var i = 0; i < this.ships.length; i++) {
            if (this.ships[i].id == id){
                this.ships.splice(i, 1);
            }
        }
        this.checkLostGame()
    }

    checkLostGame() {

    }

}