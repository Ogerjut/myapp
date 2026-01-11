import { getUserById } from '../../../db/utils.js';
import { ObjectId } from 'mongodb';
import { usersCollection, tablesCollection } from '../../../db/db.js';


export default async function gameOver(io, tableId) {
    const table = await tablesCollection.findOne({_id : new ObjectId(tableId)})
    const playersId = table?.playersId
    const playersScores = new Map()

    await tablesCollection.updateOne(
        {_id : new ObjectId(tableId)},
        {$set : {completed : true, state : "endGame"}}
    )
    const updatedTable = await tablesCollection.findOne({_id : new ObjectId(tableId)})

    for (const playerId of playersId){
        // mettre à jour les stats (games + 1) et vainqueur victory +1
        const player = await getUserById(playerId)
        const score = player?.score.tarot
        let games = player?.games.tarot
        games++
        playersScores.set(playerId, score)
        await usersCollection.updateOne(
            {_id : new ObjectId(playerId)},
            {$set : {
                "games.tarot" : games,
            }}
        )
        
        const updatedUser = await usersCollection.findOne({ _id: new ObjectId(playerId)});
        io.to(playerId).emit("updateContext", updatedUser, updatedTable)
    }; 

    const winnerId = getWinnerId(playersScores)
    const winner = await getUserById(winnerId)
    let victories = winner?.victories.tarot
    victories++
    await usersCollection.updateOne(
        {_id : new ObjectId(winnerId)},
        {$set : {
            "victories.tarot" : victories,
        }}
    )
    const winnerUpdated = await getUserById(winnerId)
    io.to(winnerId).emit("updateUser", winnerUpdated)

  

}

function getWinnerId(playersScores){
    let max = 0
    let winner
    playersScores.forEach((score, id) => {
        if (score > max){
            max = score
            winner = id
        }
    })
    return winner
}
  