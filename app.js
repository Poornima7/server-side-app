const express = require('express');
var exphbs  = require('express-handlebars');
var methodOverride = require('method-override')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session')

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
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


//method override middleware
app.use(methodOverride('_method'));
//express-session
app.use(session({
    secret: 'bharathi',
    resave: true,
    saveUninitialized: true,
 }));
 //flash
 app.use(flash());

 //global variables for flash message

 app.use(function(req,res,next){
     res.locals.success = req.flash('success_msg');
     res.locals.error_msg = req.flash('error_msg');
     res.locals.error = req.flash('error');
     next();
 })


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

//add idea form
app.get('/ideas/add',(req,res) =>{
    res.render('ideas/add');
});

//Edit idea form
app.get('/ideas/edit/:id',(req,res) =>{
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        res.render('ideas/edit',{
           idea:idea 
           
        });
    }); 
});

//process form
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
        // res.send('passed');
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser)
          .save()
          .then(idea => {
            req.flash('success_msg', 'idea added');
              res.redirect('/ideas');
          })
    }
});

app.get('/ideas',(req,res)=>{
    Idea.find({})
    .sort({date:'desc'})
    .then(ideas =>{
        res.render('ideas/index',{
            ideas:ideas
        });
    })   
});

//Edit form process
app.put('/ideas/:id',(req,res) => {
Idea.findOne({
    _id: req.params.id
})
.then(idea =>{
    idea.title = req.body.title;
    idea.details = req.body.details;
    idea.save()
    .then(idea =>{
        req.flash('success_msg', 'idea updated');
      res.redirect('/ideas');
    })
});
});

app.delete('/ideas/:id',(req,res)=>{
   Idea.remove({_id:req.params.id})
   .then(() => {
       req.flash('success_msg', 'idea removed');
       res.redirect('/ideas');
   });
});

app.listen(port, () =>{
    console.log(`server started on port ${port}`);
});
