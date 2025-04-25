import React, { useState, useEffect, useMemo } from 'react';
import { Button, TextField, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TaskRecommendations from './TaskRecommendations';
import TaskRecommendationService from '../services/TaskRecommendationService';
import { TaskDataModel } from '../models/TaskDataModel';
import { TaskRecommendation } from '../models/TaskRecommendation';

interface TaskCreateProps {
    onCreateTask: (taskName: string) => void;
    refreshTasks: () => void;
    currentTasks: TaskDataModel[];
}

const TaskCreate: React.FC<TaskCreateProps> = ({ onCreateTask, refreshTasks, currentTasks }) => {
    const [taskName, setTaskName] = useState('');
    const [recommendations, setRecommendations] = useState<TaskRecommendation[]>([]);
    
    // Use useMemo to avoid recreating service on every render
    const recommendationService = useMemo(() => new TaskRecommendationService(), []);

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

    const handleRecommendationClick = (recommendedTaskName: string) => {
        onCreateTask(recommendedTaskName);
        setTaskName(''); // Clear the input field
        refreshTasks(); // Call refreshTasks to update the task list
    };

    // Update recommendations whenever the task name changes or current tasks change
    useEffect(() => {
        const updatedRecommendations = recommendationService.getRecommendations(
            currentTasks,
            taskName,
            5
        );
        setRecommendations(updatedRecommendations);
    }, [taskName, currentTasks, recommendationService]);

    return (
        <>
            <Box display="flex" alignItems="center" width="100%" paddingBottom="8px">
                <TextField 
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    label="New Task"
                    variant="outlined"
                    fullWidth
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '50px',
                            '& fieldset': {
                                borderColor: '#777',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                border: '2px solid #777'
                            }
                        }
                    }}
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
            {recommendations.length > 0 && (
                <TaskRecommendations 
                    recommendations={recommendations}
                    onRecommendationClick={handleRecommendationClick}
                />
            )}
        </>
    );
};

export default TaskCreate;
