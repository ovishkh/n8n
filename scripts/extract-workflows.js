#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Extract workflow metadata
function extractWorkflowMetadata(filePath, workflowDir) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const workflow = JSON.parse(content);
    
    const fileName = path.basename(filePath);
    const dirName = path.basename(path.dirname(filePath));
    
    // Parse filename: ID_Category_NodeNames_TriggerType
    const nameParts = fileName.replace('.json', '').split('_');
    const id = nameParts[0];
    
    // Extract nodes and their types
    const nodeTypes = [];
    const nodeNames = [];
    if (workflow.nodes && Array.isArray(workflow.nodes)) {
      workflow.nodes.forEach(node => {
        if (node.type) nodeTypes.push(node.type);
        if (node.name) nodeNames.push(node.name);
      });
    }
    
    // Calculate web-accessible path from website folder
    const webPath = path.relative(
      path.join(workflowDir, 'website'),
      filePath
    ).replace(/\\/g, '/');
    
    return {
      id,
      name: fileName.replace('.json', ''),
      fileName,
      category: dirName,
      webPath: webPath,
      nodes: nodeNames,
      nodeTypes: [...new Set(nodeTypes)],
      nodeCount: workflow.nodes ? workflow.nodes.length : 0,
      connections: workflow.connections ? workflow.connections.length : 0,
      createdAt: new Date(fs.statSync(filePath).birthtime).toISOString(),
      size: fs.statSync(filePath).size
    };
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return null;
  }
}

// Main function
function main() {
  const workflowDir = process.cwd();
  const outputFile = path.join(workflowDir, 'website', 'data', 'workflows.json');
  
  // Ensure output directory exists
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  console.log('Extracting workflow metadata...');
  
  // Find all JSON files
  const pattern = path.join(workflowDir, '**/*.json');
  const files = glob.sync(pattern, {
    ignore: [
      path.join(workflowDir, 'website/**'),
      path.join(workflowDir, 'node_modules/**'),
      path.join(workflowDir, '.git/**')
    ]
  });
  
  console.log(`Found ${files.length} workflow files`);
  
  const workflows = [];
  const categories = new Set();
  
  files.forEach((file, index) => {
    if (index % 100 === 0) {
      console.log(`Processing ${index}/${files.length}...`);
    }
    
    const metadata = extractWorkflowMetadata(file, workflowDir);
    if (metadata) {
      workflows.push(metadata);
      categories.add(metadata.category);
    }
  });
  
  // Sort workflows by ID
  workflows.sort((a, b) => {
    const aId = parseInt(a.id);
    const bId = parseInt(b.id);
    return aId - bId;
  });
  
  // Generate category recommendations based on workflow count
  const categoryStats = {};
  workflows.forEach(w => {
    if (!categoryStats[w.category]) {
      categoryStats[w.category] = { count: 0, samples: [] };
    }
    categoryStats[w.category].count++;
    if (categoryStats[w.category].samples.length < 3) {
      categoryStats[w.category].samples.push({
        id: w.id,
        name: w.name,
        nodeCount: w.nodeCount
      });
    }
  });
  
  const data = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    totalWorkflows: workflows.length,
    categories: Array.from(categories).sort(),
    categoryStats: categoryStats,
    workflows: workflows
  };
  
  // Write output file
  fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
  console.log(`✓ Successfully extracted ${workflows.length} workflows`);
  console.log(`✓ Found ${categories.size} categories`);
  console.log(`✓ Output saved to ${outputFile}`);
}

main();
