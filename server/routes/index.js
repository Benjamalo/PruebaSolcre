const express = require('express')
const router = express.Router()
const indexController = require('../controllers/indexController')


router.get('/api',indexController.listPerfil)
router.post('/api/login', indexController.login);

module.exports=router