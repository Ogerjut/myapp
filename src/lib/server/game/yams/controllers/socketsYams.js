import launchDices from "./launchDice.js";
import { registerItemValue } from "./registerItemValue.js";

export default function socketYams(io, socket){
    socket.on('launchDices', (tableId, userId, dicesArray) => launchDices(io, tableId, userId, dicesArray));			
    socket.on("registerItemValue", (tableId, userId, item) => registerItemValue(io, tableId, userId, item));		

}