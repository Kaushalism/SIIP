const mongoose = require('mongoose');
// we created a object of mongoose.Schema() function and stored it in Userschema
// defining object
const Userschema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  avatar: {
    type: String,
  },
  enrollment: {
    type: Number,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// mongoose.model() takes two arguments first is the name of schema, and second is the schema object.
module.exports = User = mongoose.model('user', Userschema);
