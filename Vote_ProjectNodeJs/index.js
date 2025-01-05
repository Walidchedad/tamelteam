const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');  // Import the CORS package

const app = express();
const port = 3000;

// Connecter à la base de données MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',        // Remplacez par votre utilisateur MySQL
  password: '',        // Remplacez par votre mot de passe MySQL
  database: 'users_db' // Le nom de votre base de données
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// CORS Middleware to allow requests from Angular frontend
app.use(cors({
  origin: 'http://localhost:4200',  // Allow requests only from Angular frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Allow necessary HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allow necessary headers
  preflightContinue: false,
  optionsSuccessStatus: 200
}));

// Middleware pour analyser le corps des requêtes JSON
app.use(bodyParser.json());

// Route d'inscription (Sign Up)
app.post('/signup', (req, res) => {
  const { firstName, lastName, email, password, dob, gender } = req.body;

  // Vérifier si l'email est déjà utilisé
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hacher le mot de passe avant de l'enregistrer
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) throw err;

      // Insérer l'utilisateur dans la base de données
      const query = 'INSERT INTO users (first_name, last_name, email, password, dob, gender) VALUES (?, ?, ?, ?, ?, ?)';
      db.query(query, [firstName, lastName, email, hashedPassword, dob, gender], (err, result) => {
        if (err) throw err;
        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
      });
    });
  });
});

// Route de connexion (Login)
app.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    // Vérifier si l'email existe dans la base de données
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
      if (err) throw err;
  
      if (result.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const user = result[0];
  
      // Comparer le mot de passe avec celui stocké dans la base de données
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
  
        if (isMatch) {
          // Send user data along with success message
          res.status(200).json({
            message: 'Login successful', email: user.email,
            firstName: user.first_name,  // Send first name or full name here
            userId: user.id,
          });
        } else {
          res.status(401).json({ message: 'Invalid credentials' });
        }
      });
    });
  });

  // Route to create a new poll
  app.post('/polls', (req, res) => {
    const { title, options } = req.body;
    const query = 'INSERT INTO polls (title, options) VALUES (?, ?)';
    db.query(query, [title, JSON.stringify(options)], (err, result) => {
      if (err) throw err;
      res.status(201).json({ message: 'Poll created successfully', pollId: result.insertId });
    });
  });
  
  // Get all surveys (polls)
  app.get('/polls', (req, res) => {
    const query = 'SELECT * FROM polls';
    db.query(query, (err, results) => {
      if (err) throw err;
      res.status(200).json(results);
    });
  });
  
  // Edit a poll (update title or options)
  app.put('/polls/:id', (req, res) => {
    const { id } = req.params;
    const { title, options } = req.body;
    const query = 'UPDATE polls SET title = ?, options = ? WHERE id = ?';
    db.query(query, [title, JSON.stringify(options), id], (err, result) => {
      if (err) throw err;
      res.status(200).json({ message: 'Poll updated successfully' });
    });
  });
  
  // Delete a poll
  app.delete('/polls/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM polls WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) throw err;
      res.status(200).json({ message: 'Poll deleted successfully' });
    });
  });
  
  // Voting logic (record the vote)
  // Route de vote
// Route to handle voting
app.post('/polls/:id/vote', (req, res) => {
  const surveyId = req.params.id;  // Get the survey ID (poll ID)
  const { option, email } = req.body;  // Get the selected option and the user's email

  if (!email || !option) {
    return res.status(400).json({ message: 'Email and option are required' });
  }

  // Check if the user has already voted for this poll
  const checkQuery = 'SELECT * FROM votes WHERE poll_id = ? AND email = ?';
  db.query(checkQuery, [surveyId, email], (err, result) => {
    if (err) {
      console.error('Error checking previous votes:', err);
      return res.status(500).json({ message: 'Error checking previous votes' });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: 'You have already voted for this poll' });
    }

    // Insert the vote into the database
    const insertQuery = 'INSERT INTO votes (poll_id, option, email) VALUES (?, ?, ?)';
    db.query(insertQuery, [surveyId, option, email], (err, result) => {
      if (err) {
        console.error('Error saving vote:', err);
        return res.status(500).json({ message: 'Error saving your vote' });
      }

      res.status(200).json({ message: 'Vote recorded successfully' });
    });
  });
});

// Endpoint to check if the user has already voted for a specific poll
app.get('/polls/:id/user-vote-status', (req, res) => {
  const { id } = req.params; // Poll ID
  const { email } = req.query; // User email

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  // Check if the user has voted for this poll
  const query = 'SELECT * FROM votes WHERE poll_id = ? AND email = ?';
  db.query(query, [id, email], (err, result) => {
    if (err) {
      console.error('Error checking vote status:', err);
      return res.status(500).json({ message: 'Error checking vote status' });
    }

    // If the user has already voted, return true
    const hasVoted = result.length > 0;
    res.status(200).json({ hasVoted });
  });
});


  
// Handle preflight requests for all routes
app.options('*', cors());

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
