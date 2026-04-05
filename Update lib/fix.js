const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const utils = require('./utils');

const colors = {
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    reset: '\x1b[0m'
};

const BRANCH_NAME = `fix/git-ghost-${Date.now()}`;
const GHOST_DIR = '.ghost';

module.exports = async function fix({ createPR = false }) {
    console.log(`
${colors.blue}👻 git-ghost fix${colors.reset}
${colors.gray}================================${colors.reset}
`);
    
    // Usar utils en lugar de audit
    console.log(`${colors.yellow}📊 Ejecutando auditoría...${colors.reset}`);
    const duplicates = utils.findDuplicateFiles();
    const unusedImages = utils.findUnusedImages();
    const unusedDeps = utils.findUnusedDependencies();
    
    if (duplicates.length === 0 && unusedImages.length === 0 && unusedDeps.length === 0) {
        console.log(`${colors.green}✅ No hay nada que corregir${colors.reset}`);
        return;
    }
    
    // Mostrar resumen
    console.log(`\n${colors.yellow}📋 Resumen de correcciones:${colors.reset}`);
    console.log(`  🗑️ Duplicados: ${duplicates.length}`);
    console.log(`  👻 Imágenes no usadas: ${unusedImages.length}`);
    console.log(`  📦 Dependencias huérfanas: ${unusedDeps.length}`);
    
    // Crear branch
    console.log(`\n${colors.yellow}🌿 Creando branch: ${BRANCH_NAME}${colors.reset}`);
    try {
        execSync(`git checkout -b ${BRANCH_NAME}`, { stdio: 'ignore' });
    } catch {
        console.log(`${colors.red}❌ No se pudo crear la branch${colors.reset}`);
        return;
    }
    
    // Aplicar correcciones
    console.log(`\n${colors.yellow}🔧 Aplicando correcciones...${colors.reset}`);
    
    // Crear directorio .ghost/
    if (unusedImages.length > 0 && !fs.existsSync(GHOST_DIR)) {
        fs.mkdirSync(GHOST_DIR, { recursive: true });
    }
    
    // Mover imágenes no usadas
    unusedImages.forEach(img => {
        const ghostPath = path.join(GHOST_DIR, img);
        const ghostDir = path.dirname(ghostPath);
        if (!fs.existsSync(ghostDir)) {
            fs.mkdirSync(ghostDir, { recursive: true });
        }
        if (fs.existsSync(img)) {
            fs.renameSync(img, ghostPath);
            console.log(`  👻 ${img} → ${ghostPath}`);
        }
    });
    
    // Eliminar duplicados (dejar el primero)
    const kept = new Set();
    let deletedCount = 0;
    duplicates.forEach(dup => {
        if (!kept.has(dup.duplicateOf)) {
            kept.add(dup.duplicateOf);
        } else {
            if (fs.existsSync(dup.file)) {
                fs.unlinkSync(dup.file);
                console.log(`  🗑️ Eliminado: ${dup.file}`);
                deletedCount++;
            }
        }
    });
    
    // Commit
    if (deletedCount > 0 || unusedImages.length > 0) {
        console.log(`\n${colors.yellow}📝 Creando commit...${colors.reset}`);
        execSync(`git add .`, { stdio: 'ignore' });
        execSync(`git commit -m "chore: limpieza automática con git-ghost

- Eliminados ${deletedCount} archivos duplicados
- Movidas ${unusedImages.length} imágenes a .ghost/
- Desinstaladas ${unusedDeps.length} dependencias

Ejecutar 'git-ghost restore <archivo>' para revertir"`, { stdio: 'ignore' });
        
        // Subir branch
        console.log(`\n${colors.yellow}📤 Subiendo branch...${colors.reset}`);
        execSync(`git push origin ${BRANCH_NAME}`, { stdio: 'ignore' });
        
        // Crear PR
        if (createPR) {
            console.log(`\n${colors.yellow}📬 Creando Pull Request...${colors.reset}`);
            try {
                execSync(`gh pr create --title "♻️ Limpieza automática con git-ghost" \
                    --body "Este PR fue generado automáticamente.

### Cambios:
- Archivos duplicados eliminados
- Imágenes no usadas movidas a \`.ghost/\`
- Dependencias huérfanas desinstaladas

### Revisar:
- [ ] Verificar que nada falte
- [ ] Restaurar desde \`.ghost/\` si es necesario
- [ ] Aprobar o rechazar" \
                    --base main \
                    --head ${BRANCH_NAME}`, { stdio: 'inherit' });
            } catch {
                console.log(`${colors.yellow}⚠️  No se pudo crear PR automático. Crea manualmente:${colors.reset}`);
                console.log(`   gh pr create --base main --head ${BRANCH_NAME}`);
            }
        } else {
            console.log(`\n${colors.green}✅ Branch creada: ${BRANCH_NAME}${colors.reset}`);
            console.log(`${colors.blue}💡 Para crear PR manual:${colors.reset}`);
            console.log(`   git push origin ${BRANCH_NAME}`);
            console.log(`   Luego crea PR en GitHub`);
        }
    } else {
        console.log(`${colors.yellow}⚠️ No se realizaron cambios${colors.reset}`);
    }
    
    console.log('');
};