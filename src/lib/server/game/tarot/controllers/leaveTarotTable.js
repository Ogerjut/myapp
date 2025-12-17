import { ObjectId } from 'mongodb';
import { usersCollection, tablesCollection } from '../../../db/db.js';

export default async function leaveTarotTable(userId) {
	await usersCollection.updateOne(
		{ _id: new ObjectId(userId) },
		{$set: {
			inGame: false,
			tarot : {},
			"score.tarot" : 0
		}}
	);

}
