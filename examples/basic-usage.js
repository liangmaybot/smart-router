#!/usr/bin/env node
/**
 * Basic Usage Example - SmartRouter
 * 
 * Demonstrates simple routing of queries to optimal models
 */

import { ModelRouter, CostTracker } from '../src/index.js';

async function basicExample() {
  console.log('🚀 SmartRouter - Basic Usage Example\n');

  // Initialize router with cost tracking
  const costTracker = new CostTracker();
  const router = new ModelRouter({ costTracker });

  // Example 1: Simple query
  console.log('Example 1: Simple factual question');
  console.log('─────────────────────────────────\n');
  
  const result1 = await router.route("What is the capital of France?");
  
  console.log(`Response: ${result1.response}`);
  console.log(`Model Used: ${result1.displayName} (${result1.tier})`);
  console.log(`Cost: $${result1.cost.toFixed(6)}`);
  console.log(`Duration: ${result1.duration}ms\n\n`);

  // Example 2: Medium complexity query
  console.log('Example 2: Explanation task');
  console.log('─────────────────────────────────\n');
  
  const result2 = await router.route("Explain how JWT authentication works");
  
  console.log(`Response: ${result2.response}`);
  console.log(`Model Used: ${result2.displayName} (${result2.tier})`);
  console.log(`Cost: $${result2.cost.toFixed(6)}`);
  console.log(`Duration: ${result2.duration}ms\n\n`);

  // Example 3: Complex reasoning query
  console.log('Example 3: Complex system design');
  console.log('─────────────────────────────────\n');
  
  const result3 = await router.route(`
    Design a scalable authentication system for a microservices 
    architecture with 100+ services. Include JWT strategy, refresh 
    tokens, session management, and security considerations.
  `);
  
  console.log(`Response: ${result3.response.substring(0, 100)}...`);
  console.log(`Model Used: ${result3.displayName} (${result3.tier})`);
  console.log(`Cost: $${result3.cost.toFixed(6)}`);
  console.log(`Duration: ${result3.duration}ms\n\n`);

  // Show cost savings
  console.log('💰 Cost Summary');
  console.log('═════════════════════════════════\n');
  
  const stats = costTracker.calculateStats();
  
  console.log(`Total requests: ${stats.successfulRequests}`);
  console.log(`SmartRouter cost: $${stats.totalCost.toFixed(6)}`);
  console.log(`Baseline cost (all Opus): $${stats.baselineCost.toFixed(6)}`);
  console.log(`Savings: $${stats.savings.toFixed(6)} (${stats.savingsPercent.toFixed(1)}%)`);
  console.log(`Cost multiplier: ${stats.savingsMultiplier.toFixed(2)}x cheaper\n`);
}

basicExample().catch(console.error);
