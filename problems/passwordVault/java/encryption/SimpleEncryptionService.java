package problems.passwordVault.java.encryption;

import java.util.Base64;

public class SimpleEncryptionService implements EncryptionService {
    @Override
    public String encrypt(String plainText){
        return Base64.getEncoder().encodeToString(plainText.getBytes());
    }

    @Override
    public String decrypt(String encryptedtext){
        return new String(Base64.getDecoder().decode(encryptedtext));
    }
}
