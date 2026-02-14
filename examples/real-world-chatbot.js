#!/usr/bin/env node
/**
 * Real-World Chatbot Example - SmartRouter
 * 
 * Simulates a customer support chatbot with realistic query patterns
 */

import { ModelRouter, CostTracker } from '../src/index.js';

// Simulated customer support queries (realistic distribution)
const customerQueries = [
  // Simple FAQs (50% of traffic)
  "What are your business hours?",
  "How do I reset my password?",
  "What payment methods do you accept?",
  "Where is my order?",
  "How do I cancel my subscription?",
  "What's your return policy?",
  "Do you ship internationally?",
  "How do I contact support?",
  "What's your phone number?",
  "Is there a mobile app?",
  
  // Medium queries - need explanation (35% of traffic)
  "I'm having trouble logging in. Can you help me troubleshoot?",
  "Explain the differences between your Basic and Pro plans",
  "How does your referral program work?",
  "Can you walk me through the checkout process?",
  "What are the benefits of upgrading my account?",
  "How do I integrate your API with my website?",
  "Explain your data security practices",
  
  // Complex queries - need reasoning (15% of traffic)
  "I need to migrate 50,000 customers from our old system to yours. What's the best approach considering we have custom fields and need zero downtime?",
  "Our team is experiencing slow performance during peak hours. Help me debug and optimize our implementation. We're using React with your SDK.",
  "Compare your Enterprise plan vs building a custom in-house solution. Include TCO, maintenance, and scalability analysis."
];

async function chatbotExample() {
  console.log('💬 SmartRouter - Real-World Chatbot Simulation\n');
  console.log('Simulating 1 day of customer support queries (1000 messages)...\n');

  const costTracker = new CostTracker();
  const router = new ModelRouter({ costTracker });

  // Simulate 1000 queries with realistic distribution
  const totalQueries = 1000;
  const queries = [];

  // Build query list with realistic distribution
  for (let i = 0; i < totalQueries; i++) {
    // 50% simple, 35% medium, 15% complex
    const rand = Math.random();
    let query;
    
    if (rand < 0.50) {
      // Simple FAQ
      query = customerQueries[Math.floor(Math.random() * 10)];
    } else if (rand < 0.85) {
      // Medium complexity
      query = customerQueries[10 + Math.floor(Math.random() * 7)];
    } else {
      // Complex query
      query = customerQueries[17 + Math.floor(Math.random() * 3)];
    }
    
    queries.push(query);
  }

  // Process queries with progress indicator
  console.log('Processing queries...');
  const startTime = Date.now();
  let processed = 0;

  for (const query of queries) {
    try {
      await router.route(query);
      processed++;
      
      if (processed % 100 === 0) {
        const pct = ((processed / totalQueries) * 100).toFixed(0);
        process.stdout.write(`Progress: ${processed}/${totalQueries} (${pct}%) \r`);
      }
    } catch (error) {
      // In production, log errors but continue
      // console.error(`Query failed: ${error.message}`);
    }
  }

  const totalTime = Date.now() - startTime;
  console.log(`\n\n✅ Processed ${processed} queries in ${(totalTime / 1000).toFixed(2)}s`);
  console.log(`   Average response time: ${(totalTime / processed).toFixed(0)}ms\n`);

  // Generate comprehensive report
  console.log(costTracker.generateReport());

  // Business impact analysis
  const stats = costTracker.calculateStats();

  console.log('💼 Business Impact Analysis:\n');
  
  // Daily costs
  const dailySmartRouter = stats.totalCost;
  const dailyBaseline = stats.baselineCost;
  const dailySavings = stats.savings;

  console.log('Daily Costs (1,000 queries):');
  console.log(`  SmartRouter: $${dailySmartRouter.toFixed(4)}`);
  console.log(`  Baseline (all Opus): $${dailyBaseline.toFixed(4)}`);
  console.log(`  Savings: $${dailySavings.toFixed(4)}\n`);

  // Monthly projection
  const monthlySmartRouter = dailySmartRouter * 30;
  const monthlyBaseline = dailyBaseline * 30;
  const monthlySavings = dailySavings * 30;

  console.log('Monthly Projection (30,000 queries):');
  console.log(`  SmartRouter: $${monthlySmartRouter.toFixed(2)}`);
  console.log(`  Baseline (all Opus): $${monthlyBaseline.toFixed(2)}`);
  console.log(`  💰 Savings: $${monthlySavings.toFixed(2)}\n`);

  // Annual projection
  const annualSmartRouter = dailySmartRouter * 365;
  const annualBaseline = dailyBaseline * 365;
  const annualSavings = dailySavings * 365;

  console.log('Annual Projection (365,000 queries):');
  console.log(`  SmartRouter: $${annualSmartRouter.toFixed(2)}`);
  console.log(`  Baseline (all Opus): $${annualBaseline.toFixed(2)}`);
  console.log(`  💎 Savings: $${annualSavings.toFixed(2)}\n`);

  // Team cost comparison
  console.log('💡 Cost vs Headcount Trade-off:');
  const supportEngineerSalary = 70000; // Annual
  const savingsAsPercent = (annualSavings / supportEngineerSalary) * 100;
  
  console.log(`  Annual savings: $${annualSavings.toFixed(2)}`);
  console.log(`  Support engineer salary: $${supportEngineerSalary.toLocaleString()}`);
  console.log(`  Savings = ${savingsAsPercent.toFixed(1)}% of 1 FTE`);
  console.log(`  ROI: Instant - zero implementation cost!\n`);

  // Quality metrics
  console.log('📊 Quality Metrics:');
  const successRate = (stats.successfulRequests / stats.totalRequests) * 100;
  console.log(`  Success rate: ${successRate.toFixed(1)}%`);
  console.log(`  Failed requests: ${stats.failedRequests}`);
  console.log(`  Avg cost per successful query: $${stats.avgCostPerRequest.toFixed(6)}\n`);

  // Tier distribution
  console.log('📈 Query Distribution:');
  Object.entries(stats.requestsByTier).forEach(([tier, count]) => {
    const pct = ((count / stats.successfulRequests) * 100).toFixed(1);
    const totalCost = stats.costByTier[tier].cost;
    console.log(`  ${tier}: ${count} queries (${pct}%) - $${totalCost.toFixed(6)}`);
  });

  console.log('\n✨ Chatbot simulation complete!\n');
  console.log('🎯 Key Takeaway:');
  console.log(`   By using SmartRouter, this chatbot saves $${monthlySavings.toFixed(2)}/month`);
  console.log(`   That's ${stats.savingsMultiplier.toFixed(1)}x cheaper than using Claude Opus for everything!\n`);
}

chatbotExample().catch(console.error);
