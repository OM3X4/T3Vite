import { supabase } from "./supabaseClient";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import MessageLoading from "../Components/MessageLoading";

async function memorizeMessage(messageContent : any) {
    toast.custom(() => (
    <div className="flex items-center justify-center border-border border bg-surface-backgroundme rounded-2xl p-3 gap-3">
        <MessageLoading />
    </div>)
    )
    const { data } = await supabase.auth.getSession()

    const response = await fetch(`${import.meta.env.VITE_API_URL}/model/memorize/` , {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${data.session?.access_token}`
        },
        body: JSON.stringify({messagecontent: messageContent})
    })
    if (!response.ok){
        toast.error("Something went wrong in memorizing")
    }
    return response.json();
}

export default function useMemorizeMessage(onSuccessCallback?: any) {
    return useMutation({
        mutationFn: (messageContent : any) => memorizeMessage(messageContent),
        onError: err => console.log("error updating the data : " , err),
        onSuccess: () => {
            if(onSuccessCallback) onSuccessCallback();
        }
    })
}