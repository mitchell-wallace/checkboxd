import { TaskDataModel } from '../models/TaskDataModel';
import Dexie from 'dexie';

export class CheckboxDB extends Dexie {
    tasks!: Dexie.Table<TaskDataModel, string>;

    private static instance: CheckboxDB;

    static getInstance(): CheckboxDB {
        if (!CheckboxDB.instance) {
            CheckboxDB.instance = new CheckboxDB();
        }
        return CheckboxDB.instance;
    }

    constructor() {
        super('checkboxdDB');
        this.version(1).stores({
            tasks: 'id,name'
        });

        this.tasks = this.table('tasks');
        this.tasks.mapToClass(TaskDataModel);
    }
}

class IndexedDBService {
    private db = CheckboxDB.getInstance();

    async getAllTasks(): Promise<TaskDataModel[]> {
        return this.db.tasks.toArray();
    }

    async addTask(task: TaskDataModel): Promise<void> {
        if (!task.id) {
            throw new Error('Task must have an ID');
        }

        // Validate task data types
        if (typeof task.id !== 'string') {
            throw new Error('Task ID must be a string');
        }
        if (typeof task.name !== 'string') {
            throw new Error('Task name must be a string');
        }
        if (typeof task.isDone !== 'boolean') {
            throw new Error('Task isDone must be a boolean');
        }
            
        try {
        await this.db.tasks.add(task);
        } catch (error) {
            if (error instanceof Error && error.name === 'QuotaExceededError') {
                throw new Error('Storage quota exceeded. Please free up space.');
            }
            if (error instanceof Error && error.name === 'ConstraintError') {
                throw new Error(`Task with ID ${task.id} already exists`);
            }
            throw error;
        }
    }

    async bulkAddTasks(tasks: TaskDataModel[]): Promise<void> {
        await this.db.transaction('rw', this.db.tasks, async () => {
            await this.db.tasks.bulkAdd(tasks).catch(Dexie.BulkError, (e) => {
                console.error('Partial failures:', e.failures);
                throw new Error('Failed to add some tasks');
            });
        });
    }

    async bulkDeleteTasks(ids: string[]): Promise<void> {
        await this.db.transaction('rw', this.db.tasks, async () => {
            await this.db.tasks.bulkDelete(ids);
        });
    }

  async updateTask(task: TaskDataModel): Promise<void> {
        try {
            await this.db.tasks.update(task.id, task);
        } catch (error) {
            if (error instanceof Error && error.name === 'QuotaExceededError') {
                throw new Error('Storage quota exceeded. Please free up space.');
            }
            throw new Error('Unexpected error occurred');
        }
    }

    async deleteTask(id: string): Promise<void> {
        try {
            await this.db.tasks.delete(id);
        } catch (error) {
            if (error instanceof Error && error.name === 'QuotaExceededError') {
                throw new Error('Storage quota exceeded. Please free up space.');
            }
            throw new Error('Unexpected error occurred');
        }
    }
}

export default IndexedDBService;
