const express = require('express');
const app = express();
const cors = require('cors');

// Enable CORS so the API can be tested remotely by freeCodeCamp
app.use(cors({ optionsSuccessStatus: 200 }));

// Main API endpoint
app.get("/api/:date?", (req, res) => {
  const dateString = req.params.date;
  let date;

  // If no date parameter is provided, use the current time
  if (!dateString) {
    date = new Date();
  } else {
    // Check if the provided string is a Unix timestamp (digits only)
    if (!isNaN(dateString)) {
      date = new Date(parseInt(dateString));
    } else {
      date = new Date(dateString);
    }
  }

  // Validate the resulting date object
  if (date.toString() === "Invalid Date") {
    return res.json({ error: "Invalid Date" });
  } else {
    return res.json({
      unix: date.getTime(),
      utc: date.toUTCString()
    });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
