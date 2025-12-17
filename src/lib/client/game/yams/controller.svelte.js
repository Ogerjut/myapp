import { useYamsContext } from "../context/yamsContext.svelte"

export class YamsController{
    constructor(){
       this.context = useYamsContext()
       this.socket = this.context.socket
    }

    sendPossibleValue(item){
        const userId = this.context.user.id || this.context.user._id
        const tableId = this.context.table._id
        const table = this.context.table
        const currentPlayerId = table.gameState.currentPlayerId
        const userIsCurrentPlayer = currentPlayerId === userId

        if (!userIsCurrentPlayer) return 
        this.socket.emit("registerItemValue", tableId, userId, item )
    }
}