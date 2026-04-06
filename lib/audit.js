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

    // Duplicate files
    console.log(`${colors.yellow}📁 DUPLICATE FILES:${colors.reset}`);
    const duplicates = utils.findDuplicateFiles();
    if (duplicates.length === 0) {
        console.log(`  ${colors.green}✅ No duplicates found${colors.reset}`);
    } else {
        duplicates.forEach(dup => {
            console.log(`  ${colors.red}📄${colors.reset} ${dup.file}`);
            console.log(`     ${colors.gray}identical to: ${dup.duplicateOf}${colors.reset}`);
        });
    }

    console.log('');

    // Unreferenced images
    console.log(`${colors.yellow}🖼️  UNREFERENCED IMAGES:${colors.reset}`);
    const unusedImages = utils.findUnusedImages();
    if (unusedImages.length === 0) {
        console.log(`  ${colors.green}✅ All images are referenced${colors.reset}`);
    } else {
        unusedImages.forEach(img => {
            console.log(`  ${colors.gray}📄${colors.reset} ${img}`);
        });
    }

    console.log('');

    // Orphaned dependencies
    console.log(`${colors.yellow}📦 ORPHANED DEPENDENCIES:${colors.reset}`);
    const unusedDeps = utils.findUnusedDependencies();
    if (unusedDeps.length === 0) {
        console.log(`  ${colors.green}✅ All dependencies are in use${colors.reset}`);
    } else {
        unusedDeps.forEach(dep => {
            console.log(`  ${colors.gray}📦${colors.reset} ${dep}`);
        });
    }

    console.log('');
    console.log(`${colors.blue}💡 Tip:${colors.reset}`);
    console.log(`  Run ${colors.green}git-ghost fix --pr${colors.reset} to open a PR with all fixes applied`);
    console.log('');
};