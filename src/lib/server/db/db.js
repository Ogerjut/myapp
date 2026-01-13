import { MongoClient } from "mongodb";
import  dotenv  from "dotenv";
dotenv.config()

const client = new MongoClient(process.env.DATABASE_URL);

try {
    await client.connect();
    console.log("✅ Connecté à MongoDB !");
} catch (error) {
    console.error("❌ Erreur de connexion à MongoDB :", error);
}

export const db = client.db("games");
export const usersCollection = db.collection("user")
export const msgCollection = db.collection("messages")
export const tablesCollection = db.collection("tables")
export const sessionsCollection = db.collection("session")
