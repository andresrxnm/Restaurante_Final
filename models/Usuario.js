const pool = require('../config/database');

class Usuario {

  static async getAll() {
    try {
      const [rows] = await pool.query(
        'SELECT id, username, email, password FROM Usuario'
      );
      return rows;
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      throw new Error('Error al obtener los usuarios');
    }
  }

  static async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM Usuario WHERE id = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      console.error(`Error al obtener usuario con ID ${id}:`, error);
      throw error;
    }
  }

  static async create(usuario) {
    try {
      const { username, email, password } = usuario;
      const [result] = await pool.query(
        'INSERT INTO Usuario (username, email, password) VALUES (?, ?, ?)',
        [username, email, password]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  }

  static async update(id, usuario) {
    try {
      const { username, email, password } = usuario;
      const [result] = await pool.query(
        'UPDATE Usuario SET username = ?, email = ?, password = ? WHERE id = ?',
        [username, email, password, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error al actualizar usuario con ID ${id}:`, error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM Usuario WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error al eliminar usuario con ID ${id}:`, error);
      throw error;
    }
  }

}

module.exports = Usuario;
