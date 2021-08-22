const express = require('express')
const router = express.Router()
const siteController = require('../app/controllers/SiteController')
const middleware = require('../app/middlewares/middleware.js')

router.get('/login-form', siteController.showLogInForm)
router.post('/login-winform', middleware.loginCheckWinform, siteController.showWinFormProject)
router.post('/project-monitor', middleware.loginCheck, siteController.showLoginUI)
router.post('/project-monitor/:id/access', siteController.headUpDevice)    
router.get('/project-monitor/back', siteController.returnLoginForm)    
router.get('/sign-up-form', siteController.showSignUpForm)
router.post('/sign-up-form', middleware.signUpCheck, siteController.checkSignUpForm) 


module.exports = router