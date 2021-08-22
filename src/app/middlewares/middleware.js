const User = require('../models/user/UserManagementModel')
const Project = require('../models/user/projectID')
const { signedCookies } = require('cookie-parser')
const jwt = require('jsonwebtoken')

class Middlewares{
    signUpCheck(req, res, next){
        var nameCreate = req.body.Name
        var passwordCreate  = req.body.Password
        var phoneCreate = req.body.Phone
        var mailCreate = req.body.email
        User.findOne({phone: phoneCreate})
            .then(user => {
                if (!user) {
                    if(passwordCreate[0] === passwordCreate[1]){
                        req.email = mailCreate
                        req.username =  nameCreate
                        req.phone = phoneCreate
                        req.password = passwordCreate[0]
                        next()
                    }
                    else {
                        res.render('site/sign-up-form',{layout: false, message: ['Confirmed password does not match.']})
                    }
                }
                else {
                    res.render('site/sign-up-form',{layout: false, message: ['Phone is already used.']})
                }
            })
            .catch(err => {return})     
    }

    loginCheck(req, res, next) {
        var phone = req.body.Phone
        var password = req.body.Password
        User.findOne({phone: phone})
            .then(user => {
                if(!user){
                    res.render('site/login-form', {layout: false, message: ['Username does not exist.']})
                }
                else{
                    if(user.password === password){
                        req.role = user.role
                        req.userid = user._id
                        req.project_id = user.project_id
                        next()
                    }
                    else {
                        res.render('site/login-form', {layout: false, message: ['Wrong Password.'], valuePhone: phone})              
                    }
                }
            })
            .catch(err => {return})
    }

    loginCheckWinform(req, res, next) {
        var phone = req.body.phone
        var password = req.body.password
        User.findOne({phone: phone})
            .then(user => {
                if(!user){
                    res.json({
                        success: false,
                        message: "User does not exist.",
                        phone: false,
                    })
                }
                else{
                    if(user.password === password){
                        req.role = user.role
                        req.userid = user._id
                        req.project_id = user.project_id
                        next()
                    }
                    else {
                        res.json({
                            success: false,
                            message: "Wrong password",
                            phone: true,
                        })
                    }
                }
            })
            .catch(err => {return})
    }

    checkSignCookies(req, res, next) {
        var cookies = req.signedCookies.jwt
        if (!cookies) {
            res.redirect('/site/login-form')
        }
        else {
            try {
                var jwtPayload = jwt.verify(cookies, process.env.JWT_KEY)
                req.deviceId = jwtPayload.deviceId
                User.findOne({_id: jwtPayload.userId})
                .then(user => {
                    /* Code tam fix bug: cho admin pass khi k co deviceId */
                    if(user.role === 'admin') {
                        req.user = user
                        next()
                    }
                    else {
                        if(!jwtPayload.deviceId){
                            res.redirect('/site/login-form')
                        }
                        else {
                            req.user = user
                            next()
                        }
                    }      
                })
                .catch(err => console.log(err))
            }
            catch(err) {
                if(err.name == 'TokenExpiredError') {
                    res.redirect('/site/login-form')
                }
                else {
                    console.log(err)        
                    res.redirect('/site/login-form')
                }
            }
        }
    }

    findDeviceName(req,res,next){
        Project.findOne({_id: req.deviceId})
            .then(device => {
                req.deviceName = device.addressProject
                next()
            })
            .catch(err => console.log(err))
    }

    /* Manage Middleware */ 
    findAllUsers(req,res,next) {
        User.find() 
            .then((users) => {
                req.allUsers = users
                next()
            })
            .catch(next)
    }
    findAllProject(req,res,next) {
        Project.find() 
            .then((projects) => {
                req.allProjects = projects
                next()
            })
            .catch(next)
    }
    checkAdminPassword(req, res, next) {
        if(req.body.password === process.env.password) {
            next()
        }
        res.redirect('back')
    }

    /* req.body in controller is undefined */
    fixBugReqBody(req,res,next) {
        req.roleChange = req.body.role
        req.deviceIdChange = req.body.projectId
        next()
    }

}

module.exports = new Middlewares