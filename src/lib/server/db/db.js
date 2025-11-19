import { MongoClient } from "mongodb";
import  dotenv  from "dotenv";
dotenv.config()

console.log('db_url : ', process.env.DATABASE_URL)
const client = new MongoClient(process.env.DATABASE_URL);

try {
    await client.connect();
    console.log("✅ Connecté à MongoDB !");
} catch (error) {
    console.error("❌ Erreur de connexion à MongoDB :", error);
}

export const db = client.db("tarot");
export const usersCollection = db.collection("user")
export const tarotCollection = db.collection("tarot-games")
export const yamsCollection = db.collection("yams")
