import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import api from './api';
import { useAuth } from './AuthContext';

const SignUpWithGoogle = () => {
    const { setUser, setToken, handleAuthSuccess } = useAuth();
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [googleData, setGoogleData] = useState(null);

    const handleGoogleSuccess = async (credentialResponse) => {
        const { credential } = credentialResponse;
        try {
            // Step 1: Authenticate with Google and check if user exists
            const result = await api.post('/users/google-login', { tokenId: credential });

            if (result.data.isNewUser) {
                // If the user is new, open the dialog to enter username
                setGoogleData({ tokenId: credential, email: result.data.email });
                setOpen(true);
            } else {
                // User already exists, proceed with login
                setUser(result.data.user);
                setToken(result.data.token);
                localStorage.setItem('authToken', result.data.token);
                handleAuthSuccess();
            }
        } catch (error) {
            console.error('Google Sign-In Error:', error);
        }
    };

    const handleGoogleFailure = (error) => {
        console.error('Google Sign-In Error:', error);
    };

    const handleUsernameSubmit = async () => {
        if (username.length < 5 || username.length > 16) {
            alert('Username must be between 5 and 16 characters.');
            return;
        }
        try {
            const response = await api.post('/users/google-complete', {
                tokenId: googleData.tokenId,
                username,
                email: googleData.email
            });
            setUser(response.data.user);
            setToken(response.data.token);
            localStorage.setItem('authToken', response.data.token);
            setOpen(false);
            handleAuthSuccess();
        } catch (error) {
            console.error('Username submission error:', error);
            alert('Failed to complete Google Sign-Up. Please try again.');
        }
    };

    return (
        <>
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                render={(renderProps) => (
                    <Button
                        variant="contained"
                        onClick={renderProps.onClick}
                        disabled={renderProps.disabled}
                        fullWidth
                        sx={{ backgroundColor: '#DB4437', color: 'white', mt: 2 }}
                    >
                        Continue with Google
                    </Button>
                )}
            />
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Choose a Username</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Username"
                        type="text"
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleUsernameSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SignUpWithGoogle;
