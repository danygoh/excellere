// Concept Library Content - Module 1: AI-Native Business Design
// 4 concepts for the first module

export const conceptLibrary = [
  {
    id: 'ai-native-vs-augmented',
    module_id: 'ai-native-business-design',
    order_index: 1,
    name: 'AI-Native vs AI-Augmented',
    summary: 'Understanding the difference between AI that assists and AI that drives',
    
    body_text: `## The Spectrum of AI Adoption

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

### The Key Insight

The gap from Level 2 to Level 3 isn't about technology. It's about mindset.

AI-native organisations don't ask "How can we use AI in our existing processes?"

They ask "If AI could make this decision, what would the process look like?"`,
    
    example_generic: `Netflix vs Blockbuster: Netflix used AI to recommend content, then to personalise the entire experience, then to create content. Each step moved them further from being a "store" to being an "AI platform."`,
    
    example_fs: `A traditional bank uses AI to detect fraud (Level 1). An AI-native fintech uses AI to decide who gets a loan, what interest rate, and what product mix — in seconds, not days. The human's role shifts from decision-maker to overseer.`,
    
    example_healthcare: `A hospital uses AI to help radiologists read scans (AI assisting doctors). An AI-native system triages patients, prioritises cases, and surfaces treatment recommendations — the doctor becomes the exception-handler, not the primary decision-maker.`,
    
    example_tech: `Traditional software uses AI for autocomplete. AI-native software uses AI to architect solutions, write core code, and test for edge cases — the engineer reviews and refines, rather than creates from scratch.`,
    
    teach_prompt: `Your CEO walks into your office and asks: "What do you mean when you say we're not AI-native? We've invested millions in AI." You have 60 seconds. Explain the difference in a way that makes the strategic implication clear.`,
    
    questions_medium: [
      {
        id: 'm1',
        question: 'A retailer uses AI to personalise product recommendations on their website. At what level are they?',
        options: [
          { id: 'a', text: 'Level 0 - No AI', correct: false },
          { id: 'b', text: 'Level 1 - AI-Augmented', correct: true },
          { id: 'c', text: 'Level 2 - AI-Enhanced', correct: false },
          { id: 'd', text: 'Level 3 - AI-Native', correct: false }
        ],
        explanation: 'Personalised recommendations assist the human shopper but the human still drives the purchase decision.'
      },
      {
        id: 'm2',
        question: 'What\'s the fundamental question an AI-native organisation asks?',
        options: [
          { id: 'a', text: 'How can we use AI in our existing processes?', correct: false },
          { id: 'b', text: 'If AI could make this decision, what would the process look like?', correct: true },
          { id: 'c', text: 'How much will AI cost us?', correct: false },
          { id: 'd', text: 'Which AI vendor should we choose?', correct: false }
        ],
        explanation: 'AI-native organisations work backwards from AI capability to process design.'
      }
    ],
    
    questions_hard: [
      {
        id: 'h1',
        question: 'A claims insurer uses AI to flag suspicious claims for human review. What would have to be true for them to become AI-native in claims processing?',
        options: [
          { id: 'a', text: 'AI reviews all claims and humans only handle exceptions', correct: true },
          { id: 'b', text: 'AI makes recommendations but humans always decide', correct: false },
          { id: 'c', text: 'AI only handles simple claims, complex ones stay human', correct: false },
          { id: 'd', text: 'AI is used for fraud detection only', correct: false }
        ],
        explanation: 'AI-native means AI is the default decision-maker; humans handle edge cases, not the norm.'
      },
      {
        id: 'h2',
        question: 'Why might a company at Level 2 struggle to reach Level 3 even with unlimited budget?',
        options: [
          { id: 'a', text: 'They don\'t have enough data', correct: false },
          { id: 'b', text: 'The gap is mindset, not technology - they keep designing around human decision-making', correct: true },
          { id: 'c', text: 'Level 3 doesn\'t exist yet', correct: false },
          { id: 'd', text: 'AI isn\'t mature enough', correct: false }
        ],
        explanation: 'The hardest part of becoming AI-native isn\'t the AI - it\'s questioning whether the current decision-making model makes sense.'
      }
    ],
    
    questions_very_hard: [
      {
        id: 'vh1',
        question: 'A hospital AI system triages emergency patients and only escalates to doctors when it\'s uncertain. A patient sues after a misdiagnosis. Who is legally responsible?',
        options: [
          { id: 'a', text: 'The AI - it made the decision', correct: false },
          { id: 'b', text: 'The doctor who should have overseen the system', correct: true },
          { id: 'c', text: 'The hospital board', correct: false },
          { id: 'd', text: 'No one - it was an AI error', correct: false }
        ],
        explanation: 'This is the frontier of AI governance. Current law typically places responsibility on humans who should have been overseeing the AI.'
      },
      {
        id: 'vh2',
        question: 'If AI could accurately assess credit risk at scale, what happens to the traditional banking competitive advantage of "relationships"?',
        options: [
          { id: 'a', text: 'Nothing - relationships still matter for complex deals', correct: false },
          { id: 'b', text: 'It becomes a commodity - AI can assess anyone, anywhere, instantly', correct: true },
          { id: 'c', text: 'Banks will use AI to enhance relationships further', correct: false },
          { id: 'd', text: 'Regulations will prevent AI from fully taking over', correct: false }
        ],
        explanation: 'This is the strategic disruption question. If AI removes the information asymmetry that relationships were solving for, the basis of competition shifts entirely.'
      }
    ],
    
    score_dimensions: ['concept_accuracy', 'applied_to_own_context', 'explained_key_mechanism', 'clarity_for_non_technical']
  },
  
  {
    id: 'ai-maturity-matrix',
    module_id: 'ai-native-business-design',
    order_index: 2,
    name: 'The AI Maturity Matrix',
    summary: 'Assessing where your organisation truly sits on the AI adoption curve',
    
    body_text: `## The Five Levels of AI Maturity

**Level 1 - Awareness**
- Exploring AI potential through POCs and experiments
- No production deployments
- Learning phase

**Level 2 - Implementation**
- AI in production for specific use cases
- Isolated successes
- Beginning to standardise

**Level 3 - Scaling**
- Enterprise-wide AI deployment
- Standardised, repeatable processes
- AI starts driving strategy

**Level 4 - Optimising**
- Continuous improvement
- AI informs business strategy
- Competitive advantage from AI

**Level 5 - Leading**
- AI-native organisation
- AI is core to competitive advantage
- New business models enabled by AI

### Self-Assessment Framework

Where does your organisation sit?

**Technology**: What AI infrastructure do you have? Is it enterprise-grade or still experimental?
**Process**: How are AI projects approved and deployed? Is there a clear governance framework?
**People**: What's your AI talent density? Do you have AI-native leaders or just AI-curious ones?
**Culture**: How do leaders view AI - as threat, tool, or transformation driver?
**Data**: Is your data AI-ready - accessible, quality-assured, and governed?`,
    
    example_generic: `Most companies are at Level 2. They have a few AI wins but can't scale them. The gap usually isn't technical - it's process and culture.`,
    
    example_fs: `Goldman Sachs deployed AI for risk assessment (Level 2 → 3). But their core trading business still relies on human judgment. The frontier is whether AI can make the big strategic calls.`,
    
    example_healthcare: `Most hospitals are Level 1-2. Radiology AI is common, but clinical decision support at scale is rare. Regulatory complexity adds layers.`,
    
    example_tech: `FAANG companies are mostly Level 4-5. They're already at the frontier - AI-native business models, new products that couldn't exist without AI.`,
    
    teach_prompt: `Your board asks: "Where are we on AI compared to our competitors?" You have 90 seconds to give them a honest assessment using the maturity matrix framework.`,
    
    questions_medium: [
      {
        id: 'm1',
        question: 'Your company has AI in production for 3 different use cases, but each was built by a different team with different tools. What level are you?',
        options: [
          { id: 'a', text: 'Level 1', correct: false },
          { id: 'b', text: 'Level 2', correct: true },
          { id: 'c', text: 'Level 3', correct: false },
          { id: 'd', text: 'Level 4', correct: false }
        ],
        explanation: 'Level 2 means AI in production but not yet enterprise-scaled or standardised.'
      }
    ],
    
    questions_hard: [
      {
        id: 'h1',
        question: 'What\'s typically the hardest barrier to moving from Level 2 to Level 3?',
        options: [
          { id: 'a', text: 'Technology - better models needed', correct: false },
          { id: 'b', text: 'Data - not enough quality data', correct: false },
          { id: 'c', text: 'Process - no governance framework for AI at scale', correct: true },
          { id: 'd', text: 'Money - not enough budget', correct: false }
        ],
        explanation: 'The jump from isolated wins to enterprise scale is primarily about process and governance, not technology.'
      }
    ],
    
    questions_very_hard: [
      {
        id: 'vh1',
        question: 'A CEO says "We\'re Level 3 because we have AI in every department." But each department built their own. What\'s wrong with this assessment?',
        options: [
          { id: 'a', text: 'Nothing - that is Level 3', correct: false },
          { id: 'b', text: 'They\'re still Level 2 - no enterprise standardisation means no true scaling', correct: true },
          { id: 'c', text: 'They\'re Level 4 - AI is informing strategy', correct: false },
          { id: 'd', text: 'They\'re Level 1 - departmental experiments don\'t count', correct: false }
        ],
        explanation: 'True Level 3 means enterprise-wide standardisation, not just presence in multiple departments. Fragmented AI is still Level 2.'
      }
    ],
    
    score_dimensions: ['concept_accuracy', 'applied_to_own_context', 'strategic_awareness', 'framework_understanding']
  },
  
  {
    id: 'process-redesign',
    module_id: 'ai-native-business-design',
    order_index: 3,
    name: 'AI-First Process Redesign',
    summary: 'How to design processes with AI as the default decision-maker',
    
    body_text: `## The Principle

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
- What's the override mechanism?

**4. Build Feedback Loops**
- How does AI learn from outcomes?
- What signals indicate drift?
- When does human intervention improve the system?

### Example: Credit Approval

**Traditional**: Human reviews application → makes decision
**AI-Augmented**: AI recommends → human approves
**AI-Native**: AI approves/declines → human reviews edge cases`,
    
    example_generic: `Amazon doesn't have humans deciding what products to show you. They designed the process for AI first, then added human oversight for the edge cases where AI might be wrong.`,
    
    example_fs: `Ant Financial in China approved loans in 3 minutes using AI. The original banking process took 3 weeks. They didn't add AI to the old process - they rebuilt it for AI.`,
    
    example_healthcare: `Instead of AI helping radiologists, what if the process was: AI screens all scans → flags anomalies → only anomalies go to humans? That's a complete process redesign.`,
    
    example_tech: `GitHub Copilot doesn't have humans writing code first. It generates code first → human reviews → accepts or modifies. The human is the quality gate, not the creator.`,
    
    teach_prompt: `Your operations director says: "We\'ve added AI to our claims process and it\'s 20% faster." You have 60 seconds to explain why this is still AI-augmented, not AI-native - and what the process redesign would look like.`,
    
    questions_medium: [
      {
        id: 'm1',
        question: 'What\'s the first question to ask when redesigning a process for AI?',
        options: [
          { id: 'a', text: 'What AI tools should we use?', correct: false },
          { id: 'b', text: 'If AI could make this decision perfectly, what would the process look like?', correct: true },
          { id: 'c', text: 'How much will it cost?', correct: false },
          { id: 'd', text: 'Who will oversee the AI?', correct: false }
        ],
        explanation: 'Start with the end state - AI as the default decision-maker - then work backwards.'
      }
    ],
    
    questions_hard: [
      {
        id: 'h1',
        question: 'A bank adds AI to their loan approval process: AI reviews applications and produces a recommendation, then a human makes the final decision. What\'s wrong with this approach?',
        options: [
          { id: 'a', text: 'Nothing - this is good AI governance', correct: false },
          { id: 'b', text: 'It keeps the human as the bottleneck - the process is still designed for human decision-making', correct: true },
          { id: 'c', text: 'AI should make all decisions without human input', correct: false },
          { id: 'd', text: 'This is actually AI-native', correct: false }
        ],
        explanation: 'AI-augmented keeps the human in the critical path. AI-native flips this: AI decides, human handles exceptions.'
      }
    ],
    
    questions_very_hard: [
      {
        id: 'vh1',
        question: 'When designing for AI-first, where should human judgment specifically be added?',
        options: [
          { id: 'a', text: 'Every decision - humans should always decide', correct: false },
          { id: 'b', text: 'Only when AI requests it', correct: false },
          { id: 'c', text: 'Where it genuinely adds value: edge cases, ethical considerations, relationship-based judgment', correct: true },
          { id: 'd', text: 'Never - AI should make all decisions', correct: false }
        ],
        explanation: 'The key is identifying where human judgment actually adds unique value, not adding humans by default.'
      }
    ],
    
    score_dimensions: ['concept_accuracy', 'applied_to_own_context', 'process_design_skill', 'edge_case_reasoning']
  },
  
  {
    id: 'strategic-implications',
    module_id: 'ai-native-business-design',
    order_index: 4,
    name: 'Strategic Implications of AI-Native',
    summary: 'Why AI-native changes everything about competitive strategy',
    
    body_text: `## The Permission AI Gives Us

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

### The Competitive Landscape Shift

When AI can do X 100x better than humans:
- First-order thinking: "How do we implement X with AI?"
- Second-order thinking: "Is X still the right thing to do?"

The CEO who asks "What business are we in?" is doing second-order thinking.
AI makes this question urgent because the answer changes more frequently.`,
    
    example_generic: `Uber isn\'t a "transportation company" with AI - they\'re an AI company that happens to do transportation. The business model changed because AI enabled new possibilities.`,
    
    example_fs: `Square became a bank without being a traditional bank. AI enabled them to assess credit risk differently, bypassing the traditional branch infrastructure.`,
    
    example_healthcare: `Tempus uses AI to personalise cancer treatment by analyzing clinical and molecular data at scale. They\'re not a hospital chain - they\'re an AI platform that happens to work in healthcare.`,
    
    example_tech: `Stripe became the payment infrastructure because AI enabled real-time fraud detection at scale. Traditional payment companies couldn\'t match the speed and accuracy.`,
    
    teach_prompt: `A senior executive says: "We\'ve been in this business for 50 years - AI won\'t change who we are." You have 60 seconds to explain why this mindset is the real risk.`,
    
    questions_medium: [
      {
        id: 'm1',
        question: 'What question should leaders ask about processes they\'ve always done?',
        options: [
          { id: 'a', text: 'How can AI make this faster?', correct: false },
          { id: 'b', text: 'Would we start this from scratch today?', correct: true },
          { id: 'c', text: 'How much does it cost?', correct: false },
          { id: 'd', text: 'Who does this now?', correct: false }
        ],
        explanation: 'If the answer is no, AI might be the catalyst for change.'
      }
    ],
    
    questions_hard: [
      {
        id: 'h1',
        question: 'Why might "our brand is our moat" be a dangerous assumption in an AI-native world?',
        options: [
          { id: 'a', text: 'Brands don\'t matter anymore', correct: false },
          { id: 'b', text: 'AI can assess quality at scale, so differentiation shifts from trust to capability', correct: true },
          { id: 'c', text: 'Brands are more important with AI', correct: false },
          { id: 'd', text: 'AI can\'t assess quality', correct: false }
        ],
        explanation: 'If AI can verify quality objectively, the subjective trust that brands provide becomes less of a differentiator.'
      }
    ],
    
    questions_very_hard: [
      {
        id: 'vh1',
        question: 'A traditional retailer says "Our advantage is 500 stores across the country." How should AI change how they think about this?',
        options: [
          { id: 'a', text: 'It doesn\'t - stores are still an advantage', correct: false },
          { id: 'b', text: 'AI can deliver to any address - physical presence becomes less strategic', correct: true },
          { id: 'c', text: 'They should add AI to stores', correct: false },
          { id: 'd', text: 'Stores are more important for AI to work', correct: false }
        ],
        explanation: 'If AI can reach any customer directly, the strategic value of physical presence fundamentally changes.'
      }
    ],
    
    score_dimensions: ['concept_accuracy', 'applied_to_own_context', 'strategic_depth', 'competitive_analysis']
  }
];

export default conceptLibrary;
