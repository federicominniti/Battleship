<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <%
        String result = request.getParameter("result");
        session.removeAttribute("opponentUsername");
    %>
    <link rel="stylesheet" href="../css/result.css">
</head>
<body>
  <h1 id="result"></h1>
  <button onclick="window.location.href = 'homepage.jsp';">Return to Home</button>
</body>
<script>
    let result = '<%=result%>';
    if (result === "win") {
        document.getElementById("result").innerText = "Congratulations! You owned this!";
        document.title = "You won!";
    }
    else {
        document.title = "You lost!"
        document.getElementById("result").innerText = "Don't worry there'll be a next time...";
    }
</script>
</html>
