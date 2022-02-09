<%@ page import="it.unipi.dii.inginf.dsmt.battleship.model.User" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Find an opponent</title>
    <link href="resources/css/" rel="stylesheet" type="text/css">
    <link rel="icon" type="image/png" href="resources/images/icon.png"/>
</head>
<body>
    <h1>Find an opponent
        <%
            User myself = (User) session.getAttribute("loggedUser");
        %>
    </h1>
    <h2>Waiting for a match</h2>
    <div>
        <div>
            <table id="onlineUsers">
                <tr>
                    <th>Username</th>
                </tr>
            </table>
            <table id="ranking">
                <tr>
                    <th>Username</th>
                    <th>Ranking</th>
                </tr>
                <c:forEach var="rank" items="${ranking}">
                    <tr>
                        <td>${rank.key}</td>
                        <td>${rank.value}</td>
                    </tr>
                </c:forEach>
            </table>
        </div>
    </div>
    <div>
        <h2>You received the following requests for a game: </h2>
        <table id="gameRequests">
            <tr>
                <th>Username</th>
                <th>Accept</th>
            </tr>
        </table>
    </div>
    <script>
        var username = '<%= myself.getUsername() %>';
    <script src="resources/javascript/webSocket.js"></script>
    <script src="resources/javascript/gameSelected.js"></script>
</body>
</html>
