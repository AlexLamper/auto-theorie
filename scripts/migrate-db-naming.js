const mongoose = require("mongoose");

const MONGODB_URI = "mongodb://alexlamper:alexlamper@ac-s8m3361-shard-00-00.ehvonkm.mongodb.net:27017,ac-s8m3361-shard-00-01.ehvonkm.mongodb.net:27017,ac-s8m3361-shard-00-02.ehvonkm.mongodb.net:27017/auto-theorie?ssl=true&replicaSet=atlas-11sn9i-shard-0&authSource=admin&retryWrites=true&w=majority";

async function migrate() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected.");

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    console.log("Current collections:", collectionNames);

    if (collectionNames.includes("exams") && !collectionNames.includes("oefenexamens")) {
      console.log("Renaming 'exams' to 'oefenexamens'...");
      await db.collection("exams").rename("oefenexamens");
      console.log("Rename successful.");
    } else if (collectionNames.includes("exams") && collectionNames.includes("oefenexamens")) {
      console.log("Both 'exams' and 'oefenexamens' exist. Merging data if necessary or just deleting 'exams'...");
      // For safety, let's just log this for now.
      console.log("Manual intervention recommended if both exist.");
    } else {
      console.log("No 'exams' collection found or it's already renamed.");
    }

  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

migrate();
