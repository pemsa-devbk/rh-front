import axios from "axios";
import { useAuthStore } from "../store/auth/auth.store";

export const instance = axios.create(
    {
        // baseURL: "http://localhost:3000/",
        baseURL: "https://rehunames.pem-sa.com.mx",
    }
);


instance.interceptors.request.use(function (config){
   const token = useAuthStore.getState().token;
   if(token){
    config.headers["Authorization"] = `Bearer ${token}`;
   }
    
    return config;
}, function(error){
    return Promise.reject(error);  
})



