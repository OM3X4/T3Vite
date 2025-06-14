import { useMutation } from "@tanstack/react-query";
import { supabase } from "./supabaseClient";

async function CreateNewChat() {

    const { data } = await supabase.auth.getSession()

    const newChatResponse = await fetch(`${import.meta.env.VITE_API_URL}/model/new`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${data.session?.access_token}`
        }
    })
    const resChatId = await newChatResponse.json()

    return resChatId
}

export default function useNewChat() {
    return useMutation({
        mutationFn: () => CreateNewChat(),
        onSuccess: () => {
        },
        onError: () => {
            console.log("Error creating new chat")
        }
    })
}
