import { StateCreator, create } from "zustand";
import { devtools, persist } from 'zustand/middleware'
import { instance } from "../../api/rh";
import Swal from "sweetalert2";

interface User {
    id: string;
    name: string;
    rol: string;
    createdAt: string;
    state: string;
}

type Status = "Pendiente" | "Logueado" | "NoAutorizado"


interface AuthState {
    status: Status;
    token?: string;
    user?: User;
    login: (id: string, password: string) => Promise<void>;
    checkStatus: () => Promise<void>;
    logOut: () => void;
}


const storeApi: StateCreator<AuthState> = (set, get) => ({
    status: 'Pendiente',
    token: undefined,
    user: undefined,
    
    // login: async (id, password) => {
    //     const myHeaders = new Headers();
    //     myHeaders.append("Content-Type", "application/json");
    //     const resp = await fetch("http://localhost:3000/auth/login", {
    //         method: 'POST',
    //         body: JSON.stringify({
    //             id, password
    //         }),
    //         headers: myHeaders

    //     })

    //     console.log(resp.ok);


    //     const data = await resp.json();

    //     console.log(data);
    //     if (resp.ok) {
    //         return set({
    //             status: 'Logueado',
    //             user: data.user, token: data.token
    //         })
    //     }


    // },
    login: async (id, password) => {
        try {
            const { data } = await instance.post<{ token: string, user: User }>('auth/login', { id, password });
            return set({
                status: 'Logueado',
                user: data.user, token: data.token
            })
        } catch (error) {
            Swal.fire("Credenciales no válidas")
            console.log(error);

        }
    },

    // checkStatus: async () => {
    //     if (!get().token) {
    //         return set({
    //             status: 'NoAutorizado'
    //         })
    //     }
    //     const myHeaders = new Headers();
    //     myHeaders.append("Authorization", `Bearer ${get().token}`);
    //     const resp = await fetch("http://localhost:3000/auth/check", {
    //         headers: myHeaders
    //     });
    //     const data = await resp.json();

    //     console.log(data);



    //     if (resp.ok) {
    //         return set({
    //             status: 'Logueado',
    //             user: data.user, token: data.token
    //         })
    //     }

    //     set({
    //         status: "NoAutorizado",
    //         user: undefined,
    //         token: undefined
    //     })


    // },

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