// 

export class Player{
    constructor(
        id, 
        hand = [],
        bet = null,
        hasPlayed = false,
        hasBet = false,
        hasTaken = false,
        cardsWon = [],
        isSpeaker = false,
        chelem = false,
        poignee = 0, 
        ) {
        this.id = id
        this.hand = hand
        this.bet = bet
        this.hasPlayed = hasPlayed
        this.hasBet = hasBet
        this.hasTaken = hasTaken
        this.cardsWon = cardsWon
        this.isSpeaker = isSpeaker
        this.chelem = chelem
        this.poignee = poignee

    }
}