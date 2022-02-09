package it.unipi.dii.inginf.dsmt.battleship.intefaces;

import com.sun.tools.javac.util.Pair;
import it.unipi.dii.inginf.dsmt.battleship.dto.UserDTO;

import javax.ejb.Remote;
import java.util.List;

@Remote
public interface BattleshipRemote {
    public List<Pair<UserDTO, Double>> rankingUsersJPA(int limit);
    public UserDTO findByUsernameJPA(String username);
    public UserDTO saveUserJPA(UserDTO dto);
    public UserDTO login(String username, String password);
}