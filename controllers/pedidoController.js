const PedidoModel = require('../models/pedidoModel');

const finalizarPedido = async (req, res) => {
  const carrito = req.session.carrito || [];
  const usuario = res.locals.usuario;

  if (!usuario) {
    return res.status(401).send('Debes iniciar sesión para realizar un pedido.');
  }

  const { metodo_pago, direccion } = req.body;

  if (carrito.length === 0) {
    return res.send('El carrito está vacío.');
  }

  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  // Obtiene restauranteId del primer producto del carrito
  const restauranteId = carrito[0].restaurante_id;

  try {
    const pedidoId = await PedidoModel.crearPedido(usuario.id, total, metodo_pago, direccion);

    for (const item of carrito) {
      await PedidoModel.agregarDetallePedido(pedidoId, item.menu_id, item.cantidad, item.precio);
    }

    // Vaciar carrito después del pedido
    req.session.carrito = [];

    res.render('vistausuario/pedido_exitoso', {
      title: 'Pedido exitoso',
      total,
      metodo_pago,
      direccion,
      restauranteId //  Se envía a la vista
    });
  } catch (error) {
    console.error('Error al guardar el pedido:', error);
    res.status(500).send('Error al procesar el pedido.');
  }
};

const mostrarPedidos = async (req, res) => {
  const usuario = res.locals.usuario;

  if (!usuario) {
    return res.redirect('/login');
  }

  try {
    const pedidos = await PedidoModel.obtenerPedidosPorUsuario(usuario.id);

    // Convertir total y precios a números
    pedidos.forEach(pedido => {
      pedido.total = parseFloat(pedido.total);

      if (pedido.detalles && pedido.detalles.length > 0) {
        pedido.detalles.forEach(detalle => {
          detalle.precio_unitario = parseFloat(detalle.precio_unitario);
        });
      }
    });

    res.render('vistausuario/mis_pedidos', {
      title: 'Mis pedidos',
      pedidos
    });
  } catch (error) {
    console.error('Error al cargar pedidos:', error);
    res.status(500).send('Error al cargar tus pedidos.');
  }
};

module.exports = {
  finalizarPedido,
  mostrarPedidos
};
