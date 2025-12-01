-- Script completo para crear la base de datos y tablas
-- Ejecutar este script desde pgAdmin o psql

-- Paso 1: Crear la base de datos (ejecutar en la BD postgres o template1)
-- CREATE DATABASE tienda_db;

-- Paso 2: Conectar a tienda_db y ejecutar el resto:
-- \c tienda_db

-- Crear tablas
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  category TEXT,
  stock INTEGER DEFAULT 20
);

CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cart (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  added_at TIMESTAMP DEFAULT now()
);

-- Usuario de prueba
INSERT INTO users (name, email) VALUES
('Usuario Demo', 'demo@tienda.com')
ON CONFLICT (email) DO NOTHING;

-- Productos de ejemplo
INSERT INTO products (title, description, price, image_url, category) VALUES
('Camiseta Básica Blanca', 'Camiseta 100% algodón, talla M', 12.50, '/images/camiseta-blanca.jpg', 'hombre'),
('Camiseta Básica Negra', 'Camiseta 100% algodón, talla M', 12.50, '/images/camiseta-negra.jpg', 'hombre'),
('Jeans Slim Fit', 'Vaqueros azules ajustados', 39.90, '/images/jeans.jpg', 'hombre'),
('Vestido Verano', 'Vestido ligero y cómodo', 29.90, '/images/vestido.jpg', 'mujer'),
('Blusa Floral', 'Blusa con estampado de flores', 24.50, '/images/blusa.jpg', 'mujer'),
('Zapatillas Deportivas', 'Zapatillas para running', 59.99, '/images/zapatillas.jpg', 'calzado'),
('Botas de Cuero', 'Botas elegantes para invierno', 89.99, '/images/botas.jpg', 'calzado'),
('Reloj Clásico', 'Reloj analógico con correa de cuero', 149.99, '/images/reloj.jpg', 'accesorios'),
('Gafas de Sol', 'Gafas con protección UV', 34.50, '/images/gafas.jpg', 'accesorios'),
('Bolso de Mano', 'Bolso elegante de piel sintética', 45.00, '/images/bolso.jpg', 'accesorios')
ON CONFLICT DO NOTHING;
