const express = require('express')
const router = express.Router()
const userController = require('../app/controllers/UserController')
const middleware = require('../app/middlewares/middleware.js')
const alarmRouter = require('./alarm')
const manageRouter = require('./manage')

router.use('/alarms', middleware.checkSignCookies, alarmRouter)
router.get('/dashboard', middleware.checkSignCookies, middleware.findDeviceName, userController.showDashboard)
router.get('/datatables', middleware.checkSignCookies, userController.showDatatables)
router.get('/datatables/data', middleware.checkSignCookies, userController.showData)
router.get('/maps', middleware.checkSignCookies, userController.showMaps)
router.get('/report', middleware.checkSignCookies, userController.showReport)
router.get('/accounts', middleware.checkSignCookies, userController.showAccounts)
router.use('/manage', middleware.checkSignCookies, manageRouter)
router.get('/logout', middleware.checkSignCookies, userController.logOut)
router.post('/show-user-info', userController.showInfoUser)


module.exports = router