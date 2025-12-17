import { fetchOpponents, resetOpponent } from '$lib/client/game/updateOpponents.svelte.js'
import { goto } from '$app/navigation'

export function listenerSocket(context, game) {
    const userId = context.user.id || context.user._id
    const tableId = context.table._id
    const socket = context.socket
    
    const onConnect = () => {
        socket.emit('rejoinTable', tableId);
    }
    
    const onTableLeft = (url) => {
        resetOpponent()
        goto(url)
    }
    
    const onUpdateTable = async (updatedTable) => {
        Object.assign(context.table, updatedTable)
        const oppIDs = updatedTable.playersId.filter(id => id != userId)
        await fetchOpponents(oppIDs, tableId, game) 
    }
    
    const onLeaveAllTable = () => {
        alert("Un adversaire a quitté la partie.");
        resetOpponent()
        socket.emit("quitTable", tableId);
        goto(context.url === "" ? "/" : context.url)
    }
    
    const onUpdateContext = async (updatedUser, updatedTable) => {
        // Object.assign(context.user, updatedUser)
        // Object.assign(context.table, updatedTable)
        context.user = structuredClone(updatedUser)
        context.table = structuredClone(updatedTable)
        const oppIDs = updatedTable.playersId.filter(id => id != userId)
        await fetchOpponents(oppIDs, tableId, game)
    }
    
    const onUpdateUser = async (updatedUser) => {
        // Object.assign(context.user, updatedUser)
        context.user = structuredClone(updatedUser)
        const oppIDs = context.table.playersId.filter(id => id != userId)
        await fetchOpponents(oppIDs, tableId, game)
    }

    socket.on('connect', onConnect)
    socket.on("tableLeft", onTableLeft)
    socket.on("updateTable", onUpdateTable)
    socket.on("leaveAllTable", onLeaveAllTable)
    socket.on("updateContext", onUpdateContext)
    socket.on("updateUser", onUpdateUser)

    return () => {
        socket.off('connect', onConnect)
        socket.off("tableLeft", onTableLeft)
        socket.off("updateTable", onUpdateTable)
        socket.off("leaveAllTable", onLeaveAllTable)
        socket.off("updateContext", onUpdateContext)
        socket.off("updateUser", onUpdateUser)
    }
}