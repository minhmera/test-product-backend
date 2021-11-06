const express = require('express');
const router = express.Router();
const ShoppingCart = require('../models/shopping_cart');
const jwt = require('jsonwebtoken');
var config = require('../config/config')


router.post('/createCart', (req, res, next) => {
    console.log('**** POST  Categories   ', req.body);
    ShoppingCart.create(req.body, (err, post) => {
        //if (err) return next(err);
        if (err) {

            console.log('Error occurred while Create Category...\n', err);
            return next(err);
        }
        console.log('****   post Categories  ', post);
        res.json(post);
    });
});

/* GET /todos listing. */
router.get('/getAll', (req, res, next) => {
    // eslint-disable-next-line array-callback-return


    // decode the token using a secret key-phrase
    const token = req.headers.authorization

    const decodedToken = jwt.verify(token,config.jwtSecret);
    const userId = decodedToken.userId;
    console.log(' userId ==>  ',userId)
    console.log('Token ==>  ',token)

    ShoppingCart.find((err, categories) => {
        if (err) return next(err);
        console.log('***** Get categories length ', categories.length);
        res.json({ result: categories });

    }).sort({ order: 1 });


    // return jwt.verify(token, config.jwtSecret, (err, decoded) => {
    //     // the 401 code is for unauthorized status
    //     //console.log("**** Shopping cart  getAll   token    ==>  ", token)
    //     if (err) {
    //         return res.status(401).end();
    //     }
    //
    //
    //     const userId = decoded.sub;
    //
    //     console.log('**** **** Shopping cart  getAll   token  decode the token  ',userId)
    //     // check if a user exists
    //     ShoppingCart.find((err, categories) => {
    //         if (err) return next(err);
    //         console.log('***** Get categories length ', categories.length);
    //         res.json({ result: categories });
    //
    //     }).sort({ order: 1 });
    //
    // });



});


module.exports = router;
