package problems.passwordVault.java.repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import problems.passwordVault.java.model.Credential;

public class InMemoryCredentialRepository implements CredentialRepository {
    private final Map<Integer, Credential> store = new HashMap<>();
    @Override()
    public void save(Credential credential){
        store.put(credential.getId(), credential);
    }

    @Override()
    public void delete(int id){
        store.remove(id);
    }

    @Override()
    public Credential findById(int id){
        return store.get(id);
    }

    @Override()
    public List<Credential> findByUser(int userId){
        List<Credential>userCred = new ArrayList<>();
        for(Credential c : store.values()){
            if(c.getUser().getId()==userId){
                userCred.add(c);
            }
        }
        return userCred;
    }

    @Override()
    public void update(Credential credential){
        store.put(credential.getId(), credential);
    }
}
