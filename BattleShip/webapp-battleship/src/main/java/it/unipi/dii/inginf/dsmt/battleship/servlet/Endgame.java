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
        processRequest(request, response);
        //TOGLIERE ALLA FINE
    }

    private void processRequest(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        response.setContentType("text/html");

        HttpSession session = request.getSession();
        UserDTO user = (UserDTO) session.getAttribute("loggedUser");
        System.err.println(user.getUsername());
        if (request.getParameter("result") != null) {
            System.out.println("qui");
            if (request.getParameter("result").equals("win")) {
                battleshipRemote.saveGame(user, true);
                user.setGameWins(user.getGameWins() + 1);
                request.setAttribute("result", "win");
            } else if (request.getParameter("result").equals("loss")) {
                user.setGameLose(user.getGameLose() + 1);
                battleshipRemote.saveGame(user, false);
                request.setAttribute("result", "loss");
            }
            else {
                //mandare messaggio riguardo al fatto che la partita è stata interrota e quindi non salvata?
            }
        }
        List<UserDTO> ranking = battleshipRemote.rankingUsersJPA(10);
        session.setAttribute("ranking", ranking);
        session.setAttribute("loggedUser", user);
        RequestDispatcher dispatcher = request.getRequestDispatcher("/pages/result.jsp");
        dispatcher.include(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }
}
