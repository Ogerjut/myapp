export class ScoreManager{
    constructor(player){
        this.player = player
        this.nbBout = 0
        this.score = 0

    }

    getContrat(){
        switch (this.nbBout){
            case 0 : return 56
            case 1 : return 51
            case 2 : return 41
            case 3 : return 36
        }
    }

    hasWin(contrat){
        let win = true
        console.log("contrat / nbbouts :", contrat, this.nbBout)
        if (contrat === this.score){
            console.log(this.player.username, "a juste gagné le tour")
        } else if (contrat < this.score){
            console.log(this.player.username, "a gagné le tour")
        } else if (contrat > this.score){
            console.log(this.player.username, "a chuté")
            win = false
        }
        return win

    }

    compute(){
        this.player.tarot.cardsWon.forEach(card => {
            let pts = 0
            if (card.suit === "atout"){
                if (card.value === 21 || card.value === 1 || card.value === 0){
                    this.nbBout+=1
                    pts = 4.5
                } else {
                    pts = 0.5
                }
            } else {
                switch (card.value){
                    case 11 :
                    case 12 :
                    case 13 :
                    case 14 : 
                        pts = card.value - 9.5
                        break
                    default : 
                    pts = 0.5
                    break
                }
            }
            this.score += pts
        })
    }

    getCoef(bet){
        switch(bet){
            case 1 : return 1 
            case 2 : return 2
            case 3 : return 4
            case 4 : return 6
        }
    }

    // pour 4 joueurs
    getMarque(){
        const contrat = this.getContrat()
        const hasWin = this.hasWin(contrat)
        const coef = this.getCoef(this.player.tarot.bet)
        const marque = (25 + Math.abs(this.score - contrat))*coef
        console.log("coef marque", coef, marque)
        if (hasWin){
            return {contrat, hasWin, preneurScore : marque*3, defScore : marque*(-1)}
        } else {
            return {contrat, hasWin, preneurScore : marque*(-3), defScore : marque}

        }
    }


}
