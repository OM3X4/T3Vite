// import { MdDelete } from "react-icons/md";
// import { AiOutlineBranches } from "react-icons/ai";
// import { BsChatLeft } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import { BsLayoutSidebarInset } from "react-icons/bs";
import { Link } from 'react-router'
import useGetChats from '../hooks/useGetChats'
import clsx from "clsx";
import { useNavigate } from 'react-router'
import useUserData from "../hooks/useUserData";
import MessageLoading from "./MessageLoading";
import useDeleteChat from "../hooks/useDeleteChat";
import { toast } from "sonner";
import { useLocation } from "react-router";
import Chats from "./Chats";

function SideBar({ isOpen, setIsOpen, ResetChat }: any) {

	const location = useLocation()
	const navigate = useNavigate()
	const { data: chatsData, isLoading: isLoadingChats, isError: isErrorChats , refetch: refetchChats} = useGetChats()
	const { data: userData } = useUserData()


	const { mutate: deleteChat } = useDeleteChat((data: any) => {
		if(location.pathname === `/c/${data.chatid}`){
			console.log("navigating ")
			navigate("/")
			ResetChat()
		}
		refetchChats()
		toast.success("Chat deleted successfully")
	})


	return (
		<div className={clsx("", {
			"lg:w-[25vw] w-screen p-4 lg:pr-0 h-full": isOpen,
			"absolute top-0 left-0 z-50 w-fit": !isOpen
		})}>
			<div
				className={clsx(
					"flex items-center gap-2 bg-secondary-backgroundme rounded-2xl py-4 mb-3 transition-all duration-300 ease-in-out overflow-hidden px-3",
					{
						"max-w-[50px] absolute top-5 left-5": !isOpen,
						"max-w-full px-5 justify-between": isOpen,
					}
				)}
			>
				{/* Left content */}
				<div
					className={clsx(
						"flex items-end justify-center gap-3 transition-all duration-300 ease-in-out origin-left transform-gpu",
						{
							"hidden": !isOpen,
						}
					)}
				>
					<h1 className="text-primaryme text-3xl font-bold text-center cursor-pointer">oAI</h1>
					<h1 className="text-white font-semibold">My Chats</h1>
				</div>

				{/* Always visible toggle icon */}
				<div className="">
					<BsLayoutSidebarInset
						className="text-2xl cursor-pointer hover:text-primaryme text-white"
						onClick={() => setIsOpen((prev: any) => !prev)}
					/>
				</div>
			</div>
			{
				isOpen &&
				<div className={clsx("h-[85%] relative bg-secondary-backgroundme flex flex-col gap-3 overflow-hidden duration-300 ease-in-out rounded-2xl origin-left", {
					"scale-x-0 opacity-0": !isOpen,
					"flex-1 py-2": isOpen
				})}>
					<div className={clsx("flex flex-col px-1 gap-3 overflow-hidden", {
						"scale-0": !isOpen
					})}>

						<div className="overflow-scroll chat-container pt-5">
							<p className="text-text-mutedme text-xl py-2 px-5">Chats</p>
							<div className="flex flex-col gap-3 px-5">
								{
									(!isLoadingChats && !isErrorChats && chatsData) ?
									<Chats chatsData={chatsData} deleteChat={deleteChat} />
									:
									<div>
										<MessageLoading />
									</div>
								}
							</div>
						</div>
					</div>
					{
						<div className="bg-secondary-backgroundme flex gap-3 items-center justify-center w-full flex-col">
							<button
								onClick={() => { ResetChat(); navigate('/') }}
								className="flex bg-primaryme text-white w-[90%] items-center justify-between px-4 gap-5 py-4 hover:bg-black/30 rounded-md cursor-pointer">
									New Chat
									<div className="text-black bg-white p-2 rounded-sm"><AiOutlinePlus /></div>
								</button>
							<Link to="/settings" className="flex text-white w-[90%] items-center gap-5 py-4 hover:bg-black/30 rounded-2xl cursor-pointer px-3">
								<img src={userData?.imageUrl} referrerPolicy="no-referrer" className="w-10 h-10 rounded-full" />
								<h1>{userData?.name}</h1>
							</Link>
						</div>
					}
				</div>
			}
		</div>
	)
}

export default SideBar