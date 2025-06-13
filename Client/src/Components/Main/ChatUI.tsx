import { BsLayoutSidebarInset } from "react-icons/bs";
import { SiOpenai } from "react-icons/si";
import { BsGoogle } from "react-icons/bs";
import { GiWhaleTail } from "react-icons/gi";
import { useState, useEffect, useRef } from 'react'
import clsx from "clsx";
import useChatMessages from "../../hooks/useChatMessages";
import SideBar from "../SideBar";
import useSendMessage from "../../hooks/useSendMessage";
import MessageLoading from "../MessageLoading";
import ChatMessage from "../ChatMessage";
import MessageInput from "../MessageInput";
import { useParams , useSearchParams } from "react-router";








const models = [
    {
        model: "deepseek-r1-0528:free",
        provider: "deepseek",
        name: "DeepSeek R1",
        icon: <GiWhaleTail />
    },
    {
        model: "gemini-2.0-flash-001",
        provider: "google",
        name: "Gemini 2.0 Flash",
        icon: <BsGoogle />
    },
    {
        model: "gemini-2.5-flash-preview-05-20",
        provider: "google",
        name: "Gemini 2.5 Flash",
        icon: <BsGoogle />
    },
    {
        model: "gpt-4.1-nano",
        provider: "openai",
        name: "GPT 4.1 Nano",
        icon: <SiOpenai />
    },
    {
        model: "gpt-4o-mini",
        provider: "openai",
        name: "GPT 4o Mini",
        icon: <SiOpenai />
    },

]

function ChatUI() {
    const params = useParams()
    const chatId = params.chatId
    const [ searchParams ] = useSearchParams()

    const messagesRef = useRef<HTMLDivElement>(null)

    const [isLoadingNewMessage, setIsLoadingNewMessage] = useState(false)

    const { data: fetchedChatMessages, isLoading: isLoadingMessages, isError: isErrorMessages } = useChatMessages(chatId)
    const { mutate: sendMessage } = useSendMessage({
        onSuccessCallback: (data: any) => {
            const tempIdResponse = crypto.randomUUID();

            const tempResponse = {
                id: tempIdResponse,
                role: "assistant",
                content: data.message,
                createdAt: new Date().toISOString(),
            };

            setMessages((prevMessages) => ([...prevMessages, tempResponse] as any))
            setIsLoadingNewMessage(false)
        }
    })

    const [isSideBarOpen, setIsSideBarOpen] = useState(true)

    const [modelProviderName, setModelProviderName] = useState({
        model: "gemini-2.0-flash-001",
        provider: "google",
        name: "Gemini 2.0 Flash",
        icon: <BsGoogle />
    },)
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([])



    useEffect(() => {
        messagesRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    useEffect(() => {
        if (searchParams.get("message")) {
            sendMessage({
                ...modelProviderName,
                messages: [{ role: "user", content: searchParams.get("message") }],
                chatId
            })
            window.history.replaceState(null, '', window.location.pathname);
        }

    }, [])

    useEffect(() => {
        if (
            fetchedChatMessages &&
            JSON.stringify(fetchedChatMessages) !== JSON.stringify(messages)
        ) {
            setMessages(fetchedChatMessages)
        }
    }, [fetchedChatMessages])

    function handleMessageSent() {
        if (message && !isLoadingNewMessage) {
            setIsLoadingNewMessage(true)
            const tempIdMessage = crypto.randomUUID();
            const tempMessage = {
                id: tempIdMessage,
                role: "user",
                content: message,
                createdAt: new Date().toISOString(),
            };
            setMessage("")
            setMessages((prevMessages) => ([...prevMessages, tempMessage] as any))


            sendMessage({
                ...modelProviderName,
                messages: [...messages.map((message: any) => ({ role: message.role, content: message.content })), { role: "user", content: tempMessage.content }],
                chatId
            })
        }
    }


    return (
        <div className='bg-backgroundme h-screen flex'>
            <BsLayoutSidebarInset className={clsx("z-50 text-xl absolute top-5 left-5 cursor-pointer hover:text-primaryme text-white", {
                "hidden": isSideBarOpen
            })}
                onClick={() => setIsSideBarOpen(prev => !prev)} />
            <SideBar isOpen={isSideBarOpen} setIsOpen={setIsSideBarOpen} />
            {/* Main section */}
            <div className="flex-[5] flex flex-col items-center justify-center relative h-screen overflow-hidden">
                {/* Messages */}
                <div className="flex flex-col gap-10 w-full mx-auto py-10 px-[15vw] overflow-y-auto h-full">
                    {
                        isLoadingMessages || isErrorMessages || !fetchedChatMessages ?
                            <MessageLoading />
                            :
                            messages.map((message: any) => {
                                return (
                                    <ChatMessage key={message.id} message={message} />
                                )
                            })
                    }
                    {
                        ((messages as any).at(-1) as any)?.role === "user" && <div><MessageLoading /></div>
                    }
                    <div ref={messagesRef}></div>
                </div>
                <MessageInput
                    isLoadingNewMessage={isLoadingNewMessage}
                    handleMessageSent={handleMessageSent}
                    setModelProviderName={setModelProviderName}
                    modelProviderName={modelProviderName}
                    message={message} setMessage={setMessage}
                    models={models} />
            </div>
        </div>
    )
}

export default ChatUI