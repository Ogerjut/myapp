import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017");

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
