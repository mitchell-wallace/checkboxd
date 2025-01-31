import React from 'react';
import { Container, Typography } from '@mui/material';

const Main: React.FC = () => {
    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Your Tasks
            </Typography>
            {/* Task list and input components will go here */}
        </Container>
    );
};

export default Main;
