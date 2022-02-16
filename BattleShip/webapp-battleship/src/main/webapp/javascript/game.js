/**
    class to handle the ships' game logic
 */
class Ship {
    constructor(id, length) {
        this.id = id;
        this.type = length;
        this.life = length;
    }

    checkSunk() {
        this.life--;
        return this.life === 0;
    }
}

/**
    class to handle the game logic and status
 */
class Game {

    constructor(turnTime) {
        this.ships = [];
        this.countShips = 0;
        this.turnTime = turnTime;
        this.gameStatus = "loading";
        this.myRandom = 0;
        this.receivedRandom = 0;
        this.timeOut = null;
        // this.maxIdle = null;         possible control on special case where the opponent crash while loading the game
    }

    addShip(ship) {
        this.ships.push(ship);
    }

    deleteShip() {
        this.countShips--;
        return this.ships.pop();
    }

    checkShoot(id) {
        for (let i = 0; i < this.ships.length; i++) {
            if (this.ships[i].id === parseInt(id)) {
                let shipSunk = this.ships[i].checkSunk();
                if (shipSunk){
                    let len = this.ships[i].type;
                    this.ships.splice(i, 1);
                    return len;
                }
                else
                    return "hit";
            }
        }
    }

    getShipId() {
        return ++this.countShips;
    }
}