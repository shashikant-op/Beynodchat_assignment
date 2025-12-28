const app = require("./app");
const connectDB = require("./config/db");
require("dotenv").config();

connectDB();
console.log("MONGO_URI:", process.env.MONGO_URI);
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
