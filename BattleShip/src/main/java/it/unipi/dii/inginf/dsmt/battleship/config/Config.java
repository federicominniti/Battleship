package it.unipi.dii.inginf.dsmt.battleship.config;

import com.thoughtworks.xstream.XStream;
import org.w3c.dom.Document;
import org.xml.sax.SAXException;

import javax.xml.XMLConstants;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Source;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.Schema;
import javax.xml.validation.SchemaFactory;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;


public class Config {
    public static volatile Config instance;
    private static String pathDatabase;
    private static int secondsForTurn;
    private static int roundToSkipBeforeStop;
    private static int limitRanking;

    public static Config getInstance(){
        if(instance == null) {
            synchronized (Config.class) {
                if(instance==null) {
                    instance = getParams();
                }
            }
        }
        return instance;
    }

    private static Config getParams() {
        if (validConfigurationParameters()) {
            XStream xs = new XStream();

            String text = null;
            try {
                text = new String(Files.readAllBytes(Paths.get("config.xml")));
            }
            catch (Exception e) {
                System.err.println(e.getMessage());
            }

            return (Config) xs.fromXML(text);
        }
        else {
            System.exit(1);
        }
        return null;
    }

    private static boolean validConfigurationParameters() {
        try {
            DocumentBuilder documentBuilder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
            SchemaFactory schemaFactory = SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);
            Document document = documentBuilder.parse("config.xml");
            Schema schema = schemaFactory.newSchema(new StreamSource("config.xsd"));
            schema.newValidator().validate(new DOMSource(document));
        }
        catch (Exception e) {
            if (e instanceof SAXException)
                System.out.println("Validation Error: " + e.getMessage());
            else
                System.out.println(e.getMessage());

            return false;
        }
        return true;
    }

    public String getPathDatabase() {
        return pathDatabase;
    }

    public void setPathDatabase(String pathDatabase) {
        this.pathDatabase = pathDatabase;
    }

    public int getSecondsForTurn() {
        return secondsForTurn;
    }

    public void setSecondsForTurn(int secondsForTurn) {
        this.secondsForTurn = secondsForTurn;
    }

    public int getRoundToSkipBeforeStop() {
        return roundToSkipBeforeStop;
    }

    public void setRoundToSkipBeforeStop(int roundToSkipBeforeStop) {
        this.roundToSkipBeforeStop = roundToSkipBeforeStop;
    }

    public int getLimitRanking() {
        return limitRanking;
    }

    public void setLimitRanking(int limitRanking) {
        this.limitRanking = limitRanking;
    }
}
