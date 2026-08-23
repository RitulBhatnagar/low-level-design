# Design password vault system

## Requirements

### Functional Requirements
- user should be able to add, delete, retrive, update and list all the saved credentials
- password should not be stored as a plain text

### Non functional requirements
- Vault should be extensible to different storage systems
- Encryption logic should be separated from business logic

## Core entites
1. `user`
2. `Credential`
3. `PasswordVault`

## Class Diagrams

```

User
|-id : number
|- name : string
|- email : string
|- passwordHash : string

Credential
|- id : number
|- user : User
|- credentialEncryptedPassword : string
|- credentialName : string
|- credentialUserName : string
|- credentialWebsite : string


CredentialSummary          
|- id
|- credentialName
|- credentialUserName
|- credentialWebsite

EncryptionService (interface)
|- encrypt(plainText) : string
|- decrypt(encryptedText). : string

CredentialRepository(inteface)
|- save(Credential)
|- delete(id)
|- findById(id) : Credential
|- findByUser(userId) : List<Credential>
|- update(Credential)

PasswordVault
|- repository : CredentialRepository
|- encryptionService : EncryptionService
|- addCredential(userId, name, username, plainPassword, website)  : Credential
|- deleteCredential(credentialId)
|- listCredentials(userId) : List<Credential>
|- retrieveCredential(credentialId): Credential // decrypts before return
|- updateCredential(credentialId, ...)

```