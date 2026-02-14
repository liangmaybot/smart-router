/**
 * SmartRouter - Intelligent Model Routing for 10x Cost Savings
 * 
 * Main entry point that exports all components
 */

export { TaskAnalyzer } from './analyzer.js';
export { ModelRouter } from './router.js';
export { CostTracker } from './cost-tracker.js';

/**
 * Quick start: Create a configured router
 */
export async function createRouter(options = {}) {
  const { ModelRouter } = await import('./router.js');
  const { CostTracker } = await import('./cost-tracker.js');
  
  const costTracker = new CostTracker(options);
  const router = new ModelRouter({ costTracker, ...options });
  
  return { router, costTracker };
}
