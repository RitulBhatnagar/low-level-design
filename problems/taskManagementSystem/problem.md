# Designing a Task Management System

## Requirements

### Functional Requirements
- The task management system should allow users to create, update, and delete tasks
- Each task should have a title, description, due date, priority, and status (e.g., pending, in progress, completed).
- Users should be able to assign tasks to other users and set reminders for tasks.
- The system should support searching and filtering tasks based on various criteria (e.g., priority, due date, assigned user).
- Users should be able to mark tasks as completed and view their task history.

### Non functional Requirements
- The system should handle concurrent access to tasks and ensure data consistency.
- The system should be extensible to accommodate future enhancements and new features.


## Core entites
1. `TaskManager` ->  manages overall task system
2. `Task`
3. `User`
4. `TaskHistory` -> stores the completed task
5. `Reminders`
6. `TaskFilter` - > search and filters taks on (e.g., priority, due date, assigned user)


## Class Diagram

```
«enum» Priority
  |- LOW, MEDIUM, HIGH, CRITICAL

«enum» TaskStatus
  |- PENDING, IN_PROGRESS, COMPLETED

TaskManager            
  |- registerUser(name, email): User
  |- createTask(title, desc, dueDate, priority): Task
  |- updateTask(taskId, updates): Task
  |- deleteTask(taskId): void
  |- assignTask(taskId, userId): void
  |- changeStatus(taskId, newStatus, changedBy): void   ← logs to TaskHistory
  |- setReminder(taskId, userId, reminderTime): Reminder
  |- filterTasks(filter: TaskFilter): List<Task>
  |- getTaskHistory(taskId): List<TaskHistory>
  |- getUserTasks(userId): List<Task>

Task
  |- id: String
  |- title: String
  |- description: String
  |- dueDate: Date
  |- priority: Priority
  |- status: TaskStatus
  |- assignedTo: User        ← direct relationship
  |- reminders: List<Reminder>

User
  |- id: String
  |- name: String
  |- email: String


TaskHistory                ← append-only log
  |- id: String
  |- task: Task
  |- changedBy: User
  |- previousStatus : TaskStatus
  |- newStatus: TaskStatus
  |- changedAt: Date

TaskFilter (type of interface)                 
  |- priority: Priority?
  |- status: TaskStatus?
  |- dueDate: Date?
  |- assignedTo: User?
  |- titleKeyword: String?

 Reminder
  |- id: String
  |- task: Task
  |- user: User
  |- reminderTime: Date
  |- notified: boolean
```


