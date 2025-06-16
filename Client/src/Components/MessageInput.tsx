import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select'
import { IoMdSend } from 'react-icons/io'
import MessageLoading from './MessageLoading'

function MessageInput({isLoadingNewMessage,  handleMessageSent , setModelProviderName , modelProviderName , message , setMessage , models , } : any) {


    return (
        <div className="w-full pb-2 bg-backgroundme z-50 animation-slide-up delay-300">
            <div className="w-[95%] md:w-[70%] mx-auto flex flex-col gap-3">
                <div className="bg-secondary-backgroundme rounded-3xl flex items-center justify-between px-5 py-3 gap-10 h-full">
                    <div className="w-full h-full">
                        <textarea
                            value={message}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    handleMessageSent()
                                }
                            }}
                            onChange={e => setMessage(e.target.value)}
                            className="py-2 text-text-primaryme placeholder:text-text-mutedme w-full outline-none resize-none overflow-auto max-h-[12rem]"
                            placeholder="Type your message here"></textarea>
                        <div
                            className="relative">
                            <Select
                                onValueChange={(value: any) => {
                                    const option = models.find((model: any) => model.model === value)
                                    setModelProviderName(option!)
                                }}>
                                <SelectTrigger className="outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0 cursor-pointer border-0 hover:bg-black/20">
                                    <div className="flex items-center gap-2 text-text-primaryme">
                                        {modelProviderName.icon}
                                        {modelProviderName.name}
                                    </div>
                                </SelectTrigger>
                                <SelectContent position="popper" side="top" align="start" className="bg-surface-backgroundme text-white border-primaryme">
                                    {
                                        models.map((model: any) => {
                                            return (
                                                <SelectItem key={model.model} value={model.model}>
                                                    <div className="flex items-center gap-2 cursor-pointer">
                                                        {model.icon}
                                                        {model.name}
                                                    </div>
                                                </SelectItem>
                                            )
                                        })
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div
                        onClick={handleMessageSent}
                        className=" bg-primaryme self-end text-2xl p-2 rounded-lg flex items-center justify-center cursor-pointer hover:bg-primary-hoverme text-text-primaryme ">
                        {isLoadingNewMessage ? <MessageLoading size={25}/> : <IoMdSend />}
                    </div>
                </div>
                <p className="text-center text-text-mutedme text-xs">OmarAI can make mistakes. Consider checking important information</p>
            </div>
        </div>
    )
}

export default MessageInput