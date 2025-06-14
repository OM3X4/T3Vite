import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router";

async function sendMessage({ model, provider, messages, chatId }: any) {

    console.log("hi we are sending a message")
    console.log("messages : " , messages)
    const { data } = await supabase.auth.getSession()


    const response = await fetch(`${import.meta.env.VITE_API_URL}/model?model=${model}&provider=${provider}&chatid=${chatId}`, {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${data.session?.access_token}`
        },
        body: JSON.stringify({ messages: messages })
    })

    if (response.status === 499) {
        toast.error("You didn't assign openrouter api key", {
            className: "flex items-center justify-center gap-2",
            action: {
                label: "Set It",
                onClick: () => window.open("https://openrouter.ai/", "_blank"),
            },
        })
        throw new Error("499")
    }

    if (response.status === 402) {
        toast.error("You have reached your request limit for today.", {
            className: "flex items-center justify-center gap-2",
            action: {
                label: "Buy",
                onClick: () => window.open("https://openrouter.ai/", "_blank"),
            },
        })
    }

    const res = await response.json()
    console.log("res : " , res)
    return res;
}

export default function useSendMessage(onSuccessCallback?: any) {

    const navigate = useNavigate()

    return useMutation({
        mutationFn: ({ model, provider, messages, chatId }: any) => sendMessage({ model, provider, messages, chatId }),
        onSuccess: (data) => {
            if(onSuccessCallback){
                onSuccessCallback(data)
            }
        },
        onError: (error) => {
            console.log(error)
            if(error?.message === "499"){
                navigate("/settings?apikey=1")
            }
        }
    })
}