
import { json } from "@sveltejs/kit";
import {getUsersByTableId } from "$lib/server/db/utils";
import { usersCollection } from "$lib/server/db/db.js";
import { ObjectId } from "mongodb";

export async function GET({params}) {
  const users = await getUsersByTableId(params.id)
  console.log("users :", users)
  return json(users.map(u => ({ ...u, _id: u._id.toString() })));
}


export async function POST({ request }) {
  const { ids } = await request.json(); // tableau d'IDs
  if (!ids || !Array.isArray(ids)) {
    return json({ error: "Invalid body" }, { status: 400 });
  }

  // 🧠 Convertir les ids en ObjectId pour Mongo
  const objectIds = ids.map(id => new ObjectId(id));
  const users = await usersCollection
    .find({ _id: { $in: objectIds } })
    .toArray();

  // Transformer les ObjectId en string pour le client
  const result = users.map(u => ({ ...u, _id: u._id.toString() }));

  return json(result);
}