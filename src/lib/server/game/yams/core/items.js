
export const ITEMS = [
    "1", "2", "3", "4", "5", "6",
    "brelan", "carré", "full", "petite suite", "grande suite", "yam's", "chance"
]

class Item{
    constructor(name, value = null, done = false, possibleValue = null){
        this.name = name
        this.value = value
        this.done = done
        this.possibleValue = possibleValue
    }

}

export function getItems(){
    return ITEMS.map(item => new Item(item))
}

export class ItemsManager{
    constructor(items, item){
        this.items = items.map(item => new Item(item.name, item.value, item.done, item.possibleValue))
        this.item = new Item(item.name, item.value, item.done, item.possibleValue) 
    }

    updateItems(){
        this.items.map(i => {
            if (i.name === this.item.name){
                i.value = this.item.possibleValue
                i.done = true 
            } else {
                i.possibleValue = null
            }
        })
    }

    remainingItems(){
        return this.items.filter(item => item.done !== true).length 
    }

    
}