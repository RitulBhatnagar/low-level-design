# Designing a Professional Networking Platform like LinkedIn

## Requirements

### Functional Requirements

#### User Registration and Authentication
 - Users should be able to create an account with their professional information, such as name, email, and password.
 - Users should be able to log in and log out of their accounts securely.

#### User Profiles
 - Each user should have a profile with their professional information, such as profile picture, headline, summary, experience, education, and skills.
 - Users should be able to update their profile information.

#### Connections
 - Users should be able to send connection requests to other users.
 - Users should be able to accept or decline connection requests.
 - Users should be able to view their list of connections.

#### Messaging
 - Users should be able to send messages to their connections.
 - Users should be able to view their inbox and sent messages.

#### Job Postings
 - Employers should be able to post job listings with details such as title, description, requirements, and location.
 - Users should be able to view and apply for job postings.

#### Search Functionality
 - Users should be able to search for other users, companies, and job postings based on relevant criteria.
 - Search results should be ranked based on relevance and user preferences.

#### Notifications
 - Users should receive notifications for events such as connection requests, messages, and job postings.
 - Notifications should be delivered in real-time.


## Core Entites
 1.  `User`
 2.  `Profile`
 3.  `Connection`
 4.  `ConnectionRequest`
 5.  `Message`
 6.  `Company`
 7.  `Job`
 8.  `JobApplication`
 9.  `Notification`
 10. `Inbox`
 11. `SearchStrategy` -> interface for searching
 12. `AuthService`
 13. `LinkedIn` -> main class (Singleton)

 ## Class Diagram

 ```
  // ════════════════════════════════════════════════════════════════
  // ENUMS
  // ════════════════════════════════════════════════════════════════

  enum ApplicationStatus  { APPLIED, REVIEWED, REJECTED }
  enum JobStatus          { OPEN, CLOSED }
  enum ConnectionStatus   { PENDING, ACCEPTED, DECLINED }
  enum NotificationType   { CONNECTION_REQUEST, MESSAGE, JOB_POSTED }


  // ════════════════════════════════════════════════════════════════
  // INTERFACES  (abstraction layer — OCP + ISP)
  // ════════════════════════════════════════════════════════════════

  interface Searchable                         
  |- getSearchableFields() : Map<String, String>

  interface NotificationObserver             
  |- onNotify(event: NotificationEvent)

  interface SearchStrategy                     
  |- search(query: String) : List<Searchable>

  interface IConnectionService                  // DIP: depend on abstraction
  |- sendRequest(senderId, receiverId) : ConnectionRequest
  |- addConnection(requestId)          : Connection
  |- getConnections(userId)            : Connection[]

  interface IMessageService                     // DIP
  |- sendMessage(senderId, receiverId, body) : Message
  |- getInbox(userId)                        : Inbox[]

  interface INotificationService                // DIP
  |- subscribe(userId, observer)
  |- unsubscribe(userId)
  |- notify(userId, event: NotificationEvent)

  interface NotificationFactory                 // Factory pattern — OCP: add new type without changing service
  |- createNotification(event: NotificationEvent) : Notification


  User implements NotificationObserver, Searchable
  |- id       : Number
  |- name     : String
  |- email    : String
  |- password : String
  |- profile  : Profile
  |- onNotify(event)                            // Observer: receives real-time events
  |- getSearchableFields()                      // Searchable

  Profile
  |- userId     : String
  |- picture    : String
  |- headline   : String
  |- summary    : String
  |- experience : Experience[]              // fixed: was String
  |- education  : Education[]               // fixed: was String
  |- skills     : String[]
  |- updateProfile()

  Company implements Searchable
  |- id        : Number
  |- name      : String
  |- adminUser : User
  |- getSearchableFields()

  Job implements Searchable                     // Builder pattern used to construct Job
  |- id           : Number
  |- title        : String
  |- description  : String
  |- requirements : String[]
  |- location     : String
  |- company      : Company
  |- status       : JobStatus
  |- postedAt     : DateTime
  |- getSearchableFields()

  JobBuilder                                    // Builder pattern — Job has many optional fields
  |- job             : Job                      // fixed: missing internal state field
  |- setTitle(title)         : JobBuilder
  |- setDescription(desc)    : JobBuilder
  |- setRequirements(req[])  : JobBuilder
  |- setLocation(loc)        : JobBuilder
  |- setCompany(company)     : JobBuilder
  |- build()                 : Job

  JobApplication
  |- id        : Number
  |- user      : User
  |- job       : Job
  |- appliedAt : DateTime
  |- status    : ApplicationStatus

  Connection                                    // established link — no status needed here
  |- userA       : User
  |- userB       : User
  |- connectedAt : DateTime

  ConnectionRequest
  |- id       : Number
  |- sender   : User
  |- receiver : User
  |- status   : ConnectionStatus
  |- sentAt   : DateTime
  |- accept()                                   // changes status → ACCEPTED
  |- decline()                                  // changes status → DECLINED

  Message
  |- id       : Number
  |- body     : String
  |- sender   : User
  |- receiver : User
  |- sentAt   : DateTime
  |- inboxId  : String

  Inbox                                         // conversation thread between two users
  |- id           : Number
  |- participants : User[]
  |- messages     : Message[]
  |- createdAt    : DateTime

  Notification
  |- id        : Number
  |- user      : User
  |- type      : NotificationType
  |- message   : String
  |- isRead    : Boolean
  |- createdAt : DateTime
  |- markAsRead()                               // fixed: was "notifcationRead" (typo)

  NotificationEvent                             // payload passed through Observer
  |- type        : NotificationType
  |- triggeredBy : User
  |- payload     : Object                       // ConnectionRequest | Message | Job

  Feed
  |- id    : Number                             // fixed: was String (inconsistent with other IDs)
  |- user  : User
  |- items : FeedItem[]

  abstract FeedItem                             // abstract — concrete subclasses per type
  |- id        : Number                         // fixed: was String
  |- createdAt : DateTime
  |- getContent() : String                      // abstract

  JobFeedItem extends FeedItem
  |- job : Job
  |- getContent()

  ConnectionFeedItem extends FeedItem
  |- connection : Connection
  |- getContent()


  // ════════════════════════════════════════════════════════════════
  // SERVICES  (business logic — implement interfaces)
  // ════════════════════════════════════════════════════════════════

  AuthService                                   // SRP: only handles auth
  |- login(email, password) : User
  |- logout(userId)

  ConnectionServiceImpl implements IConnectionService
  |- sendRequest(senderId, receiverId) : ConnectionRequest
  |- addConnection(requestId)          : Connection
  |- getConnections(userId)            : Connection[]

  MessageServiceImpl implements IMessageService
  |- sendMessage(senderId, receiverId, body) : Message
  |- getInbox(userId)                        : Inbox[]

  NotificationServiceImpl implements INotificationService   // Observer Subject
  |- observers : Map<userId, NotificationObserver>
  |- subscribe(userId, observer)
  |- unsubscribe(userId)
  |- notify(userId, event)


  // ════════════════════════════════════════════════════════════════
  // FACTORIES  (OCP: new notification type = new factory, no existing changes)
  // ════════════════════════════════════════════════════════════════

  ConnectionNotificationFactory implements NotificationFactory
  |- createNotification(event) : Notification

  MessageNotificationFactory implements NotificationFactory
  |- createNotification(event) : Notification

  JobNotificationFactory implements NotificationFactory
  |- createNotification(event) : Notification


  // ════════════════════════════════════════════════════════════════
  // SEARCH  (Strategy pattern — swap algorithm without changing SearchService)
  // ════════════════════════════════════════════════════════════════

  UserSearchStrategy implements SearchStrategy
  |- search(query) : List<User>

  JobSearchStrategy implements SearchStrategy
  |- search(query) : List<Job>

  CompanySearchStrategy implements SearchStrategy
  |- search(query) : List<Company>

  SearchService
  |- strategy : SearchStrategy
  |- setStrategy(strategy)
  |- executeSearch(query) : List<Searchable>


  // ════════════════════════════════════════════════════════════════
  // MAIN CLASS  (Singleton + Facade)
  // ════════════════════════════════════════════════════════════════

  LinkedIn                                    
  |- instance : LinkedIn                        
  |- connectionService : IConnectionService
  |- messageService    : IMessageService
  |- notificationService : INotificationService
  |- searchService     : SearchService
  |- authService       : AuthService
  |
  |- getInstance() : LinkedIn                   
  |- private LinkedIn()                        
  |
  |- registerUser(name, email, password) : User
  |- registerCompany(name, adminUserId)  : Company
  |- postJob(companyId, builder)         : Job
  |- applyForJob(userId, jobId)          : JobApplication
  |- search(query, strategy)             : List<Searchable>
 ```


