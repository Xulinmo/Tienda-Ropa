// Script para crear backup de la base de datos PostgreSQL
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const backupDir = path.join(__dirname, '..', 'backups');
const backupFile = path.join(backupDir, `backup_${timestamp}.sql`);

// Asegurar que existe el directorio de backups
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

console.log('🔄 Creando backup de la base de datos...\n');

// Comando para PostgreSQL local
const command = `"C:\\Program Files\\PostgreSQL\\18\\bin\\pg_dump.exe" -U postgres -d tienda_db -F p -f "${backupFile}"`;

// Ejecutar el comando
const childProcess = exec(command, {
  env: { ...process.env, PGPASSWORD: '2006' }
});

childProcess.stdout?.on('data', (data) => {
  console.log(data);
});

childProcess.stderr?.on('data', (data) => {
  console.error(data);
});

childProcess.on('close', (code) => {
  if (code === 0) {
    const stats = fs.statSync(backupFile);
    const sizeKB = (stats.size / 1024).toFixed(2);
    
    console.log('✅ Backup creado exitosamente!\n');
    console.log(`📁 Archivo: ${path.basename(backupFile)}`);
    console.log(`📊 Tamaño: ${sizeKB} KB`);
    console.log(`📍 Ubicación: backups/\n`);
    console.log('💡 Este archivo contiene toda tu base de datos y puede usarse para:');
    console.log('   - Migrar a Neon PostgreSQL');
    console.log('   - Restaurar en caso de problemas');
    console.log('   - Mover a otro servidor');
  } else {
    console.error(`❌ Error al crear backup (código ${code})`);
  }
});
