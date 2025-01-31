import React from 'react';
import { Checkbox, ListItem, ListItemText } from '@mui/material';

interface TaskProps {
    name: string;
    isDone: boolean;
}

const Task: React.FC<TaskProps> = ({ name, isDone }) => {
    return (
        <ListItem>
            <Checkbox checked={isDone} disableRipple />
            <ListItemText primary={name} />
        </ListItem>
    );
};

export default Task;
