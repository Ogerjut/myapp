import { getUserById } from '../../../db/utils.js';
import { ObjectId } from 'mongodb';
import { usersCollection, tablesCollection } from '../../../db/db.js';

export default async function leaveBeloteTable(io, userId) {
	await usersCollection.updateOne(
		{ _id: new ObjectId(userId) },
		{$set: {
			inGame: false,
			belote : {},
			"score.belote" : 0
		}}
	);
    const updatedUser = await getUserById(userId)
    io.to(userId).emit("updateUser", updatedUser)

}