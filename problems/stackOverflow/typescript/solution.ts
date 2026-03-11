export {};

// ========================
// Enums & Constants
// ========================

enum VoteType {
    UPVOTE = 1,
    DOWNVOTE = -1
}

const REPUTATION = {
    QUESTION_UPVOTE: 5,
    QUESTION_DOWNVOTE: -2,
    ANSWER_UPVOTE: 10,
    ANSWER_DOWNVOTE: -2,
    ANSWER_ACCEPTED: 15,
}

// ========================
// Tag
// ========================

class Tag {
    private static idCounter = 0;
    readonly id: number;
    readonly name: string;

    constructor(name: string) {
        this.id = ++Tag.idCounter;
        this.name = name.toLowerCase();
    }
}

// ========================
// Comment
// ========================

class Comment {
    private static idCounter = 0;
    readonly id: number;
    readonly body: string;
    readonly author: User;
    readonly createdAt: Date;

    constructor(body: string, author: User) {
        this.id = ++Comment.idCounter;
        this.body = body;
        this.author = author;
        this.createdAt = new Date();
    }
}

// ========================
// User
// ========================

class User {
    private static idCounter = 0;
    readonly id: number;
    readonly name: string;
    readonly email: string;
    private reputation: number = 0;
    private questions: Question[] = [];
    private answers: Answer[] = [];

    constructor(name: string, email: string) {
        this.id = ++User.idCounter;
        this.name = name;
        this.email = email;
    }

    getReputation(): number {
        return this.reputation;
    }

    updateReputation(delta: number): void {
        this.reputation += delta;
    }

    addQuestion(q: Question): void {
        this.questions.push(q);
    }

    addAnswer(a: Answer): void {
        this.answers.push(a);
    }

    getQuestions(): Question[] {
        return [...this.questions];
    }

    getAnswers(): Answer[] {
        return [...this.answers];
    }
}

// ========================
// Answer
// ========================

class Answer {
    private static idCounter = 0;
    readonly id: number;
    readonly body: string;
    readonly author: User;
    readonly questionId: number;
    readonly createdAt: Date;
    private votes: Map<number, VoteType> = new Map(); // userId -> vote
    private comments: Comment[] = [];
    private accepted: boolean = false;

    constructor(body: string, author: User, questionId: number) {
        this.id = ++Answer.idCounter;
        this.body = body;
        this.author = author;
        this.questionId = questionId;
        this.createdAt = new Date();
    }

    vote(user: User, voteType: VoteType): void {
        if (user.id === this.author.id) {
            console.log("  [Blocked] Cannot vote on your own answer.");
            return;
        }

        const existing = this.votes.get(user.id);
        if (existing === voteType) {
            console.log("  [Blocked] Already voted with the same type.");
            return;
        }

        // Revert previous vote's reputation effect
        if (existing !== undefined) {
            const revert = existing === VoteType.UPVOTE ? -REPUTATION.ANSWER_UPVOTE : -REPUTATION.ANSWER_DOWNVOTE;
            this.author.updateReputation(revert);
        }

        this.votes.set(user.id, voteType);
        const delta = voteType === VoteType.UPVOTE ? REPUTATION.ANSWER_UPVOTE : REPUTATION.ANSWER_DOWNVOTE;
        this.author.updateReputation(delta);
    }

    addComment(comment: Comment): void {
        this.comments.push(comment);
    }

    accept(): void {
        if (!this.accepted) {
            this.accepted = true;
            this.author.updateReputation(REPUTATION.ANSWER_ACCEPTED);
        }
    }

    getVoteCount(): number {
        let count = 0;
        this.votes.forEach(v => (count += v));
        return count;
    }

    getComments(): Comment[] {
        return [...this.comments];
    }

    isAccepted(): boolean {
        return this.accepted;
    }
}

// ========================
// Question
// ========================

