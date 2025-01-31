import React from 'react';
import { List, ListItem } from '@mui/material';
import TaskDisplaySingle from './TaskDisplaySingle';
import TaskService from '../services/TaskService';
import './TaskList.css';

const taskService = new TaskService([
    { name: 'Task 1', isDone: false },
    { name: 'Task 2', isDone: true },
    { name: 'Task 3', isDone: false }
]);

const TaskList: React.FC = () => {
    const tasks = taskService.getTasks();

    return (
        <List className="task-list" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {tasks.map((task, index) => (
                <ListItem key={index} className="task-list-item" style={{ width: '100%' }}>
                    <TaskDisplaySingle name={task.name} isDone={task.isDone} />
                </ListItem>
            ))}
        </List>
    );
};

export default TaskList;
