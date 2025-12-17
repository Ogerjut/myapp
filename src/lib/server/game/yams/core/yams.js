
import { Dice } from "./dices.js"
import { Player } from "./player.js"

export class Yams{
    constructor(){
        this.table = null
        this.round = null
        this.players = new Array()
        this.dices = new Array()
        this.currentPlayer = null
        this.state = ""
    }

    loadgame(table){
        this.table = table
        this.round = 1
        this.players = table.playersId.map(id => new Player(id))
        this.dices = Array.from({ length: 5 }, (_, i) => new Dice(i+1) );
        this.currentPlayer = this.getCurrentPlayer()
        this.state = "game"
    }

    getCurrentPlayer(){
        return this.players[(this.round-1) % this.players.length] 
    }

    

    


}