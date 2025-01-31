import 'fake-indexeddb/auto';
import TaskService from '../TaskService';
import { CheckboxDB } from '../IndexedDBService';

describe('TaskService', () => {
  let taskService: TaskService;
  const testTaskName = 'Test Task';

  const waitForTasks = async () => {
    // Increase wait time to ensure IndexedDB operations complete
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  beforeEach(async () => {
    // Clear database before each test
    const db = new CheckboxDB();
    await db.close();
    await db.delete();
    
    taskService = new TaskService();
    await waitForTasks(); // Wait for initial load
  });

  afterEach(async () => {
    // Clean up database after each test
    const db = new CheckboxDB();
    await db.close();
    await db.delete();
  });

  describe('Persistence', () => {
    it('should persist added tasks across service reinitialization', async () => {
      // Create task and wait for it to be saved
      await taskService.createTask(testTaskName);
      await waitForTasks();
      
      // Verify task was created
      const tasks = await taskService.getTasks();
      expect(tasks).toHaveLength(1);
      expect(tasks[0].name).toBe(testTaskName);
      
      // Simulate page refresh by creating new service instance
      const refreshedService = new TaskService();
      await waitForTasks(); // Wait for initial data load
      
      const persistedTasks = await refreshedService.getTasks();
      expect(persistedTasks).toHaveLength(1);
      expect(persistedTasks[0].name).toBe(testTaskName);
      expect(persistedTasks[0].isDone).toBe(false);
    });

    it('should persist deleted tasks across service reinitialization', async () => {
      // Create task and wait for it to be saved
      await taskService.createTask(testTaskName);
      await waitForTasks();
      
      // Get task and delete it
      const tasks = await taskService.getTasks();
      expect(tasks).toHaveLength(1);
      await taskService.deleteTask(tasks[0].id);
      await waitForTasks();
      
      // Verify task was deleted
      const currentTasks = await taskService.getTasks();
      expect(currentTasks).toHaveLength(0);
      
      // Verify deletion persists after refresh
      const refreshedService = new TaskService();
      await waitForTasks();
      
      const persistedTasks = await refreshedService.getTasks();
      expect(persistedTasks).toHaveLength(0);
    });
  });

  describe('Data Integrity', () => {
    it('should prevent duplicate task entries on updates', async () => {
      // Create task and wait for it to be saved
      await taskService.createTask(testTaskName);
      await waitForTasks();
      
      // Get task and update it
      const tasks = await taskService.getTasks();
      expect(tasks).toHaveLength(1);
      const task = tasks[0];
      await taskService.updateTask(task.id, { ...task, isDone: true });
      await waitForTasks();
      
      // Verify update was successful
      const updatedTasks = await taskService.getTasks();
      expect(updatedTasks).toHaveLength(1);
      expect(updatedTasks[0].isDone).toBe(true);
      expect(updatedTasks[0].name).toBe(testTaskName);
    });

    it('should handle concurrent operations correctly', async () => {
      // Create multiple tasks concurrently
      await Promise.all([
        taskService.createTask('Task 1'),
        taskService.createTask('Task 2'),
        taskService.createTask('Task 3')
      ]);
      await waitForTasks();

      const tasks = await taskService.getTasks();
      expect(tasks).toHaveLength(3);
      
      // Update and delete tasks concurrently
      const updatePromises = tasks.map(task => 
        taskService.updateTask(task.id, { ...task, isDone: true })
      );
      const deletePromise = taskService.deleteTask(tasks[0].id);
      
      await Promise.all([...updatePromises, deletePromise]);
      await waitForTasks();
      
      const finalTasks = await taskService.getTasks();
      expect(finalTasks).toHaveLength(2);
      finalTasks.forEach(task => {
        expect(task.isDone).toBe(true);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid task updates gracefully', async () => {
      await taskService.createTask(testTaskName);
      await waitForTasks();
      
      const tasks = await taskService.getTasks();
      const invalidId = 'invalid-id';
      
      await expect(taskService.updateTask(invalidId, tasks[0])).resolves.toBeUndefined();
      const updatedTasks = await taskService.getTasks();
      expect(updatedTasks).toHaveLength(1);
      expect(updatedTasks[0].name).toBe(testTaskName);
    });

    it('should handle invalid task deletions gracefully', async () => {
      await taskService.createTask(testTaskName);
      await waitForTasks();
      
      const invalidId = 'invalid-id';
      await expect(taskService.deleteTask(invalidId)).resolves.toBeUndefined();
      
      const tasks = await taskService.getTasks();
      expect(tasks).toHaveLength(1);
      expect(tasks[0].name).toBe(testTaskName);
    });
  });

  describe('Task Validation', () => {
    it('should handle empty task names', async () => {
      await taskService.createTask('');
      await waitForTasks();

      const tasks = await taskService.getTasks();
      expect(tasks).toHaveLength(1);
      expect(tasks[0].name).toBe('');
    });

    it('should preserve task order', async () => {
      const taskNames = ['First', 'Second', 'Third'];
      for (const name of taskNames) {
        await taskService.createTask(name);
      }
      await waitForTasks();

      const tasks = await taskService.getTasks();
      expect(tasks.map(t => t.name)).toEqual(taskNames);
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle rapid successive updates', async () => {
      await taskService.createTask(testTaskName);
      await waitForTasks();

      const tasks = await taskService.getTasks();
      const task = tasks[0];
      const updates = ['Update 1', 'Update 2', 'Update 3'];

      // Perform rapid updates
      for (const name of updates) {
        await taskService.updateTask(task.id, { ...task, name });
      }
      await waitForTasks();

      const finalTasks = await taskService.getTasks();
      expect(finalTasks[0].name).toBe('Update 3');
    });

    it('should handle multiple operations in succession', async () => {
      // Create multiple tasks
      await taskService.createTask('Task 1');
      await taskService.createTask('Task 2');
      await waitForTasks();

      const tasks = await taskService.getTasks();
      
      // Update first task
      await taskService.updateTask(tasks[0].id, { ...tasks[0], isDone: true });
      // Delete second task
      await taskService.deleteTask(tasks[1].id);
      // Create new task
      await taskService.createTask('Task 3');
      
      await waitForTasks();

      const finalTasks = await taskService.getTasks();
      expect(finalTasks).toHaveLength(2);
      expect(finalTasks[0].isDone).toBe(true);
      expect(finalTasks[1].name).toBe('Task 3');
    });
  });
});