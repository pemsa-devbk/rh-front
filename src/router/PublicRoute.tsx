import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/auth/auth.store';



export const PublicRoute = () => {
    const token = useAuthStore( (state) => state.token)

    if (token) {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    return <Outlet />;
};