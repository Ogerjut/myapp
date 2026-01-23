// import { ObjectId } from 'mongodb';
// import { usersCollection } from '../db/db.js';
// import socketBelote from './belote/controllers/socketBelote.js';
import { socketCore } from './core/socketCore.js';
// import { userConnected, userConnections, userDisconnected } from './presenceManager.js';
import socketTarot from './tarot/controllers/socketTarot.js';
import socketYams from './yams/controllers/socketsYams.js';

export default function socketController(io) {
	console.log('🎮 Contrôleur de sockets initialisé !');
	
	// io.use(async (socket, next) => {
	// 	try {
	// 		const request = socket.request;
	// 		const session = await auth.api.getSession({
	// 			headers: request.headers
	// 		});

	// 		if (!session?.user) {
	// 			return next(new Error("Unauthorized"));
	// 		}

	// 		socket.data.userId = session.user.id;
	// 		console.log("socket.data :", socket.data)
	// 		next();
	// 	} catch (err) {
	// 		next(new Error("Unauthorized"));
	// 	}
	// });
		

	io.on('connection', async (socket) => {
		console.log('✅ Nouveau client connecté:', socket.id);
		// const alreadyOnline = userConnections.has(socket.data.userId);
		// console.log("socket.data :", socket.data)
		// userConnected(socket.data.userId);
		// if (!alreadyOnline) {
		// 	await usersCollection.updateOne(
		// 		{ _id: new ObjectId(socket.data.userId) },
		// 		{ $set: { isActive: true } }
		// 	);
		// }
		// console.log("User connections map : ", userConnections)

		socket.on('disconnect', async (reason) => {
			console.log('❌ Client déconnecté:', socket.id, '\nreason :', reason);
			// const userId = socket.data.userId;
			// const reallyOffline = userDisconnected(userId);
			// if (reallyOffline) {
			// 	await usersCollection.updateOne(
			// 		{ _id: new ObjectId(userId) },
			// 		{ $set: { isActive: false, lastSeen: new Date() } }
			// 	);
			// }
		});
		
		socketCore(io, socket); // events globaux
		socketTarot(io, socket); // events du tarot
		socketYams(io, socket); // events du yam's
		// socketBelote(io, socket); // events de la belote
		// socketChess(io, socket); // events des échecs
	});

	io.engine.on('connection_error', (err) => {
		console.log('❌ Erreur Engine.IO:', err);
	});
}
