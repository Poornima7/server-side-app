const express = require('express');

// app to initiallize
const app = express();
const port = 5000;

app.listen(port, () =>{
    console.log(`server started on port ${port}`);
});
