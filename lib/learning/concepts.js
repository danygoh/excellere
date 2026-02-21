// Learning Concepts Content - Module 1: AI-Native Business Design
// These are the core concepts delivered to learners

export const concepts = {
  // Module 1: AI-Native Business Design
  'ai-native-business-design': {
    id: 'ai-native-business-design',
    name: 'AI-Native Business Design',
    concepts: [
      {
        id: 'what-is-ai-native',
        name: 'What is AI-Native?',
        description: 'Understanding the difference between AI-augmented and AI-native',
        content: `
## What is AI-Native?

### The Spectrum of AI Adoption

Most organisations sit on the left side of this spectrum:

**Level 0: No AI**
- No AI capabilities deployed
- Manual processes everywhere

**Level 1: AI-Augmented**
- AI assists human decision-making
- Humans make the final calls
- AI is a tool, not a driver

**Level 2: AI-Enhanced**
- AI optimizes existing processes
- Efficiency gains within current workflows
- Still working within legacy frameworks

**Level 3: AI-Native**
- AI is the default decision-maker
- Processes designed around AI capabilities
- Human oversight, not human decision-making
- New business models enabled by AI

### Why This Matters

The gap from Level 2 to Level 3 isn't about technology. It's about mindset.

AI-native organisations don't ask "How can we use AI in our existing processes?"

They ask "If AI could make this decision, what would the process look like?"
        `,
        keyQuestions: [
          'At what level is your organisation currently?',
          'What would have to change to move from Level 2 to Level 3?',
          'What decisions could AI make better than humans?'
        ]
      },
      {
        id: 'ai-maturity-matrix',
        name: 'The AI Maturity Matrix',
        description: 'Assessing your organisation\'s AI readiness',
        content: `
## The AI Maturity Matrix

### The Five Levels

| Level | Description | Key Characteristics |
|-------|-------------|---------------------|
| 1 - Awareness | Exploring AI potential | POCs, experiments, no production |
| 2 - Implementation | AI in production | Specific use cases, isolated success |
| 3 - Scaling | Enterprise-wide AI | Standardised, repeatable |
| 4 - Optimising | Continuous improvement | AI driving strategy |
| 5 - Leading | AI-native | AI is competitive advantage |

### Self-Assessment

Where does your organisation sit?

**Technology**: What AI infrastructure do you have?
**Process**: How are AI projects approved and deployed?
**People**: What's your AI talent density?
**Culture**: How do leaders view AI - threat or opportunity?
**Data**: Is your data AI-ready?

### The Gap to Level 3

Most organisations are stuck at Level 2.

The gap isn't:
- More data
- Better models
- More engineers

The gap is:
- Decision-making framework
- Process redesign
- Leadership mindset
        `,
        keyQuestions: [
          'What level is your organisation?',
          'What\'s the biggest barrier to moving up?',
          'Who\'s responsible for AI strategy?'
        ]
      },
      {
        id: 'process-redesign',
        name: 'AI-First Process Redesign',
        description: 'Designing processes with AI as the default',
        content: `
## AI-First Process Redesign

### The Principle

When redesigning a process for AI, start with this question:

**"If AI could make this decision perfectly, what would the process look like?"**

Then work backwards to add human oversight where needed - not the other way around.

### The Framework

**1. Identify the Decision**
- What decision does this process make?
- How often? At what scale?
- What's the current accuracy vs. required accuracy?

**2. Design for AI First**
- What data would AI need?
- What would perfect execution look like?
- What's the simplest version?

**3. Add Human Layer**
- Where does human judgment add value?
- What are the edge cases?
- What\'s the override mechanism?

**4. Build Feedback Loops**
- How does AI learn from outcomes?
- What signals indicate drift?
- When does human intervention improve the system?

### Example: Credit Approval

**Traditional**: Human reviews application → makes decision
**AI-Augmented**: AI recommends → human approves
**AI-Native**: AI approves/declines → human reviews edge cases
        `,
        keyQuestions: [
          'What\'s one process you could redesign for AI-first?',
          'What human input would still be valuable?',
          'What\'s the smallest version you could test?'
        ]
      }
    ]
  },
  
  // Module 2: Double Loop Strategy
  'double-loop-strategy': {
    id: 'double-loop-strategy',
    name: 'Double Loop Strategy',
    concepts: [
      {
        id: 'first-vs-second-order',
        name: 'First vs Second-Order Thinking',
        description: 'The foundation of strategic AI thinking',
        content: `
## First vs Second-Order Thinking

### First-Order Thinking

"What we do, and how we do it better."

- Optimising within current framework
- Working harder/smarter at the same problem
- Incremental improvement
- "How do we win?"

### Second-Order Thinking

"Whether we should be doing this at all."

- Questioning the framework itself
- What are we assuming that's no longer true?
- What would have to be true for our strategy to work?
- "Why are we playing this game?"

### In an AI Context

**First-Order**: "How can we use AI to do X better?"
**Second-Order**: "Is X still the right thing to do?"

### The Strategic Question

When AI can do X 100x better than humans:
- First-order thinking: "How do we implement X with AI?"
- Second-order thinking: "Why are we doing X? What if the answer is now different?"

The CEO who asks "What business are we in?" is doing second-order thinking.
        `,
        keyQuestions: [
          'What\'s a belief your industry holds that AI challenges?',
          'What would have to be true for your strategy to fail?',
          'What decision have you avoided questioning?'
        ]
      },
      {
        id: 'double-loop-framework',
        name: 'The Double Loop Framework',
        description: 'Strategic decision-making with AI',
        content: `
## The Double Loop Framework

### Two Loops, One Process

**Loop 1: The Strategy Loop**
- Define objectives
- Assess current state
- Identify gaps
- Design interventions
- Execute

**Loop 2: The Mental Model Loop**
- Question assumptions
- Challenge premises
- Consider alternatives
- Update worldview
- Reframe the problem

### When to Use Each

**Single Loop (enough)**:
- Execution problems
- Operational improvements
- Known problems, known solutions

**Double Loop (needed)**:
- Strategic uncertainty
- Disruptive change
- Problems that keep recurring
- When solutions stop working

### AI as a Double Loop Catalyst

AI enables double-loop thinking by:

1. **Making the implicit explicit** - Patterns you sensed become visible
2. **Testing assumptions** - Simulate scenarios at scale
3. **Revealing blind spots** - What you can't see, AI can show
4. **Enabling radical reframe** - If X is solved, what becomes possible?
        `,
        keyQuestions: [
          'What\'s a strategy assumption that might be outdated?',
          'If you couldn\'t do what you do today, what would you do?',
          'What does your industry assume that\'s no longer true?'
        ]
      },
      {
        id: 'ai-strategy-catalyst',
        name: 'AI as Strategy Catalyst',
        description: 'Using AI to challenge strategic assumptions',
        content: `
## AI as Strategy Catalyst

### The Permission AI Gives Us

AI gives leaders permission to question things they might have accepted:

**"We need to own manufacturing"**
→ What if we didn't? What would the business model look like?

**"Our distribution network is our competitive advantage"**
→ What if AI could optimize logistics for anyone? What's left?

**"Our brand is our moat"**
→ What if AI could assess quality at scale? What matters then?

### The Strategic Question

Ask: **"What are we doing because we've always done it that way?"**

Then ask: **"Would we start this from scratch today?"**

If the answer is no - AI might be the reason to finally change.

### Framework for Strategic AI

1. **List your strategic assets** - What you think makes you competitive
2. **Ask AI about each** - "If AI could do X at near-zero cost, what happens to this advantage?"
3. **Identify the pivots** - Where does the competitive landscape shift?
4. **Design from the future** - What does winning look like in 5 years? Work backwards.
        `,
        keyQuestions: [
          'What strategic assumption should you question?',
          'If AI could solve X, what would you stop doing?',
          'What\'s the business model AI enables that you couldn\'t before?'
        ]
      }
    ]
  },
  
  // Module 3: Agentic AI
  'agentic-ai': {
    id: 'agentic-ai',
    name: 'Agentic AI for Business',
    concepts: [
      {
        id: 'understanding-agents',
        name: 'Understanding AI Agents',
        description: 'What agents are and when to use them',
        content: `
## Understanding AI Agents

### What is an Agent?

An AI agent is a system that:
1. **Perceives** its environment
2. **Reasons** about what to do
3. **Acts** to achieve goals
4. **Learns** from outcomes

### Not Just Chatbots

**Chatbot**: Responds to prompts (reactive)
**Agent**: Takes action to achieve goals (proactive)

### When to Use Agents

**Good for agents**:
- Repetitive workflows
- Multi-step processes
- Decision trees
- Data processing
- Customer service

**Not for agents**:
- Creative brainstorming
- Strategic thinking
- Relationship building
- Complex negotiation

### The Agent Spectrum

**Simple Agent**: Single task, narrow scope
**Co-Agent**: Works alongside human
**Multi-Agent**: Multiple agents coordinating
        `,
        keyQuestions: [
          'What process takes too much human time?',
          'What would you automate if it could be trusted?',
          'What\'s a decision tree you follow every time?'
        ]
      },
      {
        id: 'agent-architecture',
        name: 'Agent Architecture Patterns',
        description: 'Designing effective agent systems',
        content: `
## Agent Architecture Patterns

### The Tool-Use Pattern

Most common for business:

1. Agent receives task
2. Breaks into steps
3. Uses tools (APIs, databases, documents)
4. Iterates until complete
5. Returns result

### Tools for Business Agents

- **CRM**: Customer data, history
- **ERP**: Orders, inventory, financials
- **Communication**: Email, Slack, calendar
- **Knowledge**: Documents, wikis, PDFs
- **Analytics**: Dashboards, reports

### Design Principles

**1. Clear Success Criteria**
- What does "done" look like?
- How do they know they're right?

**2. Appropriate Autonomy**
- What can they decide vs. escalate?
- When should they ask vs. assume?

**3. Human in the Loop**
- Where does human judgment add value?
- What are the edge cases?

**4. Feedback Mechanisms**
- How do they learn from mistakes?
- When do they update their approach?
        `,
        keyQuestions: [
          'What would you trust an agent to do unsupervised?',
          'What\'s the biggest agent failure you\'d need to catch?',
          'What tools would your agent need access to?'
        ]
      },
      {
        id: 'multi-agent-orchestration',
        name: 'Multi-Agent Orchestration',
        description: 'Coordinating multiple AI agents',
        content: `
## Multi-Agent Orchestration

### When Multiple Agents Make Sense

**Complex workflows** - Different agents for different stages
**Parallel processing** - Agents working simultaneously
**Specialization** - Domain-specific agents
**Redundancy** - Multiple agents checking each other

### Orchestration Patterns

**Sequential**: Agent A → Agent B → Agent C
- Linear workflows
- Each step builds on previous

**Hub-and-Spoke**: Controller → Multiple Agents
- Central coordinator
- Distributes work, aggregates results

**Marketplace**: Agents bid on tasks
- Complex coordination
- Dynamic task assignment

### Example: Customer Service

**Agent 1 - Triage**: Routes inquiry
**Agent 2 - Research**: Gathers context
**Agent 3 - Response**: Drafts answer
**Agent 4 - Quality**: Reviews before send

### Key Considerations

- How do agents communicate?
- What happens when agents disagree?
- How do you debug when things go wrong?
- What's the human oversight mechanism?
        `,
        keyQuestions: [
          'What workflow could be split into agent stages?',
          'How would agents coordinate?',
          'What\'s your fallback if agents fail?'
        ]
      }
    ]
  }
};

export default concepts;
