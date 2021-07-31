var express = require('express');
var passport = require('passport');
var bcrypt = require('bcrypt')
var router = express.Router();
var jwt = require('jsonwebtoken');
var Users = require('../models/user');
var config = require('../config/config')
let Utils  = require('../utils/Utils')
const POINT_FOR_NEW_USER = 1000





router.get('/', function (req, res, next) {
    res.render('auth.ejs', {title: 'Express'});
});
router.get('/', function (req, res, next) {
    res.render('auth.ejs', {title: 'Express'});
});

router.get('/auth/loginSuccess', function (req, res, next) {
    res.render('login.ejs', {message: req.flash('loginMessage')});
});

router.get('/loginFailed', function (req, res, next) {
    res.json({result: 'Login failed'})
    //res.render('login.ejs', { message: req.flash('loginMessage') });
});

router.get('/loginSuccess', function (req, res, next) {
    //console.log('***   LoginSuccess callBack   headers ', req.headers)
    const payload = {
        sub: req.user._id
    };
    const token = jwt.sign(payload, config.jwtSecret);
    console.log('***   LoginSuccess callBack   user ', req.user)

    var resultObj = {
        userInfo: req.user,
        token: token
    }
    res.json({result: resultObj})
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/auth/loginSuccess',
    failureRedirect: '/auth/loginFailed',
    failureFlash: true,
}));

router.post('/loginWeb', function(req, res, next) {
    console.log(' ---------------   login2  -------------------   ')
    passport.authenticate('local-login', function(err, user) {
        console.log(' ---------------   login2  RES -------------------   ')
           if (!user) {
               res.json({errorMessage:'Tên đặng nhập hoặc mật khẩu không đúng'})
           } else {
               console.log(' loginWeb ===>   ',user)
               //res.json(user)
               const payload = {
                   sub: user._id
               };
               const token = jwt.sign(payload, config.jwtSecret);
               console.log('***   LoginSuccess callBack   user ', req.user)

               let resultObj = {
                   userInfo: user,
                   token: token
               }
               res.json({result: resultObj})
           }

        })(req, res);
})

router.post('/signupWeb', function (req, res, next) {
    console.log(' ---------------   signupWeb  -------------------   ')
    let userName = req.body.username
    let fullName = req.body.fullName
    console.log('**** Sign up userName ==>   ', userName, Utils.isUserNameError(userName))
    console.log('**** Sign up fullName ==>   ', fullName, Utils.isFullNameError(fullName))

    if (Utils.isUserNameError(userName) === true || Utils.isFullNameError(fullName) === true) {
        res.json({errorMessage: "Lỗi định dạng"});
    } else {
        Users.findOne({'local.fullName': req.body.fullName}, function (err, user) {
            if (err) {
                console.log('**** Sign Up err  ', err)
                res.json({errorMessage: "Lỗi"});
            }
            if (user) {
                res.json({errorMessage: "Tên bán hàng này đã được sử dụng"});
            } else {
                Users.findOne({'local.username': req.body.username}, function (err, user) {
                    if (user) {
                        res.json({errorMessage: "Tên này đã được sử dụng"});
                    } else {

                        if (req.body.username.length < 4) {
                            //return done(null, false, req.flash('signupMessage', 'Username must be longer than 4 characters'));
                            res.json({errorMessage: "Tên đăng nhập phải dài hơn 4 ký tự"});
                        } else if (req.body.password.length < 8) {
                            res.json({errorMessage: "Mật khẩu phải dài hơn 8 ký tự"});
                        } else {
                            let newUser = new Users();
                            newUser.local.username = req.body.username
                            newUser.local.fullName = req.body.fullName
                            newUser.local.phoneNumber = req.body.phoneNumber
                            newUser.local.point = POINT_FOR_NEW_USER
                            newUser.local.password = genHashPass(req.body.password);

                            //console.log('**** Sign Up newUser  ',newUser)
                            newUser.save(function (err) {
                                res.json({result: newUser})
                            });
                        }

                    }
                });
            }
        })
    }


})


