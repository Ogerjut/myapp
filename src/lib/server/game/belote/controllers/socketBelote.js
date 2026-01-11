

export default function socketBelote(io, socket){
    socket.on("playerBet", (tableId, userId, bet, suit) => handlePlayerBet(io, tableId, userId, bet, suit))

}