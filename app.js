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

