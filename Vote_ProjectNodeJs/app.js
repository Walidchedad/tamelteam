const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors());

// Alternatively, if you want to restrict CORS to a specific origin
// app.use(cors({
//   origin: 'http://localhost:4200'  // Allow only this origin
// }));

// Middleware to parse JSON data
app.use(express.json());

// Sample endpoint for user sign up
app.post('/signup', (req, res) => {
  const { email, password, firstName, lastName, dob, gender } = req.body;
  console.log('Sign Up Data:', { email, password, firstName, lastName, dob, gender });
  
  // Here you would typically save the data in your database
  
  // Send a response back
  res.status(200).json({ message: 'Sign up successful' });
});

// Sample endpoint for login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Login Data:', { email, password });

  // Here you would validate the login credentials against the database
  
  // Send a response back
  res.status(200).json({ message: 'Login successful' });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
