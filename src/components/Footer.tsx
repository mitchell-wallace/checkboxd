import React from 'react';
import { Box, Typography } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const Footer: React.FC = () => {
    return (
        <Box component="footer" py={2} textAlign="center" position="static" bottom={0} left={0} right={0} width="100%" bgcolor="lightgrey" marginTop="3em">
            <Typography variant="body2" color="textSecondary">
                &copy; 2025 Checkboxd by 
                <a href="https://mitchellwallace.dev" target="_blank" rel="noopener noreferrer"> Mitchell Wallace
                    <OpenInNewIcon fontSize="inherit" sx={{ fontSize: '1rem' }} />
                </a> 
                &nbsp;&nbsp;•&nbsp;&nbsp;
                Logo by 
                <a href="https://www.flaticon.com/free-icons/ui-design" title="ui design icons"> th studio - Flaticon
                    <OpenInNewIcon fontSize="inherit" sx={{ fontSize: '1rem' }} />
                </a>
            </Typography>
        </Box>
    );
};

export default Footer;
