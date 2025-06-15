import clsx from "clsx"
import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/vs2015.css"
import useUserData from "../hooks/useUserData"

const ChatMessage = React.memo(({ message }: { message: any }) => {

    const { data: userData } = useUserData()

    return (
        <>
            {
                message.role === "user" ?
                    <div className="flex items-center gap-3 text-text-primaryme flex-row-reverse mb-3 animation-slide-up">
                        <img src={userData?.imageUrl} alt="" referrerPolicy="no-referrer" className="w-7 rounded-full" />
                        <h1 className="text-xl">You</h1>
                    </div>
                    :
                    <div className="flex items-center gap-3 text-text-primaryme mb-3 animation-slide-up">
                        <div className="text-primaryme bg-surface-backgroundme p-2 font-bold rounded-full w-7 h-7 flex items-center justify-center">AI</div>
                        <h1 className="text-xl">oAI</h1>
                    </div>
            }
            <div
                key={message.id}
                className={clsx("text-text-primaryme space-y-10 chat-item mb-10 break-words", {
                    "bg-secondary-backgroundme p-3 rounded-2xl self-end": message.role === "user",
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
                            <pre className="bg-[#1e1e1e] p-4 rounded-md my-4 text-sm whitespace-pre-wrap break-words overflow-x-hidden w-full max-w-full">
                                {children}
                            </pre>
                        ),
                        code: ({ className, children }) => {

                            return (
                                <div className=" bg-[#1e1e1e] rounded-xl my-4 overflow-hidden">
                                    <pre className="overflow-x-auto text-sm p-4 whitespace-pre-wrap break-words">
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
        </>
    )
})

export default ChatMessage
