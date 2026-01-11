import socketBelote from './belote/controllers/socketBelote.js';
import { socketCore } from './core/socketCore.js';
import socketTarot from './tarot/controllers/socketTarot.js';
import socketYams from './yams/controllers/socketsYams.js';

export default function socketController(io) {
	console.log('🎮 Contrôleur de sockets initialisé !');
	io.on('connection', (socket) => {
		console.log('✅ Nouveau client connecté:', socket.id);
		
		socket.on('disconnect', () => {
			console.log('❌ Client déconnecté:', socket.id);
		});
		
		socketCore(io, socket); // events globaux
		socketTarot(io, socket); // events du tarot
		socketYams(io, socket); // events du yam's
		socketBelote(io, socket); // events de la belote
		// socketChess(io, socket); // events des échecs
	});

	io.engine.on('connection_error', (err) => {
		console.log('❌ Erreur Engine.IO:', err);
	});
}
