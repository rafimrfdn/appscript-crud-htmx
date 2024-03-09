const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const BASE_URL = 'https://script.google.com/macros/s/AKfycbyaLyPo6_F_Shgza5Y8RWvjd94T99xBYQ2u_yuPqD9V-02HOliFqc5cX31UC9KsryBb/exec';
const TABLE = 'Users';

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

let counter = 0;

app.get('/api/increment', (req, res) => {
  counter++;
  const updatedHTML = `<h2 id="counter">counter: <span>${counter}</span></h2>`;
  res.send(updatedHTML);
});


app.post('/submit', async (req, res) => {
  try {
    const lastId = await getLastId();
    const newId = lastId + 1;

    // const timestamp = Math.floor((Date.now() + Time.now()) / 1000);
    // const currentTime = formatDate(new Date());

    const data = {
      id: newId,
      username: req.body.username,
      email: req.body.email,
      // timestamp
      // currentTime
    };
        console.log(timestamp);

    const response = await axios.get(`${BASE_URL}?action=insert&table=${TABLE}&data=${encodeURIComponent(JSON.stringify(data))}`);

    res.send(`Data dengan <b>id</b> ${data.id} <b>${data.username}</b> berhasil diterima`);
  } catch (error) {
    console.error('Error submitting data:', error);
    res.status(500).json({ error: 'An error occurred while submitting data.' });
  }
});

async function getLastId() {
  const response = await axios.get(`${BASE_URL}?action=read&table=${TABLE}`);
  const data = response.data.data;
  const lastItem = data[data.length - 1];
  return lastItem ? lastItem.id : 0;
}

// function formatDate(date) {
//   const month = date.getMonth() + 1;
//   const day = date.getDate();
//   const year = date.getFullYear();
//   const hours = date.getHours();
//   const minutes = date.getMinutes();
//   const seconds = date.getSeconds();
//
//   return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
// }



app.get('/fetchData', async (req, res) => {
  try {
    const data = await fetchExternalData();
    const html = generateHTML(data);
    res.send(html);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
});

async function fetchExternalData() {
  const response = await fetch(`${BASE_URL}?action=read&table=${TABLE}`);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
}

function generateHTML(data) {
  let html = '<ul>';
  data.data.forEach(item => {
    html += `<li>ID: ${item.id}, Username: ${item.username}, Email: ${item.email} `;
    html += `<div><button hx-get="/update/${item.id}/edit" hx-target="#updateform">update</button> `;
    html += `<button hx-get="/delete/${item.id}">Delete</button><br/></div></li>`;
  });
  html += '</ul>';
  return html;
}

app.get('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deleteUrl = `${BASE_URL}?action=delete&table=${TABLE}&id=${id}`;
    
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

app.get('/update/:id/edit', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}?action=read&table=${TABLE}&id=${req.params.id}`);
    const responseData = response.data.data;

    res.send(`
      <dialog open>
        <div>
          <h1>Edit User ${responseData.id}</h1>
          <div>
            <form id="updaterespon" >
              <input type="text" id="username" name="username" value="${responseData.username}">
              <input type="email" id="email" name="email" value="${responseData.email}">
              <div class="grid">
                <button autofocus>Close</button>
                <button hx-post="/update/${req.params.id}" hx-target="#updaterespon">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    `);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

app.post('/update/:id', async (req, res) => {
  try {
    const { id, username, email } = req.body;
    const dataToUpdate = { id, username, email };

    const updateUrl = `${BASE_URL}?action=update&table=${TABLE}&id=${req.params.id}&data=${encodeURIComponent(JSON.stringify(dataToUpdate))}`;

    const response = await axios.get(updateUrl);

    res.send(`
      <p>Sukses update data</p>
      <button autofocus>Close</button>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

module.exports = app;
