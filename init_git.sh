#!/bin/bash

# Initialize Git
git init
git branch -M main

# 1. chore: initialize Flux architecture
git add package.json package-lock.json tsconfig*.json vite.config.ts index.html .gitignore README.md src/main.tsx src/index.css src/vite-env.d.ts
git commit -m "chore: initialize Flux architecture" || true

# 2. feat: add layout and routing
git add src/App.tsx src/layouts src/pages
git commit -m "feat: add layout and routing" || true

# 3. feat: add servers and channels UI
git add src/features/servers src/features/channels src/components
git commit -m "feat: add servers and channels UI" || true

# 4. feat: add chat and DMs UI
git add src/features/chat src/store
git commit -m "feat: add chat and DMs UI" || true

# 5. feat: add profile and settings UI
git add src/features/server
git commit -m "feat: add profile and settings UI" || true

# 6. feat: add voice channel UI
git add src/features/voice
git commit -m "feat: add voice channel UI" || true

# 7. feat: polish animations and UI states
git add .
git commit -m "feat: polish animations and UI states" || true

echo "Git history generated successfully!"
git log --oneline
