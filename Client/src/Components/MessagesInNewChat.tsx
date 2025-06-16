import { AiFillBug } from "react-icons/ai";
import clsx from "clsx"
import { FiEdit3 } from "react-icons/fi";
import { BiBulb } from "react-icons/bi";

const QuestionTemplates = [
    {
        question: "Help me debug this code",
        icon: <AiFillBug />,
        paragraph: "Paste a piece of code and I’ll help you figure out what’s going wrong and how to fix it."
    },
    {
        question: "Rewrite this paragraph",
        icon: <FiEdit3 />,
        paragraph: "Need it to sound more professional, friendlier, or clearer? I can rephrase it to match your tone and purpose."
    },
    {
        question: "Give me project ideas",
        icon: <BiBulb />,
        paragraph: "Tell me what you're interested in, and I’ll suggest creative and practical project ideas to help you get started."
    },
    // {
    //     question: "Translate this sentence",
    //     icon: <MdOutlineTranslate />,
    //     paragraph: "Drop a sentence here, and I’ll translate it into Arabic, English, or any other language you need."
    // }
];

function MessagesInNewChat({ setMessage, message }: any) {
    return (
        <div className={clsx("flex flex-col items-center justify-center w-full mx-auto p-[2vw] lg:px-[15vw] overflow-hidden h-full", {
            "opacity-0 scale-80": message
        })}>
            <div className="p-5 rounded-xl bg-secondary-backgroundme flex flex-col items-center justify-center">
                <h1 className="text-3xl lg:text-4xl font-bold text-primaryme mb-5 text-center">oAI</h1>
                <h1 className="text-text-primaryme text-5xl mb-2 text-center">How can I help you today?</h1>
                <p className="text-text-mutedme text-center">I'm here to chat, answer questions, or help you get things done. Whether you're exploring ideas, debugging code, or just curious about something, feel free to ask anything.</p>
                <div className="flex items-center justify-center mt-5 gap-3">
                    {
                        QuestionTemplates.map((item) => {
                            return (
                                <div
                                onClick={() => setMessage(item.question)}
                                className="flex flex-col gap-3 items-center justify-center text-text-primaryme flex-1 bg-secondary-backgroundme pb-4 pt-4 hover:bg-surface-backgroundme px-4 rounded-2xl text-lg cursor-pointer ">
                                    <span className="text-primaryme text-2xl">{item.icon}</span>
                                    <h1 className="text-center text-md">{item.question}</h1>
                                    <p className="text-xs text-text-muted text-center">{item.paragraph}</p>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

        </div>
    )
}

export default MessagesInNewChat