# N8N Workflows Collection 🚀

Welcome to the **N8N Workflows Library** - A comprehensive collection of **784 production-ready automation workflows** organized by category with a modern, searchable web interface.

## ✨ Features

- 🔍 **Smart Search**: Full-text search across 784 workflows
- 🏷️ **Organized by Categories**: 172 different integration categories
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 📋 **JSON Viewer**: Syntax-highlighted workflow code
- 📥 **Easy Export**: Copy or download workflows as JSON
- 🎯 **Recommendations**: Intelligent workflow suggestions
- 🔗 **Related Workflows**: Discover similar workflows in the same category
- ⚡ **Advanced Filtering**: Filter by category, node type, and size

## 🚀 Quick Start

### Using the Web Interface

1. **Open the website**: [website/index.html](website/index.html)
2. **Search** for workflows by name, category, or integration
3. **Filter** results by category, node type, or workflow size
4. **View Details** - click any workflow to see full JSON
5. **Copy or Download** the workflow JSON for use in n8n

### Running Locally

```bash
# Extract workflow metadata (only needed if updating)
npm run extract

# Serve the website
npm run serve

# Then open http://localhost:8000/website in your browser
```

## 📂 Repository Structure

```
├── website/                      # Web interface
│   ├── index.html               # Main page
│   ├── styles.css               # CSS styling
│   ├── app.js                   # JavaScript application
│   └── data/workflows.json      # Workflow metadata
├── scripts/
│   └── extract-workflows.js     # Data extraction script
├── .agents/                      # Agent configurations
├── [Category Folders]/           # 172+ workflow categories
│   └── [workflow].json
└── README.md
```

## 📚 Workflow Categories

The collection includes workflows for:

**Communication**: Gmail, Outlook, Slack, Discord, Twilio, WhatsApp, Microsoft Teams

**Business**: Salesforce, HubSpot, Pipedrive, Monday.com, Asana, Jira, Trello

**Data & Storage**: Google Sheets, Airtable, MongoDB, PostgreSQL, MySQL, Redis, Firebase

**Cloud Services**: AWS (S3, SNS, Lambda), Google Cloud, Azure, Netlify

**E-commerce**: Shopify, WooCommerce, Stripe, PayPal, Square

**Automation**: Zapier, IFTTT, Integromat, Automate tools

**And 150+ more integrations!**

## 🎯 Key Statistics

| Metric | Count |
|--------|-------|
| Total Workflows | 784 |
| Categories | 172 |
| Total Nodes | ~12,000+ |
| Largest Workflow | 125+ nodes |
| Average Workflow | 15 nodes |

## 🔍 How to Find Workflows

### By Search
Type in the search box to find workflows by:
- Workflow name
- Category (e.g., "Slack", "Gmail")
- Integration service (e.g., "Airtable", "Stripe")
- Workflow ID

### By Filtering
Use filters to narrow down by:
- **Category**: Select one or multiple categories
- **Node Type**: Filter by integration type
- **Size**: Small (<5KB), Medium (5-20KB), Large (>20KB)

### Recommendations
Browse recommended workflows:
- **Complex Workflows**: Most nodes (great for learning)
- **Recent Workflows**: Latest additions
- **Popular Categories**: Most used integrations

## 📥 How to Use Workflows

### Import into N8N

1. **Find the workflow** you want in the library
2. **Copy the JSON** (click "Copy JSON" button)
3. **Open N8N** and go to: Workflows → New → Import from Clipboard
4. **Paste the JSON** and click Import
5. **Update credentials** with your own API keys
6. **Customize parameters** as needed
7. **Deploy** the workflow

### Download and Use

Alternatively, download the workflow JSON file directly and:
1. Import it into N8N from file
2. Share it with teammates
3. Version control in your own repository

## 🛠️ Workflow File Format

Each workflow is a JSON file following this format:

```json
{
  "meta": {
    "instanceId": "unique-id"
  },
  "nodes": [
    {
      "id": "node-id",
      "name": "Node Name",
      "type": "n8n-nodes-base.nodetype",
      "position": [x, y],
      "parameters": { ... },
      "credentials": { ... }
    }
  ],
  "connections": { ... }
}
```

**Naming Convention**: `[ID]_[Category]_[Services]_[TriggerType].json`

Example: `0057_Activecampaign_Create_Triggered.json`

## 🔧 Development

### Extract Workflow Data

To regenerate the workflow metadata JSON:

```bash
npm run extract
```

This will:
- Scan all workflow files
- Extract metadata (nodes, connections, size, etc.)
- Generate `website/data/workflows.json`
- Update category statistics

### Project Structure

```javascript
// Main application class
class WorkflowLibrary {
  - loadWorkflows()      // Load workflow data
  - handleSearch()       // Search functionality
  - performSearch()      // Execute search with filters
  - applyFilters()       // Apply category/node/size filters
  - renderWorkflows()    // Display workflows in grid/list
  - openModal()          // Show workflow details
  - copyJson()           // Copy to clipboard
  - downloadJson()       // Download as file
}
```

## 📊 Features Explained

### Search Engine
- Real-time search as you type
- Autocomplete suggestions
- Search by: name, category, ID, node type
- Instant filtering of results

### View Options
- **Grid View**: Visual workflow cards with metadata
- **List View**: Compact list with essential info
- Toggle between views seamlessly

### Detailed Workflow View
- Syntax-highlighted JSON viewer
- Expandable/collapsible sections
- Copy or download functionality
- Related workflows section
- Complete metadata display

### Recommendations
- Algorithmically generated suggestions
- Based on complexity, recency, and popularity
- Helps discover relevant workflows

## 🔐 Security & Privacy

✅ **Safe to use**: All files are read-only exports
✅ **No credentials stored**: You add your own API keys in N8N
✅ **Browser-based processing**: No data sent to servers
✅ **Open source**: Fully transparent code

## 🤝 Contributing

Found a useful workflow? Want to add your own?

1. Create a JSON file in the appropriate category folder
2. Follow the naming convention
3. Submit a pull request
4. We'll review and merge!

## 📖 Documentation

For more detailed information, see:
- [Workflows README](WORKFLOWS_README.md) - Detailed workflow guide
- [N8N Docs](https://docs.n8n.io/) - Official N8N documentation
- [N8N Community](https://community.n8n.io/) - Community forum

## 🔗 Useful Resources

- **N8N Official**: https://n8n.io/
- **Documentation**: https://docs.n8n.io/
- **Community**: https://community.n8n.io/
- **GitHub**: https://github.com/n8n-io/n8n

## 🐛 Issues & Support

- Report bugs via GitHub Issues
- Ask questions in Discussions
- Check existing issues first

## 📝 License

This project is provided as-is for educational and commercial use.

## 🙌 Acknowledgments

- N8N Team for the amazing platform
- Community contributors
- All the workflow creators

---

**📌 Start automating today!** Open [website/index.html](website/index.html) to explore thousands of ready-to-use workflows.

**Last Updated**: 26 May 2026  
**Total Workflows**: 784  
**Categories**: 172
