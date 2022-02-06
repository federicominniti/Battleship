<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>BattleShip</title>
    <link href="css/index.css" rel="stylesheet" type="text/css">
    <link rel="icon" type="image/png" href="images/battleship_icon.png"/>
</head>
<body>
<%
    if (session.getAttribute("loggedUser") != null) {
        RequestDispatcher dispatcher = request.getRequestDispatcher("/pages/homepage.jsp");
        dispatcher.forward(request, response);
    }
%>
    <div id="container">
        <h1 id="title">BATTLESHIP!</h1>
        <div id="form-wrap">
            <form class="visible" id="login-form" action="access" method="post">
                <label>Username</label>
                <input type="text" placeholder="Insert Username" name="username" required><br>
                <label>Password</label>
                <input type="password" placeholder="Insert Password" name="password" required><br>

                <button class="button" type="submit" name="loginButton" value="login">Login</button>
                <a href="javascript:changeForm('login-form', 'register-form');">Create account</a>
            </form>

            <form class="hidden" id="register-form" action="access" method="post">
                <label>Email</label>
                <input type="email" placeholder="Insert email" name="email" required><br>
                <label>Username</label>
                <input type="text" placeholder="Insert Username" name="username" id = "username"
                       onblur="checkUsername('username')" required><br>
                <label>Password</label>
                <input type="password" placeholder="Insert Password" id = "password" name="password"
                       onblur="checkPassword('password')" required><br>
                <label>Repeat password</label>
                <input type="password" placeholder="Repeat Password" id = "repeat_password" name="repeat_password"
                       onblur="checkPasswordEquality('password', 'repeat_password')" required><br>

                <button class="button" type="submit" name="registerButton" value="register" id ="register"
                        ononmousedown = "highlightsFieldsOrGo()" disabled>Register</button>
                <a href="javascript:changeForm('register-form', 'login-form');">Already registered? Login</a>
            </form>
        </div>
    </div>

<script type="text/javascript" src="javascript/accessController.js"></script>
</body>
</html>