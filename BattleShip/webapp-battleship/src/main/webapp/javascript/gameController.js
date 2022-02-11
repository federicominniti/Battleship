function createGrid(owner, target) {
    let grid = document.getElementById(target);
    for (let i = 0; i < 11; i++) {
        for (let j = 0; j < 11; j++) {
            let cell = document.createElement("div");
            if (i === 0 && j === 0) {  // angle
                cell.setAttribute("class", "cell white");
            } else if (j === 0) {    // letter
                let char = String.fromCharCode('A'.charCodeAt() + i-1);
                cell.setAttribute("class", "cell white");
                cell.textContent = char;
            } else if (i === 0) {    // number
                cell.setAttribute("class", "cell white");
                cell.textContent = j;
            } else {
                let id = owner.concat("-", i, "-", j);
                cell.setAttribute("class", "cell std");
                cell.setAttribute("id", id);
                cell.setAttribute("onclick", "cellInteraction('" + id + "')")
            }
            grid.appendChild(cell);
        }
    }
}

function controlPlacement(len, direction, target) {
    let good = true;
    let cell;
    for(let j = 1; j <= len; j++) {
        if (direction === "left") {
            cell = document.getElementById(createId(target.grid, target.row - j, target.col));
            if (cell === null || cell.getAttribute("class") !== "cell std") {
                good = false;
                break;
            }
        } else if (direction === "right") {
            cell = document.getElementById(createId(target.grid, target.row + j, target.col));
            if (cell === null || cell.getAttribute("class") !== "cell std") {
                good = false;
                break;
            }
        } else if (direction === "top") {
            cell = document.getElementById(createId(target.grid, target.row, target.col + j));
            if (cell === null || cell.getAttribute("class") !== "cell std") {
                good = false;
                break;
            }
        } else if (direction === "bottom") {
            cell = document.getElementById(createId(target.grid, target.row, target.col - j));
            if (cell === null || cell.getAttribute("class") !== "cell std") {
                good = false;
                break;
            }
        }
    }
    if (good) {
        cell.setAttribute("class", "cell orange");
        cell.setAttribute("onclick", "chooseShip('" + cell.getAttribute("id") +
            "', '" + direction + "', '" + len + "')");
    }
}


function cellInteraction(id) {
    switch (game.gameStatus){
        case "loading":
            // take candidate
            let target = cellParser(id);
            let startCell = document.getElementById(id);
            // check if it is a free cell in my ground
            if (startCell.getAttribute("class") !== "cell std" || target.grid === "enemy")
                return;
            for (let i = 4; i >= 1; i--) {
                let num = document.getElementById("place".concat(i+1)).textContent;
                if (num < (5-i)) {
                    controlPlacement(i, "left", target);
                    controlPlacement(i, "right", target);
                    controlPlacement(i, "top", target);
                    controlPlacement(i, "bottom", target);
                }
            }
            startCell.setAttribute("class", "cell green");
            startCell.setAttribute("onclick", "undoSelect('" + id + "')");
            disabledTable();
            return;
        case "idle":
            return;
        case "play":
            return;
        default:
            return;
    }
}


function undoSelect(id) {
    let target = cellParser(id);
    let startCell = document.getElementById(id);
    let cell;
    let idCell;
    for (let i = 4; i >= 1; i--) {
        cell = document.getElementById(createId(target.grid, target.row - i, target.col));
        if (cell !== null && cell.getAttribute("class") === "cell orange") {
            idCell = cell.getAttribute("id");
            cell.setAttribute("onclick", "cellInteraction('" + idCell + "')")
            cell.setAttribute("class", "cell std");
        }
        cell = document.getElementById(createId(target.grid, target.row + i, target.col));
        if (cell !== null && cell.getAttribute("class") === "cell orange") {
            idCell = cell.getAttribute("id");
            cell.setAttribute("onclick", "cellInteraction('" + idCell + "')")
            cell.setAttribute("class", "cell std");
        }
        cell = document.getElementById(createId(target.grid, target.row, target.col + i));
        if (cell !== null && cell.getAttribute("class") === "cell orange") {
            idCell = cell.getAttribute("id");
            cell.setAttribute("onclick", "cellInteraction('" + idCell + "')")
            cell.setAttribute("class", "cell std");
        }
        cell = document.getElementById(createId(target.grid, target.row, target.col - i));
        if (cell !== null && cell.getAttribute("class") === "cell orange") {
            idCell = cell.getAttribute("id");
            cell.setAttribute("onclick", "cellInteraction('" + idCell + "')")
            cell.setAttribute("class", "cell std");
        }
    }
    startCell.setAttribute("onclick", "cellInteraction('" + id + "')");
    startCell.setAttribute("class", "cell std");
    enableTable();
}


