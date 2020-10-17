const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/config');


/**
 *  The Auth Checker middleware function.
 */

module.exports = (req, res, next) => {
    console.log('****  middleware  req  ', req.headers.authorization, "   Method  ",req.method)

    if(req.method == "GET"){
        return next();
    }

    if (req.headers.authorization == undefined) {
        return res.status(401).end();
    }

    // get the last part from a authorization header string like "bearer token-value"
    //const token = req.headers.authorization.split(' ')[1];
    const token = req.headers.authorization

    // decode the token using a secret key-phrase
    return jwt.verify(token, config.jwtSecret, (err, decoded) => {
        // the 401 code is for unauthorized status
        console.log("token   ==>  ", token)
        if (err) {
            return res.status(401).end();
        }


        const userId = decoded.sub;

        console.log('**** decode the token  ', decoded,userId)
        // check if a user exists
        return User.findById(userId, (userErr, user) => {
            if (userErr || !user) {
                console.log('----------- userErr  ----------------  ', userErr)
                return res.status(401).end();
            }
            console.log('============ user okei  ============ ', userErr)
            return next();
        });
    });
};


/*
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization

        const decodedToken = jwt.verify(token);
        const userId = decodedToken.userId;
        console.log(' userId ==>  ',userId)
        console.log('Token ==>  ',token)
        // if (req.body.userId && req.body.userId !== userId) {
        //    // throw 'Invalid user ID';
        //     res.status(402).json({
        //         error: new Error('Invalid user ID')
        //     });
        // } else {
        //     next();
        // }

    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};
*/
