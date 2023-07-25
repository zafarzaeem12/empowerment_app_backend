const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const databaseConnection = require('./database/databaseConnection')

// app routes start here
const UserRouter = require('./router/Users')
// app routes end here


app.use(express.json());
app.use(cors());

// app routes use here
app.use("/UserAPI/", UserRouter);
// routes end here

dotenv.config();

const port = process.env.PORT;

// database connection start here
databaseConnection()
// database connection end here


app.listen(port, () => {
  console.log(`Server is running on ${port} Port`);
});