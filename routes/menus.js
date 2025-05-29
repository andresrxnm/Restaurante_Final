const express = require('express');
const { body } = require('express-validator');
const menuController = require('../controllers/MenuController');
const router = express.Router();

// Middleware de validación para menús
const validateMenu = [
  body('restaurante_id')
    .notEmpty().withMessage('El ID del restaurante es obligatorio')
    .isInt({ min: 1 }).withMessage('Debe ser un número entero positivo'),
  body('nombre_plato')   
    .notEmpty().withMessage('El nombre del plato es obligatorio')
    .isLength({ min: 2 }).withMessage('Debe tener al menos 2 caracteres'),
  body('descripcion')
    .optional({ checkFalsy: true })
    .isLength({ max: 500 }).withMessage('La descripción no debe exceder los 500 caracteres'),
  body('precio')
    .notEmpty().withMessage('El precio es obligatorio')
    .isDecimal({ decimal_digits: '0,2' }).withMessage('El precio debe ser un número con hasta 2 decimales')
];

// Rutas

router.get('/restaurante/:id', menuController.listarPorRestaurante);

router.get('/', menuController.index);               // Listar todos los menús
router.get('/create', menuController.create);        // Formulario para crear menú
router.post('/', validateMenu, menuController.store); // Guardar nuevo menú
router.get('/:id/edit', menuController.edit);        // Formulario edición menú
router.get('/:id', menuController.show);             // Mostrar detalle menú
router.put('/:id', validateMenu, menuController.update); // Actualizar menú
router.delete('/:id', menuController.delete);        // Eliminar menú 
module.exports = router;
