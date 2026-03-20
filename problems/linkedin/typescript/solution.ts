export {}


enum ApplicationStatus {
    APPLIED = 'APPLIED',
    REVIEWED = 'REVIEWED',
    REJECTED = 'REJECTED'
}
enum JobStatus {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED'
}
enum ConnectionStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    DECLINED = 'DECLINED'
}
enum NotificationType {
    CONNECTION_REQUEST = 'CONNECTION_REQUEST',
    MESSAGE = 'MESSAGE',
    JOB_POSTED = 'JOB_POSTED'
}



interface ProfileInterface {
    userId: number;
    picture: string;
    headline: string;
    summary: string;
    experience: Experience[];   // fix: was string
    education: Education[];     // fix: was string
    skills: string[];
}

interface JobInterface {
    id: number;
    title: string;
    description: string;
    requirements: string[];
    location: string;
    company: Company;
    status: JobStatus;
    postedAt: Date;
}

interface JobApplicationInterface {
    user: User;
    job: Job;               // fix: was missing
    appliedAt: Date;
    status: ApplicationStatus;
}

interface Searchable {
    getSearchableFields(): Map<string, string>
}

interface SearchStrategy {
    search(query: string): Searchable[]
}

interface NotificationFactory {
    createNotification(event: NotificationEvent): Notification
}

interface NotificationObserver {
    onNotify(event: NotificationEvent): void
}

interface INotificationService {
    subscribe(userId: number, observer: NotificationObserver): void
    unsubscribe(userId: number): void
    notify(userId: number, event: NotificationEvent): void
    notifyAll(event: NotificationEvent): void
}

interface IConnectionService {           // fix: was "IConnectionServcie" (typo)
    sendRequest(sender: User, receiver: User): ConnectionRequest
    addConnection(request: ConnectionRequest): Connection
    getConnections(user: User): Connection[]
}

interface IMessagingService {
    sendMessage(sender: User, receiver: User, body: string): Message
    getInbox(user: User): Inbox[]
}

interface IJobService {
    postJob(builder: JobBuilder, postedBy: User): Job  // fix: return type was void
}


class Experience {
    constructor(
        public company: string,
        public role: string,
        public from: Date,
        public to: Date | null
    ) {}
}

class Education {
    constructor(
        public institution: string,
        public degree: string,
        public from: Date,
        public to: Date | null
    ) {}
}


class User implements Searchable, NotificationObserver {
    private static counter = 0;
    id: number;
    name: string;
    email: string;
    password: string;
    profile: Profile;

    constructor(name: string, email: string, password: string, profile?: Profile) {
        this.id = ++User.counter;
        this.name = name;
        this.email = email;
        this.password = password;
        this.profile = profile;
    }

    getSearchableFields(): Map<string, string> {
        const fields = new Map<string, string>();
        fields.set("name", this.name);
        fields.set("email", this.email);
        if (this.profile) {
            fields.set("headline", this.profile.headline);
            fields.set("skills", this.profile.skills.join(","));
        }
        return fields;
    }

    onNotify(event: NotificationEvent): void {
        console.log(`Notification for ${this.name}: ${event.type} from ${event.triggeredBy.name}`);
    }
}

class Profile {
    userId: number;
    picture: string;
    headline: string;
    summary: string;
    experience: Experience[];   // fix: was string
    education: Education[];     // fix: was string
    skills: string[];

    // fix: constructor was commented out — Profile had no way to be initialized
    constructor(userId: number, picture: string, headline: string, summary: string,
        experience: Experience[], education: Education[], skills: string[]) {
        this.userId = userId;
        this.picture = picture;
        this.headline = headline;
        this.summary = summary;
        this.experience = experience;
        this.education = education;
        this.skills = [...skills];
    }

    updateProfile(update: ProfileInterface): void {  // fix: was returning input — should return void
        this.userId = update.userId;
        this.picture = update.picture;
        this.headline = update.headline;
        this.education = update.education;
        this.summary = update.summary;
        this.experience = update.experience;
        this.skills = update.skills;
    }
}

