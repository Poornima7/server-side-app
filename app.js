const express = require('express');
var exphbs  = require('express-handlebars');

// app to initiallize
const app = express();
const port = 5000;

//Handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

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


app.listen(port, () =>{
    console.log(`server started on port ${port}`);
});
