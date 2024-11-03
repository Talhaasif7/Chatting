import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post('/auth/register', { name, email, password });

            alert('Registration successful!');
            navigate('/'); // Redirect to login page after successful registration
        } catch (error) {
            console.error('Registration error:', error);

            if (error.response) {
                alert(error.response.data.error || 'Registration failed. Please try again.');
            } else {
                alert('Registration failed. Please try again.');
            }
        }
    };

    return (
        <Container maxWidth="sm" style={{ backgroundColor: '#F4F6FF', padding: '50px', borderRadius: '10px', marginTop: '50px' }}>
            <Typography variant="h4" style={{ color: '#10375C', marginBottom: '20px', fontWeight: 'bold' }}>
                Create an Account
            </Typography>
            <form onSubmit={handleRegister}>
                <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
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
                    Register
                </Button>
            </form>
            <Typography variant="body2" style={{ marginTop: '20px', color: '#10375C' }}>
                Already registered?{' '}
                <Link href="/" style={{ color: '#F3C623' }}>
                    Login here
                </Link>
            </Typography>
        </Container>
    );
};

export default Register;