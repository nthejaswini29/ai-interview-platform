const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Storage setup
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

// =====================================================
// PART A: THEORY & CONCEPTUAL KNOWLEDGE (50 QUESTIONS)
// =====================================================
const theoryQuestions = [
    // JVM Internals & Memory (Q1-Q5)
    {
        id: 'T1', type: 'theory', part: 'A', difficulty: 'medium', topic: 'JVM Internals',
        question: 'Explain the phases of class loading in JVM and what happens during each phase.',
        keywords: ['loading', 'linking', 'verification', 'preparation', 'resolution', 'initialization', 'bootstrap classloader'],
        expectedAnswer: 'Loading → Linking (verification, preparation, resolution) → Initialization. Loading finds and loads class files, Linking consists of verification (validates bytecode), preparation (allocates memory for static variables), and resolution (symbolic references to concrete references), Initialization executes static initializers.',
        maxScore: 10
    },
    {
        id: 'T2', type: 'theory', part: 'A', difficulty: 'hard', topic: 'JVM Optimization',
        question: 'What is Escape Analysis in JVM and how does it improve performance?',
        keywords: ['escape analysis', 'JIT', 'optimization', 'stack allocation', 'scalar replacement'],
        expectedAnswer: 'JIT optimization to decide whether an object can be allocated on stack instead of heap, enabling scalar replacement. It analyzes if objects escape method scope and optimizes accordingly.',
        maxScore: 10
    },
    {
        id: 'T3', type: 'theory', part: 'A', difficulty: 'hard', topic: 'Garbage Collection',
        question: 'Compare Serial, Parallel, CMS, and G1 collectors. When would you use each?',
        keywords: ['serial', 'parallel', 'CMS', 'G1', 'collector', 'throughput', 'latency'],
        expectedAnswer: 'Serial: single-threaded, stop-the-world, good for small apps. Parallel: multi-threaded throughput, batch processing. CMS: low latency, concurrent, deprecated. G1: region-based, predictable pause times.',
        maxScore: 10
    },
    {
        id: 'T4', type: 'theory', part: 'A', difficulty: 'medium', topic: 'Memory Management',
        question: 'What are Soft, Weak, and Phantom references in Java?',
        keywords: ['soft reference', 'weak reference', 'phantom reference', 'garbage collection'],
        expectedAnswer: 'Soft: cleared only when memory low, good for caches. Weak: cleared at next GC cycle, used in WeakHashMap. Phantom: cleared after finalization, useful for cleanup actions.',
        maxScore: 10
    },
    {
        id: 'T5', type: 'theory', part: 'A', difficulty: 'hard', topic: 'ClassLoader',
        question: 'How to detect and fix a ClassLoader memory leak?',
        keywords: ['classloader', 'memory leak', 'ThreadLocal', 'static references', 'cleanup'],
        expectedAnswer: 'Happens in app servers due to static references to classes loaded by child classloaders. Fix by proper ThreadLocal cleanup, avoiding static references to dynamically loaded classes.',
        maxScore: 10
    },

    // Concurrency & Performance (Q6-Q12)
    {
        id: 'T6', type: 'theory', part: 'A', difficulty: 'medium', topic: 'Concurrency',
        question: 'Difference between synchronized block and StampedLock?',
        keywords: ['synchronized', 'StampedLock', 'optimistic reads', 'performance', 'scalability'],
        expectedAnswer: 'StampedLock provides optimistic reads and better scalability compared to intrinsic locks. Supports three modes: reading, writing, and optimistic reading.',
        maxScore: 10
    },
    {
        id: 'T7', type: 'theory', part: 'A', difficulty: 'hard', topic: 'Lock-free Programming',
        question: 'How do you implement lock-free data structures in Java?',
        keywords: ['lock-free', 'atomic', 'CAS', 'compare-and-swap', 'thread-safe'],
        expectedAnswer: 'Use java.util.concurrent.atomic classes and CAS operations to build thread-safe algorithms without blocking. Key is using atomic references and handling retry logic.',
        maxScore: 10
    },
    {
        id: 'T8', type: 'theory', part: 'A', difficulty: 'hard', topic: 'CAS Problems',
        question: 'What is the ABA problem in CAS, and how to fix it?',
        keywords: ['ABA problem', 'CAS', 'AtomicStampedReference', 'versioning'],
        expectedAnswer: 'CAS cannot detect if a variable changes A→B→A. Fix with AtomicStampedReference using version numbers or timestamps to detect intermediate changes.',
        maxScore: 10
    },
    {
        id: 'T9', type: 'theory', part: 'A', difficulty: 'medium', topic: 'Fork-Join Framework',
        question: 'Explain ForkJoinPool Work-Stealing algorithm.',
        keywords: ['ForkJoinPool', 'work-stealing', 'threads', 'queue', 'workload'],
        expectedAnswer: 'Threads steal tasks from others queues when idle to balance workload. Each thread has its own deque, steals from tail of other threads when empty.',
        maxScore: 10
    },
    {
        id: 'T10', type: 'theory', part: 'A', difficulty: 'medium', topic: 'CompletableFuture',
        question: 'How does CompletableFuture differ from Future?',
        keywords: ['CompletableFuture', 'Future', 'async', 'callbacks', 'chaining'],
        expectedAnswer: 'CompletableFuture supports non-blocking chaining, async callbacks, and combination of multiple futures. More powerful than basic Future interface.',
        maxScore: 10
    },
    {
        id: 'T11', type: 'theory', part: 'A', difficulty: 'hard', topic: 'Performance',
        question: 'What is false sharing and how to prevent it?',
        keywords: ['false sharing', 'cache line', 'threads', '@Contended', 'padding'],
        expectedAnswer: 'Multiple threads accessing different variables within the same cache line, causing cache invalidation. Avoid via @Contended annotation or manual padding.',
        maxScore: 10
    },
    {
        id: 'T12', type: 'theory', part: 'A', difficulty: 'medium', topic: 'Concurrency Issues',
        question: 'What is Livelock vs Deadlock?',
        keywords: ['livelock', 'deadlock', 'blocked', 'threads', 'progress'],
        expectedAnswer: 'Deadlock: threads blocked waiting forever. Livelock: threads active but make no progress due to conflicting retries and continuous conflict resolution.',
        maxScore: 10
    },

    // Advanced Java 8+ & Functional (Q13-Q18)
    {
        id: 'T13', type: 'theory', part: 'A', difficulty: 'medium', topic: 'Java 12+ Features',
        question: 'Explain Collectors.teeing() in Java 12.',
        keywords: ['Collectors.teeing', 'Java 12', 'streams', 'collectors', 'combining'],
        expectedAnswer: 'Allows combining results of two collectors into one. Takes two collectors and a combiner function to merge their results.',
        maxScore: 10
    },
    {
        id: 'T14', type: 'theory', part: 'A', difficulty: 'hard', topic: 'Streams',
        question: 'How do you create a custom Spliterator?',
        keywords: ['Spliterator', 'tryAdvance', 'trySplit', 'characteristics', 'parallel streams'],
        expectedAnswer: 'Implement tryAdvance, trySplit, characteristics methods. Used for parallel stream performance tuning and custom data source iteration.',
        maxScore: 10
    },
    {
        id: 'T15', type: 'theory', part: 'A', difficulty: 'medium', topic: 'Java 16+ Features',
        question: 'Difference between mapMulti (Java 16) and flatMap.',
        keywords: ['mapMulti', 'flatMap', 'Java 16', 'streams', 'one-to-many'],
        expectedAnswer: 'mapMulti is more efficient for one-to-many mappings without creating intermediate streams. Uses consumer-based approach instead of stream creation.',
        maxScore: 10
    },
    {
        id: 'T16', type: 'theory', part: 'A', difficulty: 'medium', topic: 'CompletableFuture',
        question: 'Difference between thenCompose and thenCombine in CompletableFuture?',
        keywords: ['thenCompose', 'thenCombine', 'CompletableFuture', 'chaining', 'dependent'],
        expectedAnswer: 'thenCompose: chains dependent tasks sequentially. thenCombine: runs tasks in parallel and combines results when both complete.',
        maxScore: 10
    },
    {
        id: 'T17', type: 'theory', part: 'A', difficulty: 'medium', topic: 'Optional',
        question: 'Explain pitfalls of using Optional.',
        keywords: ['Optional', 'serializable', 'fields', 'overuse', 'APIs'],
        expectedAnswer: 'Not serializable, should not be used for fields, overuse leads to complex APIs. Best for return values only. Avoid get() method.',
        maxScore: 10
    },
    {
        id: 'T18', type: 'theory', part: 'A', difficulty: 'medium', topic: 'Stream Optimization',
        question: 'Example of advanced stream pipeline optimization?',
        keywords: ['streams', 'optimization', 'IntStream', 'parallel', 'flatMap', 'primitive'],
        expectedAnswer: 'Use primitive streams (IntStream), avoid flatMap where possible, use parallel() carefully, prefer forEach over collect when possible.',
        maxScore: 10
    },

    // Frameworks & Persistence (Q19-Q26)
    {
        id: 'T19', type: 'theory', part: 'A', difficulty: 'medium', topic: 'Spring Framework',
        question: 'How does Spring handle circular dependencies?',
        keywords: ['circular dependencies', 'early references', 'proxies', 'constructor injection'],
        expectedAnswer: 'By creating early references and injecting proxies. Can break if constructors mutually depend. Uses three-step bean creation process.',
        maxScore: 10
    },
    {
        id: 'T20', type: 'theory', part: 'A', difficulty: 'medium', topic: 'Spring Transactions',
        question: 'Difference between @Transactional(propagation=REQUIRES_NEW) vs MANDATORY?',
        keywords: ['REQUIRES_NEW', 'MANDATORY', 'transaction', 'propagation', 'suspend'],
        expectedAnswer: 'REQUIRES_NEW: suspends current, starts new transaction. MANDATORY: must run in an existing transaction, throws exception if none exists.',
        maxScore: 10
    },
    {
        id: 'T21', type: 'theory', part: 'A', difficulty: 'medium', topic: 'Spring Boot',
        question: 'How does Spring Boot auto-configuration work internally?',
        keywords: ['auto-configuration', '@EnableAutoConfiguration', 'classpath', '@ConditionalOnClass'],
        expectedAnswer: 'Uses @EnableAutoConfiguration, scans classpath, applies conditional beans via @ConditionalOnClass and other conditional annotations.',
        maxScore: 10
    },
    {
        id: 'T22', type: 'theory', part: 'A', difficulty: 'medium', topic: 'Hibernate',
        question: 'Explain dirty checking in Hibernate.',
        keywords: ['dirty checking', 'hibernate', 'entity state', 'snapshot', 'flush'],
        expectedAnswer: 'Hibernate tracks entity state; on flush, compares snapshot with current state to generate SQL updates automatically.',
        maxScore: 10
    },
    {
        id: 'T23', type: 'theory', part: 'A', difficulty: 'medium', topic: 'Hibernate Performance',
        question: 'How to handle N+1 select problem?',
        keywords: ['N+1', 'JOIN FETCH', '@BatchSize', 'EntityGraph', 'lazy loading'],
        expectedAnswer: 'Use JOIN FETCH in JPQL, @BatchSize annotation, EntityGraph for fetch planning, or configure batch fetching.',
        maxScore: 10
    },
    {
        id: 'T24', type: 'theory', part: 'A', difficulty: 'medium', topic: 'Database Locking',
        question: 'What is optimistic vs pessimistic locking?',
        keywords: ['optimistic locking', 'pessimistic locking', 'versioning', 'row locks'],
        expectedAnswer: 'Optimistic: uses versioning field, retries on conflict. Pessimistic: uses database-level row locks to prevent concurrent access.',
        maxScore: 10
    },
    {
        id: 'T25', type: 'theory', part: 'A', difficulty: 'medium', topic: 'Hibernate Cache',
        question: 'How does Hibernate second-level cache work?',
        keywords: ['second-level cache', 'hibernate', 'shared', 'sessions', 'Ehcache'],
        expectedAnswer: 'Shared across sessions, stores entities/collections using providers like Ehcache, Infinispan. Reduces database queries significantly.',
        maxScore: 10
    },
    {
        id: 'T26', type: 'theory', part: 'A', difficulty: 'hard', topic: 'Distributed Transactions',
        question: 'Explain distributed transactions with XA in Java.',
        keywords: ['XA', 'distributed transactions', 'two-phase commit', 'transaction manager'],
        expectedAnswer: 'XA protocol coordinates multiple resource managers (DB, JMS) via a Transaction Manager using two-phase commit protocol.',
        maxScore: 10
    },

    // System Design & Scalability (Q27-Q31)
    {
        id: 'T27', type: 'theory', part: 'A', difficulty: 'hard', topic: 'System Design',
        question: 'How would you design a Java system handling 1M requests/min?',
        keywords: ['scalability', 'async I/O', 'caching', 'load balancing', 'horizontal scaling'],
        expectedAnswer: 'Use async I/O, caching layers, load balancing, horizontal scaling, backpressure handling, connection pooling, and proper monitoring.',
        maxScore: 10
    },
    {
        id: 'T28', type: 'theory', part: 'A', difficulty: 'hard', topic: 'Circuit Breaker',
        question: 'How to design a resilient circuit breaker in Java?',
        keywords: ['circuit breaker', 'Resilience4j', 'CLOSED', 'OPEN', 'HALF-OPEN', 'fallback'],
        expectedAnswer: 'Use Resilience4j, maintain state (CLOSED, OPEN, HALF-OPEN), implement fallback strategies and failure rate thresholds.',
        maxScore: 10
    },
    {
        id: 'T29', type: 'theory', part: 'A', difficulty: 'hard', topic: 'Distributed Systems',
        question: 'How to achieve idempotency in distributed Java services?',
        keywords: ['idempotency', 'distributed systems', 'unique request IDs', 'deduplication'],
        expectedAnswer: 'Use unique request IDs, deduplication store, conditional updates, and ensure operations can be safely retried.',
        maxScore: 10
    },
    {
        id: 'T30', type: 'theory', part: 'A', difficulty: 'medium', topic: 'Rate Limiting',
        question: 'How would you implement rate limiting in Java microservices?',
        keywords: ['rate limiting', 'token bucket', 'Guava RateLimiter', 'Redis', 'microservices'],
        expectedAnswer: 'Use token bucket algorithm, Guava RateLimiter, or Redis/Lua scripts for distributed rate limiting across services.',
        maxScore: 10
    },
    {
        id: 'T31', type: 'theory', part: 'A', difficulty: 'hard', topic: 'Microservices',
        question: 'Explain Saga pattern in microservices.',
        keywords: ['Saga pattern', 'microservices', 'distributed transactions', 'compensating actions'],
        expectedAnswer: 'Sequence of local transactions with compensating actions for rollback in distributed systems. Alternative to two-phase commit.',
        maxScore: 10
    },

    // JVM & Tooling (Q32-Q35)
    {
        id: 'T32', type: 'theory', part: 'A', difficulty: 'medium', topic: 'GC Analysis',
        question: 'How to interpret GC logs in Java?',
        keywords: ['GC logs', 'pause times', 'promotion failures', 'allocation rates', 'GCViewer'],
        expectedAnswer: 'Analyze pause times, promotion failures, allocation rates. Use tools like GCViewer, GCEasy for visualization and analysis.',
        maxScore: 10
    },
    {
        id: 'T33', type: 'theory', part: 'A', difficulty: 'medium', topic: 'JVM Tools',
        question: 'Difference between JDK Flight Recorder and VisualVM?',
        keywords: ['Flight Recorder', 'VisualVM', 'profiling', 'production', 'monitoring'],
        expectedAnswer: 'Flight Recorder: low-overhead production profiling with JFR files. VisualVM: free, interactive profiling and debugging tool.',
        maxScore: 10
    },
    {
        id: 'T34', type: 'theory', part: 'A', difficulty: 'medium', topic: 'Thread Analysis',
        question: 'How to monitor thread contention in JVM?',
        keywords: ['thread contention', 'jconsole', 'jstack', 'ThreadMXBean', 'monitoring'],
        expectedAnswer: 'Use jconsole, jstack for thread dumps, Flight Recorder for detailed analysis, ThreadMXBean for programmatic monitoring.',
        maxScore: 10
    },
    {
        id: 'T35', type: 'theory', part: 'A', difficulty: 'medium', topic: 'JVM Optimization',
        question: 'Explain Class Data Sharing (CDS).',
        keywords: ['CDS', 'class data sharing', 'startup time', 'memory', 'shared metadata'],
        expectedAnswer: 'Share common class metadata across JVM processes to reduce startup time and memory footprint by avoiding duplicate class loading.',
        maxScore: 10
    },

    // Additional Advanced Questions (Q36-Q50)
    {
        id: 'T36', type: 'theory', part: 'A', difficulty: 'hard', topic: 'Reactive Streams',
        question: 'How do you implement backpressure in Reactive Streams?',
        keywords: ['backpressure', 'reactive streams', 'subscriber', 'demand', 'buffer'],
        expectedAnswer: 'Subscriber requests limited demand; publishers buffer, drop, or block if demand < supply. Use request(n) to control flow.',
        maxScore: 10
    },
    {
        id: 'T37', type: 'theory', part: 'A', difficulty: 'hard', topic: 'Distributed Systems',
        question: 'What is Split Brain problem in distributed caches?',
        keywords: ['split brain', 'distributed cache', 'partition', 'quorum', 'consistency'],
        expectedAnswer: 'When cluster partitions, two nodes assume leadership, causing inconsistency. Fixed via quorum-based consensus algorithms.',
        maxScore: 10
    },
    {
        id: 'T38', type: 'theory', part: 'A', difficulty: 'medium', topic: 'Memory Leaks',
        question: 'How do you debug a memory leak caused by ThreadLocal?',
        keywords: ['ThreadLocal', 'memory leak', 'cleanup', 'remove', 'thread pool'],
        expectedAnswer: 'ThreadLocal keys cleared on GC, but values may linger if not removed. Always call remove() after use, especially in thread pools.',
        maxScore: 10
    },
    {
        id: 'T39', type: 'theory', part: 'A', difficulty: 'hard', topic: 'Annotation Processing',
        question: 'How would you implement a custom annotation processor?',
        keywords: ['annotation processor', 'AbstractProcessor', 'Filer', 'compilation', 'code generation'],
        expectedAnswer: 'Extend AbstractProcessor, override process() method, use Filer to generate code during compilation phase.',
        maxScore: 10
    },
    {
        id: 'T40', type: 'theory', part: 'A', difficulty: 'hard', topic: 'Java 9+ Features',
        question: 'What is the role of VarHandles (Java 9)?',
        keywords: ['VarHandles', 'Java 9', 'unsafe', 'variable access', 'atomic operations'],
        expectedAnswer: 'Provide low-level, safe, performant variable access. Replaces sun.misc.Unsafe for atomic operations and memory ordering.',
        maxScore: 10
    },
    {
        id: 'T41', type: 'theory', part: 'A', difficulty: 'medium', topic: 'Collections',
        question: 'Differences between WeakHashMap and IdentityHashMap.',
        keywords: ['WeakHashMap', 'IdentityHashMap', 'weak references', 'identity', 'equality'],
        expectedAnswer: 'WeakHashMap: keys weakly referenced, GC\'d when no strong refs. IdentityHashMap: compares keys by reference equality (==), not equals().',
        maxScore: 10
    },
    {
        id: 'T42', type: 'theory', part: 'A', difficulty: 'hard', topic: 'JVM Tuning',
        question: 'How would you tune JVM for low latency trading system?',
        keywords: ['low latency', 'trading system', 'G1', 'ZGC', 'GC pauses', 'off-heap'],
        expectedAnswer: 'Use G1/ZGC collectors, large heap, pin critical threads to CPUs, avoid GC pauses, use off-heap memory for critical data.',
        maxScore: 10
    },
    {
        id: 'T43', type: 'theory', part: 'A', difficulty: 'medium', topic: 'Performance Debugging',
        question: 'How do you debug a Java process consuming 100% CPU?',
        keywords: ['high CPU', 'jstack', 'thread dump', 'profiler', 'hot threads'],
        expectedAnswer: 'Use jstack to capture thread dump, identify hot threads with top -H, analyze with profilers like Async Profiler or JProfiler.',
        maxScore: 10
    },
    {
        id: 'T44', type: 'theory', part: 'A', difficulty: 'medium', topic: 'Java 17 Features',
        question: 'Explain Java sealed classes (Java 17).',
        keywords: ['sealed classes', 'Java 17', 'permits', 'pattern matching', 'inheritance control'],
        expectedAnswer: 'Restricts which classes can extend a class using permits clause. Helps with exhaustive pattern matching and controlled inheritance.',
        maxScore: 10
    },
    {
        id: 'T45', type: 'theory', part: 'A', difficulty: 'hard', topic: 'Vector API',
        question: 'What is Vector API (Java 16+)?',
        keywords: ['Vector API', 'SIMD', 'Java 16', 'data parallel', 'vectorization'],
        expectedAnswer: 'Enables SIMD (Single Instruction Multiple Data) instructions for data-parallel operations, improving performance for mathematical computations.',
        maxScore: 10
    },
    {
        id: 'T46', type: 'theory', part: 'A', difficulty: 'hard', topic: 'Kafka',
        question: 'How to ensure consistency across multiple microservices using Kafka?',
        keywords: ['Kafka', 'consistency', 'transactional', 'exactly-once', 'microservices'],
        expectedAnswer: 'Use transactional producers/consumers, idempotent writes, exactly-once semantics, and proper error handling with compensating actions.',
        maxScore: 10
    },
    {
        id: 'T47', type: 'theory', part: 'A', difficulty: 'medium', topic: 'Distributed Systems',
        question: 'What is Quorum in distributed systems?',
        keywords: ['quorum', 'consensus', 'distributed systems', 'split brain', 'majority'],
        expectedAnswer: 'Minimum number of nodes that must agree for operation success. Prevents split-brain scenarios by requiring majority agreement.',
        maxScore: 10
    },
    {
        id: 'T48', type: 'theory', part: 'A', difficulty: 'medium', topic: 'GraalVM',
        question: 'Difference between OpenJDK and GraalVM.',
        keywords: ['GraalVM', 'OpenJDK', 'polyglot', 'native image', 'AOT compilation'],
        expectedAnswer: 'GraalVM provides polyglot support, advanced JIT compiler optimizations, and native-image ahead-of-time compilation capabilities.',
        maxScore: 10
    },
    {
        id: 'T49', type: 'theory', part: 'A', difficulty: 'hard', topic: 'Distributed Systems',
        question: 'How do you handle clock skew in distributed Java apps?',
        keywords: ['clock skew', 'NTP', 'logical clocks', 'vector clocks', 'distributed systems'],
        expectedAnswer: 'Sync clocks with NTP, use logical/vector clocks for ordering, avoid relying on wall-clock time for critical operations.',
        maxScore: 10
    },
    {
        id: 'T50', type: 'theory', part: 'A', difficulty: 'hard', topic: 'Distributed Cache',
        question: 'How would you implement a distributed cache eviction policy?',
        keywords: ['distributed cache', 'eviction policy', 'Raft', 'Paxos', 'consistent hashing', 'LRU'],
        expectedAnswer: 'Use consensus (Raft/Paxos) for coordination, eviction based on LRU/LFU algorithms, consistent hashing for partitioning data.',
        maxScore: 10
    }
];

