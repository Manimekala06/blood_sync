require("dotenv").config()
require("dns").setServers(["1.1.1.1","8.8.8.8"]);


const app = require("./app");
const connectDB = require("./config/db");


const PORT = process.env.PORT || 5000;

connectDB()

  .then(() => {
    app.listen(PORT, () => {
      console.log(`BloodSync API running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
