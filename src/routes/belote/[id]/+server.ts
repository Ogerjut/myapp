import { json } from "@sveltejs/kit";
import { tablesCollection, usersCollection } from "$lib/server/db/db.js";
import { ObjectId } from "mongodb";
import { error } from '@sveltejs/kit';

export async function POST({ request }) {
  const { ids } = await request.json(); // tableau d'IDs
  if (!ids || !Array.isArray(ids)) {
    return json({ error: "Invalid body" }, { status: 400 });
  }

  // 🧠 Convertir les ids en ObjectId pour Mongo
  const objectIds = ids.map(id => new ObjectId(id));
  const users = await usersCollection
    .find({ _id: { $in: objectIds } })
    .project({ "belote.hand" : 0 }) 
    .toArray();

  // Transformer les ObjectId en string pour le client
  const result = users.map(u => ({ ...u, _id: u._id.toString() }));

  return json(result);
}


export async function GET({ params }) {
  if (!params.id || !ObjectId.isValid(params.id)) {
    console.error("❌ ID invalide:", params.id);
    throw error(400, 'ID de table invalide');
  }
  
  try {
    const table = await tablesCollection.findOne({ _id: new ObjectId(params.id) });

    if (!table) {
      throw error(404, 'Table non trouvée');
    }
    
    if (!table.playersId || table.playersId.length === 0) {
      return json([]);
    }
    
    const usersId = table.playersId.map(id => new ObjectId(id));
    const users = await usersCollection
      .find({ _id: { $in: usersId } })
      .project({ "belote.hand": 0 }) 
      .toArray();
    
    const result = users.map(u => ({ ...u, _id: u._id.toString() }));
    
    return json(result);
  } catch (err) {
    console.error("❌ Erreur lors de la récupération:", err);
    throw error(500, 'Erreur serveur');
  }
}