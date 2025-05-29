// config/database.js

const mysql = require('mysql2/promise');
require('dotenv').config();

// Crear pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'apprestaurante',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Inicializar las tablas
async function initDb() {
  try {
    const connection = await pool.getConnection();

    // Tabla de Usuario
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Usuario (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(25) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(50) NOT NULL UNIQUE,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de Restaurantes
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Restaurantes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        tipo_cocina VARCHAR(100) NOT NULL,
        ubicacion VARCHAR(150),
        telefono VARCHAR(15),
        descripcion TEXT,
        fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de Categorías
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Categorias (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL UNIQUE
      )
    `);

    // Tabla de Menús
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Menus (
        id INT AUTO_INCREMENT PRIMARY KEY,
        restaurante_id INT NOT NULL,
        nombre_plato VARCHAR(100) NOT NULL,
        descripcion TEXT,
        precio DECIMAL(10,2),
        categoria_id INT,
        estado ENUM('disponible', 'agotado') DEFAULT 'disponible',
        FOREIGN KEY (restaurante_id) REFERENCES Restaurantes(id) ON DELETE CASCADE,
        FOREIGN KEY (categoria_id) REFERENCES Categorias(id) ON DELETE SET NULL
      )
    `);

    // Tabla de Reseñas
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Resenas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        restaurante_id INT NOT NULL,
        calificacion INT CHECK (calificacion BETWEEN 1 AND 5),
        comentario TEXT,
        fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES Usuario(id) ON DELETE CASCADE,
        FOREIGN KEY (restaurante_id) REFERENCES Restaurantes(id) ON DELETE CASCADE
      )
    `);

    // Tabla de Pedidos
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Pedidos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        metodo_pago VARCHAR(20) NOT NULL,
        direccion_entrega TEXT NOT NULL,
        fecha_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES Usuario(id) ON DELETE CASCADE
      )
    `);

    // Tabla DetallePedido
    await connection.query(`
      CREATE TABLE IF NOT EXISTS DetallePedido (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pedido_id INT NOT NULL,
        menu_id INT NOT NULL,
        cantidad INT NOT NULL,
        precio_unitario DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (pedido_id) REFERENCES Pedidos(id) ON DELETE CASCADE,
        FOREIGN KEY (menu_id) REFERENCES Menus(id) ON DELETE CASCADE
      )
    `);

    connection.release();
    console.log("Base de datos inicializada correctamente con todas las tablas.");
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
  }
}

// Ejecutar la inicialización
initDb();

module.exports = pool;
