


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
                cell.setAttribute("class", "cell");
                cell.setAttribute("id", id);
                cell.setAttribute("onclick", "cellInteraction('" + id + "')")
            }
            grid.appendChild(cell);
        }
    }
}

function cellParser(id) {
    let vect = id.split("-");
    return {
        grid: vect[0],
        row: parseInt(vect[1]),
        col: parseInt(vect[2])
    };
}

function createId(grid, row, column) {
    return grid.concat("-", row, "-", column);
}

function disabledTable() {
    let cells = document.getElementsByClassName("cell");
    for (let i = 0; i < cells.length; i++) {
        cells[i].setAttribute("onclick", "null");
    }
}

function enableTable() {
    let cells = document.getElementsByClassName("cell");
    for (let i = 0; i < cells.length; i++) {
        let id = cells[i].getAttribute("id");
        cells[i].setAttribute("onclick", "null");
        cells[i].setAttribute("onclick", "cellInteraction('" + id + "')")
    }
}

function controlPlacement(len, direction, target) {
    let good = true;
    let cell;
    for(let j = 1; j <= len; j++) {
        if (direction === "left") {
            cell = document.getElementById(createId(target.grid, target.row - j, target.col));
            if (cell === null || cell.getAttribute("class") !== "cell") {
                good = false;
                break;
            }
        } else if (direction === "right") {
            cell = document.getElementById(createId(target.grid, target.row + j, target.col));
            if (cell === null || cell.getAttribute("class") !== "cell") {
                good = false;
                break;
            }
        } else if (direction === "top") {
            cell = document.getElementById(createId(target.grid, target.row, target.col + j));
            if (cell === null || cell.getAttribute("class") !== "cell") {
                good = false;
                break;
            }
        } else if (direction === "bottom") {
            cell = document.getElementById(createId(target.grid, target.row, target.col - j));
            if (cell === null || cell.getAttribute("class") !== "cell") {
                good = false;
                break;
            }
        }
    }
    if (good) {
        cell.setAttribute("class", "cell orange");
        cell.setAttribute("onclick", "confirm('" + direction + "', '" + len + "')");
    }
}

function cellInteraction(id) {
    switch (game.gameStatus){
        case "loading":
            // take candidate
            let target = cellParser(id);
            let startCell = document.getElementById(id);
            // check if it is a free cell in my ground
            if (startCell.getAttribute("class") !== "cell" || target.grid === "enemy")
                return;
            for (let i = 4; i >= 1; i--) {
                let num = document.getElementById("place".concat(i+1)).textContent;
                if (num < i) {
                    controlPlacement(i, "left", target);
                    controlPlacement(i, "right", target);
                    controlPlacement(i, "top", target);
                    controlPlacement(i, "bottom", target);
                }
            }
            startCell.setAttribute("class", "cell green");
            startCell.setAttribute("onclick", "undoSelect('" + id + "')")
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
    for (let i = 4; i >= 1; i--) {
        cell = document.getElementById(createId(target.grid, target.row - j, target.col));
        if (cell === null || cell.getAttribute("class") !== "cell") {
            good = false;
            break;
        } else if (direction === "right") {
            cell = document.getElementById(createId(target.grid, target.row + j, target.col));
            if (cell === null || cell.getAttribute("class") !== "cell") {
                good = false;
                break;
            }
        } else if (direction === "top") {
            cell = document.getElementById(createId(target.grid, target.row, target.col + j));
            if (cell === null || cell.getAttribute("class") !== "cell") {
                good = false;
                break;
            }
        } else if (direction === "bottom") {
            cell = document.getElementById(createId(target.grid, target.row, target.col - j));
            if (cell === null || cell.getAttribute("class") !== "cell") {
                good = false;
                break;
            }
        }
    }

}


