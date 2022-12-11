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

// GET request for notes
app.get('/api/notes', (req, res) => res.json(notesData));

// POST request to add a note
app.post('/api/notes', (req, res) => {
  const noteDataString = JSON.stringify(req.body);

  // Obtain existing notes
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object
      const parsedNotes = JSON.parse(data);

      // Add a new note
      parsedNotes.push(req.body);

      // Write updated notes back to the file
      fs.writeFile(
        './db/db.json',
        JSON.stringify(parsedNotes),
        (writeErr) =>
          writeErr
            ? console.error(writeErr)
            : console.info('Successfully updated notes!')
      );
    }
  })
  res.json(notesData)
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});