import {
  Navigate,
  Outlet,
} from 'react-router-dom';
import { useAuthStore } from '../store/auth/auth.store';


export const PrivateRoute = () => {
  const accessToken = useAuthStore(
    (state) => state.token,
  );

  if (!accessToken) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <Outlet />;
};