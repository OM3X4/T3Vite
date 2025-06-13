import { supabase } from "./supabaseClient";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

async function updateAPIKEY(apikey: any){

    const { data } = await supabase.auth.getSession()


    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/key`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${data.session?.access_token}`
        },
        body: JSON.stringify({ key: apikey })
    });

    if (response.status === 401) {
        supabase.auth.signOut()
        window.location.href = "/login"
        return
    }else if(!response.ok){
        toast.error("Something went wrong")
        return
    }


    toast.success("API Key updated successfully")

    return response.json();
}

export default function useUpdateKey() {
    return useMutation({
        mutationFn: (apikey: any) => updateAPIKEY(apikey),
        onError: err => console.log("error updating the data : " , err)
    })
}

