const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const User = require('./models/User')
const imageDownloader = require('image-downloader')
const multer = require('multer')
const fs = require('fs')
const Place = require('./models/Place')
const Booking = require('./models/Booking')
require('dotenv').config()
const app = express()

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'se32765834758cretkey';

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));


mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

app.get('/test', (req, res) => {
    res.json('Hello From Express')
})


app.post('/register', async(req, res) => {
    const { name, email, password } = req.body;
    try{
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt)
        });
        res.json(userDoc);
    }catch(e){
        res.status(422).json(e);
    }
});

app.post('/login', async(req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({email});
    if(userDoc){
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if(passOk){
            jwt.sign({email: userDoc.email, id: userDoc._id}, jwtSecret, {}, (err, token)=> {
                if(err) throw err;
                res.cookie('token', token).json(userDoc);
            })
        }else{
            res.status(422).json('Wrong password');
        }
    }else{
        res.json('User not found');
    }
})

function getUserDataFromToken(req) {
    return new Promise((resolve, reject) => {     
        jwt.verify(req.cookies.token, jwtSecret, {}, async(err, userData) => {
            if(err) throw err;
            resolve(userData);
        })
    })
}


app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if(token){
        jwt.verify(token, jwtSecret, {}, async(err, userData) => {
            if(err) throw err;
            const {name,email,_id} = await User.findById(userData.id);
            res.json({name,email,_id});
        })
    }else{
        res.json(null);
    }
})


app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true);
})



app.post('/upload-by-link', async(req, res) => {
    const { link } = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
        url: link,
        dest: __dirname + '/uploads/' + newName
    })
    res.json(newName);
})


const photosMiddleware = multer({dest: 'uploads/'});
app.post('/upload',photosMiddleware.array('photos', 100), async (req, res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const {path,originalname,mimetype} = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace('uploads\\', ''));
    }
    res.json(uploadedFiles);
});

app.post('/places', (req, res) => {
    const {token} = req.cookies;
    if(token){
        jwt.verify(token, jwtSecret, {}, async(err, userData) => {
            if(err) throw err;
            const {title,address,addedPhotos,description,perks,extraInfo,checkIn,checkOut,maxGuests,price} = req.body;
            const placeDoc = await Place.create({
                owner: userData.id,
                title,
                address,
                photos:addedPhotos,
                description,
                perks,
                extraInfo,
                checkIn,
                checkOut,
                maxGuests,
                price
            })
            res.json(placeDoc);
        })
    }else{
        res.json(null);
    }
})

app.get('/user-places', async(req, res) => {
    const {token} = req.cookies;
    if(token){
        jwt.verify(token, jwtSecret, {}, async(err, userData) => {
            if(err) throw err;
            const data = await Place.find({owner: userData.id});
            res.json(data);
        })
    }else{
        res.json(null);
    }
})

app.get('/places/:id', async (req, res) => {
    const {id} = req.params;
    res.json(await Place.findById(id));
})

app.put('/places', async (req, res) => {
    const {token} = req.cookies;
    const {id, title,address,addedPhotos,description,perks,extraInfo,checkIn,checkOut,maxGuests,price} = req.body;
    if (token){
        jwt.verify(token, jwtSecret, {}, async(err, userData) => {
            if(err) throw err;
            const placeDoc = await Place.findById(id);
            if (userData.id == placeDoc.owner.toString()){
                placeDoc.set({
                    title,address,addedPhotos,description,perks,extraInfo,checkIn,checkOut,maxGuests, price
                })
                await placeDoc.save()
                res.json(placeDoc);
            }
        })
    }
})

app.get('/places', async (req, res) => {
    res.json(await Place.find({}))
})

app.post('/bookings', async (req, res) => {
    const userData = await getUserDataFromToken(req);
    const {place, checkIn, checkOut, numberOfGuests, name, phone, price} = req.body;
    await Booking.create({
        place, checkIn, checkOut, numberOfGuests, name, phone, price,
        user: userData.id
    }).then((booking) => {
        res.json(booking)
    }).catch((err) => {
        throw err;
    })
});


app.get('/bookings', async (req, res) => {
    const userData = await getUserDataFromToken(req);
    res.json(await Booking.find({user: userData.id}).populate('place'));
});



app.listen(4000, () => console.log('Server started on port 4000'))

