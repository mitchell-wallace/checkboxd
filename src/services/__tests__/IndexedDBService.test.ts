import 'fake-indexeddb/auto';
import IndexedDBService from '../IndexedDBService';
import { TaskDataModel } from '../../models/TaskDataModel';

describe('IndexedDBService', () => {
    let dbService: IndexedDBService;
    const testTask: TaskDataModel = {
        id: 'test-id-1',
        name: 'Test Task',
        isDone: false
    };

    beforeEach(async () => {
        // Clear any existing databases and wait for completion
        await new Promise<void>((resolve) => {
            const deleteRequest = indexedDB.deleteDatabase('checkboxdDB');
            deleteRequest.onsuccess = () => resolve();
            deleteRequest.onerror = () => resolve(); // Resolve anyway, as the DB might not exist
        });

        // Create and initialize service
        dbService = new IndexedDBService();
        await dbService.ensureInitialized();
    }, 10000);

    afterEach(async () => {
        // Clean up and wait for completion
        await new Promise<void>((resolve) => {
            const deleteRequest = indexedDB.deleteDatabase('checkboxdDB');
            deleteRequest.onsuccess = () => resolve();
            deleteRequest.onerror = () => resolve();
        });
    }, 10000);

    describe('addTask', () => {
        it('should successfully add a task', async () => {
            await expect(dbService.addTask(testTask)).resolves.not.toThrow();
            
            const tasks = await dbService.getAllTasks();
            expect(tasks).toHaveLength(1);
            expect(tasks[0]).toEqual(testTask);
        });

        it('should fail when adding task with duplicate id', async () => {
            await dbService.addTask(testTask);
            await expect(dbService.addTask(testTask)).rejects.toThrow();
        });
    });

    describe('getAllTasks', () => {
        it('should return empty array when no tasks exist', async () => {
            const tasks = await dbService.getAllTasks();
            expect(tasks).toEqual([]);
        });

        it('should return all added tasks', async () => {
            const testTask2: TaskDataModel = {
                id: 'test-id-2',
                name: 'Test Task 2',
                isDone: true
            };

            await dbService.addTask(testTask);
            await dbService.addTask(testTask2);

            const tasks = await dbService.getAllTasks();
            expect(tasks).toHaveLength(2);
            expect(tasks).toEqual(expect.arrayContaining([testTask, testTask2]));
        });
    });

    describe('updateTask', () => {
        it('should successfully update an existing task', async () => {
            await dbService.addTask(testTask);

            const updatedTask = { ...testTask, isDone: true };
            await expect(dbService.updateTask(updatedTask)).resolves.not.toThrow();

            const tasks = await dbService.getAllTasks();
            expect(tasks[0]).toEqual(updatedTask);
        });

        it('should create new task when updating non-existent task', async () => {
            await dbService.updateTask(testTask);
            
            const tasks = await dbService.getAllTasks();
            expect(tasks).toHaveLength(1);
            expect(tasks[0]).toEqual(testTask);
        });
    });

    describe('deleteTask', () => {
        it('should successfully delete an existing task', async () => {
            await dbService.addTask(testTask);
            await expect(dbService.deleteTask(testTask.id)).resolves.not.toThrow();

            const tasks = await dbService.getAllTasks();
            expect(tasks).toHaveLength(0);
        });

        it('should not throw when deleting non-existent task', async () => {
            await expect(dbService.deleteTask('non-existent-id')).resolves.not.toThrow();
        });
    });

    describe('error handling', () => {
        it('should handle database connection errors', async () => {
            // Mock indexedDB.open to simulate a connection error
            const originalOpen = indexedDB.open;
            indexedDB.open = jest.fn().mockImplementation(() => {
                const request = {
                    onerror: null as ((event: Event) => void) | null,
                    error: new Error('Simulated connection error'),
                    result: null,
                    addEventListener: jest.fn(),
                    removeEventListener: jest.fn(),
                } as unknown as IDBOpenDBRequest;

                // Immediately trigger error
                setTimeout(() => {
                    if (request.onerror) {
                        request.onerror(new Event('error'));
                    }
                }, 0);

                return request;
            });

            // Create new service instance
            const errorService = new IndexedDBService();
            await expect(errorService.ensureInitialized()).rejects.toThrow('Failed to open database');

            // Restore original open method
            indexedDB.open = originalOpen;
        });
    });
});
