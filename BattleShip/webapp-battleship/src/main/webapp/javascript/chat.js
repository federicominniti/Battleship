
/**
    Send a chat-message to the opponent through the WebSocket
 */
function sendMessage() {

    let input = document.getElementById("text");
    let btn = document.getElementById("sendButton");

    let msg = input.value;
    if (msg === "")
        return;

    btn.disabled = true;
    let msgForErlang = new Message("chat_message", msg, loggedUser , opponent);
    sendWebSocket(msgForErlang);
    createMessageElem(msg, true);
    input.value = "";
}

/**
    build the div of the message making difference between user message and opponent message
 */
function createMessageElem(message, isMsgMine) {
    let msgDiv = document.createElement("div");
    if (isMsgMine)
        msgDiv.className = "user-msg";
    else
        msgDiv.className = "opponent-msg";

    msgDiv.textContent = message;
    let container = document.getElementById("list-message");
    container.appendChild(msgDiv);
}

