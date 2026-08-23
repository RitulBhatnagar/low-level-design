package problems.passwordVault.java.model;

// CredentialSummary.java
public class CredentialSummary {
    private final int id;
    private final String credentialName;
    private final String credentialUserName;
    private final String credentialWebsite;

    public CredentialSummary(int id, String credentialName, String credentialUserName, String credentialWebsite) {
        this.id = id;
        this.credentialName = credentialName;
        this.credentialUserName = credentialUserName;
        this.credentialWebsite = credentialWebsite;
    }
    // getters

    public Integer getId(){
        return id;
    }
    
    public String getCredentialName(){
        return credentialName;
    }

    public String getUserName(){
        return credentialUserName;
    }

    public String getCredentialWebsite(){
        return credentialWebsite;
    }
}
