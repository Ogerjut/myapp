
export class ScoreManager{
    constructor(dices, items){
        this.items = items
        this.dices = dices
    }

    compute(){
        this.items.map(item => {
            item.possibleValue = this.getScore(item.name)
        })

    }

    getScore(rule){
        switch(rule){
            case "1" :
            case "2" :
            case "3" :
            case "4" :
            case "5" :
            case "6" :
                return this.getScorePartOne(rule)
            case "brelan" : 
                return this.getBrelan()
            case "carré" : 
                return this.getSquare()
            case "full" : 
                return this.getFull()
            case "petite suite" : 
                return this.getPS()
            case "grande suite" : 
                return this.getGS()
            case "yam's" : 
                return this.getYams()
            case "chance" : 
                return this.getLuck()
        }

    }

    getScorePartOne(rule){
        const dices = this.dices.filter(dice => dice.value === Number(rule))
        return dices.length*Number(rule)
    }

    getSumDices(){
        return this.dices.reduce((sum, dice)=> sum + dice.value, 0)
    }

    areEqualDicesOfLength(nb){
        for (let i = 1; i < 7; i++){
            const dices = this.dices.filter(dice => dice.value === i)
            if (dices.length >= nb){
                return true 
            }
        }
        return false 
    }

    getBrelan(){
        if (this.areEqualDicesOfLength(3)){
            return this.getSumDices()
        } else return 0
    }

    getSquare(){
        if (this.areEqualDicesOfLength(4)){
            return this.getSumDices()
        } else return 0
    }
    
    getFull(){
        if (this.areEqualDicesOfLength(3) && this.areEqualDicesOfLength(2)){
            return 25
        } else return 0
    }

    getPS(){
        const patterns = [[1,2,3,4], [2,3,4,5], [3,4,5,6]]
        const values = this.dices.map(dice => dice.value)
        const isPS = patterns.some(pattern =>
            pattern.every(v => values.includes(v))
        )
        if (isPS) return 30
        else return 0

    }

    getGS(){
        const patterns = [[1,2,3,4,5], [2,3,4,5,6]]
        const values = this.dices.map(dice => dice.value)
        const isGS = patterns.some(pattern =>
            pattern.every(v => values.includes(v))
        )
        if (isGS) return 40
        else return 0

    }

    getYams(){
        if (this.areEqualDicesOfLength(5)){
            return 50
        } else return 0

    }

    getLuck(){
        return this.getSumDices()
    }









}