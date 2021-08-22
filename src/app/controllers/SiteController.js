const User = require('../models/user/UserManagementModel')
const Project = require('../models/user/projectID')
const func = require('../../tool/func')
const {mongooseToObject} = require('../../tool/mongoose.js')
const {multipleMongooseToObject} = require('../../tool/mongoose.js')

const jwt = require('jsonwebtoken')

class SiteController {
    //[GET] /site/login-form
    showLogInForm(req,res) {
        res.render('site/login-form', {layout: false})
    }
    
    //[GET] /site/sign-up-form
    showSignUpForm(req,res) {
        res.render('site/sign-up-form', {layout: false})
    }

    //[POST] /site/project-monitor
    showLoginUI(req,res,next) {
        // Check admin
        if(req.role === 'admin')
        {
            /* JWT TOKEN */
            var jwToken = jwt.sign({
                userId : req.userid,
                expires: '1h'
            },
            process.env.JWT_KEY,
            {
                expiresIn: '1h'
            })
            /* Set Cookie */
            res.cookie('jwt', jwToken,{
                signed: true,
                httpOnly: true
            })
            res.redirect('/user/manage')
        }
        else {
            var project_id = req.project_id
            var userDevice = []
            var count = 0
            if(!project_id.length) {
                res.render('site/device-monitor', 
                                {
                                    layout: false, 
                                })
            }
            else {
                for (var id of project_id) {    
                    func.findDeviceById(id, (err, data) => {
                        userDevice.push(mongooseToObject(data))
                        count++
                        if(count === project_id.length) {
                            /* JWT TOKEN */
                            var jwToken = jwt.sign({
                                userId : req.userid,
                                expires: '1h'
                            },
                            process.env.JWT_KEY,
                            {
                                expiresIn: '1h'
                            })
                            /* Set Cookie */
                            res.cookie('jwt', jwToken,{
                                signed: true,
                                httpOnly: true
                            })
                            res.render('site/device-monitor', 
                                {
                                    layout: false, 
                                    userDevice: userDevice,
                                })
                            
                        }
                    })
                    
                }
            }        
        }         
    }

    //[POST] /site/login-winform
    showWinFormProject(req,res,next) {
        // Check admin
        if(req.role === 'admin')
        {
            /* JWT TOKEN */
            var jwToken = jwt.sign({
                userId : req.userid,
                expires: '1h'
            },
            process.env.JWT_KEY,
            {
                expiresIn: '1h'
            })
            /* Set Cookie */
            res.cookie('jwt', jwToken,{
                signed: true,
                httpOnly: true
            })
            res.json({
                success: true,
                message: "User Login Success",
                phone: true,
                token: jwToken
            })
        }
        else {
            var project_id = req.project_id
            var userDevice = []
            var count = 0
            if(!project_id.length) {
                res.json({
                    
                })
            }
            else {
                for (var id of project_id) {    
                    func.findDeviceById(id, (err, data) => {
                        userDevice.push(mongooseToObject(data))
                        count++
                        if(count === project_id.length) {
                            /* JWT TOKEN */
                            var jwToken = jwt.sign({
                                userId : req.userid,
                                expires: '1h'
                            },
                            process.env.JWT_KEY,
                            {
                                expiresIn: '1h'
                            })
                            /* Set Cookie */
                            res.cookie('jwt', jwToken,{
                                signed: true,
                                httpOnly: true
                            })
                            User.findOne({_id: req.userid})
                                .then((user)=> {
                                    res.json({
                                        success: true,
                                        message: "User Login Success",
                                        phone: true,
                                        token: jwToken,
                                        devices: userDevice,
                                        username: user.username,
                                        role: user.role,
                                        phone: req.body.phone
                                    })
                                })       
                        }
                    })
                    
                }
            }        
        }         
    }

    //[POST] /site/sign-up-form
    checkSignUpForm(req,res,next) {
        const user = new User({
            email: req.email,
            username: req.username, 
            phone: req.phone, 
            password: req.password,
        })
        user.save()
            .then(() => res.redirect('/site/login-form'))
            .catch()

    }

    //[POST] /project-monitor/:id/access
    headUpDevice(req,res,next) {
        /* Get User Id From Previous JWT */
        var pre_jwt = jwt.verify(req.signedCookies.jwt, process.env.JWT_KEY)

        /* JWT TOKEN */
        var jwToken = jwt.sign({
            userId : pre_jwt.userId,
            deviceId : req.params.id,
            expires: '1h'
        },
        process.env.JWT_KEY,
        {
            expiresIn: '1h'
        })

        /* Set cookie */ 
        res.cookie('jwt', jwToken,{
            signed: true,
            httpOnly: true
        })
        res.redirect('/user/datatables?phase=1')
    }

    //GET /site/project-monitor/back
    returnLoginForm(req,res) {
        res.clearCookie('jwt')
        res.redirect('/site/login-form')
    }
}

module.exports = new SiteController