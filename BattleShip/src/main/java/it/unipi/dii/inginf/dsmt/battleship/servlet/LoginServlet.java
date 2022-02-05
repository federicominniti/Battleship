package it.unipi.dii.inginf.dsmt.battleship.servlet;

import it.unipi.dii.inginf.dsmt.battleship.model.User;
import it.unipi.dii.inginf.dsmt.battleship.persistence.LevelDBDriver;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;

@WebServlet(name = "LoginServlet", value = "/login")
public class LoginServlet extends HttpServlet {



    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        LevelDBDriver levelDBDriver = LevelDBDriver.getInstance();
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        User user = levelDBDriver.login(username, password);

        String targetJSP = null;
        if (user == null) {
            String message = "Wrong username or password.";
            targetJSP = "/index.jsp?msg=" + message;
            //RequestDispatcher requestDispatcher = request.getRequestDispatcher(targetJSP);
            //requestDispatcher.forward(request, response);
        } else {
            HttpSession session = request.getSession(true);
            session.setAttribute("logged", user);
            //request.setAttribute("user", user);
            targetJSP = "/pages/homepage.jsp";
        }
        response.sendRedirect(request.getContextPath() + targetJSP);
        //RequestDispatcher requestDispatcher = request.getRequestDispatcher(targetJSP);
        //requestDispatcher.forward(request, response);
    }
}
