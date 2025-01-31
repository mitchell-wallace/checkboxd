import React, { useState } from 'react';
import { Button, TextField, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface TaskCreateProps {
    onCreateTask: (taskName: string) => void;
    refreshTasks: () => void;
}

const TaskCreate: React.FC<TaskCreateProps> = ({ onCreateTask, refreshTasks }) => {
    const [taskName, setTaskName] = useState('');

    const handleAddTask = () => {
        if (taskName.trim()) {
            onCreateTask(taskName.trim());
            setTaskName(''); // Clear the input field
            refreshTasks(); // Call refreshTasks to update the task list
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddTask();
        }
    };

    return (
        <Box display="flex" alignItems="center" width="100%">
            <TextField 
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                onKeyDown={handleKeyDown}
                label="New Task"
                variant="outlined"
                fullWidth
            />
            <Button 
                onClick={handleAddTask}
                variant="contained"
                color="primary"
                sx={{
                    marginLeft: '8px',
                    borderRadius: '50%',
                    minWidth: '40px',
                    width: '40px',
                    height: '40px',
                    padding: 0
                }}
            >
                <AddIcon sx={{ color: 'white' }} />
            </Button>
        </Box>
    );
};

export default TaskCreate;