class Company implements Searchable {
    private static counter = 0;
    id: number;
    name: string;
    adminUser: User;

    constructor(name: string, adminUser: User) {
        this.id = ++Company.counter;
        this.name = name;
        this.adminUser = adminUser;
    }

    getSearchableFields(): Map<string, string> {
        const fields = new Map<string, string>();
        fields.set("name", this.name);
        return fields;
    }
}

class Job implements Searchable {
    private static counter = 0;
    id: number;
    title: string;
    description: string;
    requirements: string[];
    location: string;
    company: Company;
    status: JobStatus;
    postedAt: Date;

    constructor(job: JobInterface) {
        this.id = ++Job.counter;  // fix: was comma (,) instead of semicolon (;)
        this.company = job.company;
        this.description = job.description;
        this.title = job.title;
        this.location = job.location;
        this.requirements = job.requirements;
        this.postedAt = job.postedAt;
        this.status = JobStatus.OPEN;
    }

    getSearchableFields(): Map<string, string> {
        const fields = new Map<string, string>();
        fields.set("title", this.title);
        fields.set("company", this.company.name);
        fields.set("description", this.description);
        fields.set("location", this.location);
        fields.set("job_status", this.status);
        return fields;
    }
}

class JobBuilder {
    private job: Partial<JobInterface> = {};

    setTitle(title: string): JobBuilder {
        this.job.title = title;
        return this;
    }

    setDescription(description: string): JobBuilder {
        this.job.description = description;
        return this;
    }

    setRequirements(requirements: string[]): JobBuilder {
        this.job.requirements = requirements;
        return this;
    }

    setLocation(location: string): JobBuilder {
        this.job.location = location;
        return this;
    }

    setCompany(company: Company): JobBuilder {
        this.job.company = company;
        return this;
    }

    build(): Job {
        if (!this.job.title || !this.job.company) {
            throw new Error("Missing required fields: title and company are required");
        }
        return new Job({ ...this.job, postedAt: new Date() } as JobInterface);
    }
}

class JobApplication {
    private static counter = 0;
    id: number;
    user: User;
    job: Job;           // fix: was missing
    appliedAt: Date;
    status: ApplicationStatus;

    constructor(jobApplication: JobApplicationInterface) {
        this.id = ++JobApplication.counter;
        this.user = jobApplication.user;
        this.job = jobApplication.job;  // fix: was missing
        this.appliedAt = jobApplication.appliedAt;
        this.status = jobApplication.status;
    }
}

class Connection {
    userA: User;
    userB: User;
    connectedAt: Date;

    constructor(userA: User, userB: User, connectedAt: Date) {
        this.userA = userA;
        this.userB = userB;
        this.connectedAt = connectedAt;
    }
}

class ConnectionRequest {
    private static counter = 0;
    id: number;
    sender: User;
    receiver: User;
    status: ConnectionStatus;
    sentAt: Date;

    constructor(sender: User, receiver: User, sentAt: Date) {
        this.id = ++ConnectionRequest.counter;
        this.sender = sender;
        this.receiver = receiver;
        this.sentAt = sentAt;
        this.status = ConnectionStatus.PENDING;  // fix: was undefined — never set in constructor
    }

    accept() {
        this.status = ConnectionStatus.ACCEPTED;
    }

    decline() {
        this.status = ConnectionStatus.DECLINED;
    }
}

class Message {
    private static counter = 0;
    id: number;
    sender: User;
    receiver: User;
    sentAt: Date;
    body: string;
    inboxId: number;

    constructor(sender: User, receiver: User, body: string, sentAt: Date, inboxId?: number) {
        this.id = ++Message.counter;
        this.sender = sender;
        this.receiver = receiver;
        this.body = body;
        this.sentAt = sentAt;
        this.inboxId = inboxId;
    }
}

class Inbox {
    private static counter = 0;
    id: number;
    inboxOwner: User;
    participants: User[];
    messages: Message[];
    createdAt: Date;

    constructor(inboxOwner: User, participants: User[], createdAt: Date) {
        this.id = ++Inbox.counter;
        this.inboxOwner = inboxOwner;
        this.participants = participants;
        this.messages = [];   // fix: start with empty messages, add via addMessage()
        this.createdAt = createdAt;
    }

