#!/usr/bin/env node
/**
 * Cost Optimization Example - SmartRouter
 * 
 * Demonstrates massive cost savings with batch processing
 */

import { ModelRouter, CostTracker } from '../src/index.js';

async function costOptimizationExample() {
  console.log('💰 SmartRouter - Cost Optimization Demo\n');
  console.log('Processing 50 mixed queries to demonstrate savings...\n');

  const costTracker = new CostTracker();
  const router = new ModelRouter({ costTracker });

  // Simulate realistic query distribution
  const queries = [
    // 60% Simple queries (typical for chatbots)
    ...Array(30).fill(null).map((_, i) => ({
      text: `Simple query ${i + 1}: What is ${['REST', 'API', 'JSON', 'HTTP', 'SQL'][i % 5]}?`,
      type: 'simple'
    })),
    
    // 30% Medium queries
    ...Array(15).fill(null).map((_, i) => ({
      text: `Explain how ${['caching', 'indexing', 'sharding', 'replication', 'load balancing'][i % 5]} works`,
      type: 'medium'
    })),
    
    // 10% Complex queries
    ...Array(5).fill(null).map((_, i) => ({
      text: `Design a comprehensive solution for ${['distributed transactions', 'rate limiting', 'service mesh', 'event sourcing', 'CQRS pattern'][i % 5]}`,
      type: 'complex'
    }))
  ];

  // Process all queries
  let processed = 0;
  const startTime = Date.now();

  for (const query of queries) {
    try {
      await router.route(query.text);
      processed++;
      
      if (processed % 10 === 0) {
        process.stdout.write(`Processed ${processed}/${queries.length}...\r`);
      }
    } catch (error) {
      console.error(`Failed: ${error.message}`);
    }
  }

  const totalTime = Date.now() - startTime;
  
  console.log(`\n✅ Processed ${processed}/${queries.length} queries in ${totalTime}ms\n`);

  // Generate comprehensive report
  console.log(costTracker.generateReport());

  // Cost breakdown analysis
  const stats = costTracker.calculateStats();
  
  console.log('\n📊 Detailed Cost Analysis:\n');
  
  // Per-tier costs
  Object.entries(stats.costByTier).forEach(([tier, data]) => {
    if (data.requests > 0) {
      const avgCost = data.cost / data.requests;
      console.log(`${tier}:`);
      console.log(`  - Requests: ${data.requests} (${((data.requests / processed) * 100).toFixed(1)}%)`);
      console.log(`  - Total cost: $${data.cost.toFixed(6)}`);
      console.log(`  - Avg cost/request: $${avgCost.toFixed(6)}`);
      console.log(`  - Total tokens: ${data.inputTokens.toLocaleString()} in / ${data.outputTokens.toLocaleString()} out\n`);
    }
  });

  // Annual projection
  const monthlyVolume = processed;
  const annualVolume = monthlyVolume * 12;
  const annualSmartRouterCost = (stats.totalCost / processed) * annualVolume;
  const annualBaselineCost = (stats.baselineCost / processed) * annualVolume;
  const annualSavings = annualBaselineCost - annualSmartRouterCost;

  console.log('💡 Annual Projection (based on this batch):');
  console.log(`   Monthly volume: ${monthlyVolume.toLocaleString()} queries`);
  console.log(`   Annual volume: ${annualVolume.toLocaleString()} queries`);
  console.log(`   SmartRouter annual cost: $${annualSmartRouterCost.toFixed(2)}`);
  console.log(`   Baseline annual cost: $${annualBaselineCost.toFixed(2)}`);
  console.log(`   💎 Annual savings: $${annualSavings.toFixed(2)}\n`);

  // Export detailed CSV report
  const csvPath = await costTracker.exportCSV('cost-optimization-demo.csv');
  console.log(`📄 Detailed CSV report saved to: ${csvPath}\n`);

  // ROI calculation
  const setupCost = 0; // SmartRouter is free and easy to integrate
  const roi = (annualSavings / Math.max(setupCost, 1)) * 100;
  
  console.log('🎯 Return on Investment:');
  console.log(`   Setup cost: $${setupCost} (integration time only)`);
  console.log(`   Annual savings: $${annualSavings.toFixed(2)}`);
  console.log(`   ROI: ${roi.toFixed(0)}%`);
  console.log(`   Payback period: Immediate ✨\n`);
}

costOptimizationExample().catch(console.error);