class Question {
    private static idCounter = 0;
    readonly id: number;
    readonly title: string;
    readonly body: string;
    readonly author: User;
    readonly createdAt: Date;
    private tags: Tag[];
    private answers: Answer[] = [];
    private comments: Comment[] = [];
    private votes: Map<number, VoteType> = new Map(); // userId -> vote
    private acceptedAnswerId: number | null = null;

    constructor(title: string, body: string, author: User, tags: Tag[]) {
        this.id = ++Question.idCounter;
        this.title = title;
        this.body = body;
        this.author = author;
        this.tags = tags;
        this.createdAt = new Date();
    }

    vote(user: User, voteType: VoteType): void {
        if (user.id === this.author.id) {
            console.log("  [Blocked] Cannot vote on your own question.");
            return;
        }

        const existing = this.votes.get(user.id);
        if (existing === voteType) {
            console.log("  [Blocked] Already voted with the same type.");
            return;
        }

        // Revert previous vote's reputation effect
        if (existing !== undefined) {
            const revert = existing === VoteType.UPVOTE ? -REPUTATION.QUESTION_UPVOTE : -REPUTATION.QUESTION_DOWNVOTE;
            this.author.updateReputation(revert);
        }

        this.votes.set(user.id, voteType);
        const delta = voteType === VoteType.UPVOTE ? REPUTATION.QUESTION_UPVOTE : REPUTATION.QUESTION_DOWNVOTE;
        this.author.updateReputation(delta);
    }

    addAnswer(answer: Answer): void {
        this.answers.push(answer);
    }

    addComment(comment: Comment): void {
        this.comments.push(comment);
    }

    acceptAnswer(requestingUser: User, answerId: number): void {
        if (requestingUser.id !== this.author.id) {
            console.log("  [Blocked] Only the question author can accept an answer.");
            return;
        }
        const answer = this.answers.find(a => a.id === answerId);
        if (!answer) {
            console.log("  [Error] Answer not found.");
            return;
        }
        this.acceptedAnswerId = answerId;
        answer.accept();
    }

    getTags(): Tag[] {
        return [...this.tags];
    }

    getAnswers(): Answer[] {
        return [...this.answers];
    }

    getComments(): Comment[] {
        return [...this.comments];
    }

    getVoteCount(): number {
        let count = 0;
        this.votes.forEach(v => (count += v));
        return count;
    }

    getAcceptedAnswerId(): number | null {
        return this.acceptedAnswerId;
    }
}

// ========================
// StackOverflow System (Singleton)
// ========================

class StackOverflowSystem {
    private static instance: StackOverflowSystem;
    private users: Map<number, User> = new Map();
    private questions: Map<number, Question> = new Map();
    private tags: Map<string, Tag> = new Map();

    private constructor() {}

    static getInstance(): StackOverflowSystem {
        if (!StackOverflowSystem.instance) {
            StackOverflowSystem.instance = new StackOverflowSystem();
        }
        return StackOverflowSystem.instance;
    }

    registerUser(name: string, email: string): User {
        const user = new User(name, email);
        this.users.set(user.id, user);
        return user;
    }

    private getOrCreateTag(name: string): Tag {
        const key = name.toLowerCase();
        if (!this.tags.has(key)) {
            this.tags.set(key, new Tag(name));
        }
        return this.tags.get(key)!;
    }

    postQuestion(author: User, title: string, body: string, tagNames: string[]): Question {
        const tags = tagNames.map(t => this.getOrCreateTag(t));
        const question = new Question(title, body, author, tags);
        this.questions.set(question.id, question);
        author.addQuestion(question);
        return question;
    }

    postAnswer(author: User, questionId: number, body: string): Answer | null {
        const question = this.questions.get(questionId);
        if (!question) {
            console.log("  [Error] Question not found.");
            return null;
        }
        const answer = new Answer(body, author, questionId);
        question.addAnswer(answer);
        author.addAnswer(answer);
        return answer;
    }

