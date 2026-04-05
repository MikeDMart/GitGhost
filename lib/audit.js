const fs = require('fs');
const path = require('path');
const glob = require('glob');

const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    gray: '\x1b[90m',
    reset: '\x1b[0m'
};

function findDuplicateFiles() {
    const files = glob.sync('**/*.{js,css,html,json,md}', {
        ignore: ['node_modules/**', '.git/**', '.ghost/**']
    });
    
    const contentMap = new Map();
    const duplicates = [];
    
    for (const file of files) {
        try {
            const content = fs.readFileSync(file, 'utf-8');
            const hash = require('crypto').createHash('md5').update(content).digest('hex');
            
            if (contentMap.has(hash)) {
                duplicates.push({
                    file: file,
                    duplicateOf: contentMap.get(hash)
                });
            } else {
                contentMap.set(hash, file);
            }
        } catch (err) {
            // No se pudo leer
        }
    }
    
    return duplicates;
}

function findUnusedImages() {
    const images = glob.sync('**/*.{png,jpg,jpeg,gif,svg,webp}', {
        ignore: ['node_modules/**', '.git/**', '.ghost/**']
    });
    
    const allFiles = glob.sync('**/*.{html,css,js,jsx,ts,tsx,json,md}', {
        ignore: ['node_modules/**', '.git/**', '.ghost/**']
    });
    
    const unused = [];
    
    for (const img of images) {
        const basename = path.basename(img);
        let referenced = false;
        
        for (const file of allFiles) {
            try {
                const content = fs.readFileSync(file, 'utf-8');
                if (content.includes(basename) || content.includes(img)) {
                    referenced = true;
                    break;
                }
            } catch (err) {}
        }
        
        if (!referenced) {
            unused.push(img);
        }
    }
    
    return unused;
}

function findUnusedDependencies() {
    if (!fs.existsSync('package.json')) return [];
    
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    
    const allFiles = glob.sync('**/*.{js,jsx,ts,tsx}', {
        ignore: ['node_modules/**', '.git/**', '.ghost/**']
    });
    
    const unused = [];
    
    for (const dep of Object.keys(deps)) {
        let used = false;
        
        for (const file of allFiles) {
            try {
                const content = fs.readFileSync(file, 'utf-8');
                if (content.includes(`require('${dep}')`) || 
                    content.includes(`from '${dep}'`) ||
                    content.includes(`from "${dep}"`)) {
                    used = true;
                    break;
                }
            } catch (err) {}
        }
        
        if (!used) {
            unused.push(dep);
        }
    }
    
    return unused;
}

module.exports = async function audit() {
    console.log(`
${colors.blue}👻 git-ghost audit${colors.reset}
${colors.gray}================================${colors.reset}
`);
    
    // Duplicados
    console.log(`${colors.yellow}📁 ARCHIVOS DUPLICADOS:${colors.reset}`);
    const duplicates = findDuplicateFiles();
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
    const unusedImages = findUnusedImages();
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
    const unusedDeps = findUnusedDependencies();
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