#!/usr/bin/env node

/**
 * N8N Workflow Folder Renaming Script
 * Renames all workflow folders to include popularity tier and workflow count
 * 
 * Example:
 * Webhook/ → 01-TOP-TIER-Webhook-n8n-automation (65 workflows)
 * Schedule/ → 02-TOP-TIER-Schedule-n8n-automation (52 workflows)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TIERS = {
  'TOP_TIER': { min: 50, prefix: '01', color: '🔴' },
  'POPULAR': { min: 10, prefix: '02', color: '🟠' },
  'COMMON': { min: 5, prefix: '03', color: '🟡' },
  'MEDIUM': { min: 3, prefix: '04', color: '🟢' },
  'SMALL': { min: 2, prefix: '05', color: '🔵' },
  'NICHE': { min: 1, prefix: '06', color: '🟣' }
};

class FolderRenamer {
  constructor() {
    this.projectRoot = process.cwd();
    this.renames = [];
    this.dryRun = process.argv.includes('--dry-run');
  }

  getTier(count) {
    if (count >= TIERS.TOP_TIER.min) return 'TOP_TIER';
    if (count >= TIERS.POPULAR.min) return 'POPULAR';
    if (count >= TIERS.COMMON.min) return 'COMMON';
    if (count >= TIERS.MEDIUM.min) return 'MEDIUM';
    if (count >= TIERS.SMALL.min) return 'SMALL';
    return 'NICHE';
  }

  countWorkflows(dirPath) {
    try {
      const files = fs.readdirSync(dirPath)
        .filter(f => f.endsWith('.json'));
      return files.length;
    } catch (e) {
      return 0;
    }
  }

  generateNewName(oldName, tier, count) {
    const tierInfo = TIERS[tier];
    // Format: PREFIX-TIER-CategoryName-n8n-automation-COUNT-workflows
    return `${tierInfo.prefix}-${tier}-${oldName}-n8n-automation-${count}-workflows`;
  }

  run() {
    console.log('\n🎯 N8N Folder Renaming Tool\n');
    console.log('============================\n');

    if (this.dryRun) {
      console.log('📋 DRY RUN MODE (no changes will be made)\n');
    }

    // Get all workflow directories
    const dirs = fs.readdirSync(this.projectRoot)
      .filter(f => {
        const fullPath = path.join(this.projectRoot, f);
        return fs.statSync(fullPath).isDirectory() && 
               !f.startsWith('.') && 
               !f.startsWith('01-') &&
               !f.startsWith('02-') &&
               !f.startsWith('03-') &&
               !f.startsWith('04-') &&
               !f.startsWith('05-') &&
               !f.startsWith('06-') &&
               f !== 'node_modules' &&
               f !== 'website' &&
               f !== 'scripts' &&
               f !== 'workflows';
      })
      .sort();

    console.log(`📁 Found ${dirs.length} workflow categories to rename\n`);

    let totalWorkflows = 0;
    const organized = {};

    // Generate rename plan
    dirs.forEach(dir => {
      const dirPath = path.join(this.projectRoot, dir);
      const count = this.countWorkflows(dirPath);
      
      if (count > 0) {
        const tier = this.getTier(count);
        const newName = this.generateNewName(dir, tier, count);
        
        if (!organized[tier]) {
          organized[tier] = [];
        }
        
        organized[tier].push({
          oldName: dir,
          newName: newName,
          count: count,
          oldPath: dirPath,
          newPath: path.join(this.projectRoot, newName)
        });

        totalWorkflows += count;
        this.renames.push({
          oldName: dir,
          newName: newName,
          count: count,
          tier: tier,
          oldPath: dirPath,
          newPath: path.join(this.projectRoot, newName)
        });
      }
    });

    // Display rename plan by tier
    console.log('📋 Rename Plan by Tier:\n');
    Object.entries(TIERS).forEach(([tierKey, tierInfo]) => {
      const items = organized[tierKey] || [];
      if (items.length === 0) return;

      console.log(`${tierInfo.color} ${tierKey} (${tierInfo.prefix}): ${items.length} folders`);
      items.slice(0, 3).forEach(item => {
        console.log(`   ${item.oldName} → ${item.newName}`);
      });
      if (items.length > 3) {
        console.log(`   ... and ${items.length - 3} more`);
      }
      console.log();
    });

    console.log(`📊 Total: ${this.renames.length} folders, ${totalWorkflows} workflows\n`);

    if (this.dryRun) {
      console.log('✅ Dry run complete. Use without --dry-run to apply changes.\n');
      return;
    }

    // Ask for confirmation
    console.log('⚠️  This will rename all workflow folders!\n');
    
    if (process.argv.includes('--skip-confirm')) {
      this.applyRenames();
    } else {
      console.log('To proceed, run with: --skip-confirm\n');
      console.log('Example: npm run rename-folders -- --skip-confirm\n');
    }
  }

  applyRenames() {
    console.log('🔄 Applying renames...\n');

    let successCount = 0;
    let errorCount = 0;

    this.renames.forEach((rename, index) => {
      try {
        // Rename using git for proper tracking
        try {
          execSync(`git mv "${rename.oldPath}" "${rename.newPath}"`, { 
            stdio: 'pipe',
            cwd: this.projectRoot 
          });
          console.log(`✓ [${index + 1}/${this.renames.length}] ${rename.oldName} → ${rename.newName}`);
          successCount++;
        } catch (gitError) {
          // If git mv fails, try regular rename
          fs.renameSync(rename.oldPath, rename.newPath);
          console.log(`✓ [${index + 1}/${this.renames.length}] ${rename.oldName} → ${rename.newName} (filesystem rename)`);
          successCount++;
        }
      } catch (error) {
        console.log(`✗ [${index + 1}/${this.renames.length}] Failed to rename ${rename.oldName}: ${error.message}`);
        errorCount++;
      }
    });

    console.log(`\n📊 Results:`);
    console.log(`  ✓ Successful: ${successCount}`);
    console.log(`  ✗ Failed: ${errorCount}\n`);

    if (successCount > 0) {
      console.log('🎯 Commit changes:\n');
      console.log('  git add -A');
      console.log('  git commit -m "refactor: Rename workflow folders by popularity tier"\n');
    }
  }
}

// Run
if (require.main === module) {
  const renamer = new FolderRenamer();
  renamer.run();
}

module.exports = FolderRenamer;
