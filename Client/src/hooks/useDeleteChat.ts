import {supabase} from '../hooks/supabaseClient'
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

async function deleteChat(chatid : any){

    const { data } = await supabase.auth.getSession()

    const response = await fetch(`${import.meta.env.VITE_API_URL}/chat/${chatid}` , {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${data.session?.access_token}`
        },
    })
    if (!response.ok){
        toast.error("Something went wrong")
    }
    return response.json();
}

export default function useDeleteChat(onSuccessCallback?: any) {
    return useMutation({
        mutationFn: (chatid : any) => deleteChat(chatid),
        onError: err => console.log("error updating the data : " , err),
        onSuccess: (data) => {
            if(onSuccessCallback) onSuccessCallback(data);
        }
    })
}