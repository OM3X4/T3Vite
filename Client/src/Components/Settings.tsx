import { AiFillCreditCard } from "react-icons/ai";
import { AiFillStar } from "react-icons/ai";
import { FaSave } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useEffect, useState } from 'react'
import useUserData from '../hooks/useUserData'
import Loading from './loading'
import useUpdateData from '../hooks/useUpdateData'
import useUpdateKey from '../hooks/useUpdateKey'
import { Link } from "react-router";
import { supabase } from "../hooks/supabaseClient";
import clsx from "clsx";

function Settings() {


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
    }, [userData, isLoading])

    if (isLoading) return <Loading />

    return (
        <div className='w-[90vw] lg:w-[70vw] min-h-screen mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-center py-20 gap-10 text-white'>

            {/* Image */}
            <div className='flex items-center justify-center w-full lg:w-fit flex-col gap-2'>
                <div className="w-full lg:w-fit flex items-center justify-center flex-col bg-surface-backgroundme rounded-2xl px-20 py-5">
                    <img src={`${userData?.imageUrl}?t=${Date.now()}`} className='rounded-full overflow-hidden size-[100px] lg:size-[120px]' referrerPolicy="no-referrer" />
                    <div className="flex items-center justify-center flex-col mt-5">
                        <h1 className='font-bold text-3xl'>{userData?.name}</h1>
                        <h1 className='text-lg text-grayme'>{userData?.email}</h1>
                    </div>
                </div>
                {/* Buttons */}
                <div className="flex lg:flex-col gap-2 mt-5 w-full">
                    <Link to="/" className="w-full flex items-center gap-2 bg-secondary-backgroundme hover:bg-surface-backgroundme p-4 rounded-2xl cursor-pointer"><AiOutlineArrowLeft />Back to chat</Link>
                    <Link
                        className="flex w-full items-center gap-2 bg-errorme p-4 rounded-2xl cursor-pointer"
                        to="/login" onClick={() => {
                            supabase.auth.signOut()
                        }}><FiLogOut />Logout</Link>
                </div>
            </div>
            {/* Main */}
            <div className='flex flex-col gap-10 w-[90vw] lg:w-[40vw] mb-20'>
                <div className="flex flex-col gap-5 px-15 py-5 rounded-2xl bg-surface-backgroundme">
                    <h1 className='font-bold text-3xl'>Personalize oAI</h1>
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
                        className='flex items-center gap-1 py-2 px-3 w-fit self-end text-white bg-primaryme hover:bg-primary-hoverme rounded-lg cursor-pointer'>
                        <FaSave />
                        Save Changes
                    </div>
                </div>
                <div className="bg-surface-backgroundme py-6 px-15 rounded-2xl">
                    <h1 className="text-3xl">API Key & Usage</h1>
                    <div className="mt-3">
                        <p className="text-text-mutedme">Your OpenRouter API Key</p>
                        <input
                            value={InputData.apiKey}
                            onChange={e => setInputData({ ...InputData, apiKey: e.target.value })}
                            type="password" className="mt-4 focus:outline-none border-borderme w-full focus:border-primaryme border-2 rounded-md px-3 py-2" placeholder="Your API key"/>
                        <p className="text-xs text-text-lowme mt-2">You will need an OpenRouter key to chat , No key yet? <a className="text-primaryme" href='https://openrouter.ai/' target='_blank'>Don't have one</a></p>
                    </div>
                    <div className="mt-5">
                        <p className="text-sm text-text-mutedme">Account Tier</p>
                        <h1 className="flex items-center gap-2 text-2xl mt-2"><AiFillStar className="text-primaryme"/>{userData.openrouterdata.isfreetier ? "Free Tier" : "Premium Tier"}</h1>
                    </div>
                    <div className="mt-5">
                        <p className="text-sm text-text-mutedme">Current Usage</p>
                        <div className="w-full bg-secondary-backgroundme h-4 rounded-full relative mt-1">
                            <div className="absolute bg-primaryme top-0 left-0 h-4 rounded-full" style={{ width: `${(10/20) * 100}%`}}></div>
                        </div>
                        <p className={clsx("mt-1" , {
                            "text-errorme": userData.openrouterdata.usage >= userData.openrouterdata.credit,
                            "text-text-lowme": userData.openrouterdata.usage < userData.openrouterdata.credit
                        })}>{Math.round(userData.openrouterdata.usage * 100) / 100}/{Math.round(userData.openrouterdata.credit * 100) / 100} dollars used</p>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                        <a
                            href="https://openrouter.ai/settings/credits" target="_blank"
                            className="flex items-center gap-2 bg-primaryme w-fit px-3 py-2 rounded-md cursor-pointer hover:bg-primary-hoverme"><AiFillCreditCard />Recharge API credit</a>
                        <button
                            onClick={() => updateKey(InputData.apiKey)}
                            className="flex items-center gap-2 bg-primaryme w-fit px-3 py-2 rounded-md cursor-pointer hover:bg-primary-hoverme">
                            <FaSave />
                            Save API Key
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings