'use client'
import { FcGoogle } from "react-icons/fc";
import { supabase } from "../hooks/supabaseClient";

function Login() {

    async function loginWithGoogle() {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}` },
        })
        if (error) console.error('Login error:', error)
    }

    return (
        <div className="h-screen w-screen flex items-center gap-5 justify-center flex-col">
            <h1 className="text-6xl text-primaryme font-bold">oAI</h1>
            <h1 className="text-white text-3xl font-semibold">Welcome to oAI</h1>
            <p className="text-grayme ">Login with your Google account.</p>
            {/* Login Button */}
            <button
                onClick={loginWithGoogle}
                className="flex gap-3 items-center cursor-pointer bg-white dark:bg-gray-900 border border-gray-300 rounded-lg shadow-md px-6 py-2 text-2xl font-medium text-gray-800 dark:text-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                <FcGoogle className="text-xl" />
                <span>Continue with Google</span>
            </button>
        </div>
    )
}


export default Login