router.get('/signupSuccess', function (req, res, next) {
    const payload = {
        sub: req.user._id
    };
    console.log('***   signup Success   user ', req.user)

    var resultObj = {
        success: true,
        message: "Register user has successfully",
        userInfo: req.user,
    }
    res.json({result: resultObj})
});

router.get('/signupFailed', function (req, res, next) {
    let msg = req.flash('signupMessage')[0]
    console.log('***   signup Success   user ', req.user)
    var resultObj = {
        success: false,
        message: msg,
        userInfo: null,
    }
    res.json({result: resultObj})
});


router.get('/signup', function (req, res) {
    res.render('signup.ejs', {message: req.flash('loginMessage')});
});

router.get('/profile', isLoggedIn, function (req, res) {
    res.render('profile.ejs', {user: req.user});
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/auth/signupSuccess',
    failureRedirect: '/auth/signupFailed',
    failureFlash: true,
}));



// ************    Test

// /* GET /todos listing. */
router.get('/users', function (req, res, next) {

    Users.find(function (err, news) {
        if (err) return next(err);
        res.json({result: news})


    });
});

router.post('/getUserDetail', (req, res, next) => {

    if (req.body.userId) {
        Users.findById(req.body.userId, (err, user) => {
            if (err) return next(err);
            let cloneUser = user
            cloneUser.local.password = null
            console.log('getUserDetail   ==>   ',cloneUser)

            res.json(cloneUser);

        });
    } else {
        Users.findOne({'local.fullName': req.body.fullName}, function (err, user) {
            if (err) return next(err);

            if (user) {
                let cloneUser = user
                cloneUser.local.password = null
                console.log('getUserDetail   ==>   ',cloneUser)
                res.json(cloneUser);
            } else {
                res.json('không có kết quả');
            }

        })
    }







});

/* allow to change phone number only */
router.post('/userDetail2', (req, res, next) => {

    Users.findById(req.body.userId, (err, user) => {
        if (err) return next(err);

        if (req.body.password === user.local.password) {

            let updatedInfo = user

            console.log('updatedInfo ==>  ', updatedInfo)

            if (req.body.phoneNumber !== "") {
                updatedInfo.local.phoneNumber = req.body.phoneNumber
            }
            updatedInfo.local.fullName = user.local.fullName
            updatedInfo.local.point = user.local.point
            Users.findByIdAndUpdate(user._id, updatedInfo, (err, newUser) => {
                if (err) {
                    console.log('***   Error ', err);
                    return next(err);
                }
                res.json(newUser);
            });

        } else {
            let errorJson = {
                "errorMessage": "Sai password"
            }
            res.status(401).json(errorJson);
        }

    });


});



// Change full name and path only
router.post('/userDetail', (req, res, next) => {
    Users.findById(req.body.userId, (err, user) => {
        if (err) return next(err);

        if (req.body.password === user.local.password) {
            if(req.body.fullName !== "") {
                Users.findOne({'local.fullName': req.body.fullName}, function (err, user) {
                    if (err) {
                        console.log('**** Sign Up err  ', err)
                        res.json({errorMessage: "Lỗi"});
                    }
                    if (user) {
                        res.json({
                            errorMessage: "Tên bán hàng này đã được sử dụng",
                            fullNameError:true,
                        });
                    }  else {
                        Users.findOne({'local.shopPath': req.body.shopPath}, function (err, user) {
                            if (err) {
                                res.json({errorMessage: "Lỗi"});
                            }
                            if (user) {
                                res.json({
                                    errorMessage: "Tên này đã được sử dụng",
                                    shopPathError: true
                                });
                            } else {
                                Users.findById(req.body.userId, (err, user) => {
                                    if (err) return next(err);
                                    let updatedInfo = user
                                    console.log('changeShopPath 111   ==>  ', updatedInfo,'  body.shopPath:  ',req.body.shopPath)
                                    if (req.body.shopPath !== "") {
                                        updatedInfo.local.shopPath = req.body.shopPath

                                    }
                                    updatedInfo.local.fullName = req.body.fullName
                                    Users.findByIdAndUpdate(user._id, updatedInfo, (err, newUser) => {
                                        if (err) {
                                            console.log('***   Error ', err);
                                            return next(err);
                                        }
                                        res.json(newUser);
                                    });

                                });
                            }
                        })
                    }
                })
            }
            else {
                Users.findOne({'local.shopPath': req.body.shopPath}, function (err, user) {
                    if (err) {
                        res.json({errorMessage: "Lỗi"});
                    }
                    if (user) {
                        res.json({
                            errorMessage: "Tên này đã được sử dụng",
                            shopPathError: true
                        });
                    } else {
                        Users.findById(req.body.userId, (err, user) => {
                            if (err) return next(err);
                            let updatedInfo = user
                            console.log('changeShopPath 222   ==>  ', updatedInfo,'  body.shopPath:  ',req.body.shopPath)
                            if (req.body.shopPath !== "") {
                                updatedInfo.local.shopPath = req.body.shopPath
                            }
                            Users.findByIdAndUpdate(user._id, updatedInfo, (err, newUser) => {
                                if (err) {
                                    console.log('***   Error ', err);
                                    return next(err);
                                }
                                res.json(newUser);
                            });

                        });
                    }
                })
            }

        } else {
            let errorJson = {
                "errorMessage": "Sai password"
            }
            res.status(401).json(errorJson);
        }

    });
});


