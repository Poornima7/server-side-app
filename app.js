const express = require('express');
var exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//map global promise - get rid of warning

mongoose.promise = global.promise;

mongoose.connect('mongodb://localhost/videos', {
    useMongoClient: true
})
.then(() => console.log('Mongodb connected'))
.catch(err => console.log(err));

require('./models/Idea');
const Idea = mongoose.model('ideas');


// app to initiallize
const app = express();
const port = 5000;

//Handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


//middleware
app.use(function (req, res, next) {
    console.log('Time:', Date.now())
    next()
  })


//index routes
// app.get('/', (req,res) => {
//  res.send('bharathi');
// });


app.get('/', function (req, res) {
    res.render('home');
});

app.get('/about', (req,res)=>{
    res.render('about');
});

app.get('/ideas/add',(req,res) =>{
    res.render('ideas/add');
});

app.post('/ideas',(req,res) => {
    // console.log(req.body);
    // res.send('ok');

    let errors = [];
    if(!req.body.title){
        errors.push({text:'Please add a title'});
    }
    if(!req.body.details){
        errors.push({text:'Please add some details'});
    }

    if(errors.length > 0){
        res.render('ideas/add',{
            errors:errors,
            title:req.body.title,
            details: req.body.details
        });
    }else{
        res.send('passed');
    }
});
app.listen(port, () =>{
    console.log(`server started on port ${port}`);
});
