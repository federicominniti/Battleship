package it.unipi.dii.inginf.dsmt.battleship.model;

public class User {
    private String username;
    private String password;
    private String email;
    private int wins;
    private int defeats;

    public User(String username, String password, String email, int wins, int defeats) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.wins = wins;
        this.defeats = defeats;
    }

    public int getWins() {
        return wins;
    }

    public void setWins(int wins) {
        this.wins = wins;
    }

    public int getDefeats() {
        return defeats;
    }

    public void setDefeats(int defeats) {
        this.defeats = defeats;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
