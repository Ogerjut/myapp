import joinTable from "./joinTable.js";
import leaveAllTable from "./leaveAllTable.js";
import leaveTable from "./leaveTable.js";
import rejoinTable from "./rejoinTable.js";
import getEndTime from "./timer.js";

export function socketCore(io, socket){
    socket.on('registerUserSocket', (userId) => {socket.join(userId);});
    socket.on('joinTable', (userId, tableId, game) => {joinTable(io, socket, userId, tableId, game)});
    socket.on('rejoinTable', (tableId) => {rejoinTable(socket, tableId)});
    socket.on("quitTable", (tableId) => {socket.leave(tableId)})
    socket.on('inviteToPlay', (tableId, from, userId, game) => io.to(userId).emit('invitationToPlay', tableId, from, game));
    socket.on('leaveTable', (tableId, userId, url, game) => {leaveTable(io, socket, tableId, userId, url, game)});
    socket.on('leaveAllTable', (tableId, game) => {leaveAllTable(io, socket, tableId, game)});
    socket.on('getEndTime', (duration, callback) => getEndTime(duration, callback))


}

