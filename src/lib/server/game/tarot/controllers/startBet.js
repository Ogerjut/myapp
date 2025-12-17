import { ObjectId } from 'mongodb';
import { tablesCollection, usersCollection } from '../../../db/db.js';
import { LoadGame } from '../core/loadGame.js';

export default async function checkStartBet(io, tableId) {
	const table = await tablesCollection.findOne({ _id: new ObjectId(tableId) });
	
	// const room = io.sockets.adapter.rooms.get(tableId);
	// if (room?.size !== table?.size && !table?.ready ) {
	// 	console.log("pas de check bet")
	// 	return 
	// }

	if (table?.state === "ready"){
		console.log("table déjà prête")
		return
	}  

	console.log("check start bet")
	const round = table?.gameState.round || 1 
	const tarot = new LoadGame(table, round);
	const players = tarot.players;
	

	await tablesCollection.updateOne(
		{ _id: new ObjectId(tableId) },
		{
			$set: {
				ready: true,
				state : tarot.state,
				gameState : {
					round : round,
					chien : tarot.chien,
					actualBet : 0, 
					betMap : new Map(),
					pli : new Map(),
					plis : new Array(),
					colorPli : undefined,
					playedAtouts : new Array(),
					currentPlayerId : tarot.currentPlayer.id
				}
				
			}
		}
	);

	for (const player of players){
		await usersCollection.updateOne(
			{ _id: new ObjectId(player.id) },
			{$set: {tarot: { ...player }}}
		);
		const updatedUser = await usersCollection.findOne({ _id: new ObjectId(player.id) });
		io.to(player.id).emit("setUserTarot", updatedUser )
	};

	const updatedTable = await tablesCollection.findOne({ _id: new ObjectId(tableId) });
	io.to(tableId).emit('startBet', updatedTable);
	
}
