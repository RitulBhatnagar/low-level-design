package problems.passwordVault.java.vault;

import problems.passwordVault.java.encryption.EncryptionService;
import problems.passwordVault.java.model.Credential;
import problems.passwordVault.java.model.CredentialSummary;
import problems.passwordVault.java.repository.CredentialRepository;
import problems.passwordVault.java.model.User;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

public class PasswordVault {
    private final CredentialRepository repository;
    private final EncryptionService encryptionService;

    public PasswordVault(CredentialRepository repository, EncryptionService encryptionService){
        this.repository = repository;
        this.encryptionService = encryptionService;
    }

    public Credential addCredential(User user, String name, String username, String plainPassword, String website){
        if(plainPassword==null || plainPassword.isBlank()){
            throw new IllegalArgumentException("Password cannot be empty");
        }
        String encryptedPass = this.encryptionService.encrypt(plainPassword);
        Credential credential = new Credential(user, name, encryptedPass, username, website);
        this.repository.save(credential);
        return credential;
    }

    public void deleteCredential(int credentialId){
        this.repository.delete(credentialId);
    }

    public Credential retrieveCredential(int id){
        Credential credential = this.repository.findById(id);
        if(credential == null){
            throw new NoSuchElementException("Credential not found: " + id);
        }
        return credential;
    }

    public String retrievePlainPassword(int id){
        Credential credential = retrieveCredential(id);
        return this.encryptionService.decrypt(credential.getCredentialEncryptedPassword());
    }

    public Credential updateCredential(int credentialId, String name, String username, String plainPassword, String website){
        Credential existing = retrieveCredential(credentialId);
        if(plainPassword==null || plainPassword.isBlank()){
            throw new IllegalArgumentException("Password cannot be empty");
        }
        String encryptedPass = this.encryptionService.encrypt(plainPassword);
        Credential updated = new Credential(existing.getUser(), name, encryptedPass, username, website, existing.getId());
        this.repository.update(updated);
        return updated;
    }

    public List<CredentialSummary> listCredentials(int userId){
        List<Credential>creds =  this.repository.findByUser(userId);
        List<CredentialSummary>answer = new ArrayList<>();

        for(Credential c : creds){
            answer.add(new CredentialSummary(c.getId(), c.getCredentialName(), c.getCredentialUserName(), c.getCredentialWebsite()));
        }
        return answer;
    }
}
