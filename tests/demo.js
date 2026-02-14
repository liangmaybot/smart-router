#!/usr/bin/env node
/**
 * SmartRouter Demo - Demonstrate 10x cost savings
 * 
 * Runs 100+ sample queries through the router and generates a report
 */

import { ModelRouter } from '../src/router.js';
import { CostTracker } from '../src/cost-tracker.js';
import { samplePrompts } from './sample-prompts.js';

async function runDemo() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║         SMARTROUTER - 10x COST REDUCTION DEMO         ║');
  console.log('╚═══════════════════════════════════════════════════════╝');
  console.log('\n');

  const costTracker = new CostTracker();
  const router = new ModelRouter({ costTracker });

  console.log(`📝 Running ${samplePrompts.length} test queries...\n`);

  // Run all sample prompts
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < samplePrompts.length; i++) {
    const sample = samplePrompts[i];
    const num = i + 1;
    
    process.stdout.write(`[${num}/${samplePrompts.length}] Processing... `);
    
    try {
      const result = await router.route(sample.text);
      successCount++;
      
      // Verify tier matches expectation
      const match = result.tier === sample.expectedTier ? '✓' : '⚠';
      process.stdout.write(`${match} ${result.tier}\n`);
      
    } catch (error) {
      failCount++;
      process.stdout.write(`✗ FAILED\n`);
    }
  }

  console.log('\n' + '─'.repeat(60) + '\n');

  // Generate and display report
  const report = costTracker.generateReport();
  console.log(report);

  // Export CSV
  const csvPath = await costTracker.exportCSV('demo-results.csv');
  console.log(`📊 Detailed CSV report exported to: ${csvPath}\n`);

  // Summary
  const stats = costTracker.calculateStats();
  console.log('🎯 KEY FINDINGS:\n');
  console.log(`   ✓ Successfully routed ${successCount}/${samplePrompts.length} queries`);
  console.log(`   ✓ Cost reduction: ${stats.savingsMultiplier.toFixed(2)}x cheaper than always-use-Opus`);
  console.log(`   ✓ Total savings: $${stats.savings.toFixed(6)} (${stats.savingsPercent.toFixed(1)}%)`);
  console.log(`   ✓ Average cost per query: $${stats.avgCostPerRequest.toFixed(6)}\n`);

  // Tier distribution
  console.log('📊 Query Distribution:');
  Object.entries(stats.requestsByTier).forEach(([tier, count]) => {
    const pct = ((count / stats.successfulRequests) * 100).toFixed(1);
    console.log(`   ${tier}: ${count} queries (${pct}%)`);
  });

  console.log('\n✨ Demo complete!\n');

  // Performance check
  if (stats.savingsMultiplier >= 10) {
    console.log('🏆 SUCCESS: Achieved 10x+ cost reduction target!\n');
  } else if (stats.savingsMultiplier >= 5) {
    console.log('🎉 GREAT: Achieved 5x+ cost reduction!\n');
  } else {
    console.log('💡 TIP: Add more SIMPLE queries to increase savings multiplier\n');
  }
}

// Run the demo
runDemo().catch(error => {
  console.error('Demo failed:', error);
  process.exit(1);
});
