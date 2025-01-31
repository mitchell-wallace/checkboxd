import { TaskDataModel } from '../models/TaskDataModel';
import { v4 as uuidv4 } from 'uuid';

class TaskService {
    private tasks: TaskDataModel[] = [];

    constructor() {
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

    // Update a task by id
    updateTask(id: string, updatedTask: TaskDataModel): void {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            this.tasks[index] = updatedTask;
        }
    }

    // Delete a task by id
    deleteTask(id: string): void {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            this.tasks.splice(index, 1);
        }
    }
}

export default TaskService;
