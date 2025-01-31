import { TaskDataModel } from '../models/TaskDataModel';
import { v4 as uuidv4 } from 'uuid';
import IndexedDBService from './IndexedDBService';

class TaskService {
    private tasks: TaskDataModel[] = [];
    private dbService: IndexedDBService;
    private initialized: Promise<void>;

    constructor() {
        this.dbService = new IndexedDBService();
        // Load initial data
        this.initialized = this.dbService.getAllTasks().then(tasks => {
            this.tasks = tasks;
        }).catch(error => {
            console.error('Failed to load tasks:', error);
            throw error;
        });
    }

    // Create a new task
    async createTask(name: string): Promise<void> {
        await this.initialized;
        const newTask: TaskDataModel = {
            id: uuidv4(),
            name: name,
            isDone: false
        };
        
        // Persist to IndexedDB first
        try {
            await this.dbService.addTask(newTask);
            this.tasks.push(newTask);
        } catch (error) {
            console.error('Failed to save task:', error);
            throw error;
        }
    }

    // Read all tasks
    async getTasks(): Promise<TaskDataModel[]> {
        await this.initialized;
        return [...this.tasks];
    }

    // Update a task by id
    async updateTask(id: string, updatedTask: TaskDataModel): Promise<void> {
        await this.initialized;
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            try {
                await this.dbService.updateTask(updatedTask);
                this.tasks[index] = updatedTask;
            } catch (error) {
                console.error('Failed to update task:', error);
                throw error;
            }
        }
    }

    // Delete a task by id
    async deleteTask(id: string): Promise<void> {
        await this.initialized;
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            try {
                await this.dbService.deleteTask(id);
                this.tasks.splice(index, 1);
            } catch (error) {
                console.error('Failed to delete task:', error);
                throw error;
            }
        }
    }
}

export default TaskService;
