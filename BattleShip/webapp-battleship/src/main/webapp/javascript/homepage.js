//WEBSOCKET INITIALIZATION

initWebSocket(username);

// Publish the user oline and available for a new game
//waitForSocketConnection(ws, function(){
//    sendWebSocket(new Message("user_online", null , username, null));
//});

//------------------------

//@Override from webSocket.js
ws.onmessage = function (event){
    var jsonString = JSON.parse(event.data);
    var sender = jsonString.sender;
    console.log("Message received from the message server");

    if (jsonString.type === 'game_request') {

        let table = document.getElementById("gameRequests");
        for(let step = table.childNodes.length - 1; step > 1; step--) {
            let tr = table.childNodes.item(step);
            let td = tr.firstChild;

            // Duplicated request
            if(td.textContent === sender) {
                return;
            }
        }

        // Otherwise, the game request is added to the list
        let tr = document.createElement("tr");

        let tdText = document.createElement("td");
        tdText.textContent = sender;
        tr.appendChild(tdText);

        let button = document.createElement("button");
        button.textContent = "Accept";
        button.onclick = function() { sendGameRequestAccepted(sender); }

        let tdButton = document.createElement("td");
        tdButton.appendChild(button);
        tr.appendChild(tdButton);

        table.appendChild(tr);
    }
    else if (jsonString.type === 'game_request_accepted') { // My opponent has accepted my game request
        // If my opponent accepted a game request for a game that is not
        startBattleship(username, sender);
    } else if(jsonString.type === 'updated_online_users') // The list of online users has changed
    {
        let list = jsonString.data;
        let container = document.getElementById("online-users");
        if (container.getElementsByTagName("table")[0] != null){
            let oldTable = container.getElementsByTagName("table")[0];
            oldTable.remove();
        }
        let table = document.createElement("table");

        for (let i = 0; i < list.length; i++) {
            let tr = document.createElement("tr");
            let td = document.createElement("td");
            td.textContent = list[i];
            td.addEventListener("click", function () {
                sendGameRequest(td.textContent);
            })

            tr.appendChild(td);
            table.appendChild(tr);
            container.appendChild(table);
        }
    } else if(jsonString.type === 'remove_requests') {  // A precedent request is not still valid because a user might not be online anymore
        let table = document.getElementById("gameRequests");

        for(let i = table.childNodes.length - 1; i > 1; i--) {
            let tr = table.childNodes.item(i);
            let td = tr.firstChild;
            if(td.textContent === jsonString.data) {
                table.removeChild(tr);
            }
        }
    } else if(jsonString.type === 'logged_sender_error'){
        alert("You are logged in from another device!")
        document.location.href = './../logout';
    }
};

function sendRequestForAGame(possibleOpponent) {
    sendWebSocket(new Message('game_request', null, username, possibleOpponent))
}
