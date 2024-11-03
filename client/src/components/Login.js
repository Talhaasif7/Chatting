import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post('/auth/login', { email, password });

            // Store token and user details in localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('currentUser', JSON.stringify(response.data.user));

            alert(response.data.message);
            navigate('/chatroom'); // Redirect to ChatRoom after successful login
        } catch (error) {
            console.error('Login error:', error);
            if (error.response) {
                alert(error.response.data.error || 'Login failed. Please try again.');
            } else {
                alert('Login failed. Please try again.');
            }
        }
    };

    return (
        <Container maxWidth="sm" style={{ backgroundColor: '#F4F6FF', padding: '50px', borderRadius: '10px', marginTop: '50px' }}>
            <Typography variant="h4" style={{ color: '#10375C', marginBottom: '20px', fontWeight: 'bold' }}>
                Login to Your Account
            </Typography>
            <form onSubmit={handleLogin}>
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    style={{ marginTop: '20px', backgroundColor: '#EB8317', color: '#FFF', fontWeight: 'bold' }}
                >
                    Login
                </Button>
            </form>
            <Typography variant="body2" style={{ marginTop: '20px', color: '#10375C' }}>
                Don't have an account?{' '}
                <Link href="/register" style={{ color: '#F3C623' }}>
                    Register here
                </Link>
            </Typography>
        </Container>
    );
};

export default Login;