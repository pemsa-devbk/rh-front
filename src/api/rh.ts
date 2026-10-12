import axios, { InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/auth/auth.store";
export const base_url = "http://localhost:3000/";
export const instance = axios.create(
    {
        baseURL: base_url,
        // baseURL: "https://rehunames.pem-sa.com.mx",
        withCredentials: true,
    }
);
let refreshPromise: Promise<string> | null = null;

export const refreshAccessToken = async (): Promise<string> => {
    if (refreshPromise) { return refreshPromise; }
    refreshPromise = instance.post<{ token: string; }>("/auth/refresh")
        .then(({ data }) => {
            const newToken = data.token;
            /** * Guardamos únicamente el nuevo * access token en Zustand. */
            useAuthStore.getState().setToken(newToken);
            return newToken;
        })
        .finally(() => {
            /** * El refresh terminó. * * Permitimos que en el futuro se * pueda iniciar otro. */
            refreshPromise = null;
        });
        return refreshPromise;
}

instance.interceptors.request.use(function (config) {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
})

instance.interceptors.response.use(response => response, async error => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean; }) | undefined;
    if (!originalRequest) {
        return Promise.reject(error);
    }

    const is401 = error.response?.status === 401;
    const isRefreshRequest = originalRequest.url?.includes('/auth/refresh');

    if (is401 && !originalRequest._retry && !isRefreshRequest) {

        originalRequest._retry = true;

        try {
            if (!refreshPromise) {
                
                const newToken = await refreshAccessToken();
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                /** * Reintentamos la petición original. */
                return instance(originalRequest);
            }
        } catch (error) {
            useAuthStore.getState().logOut();
            return Promise.reject(error);
        }
    }
    let normalizedError = {
        status: 500,
        message: 'Ha ocurrido un error inesperado.',
        original: error,
    };

    if (error.response) {
        const res = error.response;
        normalizedError.status = res.status;

        // ✅ Si la respuesta es Blob, convertir a texto y luego intentar parsear JSON
        if (res.data instanceof Blob) {
            try {
                const text = await res.data.text();
                const json = JSON.parse(text);

                if (json.error) {
                    normalizedError.message = json.error;
                }
                //  else if (json.message) {
                //     normalizedError.message = json.message;
                // }
            } catch (e) {
                // Si no se pudo parsear, usar mensaje genérico
                normalizedError.message = 'Error desconocido en la respuesta.';
            }
        } else if (res.data && res.data.error) {
            normalizedError.message = res.data.error;
        } else if (res.data && typeof res.data === 'string') {
            normalizedError.message = res.data;
        } else if (res.message) {
            normalizedError.message = res.message;
        }
    } else if (error.request) {
        normalizedError.message = 'No se pudo conectar con el servidor.';
    } else {
        normalizedError.message = error.message;
    }
    return Promise.reject(normalizedError);


});
