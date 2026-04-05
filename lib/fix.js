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
    
    console.log(`${colors.yellow}📊 Ejecutando auditoría...${colors.reset}`);
    const duplicates = utils.findDuplicateFiles();
    const unusedImages = utils.findUnusedImages();
    const unusedDeps = utils.findUnusedDependencies();
    
    if (duplicates.length === 0 && unusedImages.length === 0 && unusedDeps.length === 0) {
        console.log(`${colors.green}✅ No hay nada que corregir${colors.reset}`);
        return;
    }
    
    console.log(`\n${colors.yellow}📋 Resumen de correcciones:${colors.reset}`);
    console.log(`  🗑️ Duplicados: ${duplicates.length}`);
    console.log(`  👻 Imágenes no usadas: ${unusedImages.length}`);
    console.log(`  📦 Dependencias huérfanas: ${unusedDeps.length}`);
    
    console.log(`\n${colors.yellow}🌿 Creando branch: ${BRANCH_NAME}${colors.reset}`);
    try {
        execSync(`git checkout -b ${BRANCH_NAME}`, { stdio: 'ignore' });
    } catch {
        console.log(`${colors.red}❌ No se pudo crear la branch${colors.reset}`);
        return;
    }
    
    console.log(`\n${colors.yellow}🔧 Aplicando correcciones...${colors.reset}`);
    
    if (unusedImages.length > 0 && !fs.existsSync(GHOST_DIR)) {
        fs.mkdirSync(GHOST_DIR, { recursive: true });
    }
    
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
    
    if (deletedCount > 0 || unusedImages.length > 0) {
        console.log(`\n${colors.yellow}📝 Creando commit...${colors.reset}`);
        execSync(`git add .`, { stdio: 'ignore' });
        execSync(`git commit -m "chore: limpieza automática con git-ghost"`, { stdio: 'ignore' });
        
        console.log(`\n${colors.yellow}📤 Subiendo branch...${colors.reset}`);
        execSync(`git push origin ${BRANCH_NAME}`, { stdio: 'ignore' });
        
        if (createPR) {
            console.log(`\n${colors.yellow}📬 Creando Pull Request...${colors.reset}`);
            try {
                execSync(`gh pr create --title "♻️ Limpieza automática con git-ghost" --body "Limpieza automática" --base main --head ${BRANCH_NAME}`, { stdio: 'inherit' });
            } catch {
                console.log(`${colors.yellow}⚠️  Crea PR manual: gh pr create --base main --head ${BRANCH_NAME}`);
            }
        } else {
            console.log(`\n${colors.green}✅ Branch creada: ${BRANCH_NAME}${colors.reset}`);
        }
    }
    
    console.log('');
};
