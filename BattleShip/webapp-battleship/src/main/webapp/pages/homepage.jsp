<%@ page import="it.unipi.dii.inginf.dsmt.battleship.dto.UserDTO" %>
<%@ page import="java.util.List" %>
<%@ page import="it.unipi.dii.inginf.dsmt.battleship.intefaces.BattleshipRemote" %>
<%@ page import="javax.ejb.EJB" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<html>
<%
    List<UserDTO> rank = (List<UserDTO>) session.getAttribute("ranking");
    UserDTO user = (UserDTO) session.getAttribute("loggedUser");
%>
<script>
    let username = '<%= user.getUsername() %>';
    let numReloads = '<%= session.getAttribute("numReloads") %>';
</script>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/png" href="./../images/battleship_icon.png"/>
    <link href="./../css/homepage.css" rel="stylesheet" type="text/css">
    <title>BattleShip - HomePage</title>
</head>
<body onload="refreshPage()" onbeforeunload="saveDataAndQuit()">
    <div id="container">
        <img id="logo" height="150" width="200" src="./../images/Battleship-logos_black.png" alt="logo">
        <header id="player-info">
            <cite>Welcome <%=user.getUsername() %></cite>
            <p>
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-award" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#FFFF" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <circle cx="12" cy="9" r="6" />
                    <polyline points="9 14.2 9 21 12 19 15 21 15 14.2" transform="rotate(-30 12 9)" />
                    <polyline points="9 14.2 9 21 12 19 15 21 15 14.2" transform="rotate(30 12 9)" />
                </svg>
                <%=user.getGameWins()%>
            </p>
            <p>
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-mood-crazy-happy" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#FFFF" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <circle cx="12" cy="12" r="9" />
                    <line x1="7" y1="8.5" x2="10" y2="11.5" />
                    <path d="M7 11.5l3 -3" />
                    <line x1="14" y1="8.5" x2="17" y2="11.5" />
                    <path d="M14 11.5l3 -3" />
                    <path d="M9.5 15a3.5 3.5 0 0 0 5 0" />
                </svg>
                <%=user.getGameLose()%>
            </p>
            <a onclick="window.location.href='../logout'">Logout</a>
        </header>
        <button id="play" class="button">SEARCH BATTLE</button>
        <div id="ranking">
            <cite>Best Player</cite>
            <% if (rank != null) {
                for (UserDTO dto: rank) { %>
                    <div class="info-rank">
                        <label><%= dto.getUsername()%></label>
                        <label><%= dto.getWinsRatio()%></label>
                    </div>
            <%
                }
            } else { %>
                <p>We don't find any User</p>
            <% } %>
        </div>
        <div id="online-users">
            <cite>Online Player</cite>
        </div>
        <div id="received-request">
        </div>
    </div>

    <script src="./../javascript/webSocket.js"></script>
    <script src="./../javascript/homepage.js"></script>
</body>
</html>
