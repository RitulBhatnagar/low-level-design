# Designing Stack Overflow

## Problem Statement

Design a simplified version of **Stack Overflow** — a Q&A platform where users can post questions, provide answers, comment, and vote. The system should manage user reputation and support searching.

---

## Requirements

### Functional Requirements

- Users can **post questions**, **answer questions**, and **comment** on both questions and answers.
- Users can **upvote or downvote** questions and answers.
- Questions must have one or more **tags** associated with them.
- Users can **search** for questions by:
  - Keywords (in title or body)
  - Tags
  - User profile
- The system should **assign and update reputation scores** to users based on activity:
  - Question upvoted: `+5`
  - Question downvoted: `−2`
  - Answer upvoted: `+10`
  - Answer downvoted: `−2`
  - Answer accepted: `+15`
- The **question author** can mark one answer as **accepted**.

### Non-Functional Requirements

- The system should handle **concurrent access** safely (no duplicate votes).
- Ensure **data consistency** (vote changes revert previous reputation effects).
- A user **cannot vote on their own** question or answer.
- A user **cannot cast the same vote twice** on the same post.

---

## Core Entities

| Entity     | Description                                              |
|------------|----------------------------------------------------------|
| `User`     | Registered user with a name, email, and reputation score |
| `Question` | Post with a title, body, tags, votes, answers, comments  |
| `Answer`   | Response to a question with votes, comments, accept flag |
| `Comment`  | Text comment on a question or answer                     |
| `Tag`      | Topic label attached to questions                        |

---

## Design Patterns Used

| Pattern       | Where Applied                                                     |
|---------------|-------------------------------------------------------------------|
| **Singleton** | `StackOverflowSystem` — single central registry for all entities  |

---

## Reputation Rules

| Action                  | Reputation Change |
|-------------------------|:-----------------:|
| Question upvoted        | +5                |
| Question downvoted      | −2                |
| Answer upvoted          | +10               |
| Answer downvoted        | −2                |
| Answer accepted         | +15               |

---

## Search Capabilities

| Search Type  | Behaviour                                      |
|--------------|------------------------------------------------|
| By keyword   | Matches questions where title or body contains the keyword |
| By tag       | Returns all questions with the given tag       |
| By user      | Returns all questions posted by a specific user |

---

## Class Diagram (Overview)

```
StackOverflowSystem (Singleton)
├── registerUser()
├── postQuestion()
├── postAnswer()
├── commentOnQuestion() / commentOnAnswer()
├── voteOnQuestion() / voteOnAnswer()
├── acceptAnswer()
└── searchByKeyword() / searchByTag() / searchByUser()

User
├── id, name, email
├── reputation
├── questions[], answers[]
└── updateReputation()

Question
├── id, title, body, createdAt
├── author: User
├── tags: Tag[]
├── votes: Map<userId, VoteType>
├── answers: Answer[]
├── comments: Comment[]
└── acceptAnswer()

Answer
├── id, body, createdAt
├── author: User
├── votes: Map<userId, VoteType>
├── comments: Comment[]
├── accepted: boolean
└── accept()

Comment
├── id, body
└── author: User

Tag
├── id
└── name
```

---

## Concurrency Handling

- Votes are stored as `Map<userId, VoteType>`, preventing a user from voting twice on the same post.
- Changing a vote (e.g. upvote → downvote) first **reverts** the old reputation delta before applying the new one, keeping scores consistent.
- In a production system this would be backed by **atomic database transactions** or **distributed locks**.
