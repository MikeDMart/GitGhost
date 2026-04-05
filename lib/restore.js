const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    gray: '\x1b[90m',
    reset: '\x1b[0m'
};

const GHOST_DIR = '.ghost';

module.exports = function restore(file) {
    console.log(`
${colors.blue}👻 git-ghost restore${colors.reset}
${colors.gray}================================${colors.reset}
`);

    if (!file) {
        console.log(`${colors.red}❌ Especifica un archivo para restaurar${colors.reset}`);
        console.log(`${colors.yellow}Uso: git-ghost restore <archivo>${colors.reset}`);
        console.log(`Ejemplo: git-ghost restore styles/old.css`);
        process.exit(1);
    }

    const ghostPath = path.join(GHOST_DIR, file);
    const originalPath = file;

    if (!fs.existsSync(ghostPath)) {
        console.log(`${colors.red}❌ No se encuentra en .ghost/: ${file}${colors.reset}`);
        
        // Listar archivos disponibles
        if (fs.existsSync(GHOST_DIR)) {
            console.log(`\n${colors.yellow}📁 Archivos disponibles en .ghost/:${colors.reset}`);
            const listFiles = (dir, prefix = '') => {
                const items = fs.readdirSync(dir);
                items.forEach(item => {
                    const fullPath = path.join(dir, item);
                    const relativePath = path.join(prefix, item);
                    if (fs.statSync(fullPath).isDirectory()) {
                        listFiles(fullPath, relativePath);
                    } else {
                        console.log(`  ${colors.gray}📄${colors.reset} ${relativePath}`);
                    }
                });
            };
            listFiles(GHOST_DIR);
        }
        process.exit(1);
    }

    // Crear directorio de destino si no existe
    const destDir = path.dirname(originalPath);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    // Restaurar
    fs.renameSync(ghostPath, originalPath);
    console.log(`${colors.green}✅ Restaurado: ${originalPath}${colors.reset}`);

    // Sugerir commit
    console.log(`\n${colors.blue}💡 Para guardar la restauración:${colors.reset}`);
    console.log(`  git add ${originalPath}`);
    console.log(`  git commit -m "restore: recuperar ${originalPath}"`);
    console.log('');
};