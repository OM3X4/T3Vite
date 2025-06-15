import { BsChatLeft } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import { BsLayoutSidebarInset } from "react-icons/bs";
import { Link } from 'react-router'
import useGetChats from '../hooks/useGetChats'
import clsx from "clsx";
import { useNavigate } from 'react-router'
import useUserData from "../hooks/useUserData";
import MessageLoading from "./MessageLoading";

function SideBar({ isOpen, setIsOpen, ResetChat }: any) {

	const navigate = useNavigate()
	const { data: chatsData, isLoading: isLoadingChats, isError: isErrorChats } = useGetChats()
	const { data: userData } = useUserData()




	return (
		<div className={clsx("h-full", {
			"lg:w-[25vw] w-screen p-4 lg:pr-0 ": isOpen,
			"absolute top-0 left-0 z-50 w-fit": !isOpen
		})}>
			<div
				className={clsx(
					"flex items-center gap-2 bg-secondryme rounded-2xl py-4 mb-3 transition-all duration-300 ease-in-out overflow-hidden px-3",
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

			<div className={clsx("h-[85%] relative bg-secondryme flex flex-col gap-3 overflow-hidden duration-300 ease-in-out rounded-2xl origin-left", {
				"scale-x-0 opacity-0": !isOpen,
				"flex-1 py-2": isOpen
			})}>
				<div className={clsx("flex flex-col px-1 gap-3 overflow-hidden", {
					"scale-0": !isOpen
				})}>

					<div className="overflow-scroll chat-container pt-5">
						<p className="text-grayme text-sm py-2 px-5">Chats</p>
						<div className="flex flex-col gap-3 px-5">
							{
								(!isLoadingChats && !isErrorChats && chatsData) ?
								chatsData.map((chat: any , index: any) => {
									return (
										<Link
											to={`/c/${chat.id}`}
											key={chat.id} className="relative w-full px-4 py-5 gap-3 text-white text-sm hover:bg-white/20 cursor-pointer rounded-md flex items-center overflow-hidden chat-item"
											style={{ animationDelay: `${(index * 0.15) + 0.5}s` }}>
											<div className="absolute left-0 w-[3px] h-full rounded-full bg-primaryme"></div>
											<BsChatLeft />
											{chat.title || "New Chat"}
										</Link>
									)
								})
								:
								<div>
									<MessageLoading />
								</div>
							}
						</div>
					</div>
				</div>
				{
					<div className="bg-secondryme flex gap-3 items-center justify-center w-full flex-col">
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
		</div>
	)
}

export default SideBar