    addMessage(message: Message): void {
        this.messages.push(message);
    }
}

class Notification {
    private static counter = 0;
    id: number;
    user: User;
    type: NotificationType;
    message: string;
    isRead: boolean;
    createdAt: Date;

    constructor(user: User, type: NotificationType, message: string, createdAt: Date) {
        this.id = ++Notification.counter;
        this.user = user;
        this.type = type;
        this.message = message;
        this.isRead = false;
        this.createdAt = createdAt;
    }

    markAsRead(): void {
        this.isRead = true;
    }
}

class NotificationEvent {
    type: NotificationType;
    triggeredBy: User;
    targetUser: User | null;
    payload: object;

    constructor(type: NotificationType, triggeredBy: User, targetUser: User | null, payload: object) {
        this.type = type;
        this.triggeredBy = triggeredBy;
        this.targetUser = targetUser;
        this.payload = payload;
    }
}



class UserSearchStrategy implements SearchStrategy {
    constructor(private users: User[]) {}

    search(query: string): Searchable[] {
        return this.users.filter((user) => {
            for (const value of user.getSearchableFields().values()) {
                if (value.toLowerCase().includes(query.toLowerCase())) return true;
            }
            return false;
        });
    }
}

class JobSearchStrategy implements SearchStrategy {
    constructor(private jobs: Job[]) {}

    search(query: string): Searchable[] {
        return this.jobs.filter((job) => {
            for (const value of job.getSearchableFields().values()) {
                if (value.toLowerCase().includes(query.toLowerCase())) return true;
            }
            return false;
        });
    }
}

class CompanySearchStrategy implements SearchStrategy {
    constructor(private companies: Company[]) {}

    search(query: string): Searchable[] {
        return this.companies.filter((company) => {
            for (const value of company.getSearchableFields().values()) {
                if (value.toLowerCase().includes(query.toLowerCase())) return true;
            }
            return false;
        });
    }
}

class SearchService {
    constructor(private strategy: SearchStrategy) {}

    setStrategy(strategy: SearchStrategy): void {
        this.strategy = strategy;
    }

    executeSearch(query: string): Searchable[] {
        return this.strategy.search(query);
    }
}


class ConnectionNotificationFactory implements NotificationFactory {
    createNotification(event: NotificationEvent): Notification {
        return new Notification(
            event.targetUser,
            event.type,
            `${event.triggeredBy.name} sent you a connection request`,
            new Date()
        );
    }
}

class MessageNotificationFactory implements NotificationFactory {
    createNotification(event: NotificationEvent): Notification {
        return new Notification(
            event.targetUser,
            event.type,
            `${event.triggeredBy.name} has messaged you`,
            new Date()
        );
    }
}

class JobNotificationFactory implements NotificationFactory {
    createNotification(event: NotificationEvent): Notification {
        return new Notification(
            event.targetUser,
            event.type,
            `New job has been posted`,
            new Date()
        );
    }
}

class NotificationFactoryProvider {
    static getFactory(type: NotificationType): NotificationFactory {
        switch (type) {
            case NotificationType.CONNECTION_REQUEST: return new ConnectionNotificationFactory();
            case NotificationType.MESSAGE:            return new MessageNotificationFactory();
            case NotificationType.JOB_POSTED:         return new JobNotificationFactory();
            default: throw new Error(`Unknown notification type: ${type}`);
        }
    }
}

// ════════════════════════════════════════════════════════════════
// SERVICES
// ════════════════════════════════════════════════════════════════

class NotificationServiceImpl implements INotificationService {  // fix: was "NotificationSerivceImpl" (typo)
    private observers: Map<number, NotificationObserver> = new Map();

    subscribe(userId: number, observer: NotificationObserver): void {
        this.observers.set(userId, observer);
    }

    unsubscribe(userId: number): void {
        this.observers.delete(userId);
    }

    notify(userId: number, event: NotificationEvent): void {
        const observer = this.observers.get(userId);
        if (observer) observer.onNotify(event);
    }

