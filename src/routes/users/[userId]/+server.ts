
import { json } from "@sveltejs/kit";
import { ObjectId } from "mongodb";
import { usersCollection } from "$lib/server/db/db.js";

export async function GET({params}) {
    const user = await usersCollection.findOne({_id : new ObjectId(params.userId)})    
    return json(user);
}
