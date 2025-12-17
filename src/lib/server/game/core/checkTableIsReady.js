import { ObjectId } from 'mongodb';
import { tablesCollection } from '../../db/db.js';

export default async function checkTableIsReady(io, tableId) {
	const table = await tablesCollection.findOne({ _id: new ObjectId(tableId) });
	const room = io.sockets.adapter.rooms.get(tableId);

	if (room?.size !== table?.size && !table?.ready ) {
		console.log("table non prête")
		return false 
	}

	console.log("table prête")
    return true 

}
