import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
    return (
        <Box component="footer" py={2} textAlign="center" position="fixed" bottom={0} left={0} right={0} width="100%" bgcolor="lightgrey">
            <Typography variant="body2" color="textSecondary">
                2025 TODO App
            </Typography>
        </Box>
    );
};

export default Footer;
