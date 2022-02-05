<%@ page import="it.unipi.dii.inginf.dsmt.battleship.model.User" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>BattleShip - HomePage</title>
</head>
<body>
<%
    if (session.getAttribute("logged") == null) {
        response.sendRedirect(request.getContextPath() + "/index.jsp");
    }
    User user = (User) request.getAttribute("logged");
%>
    <h1><% user.getUsername(); %></h1>
</body>
</html>
