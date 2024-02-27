const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000; // You can change this to your desired port

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let counter = 0;
app.use(express.static('public'));

app.get('/api/increment', (req, res) => {
  counter++;
  const updatedHTML = `<h2 id="counter">counter: <span>${counter}</span></h2>`;
   
  res.send(updatedHTML);
})

// Define a route to handle incoming requests
app.get('/read-data', async (req, res) => {
    try {
        const tableName = req.query.table;

        if (!tableName) {
            return res.status(400).send('Table name is required');
        }

        const url = `https://script.google.com/macros/s/AKfycbzUVYgltZPTREmiMQe4Jv2PtA_DU9SgidezuW-j8uwQb3ocxPmKAZMiw7EWmu9AUTrCog/exec?action=read&table=${tableName}`;

        const response = await axios.get(url);

        // Assuming data is an array of objects with 'id', 'username', and 'email' properties
        const data = response.data.data;

        // Render HTML template with list items
        res.send(`
                <ul>
                    ${data.map(item => `<li>ID: ${item.id}, Username: ${item.username}, Email: ${item.email} <button hx-get="/edit">edit</button></li>`).join('')}
                </ul>
        `);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Internal server error');
    }
});

// Route to handle form submission and post new data to Google Sheets via Apps Script
app.post('/submit-data', async (req, res) => {
    try {
        // Extract data from the form submission
        const newData = {
            id: req.body.id,
            username: req.body.username,
            email: req.body.email,
            timestamp: Date.now(), // Add timestamp
            currentTime: new Date().toLocaleString(), // Add current time
        };
        console.log(newData)

        // Extract table name from query parameter
        const tableName = req.query.table;

        if (!tableName) {
            return res.status(400).send('Table name is required');
        }

        // Construct the URL with table name and data
        const url = `https://script.google.com/macros/s/AKfycbyaLyPo6_F_Shgza5Y8RWvjd94T99xBYQ2u_yuPqD9V-02HOliFqc5cX31UC9KsryBb/exec?action=insert&table=${tableName}&data=${JSON.stringify(newData)}`;

        console.log(url)

        // Post the new data to Google Sheets via Apps Script endpoint
        const response = await axios.post(url);

        // Check the response from Apps Script endpoint
        if (response.data.success) {
            res.send('Data submitted successfully and added to Google Sheets!');
        } else {
            res.status(500).send('Error adding data to Google Sheets');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal server error');
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
