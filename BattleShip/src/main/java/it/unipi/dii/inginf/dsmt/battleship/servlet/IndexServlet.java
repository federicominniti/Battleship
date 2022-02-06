package it.unipi.dii.inginf.dsmt.battleship.servlet;

import it.unipi.dii.inginf.dsmt.battleship.model.User;
import it.unipi.dii.inginf.dsmt.battleship.persistence.LevelDBDriver;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "IndexServlet", value = "/access")
public class IndexServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }

    private void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        LevelDBDriver levelDBDriver = LevelDBDriver.getInstance();
        String email = request.getParameter("email");
        String username = request.getParameter("username");
        String password = request.getParameter("password");

        response.setContentType("text/html");   // ???

        HttpSession session = request.getSession();
        String targetJSP = null;

        // Login
        if (request.getParameter("loginButton") != null) {
            User user = levelDBDriver.login(username, password);
            if (user != null) {
                session.setAttribute("loggedUser", user);
                targetJSP = "/pages/homepage.jsp";
            } else {
                request.setAttribute("errorMsg", "Access error: username and/or password are wrong!");
                targetJSP = "/index.jsp";
            }
        } else { //Register
            if (levelDBDriver.checkIfUserExists(username)) { //if the username already exists
                request.setAttribute("errorMsg", "Username already exists! Please choose another one");
                targetJSP = "/index.jsp";
            } else {
                User user = levelDBDriver.addUser(username, email, password);
                session.setAttribute("loggedUser", user);
            }
        }
        RequestDispatcher requestDispatcher = request.getRequestDispatcher(targetJSP);
        requestDispatcher.forward(request, response);
    }
}
