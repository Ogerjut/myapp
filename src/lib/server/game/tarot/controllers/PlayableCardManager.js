import { getTableById, getUserById } from "../../../db/utils.js"

export class PlayableCardManager{
    constructor(io, tableId, userId, card){
        this.io = io
        this.tableId = tableId
        this.userId = userId
        this.selectedCard = card

    }

    async getTable(){
        return getTableById(this.tableId)
    }

    async getUser(){
        return getUserById(this.userId)
    }


    async checkPlayableCard(){

    }

    async playSelectedCard(){

    }

    async handleEndpli(){

    }

    async handleEndRound(){

    }

    async nextPlayer(){

    }
}