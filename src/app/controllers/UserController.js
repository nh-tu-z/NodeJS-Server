const User = require('../models/user/UserManagementModel')
const Project = require('../models/user/projectID')
const PhaseSummary = require('../models/data/cabinSummary')
const PhaseOne = require('../models/data/cabinPhaseOne')
const PhaseTwo = require('../models/data/cabinPhaseTwo')
const PhaseThree = require('../models/data/cabinPhaseThree')
const {mongooseToObject} = require('../../tool/mongoose.js')
const {multipleMongooseToObject} = require('../../tool/mongoose.js')
const {arrayCabinDataToObject} = require('../../tool/func.js')
const func = require('../../tool/func')
const jwt = require('jsonwebtoken')

class UserController {
    //GET /user/dashboard
    showDashboard(req,res) {        
        res.render('./user/dashboard', {page: "Dashboard", deviceName: req.deviceName, user: mongooseToObject(req.user)})
    }

    //GET /user/datatables
    showDatatables(req,res) {
        var deviceId = req.deviceId
        var phase = req.query.phase
        var dataTable = []
        /* Pagination */
        var page = parseInt(req.query.page) || 1
        var iPerPage = 10
        var begin = (page - 1) * iPerPage
        var end = page * iPerPage

        /* Get Data */
        func.findDataById(deviceId, phase, (values) => {
            /* Total data */
            var totalData = values.length
            /* Max page */
            var maxPage 
            if(values.length%10) {
                maxPage = Math.floor(values.length/10) +1
            }
            else maxPage = values.length/10
            /* Paging */
            var valuesSplit = values.slice(begin,end)
            valuesSplit.forEach((value) =>{
                var data = value.samples
                /* Convert Date */
                data.page = page
                data.timeShow = func.date2String(data.timeStamp)
                dataTable.push(data)
            })
            var data = {
                page: "Data Tables", 
                user: mongooseToObject(req.user), 
                data: dataTable,
                phase: phase,
                maxPage: maxPage,
                phase: phase,
                totalData: totalData
            }
            res.render('./user/datatables', data)                          
        })
    }

    //GET /user/datatables/data
    showData(req,res) {
        var deviceId = req.deviceId
        var phase = req.query.phase
        var dataTable = []
        /* Pagination */
        var page = parseInt(req.query.page) || 1
        var iPerPage = 10
        var begin = (page - 1) * iPerPage
        var end = page * iPerPage

        /* Get Data */
        func.findDataById(deviceId, phase, (values) => {
            /* Max page */
            var maxPage 
            if(values.length%10) {
                maxPage = Math.floor(values.length/10) +1
            }
            else maxPage = values.length/10
            /* Paging */
            var valuesSplit = values.slice(begin,end)
            valuesSplit.forEach((value) =>{
                var data = value.samples
                /* Convert Date */
                data.page = page
                data.timeShow = func.date2String(data.timeStamp)
                dataTable.push(data)
            })
            // res.render('./user/datatables', data)    
            // console.log(dataTable)
            res.json(dataTable)                      
        })
    }

    //GET /user/report
    showReport(req,res) {
        res.render('./user/report', {page: "Report", user: mongooseToObject(req.user)})
    }

    //GET /user/maps
    showMaps(req,res) {
        res.render('./user/maps', {page: "Maps", user: mongooseToObject(req.user)})
    }

    //GET /user/accounts
    showAccounts(req,res) {
        res.render('./user/accounts', {page: "Account", user: mongooseToObject(req.user)})
    }

    //GET /user/manage
    showManage(req,res) {
        User.find()
            .then((users) => {
                res.render('./user/manage', {page: "Manage", user: mongooseToObject(req.user), dataUser: multipleMongooseToObject(users)})
            })
    }

    //POST /user/logout
    logOut(req,res) {
        res.clearCookie('jwt')
        res.redirect('/site/login-form')
    }

    //GET /user/show-user-info
    showInfoUser(req,res) {
        var phoneUser = req.body.phone 
        User.findOne({phone: phoneUser})
            .then((user) => {
                res.json(mongooseToObject(user))
            })
            .catch(err => console.log(err))
    }
}

module.exports = new UserController