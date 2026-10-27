const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Re0315202009032004',          
  database: 'grocery_store'
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', require('./routes'')(pool));

// React app at /shop
const clientDist = path.join(__dirname, 'client', 'dist');
app.use('/shop', express.static(clientDist));
app.use('/shop', (req, res) => res.sendFile(path.join(clientDist, 'index.html')));

app.get('/ping', (req, res) => res.send('this server.js is running'));   // temporary test

app.listen(3000, () => console.log('Running at http://localhost:3000'));