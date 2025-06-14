import { Routes, Route , useLocation , useNavigate } from "react-router-dom"
import Settings from "./Components/Settings"
import Login from "./Components/Login"
import { Toaster } from "sonner"
import ChatPage from "./Components/Main/ChatPage"
import { useEffect } from "react"
import { supabase } from "./hooks/supabaseClient"

function App() {

	const location = useLocation()
	const navigate = useNavigate()

	useEffect(() => {
		async function checkAuth() {
			const { data } = await supabase.auth.getSession()
			if(!data.session && location.pathname !== "/login") {
				navigate("/login")
			}
		}
		checkAuth()
	}, [location , navigate])


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