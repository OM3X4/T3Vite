import { TbBrain } from "react-icons/tb";
import { BiCopy } from "react-icons/bi";
import { AiOutlineBranches } from "react-icons/ai";
import clsx from "clsx"
import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/vs2015.css"
import useUserData from "../hooks/useUserData"
import { toast } from "sonner";
import useBranchChat from "../hooks/useBranchChat";
import { useNavigate } from "react-router";
import useGetChats from "../hooks/useGetChats";
import useMemorizeMessage from "../hooks/useMemorizeMessage";

const ChatMessage = React.memo(({ message }: { message: any }) => {
    const navigate = useNavigate()

    const { data: userData } = useUserData()

    const { refetch: refetchChats } = useGetChats()

    const { mutate: branchChat } = useBranchChat((data: any) => {
        toast.success("Branched the chat");
        navigate(`/c/${data.chatid}`)
        refetchChats()
    });

    const { mutate: memorizeMessage } = useMemorizeMessage(() => {
        toast.success("Memorized the message");
        refetchChats()
    });



    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Copied to clipboard")
        } catch (err) {
            toast.error("Failed to copy")
            console.error(err);
        }
    };

    return (
        <>
            {
                message.role === "user" ?
                    <div className="flex items-center gap-3 text-text-primaryme mb-3 flex-row-reverse animation-slide-up">
                        <img src={userData?.imageUrl} alt="" referrerPolicy="no-referrer" className="w-7 rounded-full" />
                        <h1 className="text-xl">You</h1>
                    </div>
                    :
                    <div className="flex items-center gap-3 text-text-primaryme mb-3 mt-15 animation-slide-up">
                        <div className="text-primaryme bg-surface-backgroundme p-2 font-bold rounded-full w-7 h-7 flex items-center justify-center">AI</div>
                        <h1 className="text-xl">oAI</h1>
                    </div>
            }
            <div
                key={message.id}
                className={clsx("text-text-primaryme space-y-10 chat-item break-words", {
                    "bg-secondary-backgroundme p-3 pb-0 rounded-2xl self-end lg:max-w-[75%]": message.role === "user",
                    "lg:max-w-[90%]": message.role === "assistant",
                })}
                style={{ animationDelay: `0.5s` }}
            >
                {/* {message.content} */}
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                        p: ({ children }) => (
                            <p className="my-4 leading-relaxed text-base">{children}</p>
                        ),
                        h1: ({ children }) => (
                            <h1 className="text-3xl font-bold my-6">{children}</h1>
                        ),
                        h2: ({ children }) => (
                            <h2 className="text-2xl font-semibold my-5 ">{children}</h2>
                        ),
                        h3: ({ children }) => (
                            <h3 className="text-xl font-semibold my-4">{children}</h3>
                        ),
                        ul: ({ children }) => (
                            <ul className="list-disc list-outside my-4 space-y-2 marker:text-primaryme">{children}</ul>
                        ),
                        ol: ({ children }) => (
                            <ol className="list-decimal list-inside my-4 space-y-2 marker:text-primaryme">{children}</ol>
                        ),
                        blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-gray-500 pl-4 italic my-4 text-gray-300">
                                {children}
                            </blockquote>
                        ),
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        em: ({ children }) => <em className="italic">{children}</em>,
                        a: ({ children, href }) => (
                            <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 underline hover:text-blue-300"
                            >
                                {children}
                            </a>
                        ),
                        pre: ({ children }) => (
                            <pre className="bg-[#1e1e1e] p-4 rounded-md my-4 text-sm overflow-x-scroll">
                                {children}
                            </pre>
                        ),
                        code: ({ className, children }) => {

                            return (
                                <div className=" bg-[#1e1e1e] rounded-xl my-4 overflow-x-scroll w-fit">
                                    <pre className="overflow-x-auto text-sm p-4 whitespace-pre-wrap w-fit">
                                        <code className={className}>{children}</code>
                                    </pre>
                                </div>
                            )
                        },
                    }}
                >
                    {message.content}
                </ReactMarkdown>
            </div>
            {
                message.role === "assistant" ?
                    <div className="mt-0 mb-5 flex items-center gap-3">
                        <button
                            onClick={() => branchChat( message.id )}
                            className="text-white hover:bg-surface-backgroundme text-2xl p-2 rounded-md cursor-pointer"><AiOutlineBranches /></button>
                        <button
                            onClick={() => handleCopy(message.content)}
                            className="text-white hover:bg-surface-backgroundme text-2xl p-2 rounded-md cursor-pointer"><BiCopy /></button>
                        <button
                            onClick={() => memorizeMessage(message.id)}
                            className="text-white hover:bg-surface-backgroundme text-2xl p-2 rounded-md cursor-pointer"><TbBrain /></button>
                    </div>
                    :
                    <div className="flex flex-row-reverse mt-1">
                        <button
                            onClick={() => memorizeMessage(message.content)}
                            className="text-white hover:bg-surface-backgroundme text-md p-2 rounded-md cursor-pointer"><TbBrain /></button>
                    </div>
            }
        </>
    )
})

export default ChatMessage
