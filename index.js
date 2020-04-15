const express = require('express');
const app = express();
const port = 5000;

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const {User} = require('./models/User');

const config = require('./config/key')

//application/x-wwww-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));
//application/json
app.use(bodyParser.json());


mongoose.connect(config.mongoURI,
    {
        useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex: true, useFindAndModify: false
    }
).then(() => console.log("MonogDB conncted....")).catch(err => console.log(err));


app.get('/', (req, res) => res.send("Hello World!"));

app.post('/register', (req, res) => {

    const user = new User(req.body);

    user.save((err, userInfo)=>{
        if(err) return res.json({success: false, err});
        return res.status(200).json({
            success: true
        });
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
