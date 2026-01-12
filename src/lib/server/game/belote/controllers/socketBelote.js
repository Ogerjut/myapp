import handlePlayerBet from "./handlePlayerBet.js";


export default function socketBelote(io, socket){
    socket.on("playerHasBet", (tableId, userId, bet, suit) => handlePlayerBet(io, tableId, userId, bet, suit))

}