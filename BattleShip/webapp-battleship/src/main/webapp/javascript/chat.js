let chatBox = document.getElementById("list-message");
let sendMsgBtn = document.getElementById("sendMsgButton");
sendMsgBtn.onclick = function () {
    sendMessage();
}

function sendMessage() {
    let msg = document.getElementById("message");
    let btn = document.getElementById("sendMsgButton");

    if (msg !== "") {
        if (msg.value.length > 100)
            return;

        btn.disabled = true;
        //let msgForErlang = new Message("chat_message", msg.value, loggedUser , opponent);
        sleep(500).then(r => {
            //sendWebSocket(msgForErlang);
            createMessageElem(msg.value, true);
            btn.disabled = false;
        });
    }
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

    msgDiv.innerHTML = message;
    chatBox.appendChild(msgDiv);
}

function acceptMessage(message) {
    createMessageElem(message, false);
}
