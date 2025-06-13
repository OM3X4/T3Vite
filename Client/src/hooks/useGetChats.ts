import { useQuery } from "@tanstack/react-query";
import { supabase } from "./supabaseClient";

async function getChats() {
    const { data } = await supabase.auth.getSession()

    const response = await fetch(`${import.meta.env.VITE_API_URL}/chats`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${data.session?.access_token}`
        },
    });
    if (!response.ok) throw new Error("Not authorized");
    return response.json();
}

export default function useGetChats() {
    return useQuery({
        queryKey: ["chats"],
        queryFn: getChats
    })
}
