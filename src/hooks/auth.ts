import { useMutation } from "@tanstack/react-query";
import { auth } from "../api/auth";

export const useAuth = () => {
    return useMutation({
        mutationFn: auth,
    })
}