// =====================================================
// PART B: PRACTICAL CODING CHALLENGES (50 QUESTIONS)
// =====================================================
const codingQuestions = [
    // Arrays & Strings (Q1-Q10)
    {
        id: 'C1', type: 'coding', part: 'B', difficulty: 'easy', topic: 'String Manipulation',
        question: 'Write a Java method to reverse a string without using built-in reverse functions.',
        language: 'java',
        starterCode: `public class StringReverser {
    public static String reverse(String s) {
        // Your implementation here
        return "";
    }
    
    public static void main(String[] args) {
        System.out.println(reverse("interview")); // Should print: weivretni
    }
}`,
        expectedSolution: `public static String reverse(String s) {
    char[] a = s.toCharArray();
    int i = 0, j = a.length - 1;
    while (i < j) {
        char t = a[i]; a[i] = a[j]; a[j] = t;
        i++; j--;
    }
    return new String(a);
}`,
        keywords: ['string', 'reverse', 'char array', 'two pointers'],
        maxScore: 10
    },
    {
        id: 'C2', type: 'coding', part: 'B', difficulty: 'medium', topic: 'String Processing',
        question: 'Check if a string is palindrome, ignoring non-letters and case.',
        language: 'java',
        starterCode: `public class PalindromeChecker {
    public static boolean isPalindrome(String s) {
        // Your implementation here
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(isPalindrome("A man, a plan, a canal: Panama")); // true
    }
}`,
        expectedSolution: `public static boolean isPalindrome(String s) {
    int i = 0, j = s.length() - 1;
    while (i < j) {
        while (i < j && !Character.isLetterOrDigit(s.charAt(i))) i++;
        while (i < j && !Character.isLetterOrDigit(s.charAt(j))) j--;
        if (Character.toLowerCase(s.charAt(i)) != Character.toLowerCase(s.charAt(j))) 
            return false;
        i++; j--;
    }
    return true;
}`,
        keywords: ['palindrome', 'two pointers', 'character validation', 'case insensitive'],
        maxScore: 10
    },
    {
        id: 'C3', type: 'coding', part: 'B', difficulty: 'medium', topic: 'Array Processing',
        question: 'Find largest and second largest in array in single pass.',
        language: 'java',
        starterCode: `public class LargestTwo {
    public static int[] largestTwo(int[] a) {
        // Return array with [largest, secondLargest]
        return new int[]{0, 0};
    }
    
    public static void main(String[] args) {
        int[] result = largestTwo(new int[]{3,5,1,5,2});
        System.out.println(result[0] + ", " + result[1]); // 5, 3
    }
}`,
        expectedSolution: `public static int[] largestTwo(int[] a) {
    if (a.length < 2) throw new IllegalArgumentException();
    int max = Integer.MIN_VALUE, second = Integer.MIN_VALUE;
    for (int x : a) {
        if (x > max) { second = max; max = x; }
        else if (x > second && x != max) second = x;
    }
    return new int[]{max, second};
}`,
        keywords: ['array', 'largest', 'single pass', 'algorithm'],
        maxScore: 10
    },
    {
        id: 'C4', type: 'coding', part: 'B', difficulty: 'medium', topic: 'String Processing',
        question: 'Find the first non-repeated character in a string.',
        language: 'java',
        starterCode: `import java.util.LinkedHashMap;

public class FirstNonRepeated {
    public static Character firstNonRepeated(String s) {
        // Your implementation here
        return null;
    }
    
    public static void main(String[] args) {
        System.out.println(firstNonRepeated("swiss")); // w
    }
}`,
        expectedSolution: `public static Character firstNonRepeated(String s) {
    LinkedHashMap<Character, Integer> m = new LinkedHashMap<>();
    for (char c : s.toCharArray()) m.put(c, m.getOrDefault(c,0)+1);
    for (var e : m.entrySet()) if (e.getValue() == 1) return e.getKey();
    return null;
}`,
        keywords: ['LinkedHashMap', 'character frequency', 'first occurrence', 'iteration order'],
        maxScore: 10
    },
    {
        id: 'C5', type: 'coding', part: 'B', difficulty: 'medium', topic: 'Array Rotation',
        question: 'Rotate array right by k positions in-place.',
        language: 'java',
        starterCode: `import java.util.Arrays;

public class ArrayRotation {
    static void rotate(int[] a, int k) {
        // Your in-place implementation here
    }
    
    static void reverse(int[] a, int i, int j) {
        // Helper method to reverse array segment
    }
    
    public static void main(String[] args) {
        int[] a = {1,2,3,4,5,6};
        rotate(a, 2);
        System.out.println(Arrays.toString(a)); // [5,6,1,2,3,4]
    }
}`,
        expectedSolution: `static void rotate(int[] a, int k) {
    int n = a.length; k %= n;
    reverse(a,0,n-1); reverse(a,0,k-1); reverse(a,k,n-1);
}

static void reverse(int[] a,int i,int j){
    while(i<j){int t=a[i];a[i++]=a[j];a[j--]=t;}
}`,
        keywords: ['array rotation', 'in-place', 'reverse algorithm', 'modular arithmetic'],
        maxScore: 10
    },
    {
        id: 'C6', type: 'coding', part: 'B', difficulty: 'medium', topic: 'Anagram Detection',
        question: 'Check if two strings are anagrams (Unicode-safe).',
        language: 'java',
        starterCode: `import java.util.Map;
import java.util.HashMap;

public class AnagramChecker {
    public static boolean isAnagram(String s1, String s2) {
        // Your Unicode-safe implementation here
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(isAnagram("listen", "silent")); // true
    }
}`,
        expectedSolution: `public static boolean isAnagram(String s1, String s2) {
    Map<Integer,Integer> m = new HashMap<>();
    s1.codePoints().forEach(cp -> m.put(cp, m.getOrDefault(cp,0)+1));
    s2.codePoints().forEach(cp -> m.put(cp, m.getOrDefault(cp,0)-1));
    return m.values().stream().allMatch(v -> v == 0);
}`,
        keywords: ['anagram', 'Unicode', 'codePoints', 'HashMap', 'character frequency'],
        maxScore: 10
    },
    {
        id: 'C7', type: 'coding', part: 'B', difficulty: 'easy', topic: 'Missing Number',
        question: 'Find missing number in array 1..N using XOR method.',
        language: 'java',
        starterCode: `public class MissingNumber {
    public static int missing(int[] a) {
        // Your XOR implementation here
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(missing(new int[]{1,2,4,5})); // 3
    }
}`,
        expectedSolution: `public static int missing(int[] a) {
    int n = a.length + 1;
    int xor = 0;
    for (int i = 1; i <= n; i++) xor ^= i;
    for (int v : a) xor ^= v;
    return xor;
}`,
        keywords: ['XOR', 'missing number', 'bit manipulation', 'mathematical property'],
        maxScore: 10
    },
    {
        id: 'C8', type: 'coding', part: 'B', difficulty: 'easy', topic: 'String Analysis',
        question: 'Count vowels and consonants in a string.',
        language: 'java',
        starterCode: `public class VowelConsonantCounter {
    public static int[] counts(String s) {
        // Return [vowelCount, consonantCount]
        return new int[]{0, 0};
    }
    
    public static void main(String[] args) {
        int[] r = counts("Interview");
        System.out.println("v=" + r[0] + ", c=" + r[1]); // v=3, c=5
    }
}`,
        expectedSolution: `public static int[] counts(String s) {
    int v=0,c=0;
    s = s.toLowerCase();
    for (char ch: s.toCharArray()){
        if (ch>='a' && ch<='z') {
            if ("aeiou".indexOf(ch)>=0) v++; else c++;
        }
    }
    return new int[]{v,c};
}`,
        keywords: ['vowels', 'consonants', 'character classification', 'string processing'],
        maxScore: 10
    },
    {
        id: 'C9', type: 'coding', part: 'B', difficulty: 'easy', topic: 'Duplicate Detection',
        question: 'Find duplicates in array and return as set.',
        language: 'java',
        starterCode: `import java.util.*;

public class DuplicateFinder {
    public static Set<Integer> duplicates(int[] a) {
        // Your implementation here
        return new HashSet<>();
    }
    
    public static void main(String[] args) {
        System.out.println(duplicates(new int[]{1,3,4,2,5,3,2})); // [2, 3]
    }
}`,
        expectedSolution: `public static Set<Integer> duplicates(int[] a){
    Set<Integer> seen = new HashSet<>(), dup = new HashSet<>();
    for (int x: a) if (!seen.add(x)) dup.add(x);
    return dup;
}`,
        keywords: ['duplicates', 'HashSet', 'set operations', 'single pass'],
        maxScore: 10
    },
    {
        id: 'C10', type: 'coding', part: 'B', difficulty: 'hard', topic: 'Sliding Window',
        question: 'Longest substring without repeating characters using sliding window.',
        language: 'java',
        starterCode: `import java.util.*;

public class LongestSubstring {
    public static int lengthOfLongest(String s) {
        // Your sliding window implementation here
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(lengthOfLongest("abcabcbb")); // 3
    }
}`,
        expectedSolution: `public static int lengthOfLongest(String s) {
    Map<Character,Integer> last = new HashMap<>();
    int start = 0, max = 0;
    for (int i=0;i<s.length();i++){
        char c = s.charAt(i);
        if (last.containsKey(c) && last.get(c) >= start) start = last.get(c)+1;
        last.put(c,i);
        max = Math.max(max, i-start+1);
    }
    return max;
}`,
        keywords: ['sliding window', 'HashMap', 'longest substring', 'no repeating'],
        maxScore: 10
    },

    // Collections & Data Structures (Q11-Q20)
    {
        id: 'C11', type: 'coding', part: 'B', difficulty: 'medium', topic: 'LRU Cache',
        question: 'Implement LRU Cache using LinkedHashMap.',
        language: 'java',
        starterCode: `import java.util.*;

public class LRUCacheImpl {
    static class LRUCache<K,V> extends LinkedHashMap<K,V> {
        private final int capacity;
        
        LRUCache(int capacity) {
            // Your constructor implementation
        }
        
        protected boolean removeEldestEntry(Map.Entry<K,V> e) {
            // Your implementation
            return false;
        }
    }
    
    public static void main(String[] args) {
        LRUCache<Integer,String> cache = new LRUCache<>(2);
        cache.put(1,"one"); cache.put(2,"two"); cache.get(1); cache.put(3,"three");
        System.out.println(cache.keySet()); // [1, 3]
    }
}`,
        expectedSolution: `LRUCache(int capacity){ 
    super(capacity,0.75f,true); 
    this.capacity = capacity; 
}

protected boolean removeEldestEntry(Map.Entry<K,V> e){ 
    return size() > capacity; 
}`,
        keywords: ['LRU cache', 'LinkedHashMap', 'access order', 'removeEldestEntry'],
        maxScore: 10
    },
    {
        id: 'C12', type: 'coding', part: 'B', difficulty: 'medium', topic: 'Linked List',
        question: 'Reverse a linked list iteratively using custom singly linked list.',
        language: 'java',
        starterCode: `public class LinkedListReversal {
    static class Node { 
        int v; 
        Node n; 
        Node(int v){this.v=v;} 
    }

    public static Node reverse(Node head) {
        // Your iterative implementation here
        return null;
    }
    
    public static void main(String[] args) {
        Node a=new Node(1); a.n=new Node(2); a.n.n=new Node(3);
        Node r = reverse(a);
        while(r!=null){ System.out.print(r.v+" "); r=r.n; } // 3 2 1
    }
}`,
        expectedSolution: `public static Node reverse(Node head) {
    Node prev = null, cur = head;
    while (cur != null) { 
        Node next = cur.n; 
        cur.n = prev; 
        prev = cur; 
        cur = next; 
    }
    return prev;
}`,
        keywords: ['linked list', 'reverse', 'iterative', 'three pointers'],
        maxScore: 10
    },
    {
        id: 'C13', type: 'coding', part: 'B', difficulty: 'medium', topic: 'Cycle Detection',
        question: 'Detect cycle in linked list using Floyd\'s algorithm.',
        language: 'java',
        starterCode: `public class CycleDetection {
    static class Node { 
        int v; 
        Node n; 
        Node(int v){this.v=v;} 
    }

    public static boolean hasCycle(Node head) {
        // Your Floyd's tortoise & hare implementation
        return false;
    }
    
    public static void main(String[] args) {
        Node a=new Node(1); a.n=new Node(2); a.n.n=a; // creates cycle
        System.out.println(hasCycle(a)); // true
    }
}`,
        expectedSolution: `public static boolean hasCycle(Node head) {
    Node slow = head, fast = head;
    while (fast != null && fast.n != null) {
        slow = slow.n; 
        fast = fast.n.n;
        if (slow == fast) return true;
    }
    return false;
}`,
        keywords: ['cycle detection', 'Floyd algorithm', 'tortoise and hare', 'two pointers'],
        maxScore: 10
    },
    {
        id: 'C14', type: 'coding', part: 'B', difficulty: 'medium', topic: 'Stack Implementation',
        question: 'Implement stack using two queues.',
        language: 'java',
        starterCode: `import java.util.*;

public class StackUsingQueues {
    static class MyStack {
        Queue<Integer> q1 = new ArrayDeque<>(), q2 = new ArrayDeque<>();
        
        public void push(int x) {
            // Your implementation
        }
        
        public int pop() {
            // Your implementation
            return 0;
        }
    }
    
    public static void main(String[] args) {
        MyStack stack = new MyStack();
        stack.push(1); stack.push(2); stack.push(3);
        System.out.println(stack.pop()); // 3
    }
}`,
        expectedSolution: `public void push(int x){ 
    q1.add(x); 
}

public int pop(){
    while (q1.size() > 1) q2.add(q1.remove());
    int r = q1.remove();
    Queue<Integer> t = q1; q1 = q2; q2 = t;
    return r;
}`,
        keywords: ['stack', 'queue', 'LIFO', 'queue swapping'],
        maxScore: 10
    },
    {
        id: 'C15', type: 'coding', part: 'B', difficulty: 'medium', topic: 'Array Merging',
        question: 'Merge two sorted arrays in-place assuming extra space at end of first.',
        language: 'java',
        starterCode: `import java.util.Arrays;

public class MergeSortedArrays {
    public static void merge(int[] a, int m, int[] b, int n) {
        // Merge b into a, a has space for m+n elements
        // Your implementation here
    }
    
    public static void main(String[] args) {
        int[] a = new int[6]; a[0]=1; a[1]=3; a[2]=5;
        merge(a,3,new int[]{2,4,6},3);
        System.out.println(Arrays.toString(a)); // [1,2,3,4,5,6]
    }
}`,
        expectedSolution: `public static void merge(int[] a, int m, int[] b, int n) {
    int i = m-1, j = n-1, k = m+n-1;
    while (j >= 0) {
        if (i >= 0 && a[i] > b[j]) a[k--] = a[i--];
        else a[k--] = b[j--];
    }
}`,
        keywords: ['merge sorted arrays', 'in-place', 'backward iteration', 'two pointers'],
        maxScore: 10
    },
    {
        id: 'C16', type: 'coding', part: 'B', difficulty: 'hard', topic: 'Trie Implementation',
        question: 'Implement Trie with insert and search operations.',
        language: 'java',
        starterCode: `import java.util.*;

public class TrieImplementation {
    static class Trie {
        static class Node { 
            Map<Character,Node> m = new HashMap<>(); 
            boolean end; 
        }
        
        private final Node root = new Node();
        
        public void insert(String s) {
            // Your implementation
        }
        
        public boolean search(String s) {
            // Your implementation
            return false;
        }
    }
    
    public static void main(String[] args) {
        Trie t=new Trie(); t.insert("hello");
        System.out.println(t.search("hello")); // true
    }
}`,
        expectedSolution: `public void insert(String s){ 
    Node cur = root; 
    for(char c:s.toCharArray()) 
        cur = cur.m.computeIfAbsent(c,k->new Node()); 
    cur.end=true; 
}

public boolean search(String s){ 
    Node cur=root; 
    for(char c:s.toCharArray()){ 
        cur=cur.m.get(c); 
        if(cur==null) return false; 
    } 
    return cur.end; 
}`,
        keywords: ['trie', 'prefix tree', 'HashMap', 'string operations'],
        maxScore: 10
    },
    {
        id: 'C17', type: 'coding', part: 'B', difficulty: 'medium', topic: 'Min Stack',
        question: 'Implement Min Stack with O(1) min operation.',
        language: 'java',
        starterCode: `import java.util.*;

public class MinStackImplementation {
    static class MinStack {
        private Deque<Integer> stack = new ArrayDeque<>();
        private Deque<Integer> mins = new ArrayDeque<>();
        
        public void push(int x) {
            // Your implementation
        }
        
        public int pop() {
            // Your implementation
            return 0;
        }
        
        public int min() {
            // Your implementation
            return 0;
        }
    }
    
    public static void main(String[] args) {
        MinStack ms = new MinStack();
        ms.push(3); ms.push(1); ms.push(2);
        System.out.println(ms.min()); // 1
        ms.pop();
        System.out.println(ms.min()); // 1
    }
}`,
        expectedSolution: `public void push(int x){ 
    stack.push(x); 
    if (mins.isEmpty()||x<=mins.peek()) mins.push(x); 
}

public int pop(){ 
    int x = stack.pop(); 
    if (x==mins.peek()) mins.pop(); 
    return x; 
}

public int min(){ 
    return mins.peek(); 
}`,
        keywords: ['min stack', 'O(1)', 'auxiliary stack', 'stack operations'],
        maxScore: 10
    },
    {
        id: 'C18', type: 'coding', part: 'B', difficulty: 'medium', topic: 'Balanced Parentheses',
        question: 'Check if parentheses are balanced for all types ()[]{}.',
        language: 'java',
        starterCode: `import java.util.*;

public class BalancedParentheses {
    public static boolean isBalanced(String s) {
        // Your implementation for (), [], {}
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(isBalanced("({[]})")); // true
        System.out.println(isBalanced("({[})")); // false
    }
}`,
        expectedSolution: `public static boolean isBalanced(String s){
    Map<Character,Character> m = Map.of(')', '(', ']', '[', '}', '{');
    Deque<Character> st = new ArrayDeque<>();
    for(char c:s.toCharArray()){
        if (m.containsValue(c)) st.push(c);
        else if (m.containsKey(c)) { 
            if (st.isEmpty() || st.pop() != m.get(c)) return false; 
        }
    }
    return st.isEmpty();
}`,
        keywords: ['balanced parentheses', 'stack', 'matching pairs', 'HashMap'],
        maxScore: 10
    },
    {
        id: 'C19', type: 'coding', part: 'B', difficulty: 'easy', topic: 'Priority Queue',
        question: 'Demonstrate Priority Queue usage with min-heap.',
        language: 'java',
        starterCode: `import java.util.*;

public class PriorityQueueDemo {
    public static void main(String[] args) {
        // Create and use PriorityQueue as min-heap
        // Add: 5, 1, 3 and print in sorted order
        
        PriorityQueue<Integer> pq = new PriorityQueue<>(); // min-heap
        // Your implementation here
    }
}`,
        expectedSolution: `public static void main(String[] args){
    PriorityQueue<Integer> pq = new PriorityQueue<>(); // min-heap
    pq.add(5); pq.add(1); pq.add(3);
    while(!pq.isEmpty()) System.out.print(pq.poll()+" "); // 1 3 5
}`,
        keywords: ['priority queue', 'min heap', 'poll', 'natural ordering'],
        maxScore: 10
    },
    {
        id: 'C20', type: 'coding', part: 'B', difficulty: 'hard', topic: 'Expression Parsing',
        question: 'Convert infix expression to postfix using shunting-yard algorithm.',
        language: 'java',
        starterCode: `import java.util.*;

public class InfixToPostfix {
    static int prec(char c) {
        // Return operator precedence
        return 0;
    }
    
    public static String toPostfix(String s) {
        // Your shunting-yard implementation here
        return "";
    }
    
    public static void main(String[] args) {
        System.out.println(toPostfix("a+b*(c-d)")); // abcd-*+
    }
}`,
        expectedSolution: `static int prec(char c) {
    return switch(c) { case '+','-'->1; case '*','/'->2; default->0; };
}

public static String toPostfix(String s) {
    StringBuilder out = new StringBuilder();
    Deque<Character> st = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (Character.isLetterOrDigit(c)) out.append(c);
        else if (c=='(') st.push(c);
        else if (c==')'){ 
            while(!st.isEmpty() && st.peek()!='(') out.append(st.pop()); 
            st.pop(); 
        }
        else {
            while(!st.isEmpty() && prec(st.peek()) >= prec(c)) 
                out.append(st.pop());
            st.push(c);
        }
    }
    while(!st.isEmpty()) out.append(st.pop());
    return out.toString();
}`,
        keywords: ['infix to postfix', 'shunting yard', 'operator precedence', 'stack'],
        maxScore: 10
    },

    // Algorithms (Q21-Q30)
    {
        id: 'C21', type: 'coding', part: 'B', difficulty: 'easy', topic: 'Binary Search',
        question: 'Implement binary search iteratively.',
        language: 'java',
        starterCode: `public class BinarySearchIterative {
    public static int binarySearch(int[] a, int key) {
        // Your iterative implementation here
        return -1;
    }
    
    public static void main(String[] args) {
        System.out.println(binarySearch(new int[]{1,2,3,4}, 3)); // 2
    }
}`,
        expectedSolution: `public static int binarySearch(int[] a, int key) {
    int l=0, r=a.length-1;
    while (l<=r) {
        int m = l + (r-l)/2;
        if (a[m]==key) return m;
        else if (a[m] < key) l = m+1;
        else r = m-1;
    }
    return -1;
}`,
        keywords: ['binary search', 'iterative', 'divide and conquer', 'sorted array'],
        maxScore: 10
    },
    {
        id: 'C22', type: 'coding', part: 'B', difficulty: 'medium', topic: 'Merge Sort',
        question: 'Implement merge sort algorithm.',
        language: 'java',
        starterCode: `import java.util.Arrays;

public class MergeSortImplementation {
    public static void mergeSort(int[] a) {
        // Your implementation here
    }
    
    private static void sort(int[] a, int l, int r) {
        // Recursive helper method
    }
    
    private static void merge(int[] a, int l, int m, int r) {
        // Merge two sorted halves
    }
    
    public static void main(String[] args) {
        int[] a = {5,2,4,1,3}; 
        mergeSort(a);
        System.out.println(Arrays.toString(a)); // [1,2,3,4,5]
    }
}`,
        expectedSolution: `public static void mergeSort(int[] a) { 
    sort(a,0,a.length-1); 
}

private static void sort(int[] a,int l,int r){
    if(l>=r) return;
    int m=(l+r)/2; sort(a,l,m); sort(a,m+1,r); merge(a,l,m,r);
}

private static void merge(int[] a,int l,int m,int r){
    int[] t = Arrays.copyOfRange(a,l,r+1);
    int i=0,j=m-l+1,k=l;
    while (i<=m-l && j<=r-l) a[k++] = t[i] <= t[j] ? t[i++] : t[j++];
    while (i<=m-l) a[k++] = t[i++];
    while (j<=r-l) a[k++] = t[j++];
}`,
        keywords: ['merge sort', 'divide and conquer', 'stable sort', 'O(n log n)'],
        maxScore: 10
    },
    {
        id: 'C23', type: 'coding', part: 'B', difficulty: 'hard', topic: 'Quickselect',
        question: 'Find kth smallest element using Quickselect algorithm.',
        language: 'java',
        starterCode: `import java.util.Random;

public class QuickSelectImplementation {
    private static final Random R = new Random();
    
    public static int kthSmallest(int[] a, int k) {
        // Your quickselect implementation here
        return 0;
    }
    
    private static int quickSelect(int[] a, int l, int r, int k) {
        // Recursive quickselect
        return 0;
    }
    
    private static int partition(int[] a, int l, int r, int pivotIdx) {
        // Partition around pivot
        return 0;
    }
    
    private static void swap(int[] a, int i, int j) {
        int t=a[i];a[i]=a[j];a[j]=t;
    }
    
    public static void main(String[] args) {
        System.out.println(kthSmallest(new int[]{7,10,4,3,20,15}, 3)); // 7
    }
}`,
        expectedSolution: `public static int kthSmallest(int[] a, int k) {
    return quickSelect(a,0,a.length-1,k-1);
}

private static int quickSelect(int[] a,int l,int r,int k){
    if(l==r) return a[l];
    int p = partition(a,l,r,l + R.nextInt(r-l+1));
    if (k==p) return a[k];
    else if (k < p) return quickSelect(a,l,p-1,k);
    else return quickSelect(a,p+1,r,k);
}

private static int partition(int[] a,int l,int r,int pivotIdx){
    int pivot = a[pivotIdx]; swap(a,pivotIdx,r);
    int store=l;
    for(int i=l;i<r;i++) if(a[i]<pivot) swap(a,store++,i);
    swap(a,store,r); return store;
}`,
        keywords: ['quickselect', 'kth smallest', 'partition', 'average O(n)'],
        maxScore: 10
    },
    {
        id: 'C24', type: 'coding', part: 'B', difficulty: 'medium', topic: 'Graph DFS',
        question: 'Implement depth-first search for graph with adjacency list.',
        language: 'java',
        starterCode: `import java.util.*;

public class GraphDFS {
    public static void dfs(Map<Integer,List<Integer>> g, int src, Set<Integer> vis) {
        // Your recursive DFS implementation here
    }
    
    public static void main(String[] args) {
        Map<Integer,List<Integer>> g = Map.of(
            1, List.of(2,3),
            2, List.of(4),
            3, List.of(5)
        );
        dfs(g,1,new HashSet<>()); // 1 2 4 3 5
    }
}`,
        expectedSolution: `public static void dfs(Map<Integer,List<Integer>> g, int src, Set<Integer> vis){
    vis.add(src); System.out.print(src+" ");
    for(int nb : g.getOrDefault(src, List.of())) 
        if(!vis.contains(nb)) dfs(g, nb, vis);
}`,
        keywords: ['graph', 'DFS', 'adjacency list', 'recursive', 'visited set'],
        maxScore: 10
    },
    {
        id: 'C25', type: 'coding', part: 'B', difficulty: 'medium', topic: 'Graph BFS',
        question: 'Find shortest path in unweighted graph using BFS.',
        language: 'java',
        starterCode: `import java.util.*;

public class GraphBFS {
    public static int bfsShortest(Map<Integer,List<Integer>> g, int s, int t) {
        // Your BFS shortest path implementation here
        return -1;
    }
    
    public static void main(String[] args) {
        Map<Integer,List<Integer>> graph = Map.of(
            1, List.of(2,3),
            2, List.of(4),
            3, List.of(4),
            4, List.of()
        );
        System.out.println(bfsShortest(graph, 1, 4)); // 2
    }
}`,
        expectedSolution: `public static int bfsShortest(Map<Integer,List<Integer>> g, int s, int t) {
    Queue<Integer> q = new ArrayDeque<>(); q.add(s);
    Map<Integer,Integer> dist = new HashMap<>(); dist.put(s,0);
    while (!q.isEmpty()) {
        int u = q.poll();
        if (u == t) return dist.get(u);
        for (int v : g.getOrDefault(u, List.of())) {
            if (!dist.containsKey(v)) { 
                dist.put(v, dist.get(u)+1); q.add(v); 
            }
        }
    }
    return -1;
}`,
        keywords: ['BFS', 'shortest path', 'unweighted graph', 'queue', 'distance map'],
        maxScore: 10
    },
    {
        id: 'C26', type: 'coding', part: 'B', difficulty: 'hard', topic: 'Topological Sort',
        question: 'Implement topological sort using Kahn\'s algorithm.',
        language: 'java',
        starterCode: `import java.util.*;

public class TopologicalSort {
    public static List<Integer> topoSort(Map<Integer,List<Integer>> g) {
        // Your Kahn's algorithm implementation here
        return new ArrayList<>();
    }
    
    public static void main(String[] args) {
        Map<Integer,List<Integer>> dag = Map.of(
            5, List.of(2,0),
            4, List.of(0,1),
            2, List.of(3),
            3, List.of(1)
        );
        System.out.println(topoSort(dag)); // One valid order: [4,5,2,3,1,0]
    }
}`,
        expectedSolution: `public static List<Integer> topoSort(Map<Integer,List<Integer>> g) {
    Map<Integer,Integer> indeg = new HashMap<>();
    g.keySet().forEach(u -> indeg.putIfAbsent(u,0));
    for (var e : g.entrySet()) 
        for (int v : e.getValue()) indeg.put(v, indeg.getOrDefault(v,0)+1);
    
    Queue<Integer> q = new ArrayDeque<>();
    indeg.forEach((k,v)->{ if(v==0) q.add(k);});
    
    List<Integer> res = new ArrayList<>();
    while(!q.isEmpty()){
        int u = q.poll(); res.add(u);
        for(int v : g.getOrDefault(u,List.of()))
            if(--indeg.merge(v,0,(old,newV)->old) == 0) q.add(v);
    }
    return res;
}`,
        keywords: ['topological sort', 'Kahn algorithm', 'indegree', 'DAG'],
        maxScore: 10
    },
    {
        id: 'C27', type: 'coding', part: 'B', difficulty: 'hard', topic: 'Dijkstra Algorithm',
        question: 'Implement Dijkstra\'s shortest path for weighted graph.',
        language: 'java',
        starterCode: `import java.util.*;

public class DijkstraAlgorithm {
    static class Edge { 
        int to; 
        int w; 
        Edge(int t,int w){to=t;this.w=w;} 
    }

    public static Map<Integer,Integer> dijkstra(Map<Integer,List<Edge>> g, int src) {
        // Your Dijkstra implementation here
        return new HashMap<>();
    }
    
    public static void main(String[] args) {
        Map<Integer,List<Edge>> graph = new HashMap<>();
        graph.put(0, List.of(new Edge(1,4), new Edge(2,2)));
        graph.put(1, List.of(new Edge(3,5)));
        graph.put(2, List.of(new Edge(3,8), new Edge(4,10)));
        
        System.out.println(dijkstra(graph, 0));
    }
}`,
        expectedSolution: `public static Map<Integer,Integer> dijkstra(Map<Integer,List<Edge>> g, int src) {
    Map<Integer,Integer> dist = new HashMap<>();
    PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a->a[1]));
    pq.add(new int[]{src,0}); dist.put(src,0);
    
    while(!pq.isEmpty()){
        var cur = pq.poll(); int u=cur[0], d=cur[1];
        if (d != dist.get(u)) continue;
        
        for(Edge e: g.getOrDefault(u, List.of())) {
            int nd = d + e.w;
            if (nd < dist.getOrDefault(e.to, Integer.MAX_VALUE)) {
                dist.put(e.to, nd); pq.add(new int[]{e.to, nd});
            }
        }
    }
    return dist;
}`,
        keywords: ['Dijkstra algorithm', 'shortest path', 'priority queue', 'weighted graph'],
        maxScore: 10
    },
    {
        id: 'C28', type: 'coding', part: 'B', difficulty: 'hard', topic: 'Dynamic Programming',
        question: 'Find longest increasing subsequence in O(n log n) time.',
        language: 'java',
        starterCode: `import java.util.*;

public class LongestIncreasingSubsequence {
    public static int lis(int[] a) {
        // Your O(n log n) implementation here
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(lis(new int[]{10,9,2,5,3,7,101,18})); // 4
    }
}`,
        expectedSolution: `public static int lis(int[] a) {
    List<Integer> tail = new ArrayList<>();
    for (int x : a) {
        int i = Collections.binarySearch(tail, x);
        if (i < 0) i = -i - 1;
        if (i == tail.size()) tail.add(x); 
        else tail.set(i, x);
    }
    return tail.size();
}`,
        keywords: ['LIS', 'binary search', 'O(n log n)', 'dynamic programming'],
        maxScore: 10
    },
    {
        id: 'C29', type: 'coding', part: 'B', difficulty: 'hard', topic: 'String Matching',
        question: 'Implement KMP substring search algorithm.',
        language: 'java',
        starterCode: `public class KMPStringSearch {
    public static int kmp(String text, String pat) {
        // Your KMP implementation here
        return -1;
    }
    
    private static int[] lps(String p) {
        // Compute LPS (longest proper prefix suffix) array
        return new int[0];
    }
    
    public static void main(String[] args) {
        System.out.println(kmp("ababcabcabcabc", "abcab")); // 2
    }
}`,
        expectedSolution: `public static int kmp(String text, String pat) {
    if (pat.isEmpty()) return 0;
    int[] lpsArray = lps(pat);
    int i=0,j=0;
    while (i<text.length()){
        if (text.charAt(i)==pat.charAt(j)){ 
            i++; j++; 
            if (j==pat.length()) return i-j; 
        }
        else if (j>0) j=lpsArray[j-1];
        else i++;
    }
    return -1;
}

private static int[] lps(String p){
    int[] lpsArray = new int[p.length()];
    for (int i=1,len=0;i<p.length();){
        if (p.charAt(i)==p.charAt(len)) lpsArray[i++]=++len;
        else if (len>0) len=lpsArray[len-1];
        else lpsArray[i++]=0;
    }
    return lpsArray;
}`,
        keywords: ['KMP', 'string matching', 'LPS array', 'pattern search'],
        maxScore: 10
    },
    {
        id: 'C30', type: 'coding', part: 'B', difficulty: 'medium', topic: 'Dynamic Programming',
        question: 'Solve coin change problem - minimum coins needed.',
        language: 'java',
        starterCode: `import java.util.Arrays;

public class CoinChange {
    public static int minCoins(int[] coins, int amount) {
        // Your DP implementation here
        return -1;
    }
    
    public static void main(String[] args) {
        System.out.println(minCoins(new int[]{1,2,5}, 11)); // 3
    }
}`,
        expectedSolution: `public static int minCoins(int[] coins, int amount) {
    int[] dp = new int[amount+1];
    Arrays.fill(dp, amount+1);
    dp[0]=0;
    for (int i=1;i<=amount;i++){
        for (int c: coins) 
            if (c<=i) dp[i] = Math.min(dp[i], dp[i-c]+1);
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`,
        keywords: ['coin change', 'dynamic programming', 'min coins', 'bottom-up DP'],
        maxScore: 10
    },

    // OOP & Design Patterns (Q31-Q40)
    {
        id: 'C31', type: 'coding', part: 'B', difficulty: 'easy', topic: 'Singleton Pattern',
        question: 'Implement thread-safe Singleton using holder idiom.',
        language: 'java',
        starterCode: `public class ThreadSafeSingleton {
    // Your thread-safe singleton implementation here
    
    public static void main(String[] args) {
        ThreadSafeSingleton instance1 = ThreadSafeSingleton.getInstance();
        ThreadSafeSingleton instance2 = ThreadSafeSingleton.getInstance();
        System.out.println("Same instance: " + (instance1 == instance2)); // true
    }
}`,
        expectedSolution: `private ThreadSafeSingleton() {}

private static class Holder { 
    static final ThreadSafeSingleton INSTANCE = new ThreadSafeSingleton(); 
}

public static ThreadSafeSingleton getInstance() { 
    return Holder.INSTANCE; 
}`,
        keywords: ['singleton', 'thread-safe', 'holder idiom', 'lazy initialization'],
        maxScore: 10
    },
    {
        id: 'C32', type: 'coding', part: 'B', difficulty: 'medium', topic: 'Factory Pattern',
        question: 'Implement Factory Method pattern for shapes.',
        language: 'java',
        starterCode: `interface Shape { 
    void draw(); 
}

class Circle implements Shape { 
    public void draw(){ System.out.println("Circle"); } 
}

class Square implements Shape { 
    public void draw(){ System.out.println("Square"); } 
}

class ShapeFactory {
    public static Shape create(String type) {
        // Your factory method implementation here
        return null;
    }
}

public class FactoryDemo {
    public static void main(String[] args) {
        Shape circle = ShapeFactory.create("circle");
        circle.draw(); // Circle
    }
}`,
        expectedSolution: `public static Shape create(String type) {
    return switch(type.toLowerCase()) { 
        case "circle" -> new Circle(); 
        default -> new Square(); 
    };
}`,
        keywords: ['factory pattern', 'polymorphism', 'object creation', 'switch expression'],
        maxScore: 10
    },
    {
        id: 'C33', type: 'coding', part: 'B', difficulty: 'medium', topic: 'Observer Pattern',
        question: 'Implement simple Observer pattern with event listener.',
        language: 'java',
        starterCode: `import java.util.*;

public class ObserverPatternDemo {
    interface Observer { 
        void notify(String msg); 
    }

    static class Subject {
        private List<Observer> obs = new ArrayList<>();
        
        public void register(Observer o) {
            // Your implementation
        }
        
        public void publish(String m) {
            // Your implementation  
        }
    }
    
    public static void main(String[] args) {
        Subject subject = new Subject();
        subject.register(msg -> System.out.println("Observer1: " + msg));
        subject.publish("Hello"); // Observer1: Hello
    }
}`,
        expectedSolution: `public void register(Observer o){ 
    obs.add(o); 
}

public void publish(String m){ 
    obs.forEach(o->o.notify(m)); 
}`,
        keywords: ['observer pattern', 'event listener', 'publish-subscribe', 'lambda'],
        maxScore: 10
    },
    {
        id: 'C34', type: 'coding', part: 'B', difficulty: 'medium', topic: 'Strategy Pattern',
        question: 'Implement Strategy pattern for sorting algorithms.',
        language: 'java',
        starterCode: `import java.util.*;

public class StrategyPatternDemo {
    interface SortStrategy { 
        void sort(int[] a); 
    }

    static class QuickSort implements SortStrategy {
        public void sort(int[] a) {
            // Your quicksort implementation or use Arrays.sort
        }
    }

    static class Context {
        private final SortStrategy strategy;
        
        Context(SortStrategy s) {
            // Your implementation
        }
        
        void execute(int[] a) {
            // Your implementation
        }
    }
    
    public static void main(String[] args) {
        Context context = new Context(new QuickSort());
        int[] arr = {3,1,4,1,5};
        context.execute(arr);
        System.out.println(Arrays.toString(arr));
    }
}`,
        expectedSolution: `public void sort(int[] a) { 
    Arrays.sort(a); 
}

Context(SortStrategy s){ 
    this.strategy=s; 
}

void execute(int[] a){ 
    strategy.sort(a); 
}`,
        keywords: ['strategy pattern', 'sorting', 'polymorphism', 'algorithm selection'],
        maxScore: 10
    },
    {
        id: 'C35', type: 'coding', part: 'B', difficulty: 'medium', topic: 'Builder Pattern',
        question: 'Implement Builder pattern for immutable object construction.',
        language: 'java',
        starterCode: `public class BuilderPatternDemo {
    public static class Person {
        private final String name; 
        private final int age;

        private Person(Builder b) {
            // Your implementation
        }

        public static class Builder {
            private String name; 
            private int age;

            public Builder name(String n) {
                // Your implementation
                return this;
            }

            public Builder age(int a) {
                // Your implementation  
                return this;
            }

            public Person build() {
                // Your implementation
                return null;
            }
        }
    }

    public static void main(String[] args) {
        Person p = new Person.Builder().name("Alice").age(30).build();
        System.out.println("Person created with builder");
    }
}`,
        expectedSolution: `private Person(Builder b){ 
    name=b.name; age=b.age; 
}

public Builder name(String n){ 
    this.name=n; return this; 
}

public Builder age(int a){ 
    this.age=a; return this; 
}

public Person build(){ 
    return new Person(this); 
}`,
        keywords: ['builder pattern', 'fluent interface', 'immutable object', 'method chaining'],
        maxScore: 10
    },
    {
        id: 'C36', type: 'coding', part: 'B', difficulty: 'medium', topic: 'Adapter Pattern',
        question: 'Implement Adapter pattern for wrapping legacy interface.',
        language: 'java',
        starterCode: `public class AdapterPatternDemo {
    interface NewApi { 
        void perform(); 
    }

    static class Old { 
        void legacy() { 
            System.out.println("legacy"); 
        } 
    }

    static class Adapter implements NewApi {
        private final Old old; 
        
        Adapter(Old o) {
            // Your implementation
        }

        public void perform() {
            // Your implementation
        }
    }
    
    public static void main(String[] args) {
        Old oldSystem = new Old();
        NewApi adapter = new Adapter(oldSystem);
        adapter.perform(); // legacy
    }
}`,
        expectedSolution: `Adapter(Old o){ 
    this.old=o; 
}

public void perform(){ 
    old.legacy(); 
}`,
        keywords: ['adapter pattern', 'wrapper', 'interface adaptation', 'legacy code'],
        maxScore: 10
    },
    {
        id: 'C37', type: 'coding', part: 'B', difficulty: 'medium', topic: 'SOLID Principles',
        question: 'Implement Single Responsibility by separating logger and business logic.',
        language: 'java',
        starterCode: `public class SOLIDDemo {
    static class Logger { 
        void log(String m) {
            // Your implementation
        } 
    }

    static class OrderService {
        private final Logger logger; 
        
        OrderService(Logger l) {
            // Your implementation
        }

        void placeOrder(String o) {
            // Your implementation - log and process order
        }
    }
    
    public static void main(String[] args) {
        Logger logger = new Logger();
        OrderService service = new OrderService(logger);
        service.placeOrder("Order123");
    }
}`,
        expectedSolution: `void log(String m){ 
    System.out.println(m); 
}

OrderService(Logger l){
    this.logger=l;
}

void placeOrder(String o){ 
    logger.log("Placing "+o); 
    // business logic here
}`,
        keywords: ['SOLID', 'single responsibility', 'dependency injection', 'separation of concerns'],
        maxScore: 10
    },
    {
        id: 'C38', type: 'coding', part: 'B', difficulty: 'medium', topic: 'Dependency Injection',
        question: 'Demonstrate constructor injection pattern.',
        language: 'java',
        starterCode: `public class DependencyInjectionDemo {
    interface Payment { 
        void pay(); 
    }

    static class Paypal implements Payment { 
        public void pay() {
            // Your implementation
        } 
    }

    static class Checkout {
        private final Payment payment;

        Checkout(Payment payment) {
            // Your implementation
        }

        void checkout() {
            // Your implementation
        }
    }
    
    public static void main(String[] args) {
        Payment paypal = new Paypal();
        Checkout checkout = new Checkout(paypal);
        checkout.checkout(); // Paid
    }
}`,
        expectedSolution: `public void pay(){ 
    System.out.println("Paid"); 
}

Checkout(Payment payment){ 
    this.payment = payment; 
}

void checkout(){ 
    payment.pay(); 
}`,
        keywords: ['dependency injection', 'constructor injection', 'loose coupling', 'interface'],
        maxScore: 10
    },
    {
        id: 'C39', type: 'coding', part: 'B', difficulty: 'medium', topic: 'Prototype Pattern',
        question: 'Implement Prototype pattern using Cloneable.',
        language: 'java',
        starterCode: `public class PrototypeDemo implements Cloneable {
    private int x;

    public PrototypeDemo(int x) {
        // Your implementation
    }

    public PrototypeDemo clone() {
        // Your implementation
        return null;
    }
    
    public static void main(String[] args) throws CloneNotSupportedException {
        PrototypeDemo original = new PrototypeDemo(42);
        PrototypeDemo copy = original.clone();
        System.out.println("Cloned successfully");
    }
}`,
        expectedSolution: `public PrototypeDemo(int x){ 
    this.x=x; 
}

public PrototypeDemo clone() { 
    try { return (PrototypeDemo) super.clone(); }
    catch(CloneNotSupportedException e){ throw new RuntimeException(e); } 
}`,
        keywords: ['prototype pattern', 'Cloneable', 'object cloning', 'copy constructor'],
        maxScore: 10
    },
    {
        id: 'C40', type: 'coding', part: 'B', difficulty: 'hard', topic: 'Visitor Pattern',
        question: 'Implement simple Visitor pattern for elements.',
        language: 'java',
        starterCode: `interface Element { 
    void accept(Visitor v); 
}

interface Visitor { 
    void visit(NumberElement e); 
}

class NumberElement implements Element {
    int value; 
    
    NumberElement(int v) {
        // Your implementation
    }

    public void accept(Visitor v) {
        // Your implementation
    }
}

class PrintVisitor implements Visitor {
    public void visit(NumberElement e) {
        // Your implementation
    }
}

public class VisitorDemo {
    public static void main(String[] args) {
        NumberElement num = new NumberElement(42);
        PrintVisitor printer = new PrintVisitor();
        num.accept(printer); // Number: 42
    }
}`,
        expectedSolution: `NumberElement(int v){
    this.value=v;
}

public void accept(Visitor v){ 
    v.visit(this); 
}

public void visit(NumberElement e) {
    System.out.println("Number: " + e.value);
}`,
        keywords: ['visitor pattern', 'double dispatch', 'polymorphism', 'element traversal'],
        maxScore: 10
    },

    // Concurrency & File Handling (Q41-Q50)
    {
        id: 'C41', type: 'coding', part: 'B', difficulty: 'easy', topic: 'Basic Threading',
        question: 'Start threads and join - basic thread operations.',
        language: 'java',
        starterCode: `public class BasicThreading {
    public static void main(String[] args) throws InterruptedException {
        // Create and start a thread that prints "running"
        // Then wait for it to complete and print "done"
        
        Thread t = new Thread(() -> {
            // Your implementation
        });
        
        // Your thread operations here
    }
}`,
        expectedSolution: `public static void main(String[] args) throws InterruptedException {
    Thread t = new Thread(() -> { System.out.println("running"); });
    t.start(); 
    t.join();
    System.out.println("done");
}`,
        keywords: ['thread', 'start', 'join', 'lambda', 'concurrency'],
        maxScore: 10
    },
    {
        id: 'C42', type: 'coding', part: 'B', difficulty: 'medium', topic: 'Producer Consumer',
        question: 'Implement Producer-Consumer using BlockingQueue.',
        language: 'java',
        starterCode: `import java.util.concurrent.*;

public class ProducerConsumer {
    public static void main(String[] args) throws InterruptedException {
        BlockingQueue<Integer> q = new ArrayBlockingQueue<>(5);

        Thread producer = new Thread(() -> {
            // Your producer implementation here
            // Produce numbers 0-9, print "P:x" for each
        });

        Thread consumer = new Thread(() -> {
            // Your consumer implementation here  
            // Consume and print "C:x" for each
        });

        // Start threads and manage execution
    }
}`,
        expectedSolution: `public static void main(String[] args) throws InterruptedException {
    BlockingQueue<Integer> q = new ArrayBlockingQueue<>(5);

    Thread producer = new Thread(() -> {
        try { 
            for (int i=0;i<10;i++){ 
                q.put(i); System.out.println("P:"+i); Thread.sleep(50);
            } 
        } catch(Exception e){}
    });

    Thread consumer = new Thread(() -> {
        try { 
            while(true){ 
                Integer v = q.take(); System.out.println("C:"+v); 
            } 
        } catch(Exception e){}
    });

    producer.start(); consumer.setDaemon(true); consumer.start();
    producer.join();
}`,
        keywords: ['producer consumer', 'BlockingQueue', 'put', 'take', 'daemon thread'],
        maxScore: 10
    },
    {
        id: 'C43', type: 'coding', part: 'B', difficulty: 'medium', topic: 'Singleton DCL',
        question: 'Thread-safe Singleton with double-checked locking.',
        language: 'java',
        starterCode: `public class DoubleLockSingleton {
    private static volatile DoubleLockSingleton instance;

    private DoubleLockSingleton() {}

    public static DoubleLockSingleton getInstance() {
        // Your double-checked locking implementation here
        return null;
    }
    
    public static void main(String[] args) {
        DoubleLockSingleton s1 = DoubleLockSingleton.getInstance();
        DoubleLockSingleton s2 = DoubleLockSingleton.getInstance();
        System.out.println("Same instance: " + (s1 == s2)); // true
    }
}`,
        expectedSolution: `public static DoubleLockSingleton getInstance(){
    if(instance==null){
        synchronized(DoubleLockSingleton.class){
            if(instance==null) instance = new DoubleLockSingleton();
        }
    }
    return instance;
}`,
        keywords: ['double-checked locking', 'volatile', 'singleton', 'thread safety'],
        maxScore: 10
    },
    {
        id: 'C44', type: 'coding', part: 'B', difficulty: 'medium', topic: 'File Processing',
        question: 'Count words in a large file using BufferedReader and streams.',
        language: 'java',
        starterCode: `import java.io.*;

public class WordCounter {
    public static long countWords(File f) throws IOException {
        // Your implementation using BufferedReader and streams
        return 0;
    }
    
    public static void main(String[] args) throws IOException {
        // Create a test file for demonstration
        File testFile = new File("test.txt");
        try (PrintWriter pw = new PrintWriter(testFile)) {
            pw.println("Hello world");
            pw.println("Java programming");
        }
        
        System.out.println("Word count: " + countWords(testFile)); // 4
    }
}`,
        expectedSolution: `public static long countWords(File f) throws IOException {
    try (BufferedReader br = new BufferedReader(new FileReader(f))) {
        return br.lines()
                 .flatMap(l -> java.util.Arrays.stream(l.split("\\\\s+")))
                 .filter(s->!s.isBlank())
                 .count();
    }
}`,
        keywords: ['file processing', 'BufferedReader', 'streams', 'word count', 'flatMap'],
        maxScore: 10
    },
    {
        id: 'C45', type: 'coding', part: 'B', difficulty: 'medium', topic: 'CompletableFuture',
        question: 'Use CompletableFuture to run tasks in parallel and combine results.',
        language: 'java',
        starterCode: `import java.util.concurrent.*;

public class CompletableFutureDemo {
    public static void main(String[] args) throws Exception {
        ExecutorService ex = Executors.newFixedThreadPool(2);

        // Create two CompletableFutures that return integers
        // Combine their results and print the sum
        
        CompletableFuture<Integer> f1 = CompletableFuture.supplyAsync(() -> {
            // Your implementation - return 2
            return 0;
        }, ex);

        CompletableFuture<Integer> f2 = CompletableFuture.supplyAsync(() -> {
            // Your implementation - return 3
            return 0;
        }, ex);

        // Your implementation - combine f1 and f2 results
        int sum = 0; // Replace with actual combination
        
        System.out.println(sum);
        ex.shutdown();
    }
}`,
        expectedSolution: `public static void main(String[] args) throws Exception {
    ExecutorService ex = Executors.newFixedThreadPool(2);
    CompletableFuture<Integer> f1 = CompletableFuture.supplyAsync(() -> 2, ex);
    CompletableFuture<Integer> f2 = CompletableFuture.supplyAsync(() -> 3, ex);
    int sum = f1.thenCombine(f2, Integer::sum).get();
    System.out.println(sum); //5
    ex.shutdown();
}`,
        keywords: ['CompletableFuture', 'thenCombine', 'parallel execution', 'ExecutorService'],
        maxScore: 10
    },
    {
        id: 'C46', type: 'coding', part: 'B', difficulty: 'easy', topic: 'NIO File Operations',
        question: 'File copy using NIO Files.copy method.',
        language: 'java',
        starterCode: `import java.nio.file.*;

public class FileCopyNIO {
    public static void copy(Path src, Path dst) throws Exception {
        // Your NIO implementation here
    }
    
    public static void main(String[] args) throws Exception {
        Path source = Paths.get("source.txt");
        Path target = Paths.get("target.txt");
        
        // Create source file for demo
        Files.write(source, "Hello NIO".getBytes());
        
        copy(source, target);
        System.out.println("File copied: " + Files.readString(target));
    }
}`,
        expectedSolution: `public static void copy(Path src, Path dst) throws Exception {
    Files.copy(src, dst, StandardCopyOption.REPLACE_EXISTING);
}`,
        keywords: ['NIO', 'Files.copy', 'Path', 'StandardCopyOption'],
        maxScore: 10
    },
    {
        id: 'C47', type: 'coding', part: 'B', difficulty: 'medium', topic: 'JSON Serialization',
        question: 'Read/write JSON using built-in Java (manual serializer for interview).',
        language: 'java',
        starterCode: `import java.io.*;

public class ManualJSON {
    static class Person { 
        String name; 
        int age; 
        Person(String n,int a){name=n;age=a;} 
    }

    public static void writeJson(Person p, Writer w) throws IOException {
        // Your manual JSON serialization here
    }
    
    public static void main(String[] args) throws Exception {
        Person p = new Person("Alice",30);
        try (Writer w = new FileWriter("out.json")) { 
            writeJson(p,w); 
        }
        
        // Read and print the JSON
        System.out.println(Files.readString(Paths.get("out.json")));
    }
}`,
        expectedSolution: `public static void writeJson(Person p, Writer w) throws IOException {
    w.write("{\\"name\\":\\""+p.name+"\\",\\"age\\":"+p.age+"}");
}`,
        keywords: ['JSON serialization', 'manual', 'Writer', 'string formatting'],
        maxScore: 10
    },
    {
        id: 'C48', type: 'coding', part: 'B', difficulty: 'hard', topic: 'Thread Synchronization',
        question: 'Thread synchronization using wait/notify - bounded buffer implementation.',
        language: 'java',
        starterCode: `import java.util.*;

public class BoundedBuffer {
    static class Bounded {
        private final Queue<Integer> q = new ArrayDeque<>();
        private final int cap;

        Bounded(int c) {
            this.cap = c;
        }

        public synchronized void put(int x) throws InterruptedException {
            // Your implementation with wait/notify
        }

        public synchronized int take() throws InterruptedException {
            // Your implementation with wait/notify
            return 0;
        }
    }
    
    public static void main(String[] args) throws InterruptedException {
        Bounded buffer = new Bounded(3);
        
        Thread producer = new Thread(() -> {
            try {
                for(int i=0; i<5; i++) {
                    buffer.put(i);
                    System.out.println("Put: " + i);
                }
            } catch(InterruptedException e) {}
        });
        
        Thread consumer = new Thread(() -> {
            try {
                for(int i=0; i<5; i++) {
                    int val = buffer.take();
                    System.out.println("Take: " + val);
                }
            } catch(InterruptedException e) {}
        });
        
        producer.start();
        consumer.start();
        producer.join();
        consumer.join();
    }
}`,
        expectedSolution: `public synchronized void put(int x) throws InterruptedException {
    while (q.size() == cap) wait();
    q.add(x); 
    notifyAll();
}

public synchronized int take() throws InterruptedException {
    while (q.isEmpty()) wait();
    int v = q.remove(); 
    notifyAll(); 
    return v;
}`,
        keywords: ['wait', 'notify', 'synchronized', 'bounded buffer', 'producer consumer'],
        maxScore: 10
    },
    {
        id: 'C49', type: 'coding', part: 'B', difficulty: 'medium', topic: 'Atomic Operations',
        question: 'Use AtomicInteger for thread-safe counter operations.',
        language: 'java',
        starterCode: `import java.util.concurrent.atomic.AtomicInteger;

public class AtomicOperationsDemo {
    public static void main(String[] args) throws InterruptedException {
        AtomicInteger ai = new AtomicInteger(0);

        Thread t1 = new Thread(() -> {
            // Your implementation - increment 1000 times
        });

        Thread t2 = new Thread(() -> {
            // Your implementation - increment 1000 times
        });

        t1.start(); 
        t2.start(); 
        t1.join(); 
        t2.join();

        System.out.println(ai.get()); // Should be 2000
    }
}`,
        expectedSolution: `public static void main(String[] args) throws InterruptedException {
    AtomicInteger ai = new AtomicInteger(0);
    Thread t1 = new Thread(() -> { 
        for(int i=0;i<1000;i++) ai.incrementAndGet(); 
    });
    Thread t2 = new Thread(() -> { 
        for(int i=0;i<1000;i++) ai.incrementAndGet(); 
    });
    t1.start(); t2.start(); t1.join(); t2.join();
    System.out.println(ai.get()); //2000
}`,
        keywords: ['AtomicInteger', 'incrementAndGet', 'thread safety', 'lock-free'],
        maxScore: 10
    },
    {
        id: 'C50', type: 'coding', part: 'B', difficulty: 'hard', topic: 'File Monitoring',
        question: 'File tailer (like tail -f) using RandomAccessFile to watch for new lines.',
        language: 'java',
        starterCode: `import java.io.*;

public class FileTailer {
    public static void tailFollow(File f) throws Exception {
        // Your tail -f implementation using RandomAccessFile
        // Read new lines as they are added to the file
    }
    
    public static void main(String[] args) throws Exception {
        File testFile = new File("test.log");
        
        // Create test file
        try (PrintWriter pw = new PrintWriter(testFile)) {
            pw.println("Initial line");
        }
        
        // Start tailing in background thread
        Thread tailer = new Thread(() -> {
            try {
                tailFollow(testFile);
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
        tailer.setDaemon(true);
        tailer.start();
        
        // Simulate adding lines
        Thread.sleep(1000);
        try (PrintWriter pw = new PrintWriter(new FileWriter(testFile, true))) {
            pw.println("New line 1");
        }
        
        Thread.sleep(2000);
    }
}`,
        expectedSolution: `public static void tailFollow(File f) throws Exception {
    try (RandomAccessFile raf = new RandomAccessFile(f, "r")) {
        long pos = raf.length();
        while (true) {
            long len = raf.length();
            if (len > pos) {
                raf.seek(pos);
                String line;
                while ((line = raf.readLine()) != null) 
                    System.out.println(line);
                pos = raf.getFilePointer();
            }
            Thread.sleep(500);
        }
    }
}`,
        keywords: ['RandomAccessFile', 'file monitoring', 'tail -f', 'seek', 'file pointer'],
        maxScore: 10
    }
];

