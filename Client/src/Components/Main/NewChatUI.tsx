/* eslint-disable */
import { BsLayoutSidebarInset } from "react-icons/bs";
import { SiOpenai } from "react-icons/si";
import { BsGoogle } from "react-icons/bs";
import { GiWhaleTail } from "react-icons/gi";
import  { useState, useEffect } from 'react'
import clsx from "clsx";
import useGetChats from "../../hooks/useGetChats";
import useNewChat from "../../hooks/useNewChatMessage";
import { supabase } from "../../hooks/supabaseClient";
import SideBar from "../SideBar";
import Loading from "../loading";
import MessageInput from "../MessageInput";
import { useNavigate } from "react-router";


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

const QuestionTemplates = [
    "How does AI work?",
    "Are black holes real?",
    "What is the meaning of life?",
    "How many Rs in 'strawberry'?"
]

function NewChatUI() {

    const navigate = useNavigate()

    const [isLoadingNewMessage, setIsLoadingNewMessage] = useState(false)

    const { data: chatsData, isLoading: isLoadingChats, isError: isErrorChats, refetch: refetchChatHistory } = useGetChats()
    const { mutate: createNewChat } = useNewChat({
        onSuccessCallback: (data) => {
            setIsLoadingNewMessage(false)
            refetchChatHistory()
            navigate(`/c/${data.chatId}`)
        }
    })

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



    const [isSideBarOpen, setIsSideBarOpen] = useState(true)

    const [modelProviderName, setModelProviderName] = useState({
        model: "gemini-2.0-flash-001",
        provider: "google",
        name: "Gemini 2.0 Flash",
        icon: <BsGoogle />
    },)
    const [message, setMessage] = useState('')


    function handleSendButtonClick() {
        if (message && !isLoadingNewMessage) {
            setIsLoadingNewMessage(true)
            createNewChat( message )
        }
    }

    if (isLoadingChats || isErrorChats) {
        return <Loading />
    }




    return (
        <div className='bg-backgroundme h-screen flex items-center justify-center'>
            {/* SideBar Opener */}
            <BsLayoutSidebarInset className={clsx("z-50 text-xl absolute top-5 left-5 cursor-pointer hover:text-primaryme text-white", {
                "hidden": isSideBarOpen
            })}
                onClick={() => setIsSideBarOpen(prev => !prev)} />
            <SideBar isOpen={isSideBarOpen} setIsOpen={setIsSideBarOpen} />
            {/* Main section */}
            <div className="flex-[5] flex flex-col items-center justify-center relative h-screen overflow-hidden">
                {/* Messages */}
                <div className={clsx("flex flex-col items-center justify-center w-full mx-auto px-[15vw] overflow-hidden h-full", {
                    "opacity-0 scale-80": message
                })}>

                    <h1 className="text-white text-3xl font-bold mb-10">Standing by for your next move.</h1>
                    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
                        {
                            QuestionTemplates.map((item) => {
                                return (
                                    <div
                                        onClick={e => setMessage(item)}
                                        className="text-white/80 w-2/5 bg-secondryme pb-4 pt-4 hover:bg-black/40 px-4 rounded-2xl text-lg cursor-pointer ">
                                        {item}
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <MessageInput
                    isLoadingNewMessage={isLoadingNewMessage}
                    handleMessageSent={handleSendButtonClick}
                    models={models}
                    modelProviderName={modelProviderName}
                    setModelProviderName={setModelProviderName}
                    message={message}
                    setMessage={setMessage} />
            </div>
        </div>
    )
}

export default NewChatUI