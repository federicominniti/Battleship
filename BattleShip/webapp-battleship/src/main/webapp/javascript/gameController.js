//-------------------------WEB SOCKET -----------------------------

initWebSocket(loggedUser);
waitForSocketConnection(webSocket,function() {
    sendWebSocket(new Message("opponent_registration", opponent, loggedUser, null));
});

window.onunload = function () {
    surrender();
}
// RECEIVE
webSocket.onmessage = function (event) {
    let jsonString = JSON.parse(event.data);
    //let sender = jsonString.sender;

    if (jsonString.type === "chat_message") {
        acceptMessage(jsonString.data);
    } else {
        let coordinate;
        switch (jsonString.type) {
            case "ready":
                game.receivedRandom = parseInt(jsonString.data);
                if (game.myRandom !== 0){
                    if (parseInt(jsonString.data) < game.myRandom)
                        updateStatus("play");
                    else
                        updateStatus("idle");
                }
                break;
            case "shoot":
                coordinate = jsonString.data.split("-");
                let targetCellId = createId("your", coordinate[0], coordinate[1]);
                let shipId = document.getElementById(targetCellId).textContent;
                let message;
                if (shipId === "" || shipId === null) { // miss
                    message = new Message("miss", jsonString.data, loggedUser, opponent);
                    missCell("your", coordinate[0], coordinate[1]);
                    sendWebSocket(message);
                } else {    // hit or sunk
                    hitCell("your", coordinate[0], coordinate[1]);
                    let result = game.checkShoot(shipId);
                    console.log("game result: " + result);
                    if (typeof result === "string") {
                        message = new Message("hit", jsonString.data, loggedUser, opponent);
                    } else if (typeof result === "number") {
                        let info = jsonString.data.concat("_", result);
                        document.getElementById("place".concat(result)).textContent--;
                        message = new Message("sunk", info, loggedUser, opponent);
                    }
                    sendWebSocket(message);
                    checkEndGame("lose");
                }
                updateStatus("play");
                break;
            case "miss":
                coordinate = jsonString.data.split("-");
                missCell("enemy", coordinate[0], coordinate[1]);
                updateStatus("idle")
                break;
            case "hit":
                coordinate = jsonString.data.split("-");
                hitCell("enemy", coordinate[0], coordinate[1]);
                updateStatus("idle");
                break;
            case "sunk":
                let info = jsonString.data.split("_");
                document.getElementById("enemy".concat(info[1])).textContent--;
                coordinate = info[0].split("-");
                hitCell("enemy", coordinate[0], coordinate[1]);
                updateStatus("idle");
                checkEndGame("win");
                break;
            case "timeout":
                updateStatus("play");
                break;
            case "surrend":
                enemySurrender();
                break;
        }
    }
}

function sendReady() {
    document.getElementById("ready").disabled = true;
    document.getElementById("back").disabled = true;
    game.myRandom = getRandomInt(10000);
    let message = new Message("ready", game.myRandom, loggedUser, opponent);
    sendWebSocket(message);
    if (game.receivedRandom !==0) {
        if (game.receivedRandom < game.myRandom) {
            updateStatus("play");
        } else {
            updateStatus("idle");
        }
    } else
        updateStatus("idle");
}

// ---------------------------------GAME CONTROLLER-------------------
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
            disabledTable("your");
            return;
        case "idle":
            return;
        case "play":
            let coordiante = cellParser(id);
            let message = new Message("shoot", coordiante.row + "-" + coordiante.col, loggedUser, opponent);
            sendWebSocket(message);
            updateStatus("idle");
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
        cell.textContent = game.countShips + 1;
        if (cellClass === "cell green")
            break
        counter++;
    }
    let shipLen = parseInt(len) + 1;
    document.getElementById("place".concat(shipLen)).textContent++;
    let ship = new Ship(game.getShipId(), shipLen)
    game.addShip(ship);
    document.getElementById("back").disabled = false
    // clean orange (undo select with the green)
    undoSelect(cell.getAttribute("id"));
    cell.setAttribute("class", "cell navy");
    cell.setAttribute("onclick", null);
    checkReady()
}

