import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
    return (
        <Box component="footer" py={2} textAlign="center" position="fixed" bottom={0} left={0} right={0} width="100%" bgcolor="lightgrey">
            <Typography variant="body2" color="textSecondary">
                2025 Checkboxd by Mitchell Wallace
            </Typography>
            <Typography variant="body2" color="textSecondary">
                Ui design icons created by 
                <a href="https://www.flaticon.com/free-icons/ui-design" title="ui design icons"> th studio - Flaticon
                </a>
            </Typography>
        </Box>
    );
};

export default Footer;
