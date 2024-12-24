const express = require('express');
const app = express();
const path = require('path');
const db = require('./config/db.js');
const rout = require('./routes/route')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');




app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set('view engine', 'hbs');
app.use(cookieParser());
app.use(rout);

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

app.listen(3000,()=>{
    console.log("http://localhost:3000/");
})