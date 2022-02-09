package it.unipi.dii.inginf.dsmt.battleship;

import com.sun.tools.javac.util.Pair;
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
        dto.setPassword(user.getPassword());
        dto.setGameWins(user.getGameWins());
        dto.setGameWins(user.getGameWins());
        dto.setGameLose(user.getGameLose());
        return dto;
    }

    @Override
    public List<Pair<UserDTO, Double>> rankingUsersJPA(int limit) {
        StringBuilder jpql = new StringBuilder();
        jpql.append("select u.*, ifnull((u.gameWins / (u.gameWins + u.gameLose)), 0) as ratio\n" +
                "from User u\n" +
                "order by ratio desc\n" +
                "limit :limit");
        Query query = entityManager.createQuery(jpql.toString());
        query.setParameter("limit", limit);

        List<Object[]> dbResult = query.getResultList();
        List<Pair<UserDTO, Double>> results = new ArrayList<>();
        if (dbResult != null && !dbResult.isEmpty()) {
            for(Object[] UserInfo: dbResult) {
                User user = (User) UserInfo[0];
                Double ratio = (Double) UserInfo[1];
                UserDTO dto = convertToDTO(user);
                results.add(new Pair<UserDTO, Double>(dto, ratio));
            }
        }
        return results;
    }

    @Override
    public UserDTO findByUsernameJPA(String username) {
        User user = entityManager.find(User.class, username);
        if (user == null)
            return null;
        UserDTO dto = convertToDTO(user);
        return dto;
    }

    @Override
    public UserDTO saveUserJPA(UserDTO dto) {
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        entityManager.persist(user);
        return dto;
    }

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
}
