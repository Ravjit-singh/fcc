const express = require('express');
const app = express();
const cors = require('cors');

// Enable CORS so freeCodeCamp can test it
app.use(cors({ optionsSuccessStatus: 200 }));

// The main endpoint
app.get('/api/whoami', (req, res) => {
  // Extracting the required data from the request object
  const ipAddress = req.ip;
  const language = req.headers['accept-language'];
  const software = req.headers['user-agent'];

  // Return the data as a JSON object
  res.json({
    ipaddress: ipAddress,
    language: language,
    software: software
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Header Parser is listening on port ${PORT}`);
});
