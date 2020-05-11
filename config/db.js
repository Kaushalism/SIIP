// we can write this directly to our main server.js file but to avoid clutter we created it separately.
//as this is also a configuration of db thats why it is in the config folder

const mongoose = require('mongoose');
const config = require('config');
// we req  config because the variables defined intp the default.json file will be available as a object in config.
const db = config.get('mongoURI');

// we will be using async await instead of .then .cath to handle promises;
