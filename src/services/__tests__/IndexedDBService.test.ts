import 'fake-indexeddb/auto';
import IndexedDBService from '../IndexedDBService';
import { TaskDataModel } from '../../models/TaskDataModel';
import { CheckboxDB } from '../IndexedDBService';

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
});
