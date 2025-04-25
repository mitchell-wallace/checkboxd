import React, { useState, useEffect } from 'react';
import { List } from '@mui/material';
import TaskDisplaySingle from './TaskDisplaySingle';
import TaskCreate from './TaskCreate'; // added import statement
import './TaskList.css';
import { TaskDataModel } from '../models/TaskDataModel';
import { useTaskService } from '../hooks/useTaskService';

const TaskList: React.FC = () => {
    const taskService = useTaskService();
    const [tasks, setTasks] = useState<TaskDataModel[]>([]);

    useEffect(() => {
        const loadTasks = async () => {
            const fetchedTasks = await taskService.getTasks();
            setTasks(fetchedTasks);
        };
        loadTasks();
    }, [taskService]);

    const handleDelete = async (task: TaskDataModel) => {
        await taskService.deleteTask(task.id);
        const updatedTasks = await taskService.getTasks();
        setTasks(updatedTasks);
    };

    const handleToggle = async (task: TaskDataModel) => {
        const updatedTask = { ...task, isDone: !task.isDone };
        await taskService.updateTask(task.id, updatedTask);
        const updatedTasks = await taskService.getTasks();
        setTasks(updatedTasks);
    };

    const handleNameChange = async (task: TaskDataModel, newName: string) => {
        const updatedTask = { ...task, name: newName };
        await taskService.updateTask(task.id, updatedTask);
        const updatedTasks = await taskService.getTasks();
        setTasks(updatedTasks);
    };

    const handleCreateTask = async (taskName: string) => {
        await taskService.createTask(taskName);
        const updatedTasks = await taskService.getTasks();
        setTasks(updatedTasks);
    };

    const refreshTasks = async () => {
        const updatedTasks = await taskService.getTasks();
        setTasks(updatedTasks);
    };

    return (
        <div>
            <TaskCreate 
                onCreateTask={handleCreateTask} 
                refreshTasks={refreshTasks} 
                currentTasks={tasks} 
            />
            <List className="task-list" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                {tasks.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                        No tasks here yet...
                    </div>
                ) : (
                    tasks.map((task) => (
                        <TaskDisplaySingle 
                            key={task.id}
                            task={task}
                            onDelete={handleDelete}
                            onToggle={handleToggle}
                            onNameChange={handleNameChange}
                        />
                    ))
                )}
            </List>
        </div>
    );
};

export default TaskList;
