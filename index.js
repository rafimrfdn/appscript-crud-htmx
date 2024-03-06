const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const axios = require('axios');


// Must have setting to serve the public folder on vercel
// Serve static files from the 'public' directory
const path = require('path')
app.use(express.static(path.join(__dirname, 'public')))

//app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.use(express.json());

let counter = 0;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/api/increment', (req, res) => {
  counter++;
  const updatedHTML = `<h2 id="counter">counter: <span>${counter}</span></h2>`;
   
  res.send(updatedHTML);
})


// Handle form submission
app.post('/submit', async (req, res) => {
try {
    // Generate timestamp and currentTime

    var timestamp = Math.floor(Date.now() / 1000);
    // const timestamp = new Date().toISOString();
    // const currentTime = new Date().toLocaleTimeString();

    var currentTime = formatDate(new Date());
        // Function to format date as "MM/DD/YYYY HH:MM:SS"
        function formatDate(date) {
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var year = date.getFullYear();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();

            return month + '/' + day + '/' + year + ' ' + hours + ':' + minutes + ':' + seconds;
        };

    // Prepare data object
    const data = {
      id: req.body.id,
      username: req.body.username,
      email: req.body.email,
      timestamp,
      currentTime
    };
        console.log(data);

    // Send data to the endpoint
    const response = await axios.get('https://script.google.com/macros/s/AKfycbyaLyPo6_F_Shgza5Y8RWvjd94T99xBYQ2u_yuPqD9V-02HOliFqc5cX31UC9KsryBb/exec?action=insert&table=Users&data=' + encodeURIComponent(JSON.stringify(data)));

    // Send back response from the endpoint
    // res.json(response.data);
    res.send("data dengan <b>id</b>" + ` ${data.id} ` + "username" + `<b> ${data.username} </b>` + "berhasil diterima");
  } catch (error) {
    console.error('Error submitting data:', error);
    res.status(500).json({ error: 'An error occurred while submitting data.' });
  }
});




app.get('/fetchData', async (req, res) => {
  try {
    const data = await fetchExternalData(); // Call the function to fetch data
    const html = generateHTML(data); // Generate HTML with the data
    res.send(html);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
});






// Function to fetch data from the external API
async function fetchExternalData() {
  const response = await fetch("https://script.google.com/macros/s/AKfycbyaLyPo6_F_Shgza5Y8RWvjd94T99xBYQ2u_yuPqD9V-02HOliFqc5cX31UC9KsryBb/exec?action=read&table=Users");
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
}

// Function to generate HTML with the data
function generateHTML(data) {
  let html = '<ul>';
  data.data.forEach(item => {
    html += `<li>ID: ${item.id}, Username: ${item.username}, Email: ${item.email} `;
    // html += `<button onclick="deleteItem(${item.id})">Delete</button></li>`;
    html += `<button hx-get="/delete/${item.id}">Delete</button></li>`;
  });
  html += '</ul>';
  return html;
}





// Route to handle delete requests
app.get('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deleteUrl = `https://script.google.com/macros/s/AKfycbyaLyPo6_F_Shgza5Y8RWvjd94T99xBYQ2u_yuPqD9V-02HOliFqc5cX31UC9KsryBb/exec?action=delete&table=Users&id=${id}`;
    
    const response = await fetch(deleteUrl, { method: 'GET' });
    if (!response.ok) {
      throw new Error("Failed to delete item");
    }

    res.send("Item deleted successfully");
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ error: "Error deleting item" });
  }
});






app.get('/lihat', async (req, res) => {
    const endpointread = 'https://script.google.com/macros/s/AKfycbyaLyPo6_F_Shgza5Y8RWvjd94T99xBYQ2u_yuPqD9V-02HOliFqc5cX31UC9KsryBb/exec?action=read&table=Users';

    function showInfo(data) {
        console.log(data);
    }

    fetch(endpointread)
    .then(response => response.json())
    .then(data => showInfo(data));

    // res.json(JSON.stringify(showInfo));
    res.send(showInfo());
});






// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

module.exports = app;
