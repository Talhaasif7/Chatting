export const register = (userData) => {
    // Mock registration logic
    return (dispatch) => {
        // Normally you'd make an API request here
        dispatch({
            type: 'REGISTER_SUCCESS',
            payload: userData,
        });
    };
};

export const login = (credentials) => {
    return (dispatch) => {
        // Mock login logic
        dispatch({
            type: 'LOGIN_SUCCESS',
            payload: credentials,
        });
    };
};

export const logout = () => {
    return {
        type: 'LOGOUT',
    };
};
