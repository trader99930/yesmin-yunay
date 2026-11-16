#!/bin/bash
set -e

REPO_URL="https://github.com/trader99930/yesmin.git"
BRANCH="main"

echo "=========================================================="
echo "🚀 Pushing Yesmin AI Assistant to GitHub"
echo "Repo: $REPO_URL"
echo "=========================================================="

cd "$(dirname "$0")"

# Check if git is initialized
if [ ! -d ".git" ]; then
    git init
    git branch -M "$BRANCH"
fi

git config user.name "trader99930"
git config user.email "trader99930@users.noreply.github.com"

# Check remote
if ! git remote | grep -q origin; then
    git remote add origin "$REPO_URL"
else
    git remote set-url origin "$REPO_URL"
fi

git add -A
git commit -m "Initialize Yesmin AI Assistant v2.5.0 with 3D Hologram HUD & CI/CD" || true

TOKEN="$1"
if [ -n "$TOKEN" ]; then
    echo "Pushing using provided GitHub Token..."
    git push -u "https://${TOKEN}@github.com/trader99930/yesmin.git" "$BRANCH"
else
    echo "Pushing with system git credentials..."
    git push -u origin "$BRANCH"
fi

echo "=========================================================="
echo "✅ Successfully Pushed! Repository is live at:"
echo "👉 https://github.com/trader99930/yesmin"
echo "=========================================================="
