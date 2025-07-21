const express = require('express');
const app = express();

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});

//Middleware to parse URL-encoded form data
app.use(express.urlencoded({extended: true}));

//Serve Static Files from Public Folder
app.use(express.static('public'));

//Variables to store the words for the games
let firstWord = '';
let secondWord = '';
let thirdWord = '';
let fourthWord = '';
let fifthWord = '';
// Madlib Sentence Array
const madlibTemplates = [
  "The [adjective] [noun] decided to [verb] over the [noun2]. '[exclamation]' everyone shouted.",
  "Once upon a time, a [adjective] [noun] loved to [verb] with a [noun2]. '[exclamation]' they laughed.",
  "In the middle of the night, the [noun] became very [adjective] and started to [verb] next to the [noun2] '[exclamation]'",
  "My [adjective] [noun] likes to [verb] every morning before seeing the [noun2]. '[exclamation]'",
  "Yesterday, a [adjective] [noun] tried to [verb] a [noun2]. '[exclamation]!' was all I could say",
  "At the zoo, the [adjective] [noun] would always [verb] near the [noun2]. '[exclamation]'",
  "During the party, a [adjective] [noun] began to [verb] on the [noun2]. '[exclamation]'",
  "The [noun] was so [adjective] that it could [verb] past the [noun2]. '[exclamation]'",
  "Every summer, my [adjective] [noun] and I [verb] by the [noun2]. '[exclamation]'",
  "If you see a [adjective] [noun], make sure to [verb] before it reaches the [noun2]. '[exclamation]'"
];

// Post the first word from the User
app.get('/first-word', (req, res) => {
    res.send(`
        <form method="POST" action="/second-word">
            <label>Enter a noun: <input name="noun" required></label>
            <button type="submit">Next</button>
        </form>
        `);
} );
// Route to Post Second Word
app.post('/second-word', (req, res) => {
    firstWord = req.body.noun;
    res.send(`
        <form method="POST" action="/third-word">
            <label>Enter an adjective: <input name="adjective" required></label>
            <button type="submit">Next</button>
        </form>
        `);
});

// Route to Post Third Word
app.post('/third-word', (req, res) => {
    secondWord = req.body.adjective;
    res.send(`
        <form method="POST" action="/fourth-word">
            <label>Enter an verb: <input name="verb" required></label>
            <button type="submit">Next</button>
        </form>
        `);
});

// Route to Post Fourth Word
app.post('/fourth-word', (req, res) => {
   thirdWord = req.body.verb;
    res.send(`
        <form method="POST" action="/fifth-word">
            <label>Enter 2nd noun: <input name="noun2" required></label>
            <button type="submit">Next</button>
        </form>
        `);
});
app.post('/fifth-word', (req, res) => {
    fourthWord = req.body.noun2;
    res.send(`
        <form method="POST" action="/done">
            <label>Enter an exclamation: <input name="exclamation" required></label>
            <button type="submit">Next</button>
        </form>
        `);
});

// Route to POST /done save Fifth Word, redirect to story
app.post('/done', (req, res) => {
    fifthWord = req.body.exclamation;
    res.redirect('/story');
});

// Route to GET /reset - reset words and redirect to home
app.get('/reset', (req, res) => {
    firstWord = '';
    secondWord = '';
    thirdWord = '';
    fourthWord = '';
    fifthWord = '';
    res.redirect('/');
});

app.get('/story', (req, res) => {
    // Pick a random template
    const template = madlibTemplates[Math.floor(Math.random() * madlibTemplates.length)];
    // Replace placeholders with user input
    const story = template
        .replace('[noun]', firstWord)
        .replace('[adjective]', secondWord)
        .replace('[verb]', thirdWord)
        .replace('[noun2]', fourthWord)
        .replace('[exclamation]', fifthWord);

    res.send(`
        <h1>Your Madlib Story</h1>
        <p>${story}</p>
        <a href="/reset"><button>Play Again</button></a>
    `);
});