function enemySurrender() {
    for (let i = 2; i <= 5; i++) {
        document.getElementById("enemy".concat(i)).textContent = 0;
    }
    checkEndGame("win");
}

function surrender() {
    for (let i = 2; i <= 5; i++) {
        document.getElementById("place".concat(i)).textContent = 0;
    }
    let message = new Message("surrend", null, loggedUser, opponent);
    sendWebSocket(message);
    checkEndGame("lose");
}

function checkEndGame(status) {
    let counter;
    for (let i = 2; i <= 5; i++) {
        if (status === "lose")
            counter = document.getElementById("place".concat(i)).textContent;
        else
            counter = document.getElementById("enemy".concat(i)).textContent;
        if (parseInt(counter) !== 0)
            return;
    }
    console.log("END GAME");
    closeWebSocket();
    let hiddenForm = document.createElement("form");
    hiddenForm.setAttribute('method',"post");
    hiddenForm.setAttribute('action',"endgame");

    let result = document.createElement("input");
    result.setAttribute('type',"text");
    result.setAttribute('name', "result");
    result.setAttribute('value', status);

    hiddenForm.appendChild(result);
    hiddenForm.style.visibility = "hidden";
    document.body.appendChild(hiddenForm);
    hiddenForm.submit();
}

function startTimer () {
    let time = document.getElementById("timer");
    time.textContent = game.turnTime;
    game.timeOut = setInterval(handleTimer, 1000, time);
}

function handleTimer(time) {
    time.textContent--;
    if (parseInt(time.textContent) <= 0) {
        updateStatus("idle");
        let message = new Message("timeout", null, loggedUser, opponent);
        sendWebSocket(message);
    }
}

function stopTimer(time) {
    time.textContent = "";
    clearInterval(game.timeOut);
}
// -------------------------UTILITY------------------------
// change the status of a cell
function hitCell(grid, row, col) {
    let cellId = createId(grid, row, col);
    let cell = document.getElementById(cellId);
    cell.setAttribute("class", "cell hit");
    cell.setAttribute("onclick", "null");
}

function missCell(grid, row, col) {
    let cellId = createId(grid, row, col);
    let cell = document.getElementById(cellId);
    cell.setAttribute("class", "cell miss");
    cell.setAttribute("onclick", "null");
}

// convert coordinates to id
function createId(grid, row, column) {
    return grid.concat("-", row, "-", column);
}

// remove all onclick events from the grid
function disabledTable(grid) {
    let cells = document.getElementsByClassName("cell std");
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].id.split("-")[0] === grid)
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
    document.getElementById("place".concat(ship.type)).textContent--;
    let cells = document.getElementsByClassName("cell");
    console.log(cells);
    for(let i = 0; i < cells.length; i++){
        if (cells[i].textContent == ship.id && cells[i].className !== "cell white"){
            cells[i].textContent = "";
            cells[i].setAttribute("class", "cell std");
            cells[i].setAttribute("onclick", "cellInteraction('" + cells[i].id + "')");
        }
    }
    document.getElementById("ready").disabled = true;
    enableTable();
    if (game.countShips === 0)
        document.getElementById("back").disabled = true;
}

// check if the user has inserted all ships
function checkReady() {
    for (let i = 2; i <= 5; i++) {
        let num = document.getElementById("place".concat(i)).textContent;
        if (parseInt(num) !== 5-i+1)
            return;
    }
    disabledTable("your");
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

function updateStatus(status) {
    game.gameStatus = status;
    let label = document.getElementById("phase");
    switch (game.gameStatus) {
        case "loading":
            label.textContent = "SET YOUR GRID";
            enableTable();
            disabledTable("enemy");
            break;
        case "play":
            label.textContent = "YOUR TURN";
            enableTable();
            disabledTable("your");
            startTimer();
            break;
        case "idle":
            label.textContent = "ENEMY TURN";
            stopTimer(document.getElementById("timer"));
            disabledTable("your");
            disabledTable("enemy");
            break;
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max) + 1;
}