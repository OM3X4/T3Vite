import { useQuery } from "@tanstack/react-query";
import { supabase } from "./supabaseClient";


async function getUserData() {
    const { data } = await supabase.auth.getSession()

    const response = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${data.session?.access_token}`
        },
    });

    if(response.status === 401){
        supabase.auth.signOut()
        window.location.href = "/login"
        return
    }

    const res = await response.json()
    console.log(res)
    return res
}

export default function useUserData() {
    return useQuery({
        queryKey: ["user"],
        queryFn: getUserData
    })
}