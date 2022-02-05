<%@ page import="it.unipi.dii.inginf.dsmt.battleship.model.User" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<html>
<head>
    <title>BattleShip - HomePage</title>
</head>
<body>
<%
    if (session.getAttribute("logged") == null) {
        response.sendRedirect("../index.jsp");
    }
    User user = (User) session.getAttribute("logged");
%>
    <h1>
        Welcome <%=user.getUsername()%>
    </h1>
    <a href="/logout" >Log-out</a>


</body>
</html>
