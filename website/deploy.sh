#!/bin/bash

# N8N Workflow Library - Deploy Script
# This script extracts workflow metadata and prepares the website for deployment

set -e

echo "🚀 N8N Workflow Library Deployment Script"
echo "==========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo -e "${BLUE}📁 Project directory: $PROJECT_ROOT${NC}"

# Step 1: Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
cd "$PROJECT_ROOT"
npm install --silent

# Step 2: Extract workflow metadata
echo -e "${YELLOW}🔍 Extracting workflow metadata...${NC}"
npm run extract

# Step 3: Verify output
echo -e "${YELLOW}✅ Verifying output...${NC}"
if [ -f "$PROJECT_ROOT/website/data/workflows.json" ]; then
  WORKFLOW_COUNT=$(grep -o '"id"' "$PROJECT_ROOT/website/data/workflows.json" | wc -l)
  echo -e "${GREEN}✓ Found $WORKFLOW_COUNT workflows${NC}"
else
  echo -e "${RED}✗ workflows.json not found!${NC}"
  exit 1
fi

# Step 4: Check file integrity
echo -e "${YELLOW}📋 Checking file integrity...${NC}"
FILES=(
  "website/index.html"
  "website/styles.css"
  "website/app.js"
  "website/data/workflows.json"
)

for file in "${FILES[@]}"; do
  if [ -f "$PROJECT_ROOT/$file" ]; then
    SIZE=$(du -h "$PROJECT_ROOT/$file" | cut -f1)
    echo -e "${GREEN}✓ $file ($SIZE)${NC}"
  else
    echo -e "${RED}✗ $file missing!${NC}"
    exit 1
  fi
done

# Step 5: Generate report
echo -e "${BLUE}📊 Deployment Report${NC}"
echo "===================="

# Get statistics
TOTAL_SIZE=$(du -sh "$PROJECT_ROOT/website" | cut -f1)
HTML_SIZE=$(du -h "$PROJECT_ROOT/website/index.html" | cut -f1)
CSS_SIZE=$(du -h "$PROJECT_ROOT/website/styles.css" | cut -f1)
JS_SIZE=$(du -h "$PROJECT_ROOT/website/app.js" | cut -f1)
DATA_SIZE=$(du -h "$PROJECT_ROOT/website/data/workflows.json" | cut -f1)

echo "Website Size: $TOTAL_SIZE"
echo "  - index.html: $HTML_SIZE"
echo "  - styles.css: $CSS_SIZE"
echo "  - app.js: $JS_SIZE"
echo "  - workflows.json: $DATA_SIZE"

# Step 6: Ready message
echo ""
echo -e "${GREEN}✅ Ready for deployment!${NC}"
echo ""
echo "📍 Local testing:"
echo "   python3 -m http.server 8000 --directory website"
echo "   Then visit: http://localhost:8000"
echo ""
echo "🚀 GitHub Pages:"
echo "   Push to main branch and GitHub Actions will deploy automatically"
echo "   Visit: https://yourusername.github.io/n8n/website/"
echo ""

# Step 7: Optional - Run local server
if [ "$1" == "--serve" ]; then
  echo -e "${YELLOW}🌐 Starting local server...${NC}"
  cd "$PROJECT_ROOT/website"
  python3 -m http.server 8000
fi
