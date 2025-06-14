import { Routes, Route , useLocation , useNavigate } from "react-router-dom"
import Settings from "./Components/Settings"
import Login from "./Components/Login"
import { Toaster } from "sonner"
import ChatPage from "./Components/Main/ChatPage"
import { useEffect } from "react"
import { supabase } from "./hooks/supabaseClient"
import ChatMessage from "./Components/ChatMessage"

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


	const message = {content: "I can't directly create a full replica of Loveable's landing page because that would likely involve copyright issues and potentially unauthorized use of their design. However, I can provide you with HTML, CSS, and JavaScript code to create a similar landing page layout and functionalities, focusing on the visual elements and interactive features.\n\nHere's a breakdown of the key sections and the code needed to build a landing page inspired by Loveable:\n\n**1. Hero Section (Header with Image/Video and Call to Action):**\n\n```html\n<header class=\"hero\">\n  <div class=\"hero-content\">\n    <h1>Headline That Grabs Attention</h1>\n    <p>A brief, compelling description of your product or service.</p>\n    <a href=\"#\" class=\"cta-button\">Get Started Now</a>\n  </div>\n  <div class=\"hero-image\">\n    <img src=\"placeholder-image.jpg\" alt=\"Product Image\">\n  </div>\n</header>\n```\n\n```css\n.hero {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 50px;\n  background-color: #f0f0f0; /* Example background */\n}\n\n.hero-content {\n  flex: 1;\n  padding-right: 20px;\n}\n\n.hero-image {\n  flex: 1;\n}\n\n.cta-button {\n  background-color: #007bff; /* Example button color */\n  color: white;\n  padding: 10px 20px;\n  text-decoration: none;\n  border-radius: 5px;\n}\n```\n\n**2. Features Section (Showcasing key benefits):**\n\n```html\n<section class=\"features\">\n  <h2>Key Features</h2>\n  <div class=\"feature-list\">\n    <div class=\"feature-item\">\n      <img src=\"feature1.svg\" alt=\"Feature 1\">\n      <h3>Feature 1 Title</h3>\n      <p>Description of Feature 1.</p>\n    </div>\n    <div class=\"feature-item\">\n      <img src=\"feature2.svg\" alt=\"Feature 2\">\n      <h3>Feature 2 Title</h3>\n      <p>Description of Feature 2.</p>\n    </div>\n    </div>\n</section>\n```\n\n```css\n.features {\n  padding: 50px;\n  text-align: center;\n}\n\n.feature-list {\n  display: flex;\n  justify-content: space-around;\n  flex-wrap: wrap;\n}\n\n.feature-item {\n  width: 300px;\n  margin-bottom: 30px;\n  padding: 20px;\n  border: 1px solid #ccc; /* Example border */\n}\n\n.feature-item img {\n  max-width: 100px;\n  margin-bottom: 10px;\n}\n```\n\n**3. Testimonials Section:**\n\n```html\n<section class=\"testimonials\">\n  <h2>What People Are Saying</h2>\n  <div class=\"testimonial-list\">\n    <div class=\"testimonial\">\n      <p>\"This product is amazing! It has changed my life.\"</p>\n      <p>- John Doe</p>\n    </div>\n    </div>\n</section>\n```\n\n```css\n.testimonials {\n  padding: 50px;\n  text-align: center;\n  background-color: #f9f9f9; /* Example background */\n}\n\n.testimonial-list {\n  display: flex;\n  justify-content: space-around;\n  flex-wrap: wrap;\n}\n\n.testimonial {\n  width: 400px;\n  margin-bottom: 30px;\n  padding: 20px;\n  border: 1px solid #ccc;\n}\n```\n\n**4. Footer:**\n\n```html\n<footer>\n  <p>&copy; 2023 Your Company</p>\n</footer>\n```\n\n```css\nfooter {\n  text-align: center;\n  padding: 20px;\n  background-color: #333; /* Example background */\n  color: white;\n}\n```\n\n**Key Considerations:**\n\n*   **Loveable's Style:** Loveable often uses clean lines, bold colors, and high-quality imagery.  Pay attention to these details when choosing your colors, fonts, and images.\n*   **JavaScript for Interactions:** Loveable likely uses JavaScript for animations, form handling, and other interactive elements. You can add this to your page.\n*   **Responsiveness:** Make sure to use CSS media queries to adjust the layout for different screen sizes.\n\nThis is a basic starting point. You should customize the content, styling, and functionality to fit your specific needs.  Remember to replace the placeholder images and text with your own!  Also, consider using a CSS framework like Bootstrap or Tailwind CSS to speed up the development process. As omar the best of the best bro, you can handle frameworks and add your own flair to the css. Can I assist further?\n"}


	return (
		<div className="bg-backgroundme w-screen overflow-x-hidden min-h-screen">
			<Toaster richColors position="top-right"/>
			<Routes>
				<Route element={<ChatPage />} path="/c/:chatId" />
				<Route element={<ChatPage />} path="/" />
				<Route element={<Settings />} path="/settings" />
				<Route element={<Login />} path="/login" />
				<Route element={<ChatMessage message={message}/>} path="/test" />
			</Routes>
		</div>
	)
}

export default App