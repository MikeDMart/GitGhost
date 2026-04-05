const fs = require('fs');
const path = require('path');
const glob = require('glob');
const crypto = require('crypto');

function findDuplicateFiles() {
    const files = glob.sync('**/*.{js,css,html,json,md}', {
        ignore: ['node_modules/**', '.git/**', '.ghost/**']
    });
    
    const contentMap = new Map();
    const duplicates = [];
    
    for (const file of files) {
        try {
            const content = fs.readFileSync(file, 'utf-8');
            const hash = crypto.createHash('md5').update(content).digest('hex');
            
            if (contentMap.has(hash)) {
                duplicates.push({
                    file: file,
                    duplicateOf: contentMap.get(hash)
                });
            } else {
                contentMap.set(hash, file);
            }
        } catch (err) {}
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

module.exports = {
    findDuplicateFiles,
    findUnusedImages,
    findUnusedDependencies
};