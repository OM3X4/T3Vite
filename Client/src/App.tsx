import { Routes, Route } from "react-router-dom"
import Settings from "./Components/Settings"
import Login from "./Components/Login"
import { Toaster } from "sonner"
import ChatPage from "./Components/Main/ChatPage"


function App() {
	return (
		<div className="bg-backgroundme w-screen min-h-screen">
			<Toaster richColors position="top-right"/>
			<Routes>
				<Route element={<ChatPage />} path="/c/:chatId" />
				<Route element={<ChatPage />} path="/" />
				<Route element={<Settings />} path="/settings" />
				<Route element={<Login />} path="/login" />
			</Routes>
		</div>
	)
}

export default App