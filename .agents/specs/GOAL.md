# N8N Workflow Library 🚀

A comprehensive collection of **784 n8n automation workflows** organized by category with a modern, searchable web interface for easy discovery and integration.

## 📋 Overview

This repository contains 784 production-ready n8n workflows spanning across **172 different integration categories**, including:

- **Business Tools**: Slack, Microsoft Teams, Salesforce, HubSpot
- **Communication**: Gmail, Outlook, Twilio, WhatsApp
- **Data & Analytics**: Google Sheets, Airtable, MongoDB, PostgreSQL
- **Cloud Services**: AWS, Google Cloud, Azure
- **Project Management**: Asana, Monday.com, Jira, Trello
- **E-commerce**: Shopify, WooCommerce
- **Payment Processing**: Stripe, Square, PayPal
- **And many more...**

## 🎯 Quick Start

### Using the Web Interface

1. **Visit the website**: Open `website/index.html` in your browser
2. **Search**: Use the search bar to find workflows by name, ID, or category
3. **Filter**: Narrow results by category, node type, or workflow size
4. **View Details**: Click any workflow to see the full JSON configuration
5. **Copy or Download**: Export workflow JSON for direct use in n8n

### Running Locally

```bash
# Clone the repository
git clone https://github.com/yourusername/n8n.git
cd n8n

# Install dependencies (optional, for data extraction)
npm install

# Open website in browser
open website/index.html

# Or serve with a simple HTTP server
python3 -m http.server 8000
# Then visit http://localhost:8000/website
```

## 📁 Repository Structure

```
n8n-workflows/
├── website/                    # Web interface
│   ├── index.html             # Main page
│   ├── styles.css             # Styling
│   ├── app.js                 # Frontend logic
│   └── data/
│       └── workflows.json     # Workflow metadata
├── scripts/
│   └── extract-workflows.js   # Data extraction script
├── [Category Folders]/         # 172 workflow categories
│   ├── [workflow ID]_[name].json
│   └── ...
└── README.md
```

## 🔍 Workflow Categories

### Sample Categories:

- Activecampaign - Marketing automation
- Airtable - Database & spreadsheets
- Asana - Project management
- AWS (S3, SNS, Rekognition) - Cloud services
- Discord - Team communication
- Figma - Design tool integration
- Gmail - Email automation
- GitHub - Version control
- Google Sheets - Spreadsheet automation
- HubSpot - CRM platform
- Jira - Issue tracking
- MongoDB - NoSQL database
- Notion - Workspace
- PostgreSQL - Relational database
- Salesforce - CRM
- Shopify - E-commerce
- Slack - Team messaging
- Stripe - Payment processing
- Twilio - SMS/Voice
- Zapier integrations
- And 150+ more...

## 🔧 Workflow File Format

Each workflow file is a JSON configuration that can be imported directly into n8n:

```json
{
  "meta": {
    "instanceId": "..."
  },
  "nodes": [
    {
      "id": "...",
      "name": "Node Name",
      "type": "n8n-nodes-base.nodetype",
      "parameters": { ... },
      "credentials": { ... }
    }
  ],
  "connections": { ... }
}
```

**Filename Format**: `[ID]_[Category]_[Service1]_[Service2]_[TriggerType].json`

Example: `0057_Activecampaign_Create_Triggered.json`

## 🌐 Web Interface Features

### Search & Discovery

- **Full-Text Search**: Search by workflow name, category, ID, or node type
- **Auto-Complete**: Get suggestions as you type
- **Advanced Filters**: Filter by category, node type, and workflow size

### Workflow Management

- **Grid & List Views**: Switch between visual layouts
- **Detailed Information**: View node count, connections, size, and creation date
- **Related Workflows**: Discover similar workflows in the same category
- **Recommendations**: Browse featured, complex, and popular workflows

### JSON Tools

- **Syntax Highlighting**: Color-coded JSON viewer
- **Copy to Clipboard**: One-click copying
- **Download JSON**: Export workflows as .json files
- **Expandable Sections**: Collapse/expand JSON structure

### Statistics

- Total number of workflows
- Number of categories
- Currently visible workflows

## 📊 Workflow Statistics

| Metric                 | Value                                 |
| ---------------------- | ------------------------------------- |
| Total Workflows        | 784                                   |
| Categories             | 172                                   |
| Most Used Integrations | Slack, Gmail, Google Sheets, Airtable |
| Average Workflow Size  | 15 KB                                 |
| Date Range             | 2023 - Present                        |

## 🚀 Usage Examples

### Importing a Workflow

