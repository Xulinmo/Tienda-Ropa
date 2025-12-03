# Tienda de Ropa - E-commerce

Sistema de comercio electrónico con carrito de compras, favoritos y gestión de stock.

## ✅ Estado: CONFIGURADO Y FUNCIONANDO

- ✅ Base de datos PostgreSQL (Local / Neon Cloud)
- ✅ Tablas creadas (users, products, cart, favorites)
- ✅ 90 productos cargados
- ✅ Servidor corriendo en `http://localhost:3000`
- ✅ **Backup completo listo para migración a Neon**: `backups/tienda_db_backup.sql`

## 🌐 Migración a Neon PostgreSQL

Para migrar tu base de datos a la nube con Neon, sigue la guía completa en:
📖 [docs/MIGRACION_NEON.md](docs/MIGRACION_NEON.md)

**Resumen rápido:**
1. Crea cuenta en https://neon.tech/
2. Obtén tu DATABASE_URL
3. Configura `.env` con tu connection string
4. Ejecuta `db/setup.sql` en Neon
5. Restaura `backups/tienda_db_backup.sql`
6. Verifica con: `node scripts/verificar-neon.js`

## Estructura del Proyecto

```
Tienda-Ropa-main/
├── public/                 # Páginas HTML
│   ├── index.html         # Inicio
│   ├── hombre.html        # Categoría hombre
│   ├── mujer.html         # Categoría mujer
│   ├── calzado.html       # Categoría calzado
│   ├── accesorios.html    # Categoría accesorios
│   ├── ofertas.html       # Ofertas
│   └── favoritos.html     # Lista de favoritos
├── CSS/                    # Estilos de la aplicación
│   ├── Cuerpo.css
│   ├── Encabezadp.css
│   └── mujer-hombre.css
├── JS/                     # Scripts del cliente
│   ├── carrito.js         # Gestión del carrito
│   ├── favoritos.js       # Sistema de favoritos
│   ├── productos.js       # Carga de productos
│   └── *.js               # Búsquedas por categoría
├── db/                     # Base de datos
│   └── setup.sql          # Script de inicialización
├── backups/               # Respaldos automáticos
├── scripts/               # Utilidades
│   ├── insert_products.sql
│   └── limpiar-cache.js
├── docs/                  # Documentación
│   └── test-api.html
├── server.js              # Servidor Express
└── package.json           # Dependencias
```
- ✅ Frontend integrado con la API

## Endpoints disponibles:

- `GET /api/health` : estado del servicio
- `GET /api/products` : lista de productos
- `GET /api/products/:id` : detalles de un producto
- `GET /api/favorites?user_id=1` : favoritos del usuario
- `GET /api/cart?user_id=1` : carrito del usuario
- `POST /api/cart` : agregar al carrito (body JSON: `{ user_id, product_id, quantity }`)
- `DELETE /api/cart/:cart_id` : eliminar item del carrito
- `PUT /api/cart/:cart_id` : actualizar cantidad (body JSON: `{ quantity }`)

## Probar el sistema:

1. **Servidor ya está corriendo** en el puerto 3000

2. **Probar API**: Abre `test-api.html` en tu navegador:
   ```powershell
   start test-api.html
   ```

3. **Usar la tienda**: Abre cualquier página HTML (index.html, hombre.html, etc.)
   - Los productos ahora se guardan en PostgreSQL
   - El carrito persiste en la base de datos
   - Cada vez que agregas un producto, se guarda automáticamente

## Cómo funciona:

- El archivo `JS/carrito.js` ahora hace llamadas a la API
- Cuando agregas un producto al carrito, se guarda en PostgreSQL
- El contador del carrito se actualiza desde la base de datos
- Todo funciona de forma transparente con tu HTML/CSS existente

## Si necesitas reiniciar el servidor:

```powershell
npm start
```

## Configuración (ya completada):

- `.env` : credenciales de PostgreSQL (usuario: postgres, contraseña: 2006)
- `db/setup.sql` : esquema y datos de ejemplo ya ejecutado
- `package.json` : dependencias instaladas

## Notas técnicas:

- Usuario demo: ID 1 (se usa automáticamente en el frontend)
- La conexión usa la variable `DATABASE_URL` del archivo `.env`
- Si hay problemas de conexión, el sistema hace fallback a localStorage temporalmente
- Los productos del HTML tienen `data-id` que coinciden con los IDs de la base de datos
