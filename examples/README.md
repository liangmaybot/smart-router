# SmartRouter Examples

Practical examples demonstrating SmartRouter's cost optimization capabilities.

## Running Examples

Make sure you've installed dependencies:

```bash
npm install
```

Then run any example:

```bash
node examples/basic-usage.js
node examples/cost-optimization.js
node examples/custom-configuration.js
node examples/real-world-chatbot.js
```

## Available Examples

### 1. `basic-usage.js`
**What it demonstrates:**
- Simple routing of queries to optimal models
- Cost comparison between tiers
- Basic cost tracking

**Best for:** Getting started and understanding core concepts

**Run time:** ~1 second

---

### 2. `cost-optimization.js`
**What it demonstrates:**
- Batch processing of 50 mixed queries
- Detailed cost breakdown by tier
- Annual projection and ROI calculations
- CSV export functionality

**Best for:** Understanding real-world cost savings at scale

**Run time:** ~5 seconds

**Output:** Generates `data/cost-optimization-demo.csv`

---

### 3. `custom-configuration.js`
**What it demonstrates:**
- Overriding default model configurations
- Forcing specific model tiers
- Environment-based routing (dev/staging/production)
- Manual task analysis
- Real-time cost dashboard

**Best for:** Learning advanced configuration and customization

**Run time:** ~2 seconds

---

### 4. `real-world-chatbot.js`
**What it demonstrates:**
- Simulates 1,000 customer support queries
- Realistic query distribution (50% simple, 35% medium, 15% complex)
- Business impact analysis (daily/monthly/annual costs)
- Quality metrics and success rates
- Cost vs headcount trade-off analysis

**Best for:** Seeing SmartRouter's impact in production scenarios

**Run time:** ~10 seconds

**Key metrics shown:**
- 70-90% cost reduction vs all-Opus baseline
- Sub-second average response times
- 98-99% success rate
- Thousands of dollars in annual savings

---

## Example Output

### Basic Usage

```
🚀 SmartRouter - Basic Usage Example

Example 1: Simple factual question
─────────────────────────────────

📊 Task Analysis: SIMPLE (confidence: 92%)
   Reasoning: Simple query with basic requirements
🚀 Attempting Minimax M2.5 (SIMPLE)...
✅ Success with Minimax M2.5
   Cost: $0.000025 | Duration: 234ms

Response: The capital of France is Paris.
Model Used: Minimax M2.5 (SIMPLE)
Cost: $0.000025
Duration: 234ms


💰 Cost Summary
═════════════════════════════════

Total requests: 3
SmartRouter cost: $0.000852
Baseline cost (all Opus): $0.008234
Savings: $0.007382 (89.7%)
Cost multiplier: 9.66x cheaper
```

### Real-World Chatbot

```
💬 SmartRouter - Real-World Chatbot Simulation

Simulating 1 day of customer support queries (1000 messages)...

✅ Processed 1000 queries in 8.42s
   Average response time: 234ms

═══════════════════════════════════════════════════════
              SMARTROUTER COST REPORT
═══════════════════════════════════════════════════════

📊 Summary:
   Total Requests: 1000
   Successful: 985
   Failed: 15

💰 Costs:
   SmartRouter Cost: $0.234560
   Baseline Cost (All Opus): $2.156780
   💎 Savings: $1.922220 (89.1%)
   🚀 Cost Multiplier: 9.19x cheaper
   Avg Cost/Request: $0.000238

💼 Business Impact Analysis:

Monthly Projection (30,000 queries):
  SmartRouter: $7.04
  Baseline (all Opus): $64.70
  💰 Savings: $57.67

Annual Projection (365,000 queries):
  SmartRouter: $85.61
  Baseline (all Opus): $787.22
  💎 Savings: $701.61
```

## Tips for Your Own Implementation

1. **Start with basic-usage.js** to understand the core concepts
2. **Run cost-optimization.js** to see savings at scale
3. **Study custom-configuration.js** to learn configuration options
4. **Reference real-world-chatbot.js** for production patterns

## Real API Integration

These examples use mock responses for demonstration. To integrate with real APIs:

```javascript
import { ModelRouter, CostTracker } from '@openclaw/smart-router';
import { createApiClient } from '@your-provider/sdk';

const apiClient = createApiClient({
  apiKey: process.env.API_KEY
});

const router = new ModelRouter({ apiClient });

// Now routes to real models!
const result = await router.route("Your query here");
```

## Next Steps

- Read the full [SKILL.md](../SKILL.md) for comprehensive documentation
- Check out [src/](../src/) to understand the implementation
- Run the [demo](../tests/demo.js): `npm run demo`
- Integrate SmartRouter into your own projects

## Questions?

- **Documentation**: See [SKILL.md](../SKILL.md)
- **Issues**: Open an issue on GitHub
- **Discord**: Join the OpenClaw community

---

**💡 Remember:** Every query routed through SmartRouter saves you money. Start small, measure savings, and scale with confidence!
