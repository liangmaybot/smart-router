/**
 * Task Analyzer - Classify task complexity for optimal model routing
 * 
 * Analyzes prompts to determine complexity tier:
 * - SIMPLE: Basic queries, short responses, no reasoning
 * - MEDIUM: Some analysis, moderate length, light reasoning
 * - COMPLEX: Deep reasoning, code generation, long context
 */

export class TaskAnalyzer {
  constructor() {
    // Complexity indicators
    this.codePatterns = [
      /```/,
      /\bfunction\b/i,
      /\bclass\b/i,
      /\bimport\b/i,
      /\bconst\b/i,
      /\blet\b/i,
      /\bvar\b/i,
      /=>/, // arrow functions
      /\{[\s\S]*\}/, // code blocks
    ];

    this.reasoningKeywords = [
      'analyze', 'explain', 'compare', 'evaluate', 'critique',
      'reason', 'logic', 'proof', 'deduce', 'infer',
      'strategy', 'plan', 'design', 'architect',
      'debug', 'optimize', 'refactor', 'solve'
    ];

    this.complexKeywords = [
      'comprehensive', 'detailed', 'in-depth', 'thorough',
      'multiple', 'various', 'several', 'complex'
    ];
  }

  /**
   * Analyze a task and recommend a model tier
   * @param {string} prompt - The user's prompt
   * @param {object} options - Additional context
   * @returns {object} Analysis result with tier and confidence
   */
  analyze(prompt, options = {}) {
    const metrics = this.calculateMetrics(prompt);
    const tier = this.determineTier(metrics);
    
    return {
      tier,
      metrics,
      confidence: this.calculateConfidence(metrics, tier),
      reasoning: this.explainDecision(metrics, tier)
    };
  }

  calculateMetrics(prompt) {
    const tokens = this.estimateTokens(prompt);
    const hasCode = this.detectCode(prompt);
    const reasoningLevel = this.assessReasoning(prompt);
    const complexityScore = this.calculateComplexity(prompt);

    return {
      tokens,
      hasCode,
      reasoningLevel, // 0-10 scale
      complexityScore, // 0-100 scale
      length: prompt.length,
      sentences: this.countSentences(prompt),
      questions: this.countQuestions(prompt)
    };
  }

  estimateTokens(text) {
    // Rough estimation: ~4 chars per token
    return Math.ceil(text.length / 4);
  }

  detectCode(prompt) {
    return this.codePatterns.some(pattern => pattern.test(prompt));
  }

  assessReasoning(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    let score = 0;

    // Check for reasoning keywords
    this.reasoningKeywords.forEach(keyword => {
      if (lowerPrompt.includes(keyword)) score += 1;
    });

    // Multi-step questions increase reasoning needs
    const steps = prompt.split(/\d+\.|step|first|then|next|finally/i).length - 1;
    score += steps;

    return Math.min(10, score);
  }

  calculateComplexity(prompt) {
    let score = 0;

    // Length factor (longer = more complex)
    if (prompt.length > 500) score += 20;
    if (prompt.length > 1000) score += 20;

    // Code presence
    if (this.detectCode(prompt)) score += 25;

    // Reasoning keywords
    const reasoningScore = this.assessReasoning(prompt);
    score += reasoningScore * 3;

    // Complex keywords
    const lowerPrompt = prompt.toLowerCase();
    this.complexKeywords.forEach(keyword => {
      if (lowerPrompt.includes(keyword)) score += 5;
    });

    // Multiple questions = more complexity
    const questions = this.countQuestions(prompt);
    if (questions > 1) score += questions * 5;

    return Math.min(100, score);
  }

  countSentences(text) {
    return (text.match(/[.!?]+/g) || []).length;
  }

  countQuestions(text) {
    return (text.match(/\?/g) || []).length;
  }

  determineTier(metrics) {
    const { complexityScore, hasCode, reasoningLevel, tokens } = metrics;

    // Complex tier conditions
    if (complexityScore >= 60) return 'COMPLEX';
    if (hasCode && reasoningLevel >= 5) return 'COMPLEX';
    if (tokens > 500) return 'COMPLEX';

    // Medium tier conditions
    if (complexityScore >= 30) return 'MEDIUM';
    if (hasCode) return 'MEDIUM';
    if (reasoningLevel >= 3) return 'MEDIUM';
    if (tokens > 200) return 'MEDIUM';

    // Default to simple
    return 'SIMPLE';
  }

  calculateConfidence(metrics, tier) {
    // Calculate how strongly the metrics support this tier
    const { complexityScore } = metrics;

    if (tier === 'COMPLEX' && complexityScore >= 70) return 0.95;
    if (tier === 'COMPLEX' && complexityScore >= 60) return 0.85;
    if (tier === 'MEDIUM' && complexityScore >= 30 && complexityScore < 60) return 0.90;
    if (tier === 'SIMPLE' && complexityScore < 25) return 0.92;

    // Moderate confidence for borderline cases
    return 0.75;
  }

  explainDecision(metrics, tier) {
    const reasons = [];

    if (metrics.complexityScore >= 60) {
      reasons.push(`High complexity score (${metrics.complexityScore})`);
    }
    if (metrics.hasCode) {
      reasons.push('Contains code');
    }
    if (metrics.reasoningLevel >= 5) {
      reasons.push(`High reasoning requirement (${metrics.reasoningLevel}/10)`);
    }
    if (metrics.tokens > 500) {
      reasons.push(`Large token count (~${metrics.tokens})`);
    }

    if (reasons.length === 0) {
      reasons.push('Simple query with basic requirements');
    }

    return reasons.join(', ');
  }
}
