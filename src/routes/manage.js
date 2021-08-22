const express = require('express')
const router = express.Router()
const manageController = require('../app/controllers/ManageController')
const middleware = require('../app/middlewares/middleware.js')

router.post('/:id/edit', middleware.findAllUsers, manageController.editUser)
router.delete('/:id/project/delete', middleware.checkAdminPassword, manageController.permanentDeleteProject)
router.delete('/:id/user/delete', middleware.checkAdminPassword, manageController.permanentDeleteUser)
router.put('/:id/user/change', middleware.fixBugReqBody, manageController.changeUser)
router.patch('/:id/project/change', manageController.changeStateProject)
router.post('/project/create', manageController.createProject)
router.get('/', middleware.findAllUsers, middleware.findAllProject, manageController.showManage)

module.exports = router