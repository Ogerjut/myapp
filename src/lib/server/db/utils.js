import { ObjectId } from 'mongodb';
import { usersCollection, tablesCollection } from './db.js';

export function idsToObjectIds(ids){
    return ids.map(id => new ObjectId(id));
}

export async function getUserById(userId){
    return usersCollection.findOne({_id : new ObjectId(userId)})
}

export async function getUsers(usersId){
    const ids = idsToObjectIds(usersId)
    return usersCollection.find({ _id: { $in: ids } }).toArray()
}

export async function getTableById(tableId){
    return tablesCollection.findOne({_id : new ObjectId(tableId)})
}


export async function getUsersByTableId(tableId){
    const table = await getTableById(tableId)
    return getUsers(table?.playersId)
}

export async function deleteCompletedTables(){
    return tablesCollection.deleteMany({completed : true})
}


