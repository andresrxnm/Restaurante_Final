const express = require('express');
const router = express.Router();

const indexController = require('../controllers/indexController');
const pedidoController = require('../controllers/pedidoController');

// Ruta principal
router.get('/', indexController.index);

// Vista general de usuario
router.get('/vistausuario', indexController.vistaUsuario);

// Mostrar menú por restaurante 
router.get('/vistausuario/menu/:id', indexController.menuPorRestaurante);

// Mostrar menús por categoría 
router.get('/vistausuario/categoria/:id', indexController.menusPorCategoria);

// Mostrar los pedidos del usuario
router.get('/mis-pedidos', pedidoController.mostrarPedidos);

// Mostrar todos los restaurantes sin filtro
router.get('/restaurantes', indexController.mostrarTodosRestaurantes);

// Ruta para búsqueda con filtro por nombre 
router.get('/buscar', indexController.buscar);

module.exports = router;
