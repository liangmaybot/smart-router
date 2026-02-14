/**
 * Model Router - Route tasks to optimal models based on complexity
 * 
 * Three-tier routing:
 * - SIMPLE → Minimax M2.5 ($1.27/M tokens)
 * - MEDIUM → Claude Haiku ($0.80/M tokens input, $4/M output)
 * - COMPLEX → Claude Opus 4.6 ($90/M tokens)
 */

import { TaskAnalyzer } from './analyzer.js';
import { CostTracker } from './cost-tracker.js';

export class ModelRouter {
  constructor(options = {}) {
    this.analyzer = new TaskAnalyzer();
    this.costTracker = options.costTracker || new CostTracker();
    
    // Model tier configuration
    this.models = {
      SIMPLE: {
        name: 'minimax/minimax-01',
        displayName: 'Minimax M2.5',
        costPerMInput: 1.27,
        costPerMOutput: 1.27,
        maxRetries: 2
      },
      MEDIUM: {
        name: 'anthropic/claude-3-5-haiku-20241022',
        displayName: 'Claude 3.5 Haiku',
        costPerMInput: 0.80,
        costPerMOutput: 4.00,
        maxRetries: 2
      },
      COMPLEX: {
        name: 'anthropic/claude-opus-4-20250514',
        displayName: 'Claude Opus 4.6',
        costPerMInput: 90.00,
        costPerMOutput: 90.00,
        maxRetries: 1
      }
    };

    // Fallback chain: SIMPLE → MEDIUM → COMPLEX
    this.fallbackChain = {
      SIMPLE: 'MEDIUM',
      MEDIUM: 'COMPLEX',
      COMPLEX: null // No fallback for highest tier
    };

    this.apiClient = options.apiClient || null;
  }

  /**
   * Route a task to the optimal model
   * @param {string} prompt - User prompt
   * @param {object} options - Routing options
   * @returns {Promise<object>} Response with model info and result
   */
  async route(prompt, options = {}) {
    const analysis = this.analyzer.analyze(prompt);
    const startTime = Date.now();

    console.log(`📊 Task Analysis: ${analysis.tier} (confidence: ${(analysis.confidence * 100).toFixed(0)}%)`);
    console.log(`   Reasoning: ${analysis.reasoning}`);

    let tier = options.forceTier || analysis.tier;
    let attempts = 0;
    let lastError = null;

    while (tier) {
      attempts++;
      const model = this.models[tier];

      try {
        console.log(`🚀 Attempting ${model.displayName} (${tier})...`);
        
        const response = await this.executeModel(tier, prompt, options);
        const duration = Date.now() - startTime;

        // Track successful request
        const cost = this.calculateCost(tier, response.usage);
        await this.costTracker.logRequest({
          timestamp: new Date(),
          prompt: prompt.substring(0, 100) + '...',
          tier,
          model: model.name,
          inputTokens: response.usage.input,
          outputTokens: response.usage.output,
          cost,
          duration,
          success: true,
          attempts
        });

        console.log(`✅ Success with ${model.displayName}`);
        console.log(`   Cost: $${cost.toFixed(6)} | Duration: ${duration}ms`);

        return {
          success: true,
          tier,
          model: model.name,
          displayName: model.displayName,
          response: response.content,
          usage: response.usage,
          cost,
          duration,
          analysis,
          attempts
        };

      } catch (error) {
        lastError = error;
        console.log(`❌ Failed with ${model.displayName}: ${error.message}`);

        // Track failed request
        await this.costTracker.logRequest({
          timestamp: new Date(),
          prompt: prompt.substring(0, 100) + '...',
          tier,
          model: model.name,
          inputTokens: 0,
          outputTokens: 0,
          cost: 0,
          duration: Date.now() - startTime,
          success: false,
          error: error.message,
          attempts
        });

        // Try fallback
        const nextTier = this.fallbackChain[tier];
        if (nextTier && attempts < 3) {
          console.log(`🔄 Falling back to ${nextTier}...`);
          tier = nextTier;
        } else {
          break;
        }
      }
    }

    // All attempts failed
    throw new Error(`All models failed. Last error: ${lastError?.message}`);
  }

  /**
   * Execute a model call (mock implementation for demo)
   * In production, this would call the actual API
   */
  async executeModel(tier, prompt, options) {
    const model = this.models[tier];

    if (this.apiClient) {
      // Use actual API client if provided
      return await this.apiClient.complete(model.name, prompt, options);
    }

    // Mock implementation for demo
    const inputTokens = Math.ceil(prompt.length / 4);
    const outputTokens = Math.floor(inputTokens * 0.5); // Assume 50% response length

    // Simulate different failure rates
    const failureRate = tier === 'SIMPLE' ? 0.15 : tier === 'MEDIUM' ? 0.05 : 0.01;
    if (Math.random() < failureRate) {
      throw new Error(`${model.displayName} temporarily unavailable`);
    }

    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

    return {
      content: `[Mock response from ${model.displayName}]\n\nThis is a simulated response to: "${prompt.substring(0, 50)}..."`,
      usage: {
        input: inputTokens,
        output: outputTokens,
        total: inputTokens + outputTokens
      }
    };
  }

  /**
   * Calculate cost for a request
   */
  calculateCost(tier, usage) {
    const model = this.models[tier];
    const inputCost = (usage.input / 1_000_000) * model.costPerMInput;
    const outputCost = (usage.output / 1_000_000) * model.costPerMOutput;
    return inputCost + outputCost;
  }

  /**
   * Get model info for a tier
   */
  getModelInfo(tier) {
    return this.models[tier];
  }

  /**
   * Override model configuration
   */
  setModel(tier, config) {
    this.models[tier] = { ...this.models[tier], ...config };
  }
}
