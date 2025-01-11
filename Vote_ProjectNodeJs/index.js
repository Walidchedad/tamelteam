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
    const { title, options, data_fin, type, creator_email, start_date } = req.body;
  
    // Validate that data_fin is provided and is a valid future date
    const startDate = new Date(req.body.start_date);
    const endDate = new Date(req.body.data_fin);
    const currentDate = new Date();
  
    if (isNaN(endDate.getTime()) || endDate <= currentDate) {
      return res.status(400).json({ message: 'La date de fin doit être dans le futur.' });
    }
  
    // Validate that creator_email is provided
    if (!creator_email || !/\S+@\S+\.\S+/.test(creator_email)) {
      return res.status(400).json({ message: 'Un email valide est requis pour le créateur.' });
    }
  
    // Insert the survey into the database
    const query = `
  INSERT INTO polls (title, options, data_fin, type, creator_email, start_date)
  VALUES (?, ?, ?, ?, ?, ?)
`;

db.query(
  query,
  [title, JSON.stringify(options), endDate, type, creator_email, startDate],
  (err, result) => {
    if (err) {
      console.error('Erreur lors de la création du sondage :', err);
      return res.status(500).json({ message: 'Erreur serveur lors de la création du sondage.' });
    }
    res.status(201).json({
      message: 'Sondage créé avec succès',
      pollId: result.insertId,
    });
  }
);
  });
  
  
  // Get all surveys (polls)
  app.get('/polls', (req, res) => {
    const query = 'SELECT * FROM polls';
    db.query(query, (err, result) => {
      if (err) {
        console.error('Error fetching polls:', err);
        return res.status(500).json({ message: 'Error fetching polls' });
      }
      res.status(200).json(result);
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
// Voting logic (record the vote)
// Route to handle voting
app.post('/polls/:id/vote', (req, res) => {
  const surveyId = req.params.id;  // Get the survey ID (poll ID)
  const { option, email } = req.body;  // Get the selected option and the user's email

  if (!email || !option) {
    return res.status(400).json({ message: 'Email and option are required.' });
  }

  // Retrieve the survey details (title, type, creator_email, data_fin)
  const surveyQuery = 'SELECT type, creator_email, data_fin FROM polls WHERE id = ?';
  db.query(surveyQuery, [surveyId], (err, surveyResult) => {
    if (err) {
      console.error('Error retrieving poll:', err);
      return res.status(500).json({ message: 'Error retrieving poll.' });
    }

    if (surveyResult.length === 0) {
      return res.status(404).json({ message: 'Poll not found.' });
    }

    const surveyType = surveyResult[0].type;
    const creatorEmail = surveyResult[0].creator_email;  // Poll creator's email
    const pollEndDate = new Date(surveyResult[0].data_fin);  // Poll end date

    // Check if the poll has expired (data_fin < current date)
    if (new Date() > pollEndDate) {
      return res.status(400).json({ message: 'The poll has ended. You can no longer vote.' });
    }

    // Check if the user is the creator of the poll
    if (email === creatorEmail) {
      return res.status(400).json({ message: 'You cannot vote in your own poll.' });
    }

    // Check if the user has already voted
    const checkVoteQuery = 'SELECT * FROM votes WHERE poll_id = ? AND email = ?';
    db.query(checkVoteQuery, [surveyId, email], (err, result) => {
      if (err) {
        console.error('Error checking previous votes:', err);
        return res.status(500).json({ message: 'Error checking previous votes.' });
      }

      // If the poll is of type "Vote", prevent the user from changing their vote
      if (surveyType === 'Vote' && result.length > 0) {
        return res.status(400).json({ message: 'You cannot change your vote for this poll.' });
      }

      // If the user has already voted in a "Survey" type poll, allow modification
      if (result.length > 0 && surveyType === 'Sondage') {
        // Update the existing vote
        const updateVoteQuery = 'UPDATE votes SET option = ? WHERE poll_id = ? AND email = ?';
        db.query(updateVoteQuery, [option, surveyId, email], (err, updateResult) => {
          if (err) {
            console.error('Error updating vote:', err);
            return res.status(500).json({ message: 'Error updating your vote.' });
          }

          res.status(200).json({ message: 'Vote updated successfully.' });
        });
      } else {
        // If the user has not voted yet, insert the new vote
        const insertVoteQuery = 'INSERT INTO votes (poll_id, option, email) VALUES (?, ?, ?)';
        db.query(insertVoteQuery, [surveyId, option, email], (err, insertResult) => {
          if (err) {
            console.error('Error recording vote:', err);
            return res.status(500).json({ message: 'Error recording your vote.' });
          }

          res.status(200).json({ message: 'Vote recorded successfully.' });
        });
      }
    });
  });
});



app.put('/polls/:id/vote', (req, res) => {
  const surveyId = req.params.id;  // Get the survey ID (poll ID)
  const { option, email } = req.body;  // Get the selected option and the user's email

  if (!email || !option) {
    return res.status(400).json({ message: 'Email and option are required' });
  }

  // Update the user's vote if it already exists
  const updateQuery = 'UPDATE votes SET option = ? WHERE poll_id = ? AND email = ?';
  db.query(updateQuery, [option, surveyId, email], (err, result) => {
    if (err) {
      console.error('Error updating vote:', err);
      return res.status(500).json({ message: 'Error updating your vote' });
    }

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: 'Vote updated successfully' });
    } else {
      return res.status(400).json({ message: 'No previous vote found to update' });
    }
  });
});

app.get('/polls/:id', (req, res) => {
  const pollId = req.params.id; // Extract the poll ID from the URL
  const query = 'SELECT * FROM polls WHERE id = ?';

  db.query(query, [pollId], (err, result) => {
    if (err) {
      console.error('Error fetching poll:', err);
      return res.status(500).json({ message: 'Error fetching poll' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    const poll = result[0];
    // Parse the options from JSON string if necessary
    poll.options = JSON.parse(poll.options);
    res.status(200).json(poll);
  });
});

// Route to get poll statistics (including percentages of each option)
app.get('/polls/:id/statistics', (req, res) => {
  const pollId = req.params.id;

  // Get the total number of votes for the poll
  const totalVotesQuery = 'SELECT COUNT(*) AS totalVotes FROM votes WHERE poll_id = ?';
  db.query(totalVotesQuery, [pollId], (err, totalResult) => {
    if (err) {
      console.error('Error retrieving total votes:', err);
      return res.status(500).json({ message: 'Error retrieving total votes.' });
    }

    const totalVotes = totalResult[0].totalVotes;

    // Get the vote count for each option
    const optionsVotesQuery = 'SELECT option, COUNT(*) AS voteCount FROM votes WHERE poll_id = ? GROUP BY option';
    db.query(optionsVotesQuery, [pollId], (err, optionsResult) => {
      if (err) {
        console.error('Error retrieving vote counts:', err);
        return res.status(500).json({ message: 'Error retrieving vote counts.' });
      }

      // Calculate the percentage for each option
      const pollStatistics = {};
      optionsResult.forEach(optionData => {
        const percentage = ((optionData.voteCount / totalVotes) * 100).toFixed(2);
        pollStatistics[optionData.option] = {
          voteCount: optionData.voteCount,
          percentage: percentage
        };
      });

      res.status(200).json(pollStatistics);
    });
  });
});

// Record a vote
// Record a vote for a specific poll option

app.options('*', cors());

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
