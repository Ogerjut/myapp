import { getUserById } from '../../../db/utils.js';
import { ObjectId } from 'mongodb';
import { usersCollection } from '../../../db/db.js';

export default async function leaveYamsTable(io, userId) {
	console.log("leave Yams table")
	await usersCollection.updateOne(
		{ _id: new ObjectId(userId) },
		{$set: {
			inGame: false,
			yams : {},
			"score.yams" : 0
		}}
	);

	const updatedUser = await getUserById(userId)
    io.to(userId).emit("updateUser", updatedUser)

}
