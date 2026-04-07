# 👻 GitGhost

<p align="center">
  <img src="https://raw.githubusercontent.com/MikeDMart/GitGhost/main/assets/logo.png" alt="GitGhost Logo" width="180">
</p>

<p align="center">
  <strong>Automatically detect duplicate files, orphaned images, and dead dependencies — then ship a clean PR.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue?style=flat-square">
  <img src="https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?style=flat-square">
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square">
  <img src="https://img.shields.io/npm/dm/@homelab/git-ghost?style=flat-square">
</p>

---

## What is GitGhost?

GitGhost is a zero-config CLI tool that audits your repository for things that shouldn't be there — duplicate files, images nobody references, and npm packages nobody imports. When it finds them, it opens a Pull Request with everything cleaned up, so your team can review before anything gets deleted for good.

Nothing is permanently removed without your approval. Ghost files move to `.ghost/` for safe recovery. Duplicates stay in place until the PR is merged. Your repo stays clean without the risk.

---

## Features

| | Feature | Description |
|---|---|---|
| 🔍 | **Duplicate detection** | Finds files with identical content using MD5 hashing |
| 🖼️ | **Orphaned images** | Detects images not referenced in any HTML, CSS, or JS file |
| 📦 | **Dead dependencies** | Identifies npm packages installed but never imported |
| 🌿 | **Auto branch** | Creates a timestamped cleanup branch automatically |
| 📬 | **Auto PR** | Opens a Pull Request on GitHub via the `gh` CLI |
| ♻️ | **Safe restore** | Recovers any file moved to `.ghost/` with one command |
| 📊 | **History** | Shows a log of every cleanup ever run on the repo |
| 🚀 | **CI/CD mode** | GitHub Actions integration *(coming soon)* |

---

## Installation

