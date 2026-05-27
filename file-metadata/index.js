const express = require('express');
const cors = require('cors');
const multer = require('multer'); 

const app = express();
app.use(cors({ optionsSuccessStatus: 200 }));

// Configure multer to store uploaded files in memory
const upload = multer({ storage: multer.memoryStorage() });

// POST route to handle the file upload
// The FCC test specifically looks for an input field named 'upfile'
app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  // If no file was uploaded, catch it
  if (!req.file) {
    return res.json({ error: 'Please upload a file' });
  }

  // Extract the metadata provided by multer
  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`File Metadata is listening on port ${PORT}`);
});
