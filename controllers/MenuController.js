const { validationResult } = require('express-validator');
const Menu = require('../models/Menu');
const Categoria = require('../models/Categoria');
const Restaurante = require('../models/Restaurante'); 

exports.index = async (req, res) => {
  try {
    const search = req.query.search || '';
    let menus;

    if (search.trim() !== '') {
      menus = await Menu.search(search);
    } else {
      menus = await Menu.getAll();
    }

    res.render('menus/index', {
      title: 'Listado de menús',
      menus,
      search
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Hubo un error al cargar los menús.'
    });
  }
};

// Mostrar formulario para crear nuevo menú
exports.create = async (req, res) => {
  try {
    const categorias = await Categoria.getAll();
    const restaurantes = await Restaurante.getAll();
    res.render('menus/form', {
      title: 'Crear Menú',
      menu: {},
      categorias,
      restaurantes,
      errors: [],
      isEditing: false
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error al cargar las categorías o restaurantes.'
    });
  }
};

// Guardar nuevo menú
exports.store = async (req, res) => {
  const errors = validationResult(req);
  const categorias = await Categoria.getAll();
  const restaurantes = await Restaurante.getAll();

  if (!errors.isEmpty()) {
    return res.render('menus/form', {
      title: 'Crear Menú',
      menu: req.body,
      categorias,
      restaurantes,
      errors: errors.array(),
      isEditing: false
    });
  }

  try {
    await Menu.create(req.body);
    res.redirect('/menus');
  } catch (error) {
    console.error(error);
    res.render('menus/form', {
      title: 'Crear Menú',
      menu: req.body,
      categorias,
      restaurantes,
      errors: [{ msg: 'Error al guardar el menú. Verifica los datos ingresados.' }],
      isEditing: false
    });
  }
};


exports.edit = async (req, res) => {
  try {
    const menu = await Menu.getById(req.params.id);
    if (!menu) {
      return res.status(404).render('error', {
        title: 'Error',
        message: 'Menú no encontrado'
      });
    }
    const categorias = await Categoria.getAll();
    const restaurantes = await Restaurante.getAll();
    res.render('menus/form', {
      title: 'Editar Menú',
      menu,
      categorias,
      restaurantes,
      errors: [],
      isEditing: true
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error al cargar el menú.'
    });
  }
};


exports.update = async (req, res) => {
  const errors = validationResult(req);
  const categorias = await Categoria.getAll();
  const restaurantes = await Restaurante.getAll();

  if (!errors.isEmpty()) {
    return res.render('menus/form', {
      title: 'Editar Menú',
      menu: { ...req.body, id: req.params.id },
      categorias,
      restaurantes,
      errors: errors.array(),
      isEditing: true
    });
  }

  try {
    const success = await Menu.update(req.params.id, req.body);
    if (!success) {
      return res.status(404).render('error', {
        title: 'Error',
        message: 'Menú no encontrado'
      });
    }
    res.redirect('/menus');
  } catch (error) {
    console.error(error);
    res.render('menus/form', {
      title: 'Editar Menú',
      menu: { ...req.body, id: req.params.id },
      categorias,
      restaurantes,
      errors: [{ msg: 'Error al actualizar el menú. Intenta de nuevo.' }],
      isEditing: true
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const success = await Menu.delete(req.params.id);
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Menú no encontrado'
      });
    }
    res.redirect('/menus');
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el menú'
    });
  }
};


exports.show = async (req, res) => {
  try {
    const menu = await Menu.getById(req.params.id);
    if (!menu) {
      return res.status(404).render('error', {
        title: 'Error',
        message: 'Menú no encontrado'
      });
    }
    res.render('menus/show', {
      title: 'Detalle del Menú',
      menu
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error al cargar el menú.'
    });
  }
};


exports.listarPorRestaurante = async (req, res) => {
  try {
    const restauranteId = req.params.id;
    const soloDisponibles = req.query.disponibles === 'true';

    const menus = await Menu.getByRestauranteId(restauranteId, soloDisponibles);

    res.render('menus/index', {
      title: `Menús del restaurante ${restauranteId}`,
      menus,
      filtro: ''
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error al cargar los menús del restaurante.'
    });
  }
};