1. Open [n8n](https://n8n.io/) in your browser
2. Go to **Workflows** → **New Workflow**
3. Click **Import from URL** or paste JSON
4. Find desired workflow in this library
5. Copy the JSON (use the copy button or download the file)
6. Paste into n8n import dialog
7. Customize credentials and parameters
8. Deploy!

### Finding Workflows by Use Case

**Marketing Automation**: Search "Marketing" or filter by category (Activecampaign, MailChimp, HubSpot)

**Data Sync**: Search "Sync" or look in categories like Airtable, Google Sheets, PostgreSQL

**Notifications**: Filter by Slack, Discord, Twilio, Email categories

**E-commerce**: Browse Shopify, WooCommerce, or Stripe categories

## 🔄 Workflow Types

### Trigger Types

- **Webhook**: HTTP-triggered workflows
- **Scheduled/Cron**: Time-based execution
- **Triggered**: Manual trigger
- **Automate**: Automation trigger

### Node Types

- **Input Nodes**: Forms, Webhooks, Timers
- **Service Nodes**: API integrations with 3rd parties
- **Logic Nodes**: Conditions, loops, transformations
- **Output Nodes**: Send data, responses, webhooks

## 🛠️ Advanced Features

### Recommendations Engine

Intelligent recommendations based on:

- Workflow complexity (node count)
- Creation date (recent workflows)
- Category popularity

### Smart Filtering

- Combine multiple filters
- Real-time result updates
- Filter by workflow size (Small/Medium/Large)

### Related Workflows

Auto-suggest similar workflows from the same category

## 📱 Responsive Design

The web interface is fully responsive:

- **Desktop**: Full grid layout with sidebar
- **Tablet**: Stacked layout with collapsible sections
- **Mobile**: Single-column view with optimized navigation

## 🔐 Security & Privacy

- ✅ All workflows are read-only exports
- ✅ No credentials stored in JSON files
- ✅ You must add your own API keys and credentials in n8n
- ✅ All processing happens in your browser
- ✅ No data sent to external servers

## 🤝 Contributing

Found a useful workflow? Want to add your own?

1. Create a new `.json` file following the naming convention
2. Place it in the appropriate category folder
3. Submit a pull request
4. We'll review and merge!

## 🐛 Issues & Support

- **Bug Reports**: Open a GitHub issue
- **Workflow Questions**: Check existing issues first
- **Feature Requests**: Describe your use case in an issue

## 📝 Naming Convention

Workflow files follow this structure:

```
[ID]_[Category]_[Services]_[TriggerType].json
```

Examples:

- `0057_Activecampaign_Create_Triggered.json`
- `1002_Asana_Automate_Triggered.json`
- `1255_Webhook_Respondtowebhook_Webhook.json`

**Components**:

- **ID**: Unique numeric identifier
- **Category**: Primary integration category
- **Services**: Additional services/integrations involved
- **TriggerType**: How the workflow is triggered (Triggered, Webhook, Scheduled, Automate)

## 🔗 Useful Links

- [N8N Official Website](https://n8n.io/)
- [N8N Documentation](https://docs.n8n.io/)
- [N8N Community Forum](https://community.n8n.io/)
- [N8N GitHub Repository](https://github.com/n8n-io/n8n)

## 📊 Category Breakdown

Top categories by workflow count:

1. Webhook (HTTP endpoints)
2. Execute Workflow
3. Filter & Transform
4. Slack
5. Gmail
6. Google Sheets
7. Airtable
8. HTTP Request
9. Send Email
10. Discord

## 💡 Tips & Tricks

### Search Operators

- **ID Search**: Type `0057` to find workflow by ID
- **Category Search**: Type `Slack` to find all Slack workflows
- **Node Search**: Type `filter` to find workflows using Filter nodes

### Performance

- Complex workflows (20+ nodes) are great for learning
- Simple workflows (2-5 nodes) are quick to deploy
- Use the size filter to find workflows matching your complexity needs

### Customization

- All workflows are templates - customize to your needs
- Modify node parameters, add conditions, change outputs
- Combine multiple workflows for complex automations

## 📄 License

[Specify your license here - MIT, Apache 2.0, etc.]

## 🙏 Acknowledgments

- N8N Team for the amazing automation platform
- Community contributors who created these workflows
- Open source tools and libraries used in this project

## 📮 Contact & Support

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: [your-email@example.com]
- **Community**: Join [N8N Community Forum](https://community.n8n.io/)

---

**Last Updated**: 26 May 2026
**Total Workflows**: 784
**Categories**: 172
**Format Version**: 1.0.0

Enjoy automating with N8N! 🎉
