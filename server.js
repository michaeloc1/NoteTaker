const express = require('express');
const path = require ('path');
const noteData = require('./db/db.json');
const fs =require('fs');
const uniqid = require('uniqid');


const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => res.json(noteData));

app.post('/api/notes', (req, res) => {
  //const test = req.body;
  //console.log(test)
  const id = uniqid();
  const {title, text} = req.body;
  if(title && text){
    const newNote = {
      title,
      text,
      id
    }
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);
        console.log (parsedNotes)

        // Add a new note
        parsedNotes.push(newNote);

        // Write updated notes back to the file
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
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
    //console.log(response)
    res.status(201).json(response);
    const test = require('./db/db.json');
    app.get('/api/notes', (req, res) => res.json(test));
    } else {
     res.status(500).json('Error in posting note');
  }
  //app.get('/api/notes', (req, res) => res.json(noteData));
});

app.delete('/api/notes/:id', (req, res) => {
  id = req.params.id
  console.log(id)
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object
      const parsedNotes = JSON.parse(data);
      const newArray = [];
      for (const element of parsedNotes) {
       if(element.id != req.params.id){
        newArray.push(element)
       }
      }

      // Write updated notes back to the file
      fs.writeFile(
        './db/db.json',
        JSON.stringify(newArray, null, 4),
        (writeErr) =>
          writeErr
            ? console.error(writeErr)
            : console.info('Successfully deleted note!')
      );
    }
  });
})

app.listen(PORT, () => console.log(`app listening on port ${PORT}`));

