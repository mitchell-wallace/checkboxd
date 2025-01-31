import React, { useState } from 'react';
import { useTaskService } from '../contexts/TaskServiceContext';
import { Button, TextField, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const TaskCreate: React.FC<{ refreshTasks: () => void }> = ({ refreshTasks }) => {
    const taskService = useTaskService();
    const [taskName, setTaskName] = useState('');

    const handleAddTask = () => {
        if (taskName.trim()) {
            taskService.createTask(taskName);
            setTaskName(''); // Clear the input field
            refreshTasks(); // Call refreshTasks to update the task list
        }
    };

    return (
        <Box display="flex" alignItems="center" width="100%">
            <TextField 
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
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
