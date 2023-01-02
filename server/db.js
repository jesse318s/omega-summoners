const mongoose = require("mongoose");

module.exports =
  // establishes database connection
  async () => {
    try {
      mongoose.connect(process.env.MONGO_URL);
      const connection = mongoose.connection;
      connection.once("open", () => {
        console.log("MongoDB database connection established successfully.");
      });
    } catch (error) {
      console.log("Could not connect to database.", error);
    }
  };
