#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Rename workflow folders by popularity rank
 * Format: NUMBER-CategoryName
 * Example: 1-Webhook, 2-Schedule, 3-Googlesheets
 */

class FolderRenamer {
  constructor() {
    this.projectRoot = process.cwd();
    this.dryRun = process.argv.includes('--dry-run');
    this.skipConfirm = process.argv.includes('--skip-confirm');
    
    // Ranking from POPULAR_WORKFLOWS.md
    this.ranking = [
      'Webhook', 'Schedule', 'Googlesheets', 'Stickynote', 'Noop', 'Mattermost',
      'Form', 'Filter', 'Limit', 'Extractfromfile', 'Datetime', 'Error', 'Aggregate',
      'Openweathermap', 'Linkedin', 'Functionitem', 'Postgres', 'Shopify', 'Slack',
      'Github', 'Executeworkflow', 'Openai', 'Mautic', 'Googlecalendar', 'Gmail',
      'Emailreadimap', 'Respondtowebhook', 'Hubspot', 'Calendly', 'Zendesk', 'Localfile',
      'Googledocs', 'Gmailtool', 'Automation', 'Wordpress', 'Trello', 'Readbinaryfile',
      'Postgrestool', 'Hunter', 'Googlecalendartool', 'Executecommand', 'Automate',
      'Typeform', 'Twilio', 'Mondaycom', 'Microsoftoutlook', 'Googleanalytics', 'Gitlab',
      'Airtable', 'Woocommerce', 'Twitter', 'Send', 'Redis', 'Readbinaryfiles', 'Notion',
      'Netlify', 'Markdown', 'Lemlist', 'Googleslides', 'Googledrive', 'Converttofile',
      'Clockify', 'Clickup', 'Awss3', 'Asana', 'Writebinaryfile', 'Woocommercetool',
      'Wise', 'Whatsapp', 'Quickbooks', 'Odoo', 'Mysqltool', 'Mongodbtool', 'Mailjet',
      'Mailchimp', 'Jiratool', 'Jira', 'Graphql', 'Googletasks', 'Executiondata',
      'Emailsend', 'Editimage', 'Discordtool', 'Discord', 'Deep', 'Crypto', 'Create',
      'Compression', 'Bannerbear', 'Autopilot', 'Airtabletool', 'Zohocrm', 'Youtube',
      'Xml', 'Wufoo', 'Uptimerobot', 'Travisci', 'Toggl', 'Todoist', 'Thehive',
      'Telegramtool', 'Taiga', 'Signl4', 'Removeduplicates', 'Raindrop', 'Process',
      'Posthog', 'Onfleet', 'Nocodb', 'N8ntrainingcustomermessenger', 'Mqtt',
      'Microsofttodo', 'Microsoftonedrive', 'Microsoftexcel', 'Matrix', 'Mailerlite',
      'Mailcheck', 'Keap', 'Jotform', 'Invoiceninja', 'Interval', 'Intercom',
      'Humanticai', 'Helpscout', 'Gumroad', 'Grist', 'Gotowebinar', 'Googletranslate',
      'Googletaskstool', 'Googlesheetstool', 'Googledrivetool', 'Googlecontacts',
      'Googlebigquery', 'Getresponse', 'Flow', 'Figma', 'Facebookleadads', 'Facebook',
      'Export', 'Eventbrite', 'Emelia', 'Elasticsearch', 'Dropbox', 'Debughelper',
      'Customerio', 'Cron', 'Cortex', 'Copper', 'Convertkit', 'Comparedatasets',
      'Coingecko', 'Chargebee', 'Box', 'Bitwarden', 'Bitly', 'Bitbucket', 'Beeminder',
      'Baserow', 'Awstextract', 'Awssns', 'Awsrekognition', 'Apitemplateio', 'Amqp',
      'Airtoptool', 'Affinity', 'Acuityscheduling', 'Activecampaign'
    ];
  }

  getRankForFolder(folderName) {
    const lowerFolderName = folderName.toLowerCase();
    const rank = this.ranking.findIndex(
      name => name.toLowerCase() === lowerFolderName
    );
    return rank !== -1 ? rank + 1 : null;
  }

  getNewName(folderName, rank) {
    if (!rank) return null;
    return `${rank}-${folderName}`;
  }

  scanFolders() {
    const entries = fs.readdirSync(this.projectRoot, { withFileTypes: true });
    const folders = entries
      .filter(entry => 
        entry.isDirectory() && 
        !entry.name.startsWith('.') &&
        !['node_modules', 'website', 'scripts', 'workflows', '.git'].includes(entry.name)
      )
      .map(entry => entry.name);

    return folders;
  }

  performRename() {
    const folders = this.scanFolders();
    const renames = [];

    console.log('\n🎯 N8N Folder Renaming by Rank\n');
    console.log('============================\n');

    if (this.dryRun) {
      console.log('📋 DRY RUN MODE (no changes will be made)\n');
    }

    console.log(`📁 Found ${folders.length} workflow categories\n`);

    for (const folder of folders) {
      const rank = this.getRankForFolder(folder);
      if (!rank) {
        console.warn(`⚠️  Skipping "${folder}" - not in ranking list`);
        continue;
      }

      const newName = this.getNewName(folder, rank);
      if (newName && newName !== folder) {
        renames.push({ old: folder, new: newName, rank });
      }
    }

    // Sort by rank
    renames.sort((a, b) => a.rank - b.rank);

    console.log('📋 Rename Plan:\n');
    let lastRank = 0;
    for (const { old, new: newName, rank } of renames) {
      if (rank !== lastRank && lastRank > 0) {
        console.log('');
      }
      console.log(`   ${rank.toString().padStart(3)}: ${old} → ${newName}`);
      lastRank = rank;
    }

    console.log(`\n📊 Total: ${renames.length} folders to rename\n`);

    if (this.dryRun) {
      console.log('✅ Dry run complete. Use without --dry-run to apply changes.\n');
      return;
    }

    if (!this.skipConfirm) {
      console.log('ℹ️  Use --skip-confirm to skip this prompt\n');
      return;
    }

    console.log('🔄 Applying renames...\n');
    let successCount = 0;

    for (const { old, new: newName } of renames) {
      try {
        const oldPath = path.join(this.projectRoot, old);
        const newPath = path.join(this.projectRoot, newName);

        try {
          execSync(`git mv "${oldPath}" "${newPath}"`, { stdio: 'pipe' });
        } catch {
          // Fallback to fs.renameSync if git mv fails
          fs.renameSync(oldPath, newPath);
        }

        successCount++;
      } catch (error) {
        console.error(`❌ Failed to rename ${old}: ${error.message}`);
      }
    }

    console.log(`✅ Successfully renamed ${successCount}/${renames.length} folders\n`);
  }
}

const renamer = new FolderRenamer();
renamer.performRename();
