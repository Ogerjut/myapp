
import { ObjectId } from 'mongodb';
import { usersCollection, tarotCollection } from '../../db/db.js';
import checkStartBet from './startBet.js';

export default async function joinTable(io, socket, userId, tableId) {
	console.log(`joueur connecté à la socket :${socket.id} rejoint la table : ${tableId}`);
	const table = await tarotCollection.findOne({ _id: new ObjectId(tableId) });
	
	if (table){
		socket.join(tableId);
	}

	if (table && !table.ready && !table.playersId.includes(userId)){
		table?.playersId.push(userId);

		await tarotCollection.updateOne(
				{ _id: new ObjectId(tableId) },
				{ $set: { playersId: table?.playersId } }
			);

		await usersCollection.updateOne(
			{ _id: new ObjectId(userId) },
			{$set: {inGame: true} }
		);
	
		const updatedTable = await tarotCollection.findOne({ _id: new ObjectId(tableId) });
		io.to(tableId).emit('updateTable', updatedTable);

		await checkStartBet(io, tableId)
	} 
	

}

