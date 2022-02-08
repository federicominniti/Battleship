package it.unipi.dii.inginf.dsmt.battleship.dto;

import java.io.Serializable;

public class UserDTO implements Serializable {

    private String username;
    private String email;
    private String password;
    private int gameWins;
    private int gameLose;

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public int getGameWins() {
        return gameWins;
    }

    public int getGameLose() {
        return gameLose;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setGameWins(int gameWins) {
        this.gameWins = gameWins;
    }

    public void setGameLose(int gameLose) {
        this.gameLose = gameLose;
    }
}
