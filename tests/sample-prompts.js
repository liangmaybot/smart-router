/**
 * Sample prompts representing various complexity levels
 */

export const samplePrompts = [
  // SIMPLE queries (should route to Minimax)
  { text: "What's 2+2?", expectedTier: 'SIMPLE' },
  { text: "What's the capital of France?", expectedTier: 'SIMPLE' },
  { text: "Say hello", expectedTier: 'SIMPLE' },
  { text: "What time is it?", expectedTier: 'SIMPLE' },
  { text: "Define 'algorithm'", expectedTier: 'SIMPLE' },
  { text: "Who wrote Hamlet?", expectedTier: 'SIMPLE' },
  { text: "What color is the sky?", expectedTier: 'SIMPLE' },
  { text: "How many days in a week?", expectedTier: 'SIMPLE' },
  { text: "Translate 'hello' to Spanish", expectedTier: 'SIMPLE' },
  { text: "What does API stand for?", expectedTier: 'SIMPLE' },
  
  // More SIMPLE
  { text: "Name a fruit", expectedTier: 'SIMPLE' },
  { text: "What is water made of?", expectedTier: 'SIMPLE' },
  { text: "Spell 'necessary'", expectedTier: 'SIMPLE' },
  { text: "What's 10 * 5?", expectedTier: 'SIMPLE' },
  { text: "Who is the president of the USA?", expectedTier: 'SIMPLE' },
  { text: "What does CPU stand for?", expectedTier: 'SIMPLE' },
  { text: "Name the primary colors", expectedTier: 'SIMPLE' },
  { text: "What is the largest ocean?", expectedTier: 'SIMPLE' },
  { text: "How many continents are there?", expectedTier: 'SIMPLE' },
  { text: "What language is spoken in Brazil?", expectedTier: 'SIMPLE' },
  
  // Even more SIMPLE
  { text: "What comes after Monday?", expectedTier: 'SIMPLE' },
  { text: "Convert 1 mile to kilometers", expectedTier: 'SIMPLE' },
  { text: "What is the opposite of hot?", expectedTier: 'SIMPLE' },
  { text: "Name a mammal", expectedTier: 'SIMPLE' },
  { text: "What is 50% of 100?", expectedTier: 'SIMPLE' },
  { text: "Who painted the Mona Lisa?", expectedTier: 'SIMPLE' },
  { text: "What does HTTP stand for?", expectedTier: 'SIMPLE' },
  { text: "Name a planet", expectedTier: 'SIMPLE' },
  { text: "What is H2O?", expectedTier: 'SIMPLE' },
  { text: "What year did WWII end?", expectedTier: 'SIMPLE' },
  
  // MEDIUM queries
  { text: "Explain how photosynthesis works", expectedTier: 'MEDIUM' },
  { text: "Compare Python and JavaScript for web development", expectedTier: 'MEDIUM' },
  { text: "Write a short poem about coding", expectedTier: 'MEDIUM' },
  { text: "Summarize the plot of The Great Gatsby", expectedTier: 'MEDIUM' },
  { text: "What are the benefits of exercise?", expectedTier: 'MEDIUM' },
  
  // More MEDIUM
  { text: "Explain the difference between AI and ML", expectedTier: 'MEDIUM' },
  { text: "Write a haiku about winter", expectedTier: 'MEDIUM' },
  { text: "How does HTTP work?", expectedTier: 'MEDIUM' },
  { text: "Compare SQL and NoSQL databases", expectedTier: 'MEDIUM' },
  { text: "What are the main causes of climate change?", expectedTier: 'MEDIUM' },
  
  // COMPLEX queries (code, deep reasoning)
  {
    text: "Write a Python function to implement binary search with detailed comments explaining the algorithm",
    expectedTier: 'COMPLEX'
  },
  {
    text: "Design a scalable microservices architecture for an e-commerce platform. Include service boundaries, communication patterns, and database strategies.",
    expectedTier: 'COMPLEX'
  },
  {
    text: "Debug this code and explain what's wrong:\n```javascript\nfunction factorial(n) {\n  return n * factorial(n-1);\n}\n```",
    expectedTier: 'COMPLEX'
  },
  {
    text: "Analyze the time complexity of quicksort in best, average, and worst cases. Provide mathematical proof.",
    expectedTier: 'COMPLEX'
  },
  {
    text: "Create a comprehensive test strategy for a distributed system with multiple failure modes. Include unit, integration, and chaos engineering approaches.",
    expectedTier: 'COMPLEX'
  },
  
  // More COMPLEX
  {
    text: "Implement a LRU cache in JavaScript with O(1) get and set operations. Explain the data structures used.",
    expectedTier: 'COMPLEX'
  },
  {
    text: "Design a fault-tolerant distributed key-value store. Discuss consistency models, replication strategies, and partition handling.",
    expectedTier: 'COMPLEX'
  },
  {
    text: "Write a React component that implements virtualized scrolling for 10,000+ items with smooth performance",
    expectedTier: 'COMPLEX'
  },
  {
    text: "Refactor this legacy codebase to use modern design patterns. Explain each change and why it improves maintainability.",
    expectedTier: 'COMPLEX'
  },
  {
    text: "Implement a rate limiter using the token bucket algorithm. Include tests and explain the trade-offs vs sliding window.",
    expectedTier: 'COMPLEX'
  }
];

// Additional utility
export function getPromptsByTier(tier) {
  return samplePrompts.filter(p => p.expectedTier === tier);
}

export function getRandomPrompts(count = 10) {
  const shuffled = [...samplePrompts].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
