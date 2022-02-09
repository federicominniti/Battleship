package it.unipi.dii.inginf.dsmt.battleship.servlet;


import it.unipi.dii.inginf.dsmt.battleship.dto.UserDTO;
import it.unipi.dii.inginf.dsmt.battleship.intefaces.BattleshipRemote;

import javax.ejb.EJB;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet(name = "IndexServlet", value = {"/access"})
public class IndexServlet extends HttpServlet {

    @EJB
    private BattleshipRemote battleshipRemote;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        if (session.getAttribute("loggedUser") == null)
            response.sendRedirect(request.getContextPath() + "/index.jsp");
        else
            response.sendRedirect(request.getContextPath() + "/pages/homepage.jsp");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }

    private void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String email = request.getParameter("email");
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        response.setContentType("text/html");

        HttpSession session = request.getSession();
        String targetJSP = null;

        if (username == null || password == null) {
            response.sendRedirect(request.getContextPath() + "/index.jsp");
            return;
        }

        // Login
        if (request.getParameter("loginButton") != null) {
            UserDTO user = battleshipRemote.login(username, password);
            if (user != null) {
                session.setAttribute("loggedUser", user);
                List<UserDTO> ranking = battleshipRemote.rankingUsersJPA(10);
                session.setAttribute("ranking", ranking);
                response.sendRedirect(request.getContextPath() + "/pages/homepage.jsp");
                return;
            } else {
                request.setAttribute("errorMsg", "Access error: username and/or password are wrong!");
            }
        } else { //Register
            if (battleshipRemote.findByUsernameJPA(username) != null) { //if the username already exists
                request.setAttribute("errorMsg", "Username already exists! Please choose another one");
            } else {
                UserDTO user = new UserDTO();
                user.setUsername(username);
                user.setEmail(email);
                user.setPassword(password);
                battleshipRemote.saveUserJPA(user);
                session.setAttribute("loggedUser", user);
                List<UserDTO> ranking = battleshipRemote.rankingUsersJPA(10);
                session.setAttribute("ranking", ranking);
                response.sendRedirect(request.getContextPath() + "/pages/homepage.jsp");
                return;
            }
        }

        RequestDispatcher dispatcher = request.getRequestDispatcher("/index.jsp");
        dispatcher.forward(request, response);

    }
}
