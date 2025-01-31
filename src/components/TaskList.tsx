import React from 'react';
import { List } from '@mui/material';
import TaskDisplaySingle from './TaskDisplaySingle';
import TaskService from '../services/TaskService';

const taskService = new TaskService([
    { name: 'Task 1', isDone: false },
    { name: 'Task 2', isDone: true },
    { name: 'Task 3', isDone: false }
]);

const TaskList: React.FC = () => {
    const tasks = taskService.getTasks();

    return (
        <List>
            {tasks.map((task, index) => (
                <TaskDisplaySingle key={index} name={task.name} isDone={task.isDone} />
            ))}
        </List>
    );
};

export default TaskList;
