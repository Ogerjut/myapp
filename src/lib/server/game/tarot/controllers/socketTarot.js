import checkPlayableCard from "./checkPlayableCard.js";
import checkPoignee from "./checkPoignee.js";
import endPoigneeChelem from "./endPoigneeChelem.js";
import endShowPoignee from "./endShowPoignee.js";
import handleChien from "./handleChien.js";
import playRandomCard from "./playRandomCard.js";
import registerChelem from "./registerChelem.js";
import registerChien from "./registerChien.js";
import registerPoignee from "./registerPoignee.js";
import selectRandomChien from "./selectRandomChien.js";
import setBet from "./setBet.js";
// import checkStartBet from "./startBet.js";


export default function socketTarot(io, socket){
    // socket.on('checkStartBet', (tableId) => {checkStartBet(io, tableId)});			
    socket.on('playerHasBet', (tableId, userId, bet)=> setBet (io, tableId, userId, bet))
    socket.on('handleChien', (tableId, userId, card)=> handleChien(io, tableId, userId, card))
    socket.on('registerChien', (tableId)=> registerChien(io, tableId))
    socket.on('checkPlayableCard', (tableId, userId, card)=> checkPlayableCard(io, tableId, userId, card))
    socket.on('selectRandomChien', (tableId, userId)=> selectRandomChien(io, tableId, userId))
    socket.on('checkPoignee', (userId, callback)=> checkPoignee(userId, callback))
    socket.on('registerPoignee', (tableId, userId, poigneeSize)=> registerPoignee(io, tableId, userId, poigneeSize))
    socket.on("endPoigneeChelem", (tableId)=>endPoigneeChelem(io, tableId))
    socket.on("chelem", (tableId, userId)=>registerChelem(io, tableId, userId))
    socket.on("endShowPoignee", (tableId)=> endShowPoignee(io, tableId))
    socket.on("playRandomCard", (tableId, userId)=>playRandomCard(io, tableId, userId))

}