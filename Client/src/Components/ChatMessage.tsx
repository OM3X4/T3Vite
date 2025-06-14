import clsx from "clsx"
import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/vs2015.css"

const ChatMessage = React.memo(({ message }: { message: any }) => {
    return (
        <div
            key={message.id}
            className={clsx("text-white/80 space-y-10", {
                "bg-secondryme p-3 rounded-2xl self-end": message.role === "user",
            })}
        >
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
                        <ul className="list-disc list-inside my-4 space-y-2 marker:text-primaryme">{children}</ul>
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
                }}
            >
                {message.content}
            </ReactMarkdown>
        </div>
    )
})

export default ChatMessage
