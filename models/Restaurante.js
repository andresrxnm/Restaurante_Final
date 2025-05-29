const pool = require('../config/database');

class Restaurante {
  static async getAll() {
    try {
      const sql = `
        SELECT 
          r.id,
          r.nombre,
          r.tipo_cocina,
          r.ubicacion,
          r.telefono,
          r.descripcion,
          DATE_FORMAT(r.fecha_registro, '%Y-%m-%d %H:%i:%s') AS fecha_registro,
          IFNULL(AVG(res.calificacion), 0) AS calificacion_promedio,
          COUNT(res.id) AS total_resenas
        FROM restaurantes r
        LEFT JOIN resenas res ON r.id = res.restaurante_id
        GROUP BY r.id
        ORDER BY r.nombre
      `;
      const [rows] = await pool.query(sql);
      return rows;
    } catch (error) {
      console.error("Error al obtener los restaurantes:", error);
      throw error;
    }
  }

  static async buscarPorNombre(nombre) {
    try {
      const sql = `
        SELECT 
          r.id,
          r.nombre,
          r.tipo_cocina,
          r.ubicacion,
          r.telefono,
          r.descripcion,
          DATE_FORMAT(r.fecha_registro, '%Y-%m-%d %H:%i:%s') AS fecha_registro,
          IFNULL(AVG(res.calificacion), 0) AS calificacion_promedio,
          COUNT(res.id) AS total_resenas
        FROM restaurantes r
        LEFT JOIN resenas res ON r.id = res.restaurante_id
        WHERE r.nombre LIKE ?
        GROUP BY r.id
        ORDER BY r.nombre
      `;
      const [rows] = await pool.query(sql, [`%${nombre}%`]);
      return rows;
    } catch (error) {
      console.error("Error al buscar restaurante por nombre:", error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const sql = `
        SELECT 
          r.id,
          r.nombre,
          r.tipo_cocina,
          r.ubicacion,
          r.telefono,
          r.descripcion,
          DATE_FORMAT(r.fecha_registro, '%Y-%m-%d %H:%i:%s') AS fecha_registro,
          IFNULL(ROUND(AVG(res.calificacion), 1), 0) AS calificacion_promedio,
          COUNT(res.id) AS total_resenas
        FROM restaurantes r
        LEFT JOIN resenas res ON r.id = res.restaurante_id
        WHERE r.id = ?
        GROUP BY r.id
      `;
      const [rows] = await pool.query(sql, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error("Error al obtener el restaurante:", error);
      throw error;
    }
  }

  static async create(data) {
    try {
      const { nombre, tipo_cocina, ubicacion, telefono, descripcion } = data;
      const query = `
        INSERT INTO restaurantes (nombre, tipo_cocina, ubicacion, telefono, descripcion) 
        VALUES (?, ?, ?, ?, ?)
      `;
      const [result] = await pool.query(query, [nombre, tipo_cocina, ubicacion, telefono, descripcion]);
      return result.insertId;
    } catch (error) {
      console.error("Error al crear el restaurante:", error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const { nombre, tipo_cocina, ubicacion, telefono, descripcion } = data;
      const query = `
        UPDATE restaurantes 
        SET nombre = ?, tipo_cocina = ?, ubicacion = ?, telefono = ?, descripcion = ?
        WHERE id = ?
      `;
      const [result] = await pool.query(query, [nombre, tipo_cocina, ubicacion, telefono, descripcion, id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error al actualizar el restaurante:", error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const query = 'DELETE FROM restaurantes WHERE id = ?';
      const [result] = await pool.query(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error al eliminar el restaurante:", error);
      throw error;
    }
  }

  static async filtrarRestaurantes(filtros) {
    let query = `
      SELECT 
        r.*,
        ROUND(IFNULL(AVG(res.calificacion), 0), 1) AS calificacion_promedio,
        MIN(m.precio) AS precio_minimo
      FROM restaurantes r
      LEFT JOIN resenas res ON r.id = res.restaurante_id
      LEFT JOIN menus m ON r.id = m.restaurante_id
      WHERE 1=1
    `;
    const params = [];

    if (filtros.tipoCocina) {
      query += ' AND r.tipo_cocina = ?';
      params.push(filtros.tipoCocina);
    }

    if (filtros.ubicacion) {
      query += ' AND r.ubicacion = ?';
      params.push(filtros.ubicacion);
    }

    if (filtros.precio) {
      query += ' AND m.precio <= ?';
      params.push(filtros.precio);
    }

    query += ' GROUP BY r.id';

    if (filtros.calificacion) {
      query += ' HAVING calificacion_promedio >= ?';
      params.push(filtros.calificacion);
    }

    try {
      const [rows] = await pool.query(query, params);
      return rows;
    } catch (error) {
      console.error("Error al filtrar restaurantes:", error);
      throw error;
    }
  }

  static async obtenerFiltrosUnicos() {
    try {
      const [tipos] = await pool.query('SELECT DISTINCT tipo_cocina FROM restaurantes');
      const [ubicaciones] = await pool.query('SELECT DISTINCT ubicacion FROM restaurantes WHERE ubicacion IS NOT NULL');
      return {
        tiposCocina: tipos.map(row => row.tipo_cocina),
        ubicaciones: ubicaciones.map(row => row.ubicacion)
      };
    } catch (error) {
      console.error("Error al obtener filtros únicos:", error);
      throw error;
    }
  }

  static async getDestacados(minResenas = 1, limit = 5) {
    try {
      const sql = `
        SELECT 
          r.id, 
          r.nombre, 
          r.tipo_cocina, 
          r.ubicacion, 
          r.telefono,
          r.descripcion,
          DATE_FORMAT(r.fecha_registro, '%Y-%m-%d %H:%i:%s') AS fecha_registro,
          IFNULL(AVG(res.calificacion), 0) AS calificacion_promedio,
          COUNT(res.id) AS total_resenas
        FROM restaurantes r
        LEFT JOIN resenas res ON r.id = res.restaurante_id
        GROUP BY r.id
        HAVING total_resenas >= ?
        ORDER BY calificacion_promedio DESC
        LIMIT ?;
      `;
      const [restaurantes] = await pool.query(sql, [minResenas, limit]);
      return restaurantes;
    } catch (error) {
      console.error("Error al obtener restaurantes destacados:", error);
      throw error;
    }
  }

  static async getOtrosRestaurantes(limit = 5) {
    try {
      const sql = `
        SELECT 
          r.id, 
          r.nombre, 
          r.tipo_cocina, 
          r.ubicacion, 
          r.telefono,
          r.descripcion,
          DATE_FORMAT(r.fecha_registro, '%Y-%m-%d %H:%i:%s') AS fecha_registro,
          IFNULL(AVG(res.calificacion), 0) AS calificacion_promedio,
          COUNT(res.id) AS total_resenas
        FROM restaurantes r
        LEFT JOIN resenas res ON r.id = res.restaurante_id
        GROUP BY r.id
        ORDER BY calificacion_promedio DESC
        LIMIT ?;
      `;
      const [rows] = await pool.query(sql, [limit]);
      return rows;
    } catch (error) {
      console.error("Error al obtener otros restaurantes:", error);
      throw error;
    }
  }
}

module.exports = Restaurante;
