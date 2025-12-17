import { fetchOpponents, resetOpponent } from '$lib/client/game/updateOpponents.svelte.js'
import {goto} from '$app/navigation'

export function listenerSocketYams(yamsContext){
    const userId = yamsContext.user.id || yamsContext.user._id
    const tableId = yamsContext.table._id
    const socket = yamsContext.socket
    
    return ()=>{
        
    }

}
