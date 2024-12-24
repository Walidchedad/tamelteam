var express = require('express');
var router = express.Router();
const AuthentificationController = require('../controllers/AuthentificationController');
const authMiddleware = require('../middleware/authMiddleware');

/* Register. */
router.get('/register',(req,res)=>{
  res.render('register')
})
router.post('/register', AuthentificationController.register);

//login
router.get('/login',(req,res)=>{
  res.render('login')
})
router.post('/login', AuthentificationController.login);

//logout
router.post('/logout', (req, res) => {
  res.clearCookie('jwt');  // Clear the JWT cookie
  res.redirect('/login');  // Redirect to the login page
});

//home page
router.get("/home", authMiddleware.isAuthenticated, (req, res) => {
  res.render("home", { user: req.user });
});




module.exports = router;