// =====================================================
// QUESTION SELECTION AND STRUCTURED SERVING
// =====================================================
function getStructuredQuestions(theoryCount = 10, codingCount = 10) {
    // Shuffle and select theory questions from Part A
    const shuffledTheory = [...theoryQuestions].sort(() => 0.5 - Math.random());
    const selectedTheory = shuffledTheory.slice(0, theoryCount).map((q, index) => ({
        id: `A${index + 1}`,
        partNumber: index + 1,
        part: 'A',
        partTitle: 'Theory & Conceptual Knowledge',
        text: q.question,
        difficulty: q.difficulty,
        topic: q.topic,
        type: q.type,
        maxScore: q.maxScore,
        keywords: q.keywords,
        expectedAnswer: q.expectedAnswer
    }));
    
    // Shuffle and select coding questions from Part B
    const shuffledCoding = [...codingQuestions].sort(() => 0.5 - Math.random());
    const selectedCoding = shuffledCoding.slice(0, codingCount).map((q, index) => ({
        id: `B${index + 1}`,
        partNumber: index + 1,
        part: 'B',
        partTitle: 'Practical Coding Challenges',
        text: q.question,
        difficulty: q.difficulty,
        topic: q.topic,
        type: q.type,
        language: q.language || 'java',
        starterCode: q.starterCode || null,
        maxScore: q.maxScore,
        keywords: q.keywords,
        expectedAnswer: q.expectedSolution || q.expectedAnswer
    }));
    
    return {
        partA: selectedTheory,
        partB: selectedCoding,
        totalQuestions: selectedTheory.length + selectedCoding.length,
        structure: {
            partA: {
                title: 'Part A: Theory & Conceptual Knowledge',
                count: selectedTheory.length,
                description: 'Advanced Java concepts, JVM internals, concurrency, frameworks, and system design',
                topics: ['JVM Internals & Memory', 'Concurrency & Performance', 'Advanced Java 8+ Features', 'Frameworks & Persistence', 'System Design & Scalability', 'JVM & Tooling']
            },
            partB: {
                title: 'Part B: Practical Coding Challenges', 
                count: selectedCoding.length,
                description: 'Algorithm implementation, data structures, design patterns, and coding problems',
                topics: ['Arrays & Strings', 'Collections & Data Structures', 'Algorithms', 'OOP & Design Patterns', 'Concurrency & File Handling', 'Problem Solving']
            }
        }
    };
}

