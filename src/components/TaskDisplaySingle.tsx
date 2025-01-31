import React from 'react';
import { Checkbox, ListItem, ListItemText } from '@mui/material';
import { TaskDataModel } from '../models/TaskDataModel';

interface TaskDisplaySingleProps {
    task: TaskDataModel;
    style?: React.CSSProperties;
}

const TaskDisplaySingle: React.FC<TaskDisplaySingleProps> = ({ task, style }) => {
    return (
        <ListItem style={style}>
            <Checkbox checked={task.isDone} disableRipple />
            <ListItemText primary={task.name} />
        </ListItem>
    );
};

export default TaskDisplaySingle;
