const pool = require('../config/database');

class Categoria {

  static async getAll() {
    const sql = `SELECT id, nombre FROM categorias ORDER BY id ASC`;
    const [rows] = await pool.query(sql);
    return rows; // [{id: 1, nombre: 'Pizza'}, {...}]
  }

  static async buscarPorNombre(nombre) {
    const sql = `SELECT id, nombre FROM categorias WHERE nombre LIKE ? ORDER BY id ASC`;
    const [rows] = await pool.query(sql, [`%${nombre}%`]);
    return rows;
  }

  static async getById(id) {
    const sql = `SELECT id, nombre FROM categorias WHERE id = ?`;
    const [rows] = await pool.query(sql, [id]);
    return rows[0] || null;
  }

  static async create(data) {
    const sql = `INSERT INTO categorias (nombre) VALUES (?)`;
    const { nombre } = data;
    const [result] = await pool.query(sql, [nombre]);
    return result.insertId;
  }

  static async update(id, data) {
    const sql = `UPDATE categorias SET nombre = ? WHERE id = ?`;
    const { nombre } = data;
    const [result] = await pool.query(sql, [nombre, id]);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const sql = `DELETE FROM categorias WHERE id = ?`;
    const [result] = await pool.query(sql, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Categoria;
