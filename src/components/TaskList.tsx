import React from 'react';
import { List } from '@mui/material';
import Task from './Task';

const TaskList: React.FC = () => {
    const tasks = [
        { name: 'Task 1', isDone: false },
        { name: 'Task 2', isDone: true },
        { name: 'Task 3', isDone: false }
    ];

    return (
        <List>
            {tasks.map((task, index) => (
                <Task key={index} name={task.name} isDone={task.isDone} />
            ))}
        </List>
    );
};

export default TaskList;
