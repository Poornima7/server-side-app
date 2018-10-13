const express = require('express');

// app to initiallize
const app = express();
const port = 5000;

//index routes
app.get('/', (req,res) => {
 res.send('bharathi');
});

app.get('/about',(req,res)=>{
    res.send('About');
})



app.listen(port, () =>{
    console.log(`server started on port ${port}`);
});
