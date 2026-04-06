const fs = require('fs');
const path = require('path');

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
        console.log(`${colors.red}❌ Please specify a file to restore${colors.reset}`);
        console.log(`${colors.yellow}Usage: git-ghost restore <file>${colors.reset}`);
        console.log(`Example: git-ghost restore styles/old.css`);
        process.exit(1);
    }

    const ghostPath = path.join(GHOST_DIR, file);

    if (!fs.existsSync(ghostPath)) {
        console.log(`${colors.red}❌ File not found in .ghost/: ${file}${colors.reset}`);

        if (fs.existsSync(GHOST_DIR)) {
            console.log(`\n${colors.yellow}📁 Available files in .ghost/:${colors.reset}`);
            const listFiles = (dir, prefix = '') => {
                fs.readdirSync(dir).forEach(item => {
                    const fullPath = path.join(dir, item);
                    const rel = path.join(prefix, item);
                    if (fs.statSync(fullPath).isDirectory()) {
                        listFiles(fullPath, rel);
                    } else {
                        console.log(`  ${colors.gray}📄${colors.reset} ${rel}`);
                    }
                });
            };
            listFiles(GHOST_DIR);
        }
        process.exit(1);
    }

    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.renameSync(ghostPath, file);

    console.log(`${colors.green}✅ Restored: ${file}${colors.reset}`);
    console.log(`\n${colors.blue}💡 To commit the restoration:${colors.reset}`);
    console.log(`  git add ${file}`);
    console.log(`  git commit -m "restore: recover ${file}"`);
    console.log('');
};