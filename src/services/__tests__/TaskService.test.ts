import 'fake-indexeddb/auto';
import TaskService from '../TaskService';
import IndexedDBService from '../IndexedDBService';
import { CheckboxDB } from '../IndexedDBService';

describe('TaskService', () => {
  let taskService: TaskService;
  let dbService: IndexedDBService;
  const testTaskName = 'Test Task';

  const waitForTasks = async () => {
    // Increase wait time to ensure IndexedDB operations complete
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  beforeEach(async () => {
    // Clear database before each test
    if (await CheckboxDB.exists('checkboxdDB')) {
      const db = new CheckboxDB();
      await db.delete();
    }
    
    dbService = new IndexedDBService();
    taskService = new TaskService();
    await waitForTasks(); // Wait for initial load
  });

  afterEach(async () => {
    // Clean up database after each test
    const db = new CheckboxDB();
    await db.delete();
  });

  describe('Persistence', () => {
    it('should persist added tasks across service reinitialization', async () => {
      // Create task and wait for it to be saved
      taskService.createTask(testTaskName);
      await waitForTasks();
      
      // Verify task was created
      const tasks = taskService.getTasks();
      expect(tasks).toHaveLength(1);
      expect(tasks[0].name).toBe(testTaskName);
      
      // Simulate page refresh by creating new service instance
      const refreshedService = new TaskService();
      await waitForTasks(); // Wait for initial data load
      
      const persistedTasks = refreshedService.getTasks();
      expect(persistedTasks).toHaveLength(1);
      expect(persistedTasks[0].name).toBe(testTaskName);
      expect(persistedTasks[0].isDone).toBe(false);
    });

    it('should persist deleted tasks across service reinitialization', async () => {
      // Create task and wait for it to be saved
      taskService.createTask(testTaskName);
      await waitForTasks();
      
      // Get task and delete it
      const tasks = taskService.getTasks();
      expect(tasks).toHaveLength(1);
      taskService.deleteTask(tasks[0].id);
      await waitForTasks();
      
      // Verify task was deleted
      const currentTasks = taskService.getTasks();
      expect(currentTasks).toHaveLength(0);
      
      // Verify deletion persists after refresh
      const refreshedService = new TaskService();
      await waitForTasks();
      
      const persistedTasks = refreshedService.getTasks();
      expect(persistedTasks).toHaveLength(0);
    });
  });

  describe('Data Integrity', () => {
    it('should prevent duplicate task entries on updates', async () => {
      // Create task and wait for it to be saved
      taskService.createTask(testTaskName);
      await waitForTasks();
      
      // Get task and update it
      const tasks = taskService.getTasks();
      expect(tasks).toHaveLength(1);
      const task = tasks[0];
      taskService.updateTask(task.id, { ...task, isDone: true });
      await waitForTasks();
      
      // Verify update was successful
      const updatedTasks = taskService.getTasks();
      expect(updatedTasks).toHaveLength(1);
      expect(updatedTasks[0].isDone).toBe(true);
      expect(updatedTasks[0].name).toBe(testTaskName);
    });

    it('should handle duplicate entries when fetching tasks', async () => {
      // Create task and wait for it to be saved
      taskService.createTask(testTaskName);
      await waitForTasks();
      
      // Get task and try to add duplicate
      const tasks = taskService.getTasks();
      expect(tasks).toHaveLength(1);
      const task = tasks[0];
      
      // Force a duplicate by directly using the database
      await dbService.addTask(task).catch(() => {/* Ignore duplicate error */});
      await waitForTasks();
      
      // Verify no duplicates exist
      const allTasks = taskService.getTasks();
      expect(allTasks).toHaveLength(1);
      expect(allTasks[0].name).toBe(testTaskName);
    });
  });

  describe('Basic CRUD Operations', () => {
    it('should create a task with correct initial properties', async () => {
      taskService.createTask(testTaskName);
      await waitForTasks();
      
      const tasks = taskService.getTasks();
      expect(tasks).toHaveLength(1);
      expect(tasks[0].name).toBe(testTaskName);
      expect(tasks[0].isDone).toBe(false);
      expect(tasks[0].id).toBeDefined();
    });

    it('should read all tasks correctly', async () => {
      // Add single task and verify
      taskService.createTask('Single Task');
      await waitForTasks();
      
      const tasks = taskService.getTasks();
      expect(tasks).toHaveLength(1);
      expect(tasks[0].name).toBe('Single Task');
    });

    it('should update task properties correctly', async () => {
      taskService.createTask(testTaskName);
      await waitForTasks();
      
      const task = taskService.getTasks()[0];
      const updatedTask = { ...task, name: 'Updated Task', isDone: true };
      taskService.updateTask(task.id, updatedTask);
      await waitForTasks();

      const tasks = taskService.getTasks();
      expect(tasks[0].name).toBe('Updated Task');
      expect(tasks[0].isDone).toBe(true);
      expect(tasks[0].id).toBe(task.id);
    });

    it('should delete tasks correctly', async () => {
      taskService.createTask('Task to Delete');
      await waitForTasks();

      const tasks = taskService.getTasks();
      expect(tasks).toHaveLength(1);
      
      taskService.deleteTask(tasks[0].id);
      await waitForTasks();

      const remainingTasks = taskService.getTasks();
      expect(remainingTasks).toHaveLength(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle updating non-existent task', async () => {
      const nonExistentId = 'non-existent-id';
      const fakeTask = { id: nonExistentId, name: 'Fake Task', isDone: false };
      
      taskService.updateTask(nonExistentId, fakeTask);
      await waitForTasks();

      const tasks = taskService.getTasks();
      expect(tasks).toHaveLength(0);
    });

    it('should handle deleting non-existent task', async () => {
      taskService.createTask(testTaskName);
      await waitForTasks();

      const initialTasks = taskService.getTasks();
      taskService.deleteTask('non-existent-id');
      await waitForTasks();

      const finalTasks = taskService.getTasks();
      expect(finalTasks).toEqual(initialTasks);
    });

    it('should handle database connection errors gracefully', async () => {
      // Create a new instance of TaskService for this test
      const testTaskService = new TaskService();
      await waitForTasks();

      // Mock console.error before the operation
      const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock the dbService's addTask method to simulate a database error
      const mockAddTask = jest.spyOn(testTaskService['dbService'], 'addTask')
        .mockRejectedValue(new Error('DB Error'));

      // Attempt to create a task
      testTaskService.createTask(testTaskName);
      await waitForTasks();

      // Verify error was logged
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Failed to save task:',
        expect.any(Error)
      );

      // Verify task was not added to the in-memory array
      const tasks = testTaskService.getTasks();
      expect(tasks).toHaveLength(0);

      // Clean up
      mockConsoleError.mockRestore();
      mockAddTask.mockRestore();
    });
  });

  describe('Task Validation', () => {
    it('should handle empty task names', async () => {
      taskService.createTask('');
      await waitForTasks();

      const tasks = taskService.getTasks();
      expect(tasks).toHaveLength(1);
      expect(tasks[0].name).toBe('');
    });

    it('should preserve task order', async () => {
      const taskNames = ['First', 'Second', 'Third'];
      for (const name of taskNames) {
        taskService.createTask(name);
      }
      await waitForTasks();

      const tasks = taskService.getTasks();
      expect(tasks.map(t => t.name)).toEqual(taskNames);
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle rapid successive updates', async () => {
      taskService.createTask(testTaskName);
      await waitForTasks();

      const task = taskService.getTasks()[0];
      const updates = ['Update 1', 'Update 2', 'Update 3'];

      // Perform rapid updates
      for (const name of updates) {
        taskService.updateTask(task.id, { ...task, name });
      }
      await waitForTasks();

      const finalTask = taskService.getTasks()[0];
      expect(finalTask.name).toBe('Update 3');
    });

    it('should handle multiple operations in succession', async () => {
      // Create multiple tasks
      taskService.createTask('Task 1');
      taskService.createTask('Task 2');
      await waitForTasks();

      const tasks = taskService.getTasks();
      
      // Update first task
      taskService.updateTask(tasks[0].id, { ...tasks[0], isDone: true });
      // Delete second task
      taskService.deleteTask(tasks[1].id);
      // Create new task
      taskService.createTask('Task 3');
      
      await waitForTasks();

      const finalTasks = taskService.getTasks();
      expect(finalTasks).toHaveLength(2);
      expect(finalTasks[0].isDone).toBe(true);
      expect(finalTasks[1].name).toBe('Task 3');
    });
  });
});