    commentOnQuestion(author: User, questionId: number, body: string): Comment | null {
        const question = this.questions.get(questionId);
        if (!question) {
            console.log("  [Error] Question not found.");
            return null;
        }
        const comment = new Comment(body, author);
        question.addComment(comment);
        return comment;
    }

    commentOnAnswer(author: User, answer: Answer, body: string): Comment {
        const comment = new Comment(body, author);
        answer.addComment(comment);
        return comment;
    }

    voteOnQuestion(user: User, questionId: number, voteType: VoteType): void {
        const question = this.questions.get(questionId);
        if (!question) {
            console.log("  [Error] Question not found.");
            return;
        }
        question.vote(user, voteType);
    }

    voteOnAnswer(user: User, answer: Answer, voteType: VoteType): void {
        answer.vote(user, voteType);
    }

    acceptAnswer(questionAuthor: User, questionId: number, answerId: number): void {
        const question = this.questions.get(questionId);
        if (!question) {
            console.log("  [Error] Question not found.");
            return;
        }
        question.acceptAnswer(questionAuthor, answerId);
    }

    // Search by keyword in title or body
    searchByKeyword(keyword: string): Question[] {
        const kw = keyword.toLowerCase();
        return Array.from(this.questions.values()).filter(
            q => q.title.toLowerCase().includes(kw) || q.body.toLowerCase().includes(kw)
        );
    }

    // Search by tag name
    searchByTag(tagName: string): Question[] {
        const tag = tagName.toLowerCase();
        return Array.from(this.questions.values()).filter(q =>
            q.getTags().some(t => t.name === tag)
        );
    }

    // Search by user (returns questions posted by that user)
    searchByUser(userId: number): Question[] {
        const user = this.users.get(userId);
        if (!user) return [];
        return user.getQuestions();
    }
}

// ========================
// Test Suite
// ========================

