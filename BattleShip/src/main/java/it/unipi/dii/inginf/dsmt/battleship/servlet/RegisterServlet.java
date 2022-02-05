package it.unipi.dii.inginf.dsmt.battleship.servlet;

import it.unipi.dii.inginf.dsmt.battleship.model.User;
import it.unipi.dii.inginf.dsmt.battleship.persistence.LevelDBDriver;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;

@WebServlet(name = "RegisterServlet", value = "/register")
public class RegisterServlet extends HttpServlet {



    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        LevelDBDriver levelDBDriver = LevelDBDriver.getInstance();
        String email = request.getParameter("email");
        String username = request.getParameter("username");
        String password = request.getParameter("password");

        String targetJSP = null;
        if (levelDBDriver.checkIfUserExists(username)) {
            String message = "Username already in use.";
            //request.setAttribute("msg", message);
            targetJSP = "/index.jsp?msg="+message;
        } else {
            User user  = levelDBDriver.addUser(username, email, password);
            HttpSession session = request.getSession(true);
            session.setAttribute("logged", user);
            //request.setAttribute("user", user);
            targetJSP = "/pages/homepage.jsp";
        }
        //request.getRequestDispatcher(targetJSP).forward(request, response);
        response.sendRedirect(request.getContextPath() + targetJSP);
    }
}
