
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
%>
    <h1><% request.getAttribute("logged"); %></h1>
</body>
</html>
