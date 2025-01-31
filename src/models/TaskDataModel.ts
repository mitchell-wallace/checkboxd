export class TaskDataModel {
  id: string;
  name: string;
  isDone: boolean;

  constructor(id: string, name: string, isDone: boolean) {
    this.id = id;
    this.name = name;
    this.isDone = isDone;
  }
}
