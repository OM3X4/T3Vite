'use client'
import { BsLayoutSidebarInset } from "react-icons/bs";
import { Link } from 'react-router'
import useGetChats from '../hooks/useGetChats'
import { FaPenToSquare } from "react-icons/fa6";import clsx from "clsx";
import { useNavigate } from 'react-router'
import useUserData from "../hooks/useUserData";


function SideBar({ isOpen , setIsOpen }: any) {

	const navigate = useNavigate()
	const { data: chatsData, isLoading: isLoadingChats, isError: isErrorChats } = useGetChats()
	const { data: userData  } = useUserData()


	return (
		<div className={clsx("h-full relative bg-secondryme border-grayme flex flex-col gap-3 overflow-hidden duration-300 ease-in-out", {
			"w-0 h-0 overflow-hidden": !isOpen,
			"flex-1 border-r py-2": isOpen
		})}>
			<div className={clsx("flex flex-col px-1 gap-3 overflow-hidden", {
				"hidden": !isOpen
			})}>
				<div className="flex items-center justify-between gap-2 px-2">
					<h1 className="text-primaryme text-xl font-bold text-center cursor-pointer">oAI</h1>
					<BsLayoutSidebarInset className={clsx("text-xl cursor-pointer hover:text-primaryme text-white", {
						"hidden": !isOpen
					})}
						onClick={() => setIsOpen((prev: any) => !prev)} />
				</div>
				<div className="overflow-scroll chat-container pt-5">
					<button
						onClick={() => navigate('/')}
						className="w-full flex items-center mb-4 p-2 gap-2 text-white text-sm hover:bg-white/20 cursor-pointer rounded-md"><FaPenToSquare />New Chat</button>
					<p className="text-grayme text-sm p-2">Chats</p>
					<div className="flex flex-col gap-3">
						{
							!isLoadingChats && !isErrorChats && chatsData &&
							chatsData.map((chat: any) => {
								return (
									<Link
										to={`/c/${chat.id}`}
										key={chat.id} className="w-full p-2 gap-2 text-white text-sm hover:bg-white/20 cursor-pointer rounded-md">
										{chat.title || "New Chat"}
									</Link>
								)
							})
						}
					</div>
				</div>
			</div>
			{
				<div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-secondryme flex items-center justify-center w-full">
					<Link to="/settings" className="flex text-white w-[90%] items-center justify-center gap-5 py-4 hover:bg-black/30 rounded-2xl cursor-pointer">
						<img src={userData?.imageUrl} referrerPolicy="no-referrer" className="w-10 h-10 rounded-full" />
						<h1>{userData?.name}</h1>
					</Link>
				</div>
			}
		</div>
	)
}

export default SideBar