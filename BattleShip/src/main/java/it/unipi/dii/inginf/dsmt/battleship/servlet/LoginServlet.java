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
        if (user == null) {
            String message = "Wrong username or password.";
            request.setAttribute("msg", message);
            String targetJSP = request.getContextPath() + "/index.jsp";
            RequestDispatcher requestDispatcher = request.getRequestDispatcher(targetJSP);
            requestDispatcher.forward(request, response);
        } else {
            HttpSession session = request.getSession();
            session.setAttribute("logged", user);
            String targetJSP = request.getContextPath() + "./pages/homepage.jsp";
            response.sendRedirect(targetJSP);
        }
    }
}
