const mongoose = require("mongoose");

const databaseConnection = async () => {
  try {
    const url = process.env.DATABASE_URL1;
    await mongoose.connect(url);
    const state = mongoose.connection._readyState;

    if (state === 1) {
      console.log(`Database Connected Successfully`);
      return true;
    } else if (state === 2) {
      console.log(`database connecting please wait .....`);
      return false;
    } else if (state === 3) {
      console.log(`database disconnecting please wait .....`);
      return false;
    }
  } catch (err) {
    console.log(`Error in database disconnection ${err}`);
    return false;
  }
};
module.exports = databaseConnection;
