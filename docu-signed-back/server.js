const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
//const db = require("./db");
const sequelize = require("./sequelize");
const userRoutes = require("./routes/UserRoutes");
const docRoutes = require("./routes/DocumentRoutes");
require("./models/User");
require("./models/Document"); //??
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Docu Signed back is working");
});

app.use("/api/users", userRoutes);
app.use("/api/documents", docRoutes);
//runs the server
// app.listen(PORT, () => {
//   console.log(`Port for server: http://localhost:${PORT}`);
// });

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Sequelize models synced");
    app.listen(PORT, () => {
      console.log(`Port for server: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to sync database:", err);
  });

//prints the current time if the db is working
app.get("/test-db", async (req, res) => {
  try {
    // const result = await db.query("SELECT NOW()");
    // res.json(result.rows[0]);
    await sequelize.authenticate();
    res.send("Successful connection to db(sequelize)");
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).send("Sequelize connection failed");
  }
});

app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});
