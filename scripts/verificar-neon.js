// Script para verificar conexión a Neon PostgreSQL
require('dotenv').config();
const { Pool } = require('pg');

async function verificarConexion() {
  console.log('🔍 Verificando conexión a la base de datos...\n');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL no está configurado en .env');
    console.log('\n📝 Pasos:');
    console.log('1. Copia .env.example a .env');
    console.log('2. Agrega tu DATABASE_URL de Neon');
    process.exit(1);
  }
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Probar conexión
    const client = await pool.connect();
    console.log('✅ Conexión exitosa a la base de datos\n');
    
    // Verificar tablas
    console.log('📊 Verificando estructura de base de datos:\n');
    
    const tablas = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    if (tablas.rows.length === 0) {
      console.log('⚠️  No se encontraron tablas. Debes ejecutar db/setup.sql primero.\n');
    } else {
      console.log('Tablas encontradas:');
      tablas.rows.forEach(row => {
        console.log(`  ✓ ${row.table_name}`);
      });
      console.log('');
    }
    
    // Verificar datos
    console.log('📦 Verificando datos:\n');
    
    const productos = await client.query('SELECT COUNT(*) as total FROM products');
    const usuarios = await client.query('SELECT COUNT(*) as total FROM users');
    const carrito = await client.query('SELECT COUNT(*) as total FROM cart');
    const favoritos = await client.query('SELECT COUNT(*) as total FROM favorites');
    
    console.log(`  Productos: ${productos.rows[0].total}`);
    console.log(`  Usuarios: ${usuarios.rows[0].total}`);
    console.log(`  Items en carrito: ${carrito.rows[0].total}`);
    console.log(`  Favoritos: ${favoritos.rows[0].total}`);
    console.log('');
    
    // Verificar productos por categoría
    console.log('📂 Productos por categoría:\n');
    const categorias = await client.query(`
      SELECT category, COUNT(*) as total 
      FROM products 
      GROUP BY category 
      ORDER BY category
    `);
    
    categorias.rows.forEach(row => {
      console.log(`  ${row.category}: ${row.total} productos`);
    });
    
    console.log('\n✅ Base de datos lista para usar!\n');
    
    client.release();
    await pool.end();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error al conectar:', error.message);
    console.log('\n🔧 Soluciones:');
    console.log('1. Verifica que DATABASE_URL sea correcta');
    console.log('2. Asegúrate de incluir ?sslmode=require al final');
    console.log('3. Verifica que el proyecto de Neon esté activo');
    console.log('4. Si las tablas no existen, ejecuta db/setup.sql');
    process.exit(1);
  }
}

verificarConexion();
