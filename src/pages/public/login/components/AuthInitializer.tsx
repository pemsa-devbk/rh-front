import {
    ReactNode,
    useEffect,
    useState,
} from 'react';
import { Spin } from 'antd';
import { useAuthStore } from '../../../../store/auth/auth.store';
import { chetStatus } from '../../../../api/auth';
import { refreshAccessToken } from '../../../../api/rh';


interface AuthInitializerProps {
    children: ReactNode;
}

export const AuthInitializer = ({
    children,
}: AuthInitializerProps) => {
    const accessToken = useAuthStore((state) => state.token);
    const refreshUser = useAuthStore((state) => state.refreshUser);
    const logOut = useAuthStore((state) => state.logOut);
    const setCheckingAuth = useAuthStore(
        (state) => state.setCheckingAuth
    );

    const [initialized, setInitialized] = useState(false);


    useEffect(() => {
        let mounted = true;
        const initializeAuth = async () => {
            try {
                // * NO hay acccesToken tenemos que obtenerlo
                if (!accessToken) {

                    await refreshAccessToken();
                    if (!mounted) return;
                }
                // * Ya tenemos acceso token
                const checkResponse = await chetStatus();
                if (!mounted) return;
                refreshUser(checkResponse.user);
                setCheckingAuth('Autorizado');
            } catch (error) {
                // * No se pudo restaurar la sesión
                if (!mounted) return;
                logOut();
                setCheckingAuth('NoAutorizado');
            } finally {
                if (mounted) setInitialized(true);
            }
        };
        initializeAuth();
        return () => {
            mounted = false;
        }
    }, []);



    if (!initialized) {
        return (
            <div
                style={{
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Spin size="large" />
            </div>
        );
    }

    return children;
};