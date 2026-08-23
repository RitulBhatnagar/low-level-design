package problems.passwordVault.java.repository;

import problems.passwordVault.java.model.Credential;
import java.util.List;

public interface CredentialRepository {
    void save(Credential credential);
    void delete(int id);
    Credential findById(int id);
    List<Credential> findByUser(int userId);
    void update(Credential credential);
} 