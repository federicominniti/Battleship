package it.unipi.dii.inginf.dsmt.battleship.persistence;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import it.unipi.dii.inginf.dsmt.battleship.model.User;
import org.bson.Document;

public class MongoDBManager {
    public MongoDatabase db;
    private MongoCollection usersCollection;


    public MongoDBManager(MongoClient client) {
        this.db = client.getDatabase("PaperRater");
        usersCollection = db.getCollection("Users");
    }

    public boolean addUser (User u) {
        try {
            Document doc = new Document("username", u.getUsername())
                    .append("email", u.getEmail())
                    .append("password", u.getPassword());

            usersCollection.insertOne(doc);
            return true;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}