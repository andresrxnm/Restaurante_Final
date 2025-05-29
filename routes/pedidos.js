const express = require('express');
const router = express.Router();
const PedidoController = require('../controllers/pedidoController');

// Ruta para mostrar los pedidos del usuario
router.get('/', PedidoController.mostrarPedidos);

module.exports = router;