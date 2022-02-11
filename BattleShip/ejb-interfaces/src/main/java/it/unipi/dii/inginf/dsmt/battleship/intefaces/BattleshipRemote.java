package it.unipi.dii.inginf.dsmt.battleship.intefaces;

import it.unipi.dii.inginf.dsmt.battleship.dto.UserDTO;

import javax.ejb.Remote;
import java.util.List;

@Remote
public interface BattleshipRemote {
    public List<UserDTO> rankingUsersJPA(int limit);
    public UserDTO findByUsernameJPA(String username);
    public void saveUserJPA(UserDTO dto);
    public void saveGame(UserDTO dto, boolean winOrLoss);
    public UserDTO login(String username, String password);
}
