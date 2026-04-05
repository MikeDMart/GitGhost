const utils = require('./utils');

const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    gray: '\x1b[90m',
    reset: '\x1b[0m'
};

module.exports = async function audit() {
    console.log(`
${colors.blue}👻 git-ghost audit${colors.reset}
${colors.gray}================================${colors.reset}
`);
    
    // Duplicados
    console.log(`${colors.yellow}📁 ARCHIVOS DUPLICADOS:${colors.reset}`);
    const duplicates = utils.findDuplicateFiles();
    if (duplicates.length === 0) {
        console.log(`  ${colors.green}✅ No se encontraron duplicados${colors.reset}`);
    } else {
        duplicates.forEach(dup => {
            console.log(`  ${colors.red}📄${colors.reset} ${dup.file}`);
            console.log(`     ${colors.gray}idéntico a: ${dup.duplicateOf}${colors.reset}`);
        });
    }
    
    console.log('');
    
    // Imágenes no usadas
    console.log(`${colors.yellow}🖼️ IMÁGENES NO REFERENCIADAS:${colors.reset}`);
    const unusedImages = utils.findUnusedImages();
    if (unusedImages.length === 0) {
        console.log(`  ${colors.green}✅ Todas las imágenes están referenciadas${colors.reset}`);
    } else {
        unusedImages.forEach(img => {
            console.log(`  ${colors.gray}📄${colors.reset} ${img}`);
        });
    }
    
    console.log('');
    
    // Dependencias huérfanas
    console.log(`${colors.yellow}📦 DEPENDENCIAS HUÉRFANAS:${colors.reset}`);
    const unusedDeps = utils.findUnusedDependencies();
    if (unusedDeps.length === 0) {
        console.log(`  ${colors.green}✅ Todas las dependencias se usan${colors.reset}`);
    } else {
        unusedDeps.forEach(dep => {
            console.log(`  ${colors.gray}📦${colors.reset} ${dep}`);
        });
    }
    
    console.log('');
    console.log(`${colors.blue}💡 Sugerencia:${colors.reset}`);
    console.log(`  Ejecuta ${colors.green}git-ghost fix --pr${colors.reset} para crear un PR con correcciones`);
    console.log('');
};