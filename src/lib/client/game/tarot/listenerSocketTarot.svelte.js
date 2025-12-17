
export function listenerSocketTarot(tarotContext) {

    const socket = tarotContext.socket
    
    const onSetUserTarot = (updatedUser) => {
        Object.assign(tarotContext.user, updatedUser)
    }
    
    const onStartBet = (updatedTable) => {
        console.log("start bet")
        Object.assign(tarotContext.table, updatedTable)
        tarotContext.betStarted = true 
    }
    
    const onEndPlayableCard = () => {
        tarotContext.activeCard = null
        tarotContext.isPlayableCard = undefined
    }
    
    const onShowPoignee = (updatedUser, updatedTable) => {
        Object.assign(tarotContext.user, updatedUser)
        Object.assign(tarotContext.table, updatedTable)
    }

    socket.on("setUserTarot", onSetUserTarot)
    socket.on("startBet", onStartBet)
    socket.on("endPlayableCard", onEndPlayableCard)
    socket.on("showPoignee", onShowPoignee)

    return () => {
        socket.off("setUserTarot", onSetUserTarot)
        socket.off("startBet", onStartBet)
        socket.off("endPlayableCard", onEndPlayableCard)
        socket.off("showPoignee", onShowPoignee)
    }
}
