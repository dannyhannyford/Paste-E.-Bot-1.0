const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('../postgresql/index.js');

const PUBLIC_DIR = path.resolve(__dirname, '..', 'public');
const app = express();
app.use(bodyParser.json());
app.use(express.static(PUBLIC_DIR));

app.get('/api/users', db.topTen);
app.post('/api/users/up/:id', db.upsertID);
app.post('/api/users/down/:id', db.downsertID);

module.exports = app;
