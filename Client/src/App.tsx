import { Routes, Route } from "react-router-dom"
import ChatUI from "./Components/Main/ChatUI"
import NewChatUI from "./Components/Main/NewChatUI"
import Settings from "./Components/Settings"
import Login from "./Components/Login"
import { Toaster } from "sonner"


function App() {
	return (
		<div className="bg-backgroundme w-screen overflow-hidden min-h-screen">
			<Toaster richColors position="top-right"/>
			<Routes>
				<Route element={<ChatUI />} path="/c/:chatId" />
				<Route element={<NewChatUI />} path="/" />
				<Route element={<Settings />} path="/settings" />
				<Route element={<Login />} path="/login" />
			</Routes>
		</div>
	)
}

export default App