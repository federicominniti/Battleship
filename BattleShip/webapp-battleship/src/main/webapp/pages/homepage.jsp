<%@ page import="it.unipi.dii.inginf.dsmt.battleship.dto.UserDTO" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<html>
<%
    UserDTO user = (UserDTO) session.getAttribute("loggedUser");
%>
<head>
    <title>BattleShip - HomePage</title>
</head>
<body>
    <h1>
        Welcome <%=user.getUsername() %>
    </h1>
    <button onclick = "window.location.href='../logout'">Logout</button>

</body>
</html>
