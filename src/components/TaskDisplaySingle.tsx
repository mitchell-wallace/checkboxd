import React, { useState } from 'react';
import { Checkbox, ListItem, ListItemText, IconButton, TextField } from '@mui/material';
import { TaskDataModel } from '../models/TaskDataModel';
import DeleteIcon from '@mui/icons-material/Delete';
import './TaskDisplaySingle.css';

interface TaskDisplaySingleProps {
    task: TaskDataModel;
    style?: React.CSSProperties;
    onDelete: (task: TaskDataModel) => void;
    onToggle: (task: TaskDataModel) => void;
    onNameChange: (task: TaskDataModel, newName: string) => void;
}

const TaskDisplaySingle: React.FC<TaskDisplaySingleProps> = ({ task, style, onDelete, onToggle, onNameChange }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(task.name);

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleBlur = () => {
        if (editValue.trim() !== task.name) {
            onNameChange(task, editValue.trim());
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (editValue.trim() !== task.name) {
                onNameChange(task, editValue.trim());
            }
            setIsEditing(false);
        } else if (e.key === 'Escape') {
            setEditValue(task.name);
            setIsEditing(false);
        }
    };

    return (
        <ListItem className="task-display-single" style={style} secondaryAction={
            <IconButton edge="end" onClick={() => onDelete(task)}>
                <DeleteIcon sx={{ '&:hover': { color: 'red' } }} />
            </IconButton>
        }>
            <Checkbox checked={task.isDone} onChange={() => onToggle(task)} disableRipple />
            {isEditing ? (
                <TextField
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    fullWidth
                    size="small"
                    variant="standard"
                />
            ) : (
                <ListItemText 
                    primary={task.name} 
                    onDoubleClick={handleDoubleClick}
                    style={{ cursor: 'pointer' }}
                />
            )}
        </ListItem>
    );
};

export default TaskDisplaySingle;
