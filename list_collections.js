import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: "./.env" });

async function check() {
  try {
    console.log("Connecting to", process.env.MONGO_DB_URI);
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("Connected!");
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    for (const coll of collections) {
      const count = await db.collection(coll.name).countDocuments();
      console.log(`Collection "${coll.name}": ${count} documents`);
    }
    
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

check();
