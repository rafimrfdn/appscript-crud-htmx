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