function chooseShip(id, direction, len) {
    //change navy
    let coordinatesArray = [];
    let target = cellParser(id);
    let counter = 0;
    let cell = document.getElementById(id);
    while (true) {
        switch (direction) {
            case "left":
                cell = document.getElementById(createId(target.grid, target.row + counter, target.col));
                break;
            case "right":
                cell = document.getElementById(createId(target.grid, target.row - counter, target.col));
                break;
            case "top":
                cell = document.getElementById(createId(target.grid, target.row, target.col - counter));
                break;
            case "bottom":
                cell = document.getElementById(createId(target.grid, target.row, target.col + counter));
                break;
        }
        let cellClass = cell.getAttribute("class");
        let currCoordinate = cellParser(cell.getAttribute("id"));
        coordinatesArray.push({
            row: currCoordinate.row,
            col: currCoordinate.col
        });
        cell.setAttribute("class", "cell navy");
        cell.setAttribute("onclick", null);
        cell.textContent = game.countShips;
        if (cellClass === "cell green")
            break
        counter++;
    }
    let shipLen = parseInt(len) + 1;
    document.getElementById("place".concat(shipLen)).textContent++;
    let ship = new Ship(game.getShipId(), coordinatesArray)
    game.addShip(ship);
    document.getElementById("back").disabled = false
    // clean orange (undo select with the green)
    undoSelect(cell.getAttribute("id"));
    cell.setAttribute("class", "cell navy");
    cell.setAttribute("onclick", null);
    checkReady()
}

// -------------------------UTILITY------------------------

// convert coordinates to id
function createId(grid, row, column) {
    return grid.concat("-", row, "-", column);
}

// remove all onclick events from the grid
function disabledTable() {
    let cells = document.getElementsByClassName("cell std");
    for (let i = 0; i < cells.length; i++) {
        cells[i].setAttribute("onclick", "null");
    }
}

// restore all onclick events od the cells in the grid
function enableTable() {
    let cells = document.getElementsByClassName("cell std");
    for (let i = 0; i < cells.length; i++) {
        let id = cells[i].getAttribute("id");
        cells[i].setAttribute("onclick", "null");
        cells[i].setAttribute("onclick", "cellInteraction('" + id + "')");
    }
}

// remove the last ship insert
function goBack() {
    let ship = game.deleteShip();
    document.getElementById("place".concat(ship.coordinates.length)).textContent--;
    for(let i = 0; i < ship.coordinates.length; i++){
        let idCell = createId("your", ship.coordinates[i].row, ship.coordinates[i].col)
        let cell = document.getElementById(idCell);
        cell.setAttribute("onclick", "cellInteraction('" + idCell + "')")
        cell.setAttribute("class", "cell std");
        cell.textContent = "";
    }
    delete ship;
    document.getElementById("ready").disabled = true;
    enableTable();
    if (game.countShips === 0)
        document.getElementById("back").disabled = true;
}

// check if the user has inserted all ships
function checkReady() {
    for (let i = 2; i <= 5; i++) {
        let num = document.getElementById("place".concat(i)).textContent;
        if (num != 5-i+1)
            return;
    }
    disabledTable();
    document.getElementById("ready").disabled = false;
}

function cellParser(id) {
    let vect = id.split("-");
    return {
        grid: vect[0],
        row: parseInt(vect[1]),
        col: parseInt(vect[2])
    };
}