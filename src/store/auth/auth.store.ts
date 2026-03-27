import { StateCreator, create } from "zustand";
import { devtools, persist } from 'zustand/middleware'
import { instance } from "../../api/rh";
import Swal from "sweetalert2";
import { User } from "../../api/interfaces/user";


type Status = "Pendiente" | "Logueado" | "NoAutorizado"


interface AuthState {
    status: Status;
    token?: string;
    user?: User;
    login: (user_id: string, password: string) => Promise<void>;
    checkStatus: () => Promise<void>;
    logOut: () => void;
}


const storeApi: StateCreator<AuthState> = (set, get) => ({
    status: 'Pendiente',
    token: undefined,
    user: undefined,
    
    login: async (user_id, password) => {
        try {
            const { data } = await instance.post<{ token: string, user: User }>('auth/login', { user_id, password });
            return set({
                status: 'Logueado',
                user: data.user, token: data.token
            })
        } catch (error) {
            Swal.fire("Credenciales no válidas")
        }
    },

    checkStatus: async () => {
        if (!get().token) {
            return set({
                status: 'NoAutorizado'
            })
        }
        try {
            const { data } = await instance.get<{ token: string, user: User }>('auth/check');
            
            return set({
                status: 'Logueado',
                user: data.user, token: data.token
            })

        } catch (error) {
            set({
                status: "NoAutorizado",
                user: undefined,
                token: undefined
            })

        }

    },
    logOut: () => {
        set({
            status: "NoAutorizado",
            token: undefined,
            user: undefined
        })
    }

})

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            storeApi,
            {
                name: 'infoLog',
                partialize: (state) => {
                    return ({
                        token: state.token,
                        user: state.user
                    })
                },
            }
        )

    )
)