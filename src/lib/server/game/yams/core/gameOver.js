
export class EndGameScore{
    constructor(player){
        this.items = player.yams.items
        this.score1 = this.scorePart1()
        this.hasBonus = this.getHasBonus()
        this.applyBonus()
        this.score2 = this.scorePart2()
        this.total = this.score1 + this.score2

    }

    scorePart1(){
        const part1Items = ["1", "2", "3", "4", "5", "6"];

        return this.items
            .filter(item => part1Items.includes(item.name) && item.done)
            .reduce((sum, item) => item.value + sum, 0)

    }

    scorePart2(){
        const part2Items = ["brelan", "carré", "full", "petite suite", "grande suite", "yam's", "chance"];
        return this.items
            .filter(item => part2Items.includes(item.name) && item.done)
            .reduce((sum, item) => sum + item.value, 0);

    }

    getHasBonus(){
        return this.score1 > 63   
    }

    applyBonus(){
        if (!this.hasBonus) return 
        this.score1 += 35
    }

    scoreToJSON(){
        return {
            score1 : this.score1,
            hasBonus : this.hasBonus,
            score2 : this.score2,
            total : this.total
        }
    }






}