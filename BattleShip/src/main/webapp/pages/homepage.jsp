<%@ page import="it.unipi.dii.inginf.dsmt.battleship.model.User" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<html>
<head>
    <title>BattleShip - HomePage</title>
</head>
<body>
<%
    if (request.getAttribute("logged") == null) {
        response.sendRedirect("../index.jsp");
    }
    User user = (User) session.getAttribute("logged");
%>
    <h1><% user.getUsername(); %></h1>
</body>
</html>
