import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Header: React.FC = () => {
    return (
        <AppBar position="fixed" style={{ width: '100%' }}>
            <Toolbar>
                <Typography variant="h6">
                    TODO App
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
