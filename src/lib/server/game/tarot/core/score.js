
export class ScoreManager{
    constructor(table, preneur){
        this.table = table
        this.tableId = table._id
        this.playersId = table.playersId
        this.preneur = preneur
        this.plis = table.gameState.plis
        this.poignees = table.gameState.poignees
        this.nbBout = 0
        this.score = 0

    }

    getContrat(){
        switch (this.nbBout){
            case 1 : return 51
            case 2 : return 41
            case 3 : return 36
            default : return 56
        }
    }

    hasWin(contrat){
        let win = true
        console.log("contrat / nbbouts :", contrat, this.nbBout)
        if (contrat === this.score){
            console.log(this.preneur.username, "a juste gagné le tour")
        } else if (contrat < this.score){
            console.log(this.preneur.username, "a gagné le tour")
        } else if (contrat > this.score){
            console.log(this.preneur.username, "a chuté")
            win = false
        }
        return win

    }

    compute(){
        this.preneur.tarot.cardsWon.forEach(card => {
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
            case 2 : return 2
            case 3 : return 4
            case 4 : return 6
            default : return 1

        }
    }

    defenseHasPoignee(){
        if (!this.poignees) return 0
        const usernames = Object.keys(this.poignees)
        const filteredUsernames = usernames.filter(user => user !== this.preneur.username)
        if (filteredUsernames.length != 0){
            return this.poignees[filteredUsernames[0]].length
        } else return 0 
    }

    getBonusPoignee(poignee){
        switch(poignee){
            case 10 : return 20
            case 13 : return 30
            case 15 : return 40
            default : return 0

        }
    }

    getBonusChelem(){
        const chelemDone = this.checkChelemDone()
        console.log("chelem done  ?", chelemDone )
        if (this.preneur.tarot.chelem && chelemDone){
            return 400
        } else if (this.preneur.tarot.chelem && !chelemDone){
            return -200
        } else if (!this.preneur.tarot.chelem && chelemDone){
            return 200
        } 
        return 0
    }
        

    checkChelemDone() {
        const len = this.preneur?.tarot?.cardsWon?.length ?? 0;
        console.log("length cards won :", len)
        const bet = this.preneur?.tarot?.bet ?? 0;
    
        const thresholds = bet <= 3 ? [77, 78] : bet === 4 ? [71, 72] : [];
    
        return thresholds.includes(len);
    }
    

    isCardPlayedLastTurn(cardToCheck, offset = 0) {
        const lastPli = this.getPliAt(offset);
        if (!lastPli) return { result: false, byPreneur: false, winner: false };
    
        const cardInPli = this.cardIsInPli(lastPli, cardToCheck);
        const byPreneur = this.cardPlayedByPreneur(lastPli, cardToCheck, this.preneur._id.toString());
        const winner = this.pliHasSingleAtout(lastPli);
        console.log(cardInPli, byPreneur, winner)
        return { cardInPli, byPreneur, winner };
    }
    
    checkPetitAuBout(hasWin) {
        console.log("check petit au bout")
        const offset = this.preneur.tarot.chelem ? 1 : 0;
    
        const { cardInPli, byPreneur, winner } = this.isCardPlayedLastTurn({ value: 1, suit: "atout" }, offset);
    
        if (!winner || !cardInPli) return 0;
    
        const success = (byPreneur && hasWin) || (!byPreneur && !hasWin);
    
        return success ? 10 : -10;
    }
    

    pliHasSingleAtout(pli) {
        const atouts = Object.values(pli).filter(c => c.suit === "atout");
        return atouts.length === 1;
    }
    

    cardPlayedByPreneur(pli, cardToCheck, preneurId) {
        return Object.entries(pli).some(
            ([id, c]) =>
                id === preneurId &&
                c.suit === cardToCheck.suit &&
                c.value === cardToCheck.value
        );
    }
    

    getPliAt(offset = 0) {
        const index = this.plis.length - 1 - offset;
        return this.plis[index] ?? null;
    }

    cardIsInPli(pli, cardToCheck) {
        return Object.values(pli).some(
            c => c.suit === cardToCheck.suit && c.value === cardToCheck.value
        );
    }
    
    


    // pour 4 joueurs
    getMarque(){
        const contrat = this.getContrat()
        const hasWin = this.hasWin(contrat)
        const coef = this.getCoef(this.preneur.tarot.bet)
        const bonusPoigneePreneur = this.getBonusPoignee(this.preneur.tarot.poignee)
        const poigneeDef = this.defenseHasPoignee()
        const bonusPoigneeDef = this.getBonusPoignee(poigneeDef)
        const bonusChelem = this.getBonusChelem()
        const bonusPetitAuBout = this.checkPetitAuBout(hasWin)
        
        const marque = (25 + Math.abs(this.score - contrat))*coef
        const score = marque + bonusPoigneePreneur + bonusPoigneeDef + bonusChelem + bonusPetitAuBout*coef 

        console.log("contrat", contrat,  "marque", marque, "coef", coef, "\nscore", score,  "\nbonus poignee preneur / def", bonusPoigneePreneur, bonusPoigneeDef,  "\nbonus petit au bout", bonusPetitAuBout, "\nbonus chelem", bonusChelem)
        
        if (hasWin){
            return {contrat, hasWin, preneurScore : score*3, defScore : score*(-1)}
        } else {
            return {contrat, hasWin, preneurScore : score*(-3), defScore : score}

        }
    }


}
