const pool = require('../config/database');

class Menu {
  static async getAll(onlyAvailable = false) {
    let sql = `
      SELECT 
        m.id, 
        m.nombre_plato AS nombre, 
        m.descripcion, 
        m.precio,
        m.estado,
        r.nombre AS restaurante_nombre,
        c.nombre AS categoria_nombre
      FROM menus m
      JOIN restaurantes r ON m.restaurante_id = r.id
      LEFT JOIN categorias c ON m.categoria_id = c.id
    `;
    if (onlyAvailable) {
      sql += ` WHERE m.estado = 'disponible' `;
    }
    sql += ` ORDER BY m.nombre_plato ASC;`; // Cambiado a orden ascendente por nombre

    const [rows] = await pool.query(sql);
    return rows;
  }

  static async search(buscar, onlyAvailable = false) {
    let sql = `
      SELECT 
        m.id, 
        m.nombre_plato AS nombre, 
        m.descripcion, 
        m.precio,
        m.estado,
        r.nombre AS restaurante_nombre,
        c.nombre AS categoria_nombre
      FROM menus m
      JOIN restaurantes r ON m.restaurante_id = r.id
      LEFT JOIN categorias c ON m.categoria_id = c.id
      WHERE (r.nombre LIKE ? OR m.nombre_plato LIKE ?)
    `;

    if (onlyAvailable) {
      sql += ` AND m.estado = 'disponible' `;
    }

    sql += ` ORDER BY m.nombre_plato ASC;`;  // Cambiado a orden ascendente por nombre

    const likeBuscar = `%${buscar}%`;
    const [rows] = await pool.query(sql, [likeBuscar, likeBuscar]);
    return rows;
  }

  static async getById(id) {
    const sql = `
      SELECT 
        m.id, 
        m.nombre_plato AS nombre, 
        m.descripcion, 
        m.precio,
        m.estado,
        r.nombre AS restaurante_nombre,
        c.nombre AS categoria_nombre,
        m.categoria_id,
        m.restaurante_id
      FROM menus m
      JOIN restaurantes r ON m.restaurante_id = r.id
      LEFT JOIN categorias c ON m.categoria_id = c.id
      WHERE m.id = ?
    `;
    const [rows] = await pool.query(sql, [id]);
    return rows[0] || null;
  }

static async getByRestauranteId(restauranteId, onlyAvailable = false) {
  let sql = `
    SELECT 
      m.id, 
      m.nombre_plato AS nombre,
      m.descripcion, 
      m.precio,
      m.estado,
      r.nombre AS restaurante_nombre,
      c.nombre AS categoria_nombre
    FROM menus m
    JOIN restaurantes r ON m.restaurante_id = r.id
    LEFT JOIN categorias c ON m.categoria_id = c.id
    WHERE m.restaurante_id = ?
  `;

  const params = [restauranteId];

  if (onlyAvailable) {
    sql += ` AND m.estado = ? `;
    params.push('disponible');
  }

  sql += ` ORDER BY m.nombre_plato ASC;`;

  const [rows] = await pool.query(sql, params);
  return rows;
}


  static async create(data) {
    const sql = `
      INSERT INTO menus (restaurante_id, nombre_plato, descripcion, precio, categoria_id, estado)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const { restaurante_id, nombre_plato, descripcion, precio, categoria_id, estado = 'disponible' } = data;
    const [result] = await pool.query(sql, [restaurante_id, nombre_plato, descripcion, precio, categoria_id, estado]);
    return result.insertId;
  }

  static async update(id, data) {
    const sql = `
      UPDATE menus
      SET restaurante_id = ?, nombre_plato = ?, descripcion = ?, precio = ?, categoria_id = ?, estado = ?
      WHERE id = ?
    `;
    const { restaurante_id, nombre_plato, descripcion, precio, categoria_id, estado } = data;
    const [result] = await pool.query(sql, [restaurante_id, nombre_plato, descripcion, precio, categoria_id, estado, id]);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const sql = `DELETE FROM menus WHERE id = ?`;
    const [result] = await pool.query(sql, [id]);
    return result.affectedRows > 0;
  }


static async getByCategoriaId(categoriaId, onlyAvailable = false) {
  let sql = `
    SELECT 
      m.id, 
      m.nombre_plato AS nombre, 
      m.descripcion, 
      m.precio,
      m.estado,
      m.restaurante_id,
      r.nombre AS restaurante_nombre,
      c.nombre AS categoria_nombre
    FROM menus m
    JOIN restaurantes r ON m.restaurante_id = r.id
    LEFT JOIN categorias c ON m.categoria_id = c.id
    WHERE m.categoria_id = ?
  `;

  if (onlyAvailable) {
    sql += ` AND m.estado = 'disponible' `;
  }

  sql += ` ORDER BY m.nombre_plato ASC;`;

  const [rows] = await pool.query(sql, [categoriaId]);
  return rows;
}




}



module.exports = Menu;
