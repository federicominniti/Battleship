package it.unipi.dii.inginf.dsmt.battleship;

import it.unipi.dii.inginf.dsmt.battleship.dto.UserDTO;
import it.unipi.dii.inginf.dsmt.battleship.entities.User;
import it.unipi.dii.inginf.dsmt.battleship.intefaces.BattleshipRemote;

import javax.annotation.Resource;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.sql.DataSource;
import java.util.List;

@Stateless
public class BattleshipRemoteEJB implements BattleshipRemote {

    @Resource(lookup = "jdbc/BattleshipsPool")
    private DataSource dataSource;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<UserDTO> rankingUsersJPA(int limit) {
        return null;
    }

    @Override
    public UserDTO findByUsernameJPA(String username) {
        User user = entityManager.find(User.class, username);
        UserDTO dto = new UserDTO();
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setPassword(user.getPassword());
        dto.setGameWins(user.getGameWins());
        dto.setGameWins(user.getGameWins());
        dto.setGameLose(user.getGameLose());
        return dto;
    }

    @Override
    public UserDTO saveUserJPA(UserDTO dto) {
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        // user.setGameWins(dto.getGameWins());
        // user.setGameLose(dto.getGameLose());
        entityManager.persist(user);
        return dto;
    }

    @Override
    public UserDTO login(String username, String password) {
        User user = entityManager.createQuery(
                     "SELECT u " +
                        "FROM User u " +
                        "WHERE u.username = :username and " +
                        " u.password = :password",
                User.class)
                .setParameter("username", username)
                .setParameter("password", password)
                .getSingleResult();
        UserDTO dto = new UserDTO();
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setPassword(user.getPassword());
        dto.setGameWins(user.getGameWins());
        dto.setGameWins(user.getGameWins());
        dto.setGameLose(user.getGameLose());
        return dto;
    }
}
