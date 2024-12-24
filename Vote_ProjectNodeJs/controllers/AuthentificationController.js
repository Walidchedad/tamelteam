const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  // Validate input fields
  if (!username || !email || !password) {
    return res.render('register', { message: 'All fields are required' });
  }

  // Check if the email already exists in the database
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.render('register', { message: 'An error occurred. Please try again.' });
    }

    if (result.length > 0) {
      return res.render('register', { message: 'The email already exists.' });
    }

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 8);

      // Insert the new user into the database
      db.query(
        'INSERT INTO users SET ?',
        { username: username, email: email, password: hashedPassword },
        (err, result) => {
          if (err) {
            console.error('Error inserting user:', err);
            return res.render('register', { message: 'An error occurred. Please try again.' });
          }

          res.render('register', { message: 'User registered successfully!' });
        }
      );
    } catch (error) {
      console.error('Error hashing password:', error);
      res.render('register', { message: 'An error occurred. Please try again.' });
    }
  });
};


exports.login = (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    db.query('select * from users where email = ?',[email],async (err,result)=>{
        if(err){
            console.error('Database error:', err);
            return res.render('login', { message: 'An error occurred. Please try again.' });
        }
        if(result.length === 0){
            return res.render('login', { message: 'Email or password incorrect.'});
        }
        const user = result[0];
        const isMatch = await bcrypt.compare(password,user.password);

        if (!isMatch) {
            return res.render("login", { message: "Email or password is incorrect" });
          }

        const token = jwt.sign({id:user.id},"your_secret_key",{expiresIn:'1h'});
        res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 });

        res.redirect("/home");
    })
}

