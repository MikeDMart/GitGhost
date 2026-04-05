#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

// Colores
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    gray: '\x1b[90m',
    reset: '\x1b[0m'
};

const command = process.argv[2];

// Mostrar ayuda si no hay comando
if (!command || command === 'help' || command === '--help') {
    console.log(`
${colors.blue}git-ghost v1.0.0${colors.reset}
${colors.gray}Herramienta de limpieza de repositorios${colors.reset}

${colors.yellow}Uso:${colors.reset}
  git-ghost audit               # Solo detecta problemas (modo lectura)
  git-ghost fix --pr            # Crea PR con correcciones
  git-ghost restore <archivo>   # Restaura desde .ghost/
  git-ghost history             # Muestra historial de limpiezas

${colors.yellow}Ejemplos:${colors.reset}
  git-ghost audit
  git-ghost fix --pr
  git-ghost restore styles/old.css
`);
    process.exit(0);
}

// Verificar que estamos en un repositorio Git
try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
} catch {
    console.log(`${colors.red}❌ No estás en un repositorio Git${colors.reset}`);
    process.exit(1);
}

// Ejecutar comando
switch (command) {
    case 'audit':
        require('../lib/audit')();
        break;
    case 'fix':
        const createPR = process.argv.includes('--pr');
        require('../lib/fix')({ createPR });
        break;
    case 'restore':
        const file = process.argv[3];
        require('../lib/restore')(file);
        break;
    case 'history':
        require('../lib/history')();
        break;
    default:
        console.log(`${colors.red}❌ Comando no reconocido: ${command}${colors.reset}`);
        console.log(`Ejecuta 'git-ghost help' para ver comandos disponibles`);
        process.exit(1);
}