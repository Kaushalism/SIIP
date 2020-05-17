// we can write this directly to our main server.js file but to avoid clutter we created it separately.
//as this is also a configuration of db thats why it is in the config folder

const mongoose = require('mongoose');
const config = require('config');
// we req  config because the variables defined intp the default.json file will be available as a object in config.
const db = config.get('mongoURI');

// we will be using async await instead of .then .cath to handle promises;

const connectDB = async () => {
  // we are taking this whole async function in connectDB
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }); // connect returns a promise
    console.log('MongoDB connected!');
  } catch (error) {
    console.log(error.message); //message is a property of error.
    process.exit(1); // to fail the webapp
  }
};

module.exports = connectDB;
