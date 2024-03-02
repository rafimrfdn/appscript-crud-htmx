<<<<<<< HEAD
const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbyaLyPo6_F_Shgza5Y8RWvjd94T99xBYQ2u_yuPqD9V-02HOliFqc5cX31UC9KsryBb/exec';

// Function to generate table header
function generateTableHeader(headers) {
  let headerHTML = '<tr>';
  headers.forEach(header => {
    headerHTML += `<th>${header}</th>`;
  });
  headerHTML += '</tr>';
  return headerHTML;
}



// Route for reading data
app.get('/users', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}?action=read&table=Users`);
    const users = response.data;

    // Define table headers
    const tableHeaders = ['ID', 'Username', 'Email'];

    // Generate table header HTML
    const tableHeaderHTML = generateTableHeader(tableHeaders);

    // Generate table rows HTML
    let tableRowsHTML = '';
    users.forEach(user => {
      tableRowsHTML += `<tr><td>${user.id}</td><td>${user.username}</td><td>${user.email}</td></tr>`;
    });

    // Generate final HTML
    const userListHTML = `<table>${tableHeaderHTML}${tableRowsHTML}</table>`;

    res.send(userListHTML);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Route for inserting data
app.post('/users', async (req, res) => {
  const userData = req.body;
  try {
    const response = await axios.post(`${API_BASE_URL}?action=insert&table=Users`, userData);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route for updating data
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const userData = req.body;
  try {
    const response = await axios.put(`${API_BASE_URL}?action=update&table=Users&id=${id}`, userData);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route for deleting data
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.delete(`${API_BASE_URL}?action=delete&table=Users&id=${id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
=======
const express = require('express');
const app = express();
// const port = 3000;
const axios = require('axios');

const path = require('path');
const PORT = process.env.PORT || 3000;


const bodyParser = require('body-parser');

let counter = 0;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/api/increment', (req, res) => {
  counter++;
  const updatedHTML = `<h2 id="counter">counter: <span>${counter}</span></h2>`;
   
  res.send(updatedHTML);
})

// Define route for reading data
app.get('/fetchdata', async (req, res) => {
    try {
        // Send GET request to your AppScript endpoint
        const response = await axios.get('https://script.google.com/macros/s/AKfycbyaLyPo6_F_Shgza5Y8RWvjd94T99xBYQ2u_yuPqD9V-02HOliFqc5cX31UC9KsryBb/exec?action=read&table=Users');

 // Extract data from the response
        const data = response.data.data;

        // Render HTML template with the data
        let html = `
                    <div class="grid" >
        `;
        
        data.forEach(item => {
            html += `
                <div>
                    ${item.id} ${item.username} ${item.email}
                    <!-- <button class="button" onclick="editItem('${item.id}')">Edit</button>-->
                     <button class="button" onclick="deleteItem('${item.id}')">Delete</button>
                </div>
            `;
        });
        
        html += `
                    </div>
                    <script>
                        function editItem(id) {
                            // Implement edit functionality
                            console.log('Edit item with ID:', id);
                        }
                        
                        async function deleteItem(id) {
                            try {
                                const confirmDelete = confirm('Are you sure you want to delete this item?');
                                if (!confirmDelete) return;

                                // Send DELETE request to delete item
                                await axios.delete('https://script.google.com/macros/s/AKfycbyaLyPo6_F_Shgza5Y8RWvjd94T99xBYQ2u_yuPqD9V-02HOliFqc5cX31UC9KsryBb/exec?action=delete&table=Users&id=' + id);
                                
                                // Reload the page after successful deletion
                                window.location.reload();
                            } catch (error) {
                                console.error('Error deleting item:', error);
                                alert('Error deleting item');
                            }
                        }
                    </script>
                </body>
            </html>
        `;
        
        res.send(html);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

// Handle form submission
app.get('/submit', (req, res) => {
    // Get form data from query parameters
    const data = JSON.parse(decodeURIComponent(req.query.data));
    const id = data.id;
    const username = data.username;
    const email = data.email;
    const timestamp = data.timestamp;
    const currentTime = data.currentTime;

    // Here you can handle the form data as needed
    console.log("Received form data:");
    console.log("ID:", id);
    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Timestamp:", timestamp);
    console.log("Current Time:", currentTime);

    // Respond with a success message
    res.send("Form data received successfully!");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

>>>>>>> new
