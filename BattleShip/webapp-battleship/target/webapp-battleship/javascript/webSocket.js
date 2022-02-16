/**
 * Structure of Messages exchanged on the web socket
 */
class Message {
    constructor(type, data, sender, receiver) {
        this.type = type; // Type of the message, explain the content of the message (or type of error)
        this.data = data; // Data contained in the message, can be an object
        this.sender = sender; // username of sender
        this.receiver = receiver; // username of receiver
    }
}

let webSocket = new Object;
if (!("WebSocket" in window)) {
    alert("Please change your browser because it don't support Battleship application");
}

function initWebSocket(username) {
    webSocket = new WebSocket("ws://172.18.0.47:8090/ws/battleship");
    webSocket.onopen = function (event) {
        //if(numReloads == 0) {
            console.log('Connected with the messages server');
            // At the beginning, send a message for registering the username
            webSocket.send(JSON.stringify(new Message("user_online", username, username, null)));
        //}
    };
    webSocket.onmessage = function (event) {
        console.log(event.data);
    }
    webSocket.onclose = function () {
        console.log('Disconnected by the messages server');
    };
}

function sendWebSocket(message) {
    let jsonMessage = JSON.stringify(message);
    webSocket.send(jsonMessage);
    console.log('Client send [' + jsonMessage + '] on the websocket');
}

function closeWebSocket() {
    webSocket.close();
    delete webSocket;
}

function waitForSocketConnection(socket, callback) {
    setTimeout(
        function () {
            if (socket.readyState === 1) {
                // Connection made
                if (callback != null){
                    callback();
                }
            }
            else {
                waitForSocketConnection(socket, callback);
            }
        }, 5 // millisecond
    );
}