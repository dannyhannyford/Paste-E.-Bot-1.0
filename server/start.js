const express = require('express');
const path = require('path');

const PUBLIC_DIR = path.resolve(__dirname, '..', 'public');
const app = express();

// app.use(express.static(PUBLIC_DIR));

app.get('/', (req, res) => {
  res.status(200).send('hello');
});
// TODO connection to database

// app.get('/api/pastepoints/:user_id/:karma', (req, res) => {
//   console.log('user', req.params.user_id, 'amount', req.params.karma);
//   res.send(200);
// });

module.exports = app;
