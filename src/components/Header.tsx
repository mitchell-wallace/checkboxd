import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import logoUrl from '../assets/logo.png';

const Header: React.FC = () => {
    return (
        <AppBar position="fixed" style={{ width: '100%' }}>
            <Toolbar>
                <Box
                    sx={{
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        padding: '3px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '16px'
                    }}
                >
                    <img src={logoUrl} alt="Checkboxd Logo" style={{ height: '40px' }} />
                </Box>
                <Typography variant="h6">
                    Checkboxd
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
