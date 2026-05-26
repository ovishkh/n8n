# Requirements Document: n8n Workflow Library Website

## 1. Workflow Discovery and Documentation

### 1.1 Workspace Scanning
The system SHALL recursively scan the workspace directory structure to discover all n8n workflow JSON files organized in service-specific folders.

### 1.2 Workflow Parsing
The system SHALL parse each discovered JSON file to extract workflow metadata including name, description, nodes, connections, trigger type, and node types.

### 1.3 Error Handling During Discovery
The system SHALL log errors for invalid or malformed JSON files and continue processing remaining files without interruption.

### 1.4 Workflow Index Generation
The system SHALL generate a workflows.json file containing an index of all discovered workflows with complete metadata.

### 1.5 README Documentation Generation
The system SHALL generate a comprehensive README.md file that documents all discovered workflows organized by service category.

### 1.6 Table of Contents
The README.md SHALL include a table of contents with links to all service categories.

### 1.7 Workflow Statistics
The README.md SHALL include statistics showing total workflow count and number of categories.

### 1.8 Category Organization
The system SHALL organize workflows by their directory name (service category) in both README.md and workflows.json.

## 2. Web Application Interface

### 2.1 Single Page Application
The system SHALL provide a single-page web application built with pure HTML, CSS, and JavaScript without requiring build tools.

### 2.2 Workflow Grid Display
The application SHALL display workflows in a responsive grid layout with workflow cards showing key information.

### 2.3 Workflow Card Information
Each workflow card SHALL display the workflow name, category, trigger type, and node count.

### 2.4 Responsive Design
The application SHALL adapt its layout for desktop, tablet, and mobile screen sizes.

### 2.5 Application Initialization
The application SHALL load workflows.json on page load and initialize all components before user interaction.

### 2.6 Loading State
The application SHALL display a loading indicator while workflows.json is being fetched and parsed.

### 2.7 Error Display
The application SHALL display user-friendly error messages when workflows.json cannot be loaded.


## 3. Search Functionality

### 3.1 Search Input
The application SHALL provide a search input field that accepts text queries from users.

### 3.2 Real-Time Search
The application SHALL filter workflows in real-time as the user types in the search input.

### 3.3 Multi-Field Search
The search engine SHALL search across workflow names, descriptions, categories, and node types.

### 3.4 Fuzzy Matching
The search engine SHALL support partial matches and multi-term queries.

### 3.5 Search Scoring
The search engine SHALL rank results by relevance with name matches weighted highest, followed by category, node types, and description.

### 3.6 Empty Query Handling
The search engine SHALL display all workflows when the search query is empty.

### 3.7 Search Result Highlighting
The application SHALL highlight matching terms in search results.

### 3.8 No Results Message
The application SHALL display a "No workflows found" message when search returns zero results.

### 3.9 Search Performance
The search operation SHALL complete in under 100ms for up to 100 workflows.

### 3.10 Query Length Limit
The system SHALL truncate search queries exceeding 1000 characters and display a warning notification.

## 4. Workflow Detail View

### 4.1 Detail View Trigger
The application SHALL display a detailed workflow view when a user clicks on a workflow card.

### 4.2 Workflow Information Display
The detail view SHALL display the workflow name, description, category, trigger type, node count, and file path.

### 4.3 Node List Display
The detail view SHALL display a list of all nodes in the workflow with their names and types.

### 4.4 JSON Code Display
The detail view SHALL display the complete workflow JSON code with syntax highlighting.

### 4.5 Syntax Highlighting
The system SHALL apply syntax highlighting to JSON code with distinct colors for strings, numbers, booleans, null values, and keys.

### 4.6 Code Formatting
The system SHALL format JSON code with proper indentation (2 spaces) for readability.

### 4.7 XSS Prevention
The system SHALL escape all user-controlled content to prevent XSS attacks when displaying workflow data.

## 5. Copy and Download Features

### 5.1 Copy to Clipboard Button
The detail view SHALL provide a "Copy" button that copies the workflow JSON to the system clipboard.

