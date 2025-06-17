import { useQuery } from "@tanstack/react-query";
import { supabase } from "./supabaseClient";

async function getChats(chatId : any){
    if(typeof chatId != "string") {
        return
    }

    const { data } = await supabase.auth.getSession()

    const response = await fetch(`${import.meta.env.VITE_API_URL}/chat/${chatId}` , {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${data.session?.access_token}`
        },
    })

    const res = response.json()

    return res;
}

export default function useChatMessages(chatId : any){
    return useQuery({
        queryKey: ["chats" , chatId],
        queryFn: () => getChats(chatId),
        enabled: typeof chatId === "string"
    })
}
