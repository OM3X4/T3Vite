import MessageLoading from "./MessageLoading"
import ChatMessage from "./ChatMessage"
import { useEffect , useRef } from "react"


export default function MessagesInNormal({ isLoadingFetchedMessages , messages, fetchedMessages}: any) {

    const messagesRefForScrolling = useRef<HTMLDivElement>(null)
    useEffect(() => {
        messagesRefForScrolling.current?.scrollIntoView({ behavior: "smooth" })
    } , [messages])


    return (
        <div className="flex flex-col w-full md:w-3/4 text-wrap mx-auto py-10 px-10 overflow-y-auto h-full chat-container">
            {
                isLoadingFetchedMessages || !fetchedMessages ?
                    <MessageLoading />
                    :
                    messages.map((message: any , index: number) => {
                        return (
                            <>
                                {index === messages.length - 1 && <div ref={messagesRefForScrolling}></div>}
                                <ChatMessage key={message.id} message={message} />
                            </>
                        )
                    })
            }
            {
                !(isLoadingFetchedMessages || !fetchedMessages) && ((messages as any).at(-1) as any)?.role === "user" && <div><MessageLoading /></div>
            }

        </div>
    )
}
