import { useMutation } from "@tanstack/react-query";
import { supabase } from "./supabaseClient";
import { toast } from "sonner";

async function branchChat(messageId : any) {

    console.log("branching chat with messageId: ", messageId)

    const { data } = await supabase.auth.getSession()

    const response = await fetch(`${import.meta.env.VITE_API_URL}/branch/` , {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${data.session?.access_token}`
        },
        body: JSON.stringify({ messageid: messageId })
    })
    if (!response.ok){
        toast.error(response.statusText || "Failed to branch chat");
        throw new Error("Failed to branch chat");
    }
    return response.json();
}

export default function useBranchChat(onSuccessCallback?: any) {
    return useMutation({
        mutationFn: (messageId : any) => branchChat(messageId),
        onError: err => console.log("error updating the data : " , err),
        onSuccess: (data) => {
            if(onSuccessCallback) onSuccessCallback(data);
        }
    })
}