
import { ObjectId } from 'mongodb';
import { tarotCollection } from '../../db/db.js';

export default async function rejoinTable(socket, tableId) {
	const table = await tarotCollection.findOne({ _id: new ObjectId(tableId) });
	if (table){
        socket.join(tableId);
        socket.emit('updateTable', table);

    }
    
}

