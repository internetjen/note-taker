const express = require('express');
const path = require('path');
const notesData = require('./db/db.json');
const fs = require('fs');

const PORT = 3001;

const app = express();

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => res.json(notesData));

app.post('/api/notes', (req, res) => {
  console.log('got here', req.body)
  res.json(notesData)
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});