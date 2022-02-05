<%@ page import="it.unipi.dii.inginf.dsmt.battleship.model.User" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<html>
<%
    if (session.getAttribute("logged") == null) {
        response.sendRedirect("../index.jsp");
    }
    User user = (User) session.getAttribute("logged");
%>
<head>
    <title>BattleShip - HomePage</title>
</head>
<body>
    <h1><% user.getUsername(); %></h1>
</body>
</html>
