export const selectUser = (userId) => {
    return {
        type: 'SELECT_USER',
        payload: userId,
    };
};

export const addMessage = (userId, message) => {
    return {
        type: 'ADD_MESSAGE',
        payload: { userId, message },
    };
};
