import { Link } from "react-router-dom";
import groupChatsByDate from "../utils/chatsDateGrouping";
import { AiOutlineBranches } from "react-icons/ai";
import { BsChatLeft } from "react-icons/bs";
import { MdDelete } from "react-icons/md";


export default function Chats({ chatsData, deleteChat }: any) {

    const groupedChats = groupChatsByDate(chatsData);

    return (
        <div>
            {Object.entries(groupedChats).map(([label, chats]) =>
                chats.length > 0 && (
                    <div key={label} className="mb-4">
                        <h2 className="text-text-mutedme text-xs uppercase mb-4">{label}</h2>
                        {chats.map((chat: any, index: number) => (
                            <Link
                                to={`/c/${chat.id}`}
                                key={chat.id}
                                className="relative w-full px-4 py-5 gap-3 text-text-primaryme text-sm hover:bg-surface-backgroundme cursor-pointer rounded-md mb-1 flex items-center justify-between overflow-hidden chat-item"
                                style={{ animationDelay: `${(index * 0.15) + 0.5}s` }}
                            >
                                <div className="absolute left-0 w-[3px] h-full rounded-full bg-primaryme"></div>
                                <div className="flex gap-2 items-center">
                                    {chat.isBranch ? <AiOutlineBranches className="text-lg" /> : <BsChatLeft className="text-lg" />}
                                    {chat.title || "New Chat"}
                                </div>
                                <div>
                                    <MdDelete
                                        className="text-lg text-text-primaryme z-50 cursor-pointer hover:text-errorme"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            deleteChat(chat.id);
                                        }}
                                    />
                                </div>
                            </Link>
                        ))}
                    </div>
                )
            )}
        </div>
    );
}