class Ship {
    constructor(id, coordinates) {
        this.id = id;
        this.coordinates = coordinates;
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
            if (this.ships[i].id === id) {
                let countHit = 1;
                for (let j = 0; j < this.ships[i].coordinates.length; j++) {
                    let cellStatus = checkHitCell("your", this.ships[i].coordinates[j].row,
                        this.ships[i].coordinates[j].col);
                    if (cellStatus)
                        countHit++;
                }
                console.log("length: " + this.ships[i].coordinates.length);
                console.log("id " + this.ships[i].id);
                console.log("hit " + countHit);
                // check if the ship is sunk
                if (countHit === this.ships[i].coordinates.length){
                    this.ships.splice(this.ships[i].id, 1);
                    return countHit;
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