package it.unipi.dii.inginf.dsmt.battleship.persistence;

import it.unipi.dii.inginf.dsmt.battleship.model.User;
import org.iq80.leveldb.DB;
import org.iq80.leveldb.Options;

import java.io.File;
import java.io.IOException;
import static org.iq80.leveldb.impl.Iq80DBFactory.*;

public class LevelDBDriver {
    private static volatile LevelDBDriver instance;
    private DB db;
    private static String dbPath;


    private LevelDBDriver(String dbPath) {
        this.dbPath = dbPath;
        openDB();
    }

    public static LevelDBDriver getInstance() {
        if (instance == null) {
            synchronized (LevelDBDriver.class) {
                if (instance == null)
                    instance = new LevelDBDriver("battleship_db");
            }
        }
        return instance;
    }

    private static DB openDB() {
        Options options = new Options();
        options.createIfMissing(true);

        DB db = null;
        try {
            db = factory.open(new File(dbPath), options);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return db;
    }

    public void closeDB() {
        try {
            if (db != null) {
                db.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void put(String key,String value) {
        db.put(bytes(key), bytes(value));
    }

    private String get(String key) {
        byte[] bytes = db.get(bytes(key));
        return (bytes == null ? null : asString(bytes));
    }

    private void delete(String key) {
        db.delete(bytes(key));
    }

    public void addUser(String username, String email, String password) {
        String buildString = "username:";
        buildString += username;
        buildString += ":";

        put(buildString + "email", email);
        put(buildString + "password", password);
    }

    public boolean checkIfUserExists(String username) {
        String check = get("username:" + username + ":password");
        return (check != null);
    }

    public User login(String username, String password) {
        String buildString = "username:" + username;
        String psw = get(buildString + ":password");
        if (psw != null && psw.equals(password)) {
            String value = get(buildString + ":wins");
            int wins;
            int defeats;
            if (value != null)
                wins = Integer.parseInt(value);
            else
                wins = 0;

            value = get(buildString + ":defeats");
            if (value != null)
                defeats = Integer.parseInt(value);
            else
                defeats = 0;

            String email = get(buildString + ":email");
            User loggedUser = new User(username, password, email, wins, defeats);
            return loggedUser;
        }
        return null;

    }


}