import { FiLogOut } from "react-icons/fi";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useEffect, useState } from 'react'
import useUserData from '../hooks/useUserData'
import Loading from './loading'
import useUpdateData from '../hooks/useUpdateData'
import useUpdateKey from '../hooks/useUpdateKey'
import { Link } from "react-router";
import { supabase } from "../hooks/supabaseClient";
import { useSearchParams } from "react-router";
import clsx from "clsx";

function Settings() {

    const [searchParams] = useSearchParams()

    const { data: userData, isLoading } = useUserData()
    const { mutate: updateUserData } = useUpdateData()
    const { mutate: updateKey } = useUpdateKey()

    const [InputData, setInputData] = useState({
        name: "",
        job: "",
        more: "",
        apiKey: ""
    })

    useEffect(() => {
        if (!isLoading && userData)
            setInputData({
                apiKey: "",
                name: userData?.inchatname ?? "",
                job: userData?.job ?? "",
                more: userData?.moreinfo ?? "",
            })
    }, [userData , isLoading])

    if (isLoading) return <Loading />

    return (
        <div className='w-[70vw] min-h-screen mx-auto flex items-start justify-center py-20 gap-10 text-white'>
            {/* Image */}
            <div className="flex flex-col gap-2">
                <Link to="/" className="flex items-center gap-2 bg-secondary-backgroundme hover:bg-surface-backgroundme p-2 rounded-2xl cursor-pointer"><AiOutlineArrowLeft />Back to chat</Link>
                <Link
                    className="flex items-center gap-2 bg-secondary-backgroundme hover:bg-surface-backgroundme p-2 rounded-2xl cursor-pointer"
                    to="/login" onClick={() => {
                        supabase.auth.signOut()
                    }}><FiLogOut />Logout</Link>
            </div>
            <div className='flex items-center justify-center flex-col gap-2'>
                <img src={`${userData?.imageUrl}?t=${Date.now()}`} className='rounded-full overflow-hidden w-[150px] h-[150px]' referrerPolicy="no-referrer" />
                <h1 className='font-bold text-3xl'>{userData?.name}</h1>
                <h1 className='text-lg text-grayme'>{userData?.email}</h1>
                <div className='p-3 bg-surface-backgroundme rounded-2xl mt-10 flex flex-col gap-5'>
                    <h1 className='text-md font-semibold'>Keyboard Shortcuts</h1>
                    <div className='flex items-center justify-between gap-10'>
                        <h1>New Chat:</h1>
                        <pre className='bg-black/70 p-2 rounded-md text-xs'>Ctrl + Shift + O</pre>
                    </div>
                </div>
            </div>
            {/* Main */}
            <div className='flex flex-col gap-10 w-[40vw] mb-20'>
                <h1 className='font-bold text-3xl'>Customize oAI</h1>
                <div>
                    <h1 className='font-semibold mb-2'>What should oAI call you?</h1>
                    <div className='relative'>
                        <input
                            placeholder="e.g. Alex, so I know what to call you!"
                            value={InputData.name}
                            onChange={(e) => setInputData({ ...InputData, name: e.target.value })}
                            type="text" maxLength={20} className='border-2 border-borderme w-full rounded-md p-2 focus:outline-none focus:border-primaryme selection:bg-primaryme' />
                        <span className='absolute top-1/2 -translate-y-1/2 right-2 text-grayme text-sm'>{InputData.name.length}/20</span>
                    </div>
                </div>
                <div>
                    <h1 className='font-semibold mb-2'>What do you do?</h1>
                    <div className='relative'>
                        <input
                            placeholder="e.g. Student, Developer, Dreamer"
                            value={InputData.job}
                            onChange={(e) => setInputData({ ...InputData, job: e.target.value })}
                            type="text" maxLength={50} className='border-2 border-borderme w-full rounded-md p-2 focus:outline-none focus:border-primaryme selection:bg-primaryme' />
                        <span className='absolute top-1/2 -translate-y-1/2 right-2 text-grayme text-sm'>{InputData.job.length}/50</span>
                    </div>
                </div>
                <div>
                    <h1 className='font-semibold mb-2'>Anything else should oAI know about you?</h1>
                    <div className='relative'>
                        <textarea
                            placeholder="Add anything that makes you you ✨"
                            value={InputData.more}
                            onChange={(e) => setInputData({ ...InputData, more: e.target.value })}
                            maxLength={300} className='border-2 border-borderme w-full rounded-md p-2 focus:outline-none focus:border-primaryme selection:bg-primaryme' />
                        <span className='absolute bottom-2 right-2 text-grayme text-sm'>{InputData.more.length}/300</span>
                    </div>
                </div>
                <div
                    onClick={() => updateUserData({ inchatname: InputData.name, job: InputData.job, moreinfo: InputData.more })}
                    className='border-2 py-2 border-primaryme text-primaryme rounded-xl cursor-pointer text-center hover:bg-primaryme hover:text-white'>
                    Save
                </div>
                <div>
                    <h1 className='font-semibold mb-2'>You'll need an OpenRouter key to chat — don't worry, it's easy! No key yet? Click here to get one. <a className="text-primaryme" href='https://openrouter.ai/' target='_blank'>Don't have one</a></h1>
                    <div className='relative'>
                        <input
                            placeholder="Paste your OpenRouter API key (stored securely) 🔐"
                            value={InputData.apiKey} type='text'
                            onChange={(e) => setInputData({ ...InputData, apiKey: e.target.value })}
                            className={clsx("border-2 border-borderme w-full rounded-md p-2 focus:outline-none focus:border-primaryme selection:bg-primaryme py-4", {
                                "border-errorme": searchParams.get("apikey")
                            })} />
                        <button
                            onClick={() => updateKey(InputData.apiKey)}
                            className='absolute right-2 top-1/2 -translate-y-1/2 border-2 px-2 py-1 border-primaryme text-primaryme rounded-sm cursor-pointer text-center hover:bg-primaryme hover:text-white'>Save</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings