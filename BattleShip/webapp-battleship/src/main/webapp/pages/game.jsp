
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="./../image/png" href="./../images/battleship_icon.png"/>
    <link href="./../css/game.css" rel="stylesheet" type="text/css">
    <script type="text/javascript" src="../javascript/gameController.js"></script>
    <script type="text/javascript" src="../javascript/game.js"></script>
    <script type="text/javascript" src="../javascript/chat.js" defer></script>
    <script type="text/javascript">
        <% UserDTO loggedUser = (UserDTO) session.getAttribute("loggedUser");
            String loggedUsername = loggedUser.getUsername(); %>
        let loggedUser = '<%= loggedUsername %>';
        let opponent = '<%= request.getAttribute("opponentUsername")%>';
    </script>
    <title>Battleship - Game</title>
</head>
<body>
    <script>
        const game = new Game(5000, 5000);
    </script>

    <div id="container">
        <header id="game-info">
            <label id="phase">SET YOUR GRID</label>
            <p>TIMER</p>
            <button id="ready" disabled>READY</button>
            <button>SURRENDER</button>
        </header>

        <div id="game">
            <p>OPPONENT GROUND</p>
            <div class="grid" id="my-ground">
            </div>
            <p>YOUR GROUND</p>
            <div class="grid" id="enemy-ground">
            </div>
        </div>

        <div id="status">
            <cite>Your Navy</cite>
            <button id="back" onclick="goBack()" disabled>BACK</button>
            <div class="border">
                <div class="setup">
                    <cite>SHORT-SHIPS</cite>
                    <label id="place2">0</label><label>/4</label>
                </div>
                <div class="setup">
                    <cite>SUBMARINES</cite>
                    <label id="place3">0</label><label>/3</label>
                </div>
                <div class="setup">
                    <cite>MEDIUM-SHIPS</cite>
                    <label id="place4">0</label><label>/2</label>
                </div>
                <div class="setup">
                    <cite>MOTHER-SHIP</cite>
                    <label id="place5">0</label><label>/1</label>
                </div>
            </div>
            <cite>Enemy Navy</cite>
            <div class="border">
                <div class="setup">
                    <cite>SHORT-SHIPS</cite>
                    <label id="enemy2">2</label><label>/4</label>
                </div>
                <div class="setup">
                    <cite>SUBMARINES</cite>
                    <label id="enemy3">3</label><label>/3</label>
                </div>
                <div class="setup">
                    <cite>MEDIUM-SHIPS</cite>
                    <label id="enemy4">2</label><label>/2</label>
                </div>
                <div class="setup">
                    <cite>MOTHER-SHIP</cite>
                    <label id="enemy5">1</label><label>/1</label>
                </div>
            </div>
        </div>

        <div id="chat">
            <div id="list-message">
            </div>
            <div id="keyboard">
                <textarea name="" id="message" cols="30" rows="10"></textarea>
                <button id="sendMsgButton">SEND</button>
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
