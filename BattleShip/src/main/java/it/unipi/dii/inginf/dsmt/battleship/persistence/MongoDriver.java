package it.unipi.dii.inginf.dsmt.battleship.persistence;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.ReadPreference;
import com.mongodb.WriteConcern;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;

import java.util.Properties;

import static org.bson.codecs.configuration.CodecRegistries.fromProviders;
import static org.bson.codecs.configuration.CodecRegistries.fromRegistries;

/**
 * Singleton class used to connect to MongoDB
 */
public class MongoDriver {

    private static MongoDriver instance;
    private MongoClient client = null;

    public static MongoDriver getInstance() {
        if (instance == null)
            synchronized (instance) {
                if (instance == null) {
                    instance = new MongoDriver();
                }
            }
        return instance;
    }

    /**
     * Method that connects to mongoDB and returns the MongoClient instance
     */
    public MongoClient openConnection() {
        if (client != null)
            return client;

        try
        {
            ConnectionString uri = new ConnectionString("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000");
            client = MongoClients.create(uri);

            System.out.println("Connected to MongoDB ...");
            return client;
        }
        catch (Exception ex)
        {
            System.out.println("MongoDB is not available");
            return null;
        }
    }

    /**
     * Method used to close the connection
     */
    public void closeConnection() {
        if (client != null)
            System.out.println("Connection closed ...");
        client.close();
    }
}

