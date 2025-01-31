import React from 'react';
import { Container, Typography } from '@mui/material';
import TaskList from './TaskList';

const Main: React.FC = () => {
    return (
        <Container maxWidth={false} sx={{ maxWidth: '50rem' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Your Tasks
            </Typography>
            <TaskList />
        </Container>
    );
};

export default Main;