class TestStackOverflow {
    static run() {
        const system = StackOverflowSystem.getInstance();

        console.log("=== Stack Overflow LLD - Test Suite ===\n");

        // --- Setup users ---
        const alice = system.registerUser("Alice", "alice@example.com");
        const bob = system.registerUser("Bob", "bob@example.com");
        const charlie = system.registerUser("Charlie", "charlie@example.com");

        // --- Test 1: Post questions ---
        console.log("Test 1: Posting questions");
        const q1 = system.postQuestion(
            alice,
            "How does async/await work in JavaScript?",
            "I want to understand async/await with examples.",
            ["javascript", "async", "promises"]
        );
        const q2 = system.postQuestion(
            bob,
            "Difference between null and undefined in JS?",
            "When should I use null vs undefined in JavaScript?",
            ["javascript", "basics"]
        );
        console.log(`  Alice posted: "${q1.title}" [tags: ${q1.getTags().map(t => t.name).join(", ")}]`);
        console.log(`  Bob posted: "${q2.title}" [tags: ${q2.getTags().map(t => t.name).join(", ")}]`);

        // --- Test 2: Post answers ---
        console.log("\nTest 2: Posting answers");
        const a1 = system.postAnswer(bob, q1.id, "async/await is syntactic sugar over Promises. Use await inside async functions.");
        const a2 = system.postAnswer(charlie, q1.id, "It allows writing asynchronous code in a synchronous style using the event loop.");
        console.log(`  Bob answered q1.`);
        console.log(`  Charlie answered q1.`);

        // --- Test 3: Comments ---
        console.log("\nTest 3: Commenting on questions and answers");
        system.commentOnQuestion(charlie, q1.id, "Great question! Fundamentals matter.");
        if (a1) system.commentOnAnswer(alice, a1, "Thanks, very clear!");
        console.log(`  Charlie commented on q1.`);
        console.log(`  Alice commented on Bob's answer.`);
        console.log(`  q1 comments: ${q1.getComments().length}, a1 comments: ${a1?.getComments().length}`);

        // --- Test 4: Voting on questions ---
        console.log("\nTest 4: Voting on questions");
        system.voteOnQuestion(bob, q1.id, VoteType.UPVOTE);
        system.voteOnQuestion(charlie, q1.id, VoteType.UPVOTE);
        console.log(`  Alice's reputation after 2 upvotes on q1: ${alice.getReputation()} (expected: ${2 * REPUTATION.QUESTION_UPVOTE})`);
        console.log(`  q1 vote count: ${q1.getVoteCount()}`);

        // --- Test 5: Voting on answers ---
        console.log("\nTest 5: Voting on answers");
        if (a1) {
            system.voteOnAnswer(alice, a1, VoteType.UPVOTE);
            system.voteOnAnswer(charlie, a1, VoteType.UPVOTE);
            console.log(`  Bob's reputation after 2 upvotes on his answer: ${bob.getReputation()} (expected: ${2 * REPUTATION.ANSWER_UPVOTE})`);
        }

        // --- Test 6: Self-vote prevention ---
        console.log("\nTest 6: Self-vote prevention");
        system.voteOnQuestion(alice, q1.id, VoteType.UPVOTE);
        if (a1) system.voteOnAnswer(bob, a1, VoteType.UPVOTE);

        // --- Test 7: Duplicate vote prevention ---
        console.log("\nTest 7: Duplicate vote prevention");
        system.voteOnQuestion(bob, q1.id, VoteType.UPVOTE);

        // --- Test 8: Vote change (upvote -> downvote) ---
        console.log("\nTest 8: Vote change (charlie switches from upvote to downvote on q1)");
        const aliceRepBefore = alice.getReputation();
        system.voteOnQuestion(charlie, q1.id, VoteType.DOWNVOTE);
        console.log(`  Alice's rep before: ${aliceRepBefore}, after: ${alice.getReputation()}`);
        console.log(`  q1 vote count after change: ${q1.getVoteCount()} (bob=+1, charlie=-1 → expected: 0)`);

        // --- Test 9: Accept an answer ---
        console.log("\nTest 9: Accepting an answer");
        if (a1) {
            const bobRepBefore = bob.getReputation();
            system.acceptAnswer(alice, q1.id, a1.id);
            console.log(`  Bob's rep before accept: ${bobRepBefore}, after: ${bob.getReputation()} (+${REPUTATION.ANSWER_ACCEPTED})`);
            console.log(`  a1 isAccepted: ${a1.isAccepted()}`);
        }

        // Non-author trying to accept
        console.log("\n  (charlie tries to accept an answer on alice's question)");
        if (a2) system.acceptAnswer(charlie, q1.id, a2.id);

        // --- Test 10: Search by keyword ---
        console.log("\nTest 10: Search by keyword");
        const kwResults = system.searchByKeyword("async");
        console.log(`  Keyword 'async': ${kwResults.length} result(s): "${kwResults.map(q => q.title).join('", "')}"`);

        // --- Test 11: Search by tag ---
        console.log("\nTest 11: Search by tag");
        const tagResults = system.searchByTag("javascript");
        console.log(`  Tag 'javascript': ${tagResults.length} result(s): "${tagResults.map(q => q.title).join('", "')}"`);

        const asyncTagResults = system.searchByTag("async");
        console.log(`  Tag 'async': ${asyncTagResults.length} result(s): "${asyncTagResults.map(q => q.title).join('", "')}"`);

        // --- Test 12: Search by user ---
        console.log("\nTest 12: Search by user");
        const aliceQs = system.searchByUser(alice.id);
        const bobQs = system.searchByUser(bob.id);
        console.log(`  Questions by Alice: ${aliceQs.length} (expected: 1)`);
        console.log(`  Questions by Bob: ${bobQs.length} (expected: 1)`);

        // --- Final reputation summary ---
        console.log("\n=== Final Reputation Scores ===");
        console.log(`  Alice:   ${alice.getReputation()}`);
        console.log(`  Bob:     ${bob.getReputation()}`);
        console.log(`  Charlie: ${charlie.getReputation()}`);

        console.log("\n=== All tests completed ===");
    }
}

TestStackOverflow.run();
