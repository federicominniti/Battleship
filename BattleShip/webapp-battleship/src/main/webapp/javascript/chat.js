function sendMessage() {

    let input = document.getElementById("text");
    let btn = document.getElementById("sendButton");

    let msg = input.value;
    if (msg === "")
        return;

    // TODO erlang stuff to add (why sleep?)
    btn.disabled = true;
    //let msgForErlang = new Message("chat_message", msg.value, loggedUser , opponent);
    sleep(500).then(r => {
        //sendWebSocket(msgForErlang);
        createMessageElem(msg, true);
        btn.disabled = false;
    });
    input.value = "";
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function createMessageElem(message, isMsgMine) {
    let msgDiv = document.createElement("div");
    if (isMsgMine)
        msgDiv.className = "user-msg";
    else
        msgDiv.className = "opponent-msg";

    msgDiv.textContent = message;
    let container = document.getElementById("list-message");
    //container.insertBefore(msgDiv, container.lastChild);
    container.appendChild(msgDiv);
}

function acceptMessage(message) {
    createMessageElem(message, false);
}
