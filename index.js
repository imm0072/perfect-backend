const express = require("express");
const app = express();
const { PORT } = require("./config");
const cookieParser = require("cookie-parser");
const { connect } = require("./models/index");
const swaggerUi = require("swagger-ui-express");
const { swagger } = require("./services/swagger");
const Apis = require("./router/index");
// const { UserModel } = require("./models/UserModal");

const cors = require("cors");
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use("/api", Apis);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swagger));

app.use("/", (req, res) => {
  res.status(200).json({ msg: "hello from server." });
});

app.listen(PORT, async () => {
  if (!connect()) {
    console.log("Unable to connect");
    process.exit();
  }
  // await UserModel.create({username:"ajay",password:"ajay@123",role:"Admin",email:"ajay@gmail.com"})
  console.log(`Server Running on http://localhost:${PORT}`);
});
