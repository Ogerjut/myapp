import { tablesCollection, usersCollection } from "../../../db/db.js"
import { getTableById } from "../../../db/utils.js"
import { ObjectId } from "mongodb"
import { Yams } from "../core/yams.js"


export default async function startGame(io, tableId){
    
    const table = await getTableById(tableId)
	
	if (table?.state === "ready"){
		console.log("table déjà prête")
		return
	}  

	console.log("Start yams game")
	
	const yams = new Yams();
	yams.loadgame(table)
	const players = yams.players;

	await tablesCollection.updateOne(
		{ _id: new ObjectId(tableId) },
		{
			$set: {
				ready: true,
				state : yams.state,
				gameState : {
                    round : yams.round,
					currentPlayerId : yams.currentPlayer.id,
					dices : yams.dices
				}
				
			}
		}
	);
    
    const updatedTable = await tablesCollection.findOne({ _id: new ObjectId(tableId) });
	for (const player of players){
		await usersCollection.updateOne(
			{ _id: new ObjectId(player.id) },
			{$set: {yams: { ...player }}}
		);
		const updatedUser = await usersCollection.findOne({ _id: new ObjectId(player.id) });
		io.to(player.id).emit("updateContext", updatedUser, updatedTable )
		// io.to(player.id).emit("updateUser", updatedUser )
	};
	// io.to(tableId).emit("updateTable", updatedTable )
}