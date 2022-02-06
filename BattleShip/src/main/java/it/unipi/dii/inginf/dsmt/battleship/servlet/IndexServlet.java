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

        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        HttpSession session = request.getSession();

        // Login
        if (request.getParameter("loginButton") != null) {
            User user = levelDBDriver.login(username, password);
            if (user != null) {
                session.setAttribute("loggedUser", user);
                RequestDispatcher requestDispatcher = request.getRequestDispatcher("/pages/homepage.jsp");
                requestDispatcher.forward(request, response);
            } else {
                out.print("Access error: username and/or password are wrong!");
                RequestDispatcher requestDispatcher = request.getRequestDispatcher("/index.jsp");
                requestDispatcher.include(request, response);
            }
        } else { //Register
            if (levelDBDriver.checkIfUserExists(username)) { //if the username already exists
                out.print("Username already exists! Please choose another one");
                RequestDispatcher requestDispatcher = request.getRequestDispatcher("/index.jsp");
                requestDispatcher.include(request, response);
            } else {
                User user = levelDBDriver.addUser(username, email, password);
                session.setAttribute("loggedUser", user);
                RequestDispatcher requestDispatcher = request.getRequestDispatcher("/pages/homepage.jsp");
                requestDispatcher.forward(request, response);
            }
        }
        out.close();
    }
}
