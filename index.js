const express = require("express");
const { connection } = require("./config/db");
const cors = require("cors");
const { userRoute } = require("./routes/user.route");
// const { adminmodel } = require("./models/admin.model");
const { adminrouter } = require("./routes/admin.route");
const { authMiddleWare } = require("./middlewares/auth");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/user", userRoute);
app.use(authMiddleWare);
app.use("/admin", adminrouter);

app.get("/", async (req, res) => {
  try {
    res.send({ ok: true, msg: "Welcome to Backend " });
  } catch (error) {
    res.send({ ok: false, msg: error.message });
  }
});

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connected to MongoDb Database");

    console.log("Connected to Database");
  } catch (error) {
    console.log(error.message);
    console.log("Database not Connected");
  }
  console.log(`Server is running at port ${process.env.PORT}`);
});
