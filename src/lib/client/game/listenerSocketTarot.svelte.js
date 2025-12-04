import { fetchOpponents, resetOpponent } from '$lib/client/game/updateOpponents.svelte.js'
import {goto} from '$app/navigation'

export function listenerSocketTarot(tarotContext){
    const userId = tarotContext.user.id || tarotContext.user._id
    const tableId = tarotContext.table._id
    const socket = tarotContext.socket
    
    socket.on('connect', () => {
        socket.emit('rejoinTable', tableId);
    });
    
    socket.on("tableLeft", (url) => {
        resetOpponent()
        goto(url)
    })
    
    socket.on("updateTable", async (updatedTable)=>{
        Object.assign(tarotContext.table, updatedTable)
        const oppIDs = updatedTable.playersId.filter(id => id != userId)
        await fetchOpponents(oppIDs, tableId) 
    })

    socket.on("setUserTarot", (updatedUser) => {
        Object.assign(tarotContext.user, updatedUser)

    })
    
    socket.on("startBet", (updatedTable)=>{
        console.log("start bet")
        Object.assign(tarotContext.table, updatedTable)
        tarotContext.betStarted = true 
    })

    socket.on("leaveAllTable", () =>{
        alert("Un adversaire a quitté la partie.");
        resetOpponent()
        socket.emit("quitTable", tableId);
        goto(tarotContext.url === "" ? "/table" : tarotContext.url)
    })
    
    socket.on("updateTarotContext", async (updatedUser, updatedTable) => {
        // console.log("updated tarot context")
        Object.assign(tarotContext.user, updatedUser)
        Object.assign(tarotContext.table, updatedTable)
        const oppIDs = updatedTable.playersId.filter(id => id != userId)
        await fetchOpponents(oppIDs, tableId)

    })

    socket.on("isPlayableCard", (card)  =>{
        Object.assign(tarotContext.activeCard, card)
    })

    socket.on("endPlayableCard", ()  =>{
        Object.assign(tarotContext.activeCard, {})
    })

    
    socket.on("showPoignee", (updatedUser, updatedTable) => {
        Object.assign(tarotContext.user, updatedUser)
        Object.assign(tarotContext.table, updatedTable)

    })

    socket.on("updateUser", async (updatedUser) => {
        Object.assign(tarotContext.user, updatedUser)
        const oppIDs = tarotContext.table.playersId.filter(id => id != userId)
        await fetchOpponents(oppIDs, tableId)
    })




}
