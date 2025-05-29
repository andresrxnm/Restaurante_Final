const express = require('express');
const { body } = require('express-validator');
const restauranteController = require('../controllers/RestauranteController');
const router = express.Router();

// Middleware de validación para restaurantes
const validateRestaurante = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('tipo_cocina')
    .notEmpty().withMessage('El tipo de cocina es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El tipo de cocina debe tener entre 2 y 100 caracteres'),
  body('ubicacion')
    .notEmpty().withMessage('La ubicación es obligatoria')
    .isLength({ min: 2, max: 100 }).withMessage('La ubicación debe tener entre 2 y 100 caracteres'),
  body('telefono')
    .notEmpty().withMessage('El teléfono es obligatorio'),
  body('descripcion')
    .notEmpty().withMessage('La descripción es obligatoria')
    .isLength({ min: 10 }).withMessage('La descripción debe tener al menos 10 caracteres')
];

// Rutas para restaurantes

// Listar todos los restaurantes
router.get('/', restauranteController.index);

// Mostrar formulario para crear nuevo restaurante
router.get('/create', restauranteController.create);

// Mostrar restaurantes destacados
router.get('/destacados', restauranteController.destacados);

// Mostrar otros restaurantes
router.get('/otros', restauranteController.otros);

// Guardar nuevo restaurante (con validación)
router.post('/', validateRestaurante, restauranteController.store);

// Mostrar detalle de un restaurante específico
router.get('/:id', restauranteController.show);

// Mostrar formulario para editar un restaurante
router.get('/:id/edit', restauranteController.edit);

// Actualizar restaurante (con validación)
router.put('/:id', validateRestaurante, restauranteController.update);

// Eliminar un restaurante
router.delete('/:id', restauranteController.delete);

module.exports = router;

