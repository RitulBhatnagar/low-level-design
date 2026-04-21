# Low Level Design (LLD) — Revision Guide

## Design Patterns (12 total)

### Creational Patterns — *How objects are created*

| Pattern | One-line reminder | Use when |
|---|---|---|
| **Singleton** | One instance globally | Logger, Config, DB connection |
| **Factory** | Subclass decides which object to create | Object type decided at runtime |
| **Abstract Factory** | Factory of factories (families of objects) | Related objects that must be used together |
| **Builder** | Step-by-step construction of complex objects | Object has many optional fields |
| **Prototype** | Clone an existing object | Expensive creation, need a copy |

### Structural Patterns — *How objects are composed*

| Pattern | One-line reminder | Use when |
|---|---|---|
| **Adapter** | Convert incompatible interfaces | Integrating a third-party or legacy class |
| **Decorator** | Add behaviour without changing class | Layering features (logging, caching, auth) |
| **Facade** | Simplify a complex subsystem | Hide complexity behind a clean interface |

### Behavioural Patterns — *How objects communicate*

| Pattern | One-line reminder | Use when |
|---|---|---|
| **Strategy** | Swap algorithms at runtime | Multiple ways to do the same thing (payment, sorting) |
| **Observer** | Notify dependents on state change | Event systems, pub-sub, notifications |
| **Command** | Encapsulate a request as an object | Undo/redo, queuing operations |
| **Chain of Responsibility** | Pass request along a chain of handlers | Middleware, validation pipelines, logging |

---

## What to Keep in Mind While Designing LLD Problems

### 1. Start with Requirements, not code
- Separate **Functional** (what the system does) vs **Non-functional** (thread safety, scalability, latency)
- Ask: *Who are the actors? What actions do they perform?*

### 2. Identify Core Entities
- **Nouns** in requirements → classes
- **Verbs** → methods

### 3. Apply SOLID Principles
| Principle | What it means |
|---|---|
| **S** — Single Responsibility | One class, one job |
| **O** — Open/Closed | Open to extend, closed to modify (use interfaces) |
| **L** — Liskov Substitution | Subclasses should be substitutable for their parent |
| **I** — Interface Segregation | Don't force classes to implement unused methods |
| **D** — Dependency Inversion | Depend on abstractions, not concretions |

### 4. Pick Patterns Intentionally
Don't force a pattern — ask *"what problem am I solving?"*

| Scenario | Pattern to reach for |
|---|---|
| Multiple notifications / event-driven | Observer |
| Multiple interchangeable algorithms | Strategy |
| Complex object with many configurations | Builder |
| Single shared resource | Singleton |
| Layered features (logging, validation) | Decorator or Chain of Responsibility |
| Hide a complex subsystem | Facade |
| Plug in a new/incompatible class | Adapter |
| Undo/redo, task queuing | Command |

### 5. Draw Class Diagram First
- Classes, attributes, methods
- Relationships: association, aggregation, composition, inheritance
- Validate: does each class have a single clear responsibility?

---

## LLD Problems in this Repo

| Problem | Key Patterns / Concepts |
|---|---|
| ATM System | State, Strategy |
| LinkedIn | Builder, Observer |
| Logging Framework | Singleton, Chain of Responsibility |
| LRU Cache | Doubly Linked List + HashMap (O(1) get/put) |
| Parking Lot System | Factory, Strategy, Singleton |
| Stack Overflow | Observer, Builder |
| Task Management System | Observer, Strategy |

---

## Revision Approaches

| Mode | Description |
|---|---|
| **Pattern by pattern** | Learn a pattern, see a TypeScript example, implement a small exercise |
| **Problem-driven** | Pick an LLD problem, explain your design, get quizzed on pattern choices |
| **Quiz mode** | Given a scenario, identify the right pattern and justify it |
| **Code review** | Write a solution, get it reviewed for SOLID violations and missing patterns |