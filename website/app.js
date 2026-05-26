// N8N Workflow Library - Main Application

class WorkflowLibrary {
    constructor() {
        this.workflows = [];
        this.filteredWorkflows = [];
        this.allData = {};
        this.currentView = 'grid';
        this.selectedFilters = {
            search: '',
            categories: [],
            nodes: [],
            size: null
        };
        this.init();
    }

    async init() {
        try {
            await this.loadWorkflows();
            this.setupEventListeners();
            this.displayRecommendations();
            this.updateStats();
            this.buildFilters();
        } catch (error) {
            console.error('Failed to initialize:', error);
            this.showToast('Failed to load workflows', 'error');
        }
    }

    async loadWorkflows() {
        const response = await fetch('./data/workflows.json');
        this.allData = await response.json();
        this.workflows = this.allData.workflows || [];
        this.filteredWorkflows = [...this.workflows];
    }

    setupEventListeners() {
        // Search
        document.getElementById('searchInput').addEventListener('input', (e) => this.handleSearch(e));

        // View toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchView(e.target.closest('.view-btn')));
        });

        // Filter toggles
        document.getElementById('filterByNodes').addEventListener('change', () => this.toggleFilterSection('nodeFilters'));
        document.getElementById('categoryToggle').addEventListener('change', () => this.toggleFilterSection('categoryList'));
        document.getElementById('sizeToggle').addEventListener('change', () => this.toggleFilterSection('sizeFilters'));

        // Category filters
        document.getElementById('categoryList').addEventListener('change', (e) => {
            if (e.target.tagName === 'INPUT') this.applyFilters();
        });

        // Size filters
        document.querySelectorAll('.size-filter').forEach(radio => {
            radio.addEventListener('change', () => this.applyFilters());
        });

        // Clear filters
        document.getElementById('clearFilters').addEventListener('click', () => this.clearAllFilters());

        // Modal
        document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
        document.getElementById('workflowModal').addEventListener('click', (e) => {
            if (e.target.id === 'workflowModal') this.closeModal();
        });

        // JSON buttons
        document.getElementById('copyJsonBtn').addEventListener('click', () => this.copyJson());
        document.getElementById('downloadJsonBtn').addEventListener('click', () => this.downloadJson());
    }

    handleSearch(e) {
        this.selectedFilters.search = e.target.value.toLowerCase();
        this.performSearch();
    }

    performSearch() {
        const searchTerm = this.selectedFilters.search.trim();
        
        if (searchTerm.length > 0) {
            this.filteredWorkflows = this.workflows.filter(w => {
                // Convert to lowercase for case-insensitive search
                const term = searchTerm.toLowerCase();
                
                // Search in multiple fields with weighted importance
                const nameMatch = w.name.toLowerCase().includes(term);
                const categoryMatch = w.category.toLowerCase().includes(term);
                const fileNameMatch = w.fileName.toLowerCase().includes(term);
                const idMatch = w.id.toLowerCase().includes(term);
                const nodeNamesMatch = w.nodes.some(node => node.toLowerCase().includes(term));
                const nodeTypesMatch = w.nodeTypes.some(type => type.toLowerCase().includes(term));
                
                // Return true if any match found
                return nameMatch || categoryMatch || fileNameMatch || idMatch || nodeNamesMatch || nodeTypesMatch;
            });

            // Show search suggestions
            this.showSearchSuggestions(searchTerm);
            
            // Show results section and hide recommendations
            this.showSearchResults();
            this.renderWorkflows();
        } else {
            // Clear suggestions
            document.getElementById('searchSuggestions').classList.add('hidden');
            this.displayRecommendations();
            this.hideSearchResults();
            this.filteredWorkflows = [...this.workflows];
        }
        
        this.updateStats();
    }

    showSearchSuggestions(term) {
        const suggestions = this.workflows
            .filter(w => w.name.toLowerCase().includes(term))
            .slice(0, 8);
        
        const suggestionsEl = document.getElementById('searchSuggestions');
        suggestionsEl.innerHTML = suggestions.map(s => 
            `<div class="suggestion-item" data-name="${s.name}">${s.name}</div>`
        ).join('');

        suggestions.length > 0 ? suggestionsEl.classList.remove('hidden') : suggestionsEl.classList.add('hidden');

        document.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                document.getElementById('searchInput').value = item.dataset.name;
                this.selectedFilters.search = item.dataset.name.toLowerCase();
                this.performSearch();
            });
        });
    }

    showSearchResults() {
        document.getElementById('recommendationsSection').classList.add('hidden');
        document.getElementById('resultsSection').classList.remove('hidden');
    }

    hideSearchResults() {
        document.getElementById('resultsSection').classList.add('hidden');
        document.getElementById('recommendationsSection').classList.remove('hidden');
    }

    applyFilters() {
        let results = this.workflows;

        // Apply search filter
        if (this.selectedFilters.search) {
            results = results.filter(w =>
                w.name.toLowerCase().includes(this.selectedFilters.search) ||
                w.category.toLowerCase().includes(this.selectedFilters.search) ||
                w.nodes.some(node => node.toLowerCase().includes(this.selectedFilters.search)) ||
                w.id.toLowerCase().includes(this.selectedFilters.search)
            );
        }

        // Apply category filter
        if (this.selectedFilters.categories.length > 0) {
            results = results.filter(w => this.selectedFilters.categories.includes(w.category));
        }

        // Apply node filter
        if (this.selectedFilters.nodes.length > 0) {
            results = results.filter(w =>
                w.nodes.some(node => this.selectedFilters.nodes.some(filter => node.toLowerCase().includes(filter.toLowerCase())))
            );
        }

        // Apply size filter
        if (this.selectedFilters.size) {
            results = results.filter(w => this.filterBySize(w.size));
        }

        this.filteredWorkflows = results;
        this.renderWorkflows();
        this.updateStats();
    }

    filterBySize(size) {
        const sizeFilter = this.selectedFilters.size;
        if (sizeFilter === 'small') return size < 5120; // < 5KB
        if (sizeFilter === 'medium') return size >= 5120 && size <= 20480; // 5-20KB
        if (sizeFilter === 'large') return size > 20480; // > 20KB
        return true;
    }

    buildFilters() {
        // Build category list
        const categoryList = document.getElementById('categoryList');
        const categories = this.allData.categories || [];
        
        categoryList.innerHTML = categories.map(cat => 
            `<label>
                <input type="checkbox" class="category-checkbox" value="${cat}">
                ${cat} (${this.allData.categoryStats[cat]?.count || 0})
            </label>`
        ).join('');

        // Add change listeners to category checkboxes
        document.querySelectorAll('.category-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.selectedFilters.categories.push(e.target.value);
                } else {
                    this.selectedFilters.categories = this.selectedFilters.categories.filter(c => c !== e.target.value);
                }
                this.applyFilters();
            });
        });
    }

    toggleFilterSection(sectionId) {
        const section = document.getElementById(sectionId);
        section.classList.toggle('hidden');
    }

    clearAllFilters() {
        document.getElementById('searchInput').value = '';
        document.querySelectorAll('.filter-checkbox').forEach(cb => cb.checked = false);
        document.querySelectorAll('.category-checkbox').forEach(cb => cb.checked = false);
        document.querySelectorAll('.size-filter').forEach(rb => rb.checked = false);
        document.querySelectorAll('.filter-options').forEach(el => el.classList.add('hidden'));
        
        this.selectedFilters = {
            search: '',
            categories: [],
            nodes: [],
            size: null
        };
        
        this.hideSearchResults();
        this.filteredWorkflows = [...this.workflows];
        this.displayRecommendations();
        this.updateStats();
    }

    renderWorkflows(workflowsList = this.filteredWorkflows) {
        const container = document.getElementById('workflowsList');
        
        if (workflowsList.length === 0) {
            container.innerHTML = '';
            document.getElementById('noResults').classList.remove('hidden');
            return;
        }

        document.getElementById('noResults').classList.add('hidden');
        
        container.innerHTML = workflowsList.map(workflow => this.createWorkflowCard(workflow)).join('');
        
        // Add click handlers
        document.querySelectorAll('.workflow-card').forEach(card => {
            card.addEventListener('click', () => {
                const workflowName = card.dataset.name;
                const workflow = workflowsList.find(w => w.name === workflowName);
                if (workflow) this.openModal(workflow);
            });
        });
    }

    createWorkflowCard(workflow) {
        const size = (workflow.size / 1024).toFixed(1);
        const date = new Date(workflow.createdAt).toLocaleDateString();
        
        return `
            <div class="workflow-card" data-name="${workflow.name}">
                <div class="workflow-card-header">
                    <span class="workflow-id">#${workflow.id}</span>
                    <span class="workflow-category">${workflow.category}</span>
                </div>
                <div class="workflow-title">${workflow.name}</div>
                <div class="workflow-description">
                    ${workflow.nodeCount} nodes • ${workflow.connections} connections
                </div>
                <div class="workflow-nodes">
                    ${workflow.nodes.slice(0, 5).map(node => 
                        `<span class="node-tag">${node}</span>`
                    ).join('')}
                    ${workflow.nodes.length > 5 ? `<span class="node-tag">+${workflow.nodes.length - 5} more</span>` : ''}
                </div>
                <div class="workflow-meta">
                    <span>${size}KB</span>
                    <span>${date}</span>
                </div>
                <div class="workflow-actions">
                    <button>View Details</button>
                </div>
            </div>
        `;
    }

    displayRecommendations() {
        // Get workflows with most nodes (complex workflows)
        const complex = [...this.workflows]
            .sort((a, b) => b.nodeCount - a.nodeCount)
            .slice(0, 3);

        // Get most recent workflows
        const recent = [...this.workflows]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3);

        // Get workflows from popular categories
        const popularCategories = Object.entries(this.allData.categoryStats || {})
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 3)
            .map(([cat]) => cat);

        const popular = this.workflows
            .filter(w => popularCategories.includes(w.category))
            .slice(0, 3);

        const recommendations = [...new Set([...complex, ...recent, ...popular])].slice(0, 9);

        const container = document.getElementById('recommendationsList');
        container.innerHTML = recommendations.map(workflow => this.createWorkflowCard(workflow)).join('');

        // Add click handlers
        document.querySelectorAll('.workflow-card').forEach(card => {
            card.addEventListener('click', () => {
                const workflowName = card.dataset.name;
                const workflow = this.workflows.find(w => w.name === workflowName);
                if (workflow) this.openModal(workflow);
            });
        });
    }

    switchView(btn) {
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        this.currentView = btn.dataset.view;
        const grid = document.getElementById('workflowsList');
        
        if (this.currentView === 'list') {
            grid.classList.add('list-view');
        } else {
            grid.classList.remove('list-view');
        }
    }

    async openModal(workflow) {
        document.getElementById('modalTitle').textContent = workflow.name;
        document.getElementById('infoId').textContent = `#${workflow.id}`;
        document.getElementById('infoCategory').textContent = workflow.category;
        document.getElementById('infoNodeCount').textContent = `${workflow.nodeCount}`;
        document.getElementById('infoSize').textContent = `${(workflow.size / 1024).toFixed(1)}KB`;
        document.getElementById('infoCreated').textContent = new Date(workflow.createdAt).toLocaleDateString();

        // Load and display JSON
        try {
            const response = await fetch(workflow.webPath);
            const jsonData = await response.json();
            document.getElementById('jsonContent').textContent = JSON.stringify(jsonData, null, 2);
            this.currentWorkflowJson = jsonData;
            this.currentWorkflowName = workflow.name;
        } catch (error) {
            document.getElementById('jsonContent').textContent = 'Failed to load JSON: ' + error.message;
            console.error('Error loading JSON from path:', workflow.webPath, error);
        }

        // Display related workflows
        this.displayRelatedWorkflows(workflow);

        // Show modal
        document.getElementById('workflowModal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    displayRelatedWorkflows(workflow) {
        const related = this.workflows
            .filter(w => w.category === workflow.category && w.id !== workflow.id)
            .slice(0, 6);

        const container = document.getElementById('relatedList');
        container.innerHTML = related.map(w => `
            <div class="related-item" onclick="app.openModal(app.workflows.find(x => x.id === '${w.id}'))">
                <div class="related-item-title">${w.name}</div>
                <div class="related-item-meta">
                    <div>${w.nodeCount} nodes</div>
                    <div>${(w.size / 1024).toFixed(1)}KB</div>
                </div>
            </div>
        `).join('');
    }

    closeModal() {
        document.getElementById('workflowModal').classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    copyJson() {
        try {
            const jsonText = document.getElementById('jsonContent').textContent;
            navigator.clipboard.writeText(jsonText).then(() => {
                this.showToast('JSON copied to clipboard!');
            }).catch(() => {
                this.fallbackCopy(jsonText);
            });
        } catch (error) {
            this.showToast('Failed to copy JSON', 'error');
        }
    }

    fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        this.showToast('JSON copied to clipboard!');
    }

    downloadJson() {
        try {
            const jsonText = document.getElementById('jsonContent').textContent;
            const blob = new Blob([jsonText], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${this.currentWorkflowName}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            this.showToast('JSON downloaded successfully!');
        } catch (error) {
            this.showToast('Failed to download JSON', 'error');
        }
    }

    updateStats() {
        document.getElementById('totalWorkflows').textContent = this.workflows.length;
        document.getElementById('totalCategories').textContent = (this.allData.categories || []).length;
        document.getElementById('visibleWorkflows').textContent = this.filteredWorkflows.length;
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.remove('hidden');
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }
}

// Initialize app
const app = new WorkflowLibrary();

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC to close modal
    if (e.key === 'Escape' && !document.getElementById('workflowModal').classList.contains('hidden')) {
        app.closeModal();
    }
    
    // Ctrl/Cmd + K for search focus
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
});
