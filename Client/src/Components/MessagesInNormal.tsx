/* eslint-disable */
import MessageLoading from "./MessageLoading"
import ChatMessage from "./ChatMessage"
import { useEffect , useRef } from "react"


export default function MessagesInNormal({ isLoadingFetchedMessages , messages, fetchedMessages}: any) {

    const messagesRefForScrolling = useRef<HTMLDivElement>(null)
    useEffect(() => {
        messagesRefForScrolling.current?.scrollIntoView({ behavior: "smooth" })
    } , [messages])


    return (
        <div className="flex flex-col gap-10 w-full mx-auto py-10 px-[15vw] overflow-y-auto h-full">
            {
                isLoadingFetchedMessages || !fetchedMessages ?
                    <MessageLoading />
                    :
                    messages.map((message: any) => {
                        return (
                            <ChatMessage key={message.id} message={message} />
                        )
                    })
            }
            {
                !(isLoadingFetchedMessages || !fetchedMessages) && ((messages as any).at(-1) as any)?.role === "user" && <div><MessageLoading /></div>
            }
            <div ref={messagesRefForScrolling}></div>
        </div>
    )
}
