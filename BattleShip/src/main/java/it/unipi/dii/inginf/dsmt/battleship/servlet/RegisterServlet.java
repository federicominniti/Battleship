package it.unipi.dii.inginf.dsmt.battleship.servlet;

import it.unipi.dii.inginf.dsmt.battleship.controller.RegisterController;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;

@WebServlet(name = "RegisterServlet", value = "/register")
public class RegisterServlet extends HttpServlet {

    LevelDBDriver levelDBDriver =

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        if (RegisterController.addUser(username) == false) {
            String message = "Username already in use.";
            request.setAttribute("msg", message);
            String targetJSP = request.getContextPath() + "/index.jsp";
            RequestDispatcher requestDispatcher = request.getRequestDispatcher(targetJSP);
            requestDispatcher.forward(request, response);
        } else {
            // add user
            HttpSession session = request.getSession(true);
            if (session.getAttribute("logged") == null) {
                session.setAttribute("logged", username);
            }
            String targetJSP = request.getContextPath() + "/pages/homepage.jsp";
            RequestDispatcher requestDispatcher = request.getRequestDispatcher(targetJSP);
            requestDispatcher.forward(request, response);
        }
    }
}
