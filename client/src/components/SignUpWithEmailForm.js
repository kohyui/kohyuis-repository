import React, { useState } from 'react';
import { TextField, IconButton, Button, Typography, Box, InputAdornment } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import api from './api';
import { useAuth } from './AuthContext';

function SignUpWithEmailForm({ onClose }) {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();

    const handleNextStep = async () => {
        if (step === 1) {
            if (!/\S+@\S+\.\S+/.test(email)) {
                setError('Please enter a valid email.');
                return;
            }
            try {
                const response = await api.post('/users/check-email', { email });
                if (response.data.exists) {
                    setError('Email is already taken.');
                    return;
                }
            } catch (error) {
                setError('Server error. Please try again later.');
                return;
            }
        }
        if (step === 2) {
            if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
                setError('Your password must have: 8 or more characters, upper & lowercase letters, at least one number, and one special character.');
                return;
            }
            if (password !== confirmPassword) {
                setError('Passwords do not match.');
                return;
            }
        }
        if (step === 3) {
            if (username.length < 5 || username.length > 16) {
                setError('Username must be between 5 and 16 characters.');
                return;
            }
            try {
                const response = await api.post('/users/check-username', { username });
                if (response.data.exists) {
                    setError('Username is already taken.');
                    return;
                }
            } catch (error) {
                setError('Server error. Please try again later.');
                return;
            }
            try {
                await api.post('/users/send-verification-code', { email });
            } catch (error) {
                setError('Failed to send verification code. Please try again later.');
                return;
            }
        }
        setError('');
        setStep(step + 1);
    };

    const handleBackStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleRegister = async () => {
        try {
            const payload = { email, verificationCode, password, username };
            const registerResponse = await register(payload);
            if (registerResponse.error) {
                setError(registerResponse.error);
                return;
            }
            setError('');
            onClose(); // Ensure the modal closes after successful registration
        } catch (error) {
            setError('Failed to register. Please try again later.');
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            if (step === 4) {
                handleRegister();
            } else {
                handleNextStep();
            }
        }
    };

    return (
        <Box>
            {step > 1 && (
                <IconButton onClick={handleBackStep} sx={{ position: 'absolute', left: 8, top: 8 }}>
                    <ArrowBackIcon />
                </IconButton>
            )}
            {step === 1 && (
                <Box>
                    <Typography variant="h6">Enter your email</Typography>
                    <TextField
                        fullWidth
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(''); }}
                        error={!!error}
                        helperText={error}
                        onKeyDown={handleKeyDown} 
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#7851A9', // Default purple
                                },
                                '&:hover fieldset': {
                                    borderColor: '#6a3d9a', // Darker purple on hover
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#6a3d9a', // Focused purple
                                },
                            },
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleNextStep}>
                                        <ArrowForwardIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            )}
            {step === 2 && (
                <Box>
                    <Typography variant="h6">Enter your password</Typography>
                    <TextField
                        fullWidth
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(''); }}
                        error={!!error}
                        helperText={error || 'Your password must have: 8 or more characters, upper & lowercase letters, at least one number, and one special character.'}
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
                    <TextField
                        fullWidth
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                        error={!!error}
                        helperText={error}
                        onKeyDown={handleKeyDown} 
                        label="Confirm Password"
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
                                    <IconButton onClick={handleNextStep}>
                                        <ArrowForwardIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            )}
            {step === 3 && (
                <Box>
                    <Typography variant="h6">Enter your username</Typography>
                    <TextField
                        fullWidth
                        value={username}
                        onChange={(e) => { setUsername(e.target.value.slice(0, 16)); setError(''); }}
                        error={!!error}
                        helperText={error}
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
                                    <IconButton onClick={handleNextStep}>
                                        <ArrowForwardIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            )}
            {step === 4 && (
                <Box>
                    <Typography variant="h6">Enter the verification code sent to your email</Typography>
                    <TextField
                        fullWidth
                        value={verificationCode}
                        onChange={(e) => { setVerificationCode(e.target.value); setError(''); }}
                        error={!!error}
                        helperText={error}
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
                                    <Button
                                        variant="contained"
                                        onClick={handleRegister}
                                        sx={{
                                            backgroundColor: '#6a0dad', // Base purple color
                                            '&:hover': {
                                                backgroundColor: '#4b0082', // Darker purple for hover
                                            },
                                            color: 'white',
                                        }}
                                    >
                                        Register
                                    </Button>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            )}
        </Box>
    );
}

export default SignUpWithEmailForm;
