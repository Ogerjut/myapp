import { fetchOpponents, resetOpponent } from '$lib/client/game/updateOpponents.svelte.js'
import {goto} from '$app/navigation'
import { useTarotContext } from './context/tarotContext.svelte';

export function listenerSocketTarot(socket,  tableId, userId){
    let  tarotContext = useTarotContext()
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
        !updatedTable.ready && socket.emit("checkStartBet", tableId)  
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
        console.log("updated tarot context")
        Object.assign(tarotContext.user, updatedUser)
        Object.assign(tarotContext.table, updatedTable)
        const oppIDs = updatedTable.playersId.filter(id => id != userId)
        await fetchOpponents(oppIDs, tableId)

    })

    socket.on("updateTableGame", async (updatedTable) =>{
        Object.assign(tarotContext.table, updatedTable)
        const oppIDs = updatedTable.playersId.filter(id => id != userId)
        await fetchOpponents(oppIDs, tableId)
    })

    socket.on("isPlayableCard", (isPlayableCard, card)  =>{
        tarotContext.isPlayableCard = isPlayableCard 
        Object.assign(tarotContext.activeCard, card)
    })

    socket.on("endCheckPlayableCard", ()  =>{
        tarotContext.isPlayableCard = undefined 
        Object.assign(tarotContext.activeCard, {})
    })





}
