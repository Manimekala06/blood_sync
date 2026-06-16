const mongoose = require("mongoose");
const dns = require("dns");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  const fallbackUri = process.env.MONGO_FALLBACK;

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing in environment variables");
  }

  // Ensure reliable DNS servers for SRV lookups
  try {
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
  } catch (e) {
    // ignore if DNS config is not permitted in the environment
  }

  mongoose.set("strictQuery", true);

  const tryConnect = async (uri) => {
    return mongoose.connect(uri);
  };

  try {
    console.log("Attempting MongoDB connection...");
    await tryConnect(mongoUri);

    const dbName = (mongoose.connection.db && mongoose.connection.db.databaseName) || mongoose.connection.name;
    const hostInfo = mongoose.connection.host || (mongoose.connection.client && mongoose.connection.client.s && mongoose.connection.client.s.url) || 'unknown';
    console.log("MongoDB connected", { db: dbName, host: hostInfo });
    return;
  } catch (err) {
    // Detect common DNS/SRV errors
    const isDnsSrvError = /querySrv|ENOTFOUND|ECONNREFUSED|ENODATA/i.test(err.message || err.code || "");
    console.error("Initial MongoDB connection error:", err.message || err);

    if (isDnsSrvError) {
      if (fallbackUri) {
        try {
          console.log("Attempting MongoDB fallback URI from MONGO_FALLBACK...");
          await tryConnect(fallbackUri);
          const dbName = (mongoose.connection.db && mongoose.connection.db.databaseName) || mongoose.connection.name;
          console.log("MongoDB connected (fallback)", { db: dbName });
          return;
        } catch (err2) {
          console.error("Fallback MongoDB connection error:", err2.message || err2);
          throw err2;
        }
      }

      // Retry once after re-setting DNS servers
      try {
        console.log("Retrying initial MongoDB URI after resetting DNS servers...");
        try {
          dns.setServers(["1.1.1.1", "8.8.8.8"]);
        } catch (e) {}
        await tryConnect(mongoUri);
        const dbName = (mongoose.connection.db && mongoose.connection.db.databaseName) || mongoose.connection.name;
        console.log("MongoDB connected on retry", { db: dbName });
        return;
      } catch (err3) {
        console.error("Retry MongoDB connection error:", err3.message || err3);
        console.error("If SRV DNS lookups keep failing, set a non-SRV fallback using MONGO_FALLBACK in your .env, e.g.");
        console.error("MONGO_FALLBACK=mongodb://host1:27017,host2:27017/yourdbname?replicaSet=rs0&ssl=true");
        throw err3;
      }
    }

    throw err;
  }
};

module.exports = connectDB;
