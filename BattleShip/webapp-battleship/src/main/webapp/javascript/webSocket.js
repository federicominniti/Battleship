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

var ws = new Object;
if (!("WebSocket" in window)) {
    alert("Please change your browser because it don't support Battleship application");
}

function initWebSocket(username) {
    ws = new WebSocket("ws://localhost:8090/ws/battleship");
    ws.onopen = function (event) {
        console.log('Connected with the messages server');
        // At the beginning, send a message for registering the username
        ws.send(JSON.stringify(new Message("user_online", username, username, null)));
    };
    ws.onmessage = function (event) {
        console.log(event.data);
    }
    ws.onclose = function () {
        console.log('Disconnected by the messages server');
    };
}

function sendWebSocket(message) {
    let jsonMessage = JSON.stringify(message);
    ws.send(jsonMessage);
    console.log('Client send [' + jsonMessage + '] on the websocket');
}

function closeWebSocket() {
    ws.close();
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