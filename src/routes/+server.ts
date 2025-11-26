
import { json } from "@sveltejs/kit";
import { usersCollection } from "$lib/server/db/db.js";

export async function GET() {
  const users = await usersCollection.find({ isActive: true, role : 'user', inGame : false  }).toArray();
  return json(users.map(u => ({ ...u, _id: u._id.toString() })));
}
