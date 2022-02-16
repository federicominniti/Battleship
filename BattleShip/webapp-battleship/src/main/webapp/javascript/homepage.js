//WEBSOCKET INITIALIZATION
initWebSocket(username);

/**
    handle the message received by the server or other users
 */
webSocket.onmessage = function (event) {
    let jsonString = JSON.parse(event.data);
    let sender = jsonString.sender;
    let container;

    switch (jsonString.type) {
        case "battleship_request":
            container = document.getElementById("received-request");
            if (document.getElementById(sender) !== null)
                break;
            container.appendChild(battleRequestCard(sender))
            break;
        case "battleship_accepted":
            startBattleship(sender);
            break;
        case "updated_online_users":
            let list = jsonString.data;
            container = document.getElementById("online-users");
            while (container.firstChild) {
                container.removeChild(container.lastChild);
            }
            let header = document.createElement("cite");
            header.textContent = "Online Player";
            container.appendChild(header);
            for (let i = 0; i < list.length; i++) {
                if (list[i] === username)
                    continue;
                container.appendChild(onlineUserCard(list[i]));
            }
            break;
        case "remove_user_requests":
            container = document.getElementById("received-request");
            let request = document.getElementById(jsonString.data);
            container.removeChild(request);
            break;
        case "logged_sender_error":
            alert("You are logged in from another device!");
            closeWebSocket();
            document.location.href = './../logout';
            break;
        case "decline_battle_request":
            document.getElementById("send-".concat(jsonString.sender)).disabled = false;
            break;
    }
}

function battleRequestCard(opponent) {
    let div = document.createElement("div");
    div.setAttribute("id", opponent);
    div.setAttribute("class", "game-request");

    let nameLabel = document.createElement("label");
    nameLabel.textContent = opponent + " challenge you!";

    let acceptButton = document.createElement("button");
    acceptButton.setAttribute("class", "accept");
    acceptButton.textContent = "ACCEPT";
    acceptButton.onclick = () => {
        let container = document.getElementById("received-request");
        while (container.firstChild) {
            container.removeChild(container.lastChild);
        }
        acceptRequest(opponent);
    };

    let declineButton = document.createElement("button");
    declineButton.setAttribute("class", "decline");
    declineButton.textContent = "DECLINE";
    declineButton.onclick = () => {
        sendWebSocket(new Message("decline_battle_request", null, username, opponent));
        let container = document.getElementById("received-request");
        let request = document.getElementById(opponent);
        container.removeChild(request);
    };

    div.appendChild(nameLabel);
    div.appendChild(acceptButton);
    div.appendChild(declineButton);
    return div;
}

function onlineUserCard(opponent) {
    let div = document.createElement("div");
    div.setAttribute("class", "player");

    let nameLabel = document.createElement("label");
    nameLabel.textContent = opponent;

    let sendButton = document.createElement("button");
    sendButton.setAttribute("id", "send-".concat(opponent));
    sendButton.textContent = "SEND INVITE";
    sendButton.onclick = () => {
        sendButton.disabled = true;
        sendWebSocket(new Message('battleship_request', null, username, opponent));
    };

    div.appendChild(nameLabel);
    div.appendChild(sendButton);
    return div;
}

function acceptRequest (opponent) {
    sendWebSocket(new Message('battleship_accepted', null, username, opponent));
    // We need to wait some milliseconds, otherwise there can be some problems
    setTimeout(function () { startBattleship(opponent); }, 800);
}

function startBattleship(opponent){
    closeWebSocket();
    let hiddenForm = document.createElement("form");
    hiddenForm.setAttribute('method',"post");
    hiddenForm.setAttribute('action',"game");

    let opponentUsername = document.createElement("input");
    opponentUsername.setAttribute('type',"text");
    opponentUsername.setAttribute('name', "opponentUsername");
    opponentUsername.setAttribute('value', opponent);

    hiddenForm.appendChild(opponentUsername);
    hiddenForm.style.visibility = "hidden";
    document.body.appendChild(hiddenForm);
    hiddenForm.submit();
}

function refreshPage(){
    let opponentRequests = window.sessionStorage.getItem("opponentRequests");
    if (opponentRequests !== null && opponentRequests !== "") {
        let users = opponentRequests.split('-');
        if (users[0] !== "") {
            let container = document.getElementById("received-request");
            for (let i = 0; i < users.length; i++) {
                container.appendChild(battleRequestCard(users[i]));
            }
        }
    }
}

/**
    save the game request in case of refresh of the page
 */
function saveDataAndQuit() {
    let users = "";
    let divUsers = document.getElementsByClassName("game-request");
    if (divUsers != null) {
        for (let i = 0; i < divUsers.length; i++) {
            if (i === 0)
                users = divUsers[i].id;
            else
                users = users + "-" + divUsers[i].id;
            window.sessionStorage.setItem("opponentRequests", users);
        }
    }
    closeWebSocket();
}

/**
    Ask the WebSocket Server (erlang) to find a random opponent
 */
function searchRandomOpponent(){
    sendWebSocket(new Message('random_opponent', null, username, null));
    let overlay = document.getElementById("overlay");
    overlay.style.display = "block";
}

