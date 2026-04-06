const fs = require('fs');
const { execSync } = require('child_process');

const colors = {
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    gray: '\x1b[90m',
    reset: '\x1b[0m'
};

module.exports = function history() {
    console.log(`
${colors.blue}👻 git-ghost history${colors.reset}
${colors.gray}================================${colors.reset}
`);

    try {
        const commits = execSync(
            `git log --oneline --grep="git-ghost" --format="%h %ad %s" --date=short`,
            { encoding: 'utf-8' }
        );

        if (commits.trim() === '') {
            console.log(`${colors.yellow}📭 No previous cleanups found${colors.reset}`);
            console.log(`\n${colors.blue}💡 Run 'git-ghost fix --pr' to create your first cleanup${colors.reset}`);
        } else {
            console.log(`${colors.green}📋 Previous cleanups:${colors.reset}\n`);
            console.log(commits);
        }

        if (fs.existsSync('.ghost')) {
            const count = execSync(`find .ghost -type f | wc -l`, { encoding: 'utf-8' }).trim();
            console.log(`\n${colors.yellow}👻 Files currently in .ghost/: ${count}${colors.reset}`);
            console.log(`${colors.blue}💡 To restore: git-ghost restore <file>${colors.reset}`);
        }

        console.log('');
    } catch {
        console.log(`${colors.red}❌ Could not retrieve history${colors.reset}`);
    }
};