router.post('/changePassword', (req, res, next) => {

    Users.findById(req.body.userId, (err, user) => {
        if (err) return next(err);

        if (req.body.password === user.local.password) {
            let updatedInfo = user
            console.log('updatedInfo ==>  ', updatedInfo)
            if (req.body.newPassword !== "") {
                updatedInfo.local.password = genHashPass(req.body.newPassword)//req.body.newPassword
            }


            Users.findByIdAndUpdate(user._id, updatedInfo, (err, newUser) => {

                if (err) {
                    console.log('***   Error ', err);
                    return next(err);
                }
                let newUpdatedUser =  newUser
                newUpdatedUser.local.password = updatedInfo.local.password
                res.json(newUpdatedUser);
            });

            //res.json(user);
        } else {
            let errorJson = {
                "errorMessage": "Sai password"
            }
            res.status(401).json(errorJson);
        }

    });


});

router.post('/changeShopPath', (req, res, next) => {

    Users.findOne({'local.shopPath': req.body.shopPath}, function (err, user) {
        if (err) {
            console.log('**** Sign Up err  ', err)
            res.json({errorMessage: "Lỗi"});
        }
        if (user) {
            res.json({errorMessage: "Tên này đã được sử dụng"});
        } else {
            Users.findById(req.body.userId, (err, user) => {
                if (err) return next(err);

                if (req.body.password === user.local.password) {

                    let updatedInfo = user

                    console.log('changeShopPath    ==>  ', updatedInfo,'  body.shopPath:  ',req.body.shopPath)

                    if (req.body.shopPath !== "") {
                        updatedInfo.local.shopPath = req.body.shopPath
                    }

                    Users.findByIdAndUpdate(user._id, updatedInfo, (err, newUser) => {
                        if (err) {
                            console.log('***   Error ', err);
                            return next(err);
                        }
                        res.json(newUser);
                    });

                } else {
                    let errorJson = {
                        "errorMessage": "Sai password"
                    }
                    res.status(401).json(errorJson);
                }

            });
        }
    })

});

