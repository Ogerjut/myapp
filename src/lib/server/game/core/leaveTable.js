import { ObjectId } from 'mongodb';
import { usersCollection, tablesCollection } from '../../db/db.js';
import leaveTarotTable from '../tarot/controllers/leaveTarotTable.js';
import leaveYamsTable from '../yams/controllers/leaveYamsTable.js';

export default async function leaveTable(io, socket, tableId, userId, url, game) {
	console.log("leaving table", game)
	switch (game) {
		case "tarot":
			await leaveTarotTable(userId)
			break;
		case "yams" :
			await leaveYamsTable(io, userId)
			break
		default:
			break;
	}

	const table = await tablesCollection.findOne({ _id: new ObjectId(tableId) });
	let newPlayersId = table?.playersId?.filter((id) => id != userId);

	await tablesCollection.updateOne(
		{ _id: new ObjectId(tableId) },
		{ $set: { playersId : newPlayersId } }
	);
	const updatedTable = await tablesCollection.findOne({ _id: new ObjectId(tableId) });

	if (!updatedTable || updatedTable.playersId.length === 0) {
		await tablesCollection.deleteOne({ _id: new ObjectId(tableId) });
		console.log(`table ${tableId} deleted and player ${userId} reset`);
	} else {
		io.to(tableId).emit('updateTable', updatedTable)
	}

	url = url === null ?  "/" : url
	socket.emit('tableLeft', url);
	socket.leave(tableId)
}
