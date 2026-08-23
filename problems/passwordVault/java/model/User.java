package problems.passwordVault.java.model;
import java.util.HashMap;
public class User {
    private static int counter = 0;
    private final int id;
    private final String name;
    private final String email;
    private final String passwordHash;

    public User(String name, String email, String passwordHash){
        this.id = ++counter;
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
    }

    public int getId(){return id;}
    public String getName(){return name;}
    public String getEmail(){return email;}
    public String getPasswordHash(){return passwordHash;}
}
