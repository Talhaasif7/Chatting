import React from 'react';
import { Box, List, ListItem, ListItemText } from '@mui/material';

const Sidebar = () => {
    const chats = ['Chat 1', 'Chat 2', 'Chat 3']; // Replace with actual chat data

    return (
        <Box style={{ width: '250px', backgroundColor: '#F4F6FF', padding: '10px' }}>
            <List>
                {chats.map((chat, index) => (
                    <ListItem key={index} button>
                        <ListItemText primary={chat} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default Sidebar;
