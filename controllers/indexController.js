const Restaurante = require('../models/Restaurante');
const Menu = require('../models/Menu');
const Categoria = require('../models/Categoria'); 


exports.index = async (req, res) => {
  try {
    const destacados = await Restaurante.getDestacados(1, 5);
    const categorias = await Categoria.getAll();
    
    res.render('vistausuario/index', { destacados, categorias });
  } catch (error) {
    console.error('Error al cargar la página principal:', error);
    res.status(500).send('Error al cargar la página principal');
  }
};


exports.vistaUsuario = async (req, res) => {
  try {
    const restaurantes = await Restaurante.getAll();
    const destacados = await Restaurante.getDestacados(1, 5);
    const categorias = await Categoria.getAll();
    
    res.render('vistausuario/index', { restaurantes, destacados, categorias });
  } catch (error) {
    console.error('Error en vistaUsuario:', error);
    res.status(500).send('Error en vistaUsuario');
  }
};


exports.menuPorRestaurante = async (req, res) => {
  
  try {
    const restauranteId = req.params.id;
    const restaurante = await Restaurante.getById(restauranteId);
    if (!restaurante) {
      console.warn('Restaurante no encontrado con id:', restauranteId);
      return res.status(404).send('Restaurante no encontrado');
    }

    const menus = await Menu.getByRestauranteId(restauranteId);

 

    res.render('vistausuario/restauranteDetalle', { restaurante, menus });
  } catch (error) {
    console.error('Error al cargar el menú del restaurante:', error);
    res.status(500).send('Error al cargar el menú del restaurante');
  }
};

exports.buscar = async (req, res) => {
  try {
    const termino = req.query.search || '';
    if (!termino.trim()) {
      // Si el término está vacío, mostrar todos los restaurantes
      const restaurantes = await Restaurante.getAll();
      return res.render('vistausuario/busqueda', { restaurantes, search: '' });
    }
    const restaurantes = await Restaurante.buscarPorNombre(termino);
    res.render('vistausuario/busqueda', { restaurantes, search: termino });
  } catch (error) {
    console.error('Error en búsqueda:', error);
    res.status(500).send('Error al realizar la búsqueda');
  }
};


exports.mostrarTodosRestaurantes = async (req, res) => {
  try {
    const restaurantes = await Restaurante.getAll();
    res.render('vistausuario/busqueda', { restaurantes, search: '' });
  } catch (error) {
    console.error('Error al cargar todos los restaurantes:', error);
    res.status(500).send('Error al cargar los restaurantes');
  }
};


exports.menusPorCategoria = async (req, res) => {
  try {
    const categoriaId = req.params.id;
    const categoria = await Categoria.getById(categoriaId);
    if (!categoria) {
      return res.status(404).send('Categoría no encontrada');
    }
    const menus = await Menu.getByCategoriaId(categoriaId);

    res.render('vistausuario/menusPorCategoria', { categoria, menus });
  } catch (error) {
    console.error('Error al cargar menús por categoría:', error);
    res.status(500).send('Error al cargar menús por categoría');
  }
};
