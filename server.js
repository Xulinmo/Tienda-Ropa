require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde public
app.use(express.static(path.join(__dirname, 'public')));
app.use('/CSS', express.static(path.join(__dirname, 'CSS')));
app.use('/JS', express.static(path.join(__dirname, 'JS')));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false,
});

async function query(text, params) {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ===== AUTH ENDPOINTS =====

// Registro de usuario
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  
  try {
    // Verificar si el email ya existe
    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    
    // Insertar nuevo usuario (sin encriptar password por simplicidad)
    const result = await query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, password]
    );
    
    res.status(201).json({ 
      message: 'Usuario registrado',
      user: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Login de usuario
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }
  
  try {
    const result = await query(
      'SELECT id, name, email FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }
    
    res.json({ 
      message: 'Login exitoso',
      user: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// ===== PRODUCT ENDPOINTS =====

// Obtener productos
app.get('/api/products', async (req, res) => {
  try {
    const result = await query('SELECT * FROM products ORDER BY id LIMIT 100');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Obtener producto por id
app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

// Obtener favoritos de un usuario: /api/favorites?user_id=1
app.get('/api/favorites', async (req, res) => {
  const userId = req.query.user_id;
  if (!userId) return res.status(400).json({ error: 'Falta user_id' });
  try {
    const result = await query(
      `SELECT p.* FROM favorites f JOIN products p ON f.product_id = p.id WHERE f.user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener favoritos' });
  }
});

// Obtener carrito de un usuario: /api/cart?user_id=1
app.get('/api/cart', async (req, res) => {
  const userId = req.query.user_id;
  if (!userId) return res.status(400).json({ error: 'Falta user_id' });
  try {
    const result = await query(
      `SELECT c.id as cart_id, p.*, c.quantity FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener carrito' });
  }
});

// Agregar item al carrito (body: { user_id, product_id, quantity })
app.post('/api/cart', async (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  
  console.log('POST /api/cart - Datos recibidos:', { user_id, product_id, quantity });
  
  if (!user_id || !product_id || !quantity) {
    console.log('Faltan campos requeridos');
    return res.status(400).json({ error: 'Faltan campos requeridos: user_id, product_id, quantity' });
  }
  
  try {
    // Verificar que el producto existe
    const productCheck = await query('SELECT id FROM products WHERE id = $1', [product_id]);
    if (productCheck.rows.length === 0) {
      console.log('Producto no encontrado:', product_id);
      return res.status(404).json({ error: `Producto con ID ${product_id} no existe` });
    }
    
    // Si ya existe, actualizar cantidad
    const existing = await query('SELECT id, quantity FROM cart WHERE user_id=$1 AND product_id=$2', [user_id, product_id]);
    if (existing.rows.length > 0) {
      const newQty = existing.rows[0].quantity + quantity;
      await query('UPDATE cart SET quantity=$1 WHERE id=$2', [newQty, existing.rows[0].id]);
      console.log('Cantidad actualizada:', { cart_id: existing.rows[0].id, new_quantity: newQty });
      return res.json({ message: 'Cantidad actualizada', quantity: newQty });
    }
    
    const result = await query('INSERT INTO cart (user_id, product_id, quantity) VALUES ($1,$2,$3) RETURNING *', [user_id, product_id, quantity]);
    console.log('Item agregado al carrito:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error en POST /api/cart:', err);
    res.status(500).json({ error: 'Error al agregar al carrito: ' + err.message });
  }
});

// Eliminar item del carrito
app.delete('/api/cart/:cart_id', async (req, res) => {
  const { cart_id } = req.params;
  try {
    await query('DELETE FROM cart WHERE id = $1', [cart_id]);
    res.json({ message: 'Item eliminado del carrito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar del carrito' });
  }
});

// Actualizar cantidad de un item en el carrito
app.put('/api/cart/:cart_id', async (req, res) => {
  const { cart_id } = req.params;
  const { quantity } = req.body;
  if (!quantity || quantity < 1) return res.status(400).json({ error: 'Cantidad inválida' });
  try {
    await query('UPDATE cart SET quantity = $1 WHERE id = $2', [quantity, cart_id]);
    res.json({ message: 'Cantidad actualizada', quantity });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar cantidad' });
  }
});

// Vaciar carrito completo de un usuario
app.delete('/api/cart/user/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    await query('DELETE FROM cart WHERE user_id = $1', [user_id]);
    res.json({ message: 'Carrito vaciado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al vaciar carrito' });
  }
});

// Procesar compra y descontar stock
app.post('/api/purchase', async (req, res) => {
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ error: 'user_id requerido' });
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Obtener items del carrito con info del producto
    const cartItems = await client.query(
      `SELECT c.id, c.product_id, c.quantity, p.title, p.price, p.stock 
       FROM cart c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = $1`,
      [user_id]
    );
    
    if (cartItems.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Carrito vacío' });
    }
    
    // Verificar stock y descontar
    const items = [];
    for (const item of cartItems.rows) {
      if (item.stock < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({ 
          error: `Stock insuficiente para ${item.title}. Disponible: ${item.stock}` 
        });
      }
      
      // Descontar stock
      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
      
      items.push({
        product_id: item.product_id,
        title: item.title,
        price: parseFloat(item.price),
        quantity: item.quantity,
        subtotal: parseFloat(item.price) * item.quantity
      });
    }
    
    // Vaciar carrito
    await client.query('DELETE FROM cart WHERE user_id = $1', [user_id]);
    
    await client.query('COMMIT');
    
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    
    res.json({ 
      message: 'Compra procesada exitosamente',
      items,
      total
    });
    
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Error al procesar compra' });
  } finally {
    client.release();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
