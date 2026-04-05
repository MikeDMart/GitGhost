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

    // Buscar commits relacionados con git-ghost
    try {
        const commits = execSync(`git log --oneline --grep="git-ghost" --format="%h %ad %s" --date=short`, { encoding: 'utf-8' });
        
        if (commits.trim() === '') {
            console.log(`${colors.yellow}📭 No hay limpiezas previas registradas${colors.reset}`);
            console.log(`\n${colors.blue}💡 Ejecuta 'git-ghost fix --pr' para crear tu primera limpieza${colors.reset}`);
        } else {
            console.log(`${colors.green}📋 Limpiezas anteriores:${colors.reset}\n`);
            console.log(commits);
        }
        
        // Mostrar estado actual de .ghost/
        if (require('fs').existsSync('.ghost')) {
            const ghostFiles = require('child_process').execSync(`find .ghost -type f | wc -l`, { encoding: 'utf-8' }).trim();
            console.log(`\n${colors.yellow}👻 Archivos en .ghost/ actualmente: ${ghostFiles}${colors.reset}`);
            console.log(`${colors.blue}💡 Para restaurar: git-ghost restore <archivo>${colors.reset}`);
        }
        
        console.log('');
    } catch (err) {
        console.log(`${colors.red}❌ No se pudo obtener el historial${colors.reset}`);
    }
};