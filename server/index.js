const express = require('express');
const app = express();
const port = 5000;

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const {User} = require('./models/User');

const config = require('./config/key')

const cookieParser = require('cookie-parser');

const {auth} = require('./middleware/auth');

//application/x-wwww-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));
//application/json
app.use(bodyParser.json());
app.use(cookieParser());


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

app.post('/login', function(req,  res){

    // find email

    User.findOne({email: req.body.email}, (err, user)=>{


        if(!user){
            return res.json({
                longSuccess: false,
                message: "Not found"
            });

        }
        else{

             // password check

             user.comparePassword(req.body.password, (err, isMatch) => {
                if (!isMatch)
                    return res.json({ loginSuccess: false, message: "Wrong password" });
    
                user.generateToken((err, user) => {
                    if (err) return res.status(400).send(err);
                    res.cookie("w_authExp", user.tokenExp);
                    res
                        .cookie("w_auth", user.token)
                        .status(200)
                        .json({
                            loginSuccess: true, userId: user._id
                        });
                });
            });

        }

    });

});


app.get('/api/users/auth', auth, (req, res)=>{
    
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user_role === 0 ? false: true,
        isAuth : true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    });
});


app.get('/api/users/logout', auth, (req, res)=>{

    User.findByIdAndUpdate({_id:req.user._id}, {token:"", tokenExp:""}, (err, doc)=>{
        if(err) return res.json({success:false, err});
        return res.status(200).send({
            success:true
        });
    });
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
