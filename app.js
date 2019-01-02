//load modules
const express = require('express');

const exphbs = require('express-handlebars');

//connect to MongoURI exported from external file
const keys = require('./config/keys.js');

//user collection
const User = require('./models/user.js');

require('./passport/google-passport');

const mongoose = require('mongoose');

const passport = require('passport');

const session = require("express-session");

const bodyParser = require("body-parser");

const cookieParser = require('cookie-parser');


//initialize application
const app = express();

//express config
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//expreess-session called doubt how to use it, find it , learn it.
app.use(session({ 
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

//set global variable 
app.use((req,res,next)=>{
    res.locals.user = req.user || null;
    next();
})

//setup template engine
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//setup static files to serve css js & images.
app.use(express.static(__dirname + '/public'));

//set environment variable for port
const port = process.env.PORT || 3000 ;

//handle routes
app.get('/',(req,res)=>{
    res
        .render('home.handlebars');
});

app.get('/about',(req,res)=>{
    res
        .render('about.handlebars');
});

app.get('/profile',(req,res)=>{
    User.findById({_id:req.user._id})
    .then((user)=>{
        res
        .render('profile.handlebars',{user:user});
    })
   
});

//handle user logout
app.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/');
});

//google auth route
app.get('/auth/google',
  passport.authenticate('google',
   { scope: ['profile','email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/profile');
  });


// connect to remote database
mongoose.Promise = global.Promise;
mongoose.connect(keys.MongoURI,{useNewUrlParser:true})
.then(()=>{
    console.log('connected to remote DB.....');
})
.catch((err)=>{
    console.log(err);
})

app.listen(port,()=>{
    console.log(`listening at port ${port}`);
})