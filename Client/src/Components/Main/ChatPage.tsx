/* eslint-disable */
import { useState, useEffect, useRef } from 'react'
import type { MessageFetched } from '../../Types/Types';
import useNewChat from '../../hooks/useNewChat';
import useSendMessage from '../../hooks/useSendMessage';
import { SiOpenai } from "react-icons/si";
import { BsGoogle } from "react-icons/bs";
import { GiWhaleTail } from "react-icons/gi";
import clsx from 'clsx';
import SideBar from '../SideBar';
import { useParams } from 'react-router';
import MessageInput from '../MessageInput';
import useChatMessages from '../../hooks/useChatMessages';
import MessagesInNewChat from '../MessagesInNewChat';
import MessagesInNormal from '../MessagesInNormal';
import { supabase } from '../../hooks/supabaseClient';
import useUserData from '../../hooks/useUserData';
import Loading from '../loading';
import useGetChats from '../../hooks/useGetChats';
import { useQueryClient } from '@tanstack/react-query';

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

function ChatPage() {
    const { chatId: chatIdFromParams } = useParams();

    const isFirstMessage = useRef<boolean>(true)

    const [isLoadingNewMessage, setIsLoadingNewMessage] = useState(false)
    const [chatId, setChatId] = useState(null)
    const [messages, setMessages] = useState<MessageFetched[]>([])
    const [isSideBarOpen, setIsSideBarOpen] = useState(true)
    const [message, setMessage] = useState("")


    //ref for scrolling
    const messagesRefForScrolling = useRef<HTMLDivElement>(null)


    // scroll to message ref on messages change
    useEffect(() => {
        messagesRefForScrolling.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])


    //setting the chat id if it exist in the params
    useEffect(() => {
        if (chatIdFromParams) {
            setChatId(chatIdFromParams as any);
            refetchChatMessages()
        }
    }, [chatIdFromParams]);

    const [modelProviderName, setModelProviderName] = useState({
        model: "gemini-2.0-flash-001",
        provider: "google",
        name: "Gemini 2.0 Flash",
        icon: <BsGoogle />
    },)

    const { data: fetchedMessages, refetch: refetchChatMessages, isLoading: isLoadingFetchedMessages } = useChatMessages(chatId)

    const {isLoading: isLoadingUserData} = useUserData()
    const {isLoading: isLoadingUserChat , refetch: refetchChats} = useGetChats()


    useEffect(() => {
        if (Array.isArray(fetchedMessages) && !isLoadingNewMessage) {
            console.log(fetchedMessages)
            setMessages(fetchedMessages)
            return
        }
        console.log("didn't use message" , fetchedMessages)
    }, [fetchedMessages])

    const { mutate: sendMessageToBackend } = useSendMessage(
        (data: any) => {
            const tempIdResponse = crypto.randomUUID();

            const tempResponse = {
                id: tempIdResponse,
                role: "assistant",
                content: data.message,
                createdAt: new Date().toISOString(),
            };
            setMessages((prevMessages) => ([...prevMessages, tempResponse] as any))
            setIsLoadingNewMessage(false)

            if(isFirstMessage.current){
                isFirstMessage.current = false
                refetchChats()
            }
        }
    )

    const { mutate: createNewChat } = useNewChat();

    useEffect(() => {
        const hash = window.location.hash.substr(1) // remove '#'
        const params = new URLSearchParams(hash)

        const access_token = params.get('access_token')
        const refresh_token = params.get('refresh_token')

        if (access_token && refresh_token) {
            supabase.auth.setSession({
                access_token,
                refresh_token,
            }).then(({ error }) => {
                if (error) console.error('Error setting session:', error)
                else console.log('User logged in!')

                // Optional: clean the URL
                window.history.replaceState({}, document.title, '/')
            })
        }
    }, [])


    function handleSend() {
        setIsLoadingNewMessage(true)
        if (message === '') {
            setIsLoadingNewMessage(false)
            return;
        }

        const userMessage = {
            id: crypto.randomUUID(),
            role: "user",
            content: message,
            createdAt: new Date().toISOString()
        };
        const messagesToSend = [...messages, (userMessage as MessageFetched)]

        console.log([...messages, (userMessage as MessageFetched)])
        setMessages(prev => [...prev, (userMessage as MessageFetched)]);
        setMessage("")

        if (!chatId) {
            // Create a new chat first
            createNewChat(undefined, {
                onSuccess: (data) => {
                    setChatId(data.chatid);
                    sendMessageToBackend({
                        model: modelProviderName.model,
                        provider: modelProviderName.provider,
                        chatId: data.chatid,
                        messages: messagesToSend
                    });
                    console.log("refetching the chats")
                }
            });
        } else {
            // Chat already exists — just send message
            sendMessageToBackend({
                model: modelProviderName.model,
                provider: modelProviderName.provider,
                chatId: chatId,
                messages: messagesToSend
            });
        }
    }

    function ResetChat() {
        setMessages([])
        setChatId(null)
        setMessage("")
    }

    if(isLoadingUserChat || isLoadingUserData){
        return <Loading />
    }

    return (
        <div className={clsx("bg-backgroundme h-screen w-screen", {
            "lg:flex": isSideBarOpen,
            "flex": !isSideBarOpen
        })}>
            <SideBar isOpen={isSideBarOpen} setIsOpen={setIsSideBarOpen} ResetChat={ResetChat} />
            {/* Main section */}
            <div className={clsx("w-full flex flex-col items-center justify-center relative h-screen" , {
                "scale-0 w-0 opacity-0 lg:opacity-100 lg:w-full lg:scale-100": isSideBarOpen
            })}>
                {/* Chat Header */}
                <div className='w-full h-1/6 border-b border-borderme '></div>
                {/* Messages */}
                {
                    (messages && messages.length) || isLoadingFetchedMessages ?
                        <MessagesInNormal isLoadingFetchedMessages={isLoadingFetchedMessages} messages={messages} fetchedMessages={fetchedMessages} />
                        :
                        <MessagesInNewChat setMessage={setMessage} message={message} />
                }
                <MessageInput
                    isLoadingNewMessage={isLoadingNewMessage}
                    handleMessageSent={handleSend}
                    models={models}
                    modelProviderName={modelProviderName}
                    setModelProviderName={setModelProviderName}
                    message={message}
                    setMessage={setMessage} />
            </div>
        </div>
    )
}

export default ChatPage