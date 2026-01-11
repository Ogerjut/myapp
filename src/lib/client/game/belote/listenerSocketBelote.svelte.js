

export function listenerSocketBelote(context){
    const socket = context.socket
    
    const onStartBet = (updatedTable) => {
        console.log("start bet")
        context.table = structuredClone(updatedTable)
        // context.betStarted = true 
    }
    
    const onEndPlayableCard = () => {
        context.activeCard = null
        context.isPlayableCard = undefined
    }
    
    socket.on("startBet", onStartBet)
    socket.on("endPlayableCard", onEndPlayableCard)

    return () => {
        socket.off("startBet", onStartBet)
        socket.off("endPlayableCard", onEndPlayableCard)
    }
}


