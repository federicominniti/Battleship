package it.unipi.dii.inginf.dsmt.battleship.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;

@Entity
@Table(name = "User")
public class User implements Serializable {
    @Id
    @Column(name = "username")
    private String username;
    @Column(name = "email")
    private String email;
    @Column(name = "password")
    private String password;
    @Column(name = "gameWins", columnDefinition = "int default 0")
    private int gameWins;
    @Column(name = "gameLose", columnDefinition = "int default 0")
    private int gameLose;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getGameWins() {
        return gameWins;
    }

    public void setGameWins(int gameWins) {
        this.gameWins = gameWins;
    }

    public int getGameLose() {
        return gameLose;
    }

    public void setGameLose(int gameLose) {
        this.gameLose = gameLose;
    }
}
