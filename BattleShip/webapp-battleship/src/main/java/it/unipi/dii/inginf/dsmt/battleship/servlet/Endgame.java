package it.unipi.dii.inginf.dsmt.battleship.servlet;

import it.unipi.dii.inginf.dsmt.battleship.dto.UserDTO;
import it.unipi.dii.inginf.dsmt.battleship.intefaces.BattleshipRemote;

import javax.ejb.EJB;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.util.List;

@WebServlet(value = "/pages/endgame")
public class Endgame extends HttpServlet {

    @EJB
    private BattleshipRemote battleshipRemote;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    private void processRequest(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        response.setContentType("text/html");

        HttpSession session = request.getSession();
        UserDTO user = (UserDTO) session.getAttribute("loggedUser");
        if (session.getAttribute("opponentUsername") == null){

            response.sendRedirect(request.getContextPath() + "/pages/homepage.jsp");
            return;
        }
        if (request.getParameter("result") != null) {
            if (request.getParameter("result").equals("win")) {
                user.setGameWins(user.getGameWins() + 1);
                user.setGameLose(user.getGameLose() - 1);
                battleshipRemote.saveGame(user);
                request.setAttribute("result", "win");
            } else if (request.getParameter("result").equals("lose")) {
                request.setAttribute("result", "lose");
            }
        }
        List<UserDTO> ranking = battleshipRemote.rankingUsersJPA(10);
        session.setAttribute("ranking", ranking);
        session.setAttribute("loggedUser", user);
        session.removeAttribute("opponentUsername");
        RequestDispatcher dispatcher = request.getRequestDispatcher("/pages/result.jsp");
        dispatcher.include(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }
}
