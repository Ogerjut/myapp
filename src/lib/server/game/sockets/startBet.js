import { ObjectId } from 'mongodb';
import { tarotCollection, usersCollection } from '../../db/db.js';
import { LoadGame } from '../core/loadGame.js';

export default async function checkStartBet(io, tableId) {
	const table = await tarotCollection.findOne({ _id: new ObjectId(tableId) });
	const room = io.sockets.adapter.rooms.get(tableId);

	if (room?.size !== table?.size && !table?.ready ) {
		console.log("pas de check bet")
		return 
	}

	console.log("check start bet")
	const tarot = new LoadGame(table);
	const players = tarot.players;
	const round = table?.gameState.round || 1 

	await tarotCollection.updateOne(
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
					colorPli : undefined,
					playedAtouts : new Array()
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

	const updatedTable = await tarotCollection.findOne({ _id: new ObjectId(tableId) });
	io.to(tableId).emit('startBet', updatedTable);
	
}
