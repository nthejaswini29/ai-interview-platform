const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const port = process.env.PORT || 3000;

const STORAGE_DIR = './interview_data';
const INTERVIEWS_FILE = path.join(STORAGE_DIR, 'interviews.json');

async function initStorage() {
  try {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
    try {
      await fs.access(INTERVIEWS_FILE);
    } catch {
      await fs.writeFile(INTERVIEWS_FILE, '[]');
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
}

// QUESTIONS WITH REFERENCE ANSWERS FOR AI SCORING
const questionsWithAnswers = [
  {
    question: "Difference between HashMap, ConcurrentHashMap, and Hashtable?",
    referenceAnswer: "HashMap is not thread-safe and allows null keys/values. Hashtable is thread-safe but synchronized at method level causing performance issues. ConcurrentHashMap is thread-safe with better performance using segment-based locking.",
    keywords: ["thread-safe", "synchronization", "performance", "null", "segment", "locking"],
    difficulty: "medium",
    maxScore: 10
  },
  {
    question: "What if hashCode() and equals() contracts are not followed?",
    referenceAnswer: "If hashCode() and equals() contracts are broken, objects may not work correctly in hash-based collections. Objects that are equal should have same hashCode. If not, you'll get duplicate entries or inability to find objects.",
    keywords: ["hashCode", "equals", "contract", "HashMap", "HashSet", "duplicate"],
    difficulty: "hard",
    maxScore: 10
  },
  {
    question: "How does Garbage Collection work?",
    referenceAnswer: "Garbage Collection automatically manages memory by identifying and removing objects that are no longer reachable. It works in generations (Young, Old, Permanent). Uses algorithms like Mark and Sweep, G1GC.",
    keywords: ["memory", "reachable", "generations", "young", "old", "mark", "sweep"],
    difficulty: "medium",
    maxScore: 10
  },
  {
    question: "Shallow vs Deep Copy?",
    referenceAnswer: "Shallow copy creates new object but references point to same memory locations. Deep copy creates completely independent copy with new memory allocations for all nested objects.",
    keywords: ["shallow", "deep", "copy", "reference", "memory", "independent", "nested"],
    difficulty: "easy",
    maxScore: 10
  },
  {
    question: "How to create immutable class?",
    referenceAnswer: "Make class final, all fields private and final, no setter methods, initialize via constructor, return defensive copies of mutable objects.",
    keywords: ["final", "private", "constructor", "defensive copy", "mutable", "immutable"],
    difficulty: "medium",
    maxScore: 10
  },
  {
    question: "Difference between String, StringBuilder, and StringBuffer?",
    referenceAnswer: "String is immutable and thread-safe. StringBuilder is mutable, not thread-safe, better performance for single thread. StringBuffer is mutable, thread-safe, slower due to synchronization.",
    keywords: ["immutable", "mutable", "thread-safe", "synchronization", "performance"],
    difficulty: "easy",
    maxScore: 10
  },
  {
    question: "synchronized vs ReentrantLock vs ReadWriteLock",
    referenceAnswer: "synchronized is implicit locking with automatic release. ReentrantLock provides explicit locking with try-finally, supports fairness. ReadWriteLock allows multiple readers but exclusive writer access.",
    keywords: ["synchronized", "ReentrantLock", "ReadWriteLock", "explicit", "fairness", "readers", "writers"],
    difficulty: "hard",
    maxScore: 10
  },
  {
    question: "Preventing Deadlocks?",
    referenceAnswer: "Prevent deadlocks by avoiding circular wait (order locks consistently), using timeout for lock acquisition, avoiding nested locks, using lock-free algorithms, or tools like deadlock detection.",
    keywords: ["deadlock", "circular wait", "timeout", "nested locks", "lock-free", "detection"],
    difficulty: "medium",
    maxScore: 10
  },
  {
    question: "Java Memory Model & volatile",
    referenceAnswer: "Java Memory Model defines how threads interact through memory. volatile ensures visibility across threads, prevents instruction reordering, but doesn't provide atomicity.",
    keywords: ["memory model", "volatile", "visibility", "reordering", "atomicity", "threads"],
    difficulty: "hard",
    maxScore: 10
  },
  {
    question: "Stream API & Lazy Evaluation",
    referenceAnswer: "Stream API enables functional programming with lazy evaluation. Operations are intermediate (map, filter) and terminal (collect, forEach). Lazy evaluation means intermediate operations execute only when terminal operation is called.",
    keywords: ["Stream", "lazy evaluation", "intermediate", "terminal", "functional", "map", "filter"],
    difficulty: "medium",
    maxScore: 10
  },
  {
    question: "Optional Usage",
    referenceAnswer: "Optional is a container that may or may not contain a value. Helps avoid NullPointerException. Use orElse(), orElseGet(), ifPresent() instead of isPresent().",
    keywords: ["Optional", "NullPointerException", "orElse", "orElseGet", "ifPresent", "container"],
    difficulty: "easy",
    maxScore: 10
  },
  {
    question: "Spring Bean Lifecycle",
    referenceAnswer: "Bean lifecycle: Instantiation -> Populate Properties -> BeanNameAware -> BeanFactoryAware -> ApplicationContextAware -> Pre-Initialization -> InitializingBean -> Post-Initialization -> Bean Ready",
    keywords: ["lifecycle", "instantiation", "properties", "aware", "initialization"],
    difficulty: "hard",
    maxScore: 10
  },
  {
    question: "Spring Dependency Injection Types",
    referenceAnswer: "Three types: Constructor Injection (recommended, immutable), Setter Injection (optional dependencies), Field Injection (not recommended, hard to test).",
    keywords: ["constructor", "setter", "field", "injection", "immutable", "dependencies"],
    difficulty: "medium",
    maxScore: 10
  },
  {
    question: "Monolithic vs SOA vs Microservices",
    referenceAnswer: "Monolithic: Single deployable unit, simple but hard to scale. SOA: Service-oriented with enterprise service bus. Microservices: Independent services, better scalability but complex operations.",
    keywords: ["monolithic", "SOA", "microservices", "deployable", "scalability", "independent"],
    difficulty: "medium",
    maxScore: 10
  },
  {
    question: "Circuit Breaker & Retry",
    referenceAnswer: "Circuit Breaker prevents cascading failures by monitoring failure rates and opening circuit when threshold exceeded. Retry mechanism attempts failed operations with exponential backoff.",
    keywords: ["circuit breaker", "cascading", "failure rate", "threshold", "retry", "exponential backoff"],
    difficulty: "hard",
    maxScore: 10
  },
  {
    question: "LRU Cache",
    referenceAnswer: "LRU Cache uses HashMap for O(1) access and Doubly Linked List for O(1) insertion/deletion. Most recently used items move to head, least recently used items are at tail for eviction.",
    keywords: ["LRU", "HashMap", "O(1)", "doubly linked list", "eviction", "head", "tail"],
    difficulty: "hard",
    maxScore: 10
  },
  {
    question: "Implement Fibonacci using memoization",
    referenceAnswer: "Fibonacci with memoization stores previously computed values in array or map to avoid recomputation. Time complexity reduces from O(2^n) to O(n).",
    keywords: ["Fibonacci", "memoization", "computed", "recomputation", "O(2^n)", "O(n)", "dynamic programming"],
    difficulty: "medium",
    maxScore: 10
  },
  {
    question: "Testing Multi-threaded Code",
    referenceAnswer: "Test multi-threaded code using stress testing, mock frameworks, CountDownLatch, CyclicBarrier for synchronization. Use tools like ExecutorService and concurrent testing frameworks.",
    keywords: ["multi-threaded", "stress testing", "CountDownLatch", "CyclicBarrier", "synchronization", "ExecutorService"],
    difficulty: "hard",
    maxScore: 10
  },
  {
    question: "CI/CD",
    referenceAnswer: "Continuous Integration involves automated building and testing on code commits. Continuous Deployment automatically deploys to production. Includes automated testing, code quality checks, security scans.",
    keywords: ["CI", "CD", "automated", "building", "testing", "deployment", "pipelines", "quality"],
    difficulty: "medium",
    maxScore: 10
  },
  {
    question: "What are sealed classes in Java?",
    referenceAnswer: "Sealed classes restrict which classes can extend them. Declared with 'sealed' keyword and 'permits' clause. Subclasses must be final, sealed, or non-sealed. Enables exhaustive pattern matching.",
    keywords: ["sealed", "permits", "restrict", "extend", "final", "non-sealed", "pattern matching"],
    difficulty: "medium",
    maxScore: 10
  }
];

function getRandomQuestions(count = 5) {
  const shuffled = [...questionsWithAnswers].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(q => ({
    text: q.question,
    difficulty: q.difficulty,
    maxScore: q.maxScore
  }));
}

// ENHANCED AI SCORING FUNCTION
function calculateAIScore(questionData, candidateAnswer) {
  if (!candidateAnswer || candidateAnswer.trim().length === 0) {
    return {
      score: 0,
      feedback: "No answer provided",
      keywordCoverage: 0,
      maxScore: questionData.maxScore,
      detailedAnalysis: "Answer not submitted"
    };
  }

  const answer = candidateAnswer.toLowerCase().trim();
  const keywords = questionData.keywords.map(k => k.toLowerCase());
  
  // 1. Keyword coverage analysis
  let keywordMatches = 0;
  let matchedKeywords = [];
  let missingKeywords = [];
  
  keywords.forEach(keyword => {
    if (answer.includes(keyword)) {
      keywordMatches++;
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });
  
  const keywordCoverage = (keywordMatches / keywords.length) * 100;
  
  // 2. Answer length and structure analysis
  const answerLength = answer.length;
  const wordCount = answer.split(/\s+/).length;
  
  let lengthScore = 0;
  if (answerLength >= 200) lengthScore = 30;
  else if (answerLength >= 100) lengthScore = 25;
  else if (answerLength >= 50) lengthScore = 15;
  else if (answerLength >= 25) lengthScore = 10;
  else lengthScore = 5;
  
  // 3. Technical depth analysis
  const technicalTerms = [
    'thread', 'synchronization', 'performance', 'memory', 'algorithm', 
    'complexity', 'implementation', 'pattern', 'architecture', 'framework',
    'interface', 'abstract', 'inheritance', 'polymorphism', 'encapsulation',
    'collection', 'concurrent', 'volatile', 'synchronized', 'deadlock'
  ];
  
  let technicalDepth = 0;
  technicalTerms.forEach(term => {
    if (answer.includes(term)) technicalDepth++;
  });
  
  const depthScore = Math.min(technicalDepth * 3, 20);
  
  // 4. Calculate final score
  const keywordWeight = 0.5;
  const lengthWeight = 0.3;
  const depthWeight = 0.2;
  
  const rawScore = (keywordCoverage * keywordWeight) + (lengthScore * lengthWeight) + (depthScore * depthWeight);
  const normalizedScore = Math.min(Math.round(rawScore / 10), questionData.maxScore);
  
  // 5. Generate detailed feedback
  let feedback = [];
  let detailedAnalysis = [];
  
  if (keywordCoverage >= 80) {
    feedback.push("Excellent keyword coverage");
    detailedAnalysis.push(`Strong technical vocabulary (${keywordMatches}/${keywords.length} key terms)`);
  } else if (keywordCoverage >= 60) {
    feedback.push("Good keyword usage");
    detailedAnalysis.push(`Good technical understanding (${keywordMatches}/${keywords.length} key terms)`);
  } else if (keywordCoverage >= 40) {
    feedback.push("Moderate keyword coverage");
    detailedAnalysis.push(`Some technical terms missing (${keywordMatches}/${keywords.length} key terms found)`);
  } else {
    feedback.push("Limited technical terminology");
    detailedAnalysis.push(`Many key technical terms missing (only ${keywordMatches}/${keywords.length} found)`);
  }
  
  if (wordCount >= 50) {
    feedback.push("Comprehensive explanation");
  } else if (wordCount >= 25) {
    feedback.push("Adequate detail");
  } else {
    feedback.push("Could be more detailed");
  }
  
  if (technicalDepth >= 5) {
    feedback.push("Good technical depth");
  } else if (technicalDepth >= 3) {
    feedback.push("Moderate technical content");
  } else {
    feedback.push("Needs more technical detail");
  }
  
  return {
    score: normalizedScore,
    maxScore: questionData.maxScore,
    percentage: Math.round((normalizedScore / questionData.maxScore) * 100),
    feedback: feedback.join(", "),
    keywordCoverage: Math.round(keywordCoverage),
    technicalDepth: technicalDepth,
    wordCount: wordCount,
    matchedKeywords: matchedKeywords,
    missingKeywords: missingKeywords,
    detailedAnalysis: detailedAnalysis.join(". ")
  };
}

async function saveInterview(interviewData) {
  try {
    const interviews = await loadInterviews();
    const newInterview = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...interviewData
    };
    
    interviews.push(newInterview);
    await fs.writeFile(INTERVIEWS_FILE, JSON.stringify(interviews, null, 2));
    
    // Also save individual file for this interview
    const individualFile = path.join(STORAGE_DIR, `interview_${newInterview.id}.json`);
    await fs.writeFile(individualFile, JSON.stringify(newInterview, null, 2));
    
    console.log(`✅ Interview saved: ${individualFile}`);
    return newInterview;
  } catch (error) {
    console.error('Error saving interview:', error);
    throw error;
  }
}

async function loadInterviews() {
  try {
    const data = await fs.readFile(INTERVIEWS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function categorizeQuestion(question) {
  const questionLower = question.toLowerCase();
  
  if (questionLower.includes('spring') || questionLower.includes('hibernate') || questionLower.includes('framework')) {
    return 'Frameworks';
  } else if (questionLower.includes('thread') || questionLower.includes('concurrent') || questionLower.includes('synchroniz') || questionLower.includes('deadlock')) {
    return 'Concurrency';
  } else if (questionLower.includes('stream') || questionLower.includes('lambda') || questionLower.includes('optional') || questionLower.includes('sealed')) {
    return 'Java 8+';
  } else if (questionLower.includes('microservices') || questionLower.includes('design') || questionLower.includes('architect') || questionLower.includes('circuit')) {
    return 'System Design';
  } else if (questionLower.includes('algorithm') || questionLower.includes('implement') || questionLower.includes('cache') || questionLower.includes('fibonacci')) {
    return 'Coding';
  } else if (questionLower.includes('test') || questionLower.includes('ci/cd') || questionLower.includes('mock')) {
    return 'Testing & DevOps';
  } else {
    return 'Core Java';
  }
}

// ==================== ROUTES ====================

// Main interview dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'interview-dashboard.html'));
});

// ✅ LANDING PAGE FOR POPUP INTERVIEW (OPTIONAL)
app.get('/start', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Interview Platform - Start Interview</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 0;
                padding: 20px;
            }
            .container {
                background: white;
                border-radius: 20px;
                padding: 40px;
                max-width: 600px;
                text-align: center;
                box-shadow: 0 20px 40px rgba(0,0,0,0.2);
                animation: slideIn 0.6s ease-out;
            }
            @keyframes slideIn {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            h1 {
                color: #2c3e50;
                margin-bottom: 20px;
                font-size: 2.5em;
            }
            p {
                color: #7f8c8d;
                font-size: 1.2em;
                margin-bottom: 30px;
            }
            .start-btn {
                background: linear-gradient(135deg, #3498db, #2980b9);
                color: white;
                border: none;
                padding: 20px 40px;
                border-radius: 10px;
                font-size: 20px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                margin: 20px 0;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            .start-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }
            .note {
                background: #e8f5e8;
                border: 1px solid #27ae60;
                border-radius: 10px;
                padding: 15px;
                margin: 20px 0;
                color: #27ae60;
            }
            .direct-link {
                margin-top: 20px;
                font-size: 14px;
            }
            .direct-link a {
                color: #3498db;
                text-decoration: none;
            }
            .direct-link a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div style="font-size: 4em; margin-bottom: 20px;">🎯</div>
            <h1>AI Interview Platform</h1>
            <p>Welcome to our technical assessment platform powered by artificial intelligence</p>
            
            <div class="note">
                <strong>📋 Before You Start:</strong><br>
                • Ensure stable internet connection<br>
                • Enable camera and microphone permissions<br>
                • Use a quiet, well-lit environment<br>
                • Do not switch tabs during the interview
            </div>
            
            <button class="start-btn" onclick="startInterviewPopup()">🚀 Start Interview (Popup)</button>
            
            <div class="direct-link">
                <p>Prefer not to use popup? <a href="/" target="_blank">Open interview directly</a></p>
            </div>
            
            <div style="margin-top: 30px; font-size: 12px; color: #95a5a6;">
                <p>Powered by AI • Secure • Monitored</p>
            </div>
        </div>

        <script>
            function startInterviewPopup() {
                // Open interview in popup window - this CAN be closed by JavaScript
                const popup = window.open('/', 'interview', 
                    'width=1400,height=900,scrollbars=yes,resizable=yes,location=no,menubar=no,toolbar=no');
                
                if (popup) {
                    // Focus on the popup
                    popup.focus();
                    
                    // Monitor when popup closes
                    const checkClosed = setInterval(() => {
                        if (popup.closed) {
                            clearInterval(checkClosed);
                            showCompletionMessage();
                        }
                    }, 1000);
                } else {
                    alert('Popup blocked! Please allow popups for this site and try again.\\n\\nAlternatively, you can open the interview directly in a new tab.');
                }
            }
            
            function showCompletionMessage() {
                document.querySelector('.container').innerHTML = \`
                    <div style="font-size: 4em; margin-bottom: 20px;">✅</div>
                    <h1>Interview Completed!</h1>
                    <p>Thank you for participating in our AI-powered technical assessment.</p>
                    <div style="background: #e8f5e8; border: 1px solid #27ae60; border-radius: 10px; padding: 20px; margin: 20px 0;">
                        <h3 style="color: #27ae60; margin-bottom: 15px;">What's Next?</h3>
                        <ul style="text-align: left; color: #2c3e50;">
                            <li>Your responses have been analyzed by AI</li>
                            <li>Our technical team will review your assessment</li>
                            <li>You'll receive feedback within 24-48 hours</li>
                        </ul>
                    </div>
                    <button onclick="window.location.reload()" style="background: #3498db; color: white; border: none; padding: 15px 30px; border-radius: 8px; font-size: 16px; cursor: pointer;">
                        Start Another Interview
                    </button>
                \`;
            }
        </script>
    </body>
    </html>
  `);
});

// ✅ PROFESSIONAL THANK YOU PAGE
app.get('/thank-you', (req, res) => {
  const interviewId = req.query.id || Date.now().toString();
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Interview Complete - Thank You</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 0;
                padding: 20px;
            }
            .container {
                background: white;
                border-radius: 20px;
                padding: 40px;
                max-width: 700px;
                text-align: center;
                box-shadow: 0 20px 40px rgba(0,0,0,0.2);
                animation: slideIn 0.6s ease-out;
            }
            @keyframes slideIn {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            .success-icon {
                font-size: 80px;
                margin-bottom: 20px;
                animation: bounce 2s infinite;
            }
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                60% { transform: translateY(-5px); }
            }
            h1 {
                color: #27ae60;
                margin-bottom: 10px;
                font-size: 32px;
            }
            p {
                color: #7f8c8d;
                line-height: 1.6;
                margin-bottom: 20px;
                font-size: 16px;
            }
            .info-box {
                background: linear-gradient(135deg, #e8f5e8, #d5f4e6);
                border: 2px solid #27ae60;
                border-radius: 15px;
                padding: 25px;
                margin: 25px 0;
                position: relative;
                overflow: hidden;
            }
            .info-box::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(39, 174, 96, 0.1) 0%, transparent 70%);
                animation: ripple 3s infinite;
            }
            @keyframes ripple {
                0% { transform: scale(0.8); opacity: 1; }
                100% { transform: scale(1.2); opacity: 0; }
            }
            .info-box h3 {
                color: #27ae60;
                margin-bottom: 15px;
                font-size: 20px;
                position: relative;
                z-index: 1;
            }
            .info-box ul {
                text-align: left;
                color: #2c3e50;
                position: relative;
                z-index: 1;
                margin: 0;
                padding-left: 20px;
            }
            .info-box li {
                margin-bottom: 8px;
                font-weight: 500;
            }
            .interview-id-box {
                background: linear-gradient(135deg, #fff3cd, #ffeaa7);
                border: 2px solid #f39c12;
                border-radius: 10px;
                padding: 20px;
                margin: 20px 0;
                position: relative;
            }
            .interview-id-box h4 {
                color: #856404;
                margin-bottom: 10px;
                font-size: 18px;
            }
            .interview-id {
                font-family: 'Courier New', monospace;
                font-size: 16px;
                font-weight: bold;
                color: #2c3e50;
                background: rgba(255,255,255,0.7);
                padding: 8px 12px;
                border-radius: 5px;
                margin: 10px 0;
                letter-spacing: 1px;
            }
            .button-container {
                display: flex;
                gap: 15px;
                justify-content: center;
                flex-wrap: wrap;
                margin-top: 30px;
            }
            .btn {
                border: none;
                padding: 12px 25px;
                border-radius: 8px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                text-decoration: none;
                display: inline-block;
                min-width: 140px;
            }
            .btn-close {
                background: linear-gradient(135deg, #e74c3c, #c0392b);
                color: white;
            }
            .btn-home {
                background: linear-gradient(135deg, #3498db, #2980b9);
                color: white;
            }
            .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(0,0,0,0.3);
            }
            .footer-note {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #ecf0f1;
                color: #95a5a6;
                font-size: 14px;
            }
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin: 20px 0;
            }
            .stat-item {
                background: #f8f9fa;
                border-radius: 10px;
                padding: 15px;
                border-left: 4px solid #3498db;
            }
            .stat-number {
                font-size: 20px;
                font-weight: bold;
                color: #2c3e50;
            }
            .stat-label {
                font-size: 12px;
                color: #7f8c8d;
                margin-top: 5px;
            }
            @media (max-width: 768px) {
                .container {
                    margin: 10px;
                    padding: 20px;
                }
                .button-container {
                    flex-direction: column;
                    align-items: center;
                }
                .btn {
                    width: 100%;
                    max-width: 250px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="success-icon">🎉</div>
            <h1>Interview Completed Successfully!</h1>
            <p>Thank you for participating in our AI-powered technical assessment. Your responses have been recorded and analyzed.</p>
            
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-number">✓</div>
                    <div class="stat-label">Assessment Complete</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">🤖</div>
                    <div class="stat-label">AI Analysis Done</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">💾</div>
                    <div class="stat-label">Results Saved</div>
                </div>
            </div>
            
            <div class="info-box">
                <h3>🎯 What Happens Next?</h3>
                <ul>
                    <li>✅ Your responses have been analyzed by our AI system</li>
                    <li>📊 Detailed performance report has been generated</li>
                    <li>👥 Our technical team will review your assessment</li>
                    <li>📧 You'll receive feedback within 24-48 hours via email</li>
                    <li>📞 If shortlisted, we'll contact you for the next round</li>
                </ul>
            </div>
            
            <div class="interview-id-box">
                <h4>📋 Your Interview Reference</h4>
                <div class="interview-id">ID: ${interviewId}</div>
                <p style="margin: 0; color: #856404; font-size: 14px;">
                    Please save this ID for your records and future reference.
                </p>
            </div>
            
            <div class="button-container">
                <button class="btn btn-close" onclick="attemptCloseWindow()">
                    🗂️ Close Window
                </button>
                <a href="/" class="btn btn-home">
                    🏠 Return to Home
                </a>
            </div>
            
            <div class="footer-note">
                <p>If you have any questions about your interview or the process, please contact our HR team.</p>
                <p><strong>Email:</strong> hr@company.com | <strong>Phone:</strong> +1-234-567-8900</p>
            </div>
        </div>
        
        <script>
            function attemptCloseWindow() {
                // Try multiple methods to close the window
                try {
                    // Method 1: Standard close
                    window.close();
                    
                    // If that didn't work, try after a short delay
                    setTimeout(() => {
                        try {
                            // Method 2: Close with opener
                            if (window.opener) {
                                window.opener = null;
                                window.close();
                            }
                            
                            // Method 3: Try parent window
                            if (window.parent && window.parent !== window) {
                                window.parent.close();
                            }
                            
                            // Method 4: Navigate to blank page
                            window.location.href = 'about:blank';
                            
                        } catch (e) {
                            // If all methods fail, show instructions
                            alert('Please close this tab manually using:\\n\\n• Windows/Linux: Ctrl + W\\n• Mac: Cmd + W\\n• Mobile: Use your browser\\'s close button');
                        }
                    }, 500);
                    
                } catch (e) {
                    alert('Please close this tab manually using:\\n\\n• Windows/Linux: Ctrl + W\\n• Mac: Cmd + W\\n• Mobile: Use your browser\\'s close button');
                }
            }
        </script>
    </body>
    </html>
  `);
});

// Get questions for interview
app.get('/questions', (req, res) => {
  const count = parseInt(req.query.count) || 10;
  const selectedQuestions = getRandomQuestions(count);
  
  console.log(`🎯 Serving ${selectedQuestions.length} questions for AI evaluation`);
  res.json(selectedQuestions);
});

// ✅ ENHANCED AI-POWERED INTERVIEW SUBMISSION
app.post('/interview/submit', async (req, res) => {
  const { candidateInfo, questions, answers, violations, duration, tabSwitchCount, terminated } = req.body;
  
  console.log(`🤖 AI analyzing interview for ${candidateInfo?.name || 'Unknown Candidate'}`);
  console.log(`📧 Email: ${candidateInfo?.email || 'N/A'}`);
  console.log(`💼 Position: ${candidateInfo?.position || 'N/A'}`);
  console.log(`📍 Location: ${candidateInfo?.location || 'N/A'}`);
  console.log(`🎓 Education: ${candidateInfo?.education || 'N/A'}`);
  console.log(`⏱️ Experience: ${candidateInfo?.experience || 'N/A'}`);
  console.log(`📞 Phone: ${candidateInfo?.phone || 'N/A'}`);
  console.log(`⚠️ Violations: ${violations?.length || 0}`);
  console.log(`🔄 Tab switches: ${tabSwitchCount || 0}`);
  
  if (terminated) {
    console.log(`🚨 INTERVIEW WAS TERMINATED due to excessive violations!`);
  }
  
  let totalScore = 0;
  let maxPossibleScore = 0;
  const detailedScores = [];
  const categoryScores = {};
  
  // Process each answer with enhanced AI analysis
  questions.forEach((question, index) => {
    const candidateAnswer = answers[index] || '';
    
    // Find the question data with reference answer
    const questionData = questionsWithAnswers.find(q => q.question === question.text);
    
    if (questionData) {
      const aiScore = calculateAIScore(questionData, candidateAnswer);
      totalScore += aiScore.score;
      maxPossibleScore += aiScore.maxScore;
      
      detailedScores.push({
        questionIndex: index,
        question: question.text,
        candidateAnswer: candidateAnswer,
        aiScore: aiScore,
        category: categorizeQuestion(question.text)
      });
      
      // Category scoring
      const category = categorizeQuestion(question.text);
      if (!categoryScores[category]) {
        categoryScores[category] = [];
      }
      categoryScores[category].push(aiScore.percentage);
    }
  });
  
  // Calculate category averages
  Object.keys(categoryScores).forEach(category => {
    const scores = categoryScores[category];
    categoryScores[category] = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  });
  
  // Apply violation penalties
  const baseViolationPenalty = Math.min(violations.length * 2, 15);
  const tabSwitchPenalty = Math.min(tabSwitchCount * 3, 25);
  const terminationPenalty = terminated ? 30 : 0; // Heavy penalty for termination
  
  const totalPenalty = baseViolationPenalty + tabSwitchPenalty + terminationPenalty;
  totalScore = Math.max(0, totalScore - totalPenalty);
  const finalPercentage = Math.round((totalScore / maxPossibleScore) * 100);
  
  // Determine interview status
  let interviewStatus = 'completed';
  if (terminated) {
    interviewStatus = 'terminated';
  } else if (tabSwitchCount >= 2) {
    interviewStatus = 'completed_with_violations';
  }
  
  // Enhanced interview data
  const interviewData = {
    candidateInfo: candidateInfo,
    questions: questions,
    answers: answers,
    violations: violations,
    duration: duration,
    tabSwitchCount: tabSwitchCount,
    terminated: terminated || false,
    interviewStatus: interviewStatus,
    aiAnalysis: detailedScores,
    totalScore: totalScore,
    maxPossibleScore: maxPossibleScore,
    percentage: finalPercentage,
    categoryScores: categoryScores,
    penalties: {
      violationPenalty: baseViolationPenalty,
      tabSwitchPenalty: tabSwitchPenalty,
      terminationPenalty: terminationPenalty,
      totalPenalty: totalPenalty
    },
    submittedAt: new Date().toISOString()
  };
  
  try {
    const savedInterview = await saveInterview(interviewData);
    
    console.log(`🎯 AI Scoring Complete for ${candidateInfo?.name}: ${totalScore}/${maxPossibleScore} (${finalPercentage}%)`);
    console.log(`💸 Total penalties applied: ${totalPenalty} points`);
    if (terminated) {
      console.log(`🚨 Interview marked as TERMINATED`);
    }
    
    res.json({
      message: terminated ? 'Interview terminated and analyzed by AI' : 'Interview analyzed by AI successfully',
      interviewId: savedInterview.id,
      score: totalScore,
      maxScore: maxPossibleScore,
      percentage: finalPercentage,
      categoryScores: categoryScores,
      candidateInfo: candidateInfo,
      answers: answers,
      violations: violations,
      duration: duration,
      tabSwitchCount: tabSwitchCount,
      terminated: terminated || false,
      interviewStatus: interviewStatus,
      penalties: interviewData.penalties,
      detailedFeedback: detailedScores.map(s => ({
        question: s.question.substring(0, 60) + '...',
        score: `${s.aiScore.score}/${s.aiScore.maxScore}`,
        feedback: s.aiScore.feedback,
        keywordCoverage: s.aiScore.keywordCoverage + '%',
        technicalDepth: s.aiScore.technicalDepth
      }))
    });
    
  } catch (error) {
    console.error('Error saving interview:', error);
    res.status(500).json({ error: 'Failed to save interview results' });
  }
});

// ✅ ADMIN DASHBOARD
app.get('/admin', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Dashboard - AI Interview Platform</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 0;
                background: #f8f9fa;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                text-align: center;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
            }
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            .stat-card {
                background: white;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                text-align: center;
                transition: transform 0.3s ease;
            }
            .stat-card:hover {
                transform: translateY(-5px);
            }
            .stat-number {
                font-size: 2.5em;
                font-weight: bold;
                color: #3498db;
                margin-bottom: 10px;
            }
            .stat-label {
                color: #7f8c8d;
                font-weight: 500;
            }
            .actions {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin-bottom: 30px;
            }
            .action-btn {
                background: #3498db;
                color: white;
                border: none;
                padding: 15px 20px;
                border-radius: 8px;
                cursor: pointer;
                text-decoration: none;
                text-align: center;
                font-weight: bold;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            .action-btn:hover {
                background: #2980b9;
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            .interviews-table {
                background: white;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                overflow-x: auto;
            }
            table {
                width: 100%;
                border-collapse: collapse;
            }
            th, td {
                text-align: left;
                padding: 12px;
                border-bottom: 1px solid #ecf0f1;
            }
            th {
                background: #f8f9fa;
                font-weight: bold;
                color: #2c3e50;
                position: sticky;
                top: 0;
            }
            tr:hover {
                background: #f8f9fa;
            }
            .status-completed { color: #27ae60; font-weight: bold; }
            .status-terminated { color: #e74c3c; font-weight: bold; }
            .status-violations { color: #f39c12; font-weight: bold; }
            .loading {
                text-align: center;
                padding: 40px;
                color: #7f8c8d;
            }
            .refresh-btn {
                background: #27ae60;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 12px;
                margin-left: 10px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🎯 AI Interview Platform - Admin Dashboard</h1>
            <p>Monitor and manage candidate interviews with real-time analytics</p>
        </div>
        
        <div class="container">
            <div class="stats-grid" id="statsGrid">
                <div class="stat-card">
                    <div class="stat-number" id="totalInterviews">0</div>
                    <div class="stat-label">Total Interviews</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="completedInterviews">0</div>
                    <div class="stat-label">Completed Successfully</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="terminatedInterviews">0</div>
                    <div class="stat-label">Terminated</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="averageScore">0%</div>
                    <div class="stat-label">Average AI Score</div>
                </div>
            </div>
            
            <div class="actions">
                <a href="/admin/interviews" class="action-btn">📊 View All Interviews</a>
                <a href="/admin/stats" class="action-btn">📈 Detailed Statistics</a>
                <a href="/health" class="action-btn">💚 System Health</a>
                <a href="/" class="action-btn">🏠 Interview Portal</a>
            </div>
            
            <div class="interviews-table">
                <h3>Recent Interviews 
                    <button class="refresh-btn" onclick="loadDashboardData()">🔄 Refresh</button>
                </h3>
                <table>
                    <thead>
                        <tr>
                            <th>Candidate</th>
                            <th>Email</th>
                            <th>Position</th>
                            <th>AI Score</th>
                            <th>Status</th>
                            <th>Duration</th>
                            <th>Violations</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody id="interviewsTable">
                        <tr>
                            <td colspan="8" class="loading">
                                <div>Loading interviews...</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        
        <script>
            async function loadDashboardData() {
                try {
                    // Load statistics
                    const statsResponse = await fetch('/admin/stats');
                    const stats = await statsResponse.json();
                    
                    document.getElementById('totalInterviews').textContent = stats.totalInterviews || 0;
                    document.getElementById('completedInterviews').textContent = stats.completedInterviews || 0;
                    document.getElementById('terminatedInterviews').textContent = stats.terminatedInterviews || 0;
                    document.getElementById('averageScore').textContent = (stats.averageScore || 0) + '%';
                    
                    // Load recent interviews
                    const interviewsResponse = await fetch('/admin/interviews');
                    const interviews = await interviewsResponse.json();
                    
                    const tableBody = document.getElementById('interviewsTable');
                    
                    if (interviews.length === 0) {
                        tableBody.innerHTML = '<tr><td colspan="8" class="loading">No interviews found</td></tr>';
                        return;
                    }
                    
                    tableBody.innerHTML = interviews.slice(0, 20).map(interview => {
                        const statusClass = interview.terminated ? 'status-terminated' : 
                                          interview.violations > 0 ? 'status-violations' : 'status-completed';
                        const statusText = interview.terminated ? '🚨 Terminated' : 
                                         interview.violations > 0 ? '⚠️ With Violations' : '✅ Completed';
                        
                        const date = new Date(interview.timestamp).toLocaleDateString();
                        const time = new Date(interview.timestamp).toLocaleTimeString();
                        
                        return \`
                            <tr>
                                <td><strong>\${interview.candidateName}</strong></td>
                                <td>\${interview.email}</td>
                                <td>\${interview.position}</td>
                                <td><strong>\${interview.score}</strong></td>
                                <td><span class="\${statusClass}">\${statusText}</span></td>
                                <td>\${interview.duration}</td>
                                <td>\${interview.violations}</td>
                                <td>\${date}<br><small>\${time}</small></td>
                            </tr>
                        \`;
                    }).join('');
                    
                } catch (error) {
                    console.error('Error loading dashboard data:', error);
                    document.getElementById('interviewsTable').innerHTML = 
                        '<tr><td colspan="8" class="loading" style="color: #e74c3c;">Error loading data. Please try again.</td></tr>';
                }
            }
            
            // Load data when page loads
            window.addEventListener('load', loadDashboardData);
            
            // Auto-refresh every 30 seconds
            setInterval(loadDashboardData, 30000);
        </script>
    </body>
    </html>
  `);
});

// Get all interviews with enhanced filtering
app.get('/admin/interviews', async (req, res) => {
  try {
    const interviews = await loadInterviews();
    const { status, terminated } = req.query;
    
    let filteredInterviews = interviews;
    
    if (status) {
      filteredInterviews = interviews.filter(i => i.interviewStatus === status);
    }
    
    if (terminated === 'true') {
      filteredInterviews = interviews.filter(i => i.terminated === true);
    }
    
    const summary = filteredInterviews.map(interview => ({
      id: interview.id,
      timestamp: interview.timestamp,
      candidateName: interview.candidateInfo?.name || 'Unknown',
      email: interview.candidateInfo?.email || 'N/A',
      position: interview.candidateInfo?.position || 'N/A',
      score: `${interview.totalScore}/${interview.maxPossibleScore} (${interview.percentage}%)`,
      questionsAnswered: Object.keys(interview.answers || {}).length,
      totalQuestions: interview.questions?.length || 0,
      violations: interview.violations?.length || 0,
      tabSwitches: interview.tabSwitchCount || 0,
      terminated: interview.terminated || false,
      status: interview.interviewStatus || 'completed',
      duration: interview.duration,
      penalties: interview.penalties?.totalPenalty || 0
    }));
    
    res.json(summary);
  } catch (error) {
    console.error('Error loading interviews:', error);
    res.status(500).json({ error: 'Failed to load interviews' });
  }
});

// Get specific interview with detailed analysis
app.get('/admin/interview/:id', async (req, res) => {
  try {
    const interviews = await loadInterviews();
    const interview = interviews.find(i => i.id === req.params.id);
    
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }
    
    res.json(interview);
  } catch (error) {
    console.error('Error loading interview:', error);
    res.status(500).json({ error: 'Failed to load interview' });
  }
});

// Get interview statistics
app.get('/admin/stats', async (req, res) => {
  try {
    const interviews = await loadInterviews();
    
    const stats = {
      totalInterviews: interviews.length,
      completedInterviews: interviews.filter(i => i.interviewStatus === 'completed').length,
      terminatedInterviews: interviews.filter(i => i.terminated === true).length,
      interviewsWithViolations: interviews.filter(i => (i.violations?.length || 0) > 0).length,
      averageScore: interviews.length > 0 ? Math.round(interviews.reduce((sum, i) => sum + (i.percentage || 0), 0) / interviews.length) : 0,
      averageViolations: interviews.length > 0 ? Math.round(interviews.reduce((sum, i) => sum + (i.violations?.length || 0), 0) / interviews.length * 10) / 10 : 0,
      averageTabSwitches: interviews.length > 0 ? Math.round(interviews.reduce((sum, i) => sum + (i.tabSwitchCount || 0), 0) / interviews.length * 10) / 10 : 0
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error loading statistics:', error);
    res.status(500).json({ error: 'Failed to load statistics' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date(),
    totalQuestions: questionsWithAnswers.length,
    server: 'Enhanced AI Interview Platform with Professional UI',
    version: '2.0.0',
    features: [
      'AI-powered scoring',
      'Security monitoring',
      'Professional thank you page',
      'Admin dashboard',
      'Violation tracking',
      'Auto camera start',
      'Tab switch prevention'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /',
      'GET /start',
      'GET /thank-you',
      'GET /admin',
      'GET /admin/interviews',
      'GET /admin/stats',
      'GET /health',
      'POST /interview/submit'
    ]
  });
});

// ==================== SERVER STARTUP ====================
app.listen(port, async () => {
  await initStorage();
  
  console.log('🚀 Enhanced AI Interview Platform v2.0 - READY!');
  console.log('=====================================');
  console.log(`📍 Server: http://localhost:${port}`);
  console.log(`📚 Questions: ${questionsWithAnswers.length} with AI analysis`);
  console.log(`🛡️ Security: Tab detection, violation penalties, termination`);
  console.log(`🤖 AI Features: Advanced scoring, keyword analysis, feedback`);
  console.log(`💾 Storage: Auto-save with individual interview files`);
  console.log('');
  console.log('🌐 Available URLs:');
  console.log(`🏠 Interview Portal:     http://localhost:${port}/`);
  console.log(`🚀 Popup Launch Page:    http://localhost:${port}/start`);
  console.log(`🎉 Thank You Page:       http://localhost:${port}/thank-you`);
  console.log(`👨‍💼 Admin Dashboard:      http://localhost:${port}/admin`);
  console.log(`📊 All Interviews:       http://localhost:${port}/admin/interviews`);
  console.log(`📈 Statistics:           http://localhost:${port}/admin/stats`);
  console.log(`💚 Health Check:         http://localhost:${port}/health`);
  console.log('');
  console.log('✨ Key Features:');
  console.log('• 📹 Auto camera start with permission validation');
  console.log('• 🔒 Strict tab switching prevention (max 3 violations)');
  console.log('• 🚨 Auto-termination for excessive violations');
  console.log('• 🤖 AI-powered scoring with detailed analysis');
  console.log('• 📊 Comprehensive violation tracking and penalties');
  console.log('• 🎯 Professional interview completion flow');
  console.log('• 📱 Mobile-responsive design');
  console.log('• 👨‍💼 Advanced admin panel with real-time stats');
  console.log('• 🔄 Auto-refresh dashboard every 30 seconds');
  console.log('• 💾 Persistent data storage with individual files');
  console.log('');
  console.log('🎯 Ready to conduct AI-powered technical interviews!');
  console.log('=====================================');
});