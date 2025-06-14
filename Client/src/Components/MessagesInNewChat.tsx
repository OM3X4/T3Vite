/* eslint-disable */
import clsx from "clsx"

const QuestionTemplates = [
    "How does AI work?",
    "Are black holes real?",
    "What is the meaning of life?",
    "How many Rs in 'strawberry'?"
]

function MessagesInNewChat({ setMessage, message }: any) {
    return (
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
    )
}

export default MessagesInNewChat