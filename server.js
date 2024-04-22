// All the required dependencies needed here
const PORT = process.env.PORT || 3001;
import fs from 'fs';
import path from 'path';
import express from 'express';
const app = express();
const notes = require('./db/db.json');

//  Middleware for parsing JSON and urlencoded form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// GET Routes for index.html
app.get('/api/notes', (_req, res) => {
    res.json(notes);
});

app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (_req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Function to create a new note
function createNewNote (body, notesArray) {
    const newNote = body;
    if (!Array.isArray(notesArray))
        notesArray = [];

    if (notesArray.length === 0)
        notesArray.push(0);

    body.id = notesArray[0];
    notesArray[0]++;

    notesArray.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return newNote;
}

// Follwed by the POST route to add a new note
app.post('/api/notes', (req, res) => {
    const newNote = createNewNote (req.body, notes);
    res.json(newNote);
});

// Function to delete a note
function deleteNote (id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];

        if (note.id == id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray, null, 2)
            );
            break;
        }
    }
}

app.delete('/api/notes/:id', (req, res) => {
    deleteNote (req.params.id, notes);
    res.json(true);
});

// Server listening on PORT
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});
