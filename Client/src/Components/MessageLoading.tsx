import { Bouncy } from 'ldrs/react'
import 'ldrs/react/Bouncy.css'





// Default values shown
export default function MessageLoading({ size = 40 }) {
    return <Bouncy
        size={size}
        speed="1.75"
        color="white"
    />
}