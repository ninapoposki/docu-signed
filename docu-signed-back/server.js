const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
//const db = require("./db");
const sequelize = require("./sequelize");
const userRoutes = require("./routes/UserRoutes");
const docRoutes = require("./routes/DocumentRoutes");
const documentHistoryService = require("./services/DocumentHistoryService");
require("./models/User");
require("./models/Document");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.listen(5000, async () => {
  console.log("Server started on port 5000");
  try {
    const result = await documentHistoryService.sendDeadlineReminders();
    console.log(` Deadline reminders sent: ${result.sent}`);
  } catch (error) {
    console.error(" Error sending reminders:", error);
  }
});
app.get("/", (req, res) => {
  res.send("Docu Signed back is working");
});

app.use("/api/users", userRoutes);
app.use("/api/documents", docRoutes);

//runs the server
// app.listen(PORT, () => {
//   console.log(`Port for server: http://localhost:${PORT}`);
// });
//za prikaz fajlova
const path = require("path");
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, path) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
    },
  })
);
app.use(
  "/uploads/signed",
  express.static(path.join(__dirname, "uploads", "signed"), {
    setHeaders: (res, path) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
    },
  })
);

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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});
