import clsx from "clsx"
import React from "react"
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';


const ChatMessage = React.memo(({ message }: any) => {
    return (
        <div
            key={message.id}
            className={clsx('text-white/80', {
                'bg-secondryme p-3 rounded-2xl self-end': message.role === 'user'
            })}
        >
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{message.content}</ReactMarkdown>
        </div>
    )
})

export default ChatMessage