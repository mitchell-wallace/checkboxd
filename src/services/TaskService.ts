import { TaskProps } from '../models/TaskProps';

class TaskService {
    private tasks: TaskProps[] = [];

    constructor(initialTasks: TaskProps[] = []) {
        this.tasks = initialTasks;
    }

    // Create a new task
    createTask(task: TaskProps): void {
        this.tasks.push(task);
    }

    // Read all tasks
    getTasks(): TaskProps[] {
        return this.tasks;
    }

    // Update a task by index
    updateTask(index: number, updatedTask: TaskProps): void {
        if (index >= 0 && index < this.tasks.length) {
            this.tasks[index] = updatedTask;
        }
    }

    // Delete a task by index
    deleteTask(index: number): void {
        if (index >= 0 && index < this.tasks.length) {
            this.tasks.splice(index, 1);
        }
    }
}

export default TaskService;
