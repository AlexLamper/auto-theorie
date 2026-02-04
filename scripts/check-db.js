const mongoose = require("mongoose");
const path = require("path");

async function check() {
  const uri = "mongodb+srv://alexlamper:alexlamper@cluster0.ehvonkm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  
  try {
    await mongoose.connect(uri, { dbName: "auto-theorie" });
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections in 'auto-theorie':", collections.map(c => c.name));
    
    if (collections.map(c => c.name).includes("exams")) {
      console.log("Renaming 'exams' to 'oefenexamens'...");
      await mongoose.connection.db.collection("exams").rename("oefenexamens");
      console.log("Done.");
    }
  } catch (e) {
    console.error(e);
  } finally {
    await mongoose.disconnect();
  }
}

check();
