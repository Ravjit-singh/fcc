const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.urlencoded({ extended: true }));

// In-memory "database"
const users = [];
const exercises = [];

// 1. POST: Create a New User
app.post('/api/users', (req, res) => {
  const username = req.body.username;
  // Generate a random string for the _id
  const _id = Math.random().toString(36).substring(2, 11);
  
  const newUser = { username, _id };
  users.push(newUser);
  
  res.json(newUser);
});

// 2. GET: Get an Array of All Users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// 3. POST: Add an Exercise to a User
app.post('/api/users/:_id/exercises', (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;
  
  const user = users.find(u => u._id === _id);
  if (!user) return res.json({ error: 'User not found' });

  // Use the provided date, or default to current date
  const exerciseDate = date ? new Date(date) : new Date();
  
  const newExercise = {
    userId: _id,
    description,
    duration: parseInt(duration),
    date: exerciseDate.toDateString() // FCC requires this exact format
  };
  
  exercises.push(newExercise);

  // Return the user object with the exercise fields added
  res.json({
    _id: user._id,
    username: user.username,
    date: newExercise.date,
    duration: newExercise.duration,
    description: newExercise.description
  });
});

// 4. GET: Retrieve a User's Exercise Log
app.get('/api/users/:_id/logs', (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  const user = users.find(u => u._id === _id);
  if (!user) return res.json({ error: 'User not found' });

  // Grab all exercises belonging to this user
  let log = exercises.filter(e => e.userId === _id);

  // Filter by 'from' date if provided
  if (from) {
    const fromDate = new Date(from);
    log = log.filter(e => new Date(e.date) >= fromDate);
  }
  
  // Filter by 'to' date if provided
  if (to) {
    const toDate = new Date(to);
    log = log.filter(e => new Date(e.date) <= toDate);
  }

  // Apply the limit if provided
  if (limit) {
    log = log.slice(0, parseInt(limit));
  }

  // Map the log array to exclude the internal userId
  const formattedLog = log.map(e => ({
    description: e.description,
    duration: e.duration,
    date: e.date
  }));

  // Return the final requested object structure
  res.json({
    username: user.username,
    count: formattedLog.length,
    _id: user._id,
    log: formattedLog
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Exercise Tracker listening on port ${PORT}`);
});
