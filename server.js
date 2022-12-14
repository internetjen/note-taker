const express = require('express');
const path = require('path');
const notesData = require('./db/db.json');
const fs = require('fs');
const uuid = require('./helpers/uuid'); // Helper method for generating unique ids

const PORT = process.env.PORT || 3000;
// const host = '0.0.0.0';

const app = express();

//middleware
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

//ROUTING
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// GET request for notes
app.get('/api/notes', (req, res) => res.json(notesData));

// POST request to add a note
app.post('/api/notes', (req, res) => {
  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    // Obtain existing notes
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);

        // Add a new note
        parsedNotes.push(newNote);

        // Write updated notes back to the file
        fs.writeFile('./db/db.json', JSON.stringify(parsedNotes),(writeErr) =>
          writeErr
            ? console.error(writeErr)
            : console.info('Successfully updated notes!')
        );
      }
    });

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error posting note!');
  }
});

// DELETE request to delete a note
app.delete('/api/notes/:id', (req, res) => {

  const requestID = req.params.id;
  console.log(requestID);

  let note = notesData.filter(note => {
      return note.id === requestID;
  })[0];

  console.log(note);
  const index = notesData.indexOf(note);

  notesData.splice(index, 1);

  fs.writeFile('./db/db.json', JSON.stringify(notesData), 'utf8');
  res.json("Note deleted");

});

app.listen(PORT, () => {
  console.log(`Notes app listening at http://localhost:${PORT}`);
});