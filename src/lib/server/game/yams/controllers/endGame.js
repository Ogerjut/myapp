import { ObjectId } from "mongodb";
import { tablesCollection, usersCollection } from "../../../db/db.js"
import { getTableById, getUserById } from "../../../db/utils.js";
import { EndGameScore } from "../core/gameOver.js";


export async function endGame(io, tableId){
    const table = await getTableById(tableId)
    const playersId = table?.playersId

    const playersScores = new Map()

    await tablesCollection.updateOne(
        {_id : new ObjectId(tableId)},
        {$set : {state : "endGame", completed : true}}
    )
    for (const playerId of playersId){
        const player = await getUserById(playerId)
        let games = player?.games.yams
        games++
        const endGameScore = new EndGameScore(player)
        const hasBonus = endGameScore.hasBonus
        playersScores.set(playerId, endGameScore.total)
        await usersCollection.updateOne(
            {_id : new ObjectId(playerId)},
            {$set : {
                "yams.endGameItems" : endGameScore.scoreToJSON(),
                "yams.hasBonus" : hasBonus,
                "score.yams" : endGameScore.total, 
                "games.yams" : games,
            }}
        )
        const updatedUser = await getUserById(playerId)
        const updatedTable = await getTableById(tableId)
        io.to(playerId).emit("updateContext", updatedUser, updatedTable )

    }
    const winnerId = getWinnerId(playersScores)
    const winner = await getUserById(winnerId)
    let victories = winner?.victories.yams
    victories++
    await usersCollection.updateOne(
        {_id : new ObjectId(winnerId)},
        {$set : {
            "victories.yams" : victories,
        }}
    )
    const updatedUser = await getUserById(winnerId)
    io.to(winnerId).emit("updateUser", updatedUser)
    
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