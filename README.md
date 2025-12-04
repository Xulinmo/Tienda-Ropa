# 🛍️ Buena Pinta - Tienda de Ropa

E-commerce de ropa con sistema de carrito, favoritos y gestión de stock.

## 🚀 Tecnologías

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js + Express
- **Base de datos**: PostgreSQL (Neon Cloud)
- **Hosting**: 
  - Frontend: GitHub Pages
  - Backend: Railway
  - Imágenes: Cloudinary

## 📦 Instalación Local

```bash
# Clonar repositorio
git clone https://github.com/Buena-Pinta-tienda/Tienda-Ropa.git

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL

# Iniciar servidor
npm start
```

## 🌐 Demo

- **Sitio web**: https://buena-pinta-tienda.github.io/Tienda-Ropa/
- **API**: https://tienda-ropa-production.up.railway.app

## ✨ Características

- ✅ Sistema de autenticación de usuarios
- ✅ Carrito de compras persistente
- ✅ Lista de favoritos por usuario
- ✅ Gestión de stock en tiempo real
- ✅ Productos dinámicos desde base de datos
- ✅ Proceso de compra completo con boleta



```
├── public/          # Páginas HTML
├── CSS/            # Estilos
├── JS/             # Scripts del frontend
├── server.js       # API REST
└── package.json    # Dependencias
```

## 🔧 Variables de Entorno

```env
DATABASE_URL=postgresql://usuario:password@host/database
PORT=3000
NODE_ENV=production
```

## 👥 Autor

Proyecto desarrollado por el equipo Buena Pinta