**Via npm (recommended)**
```bash
npm install -g @homelab/git-ghost
Via GitHub

bash
git clone https://github.com/MikeDMart/GitGhost.git
cd GitGhost
npm link
Without installing

bash
npx github:MikeDMart/GitGhost audit
Verify

bash
git-ghost --version
# git-ghost v1.0.0
Requires GitHub CLI (gh) for the --pr flag. Install it and run gh auth login once.

Quick Start
bash
# Step into your project
cd /path/to/your/repo

# See what's haunting it (read-only, nothing changes)
git-ghost audit

# Fix everything and open a PR for review
git-ghost fix --pr
That's it. Review the PR, restore anything you want back, merge when ready.

Commands
Command	Description
git-ghost audit	Scan and report — no changes made
git-ghost fix	Apply fixes on a new local branch
git-ghost fix --pr	Apply fixes and open a GitHub Pull Request
git-ghost restore <file>	Recover a file from .ghost/
git-ghost history	Show all previous cleanup commits
git-ghost help	Show usage information
How it works
Audit
GitGhost scans your working directory and reports three categories of findings:

Duplicate files — reads every .js, .css, .html, .json, and .md file, hashes the content with MD5, and flags any file whose hash matches another. The first occurrence is kept; duplicates are marked for removal.

Orphaned images — finds every .png, .jpg, .jpeg, .gif, .svg, and .webp file, then checks whether its filename or path appears anywhere in your source code. If nothing references it, it's a ghost.

Dead dependencies — reads dependencies and devDependencies from package.json and checks whether each package name appears in a require() or import statement anywhere in your JS/TS files. If it doesn't, it's flagged.

Fix
When you run git-ghost fix:

Creates a branch named fix/git-ghost-<timestamp>

Moves orphaned images to .ghost/ (preserving directory structure)

Deletes confirmed duplicate files (keeping the first occurrence)

Commits all changes with a detailed message

Pushes the branch to origin

Optionally opens a Pull Request with a review checklist

Nothing in .ghost/ is deleted — it's a quarantine folder, not a trash can.

Examples
Basic audit
text
$ git-ghost audit

👻 git-ghost audit
================================

📁 DUPLICATE FILES:
  📄 styles/main.css
     identical to: styles/style.css
  📄 utils/helpers.js
     identical to: lib/utils.js

🖼️  UNREFERENCED IMAGES:
  📄 assets/old-logo.png
  📄 images/backup/banner.jpg

📦 ORPHANED DEPENDENCIES:
  📦 lodash
  📦 moment

💡 Tip:
  Run git-ghost fix --pr to open a PR with all fixes applied
Automated cleanup with PR
text
$ git-ghost fix --pr

👻 git-ghost fix
================================

📊 Running audit...

📋 Fix summary:
  🗑️  Duplicates:            2
  👻 Unreferenced images:   2
  📦 Orphaned dependencies: 2

🌿 Creating branch: fix/git-ghost-1743872154321

🔧 Applying fixes...
  👻 assets/old-logo.png → .ghost/assets/old-logo.png
  👻 images/backup/banner.jpg → .ghost/images/backup/banner.jpg
  🗑️  Removed: styles/main.css
  🗑️  Removed: utils/helpers.js

📝 Creating commit...
📤 Pushing branch...
📬 Pull Request created: https://github.com/username/my-app/pull/123

✅ Branch ready: fix/git-ghost-1743872154321
Restoring a file
text
$ git-ghost restore assets/old-logo.png

👻 git-ghost restore
================================

✅ Restored: assets/old-logo.png

💡 To commit the restoration:
  git add assets/old-logo.png
  git commit -m "restore: recover assets/old-logo.png"
Viewing history
text
$ git-ghost history

👻 git-ghost history
================================

📋 Previous cleanups:

4a3c235 2026-04-05 chore: automated cleanup via git-ghost
2778562 2026-04-05 feat: v1 git-ghost
3f2a1b4 2026-04-04 chore: remove unused dependency simple-git

👻 Files currently in .ghost/: 21
💡 To restore: git-ghost restore <file>
Project structure
text
GitGhost/
├── bin/
│   └── git-ghost.js      # CLI entry point
├── lib/
│   ├── audit.js          # Scan and report
│   ├── fix.js            # Apply fixes and create PR
│   ├── restore.js        # Recover files from .ghost/
│   ├── history.js        # Show cleanup log
│   └── utils.js          # File scanning and hashing logic
├── .gitignore
├── package.json
└── README.md
Workflow
text
your repo
    │
    ▼
git-ghost audit          ← read-only scan, nothing changes
    │
    ▼
git-ghost fix --pr       ← branch created, fixes applied, PR opened
    │
    ▼
review PR on GitHub      ← check what was removed, restore if needed
    │
    ▼
merge                    ← repo is clean
If anything was removed by mistake:

text
git-ghost restore <file>    ← pulls it back from .ghost/
git add <file>
git commit -m "restore: recover <file>"
Tech stack
Node.js — runtime

glob — recursive file pattern matching

crypto — MD5 hashing for duplicate detection

child_process — git and gh CLI integration

fs / path — file operations and ghost quarantine

Contributing
Contributions are welcome. Here's how:

bash
# Fork the repo, then:
git checkout -b feature/your-feature
git commit -m 'feat: describe your change'
git push origin feature/your-feature
# Open a Pull Request
Found a bug? Open an issue in the issue tracker.

Roadmap
Support for more file types (PDF, DOC, SVG sprites)

GitHub Actions integration for automated CI runs

HTML audit reports

GitLab and Bitbucket support

Config file (.ghostrc) for custom ignore patterns

License
MIT © MikeDMart

<p align="center"> <a href="https://github.com/MikeDMart/GitGhost">⭐ Star on GitHub</a> &nbsp;·&nbsp; <a href="https://github.com/MikeDMart/GitGhost/issues">🐛 Report a bug</a> &nbsp;·&nbsp; <a href="https://github.com/MikeDMart/GitGhost/issues">💡 Request a feature</a> </p> ```