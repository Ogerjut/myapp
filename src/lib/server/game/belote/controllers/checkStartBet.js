import { tablesCollection, usersCollection } from "../../../db/db.js"
import { ObjectId } from "mongodb"
import { getTableById, getUserById } from "../../../db/utils.js"
import { Belote } from "../core/belote.js"


export default async function checkStartBetBelote(io, tableId){
    const table = await getTableById(tableId)
	
	if (table?.state === "ready"){
		console.log("table déjà prête")
		return
	}  
	console.log("check start bet / belote")

    const belote = new Belote(table);
    belote.loadGame()
    
	await tablesCollection.updateOne(
		{ _id: new ObjectId(tableId) },
		{
			$set: {
				ready: true,
				state : belote.state,
				gameState : {
					round : belote.round,
					betRound : 1, 
					betMap : new Map(),
					pli : new Map(),
					plis : new Array(),
					colorPli : undefined,
					playedAtouts : new Array(),
					currentPlayerId : belote.currentPlayer.id, 
                    stack : belote.stack,
                    potentialAtout : belote.potentialAtout,    
				}
			}
		}
	);

	for (const player of belote.players){
		await usersCollection.updateOne(
			{ _id: new ObjectId(player.id) },
			{$set: {belote: { ...player }}}
		);
		const updatedUser = await getUserById(player.id)
		io.to(player.id).emit("updateUser", updatedUser )
	};

	const updatedTable = await tablesCollection.findOne(
        { _id: new ObjectId(tableId) },
        { projection: { "gameState.stack": 0 } }
      );
      
      io.to(tableId).emit("startBet", updatedTable);
      
	

}