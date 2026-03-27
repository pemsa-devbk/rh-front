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

instance.interceptors.response.use(function onFulfilled(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function onRejected(error) {
    if(error.response && error.response.data && error.response.data.error) return Promise.reject(new Error(error.response.data.error))
    
    return Promise.reject(error);
});
