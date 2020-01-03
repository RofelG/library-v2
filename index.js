const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Configure Database URL
const MONGOURL = 'mongodb://localhost:27017/Authentication';

const app = express();

//Connect to Mongo Database
mongoose.connect(MONGOURL)
.then(() => console.log("DB Connected"))
.catch(error => console.log(error));

//Import Models
const { User } = require('./Model/user');

app.use(bodyParser.json()); //Converts data body to JSON format
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 4000;

app.post('/api/user/signup', (req, res) => {
    const user = new User({
        email: req.body.email,
        password: req.body.password
    }).save((err, response) => {
        if (err)
            res.status(400).send(err)
        else 
            res.status(200).send("Signed up")
    })
})

app.post('/api/user/signin', (req, res) => {
    //Checks that email is present or not
    User.findOne({'email' : req.body.email}, (err, user) => {
        if (!user) res.json({message: 'Login Failed, user not found'})
        // IF email is present then it will compare password
        else {
            user.comparePassword(req.body.password, (err, isMatch) => {
                if (err) throw err;
                if (!isMatch) return res.status(400).json({
                    message: 'Wrong Password'
                });
                res.status(200).send('Logged in Successfully')
            })
        }
    })
});



app.use("/", (req, res) => {
    res.sendFile(__dirname + "/public/signin.html");
});

app.listen(port, () => {
    console.log(`server running on ${port}`);
});