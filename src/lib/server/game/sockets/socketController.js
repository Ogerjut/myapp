import joinTable from './joinTable.js';
import rejoinTable from './rejoinTable.js';
import leaveTable from './leaveTable.js';
import checkStartBet from './startBet.js';
import leaveAllTable from './leaveAllTable.js';
import setBet from './setBet.js';
import handleChien from './handleChien.js';
import registerChien from './registerChien.js';
// import handlePlayableCard from './handlePlayableCard.js';
import checkPlayableCard from './checkPlayableCard.js';
import startTimer from './timer.js';
import selectRandomChien from './selectRandomChien.js';
import checkPoignee from './checkPoignee.js';
import endPoigneeChelem from './endPoigneeChelem.js';
import registerChelem from './registerChelem.js';
import registerPoignee from './registerPoignee.js';
import endShowPoignee from './endShowPoignee.js';
import playRandomCard from './playRandomCard.js';


export default function socketController(io) {
	console.log('🎮 Contrôleur de sockets initialisé !');
	io.on('connection', (socket) => {
		console.log('✅ Nouveau client connecté:', socket.id);
		socket.on('disconnect', () => {
            console.log('❌ Client déconnecté:', socket.id);
        });
		socket.on('registerUserSocket', (userId) => {socket.join(userId);});
		socket.on('joinTable', (userId, tableId) => {joinTable(io, socket, userId, tableId)});
		socket.on('rejoinTable', (tableId) => {rejoinTable(socket, tableId)});
		socket.on("quitTable", (tableId) => {socket.leave(tableId)})
		socket.on('inviteToPlay', (tableId, from, userId, game) => io.to(userId).emit('invitationToPlay', tableId, from, game));
		socket.on('leaveTable', (tableId, userId, url) => {leaveTable(io, socket, tableId, userId, url)});
		socket.on('leaveAllTable', (tableId) => {leaveAllTable(io, socket, tableId)});
		socket.on('checkStartBet', (tableId) => {checkStartBet(io, tableId)});
		
		// rediviser en plusieurs modules avec Bet, Game...
		socket.on('playerHasBet', (tableId, userId, bet)=> setBet (io, tableId, userId, bet))
		socket.on('handleChien', (tableId, userId, card)=> handleChien(io, tableId, userId, card))
		socket.on('registerChien', (tableId)=> registerChien(io, tableId))
		socket.on('checkPlayableCard', (tableId, userId, card)=> checkPlayableCard(io, tableId, userId, card))
		// socket.on('handlePlayableCard', (tableId, userId, card)=> handlePlayableCard(io, tableId, userId, card))
		socket.on('selectRandomChien', (tableId, userId)=> selectRandomChien(io, tableId, userId))
		socket.on('checkPoignee', (userId, callback)=> checkPoignee(userId, callback))
		socket.on('registerPoignee', (tableId, userId, poigneeSize)=> registerPoignee(io, tableId, userId, poigneeSize))
		socket.on("endPoigneeChelem", (tableId)=>endPoigneeChelem(io, tableId))
		socket.on("chelem", (tableId, userId)=>registerChelem(io, tableId, userId))
		socket.on("endShowPoignee", (tableId)=> endShowPoignee(io, tableId))
		socket.on("playRandomCard", (tableId, userId)=>playRandomCard(io, tableId, userId))

		// timer
		socket.on('getEndTime', (duration, callback) => startTimer(duration, callback))

	});

	io.engine.on("connection_error", (err) => {
        console.log('❌ Erreur Engine.IO:', err);
    });
}
