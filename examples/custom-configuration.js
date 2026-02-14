#!/usr/bin/env node
/**
 * Custom Configuration Example - SmartRouter
 * 
 * Demonstrates how to customize model tiers and routing behavior
 */

import { ModelRouter, CostTracker, TaskAnalyzer } from '../src/index.js';

async function customConfigExample() {
  console.log('⚙️  SmartRouter - Custom Configuration Example\n');

  // Example 1: Override default models
  console.log('Example 1: Custom Model Configuration');
  console.log('─────────────────────────────────────────\n');

  const router1 = new ModelRouter();

  // Use different models for your specific needs
  router1.setModel('SIMPLE', {
    name: 'openai/gpt-4o-mini',
    displayName: 'GPT-4o Mini',
    costPerMInput: 0.15,
    costPerMOutput: 0.60
  });

  router1.setModel('MEDIUM', {
    name: 'openai/gpt-4o',
    displayName: 'GPT-4o',
    costPerMInput: 5.00,
    costPerMOutput: 15.00
  });

  console.log('Custom models configured:');
  console.log(`SIMPLE: ${router1.getModelInfo('SIMPLE').displayName}`);
  console.log(`MEDIUM: ${router1.getModelInfo('MEDIUM').displayName}`);
  console.log(`COMPLEX: ${router1.getModelInfo('COMPLEX').displayName}\n\n`);

  // Example 2: Force specific tier
  console.log('Example 2: Force Model Tier');
  console.log('─────────────────────────────────────────\n');

  const costTracker = new CostTracker();
  const router2 = new ModelRouter({ costTracker });

  const simpleQuery = "What is 2+2?";

  // Normal routing
  const normalResult = await router2.route(simpleQuery);
  console.log(`Normal routing: ${normalResult.tier} (${normalResult.displayName})`);

  // Force complex model (e.g., for production critical path)
  const forcedResult = await router2.route(simpleQuery, { forceTier: 'COMPLEX' });
  console.log(`Forced routing: ${forcedResult.tier} (${forcedResult.displayName})`);
  console.log(`Cost difference: $${(forcedResult.cost - normalResult.cost).toFixed(6)}\n\n`);

  // Example 3: Environment-based routing
  console.log('Example 3: Environment-Based Configuration');
  console.log('─────────────────────────────────────────\n');

  // Simulate different environments
  const environments = ['development', 'staging', 'production'];

  for (const env of environments) {
    console.log(`Environment: ${env.toUpperCase()}`);

    // In dev/staging, prefer cheaper models; in production, allow smart routing
    const forceTier = env === 'development' ? 'SIMPLE' : 
                      env === 'staging' ? 'MEDIUM' : 
                      undefined; // Smart routing in production

    const result = await router2.route(
      "Explain how microservices communicate",
      { forceTier }
    );

    console.log(`  Model: ${result.displayName} (${result.tier})`);
    console.log(`  Cost: $${result.cost.toFixed(6)}\n`);
  }

  // Example 4: Custom task analysis
  console.log('Example 4: Manual Task Analysis');
  console.log('─────────────────────────────────────────\n');

  const analyzer = new TaskAnalyzer();

  const testQueries = [
    "What is AI?",
    "Explain the difference between supervised and unsupervised learning",
    "Design a complete machine learning pipeline for fraud detection with feature engineering, model selection, and deployment strategy"
  ];

  for (const query of testQueries) {
    const analysis = analyzer.analyze(query);
    
    console.log(`Query: "${query.substring(0, 50)}..."`);
    console.log(`  Recommended tier: ${analysis.tier}`);
    console.log(`  Confidence: ${(analysis.confidence * 100).toFixed(0)}%`);
    console.log(`  Complexity score: ${analysis.metrics.complexityScore}/100`);
    console.log(`  Reasoning: ${analysis.reasoning}\n`);
  }

  // Example 5: Cost tracking customization
  console.log('Example 5: Custom Cost Tracking');
  console.log('─────────────────────────────────────────\n');

  const customTracker = new CostTracker({
    dataDir: './custom-reports'
  });

  const router3 = new ModelRouter({ costTracker: customTracker });

  // Process some queries
  await router3.route("Simple query 1");
  await router3.route("Simple query 2");
  await router3.route("Complex query with detailed analysis");

  // Get real-time dashboard
  const dashboard = customTracker.getDashboard();
  
  console.log('Real-time Dashboard:');
  console.log(`  Total cost: $${dashboard.stats.totalCost.toFixed(6)}`);
  console.log(`  Savings: ${dashboard.stats.savingsPercent.toFixed(1)}%`);
  console.log('\n  Recent requests:');
  
  dashboard.recent.forEach((req, i) => {
    console.log(`    ${i + 1}. ${req.tier} - $${req.cost} - ${req.success ? '✓' : '✗'}`);
  });

  console.log('\n✨ Custom configuration complete!\n');
}

customConfigExample().catch(console.error);
