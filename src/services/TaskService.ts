import { TaskDataModel } from '../models/TaskDataModel';
import { v4 as uuidv4 } from 'uuid';

class TaskService {
    private tasks: TaskDataModel[] = [];

    constructor(initialTasks: TaskDataModel[] = []) {
        this.tasks = initialTasks;
    }

    // Create a new task
    createTask(name: string): void {
        const newTask: TaskDataModel = {
            id: uuidv4(),
            name: name,
            isDone: false
        };
        this.tasks.push(newTask);
    }

    // Read all tasks
    getTasks(): TaskDataModel[] {
        return this.tasks;
    }

    // Update a task by index
    updateTask(index: number, updatedTask: TaskDataModel): void {
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