function getAllQuestions() {
    return [...theoryQuestions, ...codingQuestions];
}

function getQuestionsByType(type) {
    if (type === 'theory') return theoryQuestions;
    if (type === 'coding') return codingQuestions;
    return getAllQuestions();
}

// =====================================================
// ENHANCED AI SCORING WITH PART A/B ANALYSIS
// =====================================================
function calculateAIScore(questionData, candidateAnswer) {
    if (!candidateAnswer || candidateAnswer.trim().length === 0) {
        return {
            score: 0,
            feedback: "No answer provided",
            keywordCoverage: 0,
            maxScore: questionData.maxScore || 10,
            detailedAnalysis: "Answer not submitted",
            part: questionData.part || 'Unknown'
        };
    }

    const answer = candidateAnswer.toLowerCase().trim();
    const keywords = questionData.keywords ? questionData.keywords.map(k => k.toLowerCase()) : [];
    const isTheoryQuestion = questionData.part === 'A' || questionData.type === 'theory';
    
    // 1. Keyword coverage analysis (weighted higher for theory questions)
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
    
    const keywordCoverage = keywords.length > 0 ? (keywordMatches / keywords.length) * 100 : 50;
    
    // 2. Answer length and structure analysis
    const answerLength = answer.length;
    const wordCount = answer.split(/\s+/).filter(word => word.length > 2).length;
    
    let lengthScore = 0;
    if (isTheoryQuestion) {
        // Theory questions expect more detailed explanations
        if (answerLength >= 300) lengthScore = 35;
        else if (answerLength >= 200) lengthScore = 30;
        else if (answerLength >= 100) lengthScore = 20;
        else if (answerLength >= 50) lengthScore = 10;
        else lengthScore = 5;
    } else {
        // Coding questions can be more concise if they show implementation
        if (answerLength >= 200) lengthScore = 30;
        else if (answerLength >= 100) lengthScore = 25;
        else if (answerLength >= 50) lengthScore = 15;
        else lengthScore = 8;
    }
    
    // 3. Technical depth analysis based on question type
    let technicalTerms = [];
    if (isTheoryQuestion) {
        technicalTerms = [
            'jvm', 'garbage', 'collection', 'heap', 'stack', 'thread', 'synchronization', 'concurrent',
            'performance', 'memory', 'algorithm', 'complexity', 'framework', 'spring', 'hibernate',
            'interface', 'abstract', 'inheritance', 'polymorphism', 'encapsulation', 'volatile',
            'atomic', 'deadlock', 'optimization', 'cache', 'transaction', 'annotation', 'reflection'
        ];
    } else {
        technicalTerms = [
            'class', 'method', 'function', 'variable', 'array', 'list', 'map', 'set', 'queue',
            'stack', 'tree', 'graph', 'sort', 'search', 'loop', 'recursion', 'iteration',
            'implementation', 'algorithm', 'complexity', 'optimization', 'data structure'
        ];
    }
    
    let technicalDepth = 0;
    technicalTerms.forEach(term => {
        if (answer.includes(term)) technicalDepth++;
    });
    
    const depthScore = Math.min(technicalDepth * (isTheoryQuestion ? 2 : 3), 25);
    
    // 4. Structure and examples bonus
    let structureBonus = 0;
    if (answer.includes("example") || answer.includes("for instance")) structureBonus += 5;
    if (answer.includes("1.") || answer.includes("2.") || answer.includes("first") || answer.includes("second")) structureBonus += 5;
    if (answer.includes("because") || answer.includes("therefore") || answer.includes("however")) structureBonus += 3;
    
    // 5. Calculate final score with different weightings for Part A vs Part B
    let keywordWeight, lengthWeight, depthWeight, structureWeight;
    
    if (isTheoryQuestion) {
        // Theory questions weight keywords and depth more heavily
        keywordWeight = 0.5;
        lengthWeight = 0.25;
        depthWeight = 0.2;
        structureWeight = 0.05;
    } else {
        // Coding questions weight practical implementation more
        keywordWeight = 0.4;
        lengthWeight = 0.3;
        depthWeight = 0.25;
        structureWeight = 0.05;
    }
    
    const rawScore = (keywordCoverage * keywordWeight) + 
                     (lengthScore * lengthWeight) + 
                     (depthScore * depthWeight) + 
                     (structureBonus * structureWeight);
    
    const maxScore = questionData.maxScore || 10;
    const normalizedScore = Math.min(Math.round(rawScore / 10 * maxScore), maxScore);
    
    // 6. Generate part-specific feedback
    let feedback = [];
    let detailedAnalysis = [];
    
    const partLabel = isTheoryQuestion ? "Part A (Theory)" : "Part B (Coding)";
    
    if (keywordCoverage >= 80) {
        feedback.push(`Excellent ${isTheoryQuestion ? 'conceptual' : 'technical'} coverage`);
        detailedAnalysis.push(`Strong ${partLabel} understanding (${keywordMatches}/${keywords.length} key concepts)`);
    } else if (keywordCoverage >= 60) {
        feedback.push(`Good ${isTheoryQuestion ? 'theoretical' : 'implementation'} knowledge`);
        detailedAnalysis.push(`Solid ${partLabel} grasp (${keywordMatches}/${keywords.length} key concepts)`);
    } else if (keywordCoverage >= 40) {
        feedback.push(`Basic ${isTheoryQuestion ? 'conceptual' : 'coding'} understanding`);
        detailedAnalysis.push(`Some ${partLabel} knowledge gaps (${keywordMatches}/${keywords.length} concepts found)`);
    } else {
        feedback.push(`Limited ${isTheoryQuestion ? 'theoretical' : 'practical'} knowledge`);
        detailedAnalysis.push(`Significant ${partLabel} knowledge gaps (only ${keywordMatches}/${keywords.length} concepts)`);
    }
    
    if (isTheoryQuestion) {
        if (wordCount >= 40) feedback.push("Comprehensive theoretical explanation");
        else if (wordCount >= 20) feedback.push("Adequate theoretical detail");
        else feedback.push("Needs more theoretical depth");
    } else {
        if (wordCount >= 30) feedback.push("Well-explained implementation approach");
        else if (wordCount >= 15) feedback.push("Basic implementation understanding");
        else feedback.push("Needs clearer implementation explanation");
    }
    
    if (technicalDepth >= 5) {
        feedback.push(`Good ${isTheoryQuestion ? 'theoretical' : 'technical'} depth`);
    } else if (technicalDepth >= 3) {
        feedback.push(`Moderate ${isTheoryQuestion ? 'conceptual' : 'technical'} content`);
    } else {
        feedback.push(`Needs more ${isTheoryQuestion ? 'theoretical' : 'technical'} detail`);
    }
    
    return {
        score: normalizedScore,
        maxScore: maxScore,
        percentage: Math.round((normalizedScore / maxScore) * 100),
        feedback: feedback.join(", "),
        keywordCoverage: Math.round(keywordCoverage),
        technicalDepth: technicalDepth,
        wordCount: wordCount,
        matchedKeywords: matchedKeywords,
        missingKeywords: missingKeywords,
        detailedAnalysis: detailedAnalysis.join(". "),
        part: questionData.part || 'Unknown',
        questionType: isTheoryQuestion ? 'Theory' : 'Coding'
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

// =====================================================
// API ENDPOINTS WITH ENHANCED PART A/B STRUCTURE
// =====================================================

// Get structured questions for interview (Part A + Part B)
app.get('/questions', (req, res) => {
    const theoryCount = parseInt(req.query.theoryCount) || 10;
    const codingCount = parseInt(req.query.codingCount) || 10;
    
    const structuredQuestions = getStructuredQuestions(theoryCount, codingCount);
    
    console.log(`🎯 Serving structured Java interview questions:`);
    console.log(`📚 Part A (Theory): ${structuredQuestions.partA.length} questions`);
    console.log(`💻 Part B (Coding): ${structuredQuestions.partB.length} questions`);
    console.log(`📊 Total Questions: ${structuredQuestions.totalQuestions}`);
    
    res.json({
        success: true,
        structure: structuredQuestions.structure,
        partA: structuredQuestions.partA,
        partB: structuredQuestions.partB,
        totalQuestions: structuredQuestions.totalQuestions,
        interviewFormat: {
            description: "Advanced Java Technical Interview - Two-Part Structure",
            parts: [
                {
                    part: "A",
                    title: "Theory & Conceptual Knowledge", 
                    questions: structuredQuestions.partA.length,
                    description: "Deep understanding of Java concepts, JVM internals, frameworks, and system design",
                    topics: structuredQuestions.structure.partA.topics
                },
                {
                    part: "B", 
                    title: "Practical Coding Challenges",
                    questions: structuredQuestions.partB.length,
                    description: "Hands-on coding problems, algorithms, data structures, and implementation skills",
                    topics: structuredQuestions.structure.partB.topics
                }
            ],
            scoringMethod: "AI-powered analysis with separate scoring for Part A (Theory) and Part B (Coding)",
            expectedDuration: "25-45 minutes total"
        }
    });
});

// Submit interview with enhanced Part A/B analysis
app.post('/interview/submit', async (req, res) => {
    const { candidateInfo, questions, answers, violations, duration, tabSwitchCount, terminated } = req.body;
    
    console.log(`🤖 AI analyzing Java interview for ${candidateInfo?.name || 'Unknown Candidate'}`);
    console.log(`📧 Email: ${candidateInfo?.email || 'N/A'}`);
    console.log(`💼 Position: ${candidateInfo?.position || 'N/A'}`);
    console.log(`⚠️ Violations: ${violations?.length || 0}`);
    console.log(`🔄 Tab switches: ${tabSwitchCount || 0}`);
    
    if (terminated) {
        console.log(`🚨 INTERVIEW WAS TERMINATED due to excessive violations!`);
    }
    
    let totalScore = 0;
    let maxPossibleScore = 0;
    let partAScore = 0, partAMax = 0, partACount = 0;
    let partBScore = 0, partBMax = 0, partBCount = 0;
    
    const detailedScores = [];
    const categoryScores = { 'Part A (Theory)': [], 'Part B (Coding)': [] };
    
    // Process each answer with enhanced AI analysis
    questions.forEach((question, index) => {
        const candidateAnswer = answers[index] || '';
        
        // Find the question data with reference answer
        const allQuestions = getAllQuestions();
        const questionData = allQuestions.find(q => 
            q.question === question.text || 
            (question.id && q.id === question.id)
        ) || question; // Use the question object itself as fallback
        
        const aiScore = calculateAIScore(questionData, candidateAnswer);
        totalScore += aiScore.score;
        maxPossibleScore += aiScore.maxScore;
        
        // Separate scoring by parts
        if (aiScore.part === 'A' || aiScore.questionType === 'Theory') {
            partAScore += aiScore.score;
            partAMax += aiScore.maxScore;
            partACount++;
            categoryScores['Part A (Theory)'].push(aiScore.percentage);
        } else {
            partBScore += aiScore.score;
            partBMax += aiScore.maxScore;
            partBCount++;
            categoryScores['Part B (Coding)'].push(aiScore.percentage);
        }
        
        detailedScores.push({
            questionIndex: index,
            question: question.text,
            candidateAnswer: candidateAnswer,
            aiScore: aiScore,
            part: aiScore.part,
            type: aiScore.questionType,
            topic: questionData.topic || 'Unknown'
        });
    });
    
    // Calculate category averages
    Object.keys(categoryScores).forEach(category => {
        const scores = categoryScores[category];
        if (scores.length > 0) {
            categoryScores[category] = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        } else {
            categoryScores[category] = 0;
        }
    });
    
    // Apply violation penalties
    const baseViolationPenalty = Math.min(violations.length * 2, 15);
    const tabSwitchPenalty = Math.min(tabSwitchCount * 3, 25);
    const terminationPenalty = terminated ? 30 : 0;
    
    const totalPenalty = baseViolationPenalty + tabSwitchPenalty + terminationPenalty;
    totalScore = Math.max(0, totalScore - totalPenalty);
    const finalPercentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
    
    // Calculate part-specific percentages
    const partAPercentage = partAMax > 0 ? Math.round((Math.max(0, partAScore - (totalPenalty * 0.5)) / partAMax) * 100) : 0;
    const partBPercentage = partBMax > 0 ? Math.round((Math.max(0, partBScore - (totalPenalty * 0.5)) / partBMax) * 100) : 0;
    
    // Determine interview status
    let interviewStatus = 'completed';
    if (terminated) {
        interviewStatus = 'terminated';
    } else if (tabSwitchCount >= 2) {
        interviewStatus = 'completed_with_violations';
    }
    
    // Enhanced interview data with Part A/B breakdown
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
        
        // Overall scores
        totalScore: totalScore,
        maxPossibleScore: maxPossibleScore,
        percentage: finalPercentage,
        
        // Part-specific scores
        partAResults: {
            score: Math.max(0, partAScore - (totalPenalty * 0.5)),
            maxScore: partAMax,
            percentage: partAPercentage,
            questionsCount: partACount,
            avgPerQuestion: partACount > 0 ? Math.round(partAScore / partACount) : 0
        },
        partBResults: {
            score: Math.max(0, partBScore - (totalPenalty * 0.5)),
            maxScore: partBMax,
            percentage: partBPercentage,
            questionsCount: partBCount,
            avgPerQuestion: partBCount > 0 ? Math.round(partBScore / partBCount) : 0
        },
        
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
        
        console.log(`🎯 Java Interview AI Scoring Complete for ${candidateInfo?.name}:`);
        console.log(`📊 Overall: ${totalScore}/${maxPossibleScore} (${finalPercentage}%)`);
        console.log(`📚 Part A (Theory): ${categoryScores['Part A (Theory)']}% (${partACount} questions)`);
        console.log(`💻 Part B (Coding): ${categoryScores['Part B (Coding)']}% (${partBCount} questions)`);
        console.log(`💸 Total penalties applied: ${totalPenalty} points`);
        
        res.json({
            message: terminated ? 'Java Interview terminated and analyzed by AI' : 'Java Interview analyzed by AI successfully',
            interviewId: savedInterview.id,
            
            // Overall results
            score: totalScore,
            maxScore: maxPossibleScore,
            percentage: finalPercentage,
            
            // Part-specific results
            partAScore: partAPercentage,
            partBScore: partBPercentage,
            theoryScore: categoryScores['Part A (Theory)'],
            codingScore: categoryScores['Part B (Coding)'],
            
            // Part breakdown details
            partAResults: interviewData.partAResults,
            partBResults: interviewData.partBResults,
            
            candidateInfo: candidateInfo,
            answers: answers,
            violations: violations,
            duration: duration,
            tabSwitchCount: tabSwitchCount,
            terminated: terminated || false,
            interviewStatus: interviewStatus,
            penalties: interviewData.penalties,
            
            // Enhanced feedback with part breakdown
            detailedFeedback: {
                partA: detailedScores
                    .filter(s => s.aiScore.part === 'A' || s.aiScore.questionType === 'Theory')
                    .map(s => ({
                        question: s.question.substring(0, 60) + '...',
                        topic: s.topic,
                        score: `${s.aiScore.score}/${s.aiScore.maxScore}`,
                        feedback: s.aiScore.feedback,
                        keywordCoverage: s.aiScore.keywordCoverage + '%'
                    })),
                partB: detailedScores
                    .filter(s => s.aiScore.part === 'B' || s.aiScore.questionType === 'Coding')
                    .map(s => ({
                        question: s.question.substring(0, 60) + '...',
                        topic: s.topic,
                        score: `${s.aiScore.score}/${s.aiScore.maxScore}`,
                        feedback: s.aiScore.feedback,
                        keywordCoverage: s.aiScore.keywordCoverage + '%'
                    }))
            },
            
            partSummary: {
                theoryStrength: partAPercentage >= partBPercentage ? "Theory knowledge is your stronger area" : "Focus on strengthening theoretical concepts",
                codingStrength: partBPercentage >= partAPercentage ? "Coding skills are your stronger area" : "Practice more coding problems",
                overallAssessment: finalPercentage >= 80 ? "Excellent Java knowledge" : 
                                 finalPercentage >= 65 ? "Good Java understanding with room for improvement" : 
                                 "Needs significant improvement in Java concepts and coding"
            }
        });
        
    } catch (error) {
        console.error('Error saving interview:', error);
        res.status(500).json({ error: 'Failed to save interview results' });
    }
});

// Enhanced admin endpoints
app.get('/admin/interviews', async (req, res) => {
    try {
        const interviews = await loadInterviews();
        const summary = interviews.map(interview => ({
            id: interview.id,
            timestamp: interview.timestamp,
            candidateName: interview.candidateInfo?.name || 'Unknown',
            email: interview.candidateInfo?.email || 'N/A',
            position: interview.candidateInfo?.position || 'N/A',
            
            // Overall score
            score: `${interview.totalScore}/${interview.maxPossibleScore} (${interview.percentage}%)`,
            
            // Part-specific scores
            partAScore: interview.partAResults?.percentage || interview.categoryScores?.['Part A (Theory)'] || 0,
            partBScore: interview.partBResults?.percentage || interview.categoryScores?.['Part B (Coding)'] || 0,
            
            // Question completion
            partAQuestions: interview.partAResults?.questionsCount || 0,
            partBQuestions: interview.partBResults?.questionsCount || 0,
            
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

app.get('/admin/stats', async (req, res) => {
    try {
        const interviews = await loadInterviews();
        
        const stats = {
            totalInterviews: interviews.length,
            completedInterviews: interviews.filter(i => i.interviewStatus === 'completed').length,
            terminatedInterviews: interviews.filter(i => i.terminated === true).length,
            interviewsWithViolations: interviews.filter(i => (i.violations?.length || 0) > 0).length,
            
            // Overall averages
            averageScore: interviews.length > 0 ? Math.round(interviews.reduce((sum, i) => sum + (i.percentage || 0), 0) / interviews.length) : 0,
            
            // Part-specific averages
            averagePartAScore: interviews.length > 0 ? Math.round(interviews.reduce((sum, i) => 
                sum + (i.partAResults?.percentage || i.categoryScores?.['Part A (Theory)'] || 0), 0) / interviews.length) : 0,
            averagePartBScore: interviews.length > 0 ? Math.round(interviews.reduce((sum, i) => 
                sum + (i.partBResults?.percentage || i.categoryScores?.['Part B (Coding)'] || 0), 0) / interviews.length) : 0,
            
            // Legacy compatibility
            averageTheoryScore: interviews.length > 0 ? Math.round(interviews.reduce((sum, i) => 
                sum + (i.categoryScores?.['Part A (Theory)'] || 0), 0) / interviews.length) : 0,
            averageCodingScore: interviews.length > 0 ? Math.round(interviews.reduce((sum, i) => 
                sum + (i.categoryScores?.['Part B (Coding)'] || 0), 0) / interviews.length) : 0,
            
            // Security stats
            averageViolations: interviews.length > 0 ? Math.round(interviews.reduce((sum, i) => sum + (i.violations?.length || 0), 0) / interviews.length * 10) / 10 : 0,
            averageTabSwitches: interviews.length > 0 ? Math.round(interviews.reduce((sum, i) => sum + (i.tabSwitchCount || 0), 0) / interviews.length * 10) / 10 : 0,
            
            // Question pool stats
            totalTheoryQuestions: theoryQuestions.length,
            totalCodingQuestions: codingQuestions.length,
            totalQuestionPool: theoryQuestions.length + codingQuestions.length
        };
        
        res.json(stats);
    } catch (error) {
        console.error('Error loading statistics:', error);
        res.status(500).json({ error: 'Failed to load statistics' });
    }
});

// Enhanced admin dashboard
app.get('/admin', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Admin Dashboard - Enhanced Java Interview Platform</title>
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
                    margin-bottom: 10px;
                }
                .stat-number.theory { color: #3498db; }
                .stat-number.coding { color: #e74c3c; }
                .stat-number.overall { color: #27ae60; }
                .stat-number.total { color: #f39c12; }
                .stat-label {
                    color: #7f8c8d;
                    font-weight: 500;
                }
                .info-banner {
                    background: linear-gradient(135deg, #e8f5e8, #d5f4e6);
                    border: 2px solid #27ae60;
                    border-radius: 15px;
                    padding: 20px;
                    margin-bottom: 30px;
                    text-align: center;
                }
                .question-stats {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin: 20px 0;
                }
                .question-stat-card {
                    background: rgba(255,255,255,0.9);
                    border-radius: 10px;
                    padding: 15px;
                    text-align: center;
                }
                .part-a { border-left: 4px solid #3498db; }
                .part-b { border-left: 4px solid #e74c3c; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🎯 Enhanced Java Interview Platform - Admin Dashboard</h1>
                <p>Advanced Java Technical Assessment with AI Analysis & Part A/B Structure</p>
                <div style="margin-top: 15px; font-size: 14px; opacity: 0.9;">
                    Part A: Theory & Conceptual Knowledge | Part B: Practical Coding Challenges
                </div>
            </div>
            
            <div class="container">
                <div class="info-banner">
                    <h3 style="color: #27ae60; margin-bottom: 15px;">📚 Enhanced Interview Structure</h3>
                    <div class="question-stats">
                        <div class="question-stat-card part-a">
                            <h4 style="color: #3498db; margin-bottom: 10px;">📖 Part A: Theory & Conceptual</h4>
                            <p style="font-size: 24px; font-weight: bold; color: #2c3e50;">${theoryQuestions.length} Questions Available</p>
                            <p style="color: #7f8c8d; margin: 5px 0;">JVM Internals, Concurrency, Frameworks, System Design</p>
                            <div style="font-size: 12px; color: #95a5a6; margin-top: 8px;">
                                Advanced Java concepts & theoretical knowledge
                            </div>
                        </div>
                        <div class="question-stat-card part-b">
                            <h4 style="color: #e74c3c; margin-bottom: 10px;">💻 Part B: Practical Coding</h4>
                            <p style="font-size: 24px; font-weight: bold; color: #2c3e50;">${codingQuestions.length} Questions Available</p>
                            <p style="color: #7f8c8d; margin: 5px 0;">Algorithms, Data Structures, Design Patterns</p>
                            <div style="font-size: 12px; color: #95a5a6; margin-top: 8px;">
                                Hands-on coding problems & implementation
                            </div>
                        </div>
                    </div>
                    <div style="background: rgba(255,255,255,0.8); border-radius: 10px; padding: 15px; margin-top: 15px;">
                        <p style="color: #27ae60; margin: 0; font-weight: bold;">
                            📊 Each candidate answers 10 theory + 10 coding questions (20 total)<br>
                            🤖 Separate AI scoring for Part A (Theory) and Part B (Coding) performance
                        </p>
                    </div>
                </div>
                
                <div class="stats-grid" id="statsGrid">
                    <div class="stat-card">
                        <div class="stat-number total" id="totalInterviews">0</div>
                        <div class="stat-label">Total Java Interviews</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number overall" id="completedInterviews">0</div>
                        <div class="stat-label">Completed Successfully</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number theory" id="averageTheoryScore">0%</div>
                        <div class="stat-label">Average Part A (Theory) Score</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number coding" id="averageCodingScore">0%</div>
                        <div class="stat-label">Average Part B (Coding) Score</div>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
                    <a href="/admin/interviews" style="background: #3498db; color: white; text-decoration: none; padding: 15px 20px; border-radius: 8px; text-align: center; font-weight: bold; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px;">📊 View All Interviews</a>
                    <a href="/admin/stats" style="background: #27ae60; color: white; text-decoration: none; padding: 15px 20px; border-radius: 8px; text-align: center; font-weight: bold; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px;">📈 Detailed Statistics</a>
                    <a href="/health" style="background: #f39c12; color: white; text-decoration: none; padding: 15px 20px; border-radius: 8px; text-align: center; font-weight: bold; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px;">💚 System Health</a>
                    <a href="/" style="background: #9b59b6; color: white; text-decoration: none; padding: 15px 20px; border-radius: 8px; text-align: center; font-weight: bold; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px;">🏠 Interview Portal</a>
                </div>
            </div>
            
            <script>
                console.log('🎯 Enhanced Java Interview Admin Dashboard Loaded');
                console.log('📚 Part A (Theory) Questions: ${theoryQuestions.length}');
                console.log('💻 Part B (Coding) Questions: ${codingQuestions.length}');
                console.log('🤖 Enhanced AI scoring with separate Part A/B analysis');
            </script>
        </body>
        </html>
    `);
});

app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date(),
        platform: 'Enhanced Java Interview Platform with Part A/B Structure',
        version: '4.0.0',
        totalQuestions: theoryQuestions.length + codingQuestions.length,
        questionStructure: {
            'Part A (Theory)': {
                count: theoryQuestions.length,
                description: 'Advanced Java concepts, JVM internals, concurrency, frameworks, and system design',
                topics: ['JVM Internals & Memory', 'Concurrency & Performance', 'Advanced Java 8+ Features', 'Frameworks & Persistence', 'System Design & Scalability', 'JVM & Tooling']
            },
            'Part B (Coding)': {
                count: codingQuestions.length,
                description: 'Practical coding problems, algorithms, data structures, and implementation skills',
                topics: ['Arrays & Strings', 'Collections & Data Structures', 'Algorithms', 'OOP & Design Patterns', 'Concurrency & File Handling', 'Problem Solving']
            }
        },
        features: [
            'Enhanced Part A/B interview structure (Theory + Coding)',
            'Advanced Java Q&A pool (50 Theory + 50 Coding questions)',
            'AI-powered scoring with separate Part A/B analysis',
            'Part transition indicators and progress tracking',
            'Enhanced security monitoring with violation penalties',
            'Professional UI with clear part distinctions',
            'Comprehensive admin dashboard with part-specific analytics',
            'Thread-safe implementation examples',
            'Advanced algorithm implementations',
            'System design coding challenges'
        ],
        interviewFlow: [
            '1. Candidate registration with Part A/B structure explanation',
            '2. Part A: 10 Theory & Conceptual Knowledge questions',
            '3. Transition screen between parts',
            '4. Part B: 10 Practical Coding Challenge questions',
            '5. AI analysis with separate Part A/B scoring',
            '6. Comprehensive results with strengths analysis'
        ]
    });
});

// Serve the enhanced interview page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'interview-dashboard.html'));
});

// ==================== SERVER STARTUP ====================
app.listen(PORT, async () => {
    await initStorage();
    
    console.log('🚀 Enhanced Java Interview Platform v4.0 - READY!');
    console.log('=====================================================');
    console.log(`📍 Server: http://localhost:${PORT}`);
    console.log(`📚 Total Question Pool: ${theoryQuestions.length + codingQuestions.length}`);
    console.log(`📖 Part A (Theory): ${theoryQuestions.length} questions`);
    console.log(`💻 Part B (Coding): ${codingQuestions.length} questions`);
    console.log(`🎯 Interview Structure: 10 Theory + 10 Coding = 20 questions per interview`);
    console.log(`🤖 Enhanced AI Features: Separate Part A/B scoring with detailed analysis`);
    console.log(`🛡️ Security: Tab detection, violation penalties, termination after 3 violations`);
    console.log(`💾 Storage: Auto-save with individual interview files and part breakdowns`);
    console.log('');
    console.log('🌐 Available URLs:');
    console.log(`🏠 Interview Portal:     http://localhost:${PORT}/`);
    console.log(`👨‍💼 Admin Dashboard:      http://localhost:${PORT}/admin`);
    console.log(`📊 All Interviews:       http://localhost:${PORT}/admin/interviews`);
    console.log(`📈 Statistics:           http://localhost:${PORT}/admin/stats`);
    console.log(`💚 Health Check:         http://localhost:${PORT}/health`);
    console.log('');
    console.log('✨ Enhanced Java Interview Structure:');
    console.log('• 📚 Part A: 50 Theory Questions Available (JVM, Concurrency, Frameworks, System Design)');
    console.log('• 💻 Part B: 50 Coding Questions Available (Algorithms, Data Structures, Design Patterns)');
    console.log('• 🎯 Each Interview: 10 from Part A + 10 from Part B = 20 questions total');
    console.log('• 🤖 Enhanced AI scoring with separate Part A (Theory) and Part B (Coding) analysis');
    console.log('• 📊 Part-specific performance tracking and feedback');
    console.log('• 🔄 Smooth Part A to Part B transition with progress indicators');
    console.log('• 📱 Mobile-responsive design with clear part distinctions');
    console.log('• 👨‍💼 Advanced admin panel with Part A/B breakdown analytics');
    console.log('');
    console.log('🎯 Ready to conduct comprehensive Part A/B Java technical interviews!');
    console.log('=====================================================');
});

module.exports = app;  
