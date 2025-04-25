import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Link, Menu, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import { GitHub, LinkedIn, Menu as MenuIcon } from '@mui/icons-material';
import logoUrl from '../assets/logo.png';

const Header: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    
    const handleRefresh = () => {
        window.location.reload();
    };
    
    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static" style={{ width: '100%', marginBottom: '5em' }}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Link
                    component="button"
                    onClick={handleRefresh}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        textDecoration: 'none',
                        color: 'inherit',
                        cursor: 'pointer',
                        backgroundColor: 'transparent',
                        border: 'none',
                        '&:hover': {
                            opacity: 0.8
                        }
                    }}
                >
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
                </Link>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {!isMobile ? (
                        <>
                            <Link
                                href="https://mitchellwallace.dev"
                                target="_blank"
                                rel="noopener noreferrer"
                                color="inherit"
                                sx={{ 
                                    textDecoration: 'none',
                                    mr: 3,
                                    '&:hover': { textDecoration: 'underline' }
                                }}
                            >
                                Portfolio
                            </Link>
                            <Link
                                href="https://ephodstudio.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                color="inherit"
                                sx={{ 
                                    textDecoration: 'none',
                                    mr: 3,
                                    '&:hover': { textDecoration: 'underline' }
                                }}
                            >
                                Agency
                            </Link>
                            <Link
                                href="https://quotd.vercel.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                color="inherit"
                                sx={{ 
                                    textDecoration: 'none',
                                    mr: 3,
                                    '&:hover': { textDecoration: 'underline' }
                                }}
                            >
                                Quotd
                            </Link>
                            <IconButton
                                href="https://github.com/mitchell-wallace"
                                target="_blank"
                                rel="noopener noreferrer"
                                color="inherit"
                                sx={{ mr: 1 }}
                            >
                                <GitHub />
                            </IconButton>
                            <IconButton
                                href="https://linkedin.com/in/mitchell-wallace-dev/"
                                target="_blank"
                                rel="noopener noreferrer"
                                color="inherit"
                            >
                                <LinkedIn />
                            </IconButton>
                        </>
                    ) : (
                        <>
                            <IconButton
                                color="inherit"
                                aria-label="menu"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenuOpen}
                                edge="end"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={open}
                                onClose={handleMenuClose}
                            >
                                <MenuItem onClick={handleMenuClose} component="a" href="https://mitchellwallace.dev" target="_blank" rel="noopener noreferrer">
                                    Portfolio
                                </MenuItem>
                                <MenuItem onClick={handleMenuClose} component="a" href="https://ephodstudio.com" target="_blank" rel="noopener noreferrer">
                                    Agency
                                </MenuItem>
                                <MenuItem onClick={handleMenuClose} component="a" href="https://quotd.vercel.app/" target="_blank" rel="noopener noreferrer">
                                    Quotd
                                </MenuItem>
                                <MenuItem onClick={handleMenuClose} component="a" href="https://github.com/mitchell-wallace" target="_blank" rel="noopener noreferrer">
                                    <GitHub sx={{ mr: 1 }} /> GitHub
                                </MenuItem>
                                <MenuItem onClick={handleMenuClose} component="a" href="https://linkedin.com/in/mitchell-wallace-dev/" target="_blank" rel="noopener noreferrer">
                                    <LinkedIn sx={{ mr: 1 }} /> LinkedIn
                                </MenuItem>
                            </Menu>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
