const agregarAlCarrito = (req, res) => {
  const { menu_id, nombre, precio, cantidad } = req.body;

  // Validar datos básicos para evitar errores
  if (!menu_id || !nombre || !precio || !cantidad) {
    return res.status(400).send('Datos incompletos para agregar al carrito');
  }

  // Inicializar carrito si no existe
  if (!req.session.carrito) {
    req.session.carrito = [];
  }

  // Buscar producto existente (asegurando que menu_id sea número)
  const productoExistente = req.session.carrito.find(item => item.menu_id === parseInt(menu_id));

  if (productoExistente) {
    // Actualizar cantidad (sumar)
    productoExistente.cantidad += parseInt(cantidad);
  } else {
    // Agregar nuevo producto al carrito
    req.session.carrito.push({
      menu_id: parseInt(menu_id),
      nombre,
      precio: parseFloat(precio),
      cantidad: parseInt(cantidad)
    });
  }

  // Redirigir a la vista del carrito
  res.redirect('/carrito');
};

const verCarrito = (req, res) => {
  const carrito = req.session.carrito || [];
  res.render('vistausuario/carrito', { carrito });
};

const cancelarCarrito = (req, res) => {
  req.session.carrito = [];

  // Renderizar vista con mensaje de cancelación
  res.render('vistausuario/pedido_cancelado', {
    title: 'Pedido Cancelado'
  });
};

module.exports = {
  agregarAlCarrito,
  verCarrito,
  cancelarCarrito
};
