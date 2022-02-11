class Ship {
    constructor(id, coordinates) {
        this.id = id;
        this.coordinates = coordinates;
    }
}

// status -> loading, play, idle
class Game {
    constructor(loadTime, turnTime) {
        this.ships = [];
        this.countShips = 0;
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

    deleteShip() {
        this.countShips--;
        return this.ships.pop();
    }

    removeShip(id) {
        for (let i = 0; i < this.ships.length; i++) {
            if (this.ships[i].id == id){
                this.ships.splice(i, 1);
            }
        }
        this.checkLostGame()
    }

    getShipId() {
        return ++this.countShips;
    }

    checkLostGame() {

    }

}