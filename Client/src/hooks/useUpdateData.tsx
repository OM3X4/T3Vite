import { supabase } from "./supabaseClient";
import { useMutation } from "@tanstack/react-query";
import { toast } from 'sonner'

async function updateUserData({ inchatname , job , moreinfo} : any){

    const { data } = await supabase.auth.getSession()

    const response = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${data.session?.access_token}`
        },
        body: JSON.stringify({ inchatname , job , moreinfo})
    });

    if (!response.ok) {
        supabase.auth.signOut()
        window.location.href = "/login"
        return
    }

    toast.success("Data updated successfully")

    return response.json();
}

export default function useUpdateData() {
    return useMutation({
        mutationFn: ({ inchatname , job , moreinfo} : any) => updateUserData({ inchatname , job , moreinfo}),
        onError: err => console.log("error updating the data : " , err)
    })
}