enum Priority{
    LOW='LOW',
    MEDIUM='MEDIUM',
    HIGH='HIGH',
    CRITICAL='CRITICAL'
}

enum TaskStatus{
    PENDING='PENDING',
    IN_PROGRESS='IN_PROGRESS',
    COMPLETED='COMPLETED'
}

interface TaskFilterStrategy{
    filter(tasks : Task[]) : Task[]
}

interface TaskFilter{
   priority : Priority;
   status : TaskStatus;
   dueDate : Date;
   assignedTo : User;
   titleKeyWord : string;
}


class User{
    private static counter = 0;
    id : number;
    name : string;
    email : string;

    constructor(name:string, email:string){
        this.id = ++User.counter;
        this.name = name;
        this.email = email;
    }
}

class Reminder{
    private static counter = 0;
    id : number;
    task : Task;
    user : User;
    reminderTime : Date;
    notified : boolean;

    constructor(task : Task, user:User, reminderTime : Date){
        this.id = ++Reminder.counter;
        this.task = task;
        this.reminderTime = reminderTime;
        this.notified = false;
        this.user = user;
    }

    markNotified(){
        this.notified = true;
    }
}

class Task{
    private static counter = 0;
    id : number;
    title : string;
    description : string;
    dueDate : Date;
    priority : Priority;
    status : TaskStatus;
    assignedTo : User;
    reminders : Reminder[];


    constructor(title:string, description:string, dueDate : Date, priority : Priority, assignedTo ?: User){
        this.id = ++Task.counter;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.assignedTo = assignedTo;
        this.priority = priority;
        this.reminders = []
    }

    markCompleted(){
        this.status = TaskStatus.COMPLETED;
    }

    addReminder(reminder : Reminder){
        this.reminders.push(reminder);
    }
}

class TaskHistory{
    private static counter = 0;
    id : number;
    task : Task;
    changedBy: User;
    newStatus : TaskStatus;
    changedAt : Date;
    previousStatus : TaskStatus;


    constructor(task : Task, changedBy : User, newStatus : TaskStatus, previousStatus : TaskStatus){
        this.id = ++TaskHistory.counter;
        this.task = task;
        this.changedAt = new Date();
        this.changedBy = changedBy;
        this.newStatus = newStatus;
        this.previousStatus = previousStatus;
    }
}

class PriorityFilter implements TaskFilterStrategy{
    constructor(private priority : Priority){}

    filter(tasks: Task[]): Task[] {
        const filterTasks = tasks.filter((task : Task) =>  task.priority === this.priority);
        return filterTasks;
    }
}

class DueDateFilter implements TaskFilterStrategy {

    constructor(private dueDate: Date) {}

    filter(tasks: Task[]): Task[] {
        return tasks.filter(task => task.dueDate >= this.dueDate);
    }
}

class AssignedUserFilter implements TaskFilterStrategy {

    constructor(private user: User) {}

    filter(tasks: Task[]): Task[] {
        return tasks.filter(task => task.assignedTo === this.user);
    }
}

class TaskManager{
     tasks : Task[] = [];
     taskHistory : TaskHistory[] = [];
     reminders : Reminder[] = [];
     users : User[] = [];


    constructor(){
        this.tasks = [];
        this.taskHistory = [];
        this.reminders  = [];
        this.users = [];
    }

    registerUser(name : string, email : string){
        const user = new User(name, email);
        this.users.push(user);
    }

    createTask(title:string, description : string, dueDate : Date, priority : Priority):Task{
        const task = new Task(title, description, dueDate, priority);
        this.tasks.push(task);
        return task;
    }
    updateTask(taskId : number, title : string, description : string, dueDate : Date, priority : Priority){
        const task = this.tasks.find((task : Task) => task.id===taskId);

        if(task){
            task.title = title;
            task.description = description;
            task.dueDate = dueDate;
            task.priority = priority;

            return task;
        }
        else{
            console.log(`Task not found`)
        }
    }

