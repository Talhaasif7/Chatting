import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, List, ListItem, ListItemText, Button, Paper, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import axios from 'axios';
import { io } from 'socket.io-client'; // Import Socket.io client

const ChatRoom = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')); // Logged-in user
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const navigate = useNavigate();

    // Initialize Socket.io connection
    const socket = io('http://localhost:5000'); // Change this to your server URL if different

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/users', {
                headers: { 'x-auth-token': token }
            });
            console.log("Fetched Users from API:", response.data);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers(); // Fetch users on component mount

        socket.on('receiveMessage', (messageData) => {
            setChatMessages((prevMessages) => [...prevMessages, messageData]);
        });

        return () => {
            socket.off('receiveMessage');
            socket.disconnect(); // Clean up the socket connection
        };
    }, [socket]);

    const handleUserSelect = async (user) => {
        setSelectedUser(user);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/chats/${currentUser._id}/${user._id}`, {
                headers: { 'x-auth-token': token }
            });
            setChatMessages(response.data);
        } catch (error) {
            console.error('Error fetching chat messages:', error);
        }
    };

    const handleSendMessage = async () => {
        if (message.trim() && selectedUser) { // Ensure a user is selected before sending a message
            const messageData = {
                sender: currentUser._id,
                receiver: selectedUser._id,
                content: message,
            };

            // Emit the message via Socket.io
            socket.emit('sendMessage', messageData);

            // Optionally, save the message in the database if necessary
            try {
                const token = localStorage.getItem('token');
                await axios.post('/api/chats', messageData, {
                    headers: { 'x-auth-token': token }
                });
                setChatMessages(prevMessages => [...prevMessages, messageData]);
                setMessage('');
            } catch (error) {
                console.error('Error saving message:', error);
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('isAuth');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <Box display="flex" height="100vh" bgcolor="#f0f4f8">
            <Box
                width={{ xs: '100%', sm: '300px' }}
                bgcolor="#10375C"
                color="#F4F6FF"
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                padding="20px"
                boxShadow="2px 0 5px rgba(0, 0, 0, 0.1)"
            >
                <Box>
                    <Typography variant="h6" color="#F3C623" gutterBottom>
                        Active Users
                    </Typography>
                    <List>
                        {users.map((user) => (
                            <ListItem
                                button
                                key={user._id}
                                onClick={() => handleUserSelect(user)}
                                sx={{
                                    backgroundColor: selectedUser?._id === user._id ? '#EB8317' : '#F3C623',
                                    marginBottom: '8px',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    '&:hover': {
                                        backgroundColor: '#EB8317',
                                    },
                                }}
                            >
                                <ListItemText primary={user.name} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<ExitToAppIcon />}
                    sx={{
                        backgroundColor: '#F3C623',
                        color: '#10375C',
                        '&:hover': {
                            backgroundColor: '#EB8317',
                        },
                    }}
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </Box>

            {/* Chat area */}
            <Box flex={1} padding="20px">
                {!selectedUser ? (
                    <Typography variant="h5" color="#10375C">
                        Welcome {currentUser.name} to Walkie Talkie!
                    </Typography>
                ) : (
                    <Box display="flex" flexDirection="column" height="100%">
                        <Paper elevation={3} sx={{ flexGrow: 1, padding: '16px', overflowY: 'auto' }}>
                            {chatMessages.map((msg, index) => (
                                <Box
                                    key={index}
                                    textAlign={msg.sender === currentUser._id ? 'right' : 'left'}
                                    mb={2}
                                >
                                    <Typography
                                        variant="body1"
                                        component="span"
                                        bgcolor={msg.sender === currentUser._id ? '#EB8317' : '#F3C623'}
                                        color="#fff"
                                        padding="10px"
                                        borderRadius="12px"
                                    >
                                        {msg.content}
                                    </Typography>
                                </Box>
                            ))}
                        </Paper>
                        <Box display="flex" alignItems="center" mt={2}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message..."
                            />
                            <IconButton color="primary" onClick={handleSendMessage}>
                                <SendIcon />
                            </IconButton>
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default ChatRoom;
