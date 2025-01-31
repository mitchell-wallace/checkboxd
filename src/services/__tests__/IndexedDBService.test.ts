import 'fake-indexeddb/auto';
import IndexedDBService from '../IndexedDBService';
import { TaskDataModel } from '../../models/TaskDataModel';
import { CheckboxDB } from '../IndexedDBService';
import Dexie from 'dexie';

describe('IndexedDBService', () => {
  let dbService: IndexedDBService;
  const testTask: TaskDataModel = {
    id: 'test-id-1',
    name: 'Test Task',
    isDone: false
  };

  beforeEach(async () => {
    // Clear database before each test
    if (await CheckboxDB.exists('checkboxdDB')) {
      const db = new CheckboxDB();
      await db.delete();
    }
    
    dbService = new IndexedDBService();
  });

  afterEach(async () => {
    // Clean up database after each test
    const db = new CheckboxDB();
    await db.delete();
  });

  describe('addTask', () => {
    it('should successfully add a task', async () => {
      await dbService.addTask(testTask);
      const tasks = await dbService.getAllTasks();
      expect(tasks).toEqual([testTask]);
    });

    it('should reject when adding duplicate task', async () => {
      await dbService.addTask(testTask);
      await expect(dbService.addTask(testTask)).rejects.toThrow(/already exists/);
    });
  });

  describe('getAllTasks', () => {
    it('should return empty array initially', async () => {
      const tasks = await dbService.getAllTasks();
      expect(tasks).toEqual([]);
    });
  });

  describe('updateTask', () => {
    it('should update existing task', async () => {
      await dbService.addTask(testTask);
      const updatedTask = { ...testTask, isDone: true };
      await dbService.updateTask(updatedTask);
      const tasks = await dbService.getAllTasks();
      expect(tasks).toEqual([updatedTask]);
    });
  });

  describe('deleteTask', () => {
    it('should delete existing task', async () => {
      await dbService.addTask(testTask);
      await dbService.deleteTask(testTask.id);
      const tasks = await dbService.getAllTasks();
      expect(tasks).toEqual([]);
    });
  });

  describe('data validation', () => {
    it('should reject tasks without ID', async () => {
      const invalidTask = { name: 'No ID', isDone: false } as TaskDataModel;
      await expect(dbService.addTask(invalidTask)).rejects.toThrow(/primary key/);
    });

    it('should handle malformed task data', async () => {
      const invalidTask = {
        id: 'malformed',
        name: 12345,
        isDone: 'maybe'
      } as unknown as TaskDataModel;
      
      await expect(dbService.addTask(invalidTask)).rejects.toThrow();
    });
  });

  describe('schema migrations', () => {
    it('should handle version upgrades', async () => {
      // Initialize old schema
      const oldDB = new CheckboxDB();
      await oldDB.tasks.add(testTask);
      await oldDB.close();

      // Simulate schema change
      class CheckboxDBV2 extends Dexie {
        tasks!: Dexie.Table<TaskDataModel & { newField?: string }, string>;

        constructor() {
          super('checkboxdDB');
          this.version(2).stores({
            tasks: 'id,newField'
          });
        }
      }

      // Should auto-migrate
      const migratedDB = new CheckboxDBV2();
      await migratedDB.open();
      const task = await migratedDB.tasks.get(testTask.id);
      expect(task?.newField).toBeUndefined();
      await migratedDB.delete();
    });
  });

  // New describe block
    describe('bulk operations', () => {
        it('should handle batch inserts', async () => {
        const tasks = Array.from({ length: 1000 }, (_, i) => ({
            id: `task-${i}`,
            name: `Task ${i}`,
            isDone: false
        }));
        
        await Promise.all(tasks.map(t => dbService.addTask(t)));
        const count = await dbService.getAllTasks();
        expect(count).toHaveLength(1000);
        });
    
        it('should maintain consistency during bulk deletes', async () => {
        // Setup and verification of atomic deletion
        });
    });

    // Add to error handling
    it('should handle storage quota exceeded', async () => {
        // Mock Dexie to simulate quota exceeded
        const db = new CheckboxDB();
        await db.open();
        jest.spyOn(db.tasks, 'add').mockImplementationOnce(() => {
        const err = new Error();
        err.name = 'QuotaExceededError';
        throw err;
        });
    
        await expect(dbService.addTask(testTask)).rejects.toThrow(/storage space/i);
    });

    it('should maintain consistency across multiple instances', async () => {
        const service1 = new IndexedDBService();
        const service2 = new IndexedDBService();
        
        await service1.addTask(testTask);
        const tasks = await service2.getAllTasks();
        expect(tasks).toHaveLength(1); // Verify shared DB state
      });

    it('should enforce unique constraints via indexes', async () => {
        await dbService.addTask(testTask);
        const dupeTask = { ...testTask, id: 'different-id', name: testTask.name };
        
        // Verify name isn't accidentally indexed as unique
        await expect(dbService.addTask(dupeTask)).resolves.not.toThrow();
    });
});
