
import { ObjectId } from 'mongodb';
import { usersCollection, tablesCollection } from '../../db/db.js';
import checkStartBet from '../tarot/controllers/startBet.js';
import startGame from '../yams/controllers/startGame.js';
import checkTableIsReady from './checkTableIsReady.js';

export default async function joinTable(io, socket, userId, tableId, game) {
	console.log(`joueur connecté à la socket :${socket.id} rejoint la table : ${tableId}`);
	const table = await tablesCollection.findOne({ _id: new ObjectId(tableId) });
	
	if (table){
		socket.join(tableId);
	}

	if (table && !table.ready && !table.playersId.includes(userId)){
		table?.playersId.push(userId);

		await tablesCollection.updateOne(
				{ _id: new ObjectId(tableId) },
				{ $set: { playersId: table?.playersId } }
			);

		await usersCollection.updateOne(
			{ _id: new ObjectId(userId) },
			{$set: {inGame: true} }
		);
	
		const updatedTable = await tablesCollection.findOne({ _id: new ObjectId(tableId) });
		io.to(tableId).emit('updateTable', updatedTable);
		 
		const tableReady = await checkTableIsReady(io, tableId)
		if (tableReady){
			switch(game){
				case "tarot" : 
					await checkStartBet(io, tableId)
					break
				case "yams" :
					await startGame(io, tableId)
					break
				default : return 
			}
		}

		
		
	} 
	

}

