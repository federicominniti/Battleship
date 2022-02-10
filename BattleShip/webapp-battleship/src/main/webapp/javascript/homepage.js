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

    if (jsonString.type === 'battleship_request') {
        let container = document.getElementById("received-request");
        let table;
        if (container.getElementsByTagName("table")[0] != null){
            table = container.getElementsByTagName("table")[0];
        }else{
            table = document.createElement("table");
            container.appendChild(table);
        }

        /*for(let step = table.childNodes.length - 1; step > 1; step--) {
            let tr = table.childNodes.item(step);
            let td = tr.firstChild;

            // Duplicated request
            if(td.textContent === sender) {
                return;
            }
        }*/

        // Otherwise, the game request is added to the list
        let tr = document.createElement("tr");

        let tdText = document.createElement("td");
        tdText.textContent = sender;
        tr.appendChild(tdText);

        let button = document.createElement("button");
        button.textContent = "Accept";
        button.onclick = function() { acceptRequest(sender); }

        let tdButton = document.createElement("td");
        tdButton.appendChild(button);
        tr.appendChild(tdButton);

        table.appendChild(tr);
    }
    else if (jsonString.type === 'battleship_accepted') { // My opponent has accepted my game request
        // If my opponent accepted a game request for a game that is not
        startBattleship(sender);
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
            if(td.textContent !== username) {
                td.addEventListener("click", function () {
                    sendRequestForAGame(td.textContent);
                    removeOnClick(td);
                });
            }

            tr.appendChild(td);
            table.appendChild(tr);
            container.appendChild(table);
        }
    } else if(jsonString.type === 'remove_user_requests') {  // A precedent request is not still valid because a user might not be online anymore
        let container = document.getElementById("received-request");
        let table;
        if (container.getElementsByTagName("table")[0] != null) {
            table = container.getElementsByTagName("table")[0];

            for (let i = table.childNodes.length - 1; i > 1; i--) {
                let tr = table.childNodes.item(i);
                let td = tr.firstChild;
                if (td.textContent === jsonString.data) {
                    table.removeChild(tr);
                }
            }
        }
    } else if(jsonString.type === 'logged_sender_error'){
        alert("You are logged in from another device!")
        document.location.href = './../logout';
    }
};

function acceptRequest (opponent) {
    sendWebSocket(new Message('battleship_accepted', null, username, opponent));
    // We need to wait some milliseconds, otherwise there can be some problems
    setTimeout(
        function () {
                startBattleship(opponent);
        }, 800
    );
}

function sendRequestForAGame(possibleOpponent) {
    sendWebSocket(new Message('battleship_request', null, username, possibleOpponent))
}

function removeOnClick(element){
    element.removeEventListener("click", null);
    element.style.color = "orange";
}

function startBattleship(opponent){
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
