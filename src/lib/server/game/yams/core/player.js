import { getItems } from "./items.js"

export class Player{
    constructor(
        id, 
        hasPlayed = false,
        hasBonus = false,
        launches = 3,
        ) {
        this.id = id
        this.hasPlayed = hasPlayed
        this.hasBonus = hasBonus
        this.items = getItems()
        this.launches = launches
        

    }
}