const { validationResult } = require('express-validator');
const Categoria = require('../models/Categoria');

exports.listarCategorias = async (req, res) => {
  try {
    const search = req.query.search || '';

    let categorias;
    if (search.trim() !== '') {
      categorias = await Categoria.buscarPorNombre(search);
    } else {
      categorias = await Categoria.getAll();
    }

    res.render('categorias/index', {
      title: 'Categorías',
      categorias,
      search
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error al cargar las categorías.'
    });
  }
};

exports.create = (req, res) => {
  res.render('categorias/form', {
    title: 'Crear Categoría',
    categoria: {},
    errors: [],
    isEditing: false
  });
};

exports.store = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('categorias/form', {
      title: 'Crear Categoría',
      categoria: req.body,
      errors: errors.array(),
      isEditing: false
    });
  }

  try {
    await Categoria.create(req.body);
    res.redirect('/categorias');
  } catch (error) {
    console.error(error);
    res.render('categorias/form', {
      title: 'Crear Categoría',
      categoria: req.body,
      errors: [{ msg: 'Error al guardar la categoría.' }],
      isEditing: false
    });
  }
};

exports.edit = async (req, res) => {
  try {
    const categoria = await Categoria.getById(req.params.id);
    if (!categoria) {
      return res.status(404).render('error', { title: 'Error', message: 'Categoría no encontrada' });
    }
    res.render('categorias/form', {
      title: 'Editar Categoría',
      categoria,
      errors: [],
      isEditing: true
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al cargar la categoría' });
  }
};

exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('categorias/form', {
      title: 'Editar Categoría',
      categoria: { ...req.body, id: req.params.id },
      errors: errors.array(),
      isEditing: true
    });
  }

  try {
    const success = await Categoria.update(req.params.id, req.body);
    if (!success) {
      return res.status(404).render('error', { title: 'Error', message: 'Categoría no encontrada' });
    }
    res.redirect('/categorias');
  } catch (error) {
    console.error(error);
    res.render('categorias/form', {
      title: 'Editar Categoría',
      categoria: { ...req.body, id: req.params.id },
      errors: [{ msg: 'Error al actualizar la categoría.' }],
      isEditing: true
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const success = await Categoria.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
    }
    res.redirect('/categorias');
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al eliminar la categoría' });
  }
};

exports.verDetalle = async (req, res) => {
  try {
    const categoria = await Categoria.getById(req.params.id);
    if (!categoria) {
      return res.status(404).render('error', {
        title: 'Error',
        message: 'Categoría no encontrada'
      });
    }
    res.render('categorias/show', {
      title: `Detalle de ${categoria.nombre}`,
      categoria
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error al cargar la categoría'
    });
  }
};
