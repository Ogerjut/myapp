import { ObjectId } from 'mongodb';
import { usersCollection } from '../../db/db.js';

export default async function checkPoignee(userId, callback) {
    console.log("check poignée")
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

	let listAtouts = user?.tarot.hand.filter(c => c.suit === "atout")
    const hasPoignee = listAtouts.length >= 10;
    const poigneeSize =
        listAtouts.length >= 15 ? 15 :
        listAtouts.length >= 13 ? 13 :
        listAtouts.length >= 10  ? 10 : 0;

    callback({hasPoignee, poigneeSize})
}
