import { TaskDataModel } from '../models/TaskDataModel';

class IndexedDBService {
    private readonly dbName = 'checkboxdDB';
    private readonly storeName = 'tasks';
    private readonly version = 1;
    private db: IDBDatabase | null = null;

    constructor() {
        // Don't automatically initialize in constructor
        // to allow better control in tests
    }

    public async ensureInitialized(): Promise<void> {
        if (!this.db) {
            await this.initDB();
        }
    }

    public initDB(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => {
                reject(new Error('Failed to open database'));
            };

            request.onsuccess = (event) => {
                this.db = (event.target as IDBOpenDBRequest).result;
                
                // Handle connection errors
                this.db.onerror = (event) => {
                    const dbError = (event.target as IDBDatabase).onerror;
                    console.error('Database error:', dbError || 'Unknown error');
                };

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
            request.onsuccess = () => resolve(request.result || []);

            transaction.onerror = () => reject(new Error('Transaction failed'));
            transaction.oncomplete = () => {
                if (!request.result) resolve([]);
            };
        });
    }

    async addTask(task: TaskDataModel): Promise<void> {
        await this.ensureDBReady();
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            
            // Check if task with this ID already exists
            const getRequest = store.get(task.id);
            getRequest.onsuccess = () => {
                if (getRequest.result) {
                    reject(new Error(`Task with ID ${task.id} already exists`));
                    return;
                }

                const addRequest = store.add(task);
                addRequest.onerror = () => reject(new Error('Failed to add task'));
            };

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(new Error('Transaction failed'));
        });
    }

    async updateTask(task: TaskDataModel): Promise<void> {
        await this.ensureDBReady();
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            
            const putRequest = store.put(task);
            putRequest.onerror = () => reject(new Error('Failed to update task'));

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(new Error('Transaction failed'));
        });
    }

    async deleteTask(id: string): Promise<void> {
        await this.ensureDBReady();
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(id);

            request.onerror = () => reject(new Error('Failed to delete task'));

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(new Error('Transaction failed'));
        });
    }

    private async ensureDBReady(): Promise<void> {
        if (!this.db) {
            await this.initDB();
        }
        if (!this.db) {
            throw new Error('Database connection failed');
        }
    }
}

export default IndexedDBService;
