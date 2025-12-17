export class Dice{
    constructor(id = 0, value = null, selected = false){
        this.id = id
        this.value = value
        this.selected = selected
    }

}

export class DicesManager{
    constructor(dicesArray){
        this.dices = dicesArray.map(dice => new Dice(dice.id, dice.value, dice.selected))
    }

    launchDices(){
        this.dices.map(dice =>{
            if (!dice.selected){
                dice.value = this.getValue()
            }
        })
    }

    getValue(){
        return Math.floor(Math.random()*6+1)
    }

    resetDices(){
        this.dices.map(dice => {
            dice.selected = false
            dice.value = null
        })
    }
}