    notifyAll(event: NotificationEvent): void {
        for (const observer of this.observers.values()) {
            observer.onNotify(event);
        }
    }
}

class ConnectionServiceImpl implements IConnectionService {
    private requests: ConnectionRequest[] = [];
    private connections: Connection[] = [];

    constructor(private notificationService: INotificationService) {}  // fix: was concrete NotificationSerivceImpl — breaks DIP

    sendRequest(sender: User, receiver: User): ConnectionRequest {
        const request = new ConnectionRequest(sender, receiver, new Date());
        this.requests.push(request);

        const event = new NotificationEvent(NotificationType.CONNECTION_REQUEST, sender, receiver, request);
        this.notificationService.notify(receiver.id, event);
        return request;
    }

    addConnection(request: ConnectionRequest): Connection {
        request.accept();
        const connection = new Connection(request.sender, request.receiver, new Date());
        this.connections.push(connection);
        return connection;
    }

    getConnections(user: User): Connection[] {
        // fix: was only checking userA — connections are bidirectional
        return this.connections.filter(
            (c) => c.userA.id === user.id || c.userB.id === user.id
        );
    }
}

class MessageServiceImpl implements IMessagingService {
    private messages: Message[] = [];   // fix: was uninitialized — would crash on push()
    private inboxes: Inbox[] = [];      // fix: was uninitialized — would crash on push()

    constructor(private notificationService: INotificationService) {}

    private findOrCreateInbox(sender: User, receiver: User): Inbox {
        // fix: was creating a new Inbox for every message — should reuse existing thread
        const existing = this.inboxes.find((box) =>
            box.participants.some((p) => p.id === sender.id) &&
            box.participants.some((p) => p.id === receiver.id)
        );
        if (existing) return existing;

        const inbox = new Inbox(sender, [sender, receiver], new Date());
        this.inboxes.push(inbox);
        return inbox;
    }

    sendMessage(sender: User, receiver: User, body: string): Message {
        const inbox = this.findOrCreateInbox(sender, receiver);
        const message = new Message(sender, receiver, body, new Date(), inbox.id);  // fix: inboxId was never set
        inbox.addMessage(message);
        this.messages.push(message);

        const event = new NotificationEvent(NotificationType.MESSAGE, sender, receiver, message);
        this.notificationService.notify(receiver.id, event);
        return message;
    }

    getInbox(user: User): Inbox[] {
        return this.inboxes.filter((box) =>
            box.participants.some((p) => p.id === user.id)
        );
    }
}

class JobServiceImpl implements IJobService {
    private jobs: Job[] = [];

    constructor(private notificationService: INotificationService) {}

    postJob(builder: JobBuilder, postedBy: User): Job {  // fix: interface had void return type
        const job = builder.build();
        this.jobs.push(job);

        // fix: targetUser was null passed as User — typed as User | null now
        const event = new NotificationEvent(NotificationType.JOB_POSTED, postedBy, null, job);
        this.notificationService.notifyAll(event);
        return job;
    }
}


class LinkedIn {
    private static instance: LinkedIn;  

    private notificationService: INotificationService;
    private connectionService: IConnectionService;
    private messageService: IMessagingService;
    private jobService: IJobService;
    private searchService: SearchService;

    private users: User[] = [];
    private companies: Company[] = [];
    private jobs: Job[] = [];

    private constructor() {
        this.notificationService = new NotificationServiceImpl();
        this.connectionService = new ConnectionServiceImpl(this.notificationService);
        this.messageService = new MessageServiceImpl(this.notificationService);
        this.jobService = new JobServiceImpl(this.notificationService);
        this.searchService = new SearchService(new UserSearchStrategy(this.users));
    }

    static getInstance(): LinkedIn {
        if (!LinkedIn.instance) LinkedIn.instance = new LinkedIn();
        return LinkedIn.instance;
    }

    registerUser(name: string, email: string, password: string): User {
        const user = new User(name, email, password);
        this.users.push(user);
        this.notificationService.subscribe(user.id, user);
        return user;
    }

