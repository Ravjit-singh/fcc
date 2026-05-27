const express = require('express');
const cors = require('cors');
const dns = require('dns'); // Built-in Node module for domain lookups

const app = express();

app.use(cors({ optionsSuccessStatus: 200 }));

// Middleware to parse POST request bodies (form data)
app.use(express.urlencoded({ extended: true }));

// Our temporary in-memory database
const urlDatabase = [];
let idCounter = 1;

// 1. POST Route: Create the short URL
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  try {
    // Check if the URL string is structurally valid
    const parsedUrl = new URL(originalUrl);
    
    // FCC requires it to be http or https
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return res.json({ error: 'invalid url' });
    }

    // Verify the domain actually exists on the internet
    dns.lookup(parsedUrl.hostname, (err) => {
      if (err) {
        return res.json({ error: 'invalid url' });
      }

      // If valid, save it to our array
      const shortUrl = idCounter++;
      urlDatabase.push({ original_url: originalUrl, short_url: shortUrl });

      // Return the required JSON response
      res.json({
        original_url: originalUrl,
        short_url: shortUrl
      });
    });
  } catch (err) {
    // Catch block triggers if `new URL()` fails (e.g., missing http://)
    res.json({ error: 'invalid url' });
  }
});

// 2. GET Route: Redirect to the original URL
app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrlParam = parseInt(req.params.short_url);
  
  // Search our array for the matching ID
  const foundUrl = urlDatabase.find(doc => doc.short_url === shortUrlParam);

  if (foundUrl) {
    res.redirect(foundUrl.original_url); // Send them to the real site
  } else {
    res.json({ error: 'No short URL found for the given input' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`URL Shortener is listening on port ${PORT}`);
});
