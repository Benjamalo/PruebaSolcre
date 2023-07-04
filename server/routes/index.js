const express = require('express')
const router = express.Router()
const indexController = require('../controllers/indexController')


router.get('/api',indexController.listPerfil)
router.post('/api/login', indexController.login);
router.post('/registrarVoto', indexController.verificarVoto);
router.get('/votos', indexController.obtenerNumeroVotos);
router.get('/votos/:idEntidadPostulante', indexController.obtenerDetalleVoto);

module.exports=router