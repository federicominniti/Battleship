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

// status -> loading, play, idle
class Game {


    constructor(turnTime) {
        this.ships = [];
        this.countShips = 0;
        this.turnTime = turnTime;
        this.gameStatus = "loading";
        this.myRandom = 0;
        this.receivedRandom = 0;
        this.timeOut = null;
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
            // find the target ship
            // console.log(typeof  id, typeof this.ships[i].id)
            if (this.ships[i].id === parseInt(id)) {
                let shipSunk = this.ships[i].checkSunk();
                // check if the ship is sunk
                if (shipSunk){
                    let len = this.ships[i].type;
                    this.ships.splice(this.ships[i].id, 1);
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