#!/usr/bin/env bash
set -euo pipefail

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

DRY_RUN=0
VERSION=""

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    *)
      if [[ -z "$VERSION" ]]; then
        VERSION="$1"
      else
        echo -e "${YELLOW}Unknown argument: $1${NC}"
        exit 1
      fi
      shift
      ;;
  esac
done

if [[ -z "$VERSION" ]]; then
  echo "Usage: $0 [--dry-run] <version>"
  exit 1
fi

# Validate SemVer format
if ! [[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?(\+[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?$ ]]; then
  echo -e "${YELLOW}Error: Version '$VERSION' is not a valid semantic version (e.g., 0.2.0)${NC}"
  exit 1
fi

echo -e "${CYAN}Preparing release v${VERSION}...${NC}"

if [[ $DRY_RUN -eq 1 ]]; then
  echo -e "${YELLOW}*** DRY RUN MODE: No files will be modified ***${NC}"
  
  echo "Would update package.json version to $VERSION"
  echo "Would update src-tauri/tauri.conf.json version to $VERSION"
  echo "Would update src-tauri/Cargo.toml version to $VERSION"
  
  echo "Would create directory structure release/v${VERSION}/{macos,windows,web}"
  echo "Would run 'npm run build' and copy dist/ to release/v${VERSION}/web/"
  echo "Would create git tag v${VERSION}"
  
  exit 0
fi

# Update package.json
if [[ -f "package.json" ]]; then
  echo -e "${CYAN}Updating package.json...${NC}"
  # Works on macOS and Linux
  sed -i.bak -E 's/"version": "[^"]+"/"version": "'"$VERSION"'"/' package.json
  rm -f package.json.bak
else
  echo -e "${YELLOW}Warning: package.json not found${NC}"
fi

# Update src-tauri/tauri.conf.json
if [[ -f "src-tauri/tauri.conf.json" ]]; then
  echo -e "${CYAN}Updating src-tauri/tauri.conf.json...${NC}"
  sed -i.bak -E 's/"version": "[^"]+"/"version": "'"$VERSION"'"/' src-tauri/tauri.conf.json
  rm -f src-tauri/tauri.conf.json.bak
else
  echo -e "${YELLOW}Warning: src-tauri/tauri.conf.json not found${NC}"
fi

# Update src-tauri/Cargo.toml
if [[ -f "src-tauri/Cargo.toml" ]]; then
  echo -e "${CYAN}Updating src-tauri/Cargo.toml...${NC}"
  sed -i.bak -E 's/^version = "[^"]+"/version = "'"$VERSION"'"/' src-tauri/Cargo.toml
  rm -f src-tauri/Cargo.toml.bak
else
  echo -e "${YELLOW}Warning: src-tauri/Cargo.toml not found${NC}"
fi

# Create directory structure
echo -e "${CYAN}Creating release directory structure...${NC}"
mkdir -p "release/v${VERSION}/macos"
mkdir -p "release/v${VERSION}/windows"
mkdir -p "release/v${VERSION}/web"

# Run web build
echo -e "${CYAN}Building web assets...${NC}"
if npm run build; then
  if [[ -d "dist" ]]; then
    cp -R dist/* "release/v${VERSION}/web/"
  else
    echo -e "${YELLOW}Warning: dist directory not found after build${NC}"
  fi
else
  echo -e "${YELLOW}Warning: Web build failed${NC}"
fi

# Create git tag
echo -e "${CYAN}Creating git tag v${VERSION}...${NC}"
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git add package.json src-tauri/tauri.conf.json src-tauri/Cargo.toml || true
  git commit -m "chore: bump version to v${VERSION}" || true
  git tag -a "v${VERSION}" -m "Release v${VERSION}" || echo -e "${YELLOW}Warning: Failed to create git tag. Tag might already exist.${NC}"
else
  echo -e "${YELLOW}Warning: Not a git repository, skipping tag creation${NC}"
fi

echo -e "${GREEN}Release v${VERSION} preparation complete!${NC}"
echo -e "${CYAN}-------------------------------------------------------${NC}"
echo -e "${CYAN}Instructions for platform-specific builds:${NC}"
echo -e "${CYAN}1. macOS Build (MUST run on macOS):${NC}"
echo -e "${CYAN}   npm run tauri build${NC}"
echo -e "${CYAN}   Copy generated .dmg / .app to release/v${VERSION}/macos/${NC}"
echo -e "${CYAN}2. Windows Build (MUST run on Windows):${NC}"
echo -e "${CYAN}   npm run tauri build${NC}"
echo -e "${CYAN}   Copy generated .msi / .exe to release/v${VERSION}/windows/${NC}"
echo -e "${CYAN}-------------------------------------------------------${NC}"
