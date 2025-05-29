const pool = require('../config/database');

const PedidoModel = {
  crearPedido: async (usuario_id, total, metodo_pago, direccion) => {
    const [result] = await pool.query(
      'INSERT INTO Pedidos (usuario_id, total, metodo_pago, direccion_entrega) VALUES (?, ?, ?, ?)',
      [usuario_id, total, metodo_pago, direccion]
    );
    return result.insertId;
  },

  agregarDetallePedido: async (pedido_id, menu_id, cantidad, precio_unitario) => {
    await pool.query(
      'INSERT INTO DetallePedido (pedido_id, menu_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
      [pedido_id, menu_id, cantidad, precio_unitario]
    );
  },

  obtenerPedidosPorUsuario: async (usuario_id) => {
    const [pedidos] = await pool.query(
      'SELECT * FROM Pedidos WHERE usuario_id = ? ORDER BY fecha_pedido DESC',
      [usuario_id]
    );

    for (const pedido of pedidos) {
      const [detalles] = await pool.query(
        `SELECT 
           dp.cantidad, 
           dp.precio_unitario, 
           m.nombre_plato AS plato_nombre,
           r.nombre AS nombre_restaurante
         FROM DetallePedido dp
         JOIN Menus m ON dp.menu_id = m.id
         JOIN Restaurantes r ON m.restaurante_id = r.id
         WHERE dp.pedido_id = ?`,
        [pedido.id]
      );
      pedido.detalles = detalles;
    }

    return pedidos;
  }
};

module.exports = PedidoModel;
