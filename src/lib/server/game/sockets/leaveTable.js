import { ObjectId } from 'mongodb';
import { usersCollection, tarotCollection } from '../../db/db.js';

export default async function leaveTable(io, socket, tableId, userId, url) {
	await usersCollection.updateOne(
		{ _id: new ObjectId(userId) },
		{$set: {
			inGame: false,
			tarot : {},
			score : 0
		}}
	);

	const table = await tarotCollection.findOne({ _id: new ObjectId(tableId) });
	let newPlayersId = table?.playersId?.filter((id) => id != userId);

	await tarotCollection.updateOne(
		{ _id: new ObjectId(tableId) },
		{ $set: { playersId : newPlayersId } }
	);
	const updatedTable = await tarotCollection.findOne({ _id: new ObjectId(tableId) });

	if (!updatedTable || updatedTable.playersId.length === 0) {
		await tarotCollection.deleteOne({ _id: new ObjectId(tableId) });
		console.log(`table ${tableId} deleted and player ${userId} reset`);
	} else {
		io.to(tableId).emit('updateTable', updatedTable)
	}

	url = url === null ?  "/" : url
	socket.emit('tableLeft', url);
	socket.leave(tableId)
	console.log('table left to', url);
}
