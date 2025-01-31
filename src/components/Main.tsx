import React from 'react';
import { Container, Typography } from '@mui/material';
import TaskList from './TaskList';
import TaskCreate from './TaskCreate';

const Main: React.FC = () => {
    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Your Tasks
            </Typography>
            <TaskCreate />
            <TaskList />
        </Container>
    );
};

export default Main;
