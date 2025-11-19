
import { json } from "@sveltejs/kit";
import { tarotCollection } from "./db.js";

export async function getTarotTables(){
    const tables = await tarotCollection.find({isReady : false} )
    return json(tables.map(t => ({...t, _id : t._id.toString()})))
    // return tables
}
