const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const categoriaController = require('../controllers/categoriaController');

// Listar categorías
router.get('/', categoriaController.listarCategorias);

// Formulario crear categoría
router.get('/create', categoriaController.create);

// Guardar categoría
router.post(
  '/',
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  categoriaController.store
);

router.get('/:id', categoriaController.verDetalle);

// Formulario editar categoría
router.get('/:id/edit', categoriaController.edit);

// Actualizar categoría
router.put(
  '/:id',
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  categoriaController.update
);

// Eliminar categoría
router.delete('/:id', categoriaController.delete);

module.exports = router;
