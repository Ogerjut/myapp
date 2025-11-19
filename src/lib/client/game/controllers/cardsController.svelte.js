import { socket } from "$lib/client/socket";
import { useTarotContext } from "../context/tarotContext.svelte";

export class CardController {
  constructor() {
    this.socket = socket;
    this.tarotContext = useTarotContext();
  }

  onCardClick(card) {
    // peut destructurer le context car pas dans composant .svelte (balek réactivité ici)
    const { table, user } = this.tarotContext;
    const { state } = table;
    const { hasTaken, isPlayer } = user.tarot;

    if (state === "setupChien" && hasTaken) {
      this.socket.emit("handleChien", table._id, user._id, card);
      return;
    }

    if (state === "game" && isPlayer) {
      this.socket.emit("checkPlayableCard", table._id, user._id, card);
    }
  }

  async onPlayableCard(card) {
    const { table, user, isPlayableCard } = this.tarotContext;
    if (isPlayableCard && user.tarot.isPlayer && table.state === "game") {
        await new Promise((r) => setTimeout(r, 1000));
        this.socket.emit("handlePlayableCard", table._id, user._id, card);
    }
  }
}
