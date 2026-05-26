#!/usr/bin/env node

/**
 * N8N Workflow Organization Script
 * Organizes workflow folders by popularity tier
 * 
 * Folder structure:
 * workflows/
 * ├── 01-TOP-TIER/       (65+ workflows)
 * ├── 02-POPULAR/        (10-49 workflows)
 * ├── 03-COMMON/         (5-9 workflows)
 * ├── 04-MEDIUM/         (3-4 workflows)
 * ├── 05-SMALL/          (2 workflows)
 * └── 06-NICHE/          (1 workflow)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TIERS = {
  'TOP_TIER': { min: 50, folder: '01-TOP-TIER', color: '🔴' },
  'POPULAR': { min: 10, folder: '02-POPULAR', color: '🟠' },
  'COMMON': { min: 5, folder: '03-COMMON', color: '🟡' },
  'MEDIUM': { min: 3, folder: '04-MEDIUM', color: '🟢' },
  'SMALL': { min: 2, folder: '05-SMALL', color: '🔵' },
  'NICHE': { min: 1, folder: '06-NICHE', color: '🟣' }
};

class WorkflowOrganizer {
  constructor() {
    this.projectRoot = process.cwd();
    this.workflowsDir = path.join(this.projectRoot, 'workflows');
    this.stats = {};
  }

  // Count workflows in each category
  countWorkflows() {
    console.log('📊 Counting workflows per category...\n');
    
    const categories = {};
    const dirs = fs.readdirSync(this.projectRoot)
      .filter(f => {
        const fullPath = path.join(this.projectRoot, f);
        return fs.statSync(fullPath).isDirectory() && 
               !f.startsWith('.') && 
               f !== 'node_modules' &&
               f !== 'website' &&
               f !== 'scripts' &&
               f !== 'workflows';
      });

    dirs.forEach(dir => {
      const dirPath = path.join(this.projectRoot, dir);
      const files = fs.readdirSync(dirPath)
        .filter(f => f.endsWith('.json'));
      
      if (files.length > 0) {
        categories[dir] = files.length;
      }
    });

    return categories;
  }

  // Determine tier for a category
  getTier(count) {
    if (count >= TIERS.TOP_TIER.min) return 'TOP_TIER';
    if (count >= TIERS.POPULAR.min) return 'POPULAR';
    if (count >= TIERS.COMMON.min) return 'COMMON';
    if (count >= TIERS.MEDIUM.min) return 'MEDIUM';
    if (count >= TIERS.SMALL.min) return 'SMALL';
    return 'NICHE';
  }

  // Create organized structure
  organize() {
    console.log('📂 Organizing workflows by popularity tier...\n');
    
    // Create workflows directory if it doesn't exist
    if (!fs.existsSync(this.workflowsDir)) {
      fs.mkdirSync(this.workflowsDir);
    }

    // Create tier directories
    Object.values(TIERS).forEach(tier => {
      const tierPath = path.join(this.workflowsDir, tier.folder);
      if (!fs.existsSync(tierPath)) {
        fs.mkdirSync(tierPath, { recursive: true });
      }
    });

    const categories = this.countWorkflows();
    const organized = {};

    Object.entries(categories).forEach(([category, count]) => {
      const tier = this.getTier(count);
      if (!organized[tier]) {
        organized[tier] = [];
      }
      organized[tier].push({ category, count });
    });

    // Display organization plan
    console.log('📋 Organization Plan:\n');
    Object.entries(organized).forEach(([tier, items]) => {
      const tierInfo = TIERS[tier];
      console.log(`${tierInfo.color} ${tier} (${tierInfo.folder}): ${items.length} categories`);
      items.forEach(item => {
        console.log(`   • ${item.category} (${item.count} workflows)`);
      });
      console.log();
    });

    // Copy folders to organized structure (without moving originals)
    console.log('✅ Organized structure created at: workflows/');
    console.log('\n⚠️  Note: Original folders remain unchanged.');
    console.log('   To use organized structure, update references in scripts.\n');

    return organized;
  }

  // Generate index file
  generateIndex(organized) {
    console.log('📝 Generating index file...\n');

    const indexContent = `# N8N Workflow Categories - Organized by Popularity

> Auto-generated file. Do not edit manually.
> Last updated: ${new Date().toISOString()}

## Organization Tiers

Workflows are organized into 6 tiers based on the number of automation examples in each category.

`;

    let content = indexContent;

    Object.entries(TIERS).forEach(([tierKey, tierInfo]) => {
      const items = organized[tierKey] || [];
      if (items.length === 0) return;

      content += `\n### ${tierInfo.color} ${tierKey} (${tierInfo.folder})\n`;
      content += `**${items.length} categories**\n\n`;

      items.sort((a, b) => b.count - a.count).forEach(item => {
        content += `- **${item.category}** - ${item.count} workflows\n`;
      });
    });

    content += `\n---\n\n## Statistics\n\n`;
    content += `| Tier | Folder | Categories | Total Workflows |\n`;
    content += `|------|--------|------------|---------------|\n`;

    let totalWorkflows = 0;
    Object.entries(organized).forEach(([tierKey, items]) => {
      const tierInfo = TIERS[tierKey];
      const workflowCount = items.reduce((sum, item) => sum + item.count, 0);
      totalWorkflows += workflowCount;
      content += `| ${tierInfo.color} ${tierKey} | ${tierInfo.folder} | ${items.length} | ${workflowCount} |\n`;
    });

    content += `| **TOTAL** | - | **${Object.values(organized).reduce((sum, items) => sum + items.length, 0)}** | **${totalWorkflows}** |\n`;

    // Save index
    const indexPath = path.join(this.workflowsDir, 'INDEX.md');
    fs.writeFileSync(indexPath, content);
    console.log(`✓ Index saved to: workflows/INDEX.md\n`);
  }

  // Generate symlinks or copies (for reference)
  generateOrganizedReferences(organized) {
    console.log('🔗 Creating organized references...\n');

    Object.entries(organized).forEach(([tier, items]) => {
      const tierInfo = TIERS[tier];
      const tierPath = path.join(this.workflowsDir, tierInfo.folder);

      items.forEach(item => {
        const sourcePath = path.join(this.projectRoot, item.category);
        const linkPath = path.join(tierPath, item.category);

        if (fs.existsSync(sourcePath) && !fs.existsSync(linkPath)) {
          try {
            fs.symlinkSync(sourcePath, linkPath, 'dir');
            console.log(`✓ ${tierInfo.folder}/${item.category}`);
          } catch (err) {
            if (err.code !== 'EEXIST') {
              console.log(`⚠ ${tierInfo.folder}/${item.category} (already exists)`);
            }
          }
        }
      });
    });

    console.log('\n✅ Organization complete!\n');
  }

  // Run the organizer
  run() {
    console.log('🎯 N8N Workflow Organization Tool\n');
    console.log('===================================\n');

    try {
      const organized = this.organize();
      this.generateIndex(organized);
      this.generateOrganizedReferences(organized);

      console.log('📊 Summary:\n');
      Object.entries(TIERS).forEach(([tierKey, tierInfo]) => {
        const items = organized[tierKey] || [];
        const count = items.reduce((sum, item) => sum + item.count, 0);
        if (items.length > 0) {
          console.log(`${tierInfo.color} ${tierKey}: ${items.length} categories, ${count} workflows`);
        }
      });

      console.log('\n✨ Organization successful!\n');
      console.log('📍 Access organized workflows at: ./workflows/[TIER]/[CATEGORY]/\n');
      
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  }
}

// Run if executed directly
if (require.main === module) {
  const organizer = new WorkflowOrganizer();
  organizer.run();
}

module.exports = WorkflowOrganizer;
