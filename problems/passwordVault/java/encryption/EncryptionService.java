package problems.passwordVault.java.encryption;


public interface EncryptionService {
    String encrypt(String plainText);
    String decrypt(String encryptedtext);
}
