package it.unipi.dii.inginf.dsmt.battleship.servlet;

import javax.servlet.DispatcherType;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(value = "/pages/game")
public class Game extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
        //TOGLIERE ALLA FINE
    }

    private void processRequest(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        response.setContentType("text/html");
        /*String opponent = request.getParameter("opponentUsername");

        if (opponent == null) {
            response.sendRedirect(request.getContextPath() + "/pages/homepage.jsp");
        } else {
            RequestDispatcher dispatcher = request.getRequestDispatcher("/pages/game.jsp");
            response.setHeader("Pragma", "No-cache");
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.setDateHeader("Expires", -1);
            dispatcher.include(request, response);
        }*/

        response.sendRedirect(request.getContextPath() + "/pages/game.jsp");
    }
}
