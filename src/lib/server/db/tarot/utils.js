import { ObjectId } from 'mongodb';
import { usersCollection, tarotCollection } from '../db.js';
import { getTableById, idsToObjectIds } from '../utils.js';

export async function getUserHasTaken(tableId ){
    const table = await getTableById(tableId)
    const ids = idsToObjectIds(table?.playersId)
    return usersCollection.findOne({ _id: { $in: ids }, "tarot.hasTaken" : true } )

}

export async function getSpeaker(tableId){
    const table = await getTableById(tableId)
    const ids = idsToObjectIds(table?.playersId)
    return usersCollection.findOne({ _id: { $in: ids }, "tarot.isSpeaker" : true } )

}

