import React from 'react';
import { Chip, Box } from '@mui/material';
import { TaskRecommendation } from '../models/TaskRecommendation';

interface TaskRecommendationsProps {
  recommendations: TaskRecommendation[];
  onRecommendationClick: (taskName: string) => void;
}

const TaskRecommendations: React.FC<TaskRecommendationsProps> = ({ 
  recommendations, 
  onRecommendationClick 
}) => {
  return (
    <Box 
      display="flex" 
      flexWrap="wrap" 
      gap={1} 
      sx={{ 
        marginTop: '8px', 
        marginBottom: '16px' 
      }}
    >
      {recommendations.map((rec) => (
        <Chip
          key={rec.id}
          label={rec.taskName}
          onClick={() => onRecommendationClick(rec.taskName)}
          sx={{
            borderRadius: '16px',
            backgroundColor: '#f0f0f0',
            '&:hover': {
              backgroundColor: '#e0e0e0',
            },
            transition: 'background-color 0.2s ease-in-out',
            cursor: 'pointer'
          }}
        />
      ))}
    </Box>
  );
};

export default TaskRecommendations;
