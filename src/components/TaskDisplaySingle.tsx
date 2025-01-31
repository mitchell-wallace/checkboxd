import React from 'react';
import { Checkbox, ListItem, ListItemText, IconButton } from '@mui/material';
import { TaskDataModel } from '../models/TaskDataModel';
import DeleteIcon from '@mui/icons-material/Delete';

interface TaskDisplaySingleProps {
    task: TaskDataModel;
    style?: React.CSSProperties;
    onDelete: (task: TaskDataModel) => void;
}

const TaskDisplaySingle: React.FC<TaskDisplaySingleProps> = ({ task, style, onDelete }) => {
    return (
        <ListItem style={style} secondaryAction={
            <IconButton edge="end" onClick={() => onDelete(task)}>
                <DeleteIcon sx={{ '&:hover': { color: 'red' } }} />
            </IconButton>
        }>
            <Checkbox checked={task.isDone} disableRipple />
            <ListItemText primary={task.name} />
        </ListItem>
    );
};

export default TaskDisplaySingle;
