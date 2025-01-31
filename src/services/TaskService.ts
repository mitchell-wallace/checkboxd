import { TaskDataModel } from '../models/TaskDataModel';
import { v4 as uuidv4 } from 'uuid';
import IndexedDBService from './IndexedDBService';

class TaskService {
    private tasks: TaskDataModel[] = [];
    private dbService: IndexedDBService;

    constructor() {
        this.dbService = new IndexedDBService();
        // Load initial data
        this.dbService.getAllTasks().then(tasks => {
            this.tasks = tasks;
        }).catch(error => {
            console.error('Failed to load tasks:', error);
        });
    }

    // Create a new task
    createTask(name: string): void {
        const newTask: TaskDataModel = {
            id: uuidv4(),
            name: name,
            isDone: false
        };
        this.tasks.push(newTask);
        // Persist to IndexedDB
        this.dbService.addTask(newTask).catch(error => {
            console.error('Failed to save task:', error);
            // Remove from cache if save failed
            const index = this.tasks.findIndex(task => task.id === newTask.id);
            if (index !== -1) {
                this.tasks.splice(index, 1);
            }
        });
    }

    // Read all tasks
    getTasks(): TaskDataModel[] {
        return [...this.tasks];
    }

    // Update a task by id
    updateTask(id: string, updatedTask: TaskDataModel): void {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            const oldTask = this.tasks[index];
            this.tasks[index] = updatedTask;
            // Persist to IndexedDB
            this.dbService.updateTask(updatedTask).catch(error => {
                console.error('Failed to update task:', error);
                // Revert to old state if update failed
                this.tasks[index] = oldTask;
            });
        }
    }

    // Delete a task by id
    deleteTask(id: string): void {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            const deletedTask = this.tasks[index];
            this.tasks.splice(index, 1);
            // Persist to IndexedDB
            this.dbService.deleteTask(id).catch(error => {
                console.error('Failed to delete task:', error);
                // Restore task if delete failed
                this.tasks.splice(index, 0, deletedTask);
            });
        }
    }
}

export default TaskService;
