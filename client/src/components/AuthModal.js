import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, Button, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SignUpWithEmailForm from './SignUpWithEmailForm';
import LogInForm from './LogInForm';
import { useAuth } from './AuthContext';
import SignUpWithGoogle from './SignUpWithGoogle'; // Import the new component

function AuthModal({ open, onClose }) {
    const { register, logIn, modalOpen, closeAuthModal, initialView } = useAuth();
    const [view, setView] = useState(initialView);

    useEffect(() => {
        if (open) {
            setView(initialView);
        }
    }, [open, initialView]);

    useEffect(() => {
        if (!modalOpen) {
            onClose();
        }
    }, [modalOpen, onClose]);

    const switchView = (view) => {
        setView(view);
    };

    const handleSignUpWithEmail = async (data) => {
        const response = await register(data);
        return response;
    };

    const handleLogIn = async (data) => {
        const response = await logIn(data);
        return response;
    };

    const renderForm = () => {
        switch (view) {
            case 'welcome':
            case 'signUp':
                return (
                    <>
                        <DialogTitle>Sign Up</DialogTitle>
                        <Button
                            variant="contained"
                            onClick={() => switchView('signUpEmail')}
                            fullWidth
                            sx={{ backgroundColor: '#7851A9', color: 'white', '&:hover': { backgroundColor: '#6a3d9a' } }}
                        >
                            Continue with Email
                        </Button>
                        <SignUpWithGoogle />
                        <Typography sx={{ mt: 2 }}>
                            Already have an account?{' '}
                            <Button onClick={() => switchView('logIn')} sx={{ color: '#7851A9' }}>
                                Log In
                            </Button>
                        </Typography>
                    </>
                );
            case 'signUpEmail':
                return <SignUpWithEmailForm onSignUp={handleSignUpWithEmail} />;
            case 'logIn':
                return (
                    <>
                        <DialogTitle>Log In</DialogTitle>
                        <Button
                            variant="contained"
                            onClick={() => switchView('logInEmail')}
                            fullWidth
                            sx={{ backgroundColor: '#7851A9', color: 'white', '&:hover': { backgroundColor: '#6a3d9a' } }}
                        >
                            Continue with Email
                        </Button>
                        <SignUpWithGoogle />
                        <Typography sx={{ mt: 2 }}>
                            Don't have an account?{' '}
                            <Button onClick={() => switchView('signUp')} sx={{ color: '#7851A9' }}>
                                Sign Up
                            </Button>
                        </Typography>
                    </>
                );
            case 'logInEmail':
                return <LogInForm onLogIn={handleLogIn} />;
            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onClose={closeAuthModal} fullWidth>
            <IconButton
                aria-label="close"
                onClick={closeAuthModal}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent>
                {renderForm()}
            </DialogContent>
        </Dialog>
    );
}

export default AuthModal;
