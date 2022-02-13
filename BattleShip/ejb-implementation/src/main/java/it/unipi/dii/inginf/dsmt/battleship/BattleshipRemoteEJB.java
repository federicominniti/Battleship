package it.unipi.dii.inginf.dsmt.battleship;

import it.unipi.dii.inginf.dsmt.battleship.dto.UserDTO;
import it.unipi.dii.inginf.dsmt.battleship.entities.User;
import it.unipi.dii.inginf.dsmt.battleship.intefaces.BattleshipRemote;

import javax.annotation.Resource;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.sql.DataSource;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Stateless
public class BattleshipRemoteEJB implements BattleshipRemote {

    @Resource(lookup = "jdbc/BattleshipsPool")
    private DataSource dataSource;

    @PersistenceContext
    private EntityManager entityManager;

    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setPassword(null);                  // do not pass the password
        dto.setGameWins(user.getGameWins());
        dto.setGameWins(user.getGameWins());
        dto.setGameLose(user.getGameLose());
        return dto;
    }

    /**
     * Ranks registered users in descending order of victories/defeats ratio.
     * @param limit the limit of users to return
     * @return a list of users
     */
    @Override
    public List<UserDTO> rankingUsersJPA(int limit) {
        Query query = entityManager.createQuery(
                "SELECT u, COALESCE((u.gameWins / (u.gameWins + u.gameLose)), 0) AS ratio " +
                "FROM User u " +
                "ORDER BY u.gameWins DESC", User.class).setMaxResults(limit);
        List<Object[]> dbResult = query.getResultList();
        List<UserDTO> results = new ArrayList<>();
        if (dbResult != null && !dbResult.isEmpty()) {
            for(Object[] UserInfo: dbResult) {
                User user = (User) UserInfo[0];
                BigDecimal ratio = (BigDecimal) UserInfo[1];
                Double ratioDTO = ratio.doubleValue();
                UserDTO dto = convertToDTO(user);
                dto.setWinsRatio(ratioDTO);
                results.add(dto);
            }
        }
        return results;
    }

    /**
     * Retrieves a user
     * @param username the username of the user to retrieve
     * @return null if the there isn't a user associated with the username, a User otherwise
     */
    @Override
    public UserDTO findByUsernameJPA(String username) {
        User user = entityManager.find(User.class, username);
        if (user == null)
            return null;
        UserDTO dto = convertToDTO(user);
        return dto;
    }

    /**
     * Registers a user
     * @param dto the user to be saved
     */
    @Override
    public void saveUserJPA(UserDTO dto) {
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        entityManager.persist(user);
    }

    /**
     * Performs the login operation via username and password
     * @return null if the login has gone wrong, a UserDTO otherwise
     */
    @Override
    public UserDTO login(String username, String password) {
        User user;
        try {
            user = entityManager.createQuery(
                            "SELECT u " +
                                    "FROM User u " +
                                    "WHERE u.username = :username and " +
                                    " u.password = :password",
                            User.class)
                    .setParameter("username", username)
                    .setParameter("password", password)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
        UserDTO dto = convertToDTO(user);
        return dto;
    }

    /**
     * Registers the result of a game for a user. Can be either a win or a loss
     * @param dto the user involved in the operation
     * @param winOrLoss true if it's a win, false otherwise
     */
    @Override
    public void saveGame(UserDTO dto, boolean winOrLoss) {
        Query query;
        if (winOrLoss) {
            query = entityManager.createQuery(
                    "UPDATE User u SET u.gameWins = u.gameWins + 1 WHERE u.username = '" + dto.getUsername() + "'"
            );

        } else {
            query = entityManager.createQuery(
                    "UPDATE User u SET u.gameLose = u.gameLose + 1 WHERE u.username = '" + dto.getUsername() + "'"
            );

        }

        query.executeUpdate();
    }
}
