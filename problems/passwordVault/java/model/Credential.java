package problems.passwordVault.java.model;

public class Credential {
    private static int counter = 0;
    private final int id;
    private final String credentialEncryptedPassword;
    private final String credentialName;
    private final String credentialUserName;
    private final String credentialWebsite;
    private final User user;

       public Credential(User user, String credentialName, String credentialEncryptedPassword,
                       String credentialUserName, String credentialWebsite) {
        this(user, credentialName, credentialEncryptedPassword, credentialUserName, credentialWebsite, ++counter);
    }

    public Credential(User user, String credentialName, String credentialEncryptedPassword,
                       String credentialUserName, String credentialWebsite, int id) {
        this.id = id;
        this.user = user;
        this.credentialName = credentialName;
        this.credentialEncryptedPassword = credentialEncryptedPassword;
        this.credentialUserName = credentialUserName;
        this.credentialWebsite = credentialWebsite;
    }

    public String getCredentialName() {
        return credentialName;
    }

    public String getCredentialUserName(){
        return credentialUserName;
    }
    public String getCredentialWebsite(){
        return credentialWebsite;
    }

    public Integer getId(){
        return id;
    }

    public User getUser(){
        return user;
    }

    public String getCredentialEncryptedPassword(){
        return credentialEncryptedPassword;
    }
}
