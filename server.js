const express = require("express");
const path = require('path');
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const databaseConnection = require('./database/databaseConnection')

// app routes start here
const UserRouter = require('./router/Users')
const PreferenceRouter = require('./router/Preferences')
// app routes end here

app.use(express.static(path.join(__dirname + '/public')));
app.use(express.json());
app.use(cors());

// app routes use here
app.use("/UserAPI/", UserRouter);
app.use("/PreferenceAPI/", PreferenceRouter);
// routes end here

dotenv.config();

const port = process.env.PORT;

// database connection start here
databaseConnection()
// database connection end here


app.listen(port, () => {
  console.log(`Server is running on ${port} Port`);
});