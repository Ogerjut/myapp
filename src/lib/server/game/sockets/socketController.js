import joinTable from './joinTable.js';
import rejoinTable from './rejoinTable.js';
import leaveTable from './leaveTable.js';
import checkStartBet from './startBet.js';
import leaveAllTable from './leaveAllTable.js';
import setBet from './setBet.js';
import handleChien from './handleChien.js';
import registerChien from './registerChien.js';
import handlePlayableCard from './handlePlayableCard.js';
import checkPlayableCard from './checkPlayableCard.js';
import startTimer from './timer.js';


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
		socket.on('inviteToPlay', (tableId, from, userId) => io.to(userId).emit('invitationToPlay', tableId, from));
		socket.on('leaveTable', (tableId, userId, url) => {leaveTable(io, socket, tableId, userId, url)});
		socket.on('leaveAllTable', (tableId) => {leaveAllTable(io, socket, tableId)});
		socket.on('checkStartBet', (tableId) => {checkStartBet(io, tableId)});
		
		// rediviser en plusieurs modules avec Bet, Game...
		socket.on('playerHasBet', (tableId, userId, bet)=> setBet (io, tableId, userId, bet))
		socket.on('handleChien', (tableId, userId, card)=> handleChien(io, tableId, userId, card))
		socket.on('registerChien', (tableId)=> registerChien(io, tableId))
		socket.on('checkPlayableCard', (tableId, userId, card)=> checkPlayableCard(io, tableId, userId, card))
		socket.on('handlePlayableCard', (tableId, userId, card)=> handlePlayableCard(io, tableId, userId, card))
		
		// timer
		socket.on('getEndTime', (duration, callback) => startTimer(duration, callback))

	});

	io.engine.on("connection_error", (err) => {
        console.log('❌ Erreur Engine.IO:', err);
    });
}
