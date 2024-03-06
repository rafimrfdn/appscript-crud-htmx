const express = require('express');
const app = express();

// Must have setting to serve the public folder on vercel
// Serve static files from the 'public' directory
const path = require('path')
app.use(express.static(path.join(__dirname, 'public')))

let counter = 0;

app.get('/api/increment', (req, res) => {
  counter++;
  const updatedHTML = `<h2 id="counter">counter: <span>${counter}</span></h2>`;
  res.send(updatedHTML);
})

app.get('/api/decrement', (req, res) => {
  counter--;
  const updatedHTML = `<h2 id="counter">counter: <span>${counter}</span></h2>`;
  res.send(updatedHTML);
})

app.get('/api/reset', (req, res) => {
  counter = 0;
  const updatedHTML = `<h2 id="counter">counter: <span>${counter}</span></h2>`;
  res.send(updatedHTML);
})



// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

module.exports = app;
