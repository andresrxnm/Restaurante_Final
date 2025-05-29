const express = require('express');
const { body } = require('express-validator');
const usuarioController = require('../controllers/UsuarioController');
const router = express.Router();

// Validación para creación (password obligatorio)
const validateUsuarioCreate = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('apellido')
    .notEmpty().withMessage('El apellido es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El apellido debe tener entre 2 y 100 caracteres'),
  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe ingresar un email válido'),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 4, max: 20 }).withMessage('La contraseña debe tener entre 4 y 20 caracteres'),
];

// Validación para actualización (password opcional)
const validateUsuarioUpdate = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('apellido')
    .notEmpty().withMessage('El apellido es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El apellido debe tener entre 2 y 100 caracteres'),
  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe ingresar un email válido'),
  body('password')
    .optional({ checkFalsy: true })  // <-- esto hace que sea opcional y si está vacío no da error
    .isLength({ min: 4, max: 20 }).withMessage('La contraseña debe tener entre 4 y 20 caracteres'),
];

router.get('/', usuarioController.index);
router.get('/create', usuarioController.create);
router.post('/', validateUsuarioCreate, usuarioController.store);
router.get('/:id', usuarioController.show);
router.get('/:id/edit', usuarioController.edit);
router.put('/:id', validateUsuarioUpdate, usuarioController.update);
router.delete('/:id', usuarioController.delete);

module.exports = router;
