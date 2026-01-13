
import { json } from "@sveltejs/kit";
import { usersCollection } from "$lib/server/db/db.js";

export async function GET() {
  const users = await usersCollection.find({ isActive: true, role : 'user', inGame : false  }).toArray();
  return json(users.map(u => ({ ...u, _id: u._id.toString() })));
}

// import { usersCollection } from '$lib/server/db/db';
// import { isUserOnline } from '$lib/server/game/presenceManager';
// import { json } from '@sveltejs/kit';

// export async function GET() {
// 	const users = await usersCollection
// 		.find({ role: 'user', inGame: false })
// 		.toArray();

// 	const result = users.filter(u =>
// 		isUserOnline(u._id.toString())
// 	);

// 	return json(result.map(u => ({
//     ...u,
// 		_id: u._id.toString(),
// 	})));
// }
