import { TaskDataModel } from '../models/TaskDataModel';
import Dexie from 'dexie';

export class CheckboxDB extends Dexie {
  tasks!: Dexie.Table<TaskDataModel, string>;

  constructor() {
    super('checkboxdDB');
    this.version(1).stores({
      tasks: 'id'
    });
  }
}

class IndexedDBService {
  private db = new CheckboxDB();

  async getAllTasks(): Promise<TaskDataModel[]> {
    return this.db.tasks.toArray();
  }

  async addTask(task: TaskDataModel): Promise<void> {
    await this.db.tasks.add(task);
  }

  async updateTask(task: TaskDataModel): Promise<void> {
    await this.db.tasks.put(task);
  }

  async deleteTask(id: string): Promise<void> {
    await this.db.tasks.delete(id);
  }
}

export default IndexedDBService;
