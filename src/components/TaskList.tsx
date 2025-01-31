import React, { useState, useEffect } from 'react';
import { List, ListItem } from '@mui/material';
import TaskDisplaySingle from './TaskDisplaySingle';
import TaskService from '../services/TaskService';
import './TaskList.css';
import { TaskDataModel } from '../models/TaskDataModel';

const taskService = new TaskService([
    { name: 'Task 1', isDone: false },
    { name: 'Task 2', isDone: true },
    { name: 'Task 3', isDone: false }
]);

const TaskList: React.FC = () => {
    const [tasks, setTasks] = useState<TaskDataModel[]>([]);

    useEffect(() => {
        setTasks(taskService.getTasks());
    }, []);

    const handleDelete = (task: TaskDataModel) => {
        const index = tasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
            taskService.deleteTask(index);
            setTasks(taskService.getTasks());
        }
    };

    return (
        <List className="task-list" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {tasks.map((task, index) => (
                <ListItem key={index} className="task-list-item" style={{ width: '100%' }}>
                    <TaskDisplaySingle task={task} style={{ width: '100%' }} onDelete={handleDelete} />
                </ListItem>
            ))}
        </List>
    );
};

export default TaskList;
