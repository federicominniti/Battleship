<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>BattleShip</title>
    <!--link href="resources/css/style.css" rel="stylesheet" type="text/css"-->
    <link rel="icon" type="image/png" href="./images/battleship_icon.png"/>
</head>
<body>

    <h1>BattleShip!</h1>

    <div>
        <form action="login" method="post">
            <div>
                <label>Username</label>
                <input type="text" placeholder="Insert Username" name="username" required><br>
                <label>Password</label>
                <input type="password" placeholder="Insert Password" name="password" required><br>

                <button type="submit" name="loginButton" value="login">Login</button>
            </div>
        </form>

        <form action="register" method="post">
            <div>
                <label>Email</label>
                <input type="text" placeholder="Insert email" name="email" required><br>
                <label>Username</label>
                <input type="text" placeholder="Insert Username" name="username" id = "username"
                       onblur="checkUsername('username')" required><br>
                <label>Password</label>
                <input type="password" placeholder="Insert Password" id = "password" name="password"
                       onblur="checkPassword('password')" required><br>
                <label>Repeat password</label>
                <input type="password" placeholder="Repeat Password" id = "repeat_password" name="repeat_password"
                       onblur="checkPasswordEquality('repeat_password')" required><br>

                <button type="submit" name="registerButton" value="register" id = "register"
                        ononmousedown = "highlightsFieldsOrGo()">Register</button>
            </div>
        </form>
    </div>
    <script type="text/javascript" src="./javascript/index.js"></script>
</body>
</html>