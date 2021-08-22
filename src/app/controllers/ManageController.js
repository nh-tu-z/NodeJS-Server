const Project =  require('../models/user/projectID')
const User = require('../models/user/UserManagementModel')
const crypto = require('crypto')

const func = require('../../tool/func')
const {mongooseToObject} = require('../../tool/mongoose.js')
const {multipleMongooseToObject} = require('../../tool/mongoose.js')
const { stat } = require('fs')

class ManageController {
    //GET /user/manage
    showManage(req,res) {
        var allUsers = req.allUsers
        var allProjects = req.allProjects
        res.render('./user/management/manage', 
            {
                page: "Manage", 
                user: mongooseToObject(req.user), 
                dataUser: multipleMongooseToObject(allUsers),
                dataProject: multipleMongooseToObject(allProjects)
            })      
    }

    //POST /user/manage/:id/edit - sua lai route
    editUser(req,res) {
        var allUsers = req.allUsers
        var userId = req.params.id
        var userForEdit = allUsers.find((user, index) => {
            return userId == user._id
        })
        res.render('./user/management/manage', 
            {
                page: "Manage", user: mongooseToObject(req.user), 
                dataUser: multipleMongooseToObject(allUsers), 
                userForEdit: mongooseToObject(userForEdit)
            })
    }

    //POST /user/manage/project/create
    createProject(req,res) {
        const newProject = new Project({
            nameProject: req.body.nameProject,
            addressProject: req.body.addProject,
            activeProject: func.checkStateProject(req.body.stateProject),
            tokenProject: crypto.randomBytes(16).toString('hex')
        })
        newProject.save()
            .then(() => {
                res.redirect('back')
            })
            .catch(err => {
                res.redirect('/user/manage')
            })
    }

    //DELETE /user/manage/:id/project/delete
    permanentDeleteProject(req,res,next) {
        Project.deleteOne({_id: req.params.id})
            .then(() => {
                res.redirect('back')
            })
            .catch(next)
    }

    //PATCH /user/manage/:id/project/change
    changeStateProject(req, res, next) {
        var state = func.checkStateProject(req.body.state)
        Project.updateOne({_id: req.params.id}, {activeProject: state})
            .then((echo) => {
                res.redirect('back')
            })
            .catch(err => console.log(err))
    }

    //DELETE /user/manage/:id/user/delete
    permanentDeleteUser(req,res,next) {
        User.deleteOne({_id: req.params.id})
            .then(() => {
                res.redirect('back')
            })
            .catch(next)
    }

    //PUT /user/manage/:id/user/change
    changeUser(req, res, next) {
        User.updateOne({_id: req.params.id}, {project_id: req.deviceIdChange, role: req.roleChange})
            .then(echo => {
                res.redirect('back')
            })
            .catch(err => console.log(err))
    }
}

module.exports = new ManageController