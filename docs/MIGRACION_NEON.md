# Guía de Migración a Neon PostgreSQL

## 📋 Preparación

### 1. Crear cuenta en Neon
1. Ve a https://neon.tech/
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto llamado "Tienda-Ropa"
4. Selecciona la región más cercana (us-east-1 recomendado)

### 2. Obtener Connection String
Neon te dará una cadena de conexión similar a:
```
postgresql://usuario:password@ep-xxxxx.us-east-1.aws.neon.tech/dbname?sslmode=require
```

## 🚀 Pasos de Migración

### Paso 1: Configurar variables de entorno

1. Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Edita `.env` y configura tu DATABASE_URL de Neon:
```env
DATABASE_URL=postgresql://usuario:password@ep-xxxxx.us-east-1.aws.neon.tech/dbname?sslmode=require
PORT=3000
NODE_ENV=production
```

### Paso 2: Crear las tablas en Neon

Ejecuta el script de setup desde el terminal de Neon o usando psql:

```bash
# Usando psql (reemplaza con tu connection string de Neon)
psql "postgresql://usuario:password@ep-xxxxx.us-east-1.aws.neon.tech/dbname?sslmode=require" -f db/setup.sql
```

O copia el contenido de `db/setup.sql` y ejecútalo en el SQL Editor de Neon Dashboard.

### Paso 3: Restaurar los datos

Usa el backup completo ubicado en `backups/tienda_db_backup.sql`:

```bash
# Método 1: Usando psql
psql "postgresql://tu-connection-string-de-neon" -f backups/tienda_db_backup.sql

# Método 2: Desde Neon Dashboard
# - Ve al SQL Editor
# - Copia y pega el contenido de backups/tienda_db_backup.sql
# - Ejecuta las queries
```

### Paso 4: Verificar la migración

1. Inicia el servidor:
```bash
npm start
```

2. Verifica que el servidor se conecte correctamente a Neon
3. Prueba las APIs:
   - GET http://localhost:3000/api/products
   - GET http://localhost:3000/api/health

### Paso 5: Actualizar GitHub

```bash
git add .env.example docs/MIGRACION_NEON.md
git commit -m "Preparado para migración a Neon PostgreSQL"
git push origin rain_cambios
```

## 📁 Archivos importantes

- `backups/tienda_db_backup.sql` - Backup completo con todos los datos (90 productos)
- `db/setup.sql` - Script para crear tablas
- `.env.example` - Template de configuración
- `.env` - Tu configuración real (NO subir a GitHub, está en .gitignore)

## ✅ Verificación Post-Migración

Verifica que todo funcione:
- [ ] Productos se cargan correctamente
- [ ] Búsqueda funciona
- [ ] Carrito guarda productos
- [ ] Favoritos funcionan
- [ ] No hay errores en la consola

## 🔒 Seguridad

- ✅ Nunca compartas tu DATABASE_URL
- ✅ Usa `.env` para credenciales (ya está en .gitignore)
- ✅ Neon incluye SSL por defecto
- ✅ Cambia las credenciales de prueba en producción

## 🌐 Ventajas de Neon

- ✅ Hosting gratuito hasta 3 proyectos
- ✅ SSL incluido
- ✅ Backups automáticos
- ✅ Escalable
- ✅ Sin mantenimiento de servidor
- ✅ Dashboard web integrado

## 📊 Estado Actual

- **Total productos**: 90
- **Categorías**: hombre, mujer, calzado, accesorios, ofertas
- **Tablas**: users, products, cart, favorites
- **Backup creado**: ✅ backups/tienda_db_backup.sql

## 🆘 Problemas Comunes

### Error: "password authentication failed"
- Verifica que copiaste correctamente el DATABASE_URL
- Asegúrate de incluir `?sslmode=require` al final

### Error: "relation does not exist"
- Ejecuta primero `db/setup.sql` para crear las tablas
- Luego ejecuta `backups/tienda_db_backup.sql` para los datos

### Timeout en la conexión
- Verifica que tu IP esté permitida en Neon Dashboard
- Neon permite todas las IPs por defecto, revisa firewall local

## 📝 Notas

- El backup incluye INSERT con `ON CONFLICT DO NOTHING` para evitar duplicados
- Si necesitas resetear la base de datos, ejecuta `db/setup.sql` nuevamente
- Guarda el backup en un lugar seguro antes de migrar
