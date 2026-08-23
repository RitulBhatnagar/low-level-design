package problems.passwordVault.java;

import problems.passwordVault.java.encryption.EncryptionService;
import problems.passwordVault.java.encryption.AESEncryptionService;
import problems.passwordVault.java.model.Credential;
import problems.passwordVault.java.model.CredentialSummary;
import problems.passwordVault.java.model.User;
import problems.passwordVault.java.repository.CredentialRepository;
import problems.passwordVault.java.repository.InMemoryCredentialRepository;
import problems.passwordVault.java.vault.PasswordVault;

import java.util.List;

public class Main {
    public static void main(String[] args) {
        CredentialRepository repository = new InMemoryCredentialRepository();
        EncryptionService encryptionService = new AESEncryptionService("1234567890123456");
        PasswordVault vault = new PasswordVault(repository, encryptionService);

        User user = new User("Ritul", "ritul@example.com", "hashedMasterPassword");

        Credential gmail = vault.addCredential(user, "Gmail", "ritul@gmail.com", "myGmailPass123", "gmail.com");
        Credential github = vault.addCredential(user, "GitHub", "ritul-dev", "myGitHubPass456", "github.com");
        System.out.println("Added: " + gmail.getCredentialName() + " (id=" + gmail.getId() + ")");
        System.out.println("Added: " + github.getCredentialName() + " (id=" + github.getId() + ")");

        System.out.println("\n-- List (no passwords exposed) --");
        List<CredentialSummary> summaries = vault.listCredentials(user.getId());
        for (CredentialSummary s : summaries) {
            System.out.println(s.getId() + ": " + s.getCredentialName() + " | " + s.getUserName() + " | " + s.getCredentialWebsite());
        }

        System.out.println("\n-- Retrieve single credential --");
        Credential fetched = vault.retrieveCredential(gmail.getId());
        System.out.println("Encrypted password stored: " + fetched.getCredentialEncryptedPassword());
        System.out.println("Decrypted password: " + vault.retrievePlainPassword(gmail.getId()));

        System.out.println("\n-- Update credential --");
        Credential updated = vault.updateCredential(github.getId(), "GitHub", "ritul-dev", "newGitHubPass789", "github.com");
        System.out.println("Updated password decrypts to: " + vault.retrievePlainPassword(updated.getId()));

        System.out.println("\n-- Delete credential --");
        vault.deleteCredential(gmail.getId());
        try {
            vault.retrieveCredential(gmail.getId());
        } catch (java.util.NoSuchElementException e) {
            System.out.println("Confirmed deleted: " + e.getMessage());
        }
    }
}