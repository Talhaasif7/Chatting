import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const isAuth = localStorage.getItem('isAuth');

    return isAuth ? children : <Navigate to="/" />;
};

export default PrivateRoute;