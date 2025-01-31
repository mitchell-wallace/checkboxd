import React, { useState, useEffect } from 'react';
import { List } from '@mui/material';
import TaskDisplaySingle from './TaskDisplaySingle';
import TaskCreate from './TaskCreate'; // added import statement
import './TaskList.css';
import { TaskDataModel } from '../models/TaskDataModel';
import { useTaskService } from '../contexts/TaskServiceContext';

const TaskList: React.FC = () => {
    const taskService = useTaskService();
    const [tasks, setTasks] = useState<TaskDataModel[]>([]);

    useEffect(() => {
        setTasks(taskService.getTasks());
    }, [taskService]);

    const handleDelete = (task: TaskDataModel) => {
        taskService.deleteTask(task.id);
        setTasks(taskService.getTasks());
    };

    const handleToggle = (task: TaskDataModel) => {
        const updatedTask = { ...task, isDone: !task.isDone };
        taskService.updateTask(task.id, updatedTask);
        setTasks(taskService.getTasks());
    };

    const handleNameChange = (task: TaskDataModel, newName: string) => {
        const updatedTask = { ...task, name: newName };
        taskService.updateTask(task.id, updatedTask);
        setTasks(taskService.getTasks());
    };

    const handleCreateTask = (taskName: string) => {
        taskService.createTask(taskName);
        setTasks(taskService.getTasks());
    };

    const refreshTasks = () => {
        setTasks(taskService.getTasks());
    };

    return (
        <div>
            <TaskCreate onCreateTask={handleCreateTask} refreshTasks={refreshTasks} />
            <List className="task-list" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                {tasks.map((task) => (
                    <TaskDisplaySingle 
                        key={task.id}
                        task={task}
                        onDelete={handleDelete}
                        onToggle={handleToggle}
                        onNameChange={handleNameChange}
                    />
                ))}
            </List>
        </div>
    );
};

export default TaskList;
