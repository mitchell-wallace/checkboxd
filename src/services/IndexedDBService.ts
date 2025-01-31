import { TaskDataModel } from '../models/TaskDataModel';

class IndexedDBService {
    private readonly dbName = 'checkboxdDB';
    private readonly storeName = 'tasks';
    private readonly version = 1;
    private db: IDBDatabase | null = null;

    constructor() {
        this.initDB();
    }

    private initDB(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => {
                reject(new Error('Failed to open database'));
            };

            request.onsuccess = (event) => {
                this.db = (event.target as IDBOpenDBRequest).result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath: 'id' });
                }
            };
        });
    }

    async getAllTasks(): Promise<TaskDataModel[]> {
        await this.ensureDBReady();
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(this.storeName, 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            request.onerror = () => reject(new Error('Failed to get tasks'));
            request.onsuccess = () => resolve(request.result);
        });
    }

    async addTask(task: TaskDataModel): Promise<void> {
        await this.ensureDBReady();
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.add(task);

            request.onerror = () => reject(new Error('Failed to add task'));
            request.onsuccess = () => resolve();
        });
    }

    async updateTask(task: TaskDataModel): Promise<void> {
        await this.ensureDBReady();
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(task);

            request.onerror = () => reject(new Error('Failed to update task'));
            request.onsuccess = () => resolve();
        });
    }

    async deleteTask(id: string): Promise<void> {
        await this.ensureDBReady();
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(id);

            request.onerror = () => reject(new Error('Failed to delete task'));
            request.onsuccess = () => resolve();
        });
    }

    private async ensureDBReady(): Promise<void> {
        if (!this.db) {
            await this.initDB();
        }
    }
}

export default IndexedDBService;