### 5.2 Clipboard API Support
The system SHALL use the modern Clipboard API for copy operations when available.

### 5.3 Clipboard Fallback
The system SHALL fall back to document.execCommand('copy') when Clipboard API is not supported.

### 5.4 Copy Success Notification
The system SHALL display a success notification when JSON is successfully copied to clipboard.

### 5.5 Copy Error Handling
The system SHALL display an error notification and provide manual copy instructions when clipboard operations fail.

### 5.6 Download Button
The detail view SHALL provide a "Download" button that triggers a browser download of the workflow JSON file.

### 5.7 Download File Format
The downloaded file SHALL contain formatted JSON with 2-space indentation.

### 5.8 Download Filename
The downloaded file SHALL use the original workflow filename from the workspace.

### 5.9 Data Integrity
The downloaded file SHALL contain exactly the same data as the original workflow JSON without modification.


## 6. Recommendation Engine

### 6.1 Related Workflows Display
The detail view SHALL display a list of related workflows based on similarity analysis.

### 6.2 Similarity Calculation
The recommendation engine SHALL calculate similarity scores based on category match, node type overlap, trigger type match, and node count similarity.

### 6.3 Recommendation Limit
The system SHALL display up to 5 recommended workflows by default.

### 6.4 Recommendation Sorting
Recommended workflows SHALL be sorted by similarity score in descending order.

### 6.5 Self-Exclusion
The recommendation engine SHALL never recommend the currently displayed workflow.

### 6.6 Node Type Overlap Scoring
The system SHALL use Jaccard similarity (intersection over union) to score node type overlap between workflows.

### 6.7 Weighted Scoring
The similarity score SHALL weight node type overlap at 50%, category match at 30%, trigger type match at 10%, and node count similarity at 10%.

### 6.8 No Recommendations Message
The system SHALL display "No similar workflows found" when no recommendations are available.

### 6.9 Recommendation Click
Users SHALL be able to click on a recommended workflow to view its details.

## 7. Performance Requirements

### 7.1 Initial Page Load
The application SHALL load and display the workflow grid in under 2 seconds on modern browsers.

### 7.2 Search Response Time
Search results SHALL update in under 100ms after user input.

### 7.3 Detail View Rendering
The workflow detail view SHALL render in under 50ms after user click.

### 7.4 Smooth Scrolling
The application SHALL maintain 60 FPS during scrolling and animations.

### 7.5 File Size Optimization
The workflows.json file SHALL be under 500KB for 100 workflows.

### 7.6 Bundle Size
The combined HTML, CSS, and JavaScript SHALL be under 100KB uncompressed.

### 7.7 Syntax Highlighting Load
The syntax highlighting library SHALL load on-demand only when viewing workflow details.

## 8. Browser Compatibility

### 8.1 Modern Browser Support
The application SHALL support Chrome 90+, Firefox 88+, Safari 14+, and Edge 90+.

### 8.2 ES6+ Support
The application SHALL use ES6+ JavaScript features supported by target browsers.

### 8.3 Fetch API Requirement
The application SHALL require browser support for the Fetch API.

### 8.4 Clipboard API Requirement
The application SHOULD support the Clipboard API but SHALL provide fallback for browsers without support.

### 8.5 LocalStorage Support
The application MAY use localStorage for caching workflow data if available.

## 9. GitHub Integration

### 9.1 Git Repository Initialization
The system SHALL support initializing a Git repository in the workspace if one doesn't exist.

### 9.2 GitHub Repository Creation
The system SHALL support creating a new GitHub repository for the project.

### 9.3 Code Commit
The system SHALL commit all generated files (README.md, workflows.json, HTML, CSS, JS) to the repository.

### 9.4 GitHub Push
The system SHALL push all commits to the GitHub remote repository.

### 9.5 GitHub Pages Deployment
The system SHALL support deploying the web application to GitHub Pages.

### 9.6 Deployment Configuration
The system SHALL configure GitHub Pages to serve from the main branch root directory.

### 9.7 Gitignore Configuration
The system SHALL create a .gitignore file excluding node_modules, .DS_Store, and other unnecessary files.
