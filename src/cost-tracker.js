/**
 * Cost Tracker - Track model costs and calculate savings
 * 
 * Features:
 * - Log every request with model, tokens, and cost
 * - Calculate savings vs always-use-Opus baseline
 * - Export CSV reports
 * - Real-time statistics
 */

import { writeFile } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export class CostTracker {
  constructor(options = {}) {
    this.requests = [];
    this.dataDir = options.dataDir || './data';
    
    // Ensure data directory exists
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }

    // Baseline: Claude Opus 4.6 for everything
    this.baselineModel = {
      name: 'Claude Opus 4.6',
      costPerMInput: 90.00,
      costPerMOutput: 90.00
    };
  }

  /**
   * Log a request
   */
  async logRequest(request) {
    this.requests.push({
      ...request,
      id: this.requests.length + 1
    });
  }

  /**
   * Calculate total costs and savings
   */
  calculateStats() {
    const successful = this.requests.filter(r => r.success);
    
    if (successful.length === 0) {
      return {
        totalRequests: 0,
        successfulRequests: 0,
        totalCost: 0,
        baselineCost: 0,
        savings: 0,
        savingsPercent: 0,
        avgCostPerRequest: 0,
        costByTier: {}
      };
    }

    // Calculate actual costs
    const totalCost = successful.reduce((sum, r) => sum + r.cost, 0);
    const totalInputTokens = successful.reduce((sum, r) => sum + r.inputTokens, 0);
    const totalOutputTokens = successful.reduce((sum, r) => sum + r.outputTokens, 0);

    // Calculate baseline cost (if everything used Opus)
    const baselineCost = 
      (totalInputTokens / 1_000_000) * this.baselineModel.costPerMInput +
      (totalOutputTokens / 1_000_000) * this.baselineModel.costPerMOutput;

    const savings = baselineCost - totalCost;
    const savingsPercent = baselineCost > 0 ? (savings / baselineCost) * 100 : 0;

    // Cost breakdown by tier
    const costByTier = {};
    const requestsByTier = {};
    
    ['SIMPLE', 'MEDIUM', 'COMPLEX'].forEach(tier => {
      const tierRequests = successful.filter(r => r.tier === tier);
      costByTier[tier] = {
        requests: tierRequests.length,
        cost: tierRequests.reduce((sum, r) => sum + r.cost, 0),
        inputTokens: tierRequests.reduce((sum, r) => sum + r.inputTokens, 0),
        outputTokens: tierRequests.reduce((sum, r) => sum + r.outputTokens, 0)
      };
      requestsByTier[tier] = tierRequests.length;
    });

    return {
      totalRequests: this.requests.length,
      successfulRequests: successful.length,
      failedRequests: this.requests.length - successful.length,
      totalCost,
      baselineCost,
      savings,
      savingsPercent,
      savingsMultiplier: baselineCost > 0 ? baselineCost / totalCost : 0,
      avgCostPerRequest: totalCost / successful.length,
      totalInputTokens,
      totalOutputTokens,
      costByTier,
      requestsByTier
    };
  }

  /**
   * Generate a detailed report
   */
  generateReport() {
    const stats = this.calculateStats();
    
    let report = '═══════════════════════════════════════════════════════\n';
    report += '              SMARTROUTER COST REPORT\n';
    report += '═══════════════════════════════════════════════════════\n\n';

    report += `📊 Summary:\n`;
    report += `   Total Requests: ${stats.totalRequests}\n`;
    report += `   Successful: ${stats.successfulRequests}\n`;
    report += `   Failed: ${stats.failedRequests}\n\n`;

    report += `💰 Costs:\n`;
    report += `   SmartRouter Cost: $${stats.totalCost.toFixed(6)}\n`;
    report += `   Baseline Cost (All Opus): $${stats.baselineCost.toFixed(6)}\n`;
    report += `   💎 Savings: $${stats.savings.toFixed(6)} (${stats.savingsPercent.toFixed(1)}%)\n`;
    report += `   🚀 Cost Multiplier: ${stats.savingsMultiplier.toFixed(2)}x cheaper\n`;
    report += `   Avg Cost/Request: $${stats.avgCostPerRequest.toFixed(6)}\n\n`;

    report += `📈 Breakdown by Tier:\n`;
    Object.entries(stats.costByTier).forEach(([tier, data]) => {
      if (data.requests > 0) {
        report += `   ${tier}:\n`;
        report += `      Requests: ${data.requests}\n`;
        report += `      Cost: $${data.cost.toFixed(6)}\n`;
        report += `      Tokens: ${data.inputTokens.toLocaleString()} in / ${data.outputTokens.toLocaleString()} out\n`;
      }
    });

    report += '\n═══════════════════════════════════════════════════════\n';

    return report;
  }

  /**
   * Export to CSV
   */
  async exportCSV(filename) {
    const filepath = join(this.dataDir, filename || `smartrouter-${Date.now()}.csv`);
    
    let csv = 'ID,Timestamp,Tier,Model,Input Tokens,Output Tokens,Cost,Duration (ms),Success,Attempts,Error\n';
    
    this.requests.forEach(r => {
      csv += `${r.id},`;
      csv += `${r.timestamp.toISOString()},`;
      csv += `${r.tier},`;
      csv += `${r.model},`;
      csv += `${r.inputTokens},`;
      csv += `${r.outputTokens},`;
      csv += `${r.cost.toFixed(8)},`;
      csv += `${r.duration},`;
      csv += `${r.success},`;
      csv += `${r.attempts || 1},`;
      csv += `"${r.error || ''}"\n`;
    });

    await writeFile(filepath, csv, 'utf-8');
    return filepath;
  }

  /**
   * Get recent requests
   */
  getRecentRequests(limit = 10) {
    return this.requests.slice(-limit);
  }

  /**
   * Clear all data
   */
  clear() {
    this.requests = [];
  }

  /**
   * Real-time dashboard data
   */
  getDashboard() {
    const stats = this.calculateStats();
    const recent = this.getRecentRequests(5);

    return {
      stats,
      recent: recent.map(r => ({
        timestamp: r.timestamp.toISOString(),
        tier: r.tier,
        model: r.model,
        cost: r.cost.toFixed(6),
        success: r.success,
        duration: r.duration
      }))
    };
  }
}
