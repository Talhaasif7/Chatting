const initialState = {
    selectedUser: null,
    messages: {}, // Store messages in a key-value pair where key is user ID
};

const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SELECT_USER':
            return {
                ...state,
                selectedUser: action.payload,
            };
        case 'ADD_MESSAGE':
            const { userId, message } = action.payload;
            return {
                ...state,
                messages: {
                    ...state.messages,
                    [userId]: [...(state.messages[userId] || []), message],
                },
            };
        default:
            return state;
    }
};

export default chatReducer;
