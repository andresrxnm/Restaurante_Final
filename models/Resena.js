const pool = require('../config/database');

class Resena {
  // Obtener una reseña por ID (con username y restaurante)
  static async getById(id) {
    try {
      const [rows] = await pool.query(`
        SELECT r.id, r.comentario, r.calificacion, r.fecha_creacion,
               u.username AS usuario_nombre,
               rest.nombre AS restaurante_nombre
        FROM Resenas r
        JOIN Usuario u ON r.usuario_id = u.id
        JOIN Restaurantes rest ON r.restaurante_id = rest.id
        WHERE r.id = ?
      `, [id]);

      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Error al obtener la reseña:", error);
      throw error;
    }
  }

  // Buscar reseñas por comentario o nombre del restaurante
  static async searchByComentarioOrRestaurante(search) {
    try {
      const [rows] = await pool.query(`
        SELECT r.id, r.comentario, r.calificacion, r.fecha_creacion,
               u.username AS usuario_nombre,
               rest.nombre AS restaurante_nombre
        FROM Resenas r
        JOIN Usuario u ON r.usuario_id = u.id
        JOIN Restaurantes rest ON r.restaurante_id = rest.id
        WHERE r.comentario LIKE ? OR rest.nombre LIKE ?
        ORDER BY r.fecha_creacion DESC
      `, [`%${search}%`, `%${search}%`]);

      return rows;
    } catch (error) {
      console.error("Error al buscar reseñas:", error);
      throw error;
    }
  }

  // Obtener todas las reseñas
  static async getAll() {
    try {
      const [rows] = await pool.query(`
        SELECT r.id, r.comentario, r.calificacion, r.fecha_creacion,
               u.username AS usuario_nombre,
               rest.nombre AS restaurante_nombre
        FROM Resenas r
        JOIN Usuario u ON r.usuario_id = u.id
        JOIN Restaurantes rest ON r.restaurante_id = rest.id
        ORDER BY r.fecha_creacion DESC
      `);
      return rows;
    } catch (error) {
      console.error("Error al obtener todas las reseñas:", error);
      throw error;
    }
  }

  // Obtener todas las reseñas de un restaurante específico
  static async getAllByRestaurante(restaurante_id) {
    try {
      const [rows] = await pool.query(`
        SELECT r.id, r.comentario, r.calificacion, r.fecha_creacion,
               u.username AS usuario_nombre
        FROM Resenas r
        JOIN Usuario u ON r.usuario_id = u.id
        WHERE r.restaurante_id = ?
        ORDER BY r.fecha_creacion DESC
      `, [restaurante_id]);

      return rows;
    } catch (error) {
      console.error("Error al obtener las reseñas por restaurante:", error);
      throw error;
    }
  }

  // Obtener las mejores 3 reseñas de un restaurante
  static async getTopByRestaurante(restaurante_id, limit = 3) {
    try {
      const [rows] = await pool.query(`
        SELECT r.id, r.comentario, r.calificacion, r.fecha_creacion,
               u.username AS usuario_nombre
        FROM Resenas r
        JOIN Usuario u ON r.usuario_id = u.id
        WHERE r.restaurante_id = ?
        ORDER BY r.calificacion DESC, r.fecha_creacion DESC
        LIMIT ?
      `, [restaurante_id, limit]);

      return rows;
    } catch (error) {
      console.error("Error al obtener las reseñas top:", error);
      throw error;
    }
  }

  // Crear una nueva reseña
  static async create(data) {
    try {
      const { usuario_id, restaurante_id, calificacion, comentario, fecha_creacion } = data;
      const query = `
        INSERT INTO Resenas (usuario_id, restaurante_id, calificacion, comentario, fecha_creacion) 
        VALUES (?, ?, ?, ?, ?)
      `;
      const [result] = await pool.query(query, [usuario_id, restaurante_id, calificacion, comentario, fecha_creacion]);
      return result.insertId;
    } catch (error) {
      console.error("Error al crear la reseña:", error);
      throw error;
    }
  }

  // Actualizar una reseña
  static async update(id, data) {
    try {
      const { calificacion, comentario, fecha_creacion } = data;
      const query = `
        UPDATE Resenas 
        SET calificacion = ?, comentario = ?, fecha_creacion = ?
        WHERE id = ?
      `;
      const [result] = await pool.query(query, [calificacion, comentario, fecha_creacion, id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error al actualizar la reseña:", error);
      throw error;
    }
  }

  // Eliminar una reseña
  static async delete(id) {
    try {
      const query = 'DELETE FROM Resenas WHERE id = ?';
      const [result] = await pool.query(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error al eliminar la reseña:", error);
      throw error;
    }
  }
}

module.exports = Resena;
