//load modules
const express = require('express');

const exphbs = require('express-handlebars');

//connect to MongoURI exported from external file
const keys = require('./config/keys.js');

const mongoose = require('mongoose');

//initialize application
const app = express();

//setup template engine
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//setup static files to serve css js & images.
app.use(express.static(__dirname + '/public'))

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
})

// connect to remote database
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