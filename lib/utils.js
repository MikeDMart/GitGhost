const fs = require('fs');
const path = require('path');
const glob = require('glob');
const crypto = require('crypto');

const IGNORE = ['node_modules/**', '.git/**', '.ghost/**'];

function findDuplicateFiles() {
    const files = glob.sync('**/*.{js,css,html,json,md}', { ignore: IGNORE });

    const contentMap = new Map();
    const duplicates = [];

    for (const file of files) {
        try {
            const content = fs.readFileSync(file, 'utf-8');
            const hash = crypto.createHash('md5').update(content).digest('hex');

            if (contentMap.has(hash)) {
                duplicates.push({ file, duplicateOf: contentMap.get(hash) });
            } else {
                contentMap.set(hash, file);
            }
        } catch {}
    }

    return duplicates;
}

function findUnusedImages() {
    const images = glob.sync('**/*.{png,jpg,jpeg,gif,svg,webp}', { ignore: IGNORE });
    const sourceFiles = glob.sync('**/*.{html,css,js,jsx,ts,tsx,json,md}', { ignore: IGNORE });

    return images.filter(img => {
        const basename = path.basename(img);
        return !sourceFiles.some(file => {
            try {
                const content = fs.readFileSync(file, 'utf-8');
                return content.includes(basename) || content.includes(img);
            } catch { return false; }
        });
    });
}

function findUnusedDependencies() {
    if (!fs.existsSync('package.json')) return [];

    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    const sourceFiles = glob.sync('**/*.{js,jsx,ts,tsx}', { ignore: IGNORE });

    return Object.keys(deps).filter(dep =>
        !sourceFiles.some(file => {
            try {
                const content = fs.readFileSync(file, 'utf-8');
                return (
                    content.includes(`require('${dep}')`) ||
                    content.includes(`from '${dep}'`) ||
                    content.includes(`from "${dep}"`)
                );
            } catch { return false; }
        })
    );
}

module.exports = { findDuplicateFiles, findUnusedImages, findUnusedDependencies };