    deleteTask(taskId : number){
        const intialLength = this.tasks.length;
        this.tasks = this.tasks.filter((task:Task)=> task.id!==taskId);

        if(this.tasks.length === intialLength){
            console.log(`Task not found`);
        }
    }

    assignTask(taskId : number, userId : number){
        const task = this.tasks.find((task : Task) => task.id===taskId);
        if(!task){
            console.log(`Task not found`);
            return;
        }
        const user = this.users.find((user : User) => user.id===userId);
        if(!user){
            console.log(`User not found`);
            return;
        }

        task.assignedTo = user;
    }

    changeStatus(taskId : number, newStatus : TaskStatus, changedBy : User){
        const task = this.tasks.find((task : Task) =>  task.id === taskId);

        if(!task){
            console.log(`Task not found`);
        }
        
        const user = this.users.find((user : User) => user.id===changedBy.id);
        if(!user){
            console.log(`User not found`);
            return;
        }

        if(newStatus===TaskStatus.COMPLETED){
            const taskHistory = new TaskHistory(task, user, TaskStatus.COMPLETED, task.status);
            this.taskHistory.push(taskHistory);
            task.markCompleted();

            return;
        }

        task.status = newStatus;
        return;
    }

    filterTasks(strategy : TaskFilterStrategy) : Task[]{
        return strategy.filter(this.tasks);
    }
    getTaskHistory(taskId : number) : TaskHistory[]{
        return this.taskHistory.filter((history) => history.task.id === taskId);
    }
    getUserTasks(userId : number) : Task[]{
        return this.tasks.filter((task) => task.assignedTo.id === userId);
    }
    setReminder(taskId : number, userId : number, reminderTime : Date):Reminder | null{
        const task = this.tasks.find((task) => task.id === taskId);
        if(!task){
            console.log(`Task not found :  ${taskId}`);
            return;
        }

        const user = this.users.find((user) => user.id === userId);
        if(!user){
            console.log(`user not found : ${userId}`);
            return;
        }
        const reminder  = new Reminder(task, user, reminderTime);
        this.reminders.push(reminder);
        task.addReminder(reminder);
        return reminder;
    }

}

// ── Tests ────────────────────────────────────────────────────────────────────
const tm = new TaskManager();
tm.registerUser('Alice', 'alice@test.com');
tm.registerUser('Bob',   'bob@test.com');
const alice = tm.users[0];
const bob   = tm.users[1];

// Test 1: create & assign task
console.log('--- Test 1: create & assign ---');
const t1 = tm.createTask('Fix bug', 'Prod issue', new Date('2026-04-01'), Priority.CRITICAL);
tm.assignTask(t1.id, alice.id);
console.log('assigned to:', t1.assignedTo.name);           // Alice

// Test 2: change status + history
console.log('\n--- Test 2: status change ---');
tm.changeStatus(t1.id, TaskStatus.IN_PROGRESS, alice);
console.log('status:', t1.status);                         // IN_PROGRESS
tm.changeStatus(t1.id, TaskStatus.COMPLETED, alice);
console.log('status:', t1.status);                         // COMPLETED
console.log('history entries:', tm.getTaskHistory(t1.id).length); // 1

// Test 3: filter by priority
console.log('\n--- Test 3: priority filter ---');
tm.createTask('Write docs', 'README update', new Date('2026-05-01'), Priority.LOW);
const critical = tm.filterTasks(new PriorityFilter(Priority.CRITICAL));
console.log('CRITICAL tasks:', critical.length);            // 1

// Test 4: filter by assigned user
console.log('\n--- Test 4: assigned user filter ---');
tm.assignTask(t1.id, bob.id);
const bobTasks = tm.filterTasks(new AssignedUserFilter(bob));
console.log('Bob tasks:', bobTasks.length);                 // 1

// Test 5: set reminder
console.log('\n--- Test 5: reminder ---');
const t2 = tm.tasks[1];
const reminder = tm.setReminder(t2.id, alice.id, new Date('2026-04-30'));
console.log('reminder created:', reminder !== null);        // true