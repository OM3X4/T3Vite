import React from 'react'
import { Ring } from 'ldrs/react'
import 'ldrs/react/Ring.css'

function Loading() {
    return (
        <div className='w-screen h-screen flex items-center justify-center bg-backgroundme'>
            <Ring
                size="40"
                stroke="5"
                bgOpacity="0"
                speed="2"
                color="white"
            />
        </div>
    )
}

export default Loading