router.delete('/users/:id', function (req, res, next) {
    Users.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

router.get('/updatePassByName/:username', function (req, res, next) {
    console.log('findUserByName param ==>   ', req.params.username)

    Users.findOne({'local.username': req.params.username}, function (err, user) {
        console.log('MERA  user  ==>  ', user)

        if (user) {
            let randomPass = genRandomPass(8)
            let hasPass = genHashPass(randomPass)

            let updateUser = {
                'local.password': hasPass
            }
            console.log('MERA  updateUser  ==>  ', updateUser, 'hasPass ==>  ', hasPass)
            Users.findByIdAndUpdate(user._id, updateUser, (err, updatedUser) => {
                if (err) {
                    console.log('***   Error ', err);
                    return next(err);
                }
                let newUser = {
                    newPass: randomPass,
                    updatedUser
                }
                console.log('MERA  newUser  ==>  ', newUser)
                res.json(newUser);
            });
        } else {
            res.json({errorMessage:'Tên đăng nhập không tồn tại '})
        }


        //res.json(user);

    })

});


router.get('/searchUser', function (req, res, next) {

    let page = parseInt(req.query.page);
    let size = parseInt(req.query.size);
    let skip = page > 0 ? ((page - 1) * size) : 0;


    let filterOpt = {'local.fullName': {$regex: req.query.fullName, $options: 'i'}}
    console.log('filterOpt   ===>   ', filterOpt)
    //productName
    Users
        .find(filterOpt)
        .skip(skip)
        .limit(size)
        //.select("-local.password",'-local.username','-local.point')
        .select(['-local.password','-local.username','-local.point'])
        .sort({createDate: -1})
        .exec((err, products) => {
            Users.countDocuments((err, count) => {
                console.log('All Page ==>  count ', count)
                if (err) return next(err);
                res.json({result: products
                    ,totalCount: count});
            });
        })
});




router.post('/followSeller', function (req, res, next) {
    let currentUserId = req.body.userId
    let followingId = req.body.followingId
    console.log('currentUserId: ',currentUserId, ' followingId:  ',followingId)

    Users.findById(currentUserId, (err, user) => {
        if (req.body.password === user.local.password) {
            if (err) return next(err);
            let updateUser = user

            console.log('followSeller   ',updateUser.followingSellers,'  ----  ', followingId)
            //updateUser.local.followingSellers = [followingId]
            if (updateUser.local.followingSellers === undefined) {
                console.log(' -------- CREATE -----------')
                updateUser.local.followingSellers = [followingId]
            } else {
                console.log(' -------- PUSH -----------',updateUser.local.followingSellers.includes(followingId))
                if (updateUser.local.followingSellers.includes(followingId) === false) {
                    updateUser.local.followingSellers.push(followingId)
                }

            }

            Users.findByIdAndUpdate(currentUserId, updateUser, (err, newUser) => {
                if (err) {
                    console.log('***   Error ', err);
                    return next(err);
                }
                let successOjc = {
                    success: true,
                    message:'Follow user thành công'
                }
                res.json(successOjc);
            });

        } else {
            let successOjc = {
                success: false,
                message:'Không có quyền'
            }
            res.json(successOjc);
        }

    });

});

router.post('/unFollowSeller', function (req, res, next) {
    let currentUserId = req.body.userId
    let followingId = req.body.followingId
    console.log('currentUserId: ',currentUserId, ' followingId:  ',followingId)

    Users.findById(currentUserId, (err, user) => {
        if (req.body.password === user.local.password) {
            if (err) return next(err);
            let updateUser = user

            console.log('followSeller   ',updateUser.followingSellers,'  ----  ', followingId)

            //updateUser.local.followingSellers = [followingId]
            if (updateUser.local.followingSellers !== undefined) {
                const index = updateUser.local.followingSellers.indexOf(followingId);
                if (index > -1) {
                    updateUser.local.followingSellers.splice(index, 1);
                }
            }

            Users.findByIdAndUpdate(currentUserId, updateUser, (err, newUser) => {
                if (err) {
                    console.log('***   Error ', err);
                    return next(err);
                }
                let successOjc = {
                    success: true,
                    message:'Follow user thành công'
                }
                res.json(successOjc);
            });

        } else {
            let successOjc = {
                success: false,
                message:'Không có quyền'
            }
            res.json(successOjc);
        }

    });

});

router.get('/getFollowingUser', function (req, res, next) {

    let followingIds = req.query.followingIds

    const ids = followingIds.split(",");
    console.log('findFollowingUser  ==>   ',followingIds,'ids ==>   ', ids)

    Users
        .find({ _id: { $in: ids } })
        .select(['-local.password','-local.followingSellers'])
        .exec((err, user) => {
            Users.countDocuments((err, count) => {
                if (err) {
                    let errorObj = {
                        success: false,
                        message:'Error '
                    }
                    res.json(errorObj);
                } else {
                    res.json(user);
                }

            });
        });


});
























function genRandomPass(length) {
    let result = '';
    let characters = 'ABCDEFGH0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function genHashPass(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}


module.exports = router;





