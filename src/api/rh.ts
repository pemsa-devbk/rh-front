import axios from "axios";
import { useAuthStore } from "../store/auth/auth.store";
export const base_url = "http://127.0.0.1:3000/";
export const instance = axios.create(
    {
        baseURL: base_url,
        // baseURL: "https://rehunames.pem-sa.com.mx",
    }
);


instance.interceptors.request.use(function (config) {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
})

instance.interceptors.response.use(
    response => response,
    async error => {
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
                normalizedError.message =res.data.error;
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
    }
);
// instance.interceptors.response.use(function onFulfilled(response) {
//     // Any status code that lie within the range of 2xx cause this function to trigger 
//     // Do something with response data 
//     return response;
// }, function onRejected(error) {
//     if(error.response && error.response.data && error.response.data.error) return Promise.reject(new Error(error.response.data.error))
    
//     return Promise.reject(error);
// });
