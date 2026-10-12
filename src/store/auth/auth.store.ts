import { StateCreator, create } from "zustand";
import { devtools } from 'zustand/middleware'
import { User } from "../../api/interfaces/user";


interface AuthState {
    user: User | null;
    token: string | null;
    status: 'Pendiente' | 'Autorizado' | 'NoAutorizado';

    login: (user: User, token: string) => void;
    refreshUser: (user: User) => void;
    setToken: (token: string) => void;
    setCheckingAuth: (
        status: 'Pendiente' | 'Autorizado' | 'NoAutorizado'
    ) => void;
    logOut: () => void;
}


const storeApi: StateCreator<AuthState> = (set, _) => ({
    status: 'Pendiente',
    token: null,
    user: null,

    login: (user, token) => {
        return set({
            status: 'Autorizado',
            user, token
        })
    },
    refreshUser: (user) => {
        return set({
            user,
            status: 'Autorizado'
        })
    },
    setToken: (token) => {
        set({
            token
        })
    },

    setCheckingAuth: (status) => {
        return set({ status });
    },
    logOut: () => {
        set({
            status: "NoAutorizado",
            token: null,
            user: null
        })
    }

})

export const useAuthStore = create<AuthState>()(
    devtools(
        storeApi,
    )
)