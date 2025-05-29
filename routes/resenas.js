const express = require('express');
const { body } = require('express-validator');
const resenaController = require('../controllers/ResenaController');
const router = express.Router();

// Middleware de validación para reseñas
const validateResena = [
  body('usuario_id')
    .notEmpty().withMessage('El ID del usuario es obligatorio')
    .isInt({ min: 1 }).withMessage('El ID del usuario debe ser un número entero positivo'),
  body('restaurante_id')
    .notEmpty().withMessage('El ID del restaurante es obligatorio')
    .isInt({ min: 1 }).withMessage('El ID del restaurante debe ser un número entero positivo'),
  body('calificacion')
    .notEmpty().withMessage('La calificación es obligatoria')
    .isInt({ min: 1, max: 5 }).withMessage('La calificación debe estar entre 1 y 5'),
  body('comentario')
    .notEmpty().withMessage('El comentario es obligatorio')
    .isLength({ min: 5 }).withMessage('El comentario debe tener al menos 5 caracteres')
];

// Rutas para reseñas
router.get('/', resenaController.index);  // Listar todas las reseñas
router.get('/create', resenaController.create);  // Mostrar formulario para crear reseña
router.post('/', validateResena, resenaController.store);  // Guardar reseña
router.get('/:id', resenaController.show);  // Mostrar detalle de una reseña
router.get('/:id/edit', resenaController.edit);  // Mostrar formulario para editar reseña
router.put('/:id', validateResena, resenaController.update);  // Actualizar reseña
router.delete('/:id', resenaController.delete);  // Eliminar reseña

module.exports = router;
