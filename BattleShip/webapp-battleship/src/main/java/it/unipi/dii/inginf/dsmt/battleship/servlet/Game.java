package it.unipi.dii.inginf.dsmt.battleship.servlet;

import it.unipi.dii.inginf.dsmt.battleship.dto.UserDTO;
import it.unipi.dii.inginf.dsmt.battleship.intefaces.BattleshipRemote;

import javax.ejb.EJB;
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

@WebServlet(name = "Game", value = "/pages/game")
public class Game extends HttpServlet {
    @EJB
    private BattleshipRemote battleshipRemote;

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    }

    private void processRequest(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        response.setContentType("text/html");
        String opponent = request.getParameter("opponentUsername");
        HttpSession session = request.getSession();
        UserDTO user = (UserDTO) session.getAttribute("loggedUser");
        if (opponent == null || session.getAttribute("opponentUsername") != null) {
            session.removeAttribute("opponentUsername");
            response.sendRedirect(request.getContextPath() + "/pages/homepage.jsp");
        } else {
            user.setGameLose(user.getGameLose() + 1);
            battleshipRemote.saveGame(user);
            RequestDispatcher dispatcher = request.getRequestDispatcher("/pages/game.jsp");
            request.setAttribute("opponentUsername", opponent);
            dispatcher.include(request, response);
        }
    }
}
