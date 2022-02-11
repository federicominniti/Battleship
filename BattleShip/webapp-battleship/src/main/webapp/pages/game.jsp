<%@ page import="it.unipi.dii.inginf.dsmt.battleship.dto.UserDTO" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="./../image/png" href="./../images/battleship_icon.png"/>
    <link href="./../css/game.css" rel="stylesheet" type="text/css">
    <script type="text/javascript" src="../javascript/gameController.js"></script>
    <script type="text/javascript" src="../javascript/game.js"></script>
    <script type="text/javascript" src="../javascript/chat.js" defer></script>
    <title>Battleship - Game</title>
</head>
<body>
<%
    UserDTO loggedUser = (UserDTO) session.getAttribute("loggedUser");
    String  opponent = (String) request.getAttribute("opponentUsername");
    String loggedUsername = loggedUser.getUsername();
%>
    <script>
        const loggedUser = '<%= loggedUsername %>';
        const opponent = '<%=opponent%>';
        const game = new Game(5000, 5000);
    </script>

    <div id="container">
        <header id="game-info">
            <div>
                <cite>Game phase:</cite>
                <label id="phase">SET YOUR GRID</label>
            </div>
            <div>
                <cite>TIMER</cite>
                <p id="timer"></p>
            </div>
        </header>

        <div id="game">
            <p><%=opponent%> GROUND</p>
            <div class="grid" id="my-ground">
            </div>
            <br>
            <p><%=loggedUsername%> GROUND</p>
            <div class="grid" id="enemy-ground">
            </div>
        </div>

        <div id="status">
            <button id="ready" disabled>READY</button>
            <button>SURRENDER</button>
            <button id="back" onclick="goBack()" disabled>BACK</button>
            <cite>Your Navy</cite>
            <div class="border">
                <div class="setup">
                    <cite>SHORT-SHIPS</cite>
                    <span><label id="place2">0</label><label>/4</label></span>
                </div>
                <div class="setup">
                    <cite>SUBMARINES</cite>
                    <span><label id="place3">0</label><label>/3</label></span>
                </div>
                <div class="setup">
                    <cite>MEDIUM-SHIPS</cite>
                    <span><label id="place4">0</label><label>/2</label></span>
                </div>
                <div class="setup">
                    <cite>MOTHER-SHIP</cite>
                    <span><label id="place5">0</label><label>/1</label></span>
                </div>
            </div>
            <cite>Enemy Navy</cite>
            <div class="border">
                <div class="setup">
                    <cite>SHORT-SHIPS</cite>
                    <span><label id="enemy2">4</label><label>/4</label></span>
                </div>
                <div class="setup">
                    <cite>SUBMARINES</cite>
                    <span><label id="enemy3">3</label><label>/3</label></span>
                </div>
                <div class="setup">
                    <cite>MEDIUM-SHIPS</cite>
                    <span><label id="enemy4">2</label><label>/2</label></span>
                </div>
                <div class="setup">
                    <cite>MOTHER-SHIP</cite>
                    <span><label id="enemy5">1</label><label>/1</label></span>
                </div>
            </div>
        </div>

        <div id="chat">
            <div id="list-message"></div>
            <div id="keyboard">
                <input id="text" type="input" maxlength="100" placeholder="Type here...">
                <button id="sendButton" onclick="sendMessage()">SEND</button>
            </div>
        </div>
    </div>

    <script>
        window.onload = () => {
            createGrid('enemy', 'my-ground');
            createGrid('your', 'enemy-ground');
        }
    </script>
    <!--<script src="./../javascript/webSocket.js"></script>-->
</body>
</html>
