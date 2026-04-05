# 👻 GitGhost

<p align="center">
  <img src="https://raw.githubusercontent.com/MikeDMart/GitGhost/main/assets/logo.png" alt="GitGhost Logo" width="200">
</p>

<p align="center">
  <strong>🚀 Detecta archivos fantasma, duplicados y dependencias huérfanas automáticamente</strong>
</p>

<p align="center">
  <a href="#instalación"><img src="https://img.shields.io/badge/📦-Instalar-blue?style=for-the-badge"></a>
  <a href="#uso"><img src="https://img.shields.io/badge/🎯-Usar-green?style=for-the-badge"></a>
  <a href="#comandos"><img src="https://img.shields.io/badge/⚡-Comandos-orange?style=for-the-badge"></a>
  <a href="#ejemplos"><img src="https://img.shields.io/badge/💡-Ejemplos-purple?style=for-the-badge"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/versión-1.0.0-blue">
  <img src="https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen">
  <img src="https://img.shields.io/badge/licencia-MIT-green">
  <img src="https://img.shields.io/badge/PRs-bienvenidos-brightgreen">
</p>

---

## 📋 Tabla de Contenidos

- [✨ Características](#-características)
- [🚀 Instalación](#-instalación)
- [🎯 Uso Rápido](#-uso-rápido)
- [📚 Comandos](#-comandos)
- [💡 Ejemplos](#-ejemplos)
- [🔄 Flujo de Trabajo](#-flujo-de-trabajo)
- [🛠️ Tecnologías](#️-tecnologías)
- [🤝 Contribuir](#-contribuir)
- [📄 Licencia](#-licencia)
- [👤 Autor](#-autor)

---

## ✨ Características

| Feature | Descripción | Estado |
|---------|-------------|--------|
| 🔍 **Detección de duplicados** | Encuentra archivos con contenido idéntico | ✅ |
| 🖼️ **Imágenes huérfanas** | Detecta imágenes no referenciadas en HTML/CSS/JS | ✅ |
| 📦 **Dependencias muertas** | Identifica paquetes npm instalados pero no usados | ✅ |
| 🌿 **Branch automática** | Crea una branch limpia con las correcciones | ✅ |
| 📬 **PR automático** | Genera Pull Request en GitHub | ✅ |
| ♻️ **Restauración** | Recupera archivos desde `.ghost/` | ✅ |
| 📊 **Historial** | Muestra todas las limpiezas realizadas | ✅ |
| 🚀 **Modo CI/CD** | Integración con GitHub Actions | 🚧 Próximamente |

---

## 🚀 Instalación

### Opción 1: npm (recomendado)

```bash
npm install -g git-ghost
Opción 2: Desde GitHub
bash
git clone https://github.com/MikeDMart/GitGhost.git
cd GitGhost
npm link
Opción 3: Ejecución directa (sin instalar)
bash
npx github:MikeDMart/GitGhost audit
Verificar instalación
bash
git-ghost --version
# Output: git-ghost v1.0.0
🎯 Uso Rápido
bash
# 1. Entra a tu repositorio
cd /ruta/de/tu/proyecto

# 2. Audita (solo lectura, sin cambios)
git-ghost audit

# 3. Limpia automáticamente
git-ghost fix --pr

# 4. Revisa el PR en GitHub
# 5. Aprueba y mergea
📚 Comandos
Comando	Descripción	Ejemplo
git-ghost audit	Analiza y reporta problemas	git-ghost audit
git-ghost fix	Crea branch local con correcciones	git-ghost fix
git-ghost fix --pr	Crea branch + Pull Request	git-ghost fix --pr
git-ghost restore <file>	Restaura archivo desde .ghost/	git-ghost restore styles/old.css
git-ghost history	Muestra historial de limpiezas	git-ghost history
git-ghost help	Muestra ayuda	git-ghost help
💡 Ejemplos
Ejemplo 1: Auditoría básica
bash
$ cd ~/Projects/mi-app
$ git-ghost audit

👻 git-ghost audit
================================

📁 ARCHIVOS DUPLICADOS:
  📄 styles/main.css
     idéntico a: styles/style.css
  📄 utils/helpers.js
     idéntico a: lib/utils.js

🖼️ IMÁGENES NO REFERENCIADAS:
  📄 assets/old-logo.png
  📄 images/backup/banner.jpg

📦 DEPENDENCIAS HUÉRFANAS:
  📦 lodash
  📦 moment

💡 Sugerencia:
  Ejecuta git-ghost fix --pr para crear un PR con correcciones
Ejemplo 2: Limpieza automática con PR
bash
$ git-ghost fix --pr

👻 git-ghost fix
================================

📊 Ejecutando auditoría...

📋 Resumen de correcciones:
  🗑️ Duplicados: 2
  👻 Imágenes no usadas: 2
  📦 Dependencias huérfanas: 2

🌿 Creando branch: fix/git-ghost-1743872154321

🔧 Aplicando correcciones...
  🗑️ Eliminado: styles/main.css
  🗑️ Eliminado: utils/helpers.js
  👻 assets/old-logo.png → .ghost/assets/old-logo.png
  👻 images/backup/banner.jpg → .ghost/images/backup/banner.jpg
  📦 Desinstalando lodash
  📦 Desinstalando moment

📝 Creando commit...
📤 Subiendo branch...
📬 Pull Request creado: https://github.com/usuario/mi-app/pull/123

✅ Branch creada: fix/git-ghost-1743872154321
Ejemplo 3: Restaurar un archivo
bash
$ git-ghost restore assets/old-logo.png

👻 git-ghost restore
================================

✅ Restaurado: assets/old-logo.png

💡 Para guardar la restauración:
  git add assets/old-logo.png
  git commit -m "restore: recuperar assets/old-logo.png"
Ejemplo 4: Ver historial
bash
$ git-ghost history

👻 git-ghost history
================================

📋 Limpiezas anteriores:

4a3c235 2026-04-05 chore: eliminar dependencia simple-git no utilizada
2778562 2026-04-05 feat: v1 git-ghost
3f2a1b4 2026-04-04 chore: limpieza automática con git-ghost

👻 Archivos en .ghost/ actualmente: 21
💡 Para restaurar: git-ghost restore <archivo>
🔄 Flujo de Trabajo
Para un repositorio limpio









Para recuperar archivos




🛠️ Tecnologías
Node.js - Runtime JavaScript

ShellJS - Ejecución de comandos Git

Glob - Búsqueda de archivos

GitHub CLI - Creación de Pull Requests

🤝 Contribuir
¡Las contribuciones son bienvenidas!

Fork el proyecto

Crea tu rama: git checkout -b feature/nueva-funcion

Commit: git commit -m 'feat: agregar nueva funcion'

Push: git push origin feature/nueva-funcion

Abre un Pull Request

Reportar bugs
Usa el issue tracker

📄 Licencia
MIT © MikeDMart

👤 Autor
MikeDMart

GitHub: @MikeDMart

npm: @mikedmart

🙏 Agradecimientos
A todos los que usan y contribuyen a GitGhost

A la comunidad open source

📊 Estadísticas
<p align="center"> <img src="https://img.shields.io/github/stars/MikeDMart/GitGhost?style=social"> <img src="https://img.shields.io/github/forks/MikeDMart/GitGhost?style=social"> <img src="https://img.shields.io/npm/dm/@mikedmart/git-ghost"> <img src="https://img.shields.io/github/last-commit/MikeDMart/GitGhost"> </p>
🎯 Roadmap
Soporte para más tipos de archivos (PDF, DOC, etc.)

Integración con GitHub Actions

Modo CI/CD automático

Reportes HTML

Soporte para GitLab y Bitbucket

<p align="center"> <strong>Hecho con ❤️ para mantener repositorios limpios</strong> </p><p align="center"> <a href="https://github.com/MikeDMart/GitGhost">⭐ Dale una estrella en GitHub</a> </p> ```
