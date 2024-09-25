import React, { createContext, useContext, useState, useEffect } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('authToken') || null);
    const [intendedRoute, setIntendedRoute] = useState(null);
    const [initialView, setInitialView] = useState('welcome');
    const navigate = useNavigate();

    const openAuthModal = (view = 'welcome', route = null) => {
        setIntendedRoute(route);
        setInitialView(view);
        setModalOpen(true);
    };

    const closeAuthModal = () => setModalOpen(false);

    const handleAuthSuccess = () => {
        if (intendedRoute) {
            navigate(intendedRoute);
            setIntendedRoute(null);
        }
        closeAuthModal();
    };

    const register = async (data) => {
        try {
            const response = await api.post('/users/register', data);
            setUser(response.data.user);
            setToken(response.data.token);
            localStorage.setItem('authToken', response.data.token);
            handleAuthSuccess();
            return { message: 'User registered successfully.' };
        } catch (error) {
            return { error: error.response?.data?.error || 'Registration failed. Please try again later.' };
        }
    };

    const logIn = async (data) => {
        try {
            const response = await api.post('/users/login', data);
            setUser(response.data.user);
            setToken(response.data.token);
            localStorage.setItem('authToken', response.data.token);
            handleAuthSuccess();
            return response.data;
        } catch (error) {
            return { error: error.response?.data?.error || 'Login failed. Please try again later.' };
        }
    };

    const logInWithGoogle = async (tokenId) => {
        try {
            const response = await api.post('/users/google-login', { tokenId });
            setUser(response.data.user);
            setToken(response.data.token);
            localStorage.setItem('authToken', response.data.token);
            handleAuthSuccess();
        } catch (error) {
            return { error: error.response?.data?.error || 'Google login failed. Please try again later.' };
        }
    };

    const createUser = async (username) => {
        try {
            const response = await api.post('/users/create-user', { username });
            setUser(response.data.user);
            setToken(response.data.token);
            localStorage.setItem('authToken', response.data.token);
            handleAuthSuccess();
            return response.data;
        } catch (error) {
            console.error('Create user error:', error);
            return { error: error.response?.data?.error || 'Username creation failed. Please try again later.' };
        }
    };

    const updateUsername = async (username) => {
        try {
            const response = await api.post('/users/update-username', { username });
            setUser(response.data.user);
            return response.data;
        } catch (error) {
            return { error: error.response?.data?.error || 'Username update failed. Please try again later.' };
        }
    };

    const logOut = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('authToken');
        navigate('/'); // Redirect to home on logout
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken && !user) {
            api.get('/users/me', { headers: { 'Authorization': `Bearer ${storedToken}` } }) // Corrected header format
                .then(response => {
                    setUser(response.data.user);
                    setToken(storedToken);
                })
                .catch(() => {
                    logOut();
                });
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ 
            modalOpen, 
            openAuthModal, 
            closeAuthModal, 
            register, 
            logIn, 
            logInWithGoogle, 
            createUser, 
            logOut, 
            user, 
            token, 
            setUser, 
            setToken, 
            handleAuthSuccess, 
            setIntendedRoute, 
            initialView 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
