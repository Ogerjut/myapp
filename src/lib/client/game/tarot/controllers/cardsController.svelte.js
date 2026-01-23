import { useTarotContext } from "../../context/tarotContext.svelte";

export class CardController {
  constructor() {
    this.tarotContext = useTarotContext();
    this.socket = this.tarotContext.socket;
  }

  async onCardClick(card) {
    // peut destructurer le context car pas dans composant .svelte (balek réactivité ici)
    const { table, user } = this.tarotContext;
    const { state } = table;
    const { hasTaken } = user.tarot;
    const {currentPlayerId} = table.gameState

    if (state === "setupChien" && hasTaken) {
      this.socket?.emit("handleChien", table._id, user._id, card);
      return;
    }

    if (state === "game" && currentPlayerId === user._id) {
      this.socket?.emit("checkPlayableCard", table._id, user._id, card);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  // async onPlayableCard() {
  //   console.log("on playable card")
  //   const { table, user, isPlayableCard } = this.tarotContext;
  //   const {currentPlayerId} = table.gameState
  //   const userIsCurrentPlayer = currentPlayerId === user._id
  //   const isCurrentPlayer = user.tarot.isCurrentPlayer
  //   console.log("is current player :", isCurrentPlayer, '\nisPlayableCard :', isPlayableCard, '\nuser is current player:', userIsCurrentPlayer)
  //   console.log(isPlayableCard && userIsCurrentPlayer && table.state === "game")
  //   if (isPlayableCard && userIsCurrentPlayer && table.state === "game") {
  //       await new Promise((r) => setTimeout(r, 1000));
  //       console.log('handleplayablecard event sent')
  //       this.socket?.emit("handlePlayableCard", table._id, user._id);
  //   }
  // }
}
