const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path'); // We need path to resolve the HTML file location

const app = express();
app.use(cors({ optionsSuccessStatus: 200 }));

// Serve the HTML page on the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  if (!req.file) {
    return res.json({ error: 'Please upload a file' });
  }

  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`File Metadata is listening on port ${PORT}`);
});
