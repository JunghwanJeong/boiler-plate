const express = require('express');
const app = express();
const port = 5000;

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://jhjeong:Jung09150!@cluster0-vrqyk.mongodb.net/test?retryWrites=true&w=majority',
    {
        useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex: true, useFindAndModify: false
    }
).then(() => console.log("MonogDB conncted....")).catch(err => console.log(err));






app.get('/', (req, res) => res.send("Hello World!"));
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
