import { useMutation } from "@tanstack/react-query";
import { supabase } from "./supabaseClient";

async function CreateNewChat(message: any) {

    const { data } = await supabase.auth.getSession()

    const newChatResponse = await fetch(`${import.meta.env.VITE_API_URL}/model/new`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${data.session?.access_token}`
        }
    })
    const resChatId = await newChatResponse.json()
    const chatId = resChatId.chatid

    window.location.href = `/c/${chatId}?message=${message}`
}

export default function useNewChat({ onSuccessCallback }: { onSuccessCallback: (data: any) => void }) {
    return useMutation({
        mutationFn: (message: any) => CreateNewChat( message ),
        onSuccess: (data) => {
            onSuccessCallback(data)
        },
        onError: () => {
            console.log("Error creating new chat")
        }
    })
}
