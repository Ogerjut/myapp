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
        isPlayer = false,
        ) {
        this.id = id
        this.hand = hand
        this.bet = bet
        this.hasPlayed = hasPlayed
        this.isPlayer = isPlayer
        this.hasBet = hasBet
        this.hasTaken = hasTaken
        this.cardsWon = cardsWon
        this.isSpeaker = isSpeaker

    }
}