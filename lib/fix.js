const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const utils = require('./utils');

const colors = {
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    gray: '\x1b[90m',
    reset: '\x1b[0m'
};

const BRANCH_NAME = `fix/git-ghost-${Date.now()}`;
const GHOST_DIR = '.ghost';

module.exports = async function fix({ createPR = false }) {
    console.log(`
${colors.blue}👻 git-ghost fix${colors.reset}
${colors.gray}================================${colors.reset}
`);

    console.log(`${colors.yellow}📊 Running audit...${colors.reset}`);
    const duplicates = utils.findDuplicateFiles();
    const unusedImages = utils.findUnusedImages();
    const unusedDeps = utils.findUnusedDependencies();

    if (duplicates.length === 0 && unusedImages.length === 0 && unusedDeps.length === 0) {
        console.log(`${colors.green}✅ Nothing to fix — repository is clean${colors.reset}`);
        return;
    }

    console.log(`\n${colors.yellow}📋 Fix summary:${colors.reset}`);
    console.log(`  🗑️  Duplicates:            ${duplicates.length}`);
    console.log(`  👻 Unreferenced images:   ${unusedImages.length}`);
    console.log(`  📦 Orphaned dependencies: ${unusedDeps.length}`);

    console.log(`\n${colors.yellow}🌿 Creating branch: ${BRANCH_NAME}${colors.reset}`);
    try {
        execSync(`git checkout -b ${BRANCH_NAME}`, { stdio: 'ignore' });
    } catch {
        console.log(`${colors.red}❌ Could not create branch — make sure you have no uncommitted changes${colors.reset}`);
        return;
    }

    console.log(`\n${colors.yellow}🔧 Applying fixes...${colors.reset}`);

    // Move unreferenced images to .ghost/
    if (unusedImages.length > 0 && !fs.existsSync(GHOST_DIR)) {
        fs.mkdirSync(GHOST_DIR, { recursive: true });
    }

    unusedImages.forEach(img => {
        const ghostPath = path.join(GHOST_DIR, img);
        fs.mkdirSync(path.dirname(ghostPath), { recursive: true });
        if (fs.existsSync(img)) {
            fs.renameSync(img, ghostPath);
            console.log(`  👻 ${img} → ${ghostPath}`);
        }
    });

    // Remove duplicates (keep the first occurrence)
    const kept = new Set();
    let deletedCount = 0;
    duplicates.forEach(dup => {
        if (!kept.has(dup.duplicateOf)) {
            kept.add(dup.duplicateOf);
        } else if (fs.existsSync(dup.file)) {
            fs.unlinkSync(dup.file);
            console.log(`  🗑️  Removed: ${dup.file}`);
            deletedCount++;
        }
    });

    if (deletedCount > 0 || unusedImages.length > 0) {
        console.log(`\n${colors.yellow}📝 Creating commit...${colors.reset}`);
        execSync(`git add .`, { stdio: 'ignore' });
        execSync(`git commit -m "chore: automated cleanup via git-ghost

- ${deletedCount} duplicate file(s) removed
- ${unusedImages.length} unreferenced image(s) moved to .ghost/
- ${unusedDeps.length} orphaned dependency/dependencies flagged

Run 'git-ghost restore <file>' to recover any moved file"`, { stdio: 'ignore' });

        console.log(`\n${colors.yellow}📤 Pushing branch...${colors.reset}`);
        execSync(`git push origin ${BRANCH_NAME}`, { stdio: 'ignore' });

        if (createPR) {
            console.log(`\n${colors.yellow}📬 Creating Pull Request...${colors.reset}`);
            try {
                execSync(`gh pr create \
                    --title "♻️ Automated cleanup via git-ghost" \
                    --body "This PR was generated automatically by git-ghost.

### Changes
- Duplicate files removed
- Unreferenced images moved to \`.ghost/\`
- Orphaned dependencies flagged

### Review checklist
- [ ] Verify nothing critical was removed
- [ ] Restore from \`.ghost/\` if needed (\`git-ghost restore <file>\`)
- [ ] Approve or close" \
                    --base main \
                    --head ${BRANCH_NAME}`, { stdio: 'inherit' });
            } catch {
                console.log(`${colors.yellow}⚠️  Could not create PR automatically. Run manually:${colors.reset}`);
                console.log(`   gh pr create --base main --head ${BRANCH_NAME}`);
            }
        } else {
            console.log(`\n${colors.green}✅ Branch ready: ${BRANCH_NAME}${colors.reset}`);
            console.log(`${colors.blue}💡 To open a PR manually:${colors.reset}`);
            console.log(`   gh pr create --base main --head ${BRANCH_NAME}`);
        }
    } else {
        console.log(`${colors.yellow}⚠️  No file changes were made${colors.reset}`);
    }

    console.log('');
};