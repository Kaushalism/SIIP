const express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;
console.log(typeof app);

app.get('/', (req, res) => {
  res.send('API is Running');
});

app.listen(PORT, () => {
  console.log(`server deployed on ${PORT}`);
});
