import React, { useState } from 'react';
import { TextField, Button, Typography, Box, IconButton, InputAdornment } from '@mui/material';
import { useAuth } from './AuthContext';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function LogInForm({ onClose }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { logIn } = useAuth();

    const handleLogIn = async () => {
        try {
            const response = await logIn({ email: email.toLowerCase(), password }); // Convert email to lowercase
            if (!response.error) {
                localStorage.setItem('authToken', response.token);
                onClose();
            } else {
                setError(response.error);
            }
        } catch (err) {
            setError('Failed to log in. Please try again later.');
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleLogIn();
        }
    };

    return (
        <Box>
            <Typography variant="h6">Log In</Typography>
            {error && <Typography color="error">{error}</Typography>}
            <TextField
                fullWidth
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                onKeyDown={handleKeyDown}  
                sx={{
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#7851A9',
                        },
                        '&:hover fieldset': {
                            borderColor: '#6a3d9a',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#6a3d9a',
                        },
                    },
                }}
            />
            <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                onKeyDown={handleKeyDown}  
                sx={{
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#7851A9',
                        },
                        '&:hover fieldset': {
                            borderColor: '#6a3d9a',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#6a3d9a',
                        },
                    },
                }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={handleClickShowPassword}>
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            <Button
                fullWidth
                variant="contained"
                onClick={handleLogIn}
                sx={{ mt: 2, backgroundColor: '#7851A9', color: 'white', '&:hover': { backgroundColor: '#6a3d9a' } }}
            >
                Log In
            </Button>
        </Box>
    );
}

export default LogInForm;
