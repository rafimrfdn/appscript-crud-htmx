const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const axios = require('axios');

// Serve static files from the 'public' directory
app.use(express.static('public'));

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

    const timestamp = new Date().toISOString();
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


// Define a route for the /fetchData endpoint
// app.get('/fetchData', async (req, res) => {
//   try {
//     const data = await fetchExternalData(); // Call the function to fetch data
//         // res.json();
//     res.send(data);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     res.status(500).json({ error: "Error fetching data" });
//   }
// });
//
// // Function to fetch data from the external API
// async function fetchExternalData() {
//   const response = await fetch("https://script.google.com/macros/s/AKfycbyaLyPo6_F_Shgza5Y8RWvjd94T99xBYQ2u_yuPqD9V-02HOliFqc5cX31UC9KsryBb/exec?action=read&table=Users");
//   if (!response.ok) {
//     throw new Error("Failed to fetch data");
//   }
//   return response.json();
//   const myJSON = JSON.strigify(response);
//   // return response.text();
// };





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

// Route to handle delete requests -- berhasil pakai ini, pastikan install axios
// app.get('/delete/:id', async (req, res) => {
//   try {
//     const id = req.params.id;
//     const deleteUrl = `https://script.google.com/macros/s/AKfycbyaLyPo6_F_Shgza5Y8RWvjd94T99xBYQ2u_yuPqD9V-02HOliFqc5cX31UC9KsryBb/exec?action=delete&table=Users&id=${id}`;
//
//     const response = await axios.get(deleteUrl);
//     if (response.status !== 200) {
//       throw new Error("Failed to delete item");
//     }
//
//     res.send("Item deleted successfully");
//   } catch (error) {
//     console.error("Error deleting item:", error);
//     res.status(500).json({ error: "Error deleting item" });
//   }
// });


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















// app.get('/lihat', async (req, res) => {
//     async function fetchData() {
//         const res = await fetch('https://script.google.com/macros/s/AKfycbyaLyPo6_F_Shgza5Y8RWvjd94T99xBYQ2u_yuPqD9V-02HOliFqc5cX31UC9KsryBb/exec?action=read&table=Users');
//         try {
//             // const json = await res.text();
//             const json = await res.json();
//             // console.log(json);
//             console.log(json.success);
//             console.log(json.data);
//             return 
//         } catch {
//             console.log("gagal fetch")
//         }
//     }
//     fetchData();
// });


// app.get('/lihat', async (req, res) => {
//     function tampilkan() {fetch('https://script.google.com/macros/s/AKfycbyaLyPo6_F_Shgza5Y8RWvjd94T99xBYQ2u_yuPqD9V-02HOliFqc5cX31UC9KsryBb/exec?action=read&table=Users')
//         .then(function (res) {
//             return res.json();
//         })
//         .then(function (res) {
//             // const dataArray = res.data.map(function(item) {
//             //     return {
//             //         id: item.id,
//             //         username: item.username,
//             //         email: item.email
//             //     };
//             // });
//             // console.log(dataArray);
//         });
//     }
//     res.send(tampilkan());
// });



// app.get('/lihat', async (req, res) => {
//     const endpointread = 'https://script.google.com/macros/s/AKfycbyaLyPo6_F_Shgza5Y8RWvjd94T99xBYQ2u_yuPqD9V-02HOliFqc5cX31UC9KsryBb/exec?action=read&table=Users';
//
//     async function tampilkan() {
//         const api = await fetch(endpointread)
//         const { data } = await api.json()
//         console.log(data)
//     }
//     res.send(tampilkan());
// });

app.get('/lihat', async (req, res) => {
    const endpointread = 'https://script.google.com/macros/s/AKfycbyaLyPo6_F_Shgza5Y8RWvjd94T99xBYQ2u_yuPqD9V-02HOliFqc5cX31UC9KsryBb/exec?action=read&table=Users';

    fetch(endpointread)
    .then(response => response.json())
    .then(data => showInfo(data));

    function showInfo(data) {
        console.log(data);
    }
    res.send(showInfo());
});



// Handle form submission
// app.get('/submit', (req, res) => {
//     // Get form data from query parameters
//     const data = JSON.parse(decodeURIComponent(req.query.data));
//     const id = data.id;
//     const username = data.username;
//     const email = data.email;
//     const timestamp = data.timestamp;
//     const currentTime = data.currentTime;
//
//     // Here you can handle the form data as needed
//     console.log("Received form data:");
//     console.log("ID:", id);
//     console.log("Username:", username);
//     console.log("Email:", email);
//     console.log("Timestamp:", timestamp);
//     console.log("Current Time:", currentTime);
//
//     // Respond with a success message
//     res.send("Form data received successfully!");
// });








// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