    registerCompany(name: string, adminUser: User): Company {
        const company = new Company(name, adminUser);
        this.companies.push(company);
        return company;
    }

    postJob(builder: JobBuilder, postedBy: User): Job {
        const job = this.jobService.postJob(builder, postedBy);
        this.jobs.push(job);
        return job;
    }

    applyForJob(user: User, job: Job): JobApplication {
        return new JobApplication({ user, job, appliedAt: new Date(), status: ApplicationStatus.APPLIED });
    }

    sendConnectionRequest(sender: User, receiver: User): ConnectionRequest {
        return this.connectionService.sendRequest(sender, receiver);
    }

    acceptConnection(request: ConnectionRequest): Connection {
        return this.connectionService.addConnection(request);
    }

    sendMessage(sender: User, receiver: User, body: string): Message {
        return this.messageService.sendMessage(sender, receiver, body);
    }

    search(query: string, strategy: SearchStrategy): Searchable[] {
        this.searchService.setStrategy(strategy);
        return this.searchService.executeSearch(query);
    }

    getUsers(): User[] { return this.users; }
    getJobs(): Job[]   { return this.jobs; }
    getCompanies(): Company[] { return this.companies; }
}


function runTests() {
    const linkedin = LinkedIn.getInstance();

    console.log("\n========== TEST 1: Register Users ==========");
    const alice = linkedin.registerUser("Alice", "alice@example.com", "pass123");
    const bob   = linkedin.registerUser("Bob",   "bob@example.com",   "pass456");
    const carol = linkedin.registerUser("Carol", "carol@example.com", "pass789");
    console.log(`Registered: ${alice.name} (id=${alice.id}), ${bob.name} (id=${bob.id}), ${carol.name} (id=${carol.id})`);
    console.assert(alice.id !== bob.id, "FAIL: IDs should be unique");
    console.log("PASS: Users registered with unique IDs");

    console.log("\n========== TEST 2: Update Profile ==========");
    alice.profile = new Profile(
        alice.id, "pic.jpg", "Software Engineer", "Passionate dev",
        [new Experience("Google", "SWE", new Date("2020-01-01"), null)],
        [new Education("MIT", "B.Sc CS", new Date("2016-01-01"), new Date("2020-01-01"))],
        ["TypeScript", "System Design"]
    );
    console.assert(alice.profile.headline === "Software Engineer", "FAIL: Profile not updated");
    console.assert(alice.profile.experience[0].company === "Google", "FAIL: Experience not set");
    console.log(`PASS: Alice profile — headline: "${alice.profile.headline}", skills: [${alice.profile.skills}]`);

    console.log("\n========== TEST 3: Connection Request ==========");
    const request = linkedin.sendConnectionRequest(alice, bob);
    console.assert(request.status === ConnectionStatus.PENDING, "FAIL: Status should be PENDING");
    console.log(`PASS: Request sent — status: ${request.status}`);

    console.log("\n========== TEST 4: Accept Connection ==========");
    const connection = linkedin.acceptConnection(request);
    console.assert(request.status === ConnectionStatus.ACCEPTED, "FAIL: Status should be ACCEPTED");
    console.assert(connection.userA.id === alice.id, "FAIL: userA should be Alice");
    console.assert(connection.userB.id === bob.id,   "FAIL: userB should be Bob");
    console.log(`PASS: Connection established between ${connection.userA.name} and ${connection.userB.name}`);

    console.log("\n========== TEST 5: Decline Connection Request ==========");
    const request2 = linkedin.sendConnectionRequest(carol, alice);
    request2.decline();
    console.assert(request2.status === ConnectionStatus.DECLINED, "FAIL: Status should be DECLINED");
    console.log(`PASS: Carol → Alice request declined — status: ${request2.status}`);

    console.log("\n========== TEST 6: Messaging + Inbox Reuse ==========");
    const msg1 = linkedin.sendMessage(alice, bob, "Hey Bob!");
    const msg2 = linkedin.sendMessage(alice, bob, "How are you?");
    console.assert(msg1.inboxId === msg2.inboxId, "FAIL: Same conversation should share an inbox");
    console.assert(msg1.sender.id === alice.id,   "FAIL: Sender should be Alice");
    console.assert(msg1.receiver.id === bob.id,   "FAIL: Receiver should be Bob");
    console.log(`PASS: Messages sent in same inbox (inboxId=${msg1.inboxId})`);

    console.log("\n========== TEST 7: Register Company + Post Job ==========");
    const company = linkedin.registerCompany("Anthropic", alice);
    const builder = new JobBuilder()
        .setTitle("Backend Engineer")
        .setDescription("Build scalable APIs")
        .setRequirements(["Node.js", "TypeScript"])
        .setLocation("Remote")
        .setCompany(company);
    const job = linkedin.postJob(builder, alice);
    console.assert(job.title === "Backend Engineer", "FAIL: Job title mismatch");
    console.assert(job.status === JobStatus.OPEN,    "FAIL: Job should be OPEN");
    console.assert(job.company.name === "Anthropic", "FAIL: Company mismatch");
    console.log(`PASS: Job posted — "${job.title}" at ${job.company.name}, status: ${job.status}`);

    console.log("\n========== TEST 8: JobBuilder validation ==========");
    try {
        new JobBuilder().setTitle("No Company").build();
        console.log("FAIL: Should have thrown for missing company");
    } catch (e) {
        console.log(`PASS: JobBuilder threw as expected — "${(e as Error).message}"`);
    }

    console.log("\n========== TEST 9: Apply for Job ==========");
    const application = linkedin.applyForJob(bob, job);
    console.assert(application.user.id === bob.id, "FAIL: Applicant should be Bob");
    console.assert(application.job.id === job.id,  "FAIL: Job reference mismatch");
    console.assert(application.status === ApplicationStatus.APPLIED, "FAIL: Status should be APPLIED");
    console.log(`PASS: ${application.user.name} applied for "${application.job.title}" — status: ${application.status}`);

    console.log("\n========== TEST 10: Search Users (Strategy Pattern) ==========");
    const userResults = linkedin.search("Alice", new UserSearchStrategy(linkedin.getUsers()));
    console.assert(userResults.length === 1, `FAIL: Expected 1 result, got ${userResults.length}`);
    console.log(`PASS: User search for "Alice" returned ${userResults.length} result`);

    console.log("\n========== TEST 11: Search Jobs (Strategy swap) ==========");
    const jobResults = linkedin.search("Remote", new JobSearchStrategy(linkedin.getJobs()));
    console.assert(jobResults.length === 1, `FAIL: Expected 1 job, got ${jobResults.length}`);
    console.log(`PASS: Job search for "Remote" returned ${jobResults.length} result`);

    console.log("\n========== TEST 12: Search Companies ==========");
    const companyResults = linkedin.search("Anthropic", new CompanySearchStrategy(linkedin.getCompanies()));
    console.assert(companyResults.length === 1, `FAIL: Expected 1 company, got ${companyResults.length}`);
    console.log(`PASS: Company search for "Anthropic" returned ${companyResults.length} result`);

    console.log("\n========== TEST 13: Notification Factory ==========");
    const event = new NotificationEvent(NotificationType.CONNECTION_REQUEST, alice, bob, request);
    const factory = NotificationFactoryProvider.getFactory(NotificationType.CONNECTION_REQUEST);
    const notification = factory.createNotification(event);
    console.assert(notification.isRead === false,                   "FAIL: New notification should be unread");
    console.assert(notification.type === NotificationType.CONNECTION_REQUEST, "FAIL: Type mismatch");
    notification.markAsRead();
    console.assert(notification.isRead === true, "FAIL: markAsRead() did not work");
    console.log(`PASS: Notification created — type: ${notification.type}, isRead after markAsRead: ${notification.isRead}`);

    console.log("\n========== TEST 14: Singleton ==========");
    const linkedin2 = LinkedIn.getInstance();
    console.assert(linkedin === linkedin2, "FAIL: LinkedIn should be a singleton");
    console.log("PASS: LinkedIn.getInstance() returns the same instance");

    console.log("\n========== ALL TESTS PASSED ✓ ==========\n");
}

runTests();
