import { RoadmapData } from './codingJourneyTypes';

export interface Subsection {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  estimatedHours: number;
  resources: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  projects: {
    beginner: Array<{
      title: string;
      description: string;
      technologies: string[];
      githubUrl?: string;
      liveUrl?: string;
    }>;
    intermediate: Array<{
      title: string;
      description: string;
      technologies: string[];
      githubUrl?: string;
      liveUrl?: string;
    }>;
    advanced: Array<{
      title: string;
      description: string;
      technologies: string[];
      githubUrl?: string;
      liveUrl?: string;
    }>;
  };
}

export const roadmapData: RoadmapData = {
  sections: [
    {
      id: 'fundamentals',
      title: 'Programming Fundamentals',
      description: 'Master the core concepts that every software engineer needs',
      icon: '💻',
      color: 'bg-blue-500',
      completed: false,
      order: 1,
      estimatedTotalHours: 120,
      subsections: [
        {
          id: 'variables-types',
          title: 'Variables, Data Types & Operators',
          description: 'Understanding variables, primitive types, and basic operations',
          completed: false,
          estimatedHours: 16,
          difficulty: 'beginner',
          resources: ['MDN Web Docs', 'JavaScript.info', 'Eloquent JavaScript'],
          projects: {
            beginner: [
              {
                title: 'Personal Portfolio Calculator',
                description: 'Build a calculator that stores calculation history and displays it in a portfolio-style interface',
                technologies: ['HTML', 'CSS', 'JavaScript', 'Local Storage']
              },
              {
                title: 'Type Converter Tool',
                description: 'Create a tool that converts between different data types with real-time validation',
                technologies: ['JavaScript', 'DOM Manipulation', 'Type Checking']
              }
            ],
            intermediate: [
              {
                title: 'Advanced Calculator with Memory Functions',
                description: 'Scientific calculator with memory storage, history, and advanced mathematical operations',
                technologies: ['JavaScript', 'Math Object', 'Local Storage', 'CSS Grid']
              },
              {
                title: 'Data Type Validator Library',
                description: 'Build a library for validating and converting data types with custom validation rules',
                technologies: ['JavaScript', 'Classes', 'Error Handling', 'Unit Testing']
              },
              {
                title: 'Expression Parser & Evaluator',
                description: 'Parse mathematical expressions and evaluate them with proper operator precedence',
                technologies: ['JavaScript', 'Parsing', 'Stack Data Structure', 'Operator Precedence']
              }
            ],
            advanced: [
              {
                title: 'TypeScript Compiler for JavaScript',
                description: 'Build a mini-compiler that adds type checking to JavaScript code',
                technologies: ['JavaScript', 'AST Parsing', 'Type System', 'Compiler Design']
              },
              {
                title: 'Dynamic Type System Implementation',
                description: 'Implement a runtime type system with type inference and validation',
                technologies: ['JavaScript', 'Reflection', 'Type Inference', 'Runtime Validation']
              },
              {
                title: 'Operator Overloading System',
                description: 'Create a system that allows custom operator behavior for custom data types',
                technologies: ['JavaScript', 'Proxy Objects', 'Symbols', 'Operator Overloading']
              },
              {
                title: 'Memory-Efficient Data Structure Library',
                description: 'Build optimized data structures with memory management and garbage collection awareness',
                technologies: ['JavaScript', 'Memory Management', 'Data Structures', 'Performance Optimization']
              },
              {
                title: 'Real-time Data Type Analyzer',
                description: 'Analyze data types in real-time with performance metrics and optimization suggestions',
                technologies: ['JavaScript', 'Performance Monitoring', 'Type Analysis', 'Real-time Processing']
              }
            ]
          }
        },
        {
          id: 'control-flow',
          title: 'Control Flow & Logic',
          description: 'Conditionals, loops, and logical operators',
          completed: false,
          estimatedHours: 20,
          difficulty: 'beginner',
          resources: ['MDN Web Docs', 'JavaScript.info', 'Eloquent JavaScript'],
          projects: {
            beginner: [
              {
                title: 'Interactive Quiz Game',
                description: 'Build a quiz game with multiple choice questions and score tracking',
                technologies: ['JavaScript', 'Arrays', 'Conditionals', 'DOM Manipulation']
              },
              {
                title: 'Number Guessing Game',
                description: 'Create a game where users guess numbers with hints and attempt counting',
                technologies: ['JavaScript', 'Loops', 'Random Numbers', 'User Input']
              }
            ],
            intermediate: [
              {
                title: 'State Machine Implementation',
                description: 'Implement a state machine for managing complex application states',
                technologies: ['JavaScript', 'State Management', 'Event Handling', 'Design Patterns']
              },
              {
                title: 'Workflow Engine',
                description: 'Build a workflow engine that can execute conditional business logic',
                technologies: ['JavaScript', 'Business Logic', 'Conditional Execution', 'Rule Engine']
              },
              {
                title: 'Decision Tree Classifier',
                description: 'Create a decision tree algorithm for classification problems',
                technologies: ['JavaScript', 'Machine Learning', 'Decision Trees', 'Data Processing']
              }
            ],
            advanced: [
              {
                title: 'Concurrent Task Scheduler',
                description: 'Build a scheduler that manages concurrent tasks with priority and dependencies',
                technologies: ['JavaScript', 'Concurrency', 'Task Scheduling', 'Priority Queues']
              },
              {
                title: 'Event-Driven Architecture Framework',
                description: 'Create a framework for building event-driven applications with complex event routing',
                technologies: ['JavaScript', 'Event Architecture', 'Message Queues', 'Pattern Matching']
              },
              {
                title: 'Business Rules Engine',
                description: 'Implement a rules engine that can evaluate complex business logic with multiple conditions',
                technologies: ['JavaScript', 'Rule Engine', 'Business Logic', 'Expression Evaluation']
              },
              {
                title: 'Workflow Orchestration System',
                description: 'Build a system that orchestrates complex workflows with conditional branching and error handling',
                technologies: ['JavaScript', 'Workflow Management', 'Error Handling', 'Conditional Logic']
              },
              {
                title: 'Intelligent Decision Support System',
                description: 'Create a system that makes intelligent decisions based on multiple criteria and historical data',
                technologies: ['JavaScript', 'Decision Making', 'Data Analysis', 'Machine Learning']
              }
            ]
          }
        },
        {
          id: 'functions',
          title: 'Functions & Scope',
          description: 'Function declarations, expressions, closures, and scope',
          completed: false,
          estimatedHours: 24,
          difficulty: 'beginner',
          resources: ['MDN Web Docs', 'JavaScript.info', 'Eloquent JavaScript'],
          projects: {
            beginner: [
              {
                title: 'Function Library Collection',
                description: 'Create a collection of useful utility functions for common tasks',
                technologies: ['JavaScript', 'Functions', 'Utility Functions', 'Documentation']
              },
              {
                title: 'Simple Calculator Functions',
                description: 'Build a calculator using separate functions for each operation',
                technologies: ['JavaScript', 'Function Parameters', 'Return Values', 'Math Operations']
              }
            ],
            intermediate: [
              {
                title: 'Higher-Order Function Library',
                description: 'Implement map, filter, reduce, and other higher-order functions',
                technologies: ['JavaScript', 'Higher-Order Functions', 'Array Methods', 'Functional Programming']
              },
              {
                title: 'Function Composition Tool',
                description: 'Build a tool that composes multiple functions into a single function',
                technologies: ['JavaScript', 'Function Composition', 'Currying', 'Pipeline Pattern']
              },
              {
                title: 'Memoization Framework',
                description: 'Create a framework for memoizing expensive function calls',
                technologies: ['JavaScript', 'Memoization', 'Caching', 'Performance Optimization']
              }
            ],
            advanced: [
              {
                title: 'Aspect-Oriented Programming Framework',
                description: 'Implement AOP with function decorators, before/after advice, and pointcuts',
                technologies: ['JavaScript', 'AOP', 'Decorators', 'Function Interception']
              },
              {
                title: 'Function Hot-Reloading System',
                description: 'Build a system that can hot-reload functions without restarting the application',
                technologies: ['JavaScript', 'Hot Reloading', 'Function Replacement', 'Runtime Modification']
              },
              {
                title: 'Distributed Function Execution Engine',
                description: 'Create an engine that can execute functions across multiple nodes',
                technologies: ['JavaScript', 'Distributed Computing', 'Function Distribution', 'Load Balancing']
              },
              {
                title: 'Function Performance Profiler',
                description: 'Build a profiler that analyzes function performance and provides optimization suggestions',
                technologies: ['JavaScript', 'Performance Profiling', 'Function Analysis', 'Optimization']
              },
              {
                title: 'Reactive Function Framework',
                description: 'Implement a reactive system where functions automatically re-execute when dependencies change',
                technologies: ['JavaScript', 'Reactive Programming', 'Dependency Tracking', 'Automatic Updates']
              }
            ]
          }
        },
        {
          id: 'data-structures',
          title: 'Data Structures',
          description: 'Arrays, objects, sets, maps, and custom data structures',
          completed: false,
          estimatedHours: 28,
          difficulty: 'intermediate',
          resources: ['MDN Web Docs', 'JavaScript.info', 'Eloquent JavaScript'],
          projects: {
            beginner: [
              {
                title: 'Personal Contact Manager',
                description: 'Build a contact manager using objects and arrays with CRUD operations',
                technologies: ['JavaScript', 'Objects', 'Arrays', 'CRUD Operations', 'Local Storage']
              },
              {
                title: 'Shopping Cart System',
                description: 'Create a shopping cart using arrays and objects with quantity management',
                technologies: ['JavaScript', 'Arrays', 'Objects', 'Quantity Management', 'Total Calculation']
              }
            ],
            intermediate: [
              {
                title: 'Custom Array Implementation',
                description: 'Implement your own array class with methods like push, pop, shift, unshift',
                technologies: ['JavaScript', 'Classes', 'Array Methods', 'Data Structure Implementation']
              },
              {
                title: 'Hash Table Implementation',
                description: 'Build a hash table data structure with collision handling',
                technologies: ['JavaScript', 'Hash Tables', 'Collision Resolution', 'Hash Functions']
              },
              {
                title: 'Binary Search Tree',
                description: 'Implement a binary search tree with insertion, deletion, and traversal',
                technologies: ['JavaScript', 'Binary Trees', 'Tree Traversal', 'Recursion']
              }
            ],
            advanced: [
              {
                title: 'Graph Database Implementation',
                description: 'Build a graph database with nodes, edges, and graph algorithms',
                technologies: ['JavaScript', 'Graph Theory', 'Graph Algorithms', 'Database Design']
              },
              {
                title: 'B-Tree Implementation',
                description: 'Implement a B-tree data structure for efficient disk-based storage',
                technologies: ['JavaScript', 'B-Trees', 'Disk Storage', 'Balanced Trees']
              },
              {
                title: 'Skip List Data Structure',
                description: 'Create a skip list with logarithmic time complexity for search operations',
                technologies: ['JavaScript', 'Skip Lists', 'Randomized Algorithms', 'Logarithmic Complexity']
              },
              {
                title: 'Persistent Data Structures',
                description: 'Implement immutable data structures that preserve previous versions',
                technologies: ['JavaScript', 'Immutability', 'Version Control', 'Memory Efficiency']
              },
              {
                title: 'Distributed Data Structure Framework',
                description: 'Build a framework for distributed data structures across multiple nodes',
                technologies: ['JavaScript', 'Distributed Systems', 'Data Consistency', 'Network Communication']
              }
            ]
          }
        },
        {
          id: 'algorithms-basic',
          title: 'Basic Algorithms',
          description: 'Sorting, searching, and basic algorithm patterns',
          completed: false,
          estimatedHours: 32,
          difficulty: 'intermediate',
          resources: ['MDN Web Docs', 'JavaScript.info', 'Eloquent JavaScript'],
          projects: {
            beginner: [
              {
                title: 'Sorting Algorithm Visualizer',
                description: 'Create a visual representation of different sorting algorithms',
                technologies: ['JavaScript', 'Canvas API', 'Sorting Algorithms', 'Animation']
              },
              {
                title: 'Search Algorithm Comparison',
                description: 'Build a tool that compares linear and binary search performance',
                technologies: ['JavaScript', 'Search Algorithms', 'Performance Measurement', 'Data Visualization']
              }
            ],
            intermediate: [
              {
                title: 'Algorithm Performance Benchmarker',
                description: 'Create a benchmarking tool for comparing algorithm performance',
                technologies: ['JavaScript', 'Performance Testing', 'Benchmarking', 'Statistical Analysis']
              },
              {
                title: 'Custom Sorting Algorithm',
                description: 'Implement your own sorting algorithm with optimization',
                technologies: ['JavaScript', 'Algorithm Design', 'Optimization', 'Performance Analysis']
              },
              {
                title: 'Pathfinding Algorithm Implementation',
                description: 'Build pathfinding algorithms like Dijkstra and A*',
                technologies: ['JavaScript', 'Graph Algorithms', 'Pathfinding', 'Priority Queues']
              }
            ],
            advanced: [
              {
                title: 'Machine Learning Algorithm Library',
                description: 'Implement common ML algorithms like k-means clustering and linear regression',
                technologies: ['JavaScript', 'Machine Learning', 'Statistical Algorithms', 'Data Processing']
              },
              {
                title: 'Cryptographic Algorithm Suite',
                description: 'Build a suite of cryptographic algorithms for security applications',
                technologies: ['JavaScript', 'Cryptography', 'Security', 'Algorithm Implementation']
              },
              {
                title: 'Parallel Algorithm Framework',
                description: 'Create a framework for parallel algorithm execution using Web Workers',
                technologies: ['JavaScript', 'Parallel Computing', 'Web Workers', 'Algorithm Parallelization']
              },
              {
                title: 'Genetic Algorithm Engine',
                description: 'Implement a genetic algorithm framework for optimization problems',
                technologies: ['JavaScript', 'Genetic Algorithms', 'Evolutionary Computing', 'Optimization']
              },
              {
                title: 'Distributed Algorithm Coordinator',
                description: 'Build a system that coordinates algorithms across multiple distributed nodes',
                technologies: ['JavaScript', 'Distributed Computing', 'Algorithm Coordination', 'Network Communication']
              }
            ]
          }
        },
        {
          id: 'error-handling',
          title: 'Error Handling & Debugging',
          description: 'Try-catch blocks, error types, and debugging techniques',
          completed: false,
          estimatedHours: 16,
          difficulty: 'intermediate',
          resources: ['MDN Web Docs', 'JavaScript.info', 'Eloquent JavaScript'],
          projects: {
            beginner: [
              {
                title: 'Error Logger Application',
                description: 'Build an application that logs and displays errors in a user-friendly way',
                technologies: ['JavaScript', 'Error Handling', 'Logging', 'User Interface']
              },
              {
                title: 'Form Validation with Error Messages',
                description: 'Create a form with comprehensive error handling and user feedback',
                technologies: ['JavaScript', 'Form Validation', 'Error Messages', 'User Experience']
              }
            ],
            intermediate: [
              {
                title: 'Global Error Handler',
                description: 'Implement a global error handler that catches and processes all errors',
                technologies: ['JavaScript', 'Global Error Handling', 'Error Processing', 'Error Reporting']
              },
              {
                title: 'Error Recovery System',
                description: 'Build a system that can recover from errors and continue execution',
                technologies: ['JavaScript', 'Error Recovery', 'Fault Tolerance', 'System Resilience']
              },
              {
                title: 'Error Analytics Dashboard',
                description: 'Create a dashboard that analyzes error patterns and provides insights',
                technologies: ['JavaScript', 'Error Analytics', 'Data Visualization', 'Pattern Recognition']
              }
            ],
            advanced: [
              {
                title: 'Predictive Error Prevention System',
                description: 'Build a system that predicts and prevents errors before they occur',
                technologies: ['JavaScript', 'Predictive Analytics', 'Machine Learning', 'Error Prevention']
              },
              {
                title: 'Distributed Error Tracking System',
                description: 'Create a system that tracks errors across multiple distributed services',
                technologies: ['JavaScript', 'Distributed Systems', 'Error Tracking', 'Service Monitoring']
              },
              {
                title: 'Automated Error Resolution Engine',
                description: 'Implement an engine that automatically resolves common errors',
                technologies: ['JavaScript', 'Automation', 'Error Resolution', 'Self-Healing Systems']
              },
              {
                title: 'Error Pattern Recognition AI',
                description: 'Build an AI system that recognizes error patterns and suggests solutions',
                technologies: ['JavaScript', 'AI/ML', 'Pattern Recognition', 'Error Analysis']
              },
              {
                title: 'Real-time Error Monitoring Platform',
                description: 'Create a platform that monitors errors in real-time with alerting and escalation',
                technologies: ['JavaScript', 'Real-time Monitoring', 'Alerting Systems', 'Escalation Management']
              }
            ]
          }
        },
        {
          id: 'testing-basics',
          title: 'Testing Fundamentals',
          description: 'Unit testing, test-driven development, and testing frameworks',
          completed: false,
          estimatedHours: 20,
          difficulty: 'intermediate',
          resources: ['MDN Web Docs', 'JavaScript.info', 'Eloquent JavaScript'],
          projects: {
            beginner: [
              {
                title: 'Simple Test Runner',
                description: 'Build a basic test runner that can execute simple test cases',
                technologies: ['JavaScript', 'Test Runner', 'Test Execution', 'Assertions']
              },
              {
                title: 'Calculator Test Suite',
                description: 'Create comprehensive tests for a calculator application',
                technologies: ['JavaScript', 'Unit Testing', 'Test Coverage', 'Test Cases']
              }
            ],
            intermediate: [
              {
                title: 'Mocking Framework',
                description: 'Implement a mocking framework for creating test doubles',
                technologies: ['JavaScript', 'Mocking', 'Test Doubles', 'Dependency Injection']
              },
              {
                title: 'Test Coverage Reporter',
                description: 'Build a tool that reports test coverage and identifies untested code',
                technologies: ['JavaScript', 'Code Coverage', 'Coverage Analysis', 'Reporting']
              },
              {
                title: 'Performance Testing Framework',
                description: 'Create a framework for testing application performance',
                technologies: ['JavaScript', 'Performance Testing', 'Benchmarking', 'Performance Metrics']
              }
            ],
            advanced: [
              {
                title: 'Visual Regression Testing Platform',
                description: 'Build a platform that detects visual changes in UI components',
                technologies: ['JavaScript', 'Visual Testing', 'Image Comparison', 'UI Testing']
              },
              {
                title: 'Contract Testing Framework',
                description: 'Implement a framework for testing API contracts between services',
                technologies: ['JavaScript', 'Contract Testing', 'API Testing', 'Service Integration']
              },
              {
                title: 'Load Testing Orchestrator',
                description: 'Create a system that orchestrates load tests across multiple environments',
                technologies: ['JavaScript', 'Load Testing', 'Test Orchestration', 'Distributed Testing']
              },
              {
                title: 'AI-Powered Test Generation',
                description: 'Build an AI system that automatically generates test cases',
                technologies: ['JavaScript', 'AI/ML', 'Test Generation', 'Automated Testing']
              },
              {
                title: 'Continuous Testing Pipeline',
                description: 'Implement a pipeline that continuously runs tests and provides feedback',
                technologies: ['JavaScript', 'CI/CD', 'Continuous Testing', 'Pipeline Automation']
              }
            ]
          }
        },
        {
          id: 'version-control',
          title: 'Version Control with Git',
          description: 'Git basics, branching, merging, and collaboration',
          completed: false,
          estimatedHours: 16,
          difficulty: 'beginner',
          resources: ['Git Documentation', 'GitHub Guides', 'Pro Git Book'],
          projects: {
            beginner: [
              {
                title: 'Personal Project Repository',
                description: 'Create a well-structured repository for a personal project with proper commits',
                technologies: ['Git', 'GitHub', 'Repository Management', 'Commit History']
              },
              {
                title: 'Collaborative Documentation Site',
                description: 'Build a documentation site that multiple people can contribute to via Git',
                technologies: ['Git', 'Collaboration', 'Documentation', 'Pull Requests']
              }
            ],
            intermediate: [
              {
                title: 'Git Workflow Automation',
                description: 'Create scripts and hooks to automate common Git workflows',
                technologies: ['Git Hooks', 'Shell Scripting', 'Workflow Automation', 'CI/CD']
              },
              {
                title: 'Branch Management Dashboard',
                description: 'Build a dashboard for managing Git branches and visualizing branch relationships',
                technologies: ['Git', 'Web Dashboard', 'Branch Visualization', 'Management Tools']
              },
              {
                title: 'Code Review Automation Tool',
                description: 'Create a tool that automates parts of the code review process',
                technologies: ['Git', 'Code Review', 'Automation', 'Quality Assurance']
              }
            ],
            advanced: [
              {
                title: 'Distributed Git Workflow System',
                description: 'Implement a system for managing Git workflows across distributed teams',
                technologies: ['Git', 'Distributed Systems', 'Workflow Management', 'Team Coordination']
              },
              {
                title: 'Git Performance Optimization Engine',
                description: 'Build an engine that optimizes Git operations for large repositories',
                technologies: ['Git', 'Performance Optimization', 'Large Repositories', 'Efficiency']
              },
              {
                title: 'Git Security and Access Control',
                description: 'Create a comprehensive security system for Git repositories',
                technologies: ['Git', 'Security', 'Access Control', 'Authentication']
              },
              {
                title: 'Git Analytics and Insights Platform',
                description: 'Build a platform that provides deep insights into Git repository activity',
                technologies: ['Git', 'Analytics', 'Data Mining', 'Insights Generation']
              },
              {
                title: 'Git Integration Framework',
                description: 'Create a framework for integrating Git with other development tools',
                technologies: ['Git', 'API Integration', 'Tool Integration', 'Framework Development']
              }
            ]
          }
        },
        {
          id: 'types-basics',
          title: 'Basic Types & Interfaces',
          description: 'Primitive types, interfaces, type aliases',
          completed: false,
          estimatedHours: 16,
          difficulty: 'intermediate',
          resources: ['TypeScript Handbook', 'TypeScript Deep Dive', 'Official Documentation'],
          projects: {
            beginner: [
              {
                title: 'Type-Safe Calculator',
                description: 'Build a calculator with strict TypeScript types for all operations',
                technologies: ['TypeScript', 'Basic Types', 'Interfaces', 'Type Safety', 'Calculator Logic']
              },
              {
                title: 'User Management System',
                description: 'Create a simple user management system with typed interfaces',
                technologies: ['TypeScript', 'Interfaces', 'Type Aliases', 'CRUD Operations', 'Data Modeling']
              }
            ],
            intermediate: [
              {
                title: 'Generic Data Container',
                description: 'Implement a generic container class that can hold different types of data',
                technologies: ['TypeScript', 'Generics', 'Generic Constraints', 'Type Parameters', 'Container Classes']
              },
              {
                title: 'Type-Safe API Client',
                description: 'Build an API client with typed request/response interfaces',
                technologies: ['TypeScript', 'API Types', 'HTTP Client', 'Type Safety', 'Interface Design']
              },
              {
                title: 'Validation Library',
                description: 'Create a validation library with TypeScript types for different validation rules',
                technologies: ['TypeScript', 'Validation', 'Type Guards', 'Custom Types', 'Library Development']
              }
            ],
            advanced: [
              {
                title: 'Advanced Type System',
                description: 'Implement a custom type system with complex type relationships',
                technologies: ['TypeScript', 'Advanced Types', 'Type System Design', 'Complex Types', 'Type Theory']
              },
              {
                title: 'Runtime Type Checking Framework',
                description: 'Build a framework that provides runtime type checking based on TypeScript types',
                technologies: ['TypeScript', 'Runtime Validation', 'Type Checking', 'Reflection', 'Runtime Types']
              },
              {
                title: 'Type-Safe ORM Implementation',
                description: 'Create an ORM with full TypeScript type safety and query building',
                technologies: ['TypeScript', 'ORM', 'Database Types', 'Query Building', 'Type Safety']
              },
              {
                title: 'Advanced Interface Composition',
                description: 'Implement a system for composing complex interfaces from simpler ones',
                technologies: ['TypeScript', 'Interface Composition', 'Mixin Patterns', 'Interface Merging', 'Advanced Patterns']
              },
              {
                title: 'Type-Safe Event System',
                description: 'Build an event system with typed event handlers and payloads',
                technologies: ['TypeScript', 'Event Systems', 'Type Safety', 'Event Handling', 'Generic Events']
              }
            ]
          }
        }
      ]
    },
    {
      id: 'css-mastery',
      title: 'CSS & Styling Mastery',
      description: 'Master modern CSS, responsive design, and styling frameworks',
      icon: '🎨',
      color: 'bg-purple-500',
      completed: false,
      order: 2,
      estimatedTotalHours: 140,
      subsections: [
        {
          id: 'css-fundamentals',
          title: 'CSS Fundamentals & Layout',
          description: 'CSS basics, selectors, box model, and layout techniques',
          completed: false,
          estimatedHours: 20,
          difficulty: 'beginner',
          resources: ['MDN CSS Guide', 'CSS-Tricks', 'W3Schools CSS', 'Flexbox Froggy'],
          projects: {
            beginner: [
              {
                title: 'Personal Portfolio Layout',
                description: 'Create a responsive portfolio using CSS Grid and Flexbox',
                technologies: ['HTML', 'CSS', 'Flexbox', 'CSS Grid', 'Responsive Design']
              },
              {
                title: 'CSS Art Gallery',
                description: 'Build a gallery showcasing pure CSS artwork and animations',
                technologies: ['CSS', 'CSS Shapes', 'CSS Animations', 'Creative Design']
              }
            ],
            intermediate: [
              {
                title: 'CSS Framework from Scratch',
                description: 'Build your own CSS framework with grid system and components',
                technologies: ['CSS', 'CSS Custom Properties', 'Grid System', 'Component Design']
              },
              {
                title: 'Interactive Dashboard Layout',
                description: 'Create a complex dashboard with dynamic layouts and themes',
                technologies: ['CSS', 'CSS Grid', 'CSS Variables', 'Theme Switching']
              }
            ],
            advanced: [
              {
                title: 'CSS-in-JS Library',
                description: 'Implement a CSS-in-JS solution with dynamic styling',
                technologies: ['CSS', 'JavaScript', 'Runtime CSS Generation', 'Performance Optimization']
              },
              {
                title: 'CSS Animation Engine',
                description: 'Build a powerful animation engine with timeline controls',
                technologies: ['CSS', 'JavaScript', 'Animation APIs', 'Performance Monitoring']
              }
            ]
          }
        },
        {
          id: 'tailwind-css',
          title: 'Tailwind CSS & Utility-First',
          description: 'Master utility-first CSS with Tailwind CSS framework',
          completed: false,
          estimatedHours: 24,
          difficulty: 'intermediate',
          resources: ['Tailwind CSS Documentation', 'Tailwind UI', 'Tailwind Components', 'Tailwind Play'],
          projects: {
            beginner: [
              {
                title: 'Tailwind Component Library',
                description: 'Build a collection of reusable components using Tailwind',
                technologies: ['Tailwind CSS', 'HTML', 'Component Design', 'Responsive Design']
              },
              {
                title: 'Landing Page with Tailwind',
                description: 'Create a modern landing page using Tailwind utilities',
                technologies: ['Tailwind CSS', 'Responsive Design', 'Modern UI/UX']
              }
            ],
            intermediate: [
              {
                title: 'Custom Tailwind Plugin',
                description: 'Create custom Tailwind plugins for your design system',
                technologies: ['Tailwind CSS', 'Plugin Development', 'Design Systems', 'CSS Architecture']
              },
              {
                title: 'Tailwind Admin Dashboard',
                description: 'Build a comprehensive admin dashboard with Tailwind',
                technologies: ['Tailwind CSS', 'Dashboard Design', 'Data Visualization', 'Interactive Components']
              }
            ],
            advanced: [
              {
                title: 'Tailwind Design System',
                description: 'Create a complete design system with Tailwind as the foundation',
                technologies: ['Tailwind CSS', 'Design Systems', 'Component Architecture', 'Documentation']
              },
              {
                title: 'Tailwind Performance Optimizer',
                description: 'Build tools to optimize Tailwind CSS for production',
                technologies: ['Tailwind CSS', 'Build Tools', 'Performance Optimization', 'CSS Purging']
              }
            ]
          }
        },
        {
          id: 'css-frameworks',
          title: 'CSS Frameworks & Libraries',
          description: 'Bootstrap, Material-UI, Chakra UI, and other popular frameworks',
          completed: false,
          estimatedHours: 28,
          difficulty: 'intermediate',
          resources: ['Bootstrap Documentation', 'Material-UI Docs', 'Chakra UI Docs', 'Ant Design'],
          projects: {
            beginner: [
              {
                title: 'Bootstrap E-commerce Site',
                description: 'Build an e-commerce site using Bootstrap components',
                technologies: ['Bootstrap', 'HTML', 'CSS', 'JavaScript', 'E-commerce Design']
              },
              {
                title: 'Material-UI Dashboard',
                description: 'Create a dashboard using Material-UI components',
                technologies: ['Material-UI', 'React', 'Dashboard Design', 'Component Libraries']
              }
            ],
            intermediate: [
              {
                title: 'Custom Bootstrap Theme',
                description: 'Create a custom Bootstrap theme for a brand',
                technologies: ['Bootstrap', 'SASS', 'Custom Theming', 'Brand Design']
              },
              {
                title: 'Component Library Comparison',
                description: 'Build the same app using different CSS frameworks',
                technologies: ['Bootstrap', 'Material-UI', 'Chakra UI', 'Framework Comparison']
              }
            ],
            advanced: [
              {
                title: 'CSS Framework Analyzer',
                description: 'Create a tool to analyze and compare CSS frameworks',
                technologies: ['CSS Analysis', 'Performance Metrics', 'Bundle Size Analysis', 'Framework Evaluation']
              },
              {
                title: 'Universal Component System',
                description: 'Build a component system that works across multiple frameworks',
                technologies: ['Component Architecture', 'Framework Agnostic', 'Design Systems', 'Cross-Platform']
              }
            ]
          }
        },
        {
          id: 'responsive-design',
          title: 'Responsive Design & Mobile-First',
          description: 'Mobile-first design, responsive breakpoints, and progressive enhancement',
          completed: false,
          estimatedHours: 20,
          difficulty: 'intermediate',
          resources: ['Responsive Web Design', 'Mobile-First Design', 'Progressive Enhancement', 'Viewport Meta'],
          projects: {
            beginner: [
              {
                title: 'Responsive News Website',
                description: 'Build a news website that works perfectly on all devices',
                technologies: ['Responsive Design', 'CSS Media Queries', 'Mobile-First', 'Content Strategy']
              },
              {
                title: 'Mobile App Landing Page',
                description: 'Create a landing page optimized for mobile users',
                technologies: ['Mobile Design', 'Touch Interactions', 'Performance Optimization', 'User Experience']
              }
            ],
            intermediate: [
              {
                title: 'Progressive Web App',
                description: 'Build a PWA with responsive design and offline capabilities',
                technologies: ['PWA', 'Service Workers', 'Responsive Design', 'Offline-First']
              },
              {
                title: 'Responsive Design System',
                description: 'Create a design system with responsive components',
                technologies: ['Design Systems', 'Responsive Components', 'Breakpoint Strategy', 'Component Library']
              }
            ],
            advanced: [
              {
                title: 'Adaptive Design Framework',
                description: 'Build a framework that adapts to different screen sizes and capabilities',
                technologies: ['Adaptive Design', 'Feature Detection', 'Progressive Enhancement', 'Performance Optimization']
              },
              {
                title: 'Cross-Device Testing Platform',
                description: 'Create a platform for testing responsive designs across devices',
                technologies: ['Testing Automation', 'Device Emulation', 'Visual Regression Testing', 'Cross-Browser Testing']
              }
            ]
          }
        },
        {
          id: 'css-advanced',
          title: 'Advanced CSS Techniques',
          description: 'CSS Grid, Flexbox, animations, and modern CSS features',
          completed: false,
          estimatedHours: 24,
          difficulty: 'advanced',
          resources: ['CSS Grid Guide', 'Flexbox Complete Guide', 'CSS Animations', 'Modern CSS'],
          projects: {
            beginner: [
              {
                title: 'CSS Grid Layout System',
                description: 'Build a layout system using CSS Grid',
                technologies: ['CSS Grid', 'Layout Design', 'Responsive Grids', 'Modern CSS']
              },
              {
                title: 'Advanced CSS Animations',
                description: 'Create complex animations using CSS keyframes',
                technologies: ['CSS Animations', 'Keyframes', 'Performance', 'Creative Design']
              }
            ],
            intermediate: [
              {
                title: 'CSS Architecture System',
                description: 'Design a scalable CSS architecture for large projects',
                technologies: ['CSS Architecture', 'Methodology', 'Scalability', 'Maintainability']
              },
              {
                title: 'CSS Performance Optimizer',
                description: 'Build tools to optimize CSS performance',
                technologies: ['CSS Optimization', 'Performance Analysis', 'Build Tools', 'Minification']
              }
            ],
            advanced: [
              {
                title: 'CSS Compiler',
                description: 'Create a CSS compiler with custom syntax and features',
                technologies: ['CSS Compilation', 'Custom Syntax', 'Build Tools', 'Language Design']
              },
              {
                title: 'Real-time CSS Editor',
                description: 'Build a live CSS editor with instant preview',
                technologies: ['Real-time Editing', 'CSS Parsing', 'Live Preview', 'Development Tools']
              }
            ]
          }
        },
        {
          id: 'design-systems',
          title: 'Design Systems & UI/UX',
          description: 'Creating and maintaining design systems, UI/UX principles',
          completed: false,
          estimatedHours: 24,
          difficulty: 'advanced',
          resources: ['Design Systems Handbook', 'UI/UX Best Practices', 'Component Design', 'Design Tokens'],
          projects: {
            beginner: [
              {
                title: 'Design System Documentation',
                description: 'Create comprehensive documentation for a design system',
                technologies: ['Documentation', 'Design Systems', 'Component Libraries', 'Style Guides']
              },
              {
                title: 'UI Component Library',
                description: 'Build a library of reusable UI components',
                technologies: ['Component Design', 'Reusability', 'Consistency', 'Design Patterns']
              }
            ],
            intermediate: [
              {
                title: 'Design Token System',
                description: 'Implement a design token system for consistent theming',
                technologies: ['Design Tokens', 'Theming', 'CSS Variables', 'Design Systems']
              },
              {
                title: 'Interactive Style Guide',
                description: 'Create an interactive style guide with live examples',
                technologies: ['Style Guides', 'Interactive Documentation', 'Component Showcase', 'Design Systems']
              }
            ],
            advanced: [
              {
                title: 'Design System Platform',
                description: 'Build a platform for managing and distributing design systems',
                technologies: ['Design System Management', 'Version Control', 'Distribution', 'Collaboration Tools']
              },
              {
                title: 'AI-Powered Design System',
                description: 'Create a design system that uses AI for component generation',
                technologies: ['AI/ML', 'Design Systems', 'Component Generation', 'Automation']
              }
            ]
          }
        }
      ]
    },
    {
      id: 'javascript-mastery',
      title: 'JavaScript Mastery',
      description: 'Deep dive into modern JavaScript and ES6+ features',
      icon: '⚡',
      color: 'bg-yellow-500',
      completed: false,
      order: 3,
      estimatedTotalHours: 160,
      subsections: [
        {
          id: 'es6-features',
          title: 'ES6+ Features & Modern JS',
          description: 'Arrow functions, destructuring, modules, async/await, promises',
          completed: false,
          estimatedHours: 24,
          difficulty: 'intermediate',
          resources: ['MDN Web Docs', 'ES6+ Guide', 'Modern JavaScript Tutorial'],
          projects: {
            beginner: [
              {
                title: 'Modern Todo App with ES6',
                description: 'Build a todo app using modern ES6+ features like arrow functions and destructuring',
                technologies: ['ES6+', 'Arrow Functions', 'Destructuring', 'Local Storage', 'DOM']
              },
              {
                title: 'ES6 Feature Showcase',
                description: 'Create a website that demonstrates various ES6+ features with examples',
                technologies: ['ES6+', 'Template Literals', 'Spread/Rest', 'Modules', 'Webpack']
              }
            ],
            intermediate: [
              {
                title: 'Promise Library Implementation',
                description: 'Build your own Promise library with all standard methods',
                technologies: ['ES6+', 'Promises', 'Async Programming', 'Library Development']
              },
              {
                title: 'Module Bundler',
                description: 'Create a simple module bundler that handles ES6 modules',
                technologies: ['ES6+', 'Modules', 'Bundling', 'AST Parsing', 'Code Generation']
              },
              {
                title: 'Async Utility Library',
                description: 'Build a library of async utilities using modern async/await patterns',
                technologies: ['ES6+', 'Async/Await', 'Utility Functions', 'Error Handling']
              }
            ],
            advanced: [
              {
                title: 'Reactive Programming Framework',
                description: 'Implement a reactive framework using ES6+ features and observables',
                technologies: ['ES6+', 'Reactive Programming', 'Observables', 'Stream Processing']
              },
              {
                title: 'Metaprogramming Toolkit',
                description: 'Create a toolkit for metaprogramming using ES6+ reflection capabilities',
                technologies: ['ES6+', 'Metaprogramming', 'Reflection', 'Code Generation']
              },
              {
                title: 'Functional Programming Library',
                description: 'Build a comprehensive functional programming library with ES6+ features',
                technologies: ['ES6+', 'Functional Programming', 'Immutability', 'Composition']
              },
              {
                title: 'Async State Management System',
                description: 'Implement a state management system that handles async operations elegantly',
                technologies: ['ES6+', 'State Management', 'Async Operations', 'Reactive Updates']
              },
              {
                title: 'ES6+ Polyfill and Transpiler',
                description: 'Create a polyfill system and transpiler for older browsers',
                technologies: ['ES6+', 'Polyfills', 'Transpilation', 'Browser Compatibility']
              }
            ]
          }
        },
        {
          id: 'functional-advanced-programming',
          title: 'Advanced Functional Programming in JS',
          description: 'Pure functions, immutability, higher-order functions, composition',
          completed: false,
          estimatedHours: 20,
          difficulty: 'intermediate',
          resources: ['Functional Programming Guide', 'Eloquent JavaScript', 'Functional JS Patterns'],
          projects: {
            beginner: [
              {
                title: 'Functional Utility Library',
                description: 'Create a collection of pure utility functions for common operations',
                technologies: ['Functional Programming', 'Pure Functions', 'Utility Functions', 'Immutability']
              },
              {
                title: 'Immutable Data Structures',
                description: 'Build simple immutable data structures using functional principles',
                technologies: ['Functional Programming', 'Immutability', 'Data Structures', 'Object.freeze']
              }
            ],
            intermediate: [
              {
                title: 'Function Composition Pipeline',
                description: 'Implement a pipeline system for composing multiple functions',
                technologies: ['Functional Programming', 'Function Composition', 'Pipeline Pattern', 'Currying']
              },
              {
                title: 'Monad Implementation',
                description: 'Build basic monads like Maybe and Either for error handling',
                technologies: ['Functional Programming', 'Monads', 'Error Handling', 'Category Theory']
              },
              {
                title: 'Immutable State Manager',
                description: 'Create a state management system using immutable updates',
                technologies: ['Functional Programming', 'State Management', 'Immutability', 'Redux-like']
              }
            ],
            advanced: [
              {
                title: 'Functional Reactive Programming Framework',
                description: 'Build a FRP framework with streams and event handling',
                technologies: ['Functional Programming', 'Reactive Programming', 'Streams', 'Event Handling']
              },
              {
                title: 'Lazy Evaluation System',
                description: 'Implement a lazy evaluation system for infinite sequences',
                technologies: ['Functional Programming', 'Lazy Evaluation', 'Infinite Sequences', 'Memoization']
              },
              {
                title: 'Type System for Functional JS',
                description: 'Create a runtime type system that enforces functional programming principles',
                technologies: ['Functional Programming', 'Type Systems', 'Runtime Validation', 'Type Safety']
              },
              {
                title: 'Functional Testing Framework',
                description: 'Build a testing framework designed for functional code',
                technologies: ['Functional Programming', 'Testing', 'Property-Based Testing', 'QuickCheck']
              },
              {
                title: 'Functional Database Query Builder',
                description: 'Create a query builder using functional programming principles',
                technologies: ['Functional Programming', 'Database Queries', 'Query Building', 'Composition']
              }
            ]
          }
        },
        {
          id: 'async-programming',
          title: 'Asynchronous Programming',
          description: 'Callbacks, promises, async/await, event loop, error handling',
          completed: false,
          estimatedHours: 28,
          difficulty: 'intermediate',
          resources: ['Async JavaScript', 'Promise Guide', 'Event Loop Deep Dive'],
          projects: {
            beginner: [
              {
                title: 'Async Data Fetcher',
                description: 'Build a tool that fetches data from multiple APIs asynchronously',
                technologies: ['Async/Await', 'Fetch API', 'Promise.all', 'Error Handling']
              },
              {
                title: 'Promise-based Calculator',
                description: 'Create a calculator that performs operations asynchronously with promises',
                technologies: ['Promises', 'Async Operations', 'Calculator Logic', 'Promise Chaining']
              }
            ],
            intermediate: [
              {
                title: 'Async Queue System',
                description: 'Implement a queue system that processes tasks asynchronously',
                technologies: ['Async Programming', 'Queue Management', 'Task Processing', 'Concurrency Control']
              },
              {
                title: 'Promise Pool Implementation',
                description: 'Create a promise pool that limits concurrent async operations',
                technologies: ['Promises', 'Concurrency Control', 'Resource Management', 'Pooling']
              },
              {
                title: 'Async Event Emitter',
                description: 'Build an event emitter that handles async event listeners',
                technologies: ['Async Programming', 'Event Emitters', 'Event Handling', 'Async Listeners']
              }
            ],
            advanced: [
              {
                title: 'Distributed Async Task Scheduler',
                description: 'Create a scheduler that distributes async tasks across multiple workers',
                technologies: ['Async Programming', 'Distributed Systems', 'Task Distribution', 'Worker Management']
              },
              {
                title: 'Async State Machine',
                description: 'Implement a state machine that handles async state transitions',
                technologies: ['Async Programming', 'State Machines', 'State Transitions', 'Async Logic']
              },
              {
                title: 'Reactive Async Stream Processor',
                description: 'Build a system that processes async streams reactively',
                technologies: ['Async Programming', 'Reactive Programming', 'Stream Processing', 'Backpressure']
              },
              {
                title: 'Async Circuit Breaker Pattern',
                description: 'Implement the circuit breaker pattern for fault tolerance in async operations',
                technologies: ['Async Programming', 'Circuit Breaker', 'Fault Tolerance', 'Resilience']
              },
              {
                title: 'Async Workflow Orchestrator',
                description: 'Create an orchestrator that manages complex async workflows with dependencies',
                technologies: ['Async Programming', 'Workflow Management', 'Dependency Resolution', 'Orchestration']
              }
            ]
          }
        },
        {
          id: 'dom-manipulation',
          title: 'DOM Manipulation & Events',
          description: 'DOM API, event handling, event delegation, performance',
          completed: false,
          estimatedHours: 20,
          difficulty: 'intermediate',
          resources: ['DOM Guide', 'Event Handling', 'Performance Best Practices'],
          projects: {
            beginner: [
              {
                title: 'Interactive Form Builder',
                description: 'Create a form builder that dynamically adds/removes form fields',
                technologies: ['DOM Manipulation', 'Event Handling', 'Form Elements', 'Dynamic Content']
              },
              {
                title: 'Simple Drag & Drop Interface',
                description: 'Build a drag and drop interface for reordering items',
                technologies: ['DOM Events', 'Drag & Drop API', 'Event Handling', 'CSS Transitions']
              }
            ],
            intermediate: [
              {
                title: 'Virtual Scrolling Implementation',
                description: 'Implement virtual scrolling for large lists to improve performance',
                technologies: ['DOM Performance', 'Virtual Scrolling', 'Performance Optimization', 'Large Lists']
              },
              {
                title: 'Event Delegation System',
                description: 'Create a system that efficiently handles events using delegation',
                technologies: ['Event Delegation', 'Event Bubbling', 'Performance', 'Event Management']
              },
              {
                title: 'DOM Diffing Algorithm',
                description: 'Implement a simple diffing algorithm for efficient DOM updates',
                technologies: ['DOM Diffing', 'Algorithm Implementation', 'Performance', 'Virtual DOM']
              }
            ],
            advanced: [
              {
                title: 'Real-time Collaborative Editor',
                description: 'Build an editor that supports real-time collaboration with DOM synchronization',
                technologies: ['DOM Manipulation', 'Real-time Collaboration', 'WebSockets', 'Conflict Resolution']
              },
              {
                title: 'Progressive Web App Framework',
                description: 'Create a PWA framework with advanced DOM management and offline support',
                technologies: ['DOM Management', 'PWA', 'Service Workers', 'Offline Support']
              },
              {
                title: 'Accessibility Enhancement System',
                description: 'Implement a system that automatically enhances DOM accessibility',
                technologies: ['DOM Accessibility', 'ARIA', 'Screen Readers', 'Accessibility Compliance']
              },
              {
                title: 'Performance Monitoring Dashboard',
                description: 'Build a dashboard that monitors DOM performance in real-time',
                technologies: ['DOM Performance', 'Performance Monitoring', 'Real-time Metrics', 'Optimization']
              },
              {
                title: 'Cross-browser DOM Compatibility Layer',
                description: 'Create a compatibility layer that normalizes DOM behavior across browsers',
                technologies: ['DOM Compatibility', 'Browser Normalization', 'Polyfills', 'Cross-browser Support']
              }
            ]
          }
        },
        {
          id: 'js-modules',
          title: 'Modules & Build Tools',
          description: 'ES6 modules, CommonJS, Webpack, Vite, bundling',
          completed: false,
          estimatedHours: 24,
          difficulty: 'intermediate',
          resources: ['ES6 Modules', 'Webpack Guide', 'Vite Documentation', 'Bundling Tools'],
          projects: {
            beginner: [
              {
                title: 'Simple Module Library',
                description: 'Create a library with multiple modules that can be imported/exported',
                technologies: ['ES6 Modules', 'Import/Export', 'Library Development', 'Module Structure']
              },
              {
                title: 'Basic Webpack Configuration',
                description: 'Set up a basic Webpack configuration for a simple project',
                technologies: ['Webpack', 'Module Bundling', 'Configuration', 'Build Process']
              }
            ],
            intermediate: [
              {
                title: 'Custom Module Loader',
                description: 'Implement a custom module loader that can handle different module formats',
                technologies: ['Module Loading', 'Module Resolution', 'Custom Loaders', 'Format Support']
              },
              {
                title: 'Tree Shaking Implementation',
                description: 'Create a build system that implements tree shaking for unused code removal',
                technologies: ['Tree Shaking', 'Dead Code Elimination', 'Build Optimization', 'Bundle Analysis']
              },
              {
                title: 'Dynamic Import System',
                description: 'Build a system that dynamically imports modules based on user actions',
                technologies: ['Dynamic Imports', 'Code Splitting', 'Lazy Loading', 'Performance Optimization']
              }
            ],
            advanced: [
              {
                title: 'Universal Module System',
                description: 'Create a system that works across different module formats and environments',
                technologies: ['Universal Modules', 'Format Conversion', 'Environment Detection', 'Compatibility']
              },
              {
                title: 'Module Hot Reloading System',
                description: 'Implement a hot reloading system for modules during development',
                technologies: ['Hot Reloading', 'Module Replacement', 'Development Tools', 'Live Updates']
              },
              {
                title: 'Bundle Analyzer & Optimizer',
                description: 'Build a tool that analyzes bundles and suggests optimizations',
                technologies: ['Bundle Analysis', 'Optimization Suggestions', 'Performance Analysis', 'Bundle Metrics']
              },
              {
                title: 'Micro-frontend Module Federation',
                description: 'Implement module federation for micro-frontend architectures',
                technologies: ['Module Federation', 'Micro-frontends', 'Distributed Modules', 'Architecture Patterns']
              },
              {
                title: 'Custom Build Pipeline',
                description: 'Create a custom build pipeline with multiple build steps and optimizations',
                technologies: ['Build Pipelines', 'Custom Build Tools', 'Optimization', 'Build Automation']
              }
            ]
          }
        },
        {
          id: 'js-testing',
          title: 'JavaScript Testing',
          description: 'Jest, testing frameworks, mocking, test-driven development',
          completed: false,
          estimatedHours: 24,
          difficulty: 'intermediate',
          resources: ['Jest Documentation', 'Testing JavaScript', 'TDD Guide'],
          projects: {
            beginner: [
              {
                title: 'Calculator Test Suite',
                description: 'Write comprehensive tests for a calculator application using Jest',
                technologies: ['Jest', 'Unit Testing', 'Test Coverage', 'Assertions', 'Test Organization']
              },
              {
                title: 'Simple API Testing',
                description: 'Create tests for a simple API using Jest and supertest',
                technologies: ['Jest', 'API Testing', 'Supertest', 'Integration Testing', 'HTTP Testing']
              }
            ],
            intermediate: [
              {
                title: 'Custom Testing Framework',
                description: 'Build a simple testing framework with basic assertion and test runner capabilities',
                technologies: ['Testing Framework', 'Assertion Library', 'Test Runner', 'Custom Implementation']
              },
              {
                title: 'Mocking System Implementation',
                description: 'Create a comprehensive mocking system for testing dependencies',
                technologies: ['Mocking', 'Dependency Injection', 'Test Doubles', 'Mock Implementation']
              },
              {
                title: 'Test Coverage Reporter',
                description: 'Build a custom test coverage reporter with detailed analysis',
                technologies: ['Test Coverage', 'Coverage Analysis', 'Reporting', 'Coverage Metrics']
              }
            ],
            advanced: [
              {
                title: 'Property-Based Testing Framework',
                description: 'Implement a property-based testing framework similar to QuickCheck',
                technologies: ['Property-Based Testing', 'QuickCheck', 'Random Testing', 'Property Generation']
              },
              {
                title: 'Visual Regression Testing System',
                description: 'Create a system that detects visual changes in UI components during testing',
                technologies: ['Visual Testing', 'Image Comparison', 'UI Testing', 'Regression Detection']
              },
              {
                title: 'Performance Testing Framework',
                description: 'Build a framework for testing application performance and benchmarks',
                technologies: ['Performance Testing', 'Benchmarking', 'Performance Metrics', 'Load Testing']
              },
              {
                title: 'Distributed Testing Orchestrator',
                description: 'Create a system that orchestrates tests across multiple distributed environments',
                technologies: ['Distributed Testing', 'Test Orchestration', 'Environment Management', 'Parallel Execution']
              },
              {
                title: 'AI-Powered Test Generation',
                description: 'Implement an AI system that automatically generates test cases based on code analysis',
                technologies: ['AI/ML', 'Test Generation', 'Code Analysis', 'Automated Testing', 'Machine Learning']
              }
            ]
          }
        },
        {
          id: 'js-performance',
          title: 'JavaScript Performance',
          description: 'Memory management, optimization, profiling, best practices',
          completed: false,
          estimatedHours: 20,
          difficulty: 'advanced',
          resources: ['JS Performance Guide', 'Memory Management', 'Profiling Tools'],
          projects: {
            beginner: [
              {
                title: 'Performance Benchmark Tool',
                description: 'Create a simple tool that measures execution time of different functions',
                technologies: ['Performance Measurement', 'Benchmarking', 'Execution Time', 'Performance Metrics']
              },
              {
                title: 'Memory Usage Monitor',
                description: 'Build a basic memory usage monitor for web applications',
                technologies: ['Memory Monitoring', 'Performance API', 'Memory Metrics', 'Browser APIs']
              }
            ],
            intermediate: [
              {
                title: 'Performance Profiler',
                description: 'Implement a custom performance profiler that tracks function calls and timing',
                technologies: ['Performance Profiling', 'Function Tracking', 'Timing Analysis', 'Performance Analysis']
              },
              {
                title: 'Memory Leak Detector',
                description: 'Create a tool that detects potential memory leaks in JavaScript applications',
                technologies: ['Memory Leak Detection', 'Garbage Collection', 'Memory Analysis', 'Leak Prevention']
              },
              {
                title: 'Bundle Size Analyzer',
                description: 'Build a tool that analyzes JavaScript bundle sizes and identifies optimization opportunities',
                technologies: ['Bundle Analysis', 'Size Optimization', 'Code Splitting', 'Performance Optimization']
              }
            ],
            advanced: [
              {
                title: 'Real-time Performance Monitoring System',
                description: 'Create a comprehensive system that monitors performance metrics in real-time',
                technologies: ['Real-time Monitoring', 'Performance Metrics', 'Live Dashboards', 'Performance Tracking']
              },
              {
                title: 'Automated Performance Optimization Engine',
                description: 'Build an engine that automatically optimizes JavaScript code for better performance',
                technologies: ['Automated Optimization', 'Code Optimization', 'Performance Tuning', 'AI Optimization']
              },
              {
                title: 'Distributed Performance Profiling',
                description: 'Implement a system that profiles performance across distributed applications',
                technologies: ['Distributed Profiling', 'Cross-service Performance', 'Performance Correlation', 'Distributed Systems']
              },
              {
                title: 'Predictive Performance Analysis',
                description: 'Create a system that predicts performance issues before they occur',
                technologies: ['Predictive Analysis', 'Performance Prediction', 'Machine Learning', 'Proactive Monitoring']
              },
              {
                title: 'Performance Regression Detection',
                description: 'Build a system that automatically detects performance regressions in code changes',
                technologies: ['Regression Detection', 'Performance Monitoring', 'Change Analysis', 'Automated Detection']
              }
            ]
          }
        }
      ]
    },
    {
      id: 'javascript-advanced',
      title: 'JavaScript Advanced Concepts',
      description: 'Advanced JavaScript patterns, async programming, and modern practices',
      icon: '⚡',
      color: 'bg-yellow-500',
      completed: false,
      order: 3,
      estimatedTotalHours: 160,
      subsections: [
        {
          id: 'es6-advanced-features',
          title: 'ES6+ Advanced Features',
          description: 'Arrow functions, destructuring, spread/rest, template literals',
          completed: false,
          estimatedHours: 20,
          difficulty: 'intermediate',
          resources: ['MDN Web Docs', 'ES6 in Depth', 'JavaScript.info'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'ES6 Features Exercise',
                description: 'A project to practice ES6 features like arrow functions and destructuring.',
                technologies: ['JavaScript']
              },
              {
                title: 'Spread/Rest Operator',
                description: 'A project to practice using spread and rest operators.',
                technologies: ['JavaScript']
              }
            ],
            advanced: [
              {
                title: 'Complex Template Literals',
                description: 'A project to practice using complex template literals.',
                technologies: ['JavaScript']
              },
              {
                title: 'Advanced String Methods',
                description: 'A project to practice using advanced string methods.',
                technologies: ['JavaScript']
              }
            ]
          }
        },
        {
          id: 'async-advanced-programming',
          title: 'Advanced Asynchronous Programming',
          description: 'Callbacks, promises, async/await, event loop',
          completed: false,
          estimatedHours: 32,
          difficulty: 'intermediate',
          resources: ['MDN Web Docs', 'Eloquent JavaScript', 'JavaScript.info'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'Event Loop Exercise',
                description: 'A project to practice understanding the event loop and async operations.',
                technologies: ['JavaScript']
              },
              {
                title: 'Promise Race Condition',
                description: 'A project to practice handling race conditions with promises.',
                technologies: ['JavaScript']
              }
            ],
            advanced: [
              {
                title: 'Complex Promise Flow',
                description: 'A project to practice handling complex promise scenarios.',
                technologies: ['JavaScript']
              },
              {
                title: 'Async/Await with Fetch API',
                description: 'A project to practice fetching data using async/await.',
                technologies: ['JavaScript']
              }
            ]
          }
        },
        {
          id: 'modules',
          title: 'Modules & Bundlers',
          description: 'ES6 modules, CommonJS, webpack, rollup',
          completed: false,
          estimatedHours: 24,
          difficulty: 'intermediate',
          resources: ['MDN Web Docs', 'Webpack Documentation', 'Rollup Documentation'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'Module System Exercise',
                description: 'A project to practice ES6 modules and CommonJS.',
                technologies: ['JavaScript']
              },
              {
                title: 'Webpack Configuration',
                description: 'A project to practice configuring Webpack for a real-world application.',
                technologies: ['JavaScript', 'Webpack']
              }
            ],
            advanced: [
              {
                title: 'Complex Module Structure',
                description: 'A project to practice building a complex module structure.',
                technologies: ['JavaScript']
              },
              {
                title: 'Optimized Bundle',
                description: 'A project to practice optimizing bundle size and performance.',
                technologies: ['JavaScript']
              }
            ]
          }
        },
        {
          id: 'functional-programming',
          title: 'Functional Programming',
          description: 'Pure functions, immutability, higher-order functions',
          completed: false,
          estimatedHours: 28,
          difficulty: 'intermediate',
          resources: ['Eloquent JavaScript', 'Functional Programming in JavaScript', 'Mostly Adequate Guide'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'Immutable State',
                description: 'A project to practice immutability and functional programming concepts.',
                technologies: ['JavaScript']
              },
              {
                title: 'Higher-Order Functions',
                description: 'A project to practice using higher-order functions for data manipulation.',
                technologies: ['JavaScript']
              }
            ],
            advanced: [
              {
                title: 'Complex Composition',
                description: 'A project to practice composing multiple functions.',
                technologies: ['JavaScript']
              },
              {
                title: 'Functional Pipeline',
                description: 'A project to practice building a functional pipeline for data processing.',
                technologies: ['JavaScript']
              }
            ]
          }
        },
        {
          id: 'oop-js',
          title: 'Object-Oriented Programming in JS',
          description: 'Classes, inheritance, encapsulation, polymorphism',
          completed: false,
          estimatedHours: 24,
          difficulty: 'intermediate',
          resources: ['MDN Web Docs', 'Eloquent JavaScript', 'JavaScript.info'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'OOP Basics',
                description: 'A project to practice OOP concepts like classes and inheritance.',
                technologies: ['JavaScript']
              },
              {
                title: 'Encapsulation',
                description: 'A project to practice encapsulation and data hiding.',
                technologies: ['JavaScript']
              }
            ],
            advanced: [
              {
                title: 'Advanced Inheritance',
                description: 'A project to practice advanced inheritance patterns.',
                technologies: ['JavaScript']
              },
              {
                title: 'Polymorphism',
                description: 'A project to practice polymorphism and interface design.',
                technologies: ['JavaScript']
              }
            ]
          }
        },
        {
          id: 'design-patterns-basic',
          title: 'Design Patterns',
          description: 'Singleton, factory, observer, module patterns',
          completed: false,
          estimatedHours: 32,
          difficulty: 'intermediate',
          resources: ['Design Patterns', 'JavaScript Design Patterns', 'Learning JavaScript Design Patterns'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'Singleton Pattern',
                description: 'A project to practice implementing the Singleton pattern.',
                technologies: ['JavaScript']
              },
              {
                title: 'Observer Pattern',
                description: 'A project to practice implementing the Observer pattern.',
                technologies: ['JavaScript']
              }
            ],
            advanced: [
              {
                title: 'Factory Pattern',
                description: 'A project to practice implementing the Factory pattern.',
                technologies: ['JavaScript']
              },
              {
                title: 'Module Pattern',
                description: 'A project to practice implementing the Module pattern.',
                technologies: ['JavaScript']
              }
            ]
          }
        }
      ]
    },
    {
      id: 'typescript',
      title: 'TypeScript',
      description: 'Static typing and advanced JavaScript features',
      icon: '🔷',
      color: 'bg-blue-600',
      completed: false,
      order: 4,
      estimatedTotalHours: 100,
      subsections: [
        {
          id: 'types-basics-advanced',
          title: 'Basic Types & Interfaces',
          description: 'Primitive types, interfaces, type aliases',
          completed: false,
          estimatedHours: 16,
          difficulty: 'intermediate',
          resources: ['TypeScript Handbook', 'TypeScript Deep Dive', 'Official Documentation'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'TypeScript Basics',
                description: 'A project to practice basic TypeScript types and interfaces.',
                technologies: ['TypeScript']
              },
              {
                title: 'Type Alias Exercise',
                description: 'A project to practice using type aliases.',
                technologies: ['TypeScript']
              }
            ],
            advanced: [
              {
                title: 'Advanced Types',
                description: 'A project to practice advanced TypeScript types and generics.',
                technologies: ['TypeScript']
              },
              {
                title: 'Conditional Types',
                description: 'A project to practice using conditional types.',
                technologies: ['TypeScript']
              }
            ]
          }
        },
        {
          id: 'advanced-types',
          title: 'Advanced Types',
          description: 'Union types, generics, conditional types',
          completed: false,
          estimatedHours: 24,
          difficulty: 'advanced',
          resources: ['TypeScript Handbook', 'TypeScript Deep Dive', 'Official Documentation'],
          projects: {
            beginner: [
              {
                title: 'Union Type Handler',
                description: 'Create a system that handles different types using union types and type guards',
                technologies: ['TypeScript', 'Union Types', 'Type Guards', 'Discriminated Unions', 'Type Narrowing']
              },
              {
                title: 'Generic Collection Library',
                description: 'Build a collection library using generics for different data types',
                technologies: ['TypeScript', 'Generics', 'Generic Constraints', 'Collection Classes', 'Type Parameters']
              }
            ],
            intermediate: [
              {
                title: 'Conditional Type System',
                description: 'Implement a system using conditional types for dynamic type resolution',
                technologies: ['TypeScript', 'Conditional Types', 'Type Resolution', 'Dynamic Types', 'Advanced Patterns']
              },
              {
                title: 'Mapped Types Implementation',
                description: 'Create utility types using mapped types for object transformation',
                technologies: ['TypeScript', 'Mapped Types', 'Utility Types', 'Object Transformation', 'Type Mapping']
              },
              {
                title: 'Template Literal Types',
                description: 'Build a system using template literal types for string manipulation',
                technologies: ['TypeScript', 'Template Literal Types', 'String Types', 'Literal Types', 'String Manipulation']
              }
            ],
            advanced: [
              {
                title: 'Advanced Generic Constraints',
                description: 'Implement complex generic constraints with multiple type parameters',
                technologies: ['TypeScript', 'Generic Constraints', 'Multiple Type Parameters', 'Complex Generics', 'Advanced Constraints']
              },
              {
                title: 'Type-Level Programming',
                description: 'Create a system that performs computations at the type level',
                technologies: ['TypeScript', 'Type-Level Programming', 'Type Computation', 'Advanced Types', 'Type Mathematics']
              },
              {
                title: 'Recursive Type System',
                description: 'Build a system with recursive types for complex data structures',
                technologies: ['TypeScript', 'Recursive Types', 'Complex Data Structures', 'Type Recursion', 'Advanced Patterns']
              },
              {
                title: 'Infer Types Implementation',
                description: 'Create utility types using the infer keyword for type extraction',
                technologies: ['TypeScript', 'Infer Types', 'Type Extraction', 'Conditional Types', 'Advanced Inference']
              },
              {
                title: 'Type-Safe Builder Pattern',
                description: 'Implement a builder pattern with full type safety and method chaining',
                technologies: ['TypeScript', 'Builder Pattern', 'Method Chaining', 'Type Safety', 'Design Patterns']
              }
            ]
          }
        },
        {
          id: 'decorators',
          title: 'Decorators & Metadata',
          description: 'Class decorators, method decorators, reflection',
          completed: false,
          estimatedHours: 20,
          difficulty: 'advanced',
          resources: ['TypeScript Handbook', 'TypeScript Deep Dive', 'Official Documentation'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'Decorators Basics',
                description: 'A project to practice basic TypeScript decorators.',
                technologies: ['TypeScript']
              },
              {
                title: 'Method Decorators',
                description: 'A project to practice using method decorators.',
                technologies: ['TypeScript']
              }
            ],
            advanced: [
              {
                title: 'Advanced Decorators',
                description: 'A project to practice using advanced decorators.',
                technologies: ['TypeScript']
              },
              {
                title: 'Reflection',
                description: 'A project to practice using TypeScript reflection.',
                technologies: ['TypeScript']
              }
            ]
          }
        },
        {
          id: 'ts-config',
          title: 'TypeScript Configuration',
          description: 'tsconfig.json, compiler options, strict mode',
          completed: false,
          estimatedHours: 16,
          difficulty: 'intermediate',
          resources: ['TypeScript Handbook', 'TypeScript Deep Dive', 'Official Documentation'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'TypeScript Config',
                description: 'A project to practice configuring TypeScript.',
                technologies: ['TypeScript']
              },
              {
                title: 'Strict Mode',
                description: 'A project to practice using strict mode.',
                technologies: ['TypeScript']
              }
            ],
            advanced: [
              {
                title: 'Advanced Compiler Options',
                description: 'A project to practice using advanced compiler options.',
                technologies: ['TypeScript']
              },
              {
                title: 'Custom Type Definitions',
                description: 'A project to practice creating custom type definitions.',
                technologies: ['TypeScript']
              }
            ]
          }
        },
        {
          id: 'ts-testing',
          title: 'Testing with TypeScript',
          description: 'Jest with TypeScript, type testing',
          completed: false,
          estimatedHours: 24,
          difficulty: 'intermediate',
          resources: ['Jest Documentation', 'TypeScript Handbook', 'Official Documentation'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'TypeScript Testing',
                description: 'A project to practice writing TypeScript tests.',
                technologies: ['TypeScript', 'Jest']
              },
              {
                title: 'Type Guards',
                description: 'A project to practice using TypeScript type guards.',
                technologies: ['TypeScript']
              }
            ],
            advanced: [
              {
                title: 'Complex Promise Flow',
                description: 'A project to practice handling complex promise scenarios.',
                technologies: ['JavaScript']
              },
              {
                title: 'Async/Await with Fetch API',
                description: 'A project to practice fetching data using async/await.',
                technologies: ['JavaScript']
              }
            ]
          }
        }
      ]
    },
    {
      id: 'nextjs',
      title: 'Next.js & Full-Stack React',
      description: 'Master Next.js for full-stack React applications and production deployment',
      icon: '🚀',
      color: 'bg-black',
      completed: false,
      order: 5,
      estimatedTotalHours: 120,
      subsections: [
        {
          id: 'nextjs-fundamentals',
          title: 'Next.js Fundamentals',
          description: 'App Router, pages, routing, and core Next.js concepts',
          completed: false,
          estimatedHours: 20,
          difficulty: 'intermediate',
          resources: ['Next.js Documentation', 'Next.js Tutorial', 'App Router Guide', 'Vercel Platform'],
          projects: {
            beginner: [
              {
                title: 'Next.js Blog Platform',
                description: 'Build a blog with Next.js App Router and markdown support',
                technologies: ['Next.js', 'App Router', 'Markdown', 'Static Generation', 'Dynamic Routes']
              },
              {
                title: 'E-commerce Store',
                description: 'Create an e-commerce site with Next.js and Stripe integration',
                technologies: ['Next.js', 'E-commerce', 'Stripe API', 'Shopping Cart', 'Payment Processing']
              }
            ],
            intermediate: [
              {
                title: 'Next.js Dashboard',
                description: 'Build a comprehensive dashboard with Next.js and data visualization',
                technologies: ['Next.js', 'Dashboard Design', 'Data Visualization', 'Charts', 'Real-time Data']
              },
              {
                title: 'Next.js API Routes',
                description: 'Create a full-stack application with Next.js API routes',
                technologies: ['Next.js', 'API Routes', 'Database Integration', 'Authentication', 'CRUD Operations']
              }
            ],
            advanced: [
              {
                title: 'Next.js Plugin System',
                description: 'Build a plugin system for Next.js applications',
                technologies: ['Next.js', 'Plugin Architecture', 'Modular Design', 'Extension System']
              },
              {
                title: 'Next.js Performance Optimizer',
                description: 'Create tools to optimize Next.js applications for production',
                technologies: ['Next.js', 'Performance Optimization', 'Bundle Analysis', 'Build Optimization']
              }
            ]
          }
        },
        {
          id: 'nextjs-advanced',
          title: 'Advanced Next.js Patterns',
          description: 'Server Components, streaming, middleware, and advanced features',
          completed: false,
          estimatedHours: 24,
          difficulty: 'advanced',
          resources: ['Next.js Advanced Patterns', 'Server Components', 'Streaming SSR', 'Middleware'],
          projects: {
            beginner: [
              {
                title: 'Server Components Demo',
                description: 'Build an app showcasing React Server Components',
                technologies: ['Next.js', 'Server Components', 'Client Components', 'Hydration']
              },
              {
                title: 'Streaming Application',
                description: 'Create an app with streaming SSR for better performance',
                technologies: ['Next.js', 'Streaming', 'Suspense', 'Loading States']
              }
            ],
            intermediate: [
              {
                title: 'Next.js Middleware System',
                description: 'Implement complex middleware for authentication and routing',
                technologies: ['Next.js', 'Middleware', 'Authentication', 'Route Protection', 'API Security']
              },
              {
                title: 'Hybrid Rendering App',
                description: 'Build an app using multiple rendering strategies',
                technologies: ['Next.js', 'SSR', 'SSG', 'ISR', 'Dynamic Rendering']
              }
            ],
            advanced: [
              {
                title: 'Next.js Framework',
                description: 'Create a framework built on top of Next.js',
                technologies: ['Next.js', 'Framework Development', 'Abstraction Layers', 'Developer Experience']
              },
              {
                title: 'Next.js Analytics Platform',
                description: 'Build an analytics platform for Next.js applications',
                technologies: ['Next.js', 'Analytics', 'Performance Monitoring', 'Real-time Metrics']
              }
            ]
          }
        },
        {
          id: 'nextjs-deployment',
          title: 'Deployment & Production',
          description: 'Vercel deployment, performance optimization, and production best practices',
          completed: false,
          estimatedHours: 16,
          difficulty: 'intermediate',
          resources: ['Vercel Documentation', 'Next.js Deployment', 'Performance Optimization', 'Production Checklist'],
          projects: {
            beginner: [
              {
                title: 'Vercel Deployment Pipeline',
                description: 'Set up CI/CD pipeline with Vercel and GitHub',
                technologies: ['Vercel', 'CI/CD', 'GitHub Actions', 'Automated Deployment']
              },
              {
                title: 'Performance Monitoring',
                description: 'Implement performance monitoring for Next.js apps',
                technologies: ['Performance Monitoring', 'Core Web Vitals', 'Analytics', 'Error Tracking']
              }
            ],
            intermediate: [
              {
                title: 'Multi-Environment Setup',
                description: 'Configure staging, testing, and production environments',
                technologies: ['Environment Management', 'Configuration', 'Deployment Strategies', 'Testing']
              },
              {
                title: 'CDN Integration',
                description: 'Integrate CDN for global performance optimization',
                technologies: ['CDN', 'Global Distribution', 'Performance', 'Caching Strategies']
              }
            ],
            advanced: [
              {
                title: 'Custom Deployment Platform',
                description: 'Build a custom deployment platform for Next.js apps',
                technologies: ['Deployment Platform', 'Infrastructure', 'Automation', 'Scalability']
              },
              {
                title: 'Edge Computing Integration',
                description: 'Implement edge computing with Next.js Edge Runtime',
                technologies: ['Edge Computing', 'Edge Runtime', 'Global Performance', 'Serverless Functions']
              }
            ]
          }
        },
        {
          id: 'nextjs-ecosystem',
          title: 'Next.js Ecosystem',
          description: 'Integrating with databases, authentication, and third-party services',
          completed: false,
          estimatedHours: 20,
          difficulty: 'intermediate',
          resources: ['Next.js Integrations', 'Database Integration', 'Authentication', 'Third-party Services'],
          projects: {
            beginner: [
              {
                title: 'Next.js with Supabase',
                description: 'Build a full-stack app with Next.js and Supabase',
                technologies: ['Next.js', 'Supabase', 'Database', 'Authentication', 'Real-time']
              },
              {
                title: 'Next.js with Prisma',
                description: 'Create a Next.js app with Prisma ORM',
                technologies: ['Next.js', 'Prisma', 'Database', 'Type Safety', 'Migrations']
              }
            ],
            intermediate: [
              {
                title: 'Next.js with Auth.js',
                description: 'Implement authentication with Auth.js in Next.js',
                technologies: ['Next.js', 'Auth.js', 'Authentication', 'OAuth', 'Session Management']
              },
              {
                title: 'Next.js with Stripe',
                description: 'Build a payment system with Next.js and Stripe',
                technologies: ['Next.js', 'Stripe', 'Payments', 'Webhooks', 'Subscription Management']
              }
            ],
            advanced: [
              {
                title: 'Next.js Microservices',
                description: 'Build a microservices architecture with Next.js',
                technologies: ['Next.js', 'Microservices', 'Service Communication', 'API Gateway']
              },
              {
                title: 'Next.js with GraphQL',
                description: 'Implement GraphQL with Next.js and Apollo',
                technologies: ['Next.js', 'GraphQL', 'Apollo', 'Type Safety', 'Data Fetching']
              }
            ]
          }
        },
        {
          id: 'nextjs-testing',
          title: 'Testing Next.js Applications',
          description: 'Unit testing, integration testing, and E2E testing for Next.js',
          completed: false,
          estimatedHours: 20,
          difficulty: 'intermediate',
          resources: ['Next.js Testing', 'Jest', 'React Testing Library', 'Playwright', 'Cypress'],
          projects: {
            beginner: [
              {
                title: 'Next.js Test Suite',
                description: 'Set up comprehensive testing for a Next.js application',
                technologies: ['Next.js', 'Jest', 'React Testing Library', 'Unit Testing', 'Integration Testing']
              },
              {
                title: 'E2E Testing with Playwright',
                description: 'Implement end-to-end testing with Playwright',
                technologies: ['Next.js', 'Playwright', 'E2E Testing', 'Automation', 'Test Coverage']
              }
            ],
            intermediate: [
              {
                title: 'Visual Regression Testing',
                description: 'Set up visual regression testing for Next.js components',
                technologies: ['Next.js', 'Visual Testing', 'Screenshot Testing', 'UI Testing', 'Regression Detection']
              },
              {
                title: 'Performance Testing',
                description: 'Implement performance testing for Next.js applications',
                technologies: ['Next.js', 'Performance Testing', 'Load Testing', 'Stress Testing', 'Benchmarking']
              }
            ],
            advanced: [
              {
                title: 'Testing Framework',
                description: 'Build a custom testing framework for Next.js',
                technologies: ['Next.js', 'Testing Framework', 'Custom Testing', 'Test Automation', 'Developer Tools']
              },
              {
                title: 'AI-Powered Testing',
                description: 'Implement AI-powered testing for Next.js applications',
                technologies: ['Next.js', 'AI/ML', 'Automated Testing', 'Test Generation', 'Intelligent Testing']
              }
            ]
          }
        },
        {
          id: 'nextjs-optimization',
          title: 'Performance & Optimization',
          description: 'Bundle optimization, caching strategies, and performance monitoring',
          completed: false,
          estimatedHours: 20,
          difficulty: 'advanced',
          resources: ['Next.js Performance', 'Bundle Analysis', 'Caching', 'Core Web Vitals', 'Lighthouse'],
          projects: {
            beginner: [
              {
                title: 'Bundle Analyzer',
                description: 'Create a bundle analyzer for Next.js applications',
                technologies: ['Next.js', 'Bundle Analysis', 'Webpack', 'Performance Optimization', 'Code Splitting']
              },
              {
                title: 'Caching Strategy',
                description: 'Implement comprehensive caching for Next.js apps',
                technologies: ['Next.js', 'Caching', 'Redis', 'CDN', 'Performance']
              }
            ],
            intermediate: [
              {
                title: 'Performance Monitoring',
                description: 'Build a performance monitoring system for Next.js',
                technologies: ['Next.js', 'Performance Monitoring', 'Metrics Collection', 'Real-time Analytics']
              },
              {
                title: 'Image Optimization',
                description: 'Implement advanced image optimization strategies',
                technologies: ['Next.js', 'Image Optimization', 'WebP', 'Responsive Images', 'Lazy Loading']
              }
            ],
            advanced: [
              {
                title: 'Performance Optimization Engine',
                description: 'Build an engine that automatically optimizes Next.js apps',
                technologies: ['Next.js', 'Automated Optimization', 'AI/ML', 'Performance Analysis', 'Optimization Engine']
              },
              {
                title: 'Real-time Performance Dashboard',
                description: 'Create a dashboard for real-time performance monitoring',
                technologies: ['Next.js', 'Real-time Dashboard', 'Performance Metrics', 'Data Visualization', 'Monitoring']
              }
            ]
          }
        }
      ]
    },
    {
      id: 'react',
      title: 'React & Frontend Development',
      description: 'Modern React with hooks, context, and advanced patterns',
      icon: '⚛️',
      color: 'bg-cyan-500',
      completed: false,
      order: 6,
      estimatedTotalHours: 140,
      subsections: [
        {
          id: 'react-basics',
          title: 'React Fundamentals',
          description: 'Components, JSX, props, state, lifecycle',
          completed: false,
          estimatedHours: 24,
          difficulty: 'intermediate',
          resources: ['React Documentation', 'React Tutorial', 'React Fundamentals'],
          projects: {
            beginner: [
              {
                title: 'Interactive Todo App',
                description: 'Build a todo application with add, delete, and mark complete functionality',
                technologies: ['React', 'Components', 'State Management', 'Props', 'Event Handling', 'JSX']
              },
              {
                title: 'Simple Counter App',
                description: 'Create a counter with increment, decrement, and reset functionality',
                technologies: ['React', 'State', 'Event Handlers', 'Component Lifecycle', 'Conditional Rendering']
              }
            ],
            intermediate: [
              {
                title: 'State Management',
                description: 'A project to practice React state management and hooks.',
                technologies: ['React']
              },
              {
                title: 'Lifecycle Methods',
                description: 'A project to practice React component lifecycle methods.',
                technologies: ['React']
              }
            ],
            advanced: [
              {
                title: 'Complex State Management',
                description: 'A project to practice managing complex state in React.',
                technologies: ['React']
              },
              {
                title: 'Advanced Hooks',
                description: 'A project to practice using advanced React hooks.',
                technologies: ['React']
              }
            ]
          }
        },
        {
          id: 'hooks',
          title: 'React Hooks',
          description: 'useState, useEffect, useContext, custom hooks',
          completed: false,
          estimatedHours: 28,
          difficulty: 'intermediate',
          resources: ['React Documentation', 'React Hooks', 'useHooks'],
          projects: {
            beginner: [
              {
                title: 'Custom Hook Library',
                description: 'Create a collection of useful custom hooks for common functionality',
                technologies: ['React Hooks', 'Custom Hooks', 'useState', 'useEffect', 'Hook Composition', 'Reusability']
              },
              {
                title: 'Form Hook Implementation',
                description: 'Build a custom hook for form handling with validation',
                technologies: ['React Hooks', 'Form Management', 'Validation', 'useState', 'useEffect', 'Custom Logic']
              }
            ],
            intermediate: [
              {
                title: 'State Management Hook',
                description: 'Implement a custom hook for complex state management',
                technologies: ['React Hooks', 'State Management', 'Complex State', 'useReducer', 'Custom Hooks', 'State Logic']
              },
              {
                title: 'API Integration Hook',
                description: 'Create a hook for handling API calls with loading and error states',
                technologies: ['React Hooks', 'API Integration', 'Data Fetching', 'Loading States', 'Error Handling', 'useEffect']
              },
              {
                title: 'Local Storage Hook',
                description: 'Build a hook for persisting state inlocalStorage',
                technologies: ['React Hooks', 'Local Storage', 'State Persistence', 'useEffect', 'Custom Hooks', 'Data Persistence']
              }
            ],
            advanced: [
              {
                title: 'Advanced Hook Patterns',
                description: 'Implement complex hook patterns like compound hooks and hook factories',
                technologies: ['React Hooks', 'Advanced Patterns', 'Compound Hooks', 'Hook Factories', 'Complex Logic', 'Pattern Design']
              },
              {
                title: 'Hook Testing Framework',
                description: 'Create a testing framework specifically for testing React hooks',
                technologies: ['React Hooks', 'Testing', 'Hook Testing', 'Test Utilities', 'Custom Testing', 'Hook Isolation']
              },
              {
                title: 'Performance Hook System',
                description: 'Build a system of hooks for performance optimization and monitoring',
                technologies: ['React Hooks', 'Performance', 'Optimization', 'Monitoring', 'Custom Hooks', 'Performance Metrics']
              },
              {
                title: 'Hook Debugging Tools',
                description: 'Implement debugging tools for React hooks with detailed logging',
                technologies: ['React Hooks', 'Debugging', 'Logging', 'Development Tools', 'Hook Inspection', 'Debug Utilities']
              },
              {
                title: 'Hook Composition Framework',
                description: 'Create a framework for composing complex functionality from multiple hooks',
                technologies: ['React Hooks', 'Hook Composition', 'Framework Design', 'Modular Hooks', 'Complex Composition', 'Architecture']
              }
            ]
          }
        },
        {
          id: 'context-api',
          title: 'Context API & State Management',
          description: 'Context, Redux, Zustand, state management patterns',
          completed: false,
          estimatedHours: 32,
          difficulty: 'intermediate',
          resources: ['React Documentation', 'Redux Documentation', 'Zustand Documentation'],
          projects: {
            beginner: [
              {
                title: 'Context API Basics',
                description: 'A project to practice using React Context API for state management.',
                technologies: ['React']
              },
              {
                title: 'Redux vs Zustand',
                description: 'A project to compare Redux and Zustand for state management.',
                technologies: ['React']
              }
            ],
            intermediate: [
              {
                title: 'Complex State Management',
                description: 'A project to practice managing complex state in React.',
                technologies: ['React']
              },
              {
                title: 'Context API',
                description: 'A project to practice using React Context API.',
                technologies: ['React']
              }
            ],
            advanced: [
              {
                title: 'Complex Promise Flow',
                description: 'A project to practice handling complex promise scenarios.',
                technologies: ['JavaScript']
              },
              {
                title: 'Async/Await with Fetch API',
                description: 'A project to practice fetching data using async/await.',
                technologies: ['JavaScript']
              }
            ]
          }
        },
        {
          id: 'routing',
          title: 'Routing & Navigation',
          description: 'React Router, navigation, protected routes',
          completed: false,
          estimatedHours: 20,
          difficulty: 'intermediate',
          resources: ['React Router Documentation', 'React Navigation', 'Official Documentation'],
          projects: {
            beginner: [
              {
                title: 'Basic Routing',
                description: 'A project to practice React Router for navigation.',
                technologies: ['React']
              },
              {
                title: 'Protected Routes',
                description: 'A project to practice protected routes in React Router.',
                technologies: ['React']
              }
            ],
            intermediate: [
              {
                title: 'Advanced Routing',
                description: 'A project to practice advanced React Router features.',
                technologies: ['React']
              },
              {
                title: 'Nested Routes',
                description: 'A project to practice nested routes in React Router.',
                technologies: ['React']
              }
            ],
            advanced: [
              {
                title: 'Complex Routing',
                description: 'A project to practice complex routing scenarios.',
                technologies: ['React']
              },
              {
                title: 'Code Splitting',
                description: 'A project to practice code splitting in React.',
                technologies: ['React']
              }
            ]
          }
        },
        {
          id: 'testing-react',
          title: 'Testing React Applications',
          description: 'React Testing Library, Jest, component testing',
          completed: false,
          estimatedHours: 24,
          difficulty: 'intermediate',
          resources: ['React Testing Library', 'Jest Documentation', 'Testing React Applications'],
          projects: {
            beginner: [
              {
                title: 'Jest Basics',
                description: 'A project to practice writing and running basic Jest tests.',
                technologies: ['React', 'Jest']
              },
              {
                title: 'Component Testing',
                description: 'A project to practice testing React components using React Testing Library.',
                technologies: ['React', 'Jest']
              }
            ],
            intermediate: [
              {
                title: 'Complex State Management',
                description: 'A project to practice managing complex state in React.',
                technologies: ['React']
              },
              {
                title: 'Context API',
                description: 'A project to practice using React Context API.',
                technologies: ['React']
              }
            ],
            advanced: [
              {
                title: 'Complex Promise Flow',
                description: 'A project to practice handling complex promise scenarios.',
                technologies: ['JavaScript']
              },
              {
                title: 'Async/Await with Fetch API',
                description: 'A project to practice fetching data using async/await.',
                technologies: ['JavaScript']
              }
            ]
          }
        },
        {
          id: 'performance',
          title: 'Performance Optimization',
          description: 'Memoization, lazy loading, code splitting',
          completed: false,
          estimatedHours: 12,
          difficulty: 'advanced',
          resources: ['React Documentation', 'React Performance', 'Official Documentation'],
          projects: {
            beginner: [
              {
                title: 'Memoization Basics',
                description: 'A project to practice memoization in React.',
                technologies: ['React']
              },
              {
                title: 'Lazy Loading',
                description: 'A project to practice lazy loading in React.',
                technologies: ['React']
              }
            ],
            intermediate: [
              {
                title: 'Complex State Management',
                description: 'A project to practice managing complex state in React.',
                technologies: ['React']
              },
              {
                title: 'Context API',
                description: 'A project to practice using React Context API.',
                technologies: ['React']
              }
            ],
            advanced: [
              {
                title: 'Complex Promise Flow',
                description: 'A project to practice handling complex promise scenarios.',
                technologies: ['JavaScript']
              },
              {
                title: 'Async/Await with Fetch API',
                description: 'A project to practice fetching data using async/await.',
                technologies: ['JavaScript']
              }
            ]
          }
        }
      ]
    },
    {
      id: 'modern-tools',
      title: 'Modern Development Tools',
      description: 'Build tools, package managers, and development workflow',
      icon: '🛠️',
      color: 'bg-gray-600',
      completed: false,
      order: 7,
      estimatedTotalHours: 80,
      subsections: [
        {
          id: 'package-managers',
          title: 'Package Managers & Dependencies',
          description: 'npm, yarn, pnpm, and dependency management',
          completed: false,
          estimatedHours: 12,
          difficulty: 'beginner',
          resources: ['npm Documentation', 'Yarn Documentation', 'pnpm Documentation', 'Package Management'],
          projects: {
            beginner: [
              {
                title: 'Package Manager Comparison',
                description: 'Compare npm, yarn, and pnpm for different project types',
                technologies: ['npm', 'Yarn', 'pnpm', 'Performance Analysis', 'Dependency Management']
              },
              {
                title: 'Custom Package Manager',
                description: 'Build a simple package manager for learning purposes',
                technologies: ['Node.js', 'Package Management', 'Dependency Resolution', 'CLI Tools']
              }
            ],
            intermediate: [
              {
                title: 'Monorepo Setup',
                description: 'Set up a monorepo with workspaces and shared dependencies',
                technologies: ['Monorepo', 'Workspaces', 'Shared Dependencies', 'Build Tools']
              },
              {
                title: 'Dependency Analyzer',
                description: 'Create a tool to analyze and optimize dependencies',
                technologies: ['Dependency Analysis', 'Bundle Size', 'Security Scanning', 'Optimization']
              }
            ],
            advanced: [
              {
                title: 'Package Manager Plugin',
                description: 'Build a plugin for a package manager with custom features',
                technologies: ['Plugin Development', 'Package Managers', 'Custom Features', 'Extension System']
              },
              {
                title: 'Dependency Graph Visualizer',
                description: 'Create a tool to visualize dependency relationships',
                technologies: ['Graph Visualization', 'Dependency Analysis', 'Interactive Tools', 'Data Visualization']
              }
            ]
          }
        },
        {
          id: 'build-tools',
          title: 'Build Tools & Bundlers',
          description: 'Webpack, Vite, Rollup, and modern build systems',
          completed: false,
          estimatedHours: 20,
          difficulty: 'intermediate',
          resources: ['Webpack Documentation', 'Vite Documentation', 'Rollup Documentation', 'Build Tools'],
          projects: {
            beginner: [
              {
                title: 'Webpack Configuration',
                description: 'Set up a custom Webpack configuration for a project',
                technologies: ['Webpack', 'Configuration', 'Loaders', 'Plugins', 'Build Optimization']
              },
              {
                title: 'Vite Plugin Development',
                description: 'Create a custom Vite plugin for specific functionality',
                technologies: ['Vite', 'Plugin Development', 'Build Tools', 'Custom Features']
              }
            ],
            intermediate: [
              {
                title: 'Multi-Environment Build System',
                description: 'Set up build configurations for different environments',
                technologies: ['Build Tools', 'Environment Configuration', 'Deployment', 'Optimization']
              },
              {
                title: 'Bundle Analyzer Tool',
                description: 'Create a comprehensive bundle analysis tool',
                technologies: ['Bundle Analysis', 'Performance Optimization', 'Visualization', 'Build Tools']
              }
            ],
            advanced: [
              {
                title: 'Custom Build System',
                description: 'Build a custom build system from scratch',
                technologies: ['Build Systems', 'Compiler Design', 'Module Resolution', 'Custom Tools']
              },
              {
                title: 'Build Performance Optimizer',
                description: 'Create tools to optimize build performance',
                technologies: ['Build Performance', 'Parallel Processing', 'Caching', 'Optimization']
              }
            ]
          }
        },
        {
          id: 'development-workflow',
          title: 'Development Workflow',
          description: 'Git workflows, CI/CD, and development practices',
          completed: false,
          estimatedHours: 16,
          difficulty: 'intermediate',
          resources: ['Git Workflows', 'CI/CD', 'Development Practices', 'Team Collaboration'],
          projects: {
            beginner: [
              {
                title: 'Git Workflow Automation',
                description: 'Automate common Git workflows with scripts',
                technologies: ['Git', 'Automation', 'Shell Scripting', 'Workflow Optimization']
              },
              {
                title: 'CI/CD Pipeline',
                description: 'Set up a complete CI/CD pipeline for a project',
                technologies: ['CI/CD', 'GitHub Actions', 'Automated Testing', 'Deployment']
              }
            ],
            intermediate: [
              {
                title: 'Development Environment Setup',
                description: 'Create automated development environment setup',
                technologies: ['DevOps', 'Environment Setup', 'Automation', 'Team Onboarding']
              },
              {
                title: 'Code Quality Tools',
                description: 'Set up comprehensive code quality tools',
                technologies: ['ESLint', 'Prettier', 'Husky', 'Code Quality', 'Automation']
              }
            ],
            advanced: [
              {
                title: 'Development Platform',
                description: 'Build a platform for managing development workflows',
                technologies: ['Development Platform', 'Workflow Management', 'Team Collaboration', 'Automation']
              },
              {
                title: 'AI-Powered Code Review',
                description: 'Implement AI-powered code review tools',
                technologies: ['AI/ML', 'Code Review', 'Automation', 'Quality Assurance']
              }
            ]
          }
        },
        {
          id: 'testing-tools',
          title: 'Testing Tools & Frameworks',
          description: 'Jest, Vitest, Playwright, and testing ecosystem',
          completed: false,
          estimatedHours: 16,
          difficulty: 'intermediate',
          resources: ['Jest Documentation', 'Vitest Documentation', 'Playwright Documentation', 'Testing'],
          projects: {
            beginner: [
              {
                title: 'Testing Framework Setup',
                description: 'Set up a comprehensive testing framework for a project',
                technologies: ['Jest', 'React Testing Library', 'Testing Setup', 'Test Configuration']
              },
              {
                title: 'E2E Testing Suite',
                description: 'Create a complete E2E testing suite with Playwright',
                technologies: ['Playwright', 'E2E Testing', 'Test Automation', 'Cross-browser Testing']
              }
            ],
            intermediate: [
              {
                title: 'Custom Testing Utilities',
                description: 'Build custom testing utilities for specific needs',
                technologies: ['Testing Utilities', 'Custom Tools', 'Test Helpers', 'Reusable Testing']
              },
              {
                title: 'Visual Regression Testing',
                description: 'Set up visual regression testing for UI components',
                technologies: ['Visual Testing', 'Screenshot Testing', 'UI Testing', 'Regression Detection']
              }
            ],
            advanced: [
              {
                title: 'Testing Platform',
                description: 'Build a comprehensive testing platform',
                technologies: ['Testing Platform', 'Test Management', 'Reporting', 'Analytics']
              },
              {
                title: 'Performance Testing Framework',
                description: 'Create a framework for performance testing',
                technologies: ['Performance Testing', 'Load Testing', 'Stress Testing', 'Benchmarking']
              }
            ]
          }
        },
        {
          id: 'debugging-tools',
          title: 'Debugging & Development Tools',
          description: 'Chrome DevTools, VS Code extensions, and debugging techniques',
          completed: false,
          estimatedHours: 16,
          difficulty: 'intermediate',
          resources: ['Chrome DevTools', 'VS Code Extensions', 'Debugging Techniques', 'Development Tools'],
          projects: {
            beginner: [
              {
                title: 'VS Code Extension',
                description: 'Create a custom VS Code extension for development',
                technologies: ['VS Code', 'Extension Development', 'TypeScript', 'Developer Tools']
              },
              {
                title: 'Debugging Guide',
                description: 'Create a comprehensive debugging guide and tools',
                technologies: ['Debugging', 'Documentation', 'Developer Tools', 'Troubleshooting']
              }
            ],
            intermediate: [
              {
                title: 'Custom DevTools Extension',
                description: 'Build a custom Chrome DevTools extension',
                technologies: ['Chrome DevTools', 'Extension Development', 'Debugging', 'Developer Tools']
              },
              {
                title: 'Performance Profiling Tool',
                description: 'Create a tool for performance profiling and analysis',
                technologies: ['Performance Profiling', 'Analysis Tools', 'Optimization', 'Developer Tools']
              }
            ],
            advanced: [
              {
                title: 'Debugging Platform',
                description: 'Build a comprehensive debugging platform',
                technologies: ['Debugging Platform', 'Remote Debugging', 'Collaboration', 'Developer Tools']
              },
              {
                title: 'AI-Powered Debugging',
                description: 'Implement AI-powered debugging assistance',
                technologies: ['AI/ML', 'Debugging', 'Error Analysis', 'Intelligent Assistance']
              }
            ]
          }
        }
      ]
    },
    {
      id: 'node-backend',
      title: 'Node.js & Backend Development',
      description: 'Server-side JavaScript and backend architecture',
      icon: '🟢',
      color: 'bg-green-500',
      completed: false,
      order: 8,
      estimatedTotalHours: 120,
      subsections: [
        {
          id: 'node-basics',
          title: 'Node.js Fundamentals',
          description: 'Event loop, streams, buffers, modules',
          completed: false,
          estimatedHours: 24,
          difficulty: 'intermediate',
          resources: ['Node.js Documentation', 'Node.js in Action', 'Official Documentation'],
          projects: {
            beginner: [
              {
                title: 'Simple HTTP Server',
                description: 'Build a basic HTTP server that handles different routes and HTTP methods',
                technologies: ['Node.js', 'HTTP Module', 'Routing', 'HTTP Methods', 'Server Creation', 'Basic Middleware']
              },
              {
                title: 'File System Manager',
                description: 'Create a tool that manages files and directories using Node.js fs module',
                technologies: ['Node.js', 'File System', 'CRUD Operations', 'Directory Management', 'File Operations', 'Error Handling']
              }
            ],
            intermediate: [
              {
                title: 'Stream Processing Pipeline',
                description: 'Implement a pipeline that processes data using Node.js streams',
                technologies: ['Node.js', 'Streams', 'Data Processing', 'Pipeline Pattern', 'Transform Streams', 'Backpressure']
              },
              {
                title: 'Event Emitter System',
                description: 'Build a custom event system using Node.js EventEmitter',
                technologies: ['Node.js', 'Event Emitter', 'Event Handling', 'Custom Events', 'Event Management', 'Asynchronous Events']
              },
              {
                title: 'Buffer Manipulation Tool',
                description: 'Create a tool for manipulating binary data using Node.js buffers',
                technologies: ['Node.js', 'Buffers', 'Binary Data', 'Data Manipulation', 'Encoding', 'Binary Operations']
              }
            ],
            advanced: [
              {
                title: 'Custom Module System',
                description: 'Implement a custom module loading system with dependency resolution',
                technologies: ['Node.js', 'Module System', 'Dependency Resolution', 'Module Loading', 'Custom Loaders', 'Module Management']
              },
              {
                title: 'Advanced Stream Framework',
                description: 'Build a framework for creating complex stream processing applications',
                technologies: ['Node.js', 'Stream Framework', 'Complex Processing', 'Stream Composition', 'Advanced Patterns', 'Framework Design']
              },
              {
                title: 'Performance Profiling Tool',
                description: 'Create a tool that profiles Node.js application performance',
                technologies: ['Node.js', 'Performance Profiling', 'Performance Analysis', 'Profiling Tools', 'Performance Metrics', 'Optimization']
              },
              {
                title: 'Memory Management System',
                description: 'Implement a system for monitoring and managing Node.js memory usage',
                technologies: ['Node.js', 'Memory Management', 'Memory Monitoring', 'Garbage Collection', 'Memory Optimization', 'Memory Analysis']
              },
              {
                title: 'Distributed Node.js Cluster',
                description: 'Build a system that manages multiple Node.js processes in a cluster',
                technologies: ['Node.js', 'Clustering', 'Process Management', 'Load Balancing', 'Inter-process Communication', 'Distributed Systems']
              }
            ]
          }
        },
        {
          id: 'express-framework',
          title: 'Express.js Framework',
          description: 'Routing, middleware, error handling, REST APIs',
          completed: false,
          estimatedHours: 32,
          difficulty: 'intermediate',
          resources: ['Express Documentation', 'Express Guide', 'Official Documentation'],
          projects: {
            beginner: [
              {
                title: 'Express Basics',
                description: 'A project to practice Express.js routing and middleware.',
                technologies: ['Express.js']
              },
              {
                title: 'Error Handling',
                description: 'A project to practice Express.js error handling and middleware.',
                technologies: ['Express.js']
              }
            ],
            intermediate: [
              {
                title: 'Advanced Routing',
                description: 'A project to practice Express.js advanced routing and middleware.',
                technologies: ['Express.js']
              },
              {
                title: 'API Design',
                description: 'A project to practice designing RESTful APIs with Express.js.',
                technologies: ['Express.js']
              }
            ],
            advanced: [
              {
                title: 'Complex Middleware',
                description: 'A project to practice building complex middleware pipelines.',
                technologies: ['Express.js']
              },
              {
                title: 'API Gateway',
                description: 'A project to practice building an API gateway with Express.js.',
                technologies: ['Express.js']
              }
            ]
          }
        },
        {
          id: 'authentication',
          title: 'Authentication & Authorization',
          description: 'JWT, OAuth, session management, security',
          completed: false,
          estimatedHours: 28,
          difficulty: 'intermediate',
          resources: ['JWT Documentation', 'OAuth Documentation', 'Security Best Practices'],
          projects: {
            beginner: [
              {
                title: 'JWT Authentication',
                description: 'A project to practice implementing JWT authentication.',
                technologies: ['Node.js', 'JWT']
              },
              {
                title: 'Session Management',
                description: 'A project to practice session management in Node.js.',
                technologies: ['Node.js']
              }
            ],
            intermediate: [
              {
                title: 'OAuth Integration',
                description: 'A project to practice integrating OAuth for authentication.',
                technologies: ['Node.js', 'OAuth']
              },
              {
                title: 'Security Middleware',
                description: 'A project to practice building secure middleware for authentication.',
                technologies: ['Express.js']
              }
            ],
            advanced: [
              {
                title: 'Complex Authentication Flow',
                description: 'A project to practice handling complex authentication flows.',
                technologies: ['Node.js']
              },
              {
                title: 'Advanced Security',
                description: 'A project to practice advanced security measures in Node.js.',
                technologies: ['Node.js']
              }
            ]
          }
        },
        {
          id: 'file-uploads',
          title: 'File Uploads & Processing',
          description: 'Multer, file validation, image processing',
          completed: false,
          estimatedHours: 20,
          difficulty: 'intermediate',
          resources: ['Multer Documentation', 'File Upload Best Practices', 'Official Documentation'],
          projects: {
            beginner: [
              {
                title: 'File Upload Basics',
                description: 'A project to practice file uploads using Multer.',
                technologies: ['Node.js', 'Multer']
              },
              {
                title: 'Image Processing',
                description: 'A project to practice image processing with Multer.',
                technologies: ['Node.js', 'Multer']
              }
            ],
            intermediate: [
              {
                title: 'Advanced File Handling',
                description: 'A project to practice advanced file handling and validation.',
                technologies: ['Node.js', 'Multer']
              },
              {
                title: 'Complex Image Processing',
                description: 'A project to practice complex image processing with Multer.',
                technologies: ['Node.js', 'Multer']
              }
            ],
            advanced: [
              {
                title: 'Large File Uploads',
                description: 'A project to practice handling large file uploads.',
                technologies: ['Node.js', 'Multer']
              },
              {
                title: 'Real-time Image Processing',
                description: 'A project to practice real-time image processing with Multer.',
                technologies: ['Node.js', 'Multer']
              }
            ]
          }
        },
        {
          id: 'testing-backend',
          title: 'Backend Testing',
          description: 'API testing, integration testing, supertest',
          completed: false,
          estimatedHours: 16,
          difficulty: 'intermediate',
          resources: ['Jest Documentation', 'Supertest Documentation', 'Testing Best Practices'],
          projects: {
            beginner: [
              {
                title: 'Jest Basics',
                description: 'A project to practice writing and running basic Jest tests.',
                technologies: ['Node.js', 'Jest']
              },
              {
                title: 'Supertest Basics',
                description: 'A project to practice API testing with Supertest.',
                technologies: ['Node.js', 'Supertest']
              }
            ],
            intermediate: [
              {
                title: 'Complex API Testing',
                description: 'A project to practice testing complex API endpoints.',
                technologies: ['Node.js', 'Jest', 'Supertest']
              },
              {
                title: 'Integration Testing',
                description: 'A project to practice integration testing with Supertest.',
                technologies: ['Node.js', 'Supertest']
              }
            ],
            advanced: [
              {
                title: 'Complex Promise Flow',
                description: 'A project to practice handling complex promise scenarios.',
                technologies: ['JavaScript']
              },
              {
                title: 'Async/Await with Fetch API',
                description: 'A project to practice fetching data using async/await.',
                technologies: ['JavaScript']
              }
            ]
          }
        }
      ]
    },
    {
      id: 'system-design',
      title: 'System Design & Architecture',
      description: 'Designing scalable, distributed systems and microservices architecture',
      icon: '🏗️',
      color: 'bg-indigo-600',
      completed: false,
      order: 10,
      estimatedTotalHours: 120,
      subsections: [
        {
          id: 'system-design-fundamentals',
          title: 'System Design Fundamentals',
          description: 'Scalability, availability, consistency, and distributed systems',
          completed: false,
          estimatedHours: 24,
          difficulty: 'advanced',
          resources: ['System Design Primer', 'Designing Data-Intensive Applications', 'System Design Interview', 'High Scalability'],
          projects: {
            beginner: [
              {
                title: 'URL Shortener System',
                description: 'Design and implement a URL shortening service',
                technologies: ['System Design', 'Database Design', 'Caching', 'Load Balancing', 'API Design']
              },
              {
                title: 'Chat Application',
                description: 'Build a real-time chat system with WebSocket',
                technologies: ['WebSocket', 'Real-time Communication', 'Message Queues', 'Scalability']
              }
            ],
            intermediate: [
              {
                title: 'Social Media Platform',
                description: 'Design a social media platform like Twitter',
                technologies: ['Microservices', 'Event Sourcing', 'CQRS', 'Distributed Systems', 'Data Sharding']
              },
              {
                title: 'E-commerce Platform',
                description: 'Build a scalable e-commerce system',
                technologies: ['Microservices', 'Payment Processing', 'Inventory Management', 'Order Processing']
              }
            ],
            advanced: [
              {
                title: 'Video Streaming Platform',
                description: 'Design a Netflix-like video streaming service',
                technologies: ['CDN', 'Video Processing', 'Content Delivery', 'Global Distribution', 'Adaptive Streaming']
              },
              {
                title: 'Ride-Sharing Platform',
                description: 'Build a Uber-like ride-sharing system',
                technologies: ['Real-time Matching', 'Geolocation', 'Payment Processing', 'Driver Management', 'Route Optimization']
              }
            ]
          }
        },
        {
          id: 'microservices-architecture',
          title: 'Microservices Architecture',
          description: 'Designing, implementing, and managing microservices',
          completed: false,
          estimatedHours: 28,
          difficulty: 'advanced',
          resources: ['Microservices Patterns', 'Building Microservices', 'Service Mesh', 'Kubernetes'],
          projects: {
            beginner: [
              {
                title: 'Microservices Demo',
                description: 'Build a simple microservices application',
                technologies: ['Docker', 'API Gateway', 'Service Communication', 'Container Orchestration']
              },
              {
                title: 'Service Discovery',
                description: 'Implement service discovery and load balancing',
                technologies: ['Service Discovery', 'Load Balancing', 'Health Checks', 'Service Registry']
              }
            ],
            intermediate: [
              {
                title: 'Event-Driven Architecture',
                description: 'Build an event-driven microservices system',
                technologies: ['Event Sourcing', 'CQRS', 'Message Queues', 'Event Streaming', 'Kafka']
              },
              {
                title: 'API Gateway',
                description: 'Implement a comprehensive API gateway',
                technologies: ['API Gateway', 'Authentication', 'Rate Limiting', 'Request Routing', 'Monitoring']
              }
            ],
            advanced: [
              {
                title: 'Service Mesh Implementation',
                description: 'Build a service mesh for microservices',
                technologies: ['Service Mesh', 'Istio', 'Envoy Proxy', 'Traffic Management', 'Security']
              },
              {
                title: 'Distributed Tracing System',
                description: 'Implement distributed tracing across microservices',
                technologies: ['Distributed Tracing', 'Jaeger', 'Zipkin', 'Observability', 'Performance Monitoring']
              }
            ]
          }
        },
        {
          id: 'cloud-native',
          title: 'Cloud-Native Development',
          description: 'Kubernetes, Docker, and cloud-native technologies',
          completed: false,
          estimatedHours: 32,
          difficulty: 'advanced',
          resources: ['Kubernetes Documentation', 'Docker Documentation', 'Cloud Native Computing', 'CNCF'],
          projects: {
            beginner: [
              {
                title: 'Docker Containerization',
                description: 'Containerize applications with Docker',
                technologies: ['Docker', 'Containerization', 'Multi-stage Builds', 'Docker Compose']
              },
              {
                title: 'Kubernetes Deployment',
                description: 'Deploy applications to Kubernetes cluster',
                technologies: ['Kubernetes', 'Pods', 'Services', 'Deployments', 'ConfigMaps']
              }
            ],
            intermediate: [
              {
                title: 'Kubernetes Operators',
                description: 'Build custom Kubernetes operators',
                technologies: ['Kubernetes Operators', 'Custom Resources', 'Controller Pattern', 'Go']
              },
              {
                title: 'Service Mesh with Istio',
                description: 'Implement service mesh with Istio',
                technologies: ['Istio', 'Service Mesh', 'Traffic Management', 'Security', 'Observability']
              }
            ],
            advanced: [
              {
                title: 'Cloud-Native Platform',
                description: 'Build a complete cloud-native platform',
                technologies: ['Platform Engineering', 'DevOps', 'Infrastructure as Code', 'GitOps']
              },
              {
                title: 'Multi-Cloud Orchestration',
                description: 'Create a platform that works across multiple clouds',
                technologies: ['Multi-Cloud', 'Cloud Agnostic', 'Orchestration', 'Hybrid Cloud']
              }
            ]
          }
        },
        {
          id: 'distributed-systems',
          title: 'Distributed Systems',
          description: 'Consensus algorithms, distributed databases, and fault tolerance',
          completed: false,
          estimatedHours: 36,
          difficulty: 'advanced',
          resources: ['Distributed Systems', 'Consensus Algorithms', 'CAP Theorem', 'Distributed Databases'],
          projects: {
            beginner: [
              {
                title: 'Distributed Key-Value Store',
                description: 'Build a simple distributed key-value store',
                technologies: ['Distributed Systems', 'Consistency', 'Replication', 'Network Communication']
              },
              {
                title: 'Leader Election Algorithm',
                description: 'Implement leader election in distributed systems',
                technologies: ['Consensus', 'Leader Election', 'Fault Tolerance', 'Distributed Algorithms']
              }
            ],
            intermediate: [
              {
                title: 'Distributed Cache',
                description: 'Build a distributed caching system',
                technologies: ['Distributed Cache', 'Consistency', 'Partitioning', 'Replication']
              },
              {
                title: 'Distributed Lock Service',
                description: 'Implement distributed locks for coordination',
                technologies: ['Distributed Locks', 'Coordination', 'Consensus', 'Fault Tolerance']
              }
            ],
            advanced: [
              {
                title: 'Distributed Database',
                description: 'Build a distributed database from scratch',
                technologies: ['Distributed Databases', 'ACID', 'Consistency Models', 'Transaction Management']
              },
              {
                title: 'Byzantine Fault Tolerance',
                description: 'Implement Byzantine fault-tolerant consensus',
                technologies: ['BFT', 'Consensus', 'Fault Tolerance', 'Cryptography']
              }
            ]
          }
        }
      ]
    },
    {
      id: 'ai-ml-fundamentals',
      title: 'Artificial Intelligence & Machine Learning',
      description: 'AI/ML fundamentals, deep learning, and practical applications',
      icon: '🤖',
      color: 'bg-pink-600',
      completed: false,
      order: 11,
      estimatedTotalHours: 160,
      subsections: [
        {
          id: 'ml-fundamentals',
          title: 'Machine Learning Fundamentals',
          description: 'Supervised learning, unsupervised learning, and model evaluation',
          completed: false,
          estimatedHours: 32,
          difficulty: 'intermediate',
          resources: ['Machine Learning Course', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib'],
          projects: {
            beginner: [
              {
                title: 'Predictive Analytics System',
                description: 'Build a system for predicting user behavior',
                technologies: ['Python', 'Scikit-learn', 'Pandas', 'NumPy', 'Predictive Modeling']
              },
              {
                title: 'Recommendation Engine',
                description: 'Create a recommendation system for products/content',
                technologies: ['Collaborative Filtering', 'Content-Based Filtering', 'Matrix Factorization', 'Python']
              }
            ],
            intermediate: [
              {
                title: 'Natural Language Processing',
                description: 'Build NLP models for text classification and analysis',
                technologies: ['NLP', 'Text Processing', 'Word Embeddings', 'Transformers', 'Python']
              },
              {
                title: 'Computer Vision System',
                description: 'Implement computer vision for image classification',
                technologies: ['Computer Vision', 'OpenCV', 'Convolutional Neural Networks', 'Image Processing']
              }
            ],
            advanced: [
              {
                title: 'AutoML Platform',
                description: 'Build an automated machine learning platform',
                technologies: ['AutoML', 'Hyperparameter Optimization', 'Model Selection', 'Automation']
              },
              {
                title: 'ML Model Deployment',
                description: 'Create a system for deploying ML models in production',
                technologies: ['Model Deployment', 'MLOps', 'Model Serving', 'Monitoring', 'Scalability']
              }
            ]
          }
        },
        {
          id: 'deep-learning',
          title: 'Deep Learning & Neural Networks',
          description: 'Neural networks, deep learning frameworks, and advanced AI',
          completed: false,
          estimatedHours: 40,
          difficulty: 'advanced',
          resources: ['Deep Learning Book', 'PyTorch', 'TensorFlow', 'Keras', 'FastAI'],
          projects: {
            beginner: [
              {
                title: 'Neural Network from Scratch',
                description: 'Implement neural networks without frameworks',
                technologies: ['Neural Networks', 'Backpropagation', 'Gradient Descent', 'Python', 'Mathematics']
              },
              {
                title: 'Image Classification with CNN',
                description: 'Build CNN for image classification tasks',
                technologies: ['Convolutional Neural Networks', 'PyTorch', 'Computer Vision', 'Transfer Learning']
              }
            ],
            intermediate: [
              {
                title: 'Natural Language Generation',
                description: 'Build a text generation system with RNNs/LSTMs',
                technologies: ['RNN', 'LSTM', 'Text Generation', 'Language Models', 'PyTorch']
              },
              {
                title: 'Generative Adversarial Networks',
                description: 'Implement GANs for image generation',
                technologies: ['GANs', 'Generative Models', 'Image Generation', 'Adversarial Training']
              }
            ],
            advanced: [
              {
                title: 'Transformer Architecture',
                description: 'Build transformer models from scratch',
                technologies: ['Transformers', 'Attention Mechanisms', 'BERT', 'GPT', 'PyTorch']
              },
              {
                title: 'Reinforcement Learning System',
                description: 'Implement RL algorithms for game playing',
                technologies: ['Reinforcement Learning', 'Q-Learning', 'Policy Gradients', 'Game AI']
              }
            ]
          }
        },
        {
          id: 'ai-applications-integration',
          title: 'AI Applications & Integration',
          description: 'Integrating AI into applications and building AI-powered products',
          completed: false,
          estimatedHours: 28,
          difficulty: 'advanced',
          resources: ['AI Integration', 'MLOps', 'AI Ethics', 'Responsible AI', 'AI Product Development'],
          projects: {
            beginner: [
              {
                title: 'AI Chatbot',
                description: 'Build an intelligent chatbot with NLP',
                technologies: ['NLP', 'Chatbot', 'Dialog Systems', 'API Integration', 'Web Development']
              },
              {
                title: 'AI-Powered Search',
                description: 'Implement semantic search with embeddings',
                technologies: ['Vector Search', 'Embeddings', 'Semantic Search', 'Information Retrieval']
              }
            ],
            intermediate: [
              {
                title: 'AI Content Generation',
                description: 'Build a system for generating content with AI',
                technologies: ['Content Generation', 'Language Models', 'Creative AI', 'Text Processing']
              },
              {
                title: 'AI-Powered Analytics',
                description: 'Create analytics platform with AI insights',
                technologies: ['Analytics', 'Data Visualization', 'Predictive Analytics', 'Business Intelligence']
              }
            ],
            advanced: [
              {
                title: 'AI Platform',
                description: 'Build a comprehensive AI platform for multiple use cases',
                technologies: ['AI Platform', 'Multi-Modal AI', 'API Management', 'Scalability', 'MLOps']
              },
              {
                title: 'AI Ethics Framework',
                description: 'Implement ethical AI practices and bias detection',
                technologies: ['AI Ethics', 'Bias Detection', 'Fairness', 'Responsible AI', 'Transparency']
              }
            ]
          }
        }
      ]
    },
    {
      id: 'blockchain',
      title: 'Blockchain & Web3 Development',
      description: 'Blockchain technology, smart contracts, and decentralized applications',
      icon: '⛓️',
      color: 'bg-orange-600',
      completed: false,
      order: 12,
      estimatedTotalHours: 100,
      subsections: [
        {
          id: 'blockchain-fundamentals',
          title: 'Blockchain Fundamentals',
          description: 'Cryptography, consensus mechanisms, and blockchain architecture',
          completed: false,
          estimatedHours: 24,
          difficulty: 'intermediate',
          resources: ['Blockchain Basics', 'Cryptography', 'Consensus Mechanisms', 'Bitcoin Whitepaper'],
          projects: {
            beginner: [
              {
                title: 'Simple Blockchain',
                description: 'Build a basic blockchain from scratch',
                technologies: ['Blockchain', 'Cryptography', 'Hashing', 'Proof of Work', 'Python']
              },
              {
                title: 'Cryptocurrency Wallet',
                description: 'Create a basic cryptocurrency wallet',
                technologies: ['Cryptography', 'Key Management', 'Digital Signatures', 'Wallet Security']
              }
            ],
            intermediate: [
              {
                title: 'Consensus Algorithm',
                description: 'Implement different consensus mechanisms',
                technologies: ['Consensus', 'Proof of Stake', 'Byzantine Fault Tolerance', 'Distributed Systems']
              },
              {
                title: 'Blockchain Explorer',
                description: 'Build a blockchain explorer for viewing transactions',
                technologies: ['Blockchain API', 'Web Development', 'Data Visualization', 'Real-time Updates']
              }
            ],
            advanced: [
              {
                title: 'Custom Blockchain',
                description: 'Design and implement a custom blockchain',
                technologies: ['Blockchain Design', 'Custom Consensus', 'Network Protocol', 'Scalability']
              },
              {
                title: 'Cross-Chain Bridge',
                description: 'Build a bridge between different blockchains',
                technologies: ['Cross-Chain', 'Interoperability', 'Smart Contracts', 'Security']
              }
            ]
          }
        },
        {
          id: 'smart-contracts-ethereum',
          title: 'Smart Contracts & DApps',
          description: 'Ethereum, Solidity, and decentralized application development',
          completed: false,
          estimatedHours: 32,
          difficulty: 'intermediate',
          resources: ['Ethereum Documentation', 'Solidity', 'Web3.js', 'Hardhat', 'OpenZeppelin'],
          projects: {
            beginner: [
              {
                title: 'Simple Smart Contract',
                description: 'Build basic smart contracts with Solidity',
                technologies: ['Solidity', 'Ethereum', 'Smart Contracts', 'Remix', 'Web3.js']
              },
              {
                title: 'Token Contract',
                description: 'Create ERC-20 and ERC-721 token contracts',
                technologies: ['ERC-20', 'ERC-721', 'Token Standards', 'NFTs', 'DeFi']
              }
            ],
            intermediate: [
              {
                title: 'DeFi Protocol',
                description: 'Build a decentralized finance protocol',
                technologies: ['DeFi', 'Yield Farming', 'Liquidity Pools', 'AMM', 'Smart Contracts']
              },
              {
                title: 'DAO Implementation',
                description: 'Create a decentralized autonomous organization',
                technologies: ['DAO', 'Governance', 'Voting Systems', 'Treasury Management']
              }
            ],
            advanced: [
              {
                title: 'Layer 2 Solution',
                description: 'Implement a Layer 2 scaling solution',
                technologies: ['Layer 2', 'Rollups', 'State Channels', 'Scalability', 'Optimization']
              },
              {
                title: 'Cross-Chain DApp',
                description: 'Build a decentralized app that works across chains',
                technologies: ['Cross-Chain', 'Multi-Chain', 'Interoperability', 'DApp Development']
              }
            ]
          }
        },
        {
          id: 'web3-development',
          title: 'Web3 Development',
          description: 'Building Web3 applications and integrating with blockchain',
          completed: false,
          estimatedHours: 24,
          difficulty: 'intermediate',
          resources: ['Web3 Development', 'MetaMask', 'IPFS', 'The Graph', 'Web3.js'],
          projects: {
            beginner: [
              {
                title: 'Web3 Wallet Integration',
                description: 'Integrate MetaMask with web applications',
                technologies: ['MetaMask', 'Web3.js', 'Wallet Integration', 'User Authentication']
              },
              {
                title: 'NFT Marketplace',
                description: 'Build an NFT marketplace with Web3',
                technologies: ['NFTs', 'IPFS', 'Marketplace', 'Digital Assets', 'Web3']
              }
            ],
            intermediate: [
              {
                title: 'DeFi Dashboard',
                description: 'Create a dashboard for DeFi protocols',
                technologies: ['DeFi', 'Data Aggregation', 'Real-time Data', 'Analytics', 'Web3']
              },
              {
                title: 'Decentralized Social Platform',
                description: 'Build a social platform on blockchain',
                technologies: ['Social Media', 'Content Ownership', 'Decentralization', 'User Privacy']
              }
            ],
            advanced: [
              {
                title: 'Web3 Infrastructure',
                description: 'Build infrastructure for Web3 applications',
                technologies: ['Infrastructure', 'Node Operation', 'Indexing', 'API Services', 'Scalability']
              },
              {
                title: 'Cross-Platform Web3 App',
                description: 'Create a Web3 app that works on web and mobile',
                technologies: ['Cross-Platform', 'Mobile Development', 'Web3', 'React Native', 'Flutter']
              }
            ]
          }
        }
      ]
    },
    {
      id: 'cybersecurity-engineering',
      title: 'Cybersecurity & Security Engineering',
      description: 'Security fundamentals, penetration testing, and secure development',
      icon: '🔒',
      color: 'bg-red-600',
      completed: false,
      order: 13,
      estimatedTotalHours: 120,
      subsections: [
        {
          id: 'security-fundamentals',
          title: 'Security Fundamentals',
          description: 'Cryptography, network security, and security principles',
          completed: false,
          estimatedHours: 24,
          difficulty: 'intermediate',
          resources: ['Security Fundamentals', 'Cryptography', 'Network Security', 'OWASP', 'Security Best Practices'],
          projects: {
            beginner: [
              {
                title: 'Password Manager',
                description: 'Build a secure password manager',
                technologies: ['Cryptography', 'Password Security', 'Encryption', 'Key Management']
              },
              {
                title: 'Secure Chat Application',
                description: 'Create an end-to-end encrypted chat app',
                technologies: ['End-to-End Encryption', 'Secure Communication', 'Key Exchange', 'Privacy']
              }
            ],
            intermediate: [
              {
                title: 'Security Scanner',
                description: 'Build a tool to scan for security vulnerabilities',
                technologies: ['Vulnerability Scanning', 'Security Testing', 'Automation', 'Penetration Testing']
              },
              {
                title: 'Intrusion Detection System',
                description: 'Implement a basic IDS for network monitoring',
                technologies: ['Network Security', 'Intrusion Detection', 'Monitoring', 'Alert Systems']
              }
            ],
            advanced: [
              {
                title: 'Security Framework',
                description: 'Create a comprehensive security framework',
                technologies: ['Security Framework', 'Threat Modeling', 'Risk Assessment', 'Security Architecture']
              },
              {
                title: 'Zero-Trust Architecture',
                description: 'Implement zero-trust security model',
                technologies: ['Zero-Trust', 'Identity Management', 'Access Control', 'Security Policies']
              }
            ]
          }
        },
        {
          id: 'web-security-owasp',
          title: 'Web Security & OWASP',
          description: 'Web application security, OWASP Top 10, and secure coding',
          completed: false,
          estimatedHours: 28,
          difficulty: 'intermediate',
          resources: ['OWASP Top 10', 'Web Security', 'Secure Coding', 'Security Testing', 'Penetration Testing'],
          projects: {
            beginner: [
              {
                title: 'Vulnerable Web App',
                description: 'Build a deliberately vulnerable app for learning',
                technologies: ['Web Vulnerabilities', 'Security Testing', 'Penetration Testing', 'Learning Platform']
              },
              {
                title: 'Security Headers Implementation',
                description: 'Implement comprehensive security headers',
                technologies: ['Security Headers', 'CSP', 'HTTPS', 'Security Hardening']
              }
            ],
            intermediate: [
              {
                title: 'Web Application Firewall',
                description: 'Build a WAF to protect web applications',
                technologies: ['WAF', 'Request Filtering', 'Attack Prevention', 'Security Monitoring']
              },
              {
                title: 'Security Testing Framework',
                description: 'Create automated security testing tools',
                technologies: ['Security Testing', 'Automation', 'Vulnerability Assessment', 'Continuous Security']
              }
            ],
            advanced: [
              {
                title: 'Advanced Persistent Threat Detection',
                description: 'Implement APT detection and response',
                technologies: ['APT Detection', 'Threat Intelligence', 'Incident Response', 'Forensics']
              },
              {
                title: 'Security Operations Center',
                description: 'Build a SOC for security monitoring',
                technologies: ['SOC', 'Security Monitoring', 'Incident Response', 'Threat Management']
              }
            ]
          }
        },
        {
          id: 'secure-development',
          title: 'Secure Development Practices',
          description: 'Secure coding, DevSecOps, and security in CI/CD',
          completed: false,
          estimatedHours: 20,
          difficulty: 'advanced',
          resources: ['Secure Development', 'DevSecOps', 'Security in CI/CD', 'Code Security', 'Security Automation'],
          projects: {
            beginner: [
              {
                title: 'Secure Code Review Tool',
                description: 'Build a tool for automated secure code review',
                technologies: ['Code Analysis', 'Security Scanning', 'Static Analysis', 'Automation']
              },
              {
                title: 'Security Linting Rules',
                description: 'Create custom security linting rules',
                technologies: ['Linting', 'Security Rules', 'Code Quality', 'Best Practices']
              }
            ],
            intermediate: [
              {
                title: 'DevSecOps Pipeline',
                description: 'Implement security in CI/CD pipeline',
                technologies: ['DevSecOps', 'CI/CD', 'Security Automation', 'Compliance']
              },
              {
                title: 'Security Compliance Framework',
                description: 'Build a framework for security compliance',
                technologies: ['Compliance', 'Security Standards', 'Auditing', 'Risk Management']
              }
            ],
            advanced: [
              {
                title: 'Security Platform',
                description: 'Create a comprehensive security platform',
                technologies: ['Security Platform', 'Threat Management', 'Incident Response', 'Security Analytics']
              },
              {
                title: 'AI-Powered Security',
                description: 'Implement AI for security threat detection',
                technologies: ['AI Security', 'Threat Detection', 'Machine Learning', 'Anomaly Detection']
              }
            ]
          }
        }
      ]
    },
    {
      id: 'databases',
      title: 'Database Design & Management',
      description: 'SQL, NoSQL, database design principles, and optimization',
      icon: '🗄️',
      color: 'bg-purple-500',
      completed: false,
      order: 9,
      estimatedTotalHours: 100,
      subsections: [
        {
          id: 'sql-basics',
          title: 'SQL Fundamentals',
          description: 'CRUD operations, joins, subqueries, transactions',
          completed: false,
          estimatedHours: 24,
          difficulty: 'intermediate',
          resources: ['SQL Tutorial', 'PostgreSQL Documentation', 'MySQL Documentation'],
          projects: {
            beginner: [
              {
                title: 'CRUD Operations',
                description: 'A project to practice basic CRUD operations in SQL.',
                technologies: ['SQL']
              },
              {
                title: 'Subqueries',
                description: 'A project to practice using subqueries in SQL.',
                technologies: ['SQL']
              }
            ],
            intermediate: [
              {
                title: 'Complex Queries',
                description: 'A project to practice writing complex SQL queries.',
                technologies: ['SQL']
              },
              {
                title: 'Transactions',
                description: 'A project to practice using transactions in SQL.',
                technologies: ['SQL']
              }
            ],
            advanced: [
              {
                title: 'Advanced Joins',
                description: 'A project to practice advanced SQL joins.',
                technologies: ['SQL']
              },
              {
                title: 'Complex Subqueries',
                description: 'A project to practice using complex subqueries.',
                technologies: ['SQL']
              }
            ]
          }
        },
        {
          id: 'database-design',
          title: 'Database Design Principles',
          description: 'Normalization, ER diagrams, relationships, constraints',
          completed: false,
          estimatedHours: 28,
          difficulty: 'intermediate',
          resources: ['Database Design', 'ER Modeling', 'Normalization Guide'],
          projects: {
            beginner: [
              {
                title: 'ER Diagram Basics',
                description: 'A project to practice creating ER diagrams.',
                technologies: ['Database Design']
              },
              {
                title: 'Normalization Exercise',
                description: 'A project to practice database normalization.',
                technologies: ['Database Design']
              }
            ],
            intermediate: [
              {
                title: 'Advanced Relationships',
                description: 'A project to practice advanced database relationships.',
                technologies: ['Database Design']
              },
              {
                title: 'Constraints',
                description: 'A project to practice using database constraints.',
                technologies: ['Database Design']
              }
            ],
            advanced: [
              {
                title: 'Complex ER Diagrams',
                description: 'A project to practice creating complex ER diagrams.',
                technologies: ['Database Design']
              },
              {
                title: 'Advanced Normalization',
                description: 'A project to practice advanced database normalization.',
                technologies: ['Database Design']
              }
            ]
          }
        },
        {
          id: 'nosql',
          title: 'NoSQL Databases',
          description: 'MongoDB, Redis, document stores, key-value stores',
          completed: false,
          estimatedHours: 24,
          difficulty: 'intermediate',
          resources: ['MongoDB Documentation', 'Redis Documentation', 'NoSQL Guide'],
          projects: {
            beginner: [
              {
                title: 'MongoDB Basics',
                description: 'A project to practice MongoDB CRUD operations.',
                technologies: ['MongoDB']
              },
              {
                title: 'Redis Basics',
                description: 'A project to practice Redis key-value operations.',
                technologies: ['Redis']
              }
            ],
            intermediate: [
              {
                title: 'Document Store',
                description: 'A project to practice MongoDB document store operations.',
                technologies: ['MongoDB']
              },
              {
                title: 'Key-Value Store',
                description: 'A project to practice Redis key-value store operations.',
                technologies: ['Redis']
              }
            ],
            advanced: [
              {
                title: 'Complex Document Queries',
                description: 'A project to practice complex MongoDB document queries.',
                technologies: ['MongoDB']
              },
              {
                title: 'Advanced Redis',
                description: 'A project to practice advanced Redis features.',
                technologies: ['Redis']
              }
            ]
          }
        },
        {
          id: 'orm-odm',
          title: 'ORM/ODM Tools',
          description: 'Sequelize, Mongoose, Prisma, database abstraction',
          completed: false,
          estimatedHours: 24,
          difficulty: 'intermediate',
          resources: ['Sequelize Documentation', 'Mongoose Documentation', 'Prisma Documentation'],
          projects: {
            beginner: [
              {
                title: 'Sequelize Basics',
                description: 'A project to practice Sequelize ORM.',
                technologies: ['Node.js', 'Sequelize']
              },
              {
                title: 'Mongoose Basics',
                description: 'A project to practice Mongoose ODM.',
                technologies: ['Node.js', 'Mongoose']
              }
            ],
            intermediate: [
              {
                title: 'Advanced ORM',
                description: 'A project to practice advanced ORM features.',
                technologies: ['Sequelize', 'Mongoose']
              },
              {
                title: 'Database Abstraction',
                description: 'A project to practice using database abstraction.',
                technologies: ['Sequelize', 'Mongoose']
              }
            ],
            advanced: [
              {
                title: 'Complex ORM',
                description: 'A project to practice building complex ORM models.',
                technologies: ['Sequelize', 'Mongoose']
              },
              {
                title: 'Advanced Abstraction',
                description: 'A project to practice advanced database abstraction.',
                technologies: ['Sequelize', 'Mongoose']
              }
            ]
          }
        }
      ]
    },
    {
      id: 'python-mastery',
      title: 'Python Programming & Data Science',
      description: 'Master Python for general programming, data science, and AI/ML',
      icon: '🐍',
      color: 'bg-green-500',
      completed: false,
      order: 8,
      estimatedTotalHours: 140,
      subsections: [
        {
          id: 'python-basics',
          title: 'Python Fundamentals',
          description: 'Variables, data types, control flow, functions, and OOP',
          completed: false,
          estimatedHours: 24,
          difficulty: 'beginner',
          resources: ['Python Documentation', 'Python Crash Course', 'Real Python Tutorials'],
          projects: {
            beginner: [
              {
                title: 'Personal Finance Tracker',
                description: 'Build a command-line application to track income, expenses, and savings',
                technologies: ['Python', 'Basic Types', 'Control Flow', 'Functions', 'File I/O', 'Data Structures']
              },
              {
                title: 'Simple Calculator with OOP',
                description: 'Create a calculator using object-oriented programming principles',
                technologies: ['Python', 'Classes', 'Objects', 'Methods', 'Inheritance', 'Encapsulation']
              }
            ],
            intermediate: [
              {
                title: 'Web Scraping Tool',
                description: 'Build a tool that scrapes websites and extracts structured data',
                technologies: ['Python', 'Web Scraping', 'HTTP Requests', 'HTML Parsing', 'Data Extraction', 'Error Handling']
              },
              {
                title: 'Data Analysis Dashboard',
                description: 'Create a dashboard for analyzing CSV data with charts and statistics',
                technologies: ['Python', 'Data Analysis', 'Pandas', 'Matplotlib', 'Data Visualization', 'Statistics']
              },
              {
                title: 'API Client Library',
                description: 'Implement a client library for interacting with REST APIs',
                technologies: ['Python', 'API Integration', 'HTTP Client', 'Authentication', 'Error Handling', 'Library Design']
              }
            ],
            advanced: [
              {
                title: 'Machine Learning Pipeline',
                description: 'Build a complete ML pipeline from data preprocessing to model deployment',
                technologies: ['Python', 'Machine Learning', 'Scikit-learn', 'Data Pipeline', 'Model Training', 'Deployment']
              },
              {
                title: 'Real-time Data Processing System',
                description: 'Create a system that processes streaming data in real-time',
                technologies: ['Python', 'Real-time Processing', 'Streaming', 'Data Processing', 'Performance', 'Scalability']
              },
              {
                title: 'Distributed Computing Framework',
                description: 'Implement a framework for distributed computing across multiple nodes',
                technologies: ['Python', 'Distributed Computing', 'Network Communication', 'Load Balancing', 'Fault Tolerance', 'Scalability']
              },
              {
                title: 'Natural Language Processing Engine',
                description: 'Build an NLP engine for text analysis and language understanding',
                technologies: ['Python', 'NLP', 'Text Processing', 'Language Models', 'Machine Learning', 'Text Analysis']
              },
              {
                title: 'Computer Vision Application',
                description: 'Create an application that processes and analyzes images and video',
                technologies: ['Python', 'Computer Vision', 'Image Processing', 'OpenCV', 'Deep Learning', 'Video Analysis']
              }
            ]
          }
        },
        {
          id: 'python-advanced',
          title: 'Advanced Python',
          description: 'Decorators, generators, context managers, metaclasses',
          completed: false,
          estimatedHours: 28,
          difficulty: 'intermediate',
          resources: ['Python Documentation', 'Fluent Python', 'Advanced Python Programming'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'Decorators',
                description: 'A project to practice Python decorators.',
                technologies: ['Python']
              },
              {
                title: 'Generators',
                description: 'A project to practice Python generators.',
                technologies: ['Python']
              }
            ],
            advanced: [
              {
                title: 'Context Managers',
                description: 'A project to practice Python context managers.',
                technologies: ['Python']
              },
              {
                title: 'Metaclasses',
                description: 'A project to practice Python metaclasses.',
                technologies: ['Python']
              }
            ]
          }
        },
        {
          id: 'python-data-science',
          title: 'Data Science with Python',
          description: 'NumPy, Pandas, Matplotlib, Seaborn, data manipulation',
          completed: false,
          estimatedHours: 32,
          difficulty: 'intermediate',
          resources: ['NumPy Documentation', 'Pandas Documentation', 'Data Science Handbook'],
          projects: {
            beginner: [
              {
                title: 'NumPy Basics',
                description: 'A project to practice NumPy for numerical computations.',
                technologies: ['NumPy']
              },
              {
                title: 'Pandas Basics',
                description: 'A project to practice Pandas for data manipulation.',
                technologies: ['Pandas']
              }
            ],
            intermediate: [
              {
                title: 'Data Analysis',
                description: 'A project to practice data analysis with NumPy and Pandas.',
                technologies: ['NumPy', 'Pandas']
              },
              {
                title: 'Matplotlib',
                description: 'A project to practice data visualization with Matplotlib.',
                technologies: ['Matplotlib']
              }
            ],
            advanced: [
              {
                title: 'Advanced Data Science',
                description: 'A project to practice advanced data science techniques.',
                technologies: ['NumPy', 'Pandas', 'Scikit-learn']
              },
              {
                title: 'Machine Learning',
                description: 'A project to practice machine learning with Scikit-learn.',
                technologies: ['Scikit-learn']
              }
            ]
          }
        },
        {
          id: 'python-web-frameworks',
          title: 'Python Web Frameworks',
          description: 'Django, Flask, FastAPI, web development with Python',
          completed: false,
          estimatedHours: 28,
          difficulty: 'intermediate',
          resources: ['Django Documentation', 'Flask Documentation', 'FastAPI Documentation'],
          projects: {
            beginner: [
              {
                title: 'Django Basics',
                description: 'A project to practice Django web development.',
                technologies: ['Django']
              },
              {
                title: 'Flask Basics',
                description: 'A project to practice Flask web development.',
                technologies: ['Flask']
              }
            ],
            intermediate: [
              {
                title: 'FastAPI',
                description: 'A project to practice FastAPI for web development.',
                technologies: ['FastAPI']
              },
              {
                title: 'Django ORM',
                description: 'A project to practice Django ORM and database models.',
                technologies: ['Django']
              }
            ],
            advanced: [
              {
                title: 'Complex Web Application',
                description: 'A project to practice building a complex web application with Django.',
                technologies: ['Django']
              },
              {
                title: 'Advanced FastAPI',
                description: 'A project to practice advanced FastAPI features.',
                technologies: ['FastAPI']
              }
            ]
          }
        },
        {
          id: 'python-testing',
          title: 'Python Testing & Best Practices',
          description: 'pytest, unittest, mocking, testing strategies',
          completed: false,
          estimatedHours: 16,
          difficulty: 'intermediate',
          resources: ['pytest Documentation', 'Python Testing', 'Testing Best Practices'],
          projects: {
            beginner: [
              {
                title: 'pytest Basics',
                description: 'A project to practice writing and running basic pytest tests.',
                technologies: ['Python', 'pytest']
              },
              {
                title: 'unittest Basics',
                description: 'A project to practice writing and running basic unittest tests.',
                technologies: ['Python', 'unittest']
              }
            ],
            intermediate: [
              {
                title: 'Mocking',
                description: 'A project to practice Python mocking.',
                technologies: ['Python']
              },
              {
                title: 'Testing Strategies',
                description: 'A project to practice testing strategies and best practices.',
                technologies: ['Python']
              }
            ],
            advanced: [
              {
                title: 'Complex Testing',
                description: 'A project to practice writing complex tests.',
                technologies: ['Python']
              },
              {
                title: 'Advanced Mocking',
                description: 'A project to practice advanced mocking techniques.',
                technologies: ['Python']
              }
            ]
          }
        },
        {
          id: 'python-automation',
          title: 'Python Automation & Scripting',
          description: 'Scripts, automation tools, system administration',
          completed: false,
          estimatedHours: 12,
          difficulty: 'intermediate',
          resources: ['Python Automation', 'Scripting Guide', 'System Administration'],
          projects: {
            beginner: [
              {
                title: 'Basic Scripting',
                description: 'A project to practice writing simple Python scripts.',
                technologies: ['Python']
              },
              {
                title: 'System Administration',
                description: 'A project to practice system administration tasks with Python.',
                technologies: ['Python']
              }
            ],
            intermediate: [
              {
                title: 'Automation Tools',
                description: 'A project to practice using automation tools.',
                technologies: ['Python']
              },
              {
                title: 'System Monitoring',
                description: 'A project to practice system monitoring scripts.',
                technologies: ['Python']
              }
            ],
            advanced: [
              {
                title: 'Complex Automation',
                description: 'A project to practice building complex automation pipelines.',
                technologies: ['Python']
              },
              {
                title: 'Advanced Scripting',
                description: 'A project to practice advanced scripting techniques.',
                technologies: ['Python']
              }
            ]
          }
        }
      ]
    },
    {
      id: 'api-design',
      title: 'API Design & REST Principles',
      description: 'RESTful API design, GraphQL, API documentation, and best practices',
      icon: '🔌',
      color: 'bg-indigo-500',
      completed: false,
      order: 9,
      estimatedTotalHours: 80,
      subsections: [
        {
          id: 'rest-principles',
          title: 'REST API Principles',
          description: 'HTTP methods, status codes, resource design',
          completed: false,
          estimatedHours: 20,
          difficulty: 'intermediate',
          resources: ['REST API Tutorial', 'HTTP Status Codes', 'REST Best Practices'],
          projects: {
            beginner: [
              {
                title: 'HTTP Methods',
                description: 'A project to practice different HTTP methods (GET, POST, PUT, DELETE).',
                technologies: ['HTTP']
              },
              {
                title: 'Status Codes',
                description: 'A project to practice understanding HTTP status codes.',
                technologies: ['HTTP']
              }
            ],
            intermediate: [
              {
                title: 'Resource Design',
                description: 'A project to practice designing RESTful resources.',
                technologies: ['REST']
              },
              {
                title: 'Error Handling',
                description: 'A project to practice designing error responses.',
                technologies: ['REST']
              }
            ],
            advanced: [
              {
                title: 'Advanced REST',
                description: 'A project to practice advanced REST principles and patterns.',
                technologies: ['REST']
              },
              {
                title: 'GraphQL',
                description: 'A project to practice GraphQL schema design.',
                technologies: ['GraphQL']
              }
            ]
          }
        },
        {
          id: 'api-design-patterns',
          title: 'API Design Patterns',
          description: 'Versioning, pagination, filtering, sorting',
          completed: false,
          estimatedHours: 24,
          difficulty: 'intermediate',
          resources: ['API Design Patterns', 'REST API Design', 'Best Practices Guide'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'Versioning',
                description: 'A project to practice API versioning.',
                technologies: ['REST']
              },
              {
                title: 'Pagination',
                description: 'A project to practice implementing pagination.',
                technologies: ['REST']
              }
            ],
            advanced: [
              {
                title: 'Filtering & Sorting',
                description: 'A project to practice implementing filtering and sorting.',
                technologies: ['REST']
              },
              {
                title: 'Advanced API Design',
                description: 'A project to practice advanced API design patterns.',
                technologies: ['REST']
              }
            ]
          }
        },
        {
          id: 'graphql',
          title: 'GraphQL',
          description: 'Schema design, resolvers, queries, mutations',
          completed: false,
          estimatedHours: 20,
          difficulty: 'advanced',
          resources: ['GraphQL Documentation', 'GraphQL Tutorial', 'Official Documentation'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'GraphQL Basics',
                description: 'A project to practice GraphQL schema and queries.',
                technologies: ['GraphQL']
              },
              {
                title: 'Resolvers',
                description: 'A project to practice implementing GraphQL resolvers.',
                technologies: ['GraphQL']
              }
            ],
            advanced: [
              {
                title: 'Complex Schema',
                description: 'A project to practice designing a complex GraphQL schema.',
                technologies: ['GraphQL']
              },
              {
                title: 'Advanced Mutations',
                description: 'A project to practice implementing advanced GraphQL mutations.',
                technologies: ['GraphQL']
              }
            ]
          }
        },
        {
          id: 'api-documentation',
          title: 'API Documentation',
          description: 'OpenAPI/Swagger, Postman, API testing',
          completed: false,
          estimatedHours: 16,
          difficulty: 'intermediate',
          resources: ['OpenAPI Documentation', 'Swagger Documentation', 'Postman Documentation'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'OpenAPI/Swagger',
                description: 'A project to practice documenting an API with OpenAPI/Swagger.',
                technologies: ['OpenAPI', 'Swagger']
              },
              {
                title: 'Postman Collection',
                description: 'A project to practice using Postman for API testing.',
                technologies: ['Postman']
              }
            ],
            advanced: [
              {
                title: 'Advanced Documentation',
                description: 'A project to practice creating advanced API documentation.',
                technologies: ['OpenAPI', 'Swagger']
              },
              {
                title: 'API Testing',
                description: 'A project to practice testing APIs using Postman.',
                technologies: ['Postman']
              }
            ]
          }
        }
      ]
    },
    {
      id: 'devops',
      title: 'DevOps & CI/CD',
      description: 'Docker, Kubernetes, CI/CD pipelines, and infrastructure as code',
      icon: '🐳',
      color: 'bg-blue-700',
      completed: false,
      order: 10,
      estimatedTotalHours: 120,
      subsections: [
        {
          id: 'docker',
          title: 'Docker & Containers',
          description: 'Containerization, Dockerfiles, Docker Compose',
          completed: false,
          estimatedHours: 32,
          difficulty: 'intermediate',
          resources: ['Docker Documentation', 'Docker Tutorial', 'Official Documentation'],
          projects: {
            beginner: [
              {
                title: 'Docker Basics',
                description: 'A project to practice Docker containerization.',
                technologies: ['Docker']
              },
              {
                title: 'Docker Compose',
                description: 'A project to practice Docker Compose for multi-container applications.',
                technologies: ['Docker', 'Docker Compose']
              }
            ],
            intermediate: [
              {
                title: 'Dockerfile',
                description: 'A project to practice creating Dockerfiles.',
                technologies: ['Docker']
              },
              {
                title: 'CI/CD Pipeline',
                description: 'A project to practice setting up a CI/CD pipeline with Docker.',
                technologies: ['Docker', 'GitHub Actions']
              }
            ],
            advanced: [
              {
                title: 'Complex Docker',
                description: 'A project to practice building complex Docker images and containers.',
                technologies: ['Docker']
              },
              {
                title: 'Kubernetes',
                description: 'A project to practice deploying applications with Kubernetes.',
                technologies: ['Kubernetes']
              }
            ]
          }
        },
        {
          id: 'kubernetes',
          title: 'Kubernetes',
          description: 'Container orchestration, pods, services, deployments',
          completed: false,
          estimatedHours: 40,
          difficulty: 'advanced',
          resources: ['Kubernetes Documentation', 'Kubernetes Tutorial', 'Official Documentation'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'Kubernetes Basics',
                description: 'A project to practice Kubernetes pod, service, and deployment concepts.',
                technologies: ['Kubernetes']
              },
              {
                title: 'Minikube',
                description: 'A project to practice deploying applications locally with Minikube.',
                technologies: ['Kubernetes']
              }
            ],
            advanced: [
              {
                title: 'Complex Deployment',
                description: 'A project to practice deploying complex applications with Kubernetes.',
                technologies: ['Kubernetes']
              },
              {
                title: 'Service Mesh',
                description: 'A project to practice implementing a service mesh.',
                technologies: ['Kubernetes']
              }
            ]
          }
        },
        {
          id: 'ci-cd',
          title: 'CI/CD Pipelines',
          description: 'GitHub Actions, Jenkins, GitLab CI, automated deployment',
          completed: false,
          estimatedHours: 32,
          difficulty: 'intermediate',
          resources: ['GitHub Actions', 'Jenkins Documentation', 'GitLab CI Documentation'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'GitHub Actions Basics',
                description: 'A project to practice setting up GitHub Actions for CI/CD.',
                technologies: ['GitHub Actions']
              },
              {
                title: 'Jenkins Basics',
                description: 'A project to practice setting up Jenkins for CI/CD.',
                technologies: ['Jenkins']
              }
            ],
            advanced: [
              {
                title: 'Complex Pipeline',
                description: 'A project to practice setting up a complex CI/CD pipeline.',
                technologies: ['GitHub Actions', 'Jenkins', 'GitLab CI']
              },
              {
                title: 'Infrastructure as Code',
                description: 'A project to practice using Terraform for infrastructure automation.',
                technologies: ['Terraform']
              }
            ]
          }
        },
        {
          id: 'infrastructure',
          title: 'Infrastructure as Code',
          description: 'Terraform, CloudFormation, infrastructure automation',
          completed: false,
          estimatedHours: 16,
          difficulty: 'advanced',
          resources: ['Terraform Documentation', 'AWS CloudFormation', 'Official Documentation'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'Terraform Basics',
                description: 'A project to practice Terraform for infrastructure automation.',
                technologies: ['Terraform']
              },
              {
                title: 'AWS Basics',
                description: 'A project to practice AWS EC2, S3, Lambda, RDS, CloudFormation.',
                technologies: ['AWS']
              }
            ],
            advanced: [
              {
                title: 'Complex Infrastructure',
                description: 'A project to practice building complex infrastructure with Terraform.',
                technologies: ['Terraform']
              },
              {
                title: 'Cloud Security',
                description: 'A project to practice securing cloud infrastructure.',
                technologies: ['AWS']
              }
            ]
          }
        }
      ]
    },
    {
      id: 'cloud',
      title: 'Cloud Computing & Services',
      description: 'AWS, Azure, GCP, serverless, and cloud-native development',
      icon: '☁️',
      color: 'bg-sky-500',
      completed: false,
      order: 11,
      estimatedTotalHours: 140,
      subsections: [
        {
          id: 'aws-basics',
          title: 'AWS Fundamentals',
          description: 'EC2, S3, Lambda, RDS, CloudFormation',
          completed: false,
          estimatedHours: 40,
          difficulty: 'intermediate',
          resources: ['AWS Documentation', 'AWS Tutorial', 'Official Documentation'],
          projects: {
            beginner: [
              {
                title: 'AWS Basics',
                description: 'A project to practice AWS EC2, S3, Lambda, RDS, CloudFormation.',
                technologies: ['AWS']
              },
              {
                title: 'Serverless Basics',
                description: 'A project to practice AWS Lambda and API Gateway for serverless applications.',
                technologies: ['AWS']
              }
            ],
            intermediate: [
              {
                title: 'AWS Architecture',
                description: 'A project to practice designing scalable AWS architectures.',
                technologies: ['AWS']
              },
              {
                title: 'Serverless Architecture',
                description: 'A project to practice building serverless architectures.',
                technologies: ['AWS']
              }
            ],
            advanced: [
              {
                title: 'Complex Cloud Infrastructure',
                description: 'A project to practice building complex cloud infrastructure with AWS.',
                technologies: ['AWS']
              },
              {
                title: 'Advanced Serverless',
                description: 'A project to practice advanced serverless patterns.',
                technologies: ['AWS']
              }
            ]
          }
        },
        {
          id: 'serverless',
          title: 'Serverless Architecture',
          description: 'Lambda functions, API Gateway, serverless frameworks',
          completed: false,
          estimatedHours: 32,
          difficulty: 'advanced',
          resources: ['AWS Lambda Documentation', 'Serverless Framework', 'Official Documentation'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'Serverless Basics',
                description: 'A project to practice AWS Lambda and API Gateway for serverless applications.',
                technologies: ['AWS']
              },
              {
                title: 'Serverless Frameworks',
                description: 'A project to practice using serverless frameworks (e.g., Serverless, Zappa).',
                technologies: ['Serverless']
              }
            ],
            advanced: [
              {
                title: 'Complex Serverless',
                description: 'A project to practice building complex serverless applications.',
                technologies: ['AWS']
              },
              {
                title: 'Advanced Serverless',
                description: 'A project to practice advanced serverless patterns.',
                technologies: ['AWS']
              }
            ]
          }
        },
        {
          id: 'microservices',
          title: 'Microservices Architecture',
          description: 'Service design, communication, monitoring, deployment',
          completed: false,
          estimatedHours: 36,
          difficulty: 'advanced',
          resources: ['Microservices Guide', 'Service Mesh', 'Official Documentation'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'Microservices Basics',
                description: 'A project to practice microservices architecture concepts.',
                technologies: ['Microservices']
              },
              {
                title: 'Service Communication',
                description: 'A project to practice service-to-service communication.',
                technologies: ['Microservices']
              }
            ],
            advanced: [
              {
                title: 'Complex Microservices',
                description: 'A project to practice building complex microservices.',
                technologies: ['Microservices']
              },
              {
                title: 'Advanced Monitoring',
                description: 'A project to practice implementing advanced monitoring.',
                technologies: ['Microservices']
              }
            ]
          }
        },
        {
          id: 'cloud-security',
          title: 'Cloud Security',
          description: 'IAM, VPC, security groups, compliance',
          completed: false,
          estimatedHours: 32,
          difficulty: 'advanced',
          resources: ['AWS Security', 'Cloud Security Best Practices', 'Official Documentation'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'AWS Security Basics',
                description: 'A project to practice AWS IAM, VPC, security groups, and compliance.',
                technologies: ['AWS']
              },
              {
                title: 'Cloud Security',
                description: 'A project to practice securing cloud infrastructure.',
                technologies: ['AWS']
              }
            ],
            advanced: [
              {
                title: 'Advanced Security',
                description: 'A project to practice advanced security measures in cloud environments.',
                technologies: ['AWS']
              },
              {
                title: 'Compliance',
                description: 'A project to practice achieving cloud compliance.',
                technologies: ['AWS']
              }
            ]
          }
        }
      ]
    },
    {
      id: 'web3',
      title: 'Web3 & Blockchain Development',
      description: 'Smart contracts, DeFi, NFTs, and decentralized applications',
      icon: '⛓️',
      color: 'bg-orange-500',
      completed: false,
      order: 12,
      estimatedTotalHours: 100,
      subsections: [
        {
          id: 'blockchain-basics',
          title: 'Blockchain Fundamentals',
          description: 'Cryptography, consensus mechanisms, blockchain architecture',
          completed: false,
          estimatedHours: 24,
          difficulty: 'intermediate',
          resources: ['Blockchain Basics', 'Cryptography Guide', 'Official Documentation'],
          projects: {
            beginner: [
              {
                title: 'Cryptography Basics',
                description: 'A project to practice cryptographic concepts (hashing, encryption).',
                technologies: ['Cryptography']
              },
              {
                title: 'Consensus Mechanisms',
                description: 'A project to practice understanding consensus mechanisms.',
                technologies: ['Blockchain']
              }
            ],
            intermediate: [
              {
                title: 'Blockchain Architecture',
                description: 'A project to practice blockchain architecture and design.',
                technologies: ['Blockchain']
              },
              {
                title: 'Smart Contract Basics',
                description: 'A project to practice writing simple smart contracts.',
                technologies: ['Solidity']
              }
            ],
            advanced: [
              {
                title: 'Advanced Cryptography',
                description: 'A project to practice advanced cryptographic techniques.',
                technologies: ['Cryptography']
              },
              {
                title: 'Advanced Smart Contracts',
                description: 'A project to practice building advanced smart contracts.',
                technologies: ['Solidity']
              }
            ]
          }
        },
        {
          id: 'smart-contracts',
          title: 'Smart Contract Development',
          description: 'Solidity, Ethereum, contract design, security',
          completed: false,
          estimatedHours: 32,
          difficulty: 'advanced',
          resources: ['Solidity Documentation', 'Ethereum Documentation', 'Smart Contract Security'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'Solidity Basics',
                description: 'A project to practice writing simple Solidity contracts.',
                technologies: ['Solidity']
              },
              {
                title: 'Ethereum Basics',
                description: 'A project to practice Ethereum smart contract concepts.',
                technologies: ['Ethereum']
              }
            ],
            advanced: [
              {
                title: 'Advanced Smart Contracts',
                description: 'A project to practice building advanced smart contracts.',
                technologies: ['Solidity']
              },
              {
                title: 'Security',
                description: 'A project to practice securing smart contracts.',
                technologies: ['Solidity']
              }
            ]
          }
        },
        {
          id: 'defi',
          title: 'DeFi Protocols',
          description: 'Lending, DEX, yield farming, liquidity pools',
          completed: false,
          estimatedHours: 24,
          difficulty: 'advanced',
          resources: ['DeFi Guide', 'Protocol Documentation', 'Official Documentation'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'DeFi Basics',
                description: 'A project to practice DeFi concepts (lending, yield farming).',
                technologies: ['DeFi']
              },
              {
                title: 'DEX',
                description: 'A project to practice decentralized exchange concepts.',
                technologies: ['DeFi']
              }
            ],
            advanced: [
              {
                title: 'Advanced DeFi',
                description: 'A project to practice building advanced DeFi protocols.',
                technologies: ['DeFi']
              },
              {
                title: 'Complex Liquidity Pools',
                description: 'A project to practice building complex liquidity pools.',
                technologies: ['DeFi']
              }
            ]
          }
        },
        {
          id: 'nft-development',
          title: 'NFT Development',
          description: 'ERC standards, metadata, marketplace development',
          completed: false,
          estimatedHours: 20,
          difficulty: 'advanced',
          resources: ['ERC Standards', 'NFT Development Guide', 'Official Documentation'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'NFT Basics',
                description: 'A project to practice NFT concepts (ERC-721, ERC-1155).',
                technologies: ['NFT']
              },
              {
                title: 'Marketplace Basics',
                description: 'A project to practice building a basic NFT marketplace.',
                technologies: ['NFT']
              }
            ],
            advanced: [
              {
                title: 'Advanced NFT',
                description: 'A project to practice building advanced NFTs.',
                technologies: ['NFT']
              },
              {
                title: 'Complex Marketplace',
                description: 'A project to practice building a complex NFT marketplace.',
                technologies: ['NFT']
              }
            ]
          }
        }
      ]
    },
    {
      id: 'ai-ml',
      title: 'Artificial Intelligence & Machine Learning',
      description: 'ML algorithms, neural networks, deep learning, and AI applications',
      icon: '🤖',
      color: 'bg-pink-500',
      completed: false,
      order: 13,
      estimatedTotalHours: 160,
      subsections: [
        {
          id: 'ml-basics',
          title: 'Machine Learning Fundamentals',
          description: 'Supervised learning, unsupervised learning, model evaluation',
          completed: false,
          estimatedHours: 32,
          difficulty: 'intermediate',
          resources: ['Scikit-learn Documentation', 'Machine Learning Mastery', 'Hands-on ML'],
          projects: {
            beginner: [
              {
                title: 'House Price Predictor',
                description: 'Build a linear regression model to predict house prices based on features',
                technologies: ['Python', 'Scikit-learn', 'Linear Regression', 'Data Preprocessing', 'Model Evaluation', 'Pandas']
              },
              {
                title: 'Iris Flower Classifier',
                description: 'Create a classification model to identify different types of iris flowers',
                technologies: ['Python', 'Scikit-learn', 'Classification', 'Decision Trees', 'Model Training', 'Accuracy Metrics']
              }
            ],
            intermediate: [
              {
                title: 'Customer Segmentation Tool',
                description: 'Implement clustering algorithms to segment customers based on behavior',
                technologies: ['Python', 'Scikit-learn', 'Clustering', 'K-means', 'Data Visualization', 'Customer Analytics']
              },
              {
                title: 'Credit Card Fraud Detector',
                description: 'Build a model to detect fraudulent credit card transactions',
                technologies: ['Python', 'Scikit-learn', 'Anomaly Detection', 'Imbalanced Data', 'Feature Engineering', 'Model Validation']
              },
              {
                title: 'Recommendation System',
                description: 'Create a collaborative filtering recommendation system for products or movies',
                technologies: ['Python', 'Scikit-learn', 'Collaborative Filtering', 'Matrix Factorization', 'Recommendation Algorithms', 'User Behavior']
              }
            ],
            advanced: [
              {
                title: 'AutoML Framework',
                description: 'Build an automated machine learning framework that selects the best model and hyperparameters',
                technologies: ['Python', 'AutoML', 'Hyperparameter Optimization', 'Model Selection', 'Automation', 'Framework Design']
              },
              {
                title: 'Real-time ML Pipeline',
                description: 'Implement a real-time machine learning pipeline for streaming data',
                technologies: ['Python', 'Real-time ML', 'Streaming Data', 'Model Serving', 'Performance Optimization', 'Scalability']
              },
              {
                title: 'Federated Learning System',
                description: 'Create a federated learning system that trains models across distributed data sources',
                technologies: ['Python', 'Federated Learning', 'Distributed ML', 'Privacy-Preserving ML', 'Model Aggregation', 'Security']
              },
              {
                title: 'Explainable AI Framework',
                description: 'Build a framework for explaining machine learning model decisions',
                technologies: ['Python', 'Explainable AI', 'Model Interpretation', 'SHAP', 'LIME', 'Transparency']
              },
              {
                title: 'ML Model Monitoring Platform',
                description: 'Create a platform that monitors ML models in production for drift and performance',
                technologies: ['Python', 'ML Monitoring', 'Model Drift', 'Performance Tracking', 'Alerting', 'Production ML']
              }
            ]
          }
        },
        {
          id: 'deep-learning-advanced',
          title: 'Deep Learning & Neural Networks',
          description: 'TensorFlow, PyTorch, CNN, RNN, transformers',
          completed: false,
          estimatedHours: 48,
          difficulty: 'advanced',
          resources: ['TensorFlow Documentation', 'PyTorch Documentation', 'Deep Learning Book'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'Deep Learning Basics',
                description: 'A project to practice deep learning fundamentals (CNN, RNN).',
                technologies: ['TensorFlow', 'PyTorch']
              },
              {
                title: 'Transformers',
                description: 'A project to practice using transformers for NLP.',
                technologies: ['TensorFlow', 'PyTorch']
              }
            ],
            advanced: [
              {
                title: 'Advanced Deep Learning',
                description: 'A project to practice building advanced deep learning models.',
                technologies: ['TensorFlow', 'PyTorch']
              },
              {
                title: 'Advanced NLP',
                description: 'A project to practice advanced NLP techniques.',
                technologies: ['TensorFlow', 'PyTorch']
              }
            ]
          }
        },
        {
          id: 'nlp',
          title: 'Natural Language Processing',
          description: 'Text processing, sentiment analysis, language models',
          completed: false,
          estimatedHours: 32,
          difficulty: 'advanced',
          resources: ['NLP Guide', 'Hugging Face', 'Official Documentation'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'NLP Basics',
                description: 'A project to practice natural language processing fundamentals.',
                technologies: ['NLP']
              },
              {
                title: 'Sentiment Analysis',
                description: 'A project to practice sentiment analysis.',
                technologies: ['NLP']
              }
            ],
            advanced: [
              {
                title: 'Advanced NLP',
                description: 'A project to practice advanced NLP techniques.',
                technologies: ['NLP']
              },
              {
                title: 'Advanced Language Models',
                description: 'A project to practice using advanced language models.',
                technologies: ['Hugging Face']
              }
            ]
          }
        },
        {
          id: 'computer-vision-basic',
          title: 'Computer Vision',
          description: 'Image processing, object detection, image classification',
          completed: false,
          estimatedHours: 32,
          difficulty: 'advanced',
          resources: ['OpenCV Documentation', 'Computer Vision Guide', 'Official Documentation'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'Computer Vision Basics',
                description: 'A project to practice computer vision fundamentals (image processing, object detection).',
                technologies: ['OpenCV']
              },
              {
                title: 'Image Classification',
                description: 'A project to practice image classification.',
                technologies: ['OpenCV']
              }
            ],
            advanced: [
              {
                title: 'Advanced Computer Vision',
                description: 'A project to practice building advanced computer vision models.',
                technologies: ['OpenCV']
              },
              {
                title: 'Advanced Object Detection',
                description: 'A project to practice advanced object detection techniques.',
                technologies: ['OpenCV']
              }
            ]
          }
        },
        {
          id: 'ai-applications',
          title: 'AI Applications & Integration',
          description: 'AI APIs, model deployment, production systems',
          completed: false,
          estimatedHours: 16,
          difficulty: 'advanced',
          resources: ['AI API Documentation', 'Model Deployment Guide', 'Official Documentation'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'AI Basics',
                description: 'A project to practice AI concepts (API integration, model deployment).',
                technologies: ['AI']
              },
              {
                title: 'Model Deployment',
                description: 'A project to practice deploying AI models.',
                technologies: ['AI']
              }
            ],
            advanced: [
              {
                title: 'Complex AI',
                description: 'A project to practice building complex AI applications.',
                technologies: ['AI']
              },
              {
                title: 'Advanced AI',
                description: 'A project to practice advanced AI applications.',
                technologies: ['AI']
              }
            ]
          }
        }
      ]
    },
    {
      id: 'system-design-advanced',
      title: 'System Design & Architecture',
      description: 'Scalable system design, distributed systems, and architecture patterns',
      icon: '🏗️',
      color: 'bg-gray-600',
      completed: false,
      order: 14,
      estimatedTotalHours: 120,
      subsections: [
        {
          id: 'scalability',
          title: 'Scalability & Performance',
          description: 'Load balancing, caching, CDN, horizontal scaling',
          completed: false,
          estimatedHours: 32,
          difficulty: 'advanced',
          resources: ['System Design Primer', 'Scalability Guide', 'Performance Best Practices'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'Scalability Basics',
                description: 'A project to practice scalability concepts (load balancing, caching).',
                technologies: ['System Design']
              },
              {
                title: 'Performance Optimization',
                description: 'A project to practice optimizing system performance.',
                technologies: ['System Design']
              }
            ],
            advanced: [
              {
                title: 'Advanced Scalability',
                description: 'A project to practice building scalable systems.',
                technologies: ['System Design']
              },
              {
                title: 'Performance Engineering',
                description: 'A project to practice performance engineering.',
                technologies: ['System Design']
              }
            ]
          }
        },
        {
          id: 'distributed-systems-advanced',
          title: 'Distributed Systems',
          description: 'Consistency, availability, partition tolerance, CAP theorem',
          completed: false,
          estimatedHours: 36,
          difficulty: 'advanced',
          resources: ['Distributed Systems Guide', 'CAP Theorem', 'Official Documentation'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'Distributed Systems Basics',
                description: 'A project to practice distributed systems concepts (consistency, availability).',
                technologies: ['Distributed Systems']
              },
              {
                title: 'CAP Theorem',
                description: 'A project to practice understanding the CAP theorem.',
                technologies: ['Distributed Systems']
              }
            ],
            advanced: [
              {
                title: 'Advanced Distributed Systems',
                description: 'A project to practice building scalable distributed systems.',
                technologies: ['Distributed Systems']
              },
              {
                title: 'Advanced CAP',
                description: 'A project to practice advanced CAP theorem concepts.',
                technologies: ['Distributed Systems']
              }
            ]
          }
        },
        {
          id: 'design-patterns',
          title: 'Architecture Patterns',
          description: 'MVC, MVP, MVVM, clean architecture, hexagonal architecture',
          completed: false,
          estimatedHours: 28,
          difficulty: 'advanced',
          resources: ['Architecture Patterns', 'Clean Architecture', 'Official Documentation'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'MVC Basics',
                description: 'A project to practice MVC architecture.',
                technologies: ['MVC']
              },
              {
                title: 'MVVM',
                description: 'A project to practice MVVM architecture.',
                technologies: ['MVVM']
              }
            ],
            advanced: [
              {
                title: 'Advanced Patterns',
                description: 'A project to practice building complex architectures.',
                technologies: ['Architecture Patterns']
              },
              {
                title: 'Clean Architecture',
                description: 'A project to practice implementing clean architecture.',
                technologies: ['Architecture Patterns']
              }
            ]
          }
        },
        {
          id: 'monitoring',
          title: 'Monitoring & Observability',
          description: 'Logging, metrics, tracing, alerting, dashboards',
          completed: false,
          estimatedHours: 24,
          difficulty: 'advanced',
          resources: ['Monitoring Guide', 'Observability Best Practices', 'Official Documentation'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'Monitoring Basics',
                description: 'A project to practice monitoring and observability concepts.',
                technologies: ['Monitoring']
              },
              {
                title: 'Alerting',
                description: 'A project to practice setting up alerts.',
                technologies: ['Monitoring']
              }
            ],
            advanced: [
              {
                title: 'Advanced Monitoring',
                description: 'A project to practice implementing advanced monitoring.',
                technologies: ['Monitoring']
              },
              {
                title: 'Observability',
                description: 'A project to practice achieving observability.',
                technologies: ['Monitoring']
              }
            ]
          }
        }
      ]
    },
    {
      id: 'mobile-development',
      title: 'Mobile Development & Cross-Platform',
      description: 'React Native, Flutter, native iOS/Android, and mobile frameworks',
      icon: '📱',
      color: 'bg-green-600',
      completed: false,
      order: 15,
      estimatedTotalHours: 160,
      subsections: [
        {
          id: 'react-native',
          title: 'React Native Mastery',
          description: 'Cross-platform mobile development, navigation, state management',
          completed: false,
          estimatedHours: 40,
          difficulty: 'intermediate',
          resources: ['React Native Documentation', 'Expo Documentation', 'React Navigation'],
          projects: {
            beginner: [
              {
                title: 'Todo List App',
                description: 'Build a cross-platform todo app with local storage and basic CRUD operations',
                technologies: ['React Native', 'Cross-platform', 'Local Storage', 'CRUD Operations', 'Basic UI', 'State Management']
              },
              {
                title: 'Weather App',
                description: 'Create a weather app that fetches data from APIs and displays current conditions',
                technologies: ['React Native', 'API Integration', 'Data Fetching', 'Weather APIs', 'UI Components', 'Async Operations']
              }
            ],
            intermediate: [
              {
                title: 'E-commerce Mobile App',
                description: 'Build a mobile e-commerce app with product catalog, cart, and checkout',
                technologies: ['React Native', 'E-commerce', 'Product Management', 'Shopping Cart', 'Payment Integration', 'State Management']
              },
              {
                title: 'Social Media App',
                description: 'Create a social media app with posts, likes, comments, and user profiles',
                technologies: ['React Native', 'Social Features', 'Real-time Updates', 'User Authentication', 'Content Management', 'Social Interactions']
              },
              {
                title: 'Fitness Tracking App',
                description: 'Implement a fitness app that tracks workouts, progress, and health metrics',
                technologies: ['React Native', 'Fitness Tracking', 'Health Metrics', 'Progress Monitoring', 'Data Visualization', 'Health APIs']
              }
            ],
            advanced: [
              {
                title: 'Real-time Chat Application',
                description: 'Build a real-time chat app with WebSocket connections and push notifications',
                technologies: ['React Native', 'Real-time Chat', 'WebSockets', 'Push Notifications', 'Message Encryption', 'Real-time Sync']
              },
              {
                title: 'Augmented Reality App',
                description: 'Create an AR app using React Native and AR frameworks',
                technologies: ['React Native', 'Augmented Reality', 'AR Frameworks', 'Computer Vision', '3D Rendering', 'AR Interactions']
              },
              {
                title: 'Offline-First Mobile App',
                description: 'Implement an app that works offline with data synchronization when online',
                technologies: ['React Native', 'Offline Support', 'Data Sync', 'Local Database', 'Conflict Resolution', 'Network Handling']
              },
              {
                title: 'Multi-language App Framework',
                description: 'Build a framework for creating multi-language mobile applications',
                technologies: ['React Native', 'Internationalization', 'Multi-language Support', 'Translation Management', 'Cultural Adaptation', 'Localization']
              },
              {
                title: 'Advanced Navigation System',
                description: 'Create a complex navigation system with deep linking and complex routing',
                technologies: ['React Native', 'Advanced Navigation', 'Deep Linking', 'Complex Routing', 'Navigation State', 'Route Management']
              }
            ]
          }
        },
        {
          id: 'flutter',
          title: 'Flutter Development',
          description: 'Dart programming, Flutter widgets, state management, custom animations',
          completed: false,
          estimatedHours: 40,
          difficulty: 'intermediate',
          resources: ['Flutter Documentation', 'Dart Documentation', 'Flutter Cookbook'],
          projects: {
            beginner: [
              {
                title: 'Personal Finance Tracker',
                description: 'Build a Flutter app to track personal finances with beautiful charts and graphs',
                technologies: ['Flutter', 'Dart', 'State Management', 'Charts', 'Local Storage', 'UI Design']
              },
              {
                title: 'Recipe Management App',
                description: 'Create an app to store, search, and manage cooking recipes with categories',
                technologies: ['Flutter', 'Dart', 'CRUD Operations', 'Search Functionality', 'Categories', 'Local Database']
              }
            ],
            intermediate: [
              {
                title: 'E-learning Platform',
                description: 'Build a mobile learning platform with courses, progress tracking, and quizzes',
                technologies: ['Flutter', 'Dart', 'E-learning', 'Progress Tracking', 'Quiz System', 'Content Management']
              },
              {
                title: 'Real Estate App',
                description: 'Create a real estate app with property listings, search filters, and virtual tours',
                technologies: ['Flutter', 'Dart', 'Property Listings', 'Search Filters', 'Virtual Tours', 'Maps Integration']
              },
              {
                title: 'Task Management System',
                description: 'Implement a comprehensive task management app with teams and project collaboration',
                technologies: ['Flutter', 'Dart', 'Task Management', 'Team Collaboration', 'Project Management', 'Real-time Updates']
              }
            ],
            advanced: [
              {
                title: 'AI-Powered Chat Application',
                description: 'Build a chat app with AI integration for smart responses and language processing',
                technologies: ['Flutter', 'Dart', 'AI Integration', 'Chat System', 'Language Processing', 'Machine Learning']
              },
              {
                title: 'Advanced Animation Framework',
                description: 'Create a framework for complex animations and micro-interactions in Flutter',
                technologies: ['Flutter', 'Dart', 'Advanced Animations', 'Custom Animations', 'Animation Framework', 'Performance']
              },
              {
                title: 'Cross-platform Game Engine',
                description: 'Implement a simple 2D game engine using Flutter for cross-platform game development',
                technologies: ['Flutter', 'Dart', 'Game Development', '2D Engine', 'Game Physics', 'Cross-platform Gaming']
              },
              {
                title: 'IoT Dashboard App',
                description: 'Build a dashboard app for monitoring and controlling IoT devices',
                technologies: ['Flutter', 'Dart', 'IoT Integration', 'Real-time Monitoring', 'Device Control', 'Sensor Data']
              },
              {
                title: 'Advanced State Management Solution',
                description: 'Create a custom state management solution with advanced features and debugging tools',
                technologies: ['Flutter', 'Dart', 'State Management', 'Custom Solution', 'Debugging Tools', 'Advanced Features']
              }
            ]
          }
        },
        {
          id: 'mobile-ui-ux',
          title: 'Mobile UI/UX Design',
          description: 'Mobile design principles, responsive design, accessibility, animations',
          completed: false,
          estimatedHours: 24,
          difficulty: 'intermediate',
          resources: ['Mobile Design Principles', 'UI/UX Best Practices', 'Accessibility Guidelines', 'Animation Libraries'],
          projects: {
            beginner: [
              {
                title: 'Mobile Design Basics',
                description: 'A project to practice mobile design principles and responsive design.',
                technologies: ['Mobile Design']
              },
              {
                title: 'Accessibility',
                description: 'A project to practice mobile accessibility.',
                technologies: ['Mobile Design']
              }
            ],
            intermediate: [
              {
                title: 'Complex UI/UX',
                description: 'A project to practice building complex UI/UX.',
                technologies: ['Mobile Design']
              },
              {
                title: 'Animations',
                description: 'A project to practice mobile animations.',
                technologies: ['Mobile Design']
              }
            ],
            advanced: [
              {
                title: 'Advanced UI/UX',
                description: 'A project to practice building advanced UI/UX.',
                technologies: ['Mobile Design']
              },
              {
                title: 'Advanced Animations',
                description: 'A project to practice advanced mobile animations.',
                technologies: ['Mobile Design']
              }
            ]
          }
        },
        {
          id: 'ios-development',
          title: 'iOS Development',
          description: 'Swift, UIKit, SwiftUI, iOS app lifecycle, App Store deployment',
          completed: false,
          estimatedHours: 40,
          difficulty: 'advanced',
          resources: ['Apple Developer Documentation', 'Swift Documentation', 'iOS App Development', 'App Store Guidelines'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'iOS Basics',
                description: 'A project to practice iOS development fundamentals (Swift, UIKit).',
                technologies: ['iOS']
              },
              {
                title: 'SwiftUI',
                description: 'A project to practice SwiftUI.',
                technologies: ['SwiftUI']
              }
            ],
            advanced: [
              {
                title: 'Advanced iOS',
                description: 'A project to practice building advanced iOS applications.',
                technologies: ['iOS']
              },
              {
                title: 'App Store Deployment',
                description: 'A project to practice deploying iOS apps to the App Store.',
                technologies: ['iOS']
              }
            ]
          }
        },
        {
          id: 'android-development',
          title: 'Android Development',
          description: 'Kotlin, Android SDK, Jetpack Compose, app lifecycle, Play Store deployment',
          completed: false,
          estimatedHours: 40,
          difficulty: 'advanced',
          resources: ['Android Developer Documentation', 'Kotlin Documentation', 'Android App Development', 'Play Store Guidelines'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'Android Basics',
                description: 'A project to practice Android development fundamentals (Kotlin, Android SDK).',
                technologies: ['Android']
              },
              {
                title: 'Jetpack Compose',
                description: 'A project to practice Jetpack Compose.',
                technologies: ['Jetpack Compose']
              }
            ],
            advanced: [
              {
                title: 'Advanced Android',
                description: 'A project to practice building advanced Android applications.',
                technologies: ['Android']
              },
              {
                title: 'Play Store Deployment',
                description: 'A project to practice deploying Android apps to the Play Store.',
                technologies: ['Android']
              }
            ]
          }
        }
      ]
    },
    {
      id: 'enterprise-languages',
      title: 'Enterprise Languages & Frameworks',
      description: 'Java, C#, .NET, Spring Boot, and enterprise development',
      icon: '🏢',
      color: 'bg-red-600',
      completed: false,
      order: 16,
      estimatedTotalHours: 140,
      subsections: [
        {
          id: 'java-basics',
          title: 'Java Fundamentals',
          description: 'OOP, collections, generics, streams, exception handling',
          completed: false,
          estimatedHours: 32,
          difficulty: 'intermediate',
          resources: ['Java Documentation', 'Java Tutorial', 'Official Documentation'],
          projects: {
            beginner: [
              {
                title: 'Java Basics',
                description: 'A project to practice Java fundamentals (OOP, collections, generics).',
                technologies: ['Java']
              },
              {
                title: 'Exception Handling',
                description: 'A project to practice Java exception handling.',
                technologies: ['Java']
              }
            ],
            intermediate: [
              {
                title: 'Advanced Java',
                description: 'A project to practice advanced Java features (streams, generics).',
                technologies: ['Java']
              },
              {
                title: 'Spring Security',
                description: 'A project to practice Spring Security.',
                technologies: ['Spring Security']
              }
            ],
            advanced: [
              {
                title: 'Advanced OOP',
                description: 'A project to practice advanced OOP concepts.',
                technologies: ['Java']
              },
              {
                title: 'Enterprise Patterns',
                description: 'A project to practice enterprise development patterns.',
                technologies: ['Spring Boot']
              }
            ]
          }
        },
        {
          id: 'spring-framework',
          title: 'Spring Framework',
          description: 'Spring Boot, Spring MVC, Spring Security, dependency injection',
          completed: false,
          estimatedHours: 40,
          difficulty: 'advanced',
          resources: ['Spring Documentation', 'Spring Boot Guide', 'Official Documentation'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'Spring Basics',
                description: 'A project to practice Spring Boot, Spring MVC, Spring Security.',
                technologies: ['Spring']
              },
              {
                title: 'Dependency Injection',
                description: 'A project to practice Spring dependency injection.',
                technologies: ['Spring']
              }
            ],
            advanced: [
              {
                title: 'Advanced Spring',
                description: 'A project to practice advanced Spring features (AOP, AspectJ).',
                technologies: ['Spring']
              },
              {
                title: 'Microservices',
                description: 'A project to practice building microservices with Spring Boot.',
                technologies: ['Spring Boot']
              }
            ]
          }
        },
        {
          id: 'csharp-basics',
          title: 'C# Fundamentals',
          description: 'OOP, LINQ, async/await, delegates, events',
          completed: false,
          estimatedHours: 32,
          difficulty: 'intermediate',
          resources: ['C# Documentation', 'C# Tutorial', 'Official Documentation'],
          projects: {
            beginner: [
              {
                title: 'C# Basics',
                description: 'A project to practice C# fundamentals (OOP, LINQ, async/await).',
                technologies: ['C#']
              },
              {
                title: 'Delegates & Events',
                description: 'A project to practice C# delegates and events.',
                technologies: ['C#']
              }
            ],
            intermediate: [
              {
                title: 'Advanced C#',
                description: 'A project to practice advanced C# features (async/await, LINQ).',
                technologies: ['C#']
              },
              {
                title: 'ASP.NET Core',
                description: 'A project to practice ASP.NET Core MVC, Razor Pages.',
                technologies: ['ASP.NET Core']
              }
            ],
            advanced: [
              {
                title: 'Advanced OOP',
                description: 'A project to practice advanced OOP concepts.',
                technologies: ['C#']
              },
              {
                title: 'Enterprise Patterns',
                description: 'A project to practice enterprise development patterns.',
                technologies: ['ASP.NET Core']
              }
            ]
          }
        },
        {
          id: 'dotnet',
          title: '.NET Framework',
          description: 'ASP.NET Core, Entity Framework, dependency injection, middleware',
          completed: false,
          estimatedHours: 36,
          difficulty: 'advanced',
          resources: ['.NET Documentation', 'ASP.NET Core Guide', 'Official Documentation'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'ASP.NET Core Basics',
                description: 'A project to practice ASP.NET Core MVC, Razor Pages, middleware.',
                technologies: ['ASP.NET Core']
              },
              {
                title: 'Entity Framework',
                description: 'A project to practice Entity Framework Core.',
                technologies: ['Entity Framework']
              }
            ],
            advanced: [
              {
                title: 'Advanced .NET',
                description: 'A project to practice advanced .NET features (dependency injection, middleware).',
                technologies: ['.NET']
              },
              {
                title: 'Microservices',
                description: 'A project to practice building microservices with ASP.NET Core.',
                technologies: ['ASP.NET Core']
              }
            ]
          }
        }
      ]
    },
    {
      id: 'systems-programming',
      title: 'Systems Programming',
      description: 'Go, Rust, C++, low-level programming, and system design',
      icon: '⚙️',
      color: 'bg-orange-600',
      completed: false,
      order: 17,
      estimatedTotalHours: 160,
      subsections: [
        {
          id: 'go-language',
          title: 'Go Programming Language',
          description: 'Goroutines, channels, interfaces, concurrency patterns',
          completed: false,
          estimatedHours: 40,
          difficulty: 'intermediate',
          resources: ['Go Documentation', 'Go Tutorial', 'Official Documentation'],
          projects: {
            beginner: [
              {
                title: 'Go Basics',
                description: 'A project to practice Go fundamentals (Goroutines, channels).',
                technologies: ['Go']
              },
              {
                title: 'Concurrency',
                description: 'A project to practice Go concurrency patterns.',
                technologies: ['Go']
              }
            ],
            intermediate: [
              {
                title: 'Advanced Go',
                description: 'A project to practice advanced Go features (interfaces, concurrency).',
                technologies: ['Go']
              },
              {
                title: 'Networking',
                description: 'A project to practice Go networking.',
                technologies: ['Go']
              }
            ],
            advanced: [
              {
                title: 'Advanced Concurrency',
                description: 'A project to practice advanced Go concurrency patterns.',
                technologies: ['Go']
              },
              {
                title: 'Low-Level Programming',
                description: 'A project to practice low-level programming in Go.',
                technologies: ['Go']
              }
            ]
          }
        },
        {
          id: 'rust-language',
          title: 'Rust Programming Language',
          description: 'Ownership, borrowing, lifetimes, memory safety',
          completed: false,
          estimatedHours: 48,
          difficulty: 'advanced',
          resources: ['Rust Documentation', 'Rust Book', 'Official Documentation'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'Rust Basics',
                description: 'A project to practice Rust fundamentals (ownership, borrowing).',
                technologies: ['Rust']
              },
              {
                title: 'Memory Safety',
                description: 'A project to practice Rust memory safety.',
                technologies: ['Rust']
              }
            ],
            advanced: [
              {
                title: 'Advanced Rust',
                description: 'A project to practice advanced Rust features (ownership, borrowing).',
                technologies: ['Rust']
              },
              {
                title: 'Low-Level Programming',
                description: 'A project to practice low-level programming in Rust.',
                technologies: ['Rust']
              }
            ]
          }
        },
        {
          id: 'cpp-basics',
          title: 'C++ Fundamentals',
          description: 'Pointers, memory management, templates, STL',
          completed: false,
          estimatedHours: 40,
          difficulty: 'advanced',
          resources: ['C++ Documentation', 'C++ Tutorial', 'Official Documentation'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'C++ Basics',
                description: 'A project to practice C++ fundamentals (pointers, memory management).',
                technologies: ['C++']
              },
              {
                title: 'STL',
                description: 'A project to practice C++ Standard Template Library.',
                technologies: ['C++']
              }
            ],
            advanced: [
              {
                title: 'Advanced C++',
                description: 'A project to practice advanced C++ features (templates, STL).',
                technologies: ['C++']
              },
              {
                title: 'Low-Level Programming',
                description: 'A project to practice low-level programming in C++.',
                technologies: ['C++']
              }
            ]
          }
        },
        {
          id: 'systems-design',
          title: 'Systems Design & Architecture',
          description: 'Operating systems, networking, file systems, process management',
          completed: false,
          estimatedHours: 32,
          difficulty: 'advanced',
          resources: ['Operating Systems Guide', 'Systems Programming', 'Official Documentation'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'Operating Systems',
                description: 'A project to practice operating systems concepts (processes, threads).',
                technologies: ['Operating Systems']
              },
              {
                title: 'Networking',
                description: 'A project to practice networking concepts (TCP/IP, HTTP).',
                technologies: ['Networking']
              }
            ],
            advanced: [
              {
                title: 'Advanced Systems',
                description: 'A project to practice building scalable systems.',
                technologies: ['Systems Programming']
              },
              {
                title: 'Low-Level Programming',
                description: 'A project to practice low-level programming in C++.',
                technologies: ['C++']
              }
            ]
          }
        }
      ]
    },
    {
      id: 'security',
      title: 'Cybersecurity & Application Security',
      description: 'Security best practices, penetration testing, and secure coding',
      icon: '🔒',
      color: 'bg-red-700',
      completed: false,
      order: 18,
      estimatedTotalHours: 100,
      subsections: [
        {
          id: 'web-security',
          title: 'Web Application Security',
          description: 'OWASP Top 10, XSS, CSRF, SQL injection, authentication',
          completed: false,
          estimatedHours: 32,
          difficulty: 'intermediate',
          resources: ['OWASP Guide', 'Web Security Guide', 'Security Best Practices'],
          projects: {
            beginner: [
              {
                title: 'OWASP Top 10',
                description: 'A project to practice OWASP Top 10 vulnerabilities.',
                technologies: ['Web Security']
              },
              {
                title: 'XSS Prevention',
                description: 'A project to practice preventing XSS attacks.',
                technologies: ['Web Security']
              }
            ],
            intermediate: [
              {
                title: 'CSRF Prevention',
                description: 'A project to practice preventing CSRF attacks.',
                technologies: ['Web Security']
              },
              {
                title: 'SQL Injection',
                description: 'A project to practice preventing SQL injection.',
                technologies: ['Web Security']
              }
            ],
            advanced: [
              {
                title: 'Advanced Security',
                description: 'A project to practice advanced security measures.',
                technologies: ['Web Security']
              },
              {
                title: 'Authentication',
                description: 'A project to practice secure authentication.',
                technologies: ['Web Security']
              }
            ]
          }
        },
        {
          id: 'secure-coding',
          title: 'Secure Coding Practices',
          description: 'Input validation, output encoding, secure defaults',
          completed: false,
          estimatedHours: 24,
          difficulty: 'intermediate',
          resources: ['Secure Coding Guide', 'Security Best Practices', 'Official Documentation'],
          projects: {
            beginner: [
              {
                title: 'Input Validation',
                description: 'A project to practice input validation.',
                technologies: ['Web Security']
              },
              {
                title: 'Output Encoding',
                description: 'A project to practice output encoding.',
                technologies: ['Web Security']
              }
            ],
            intermediate: [
              {
                title: 'Secure Defaults',
                description: 'A project to practice secure default configurations.',
                technologies: ['Web Security']
              },
              {
                title: 'Authentication',
                description: 'A project to practice secure authentication.',
                technologies: ['Web Security']
              }
            ],
            advanced: [
              {
                title: 'Advanced Security',
                description: 'A project to practice advanced security measures.',
                technologies: ['Web Security']
              },
              {
                title: 'Secure Coding',
                description: 'A project to practice secure coding practices.',
                technologies: ['Web Security']
              }
            ]
          }
        },
        {
          id: 'penetration-testing-basic',
          title: 'Penetration Testing',
          description: 'Vulnerability assessment, ethical hacking, security tools',
          completed: false,
          estimatedHours: 28,
          difficulty: 'advanced',
          resources: ['Penetration Testing Guide', 'Security Tools', 'Official Documentation'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'Vulnerability Assessment',
                description: 'A project to practice vulnerability assessment.',
                technologies: ['Penetration Testing']
              },
              {
                title: 'Ethical Hacking',
                description: 'A project to practice ethical hacking techniques.',
                technologies: ['Penetration Testing']
              }
            ],
            advanced: [
              {
                title: 'Advanced Penetration Testing',
                description: 'A project to practice advanced penetration testing techniques.',
                technologies: ['Penetration Testing']
              },
              {
                title: 'Security Tools',
                description: 'A project to practice using security tools.',
                technologies: ['Penetration Testing']
              }
            ]
          }
        },
        {
          id: 'incident-response',
          title: 'Incident Response & Forensics',
          description: 'Security incidents, digital forensics, incident handling',
          completed: false,
          estimatedHours: 16,
          difficulty: 'advanced',
          resources: ['Incident Response Guide', 'Digital Forensics', 'Official Documentation'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'Incident Response',
                description: 'A project to practice incident response concepts.',
                technologies: ['Security']
              },
              {
                title: 'Digital Forensics',
                description: 'A project to practice digital forensics.',
                technologies: ['Security']
              }
            ],
            advanced: [
              {
                title: 'Advanced Incident Response',
                description: 'A project to practice advanced incident response.',
                technologies: ['Security']
              },
              {
                title: 'Advanced Forensics',
                description: 'A project to practice advanced digital forensics.',
                technologies: ['Security']
              }
            ]
          }
        }
      ]
    },
    {
      id: 'data-engineering',
      title: 'Data Engineering & Big Data',
      description: 'Data pipelines, ETL processes, data warehousing, and analytics',
      icon: '📊',
      color: 'bg-teal-500',
      completed: false,
      order: 19,
      estimatedTotalHours: 120,
      subsections: [
        {
          id: 'data-pipelines',
          title: 'Data Pipelines & ETL',
          description: 'Apache Airflow, data extraction, transformation, loading',
          completed: false,
          estimatedHours: 32,
          difficulty: 'intermediate',
          resources: ['Apache Airflow Documentation', 'ETL Guide', 'Official Documentation'],
          projects: {
            beginner: [
              {
                title: 'Apache Airflow Basics',
                description: 'A project to practice Apache Airflow for data pipelines.',
                technologies: ['Apache Airflow']
              },
              {
                title: 'ETL Basics',
                description: 'A project to practice data extraction, transformation, loading.',
                technologies: ['ETL']
              }
            ],
            intermediate: [
              {
                title: 'Complex Pipelines',
                description: 'A project to practice building complex data pipelines.',
                technologies: ['Apache Airflow']
              },
              {
                title: 'Advanced ETL',
                description: 'A project to practice advanced ETL processes.',
                technologies: ['ETL']
              }
            ],
            advanced: [
              {
                title: 'Advanced Pipelines',
                description: 'A project to practice building advanced data pipelines.',
                technologies: ['Apache Airflow']
              },
              {
                title: 'Advanced ETL',
                description: 'A project to practice advanced ETL processes.',
                technologies: ['ETL']
              }
            ]
          }
        },
        {
          id: 'data-warehousing',
          title: 'Data Warehousing',
          description: 'Star schema, snowflake schema, data modeling, optimization',
          completed: false,
          estimatedHours: 28,
          difficulty: 'intermediate',
          resources: ['Data Warehousing Guide', 'Data Modeling', 'Official Documentation'],
          projects: {
            beginner: [
              {
                title: 'Data Modeling Basics',
                description: 'A project to practice data modeling concepts (star, snowflake).',
                technologies: ['Data Warehousing']
              },
              {
                title: 'Optimization',
                description: 'A project to practice data warehousing optimization.',
                technologies: ['Data Warehousing']
              }
            ],
            intermediate: [
              {
                title: 'Advanced Data Modeling',
                description: 'A project to practice advanced data modeling.',
                technologies: ['Data Warehousing']
              },
              {
                title: 'Complex Optimization',
                description: 'A project to practice complex data warehousing optimization.',
                technologies: ['Data Warehousing']
              }
            ],
            advanced: [
              {
                title: 'Advanced Warehousing',
                description: 'A project to practice building advanced data warehousing.',
                technologies: ['Data Warehousing']
              },
              {
                title: 'Advanced Optimization',
                description: 'A project to practice advanced data warehousing optimization.',
                technologies: ['Data Warehousing']
              }
            ]
          }
        },
        {
          id: 'big-data',
          title: 'Big Data Technologies',
          description: 'Hadoop, Spark, Kafka, data streaming, batch processing',
          completed: false,
          estimatedHours: 40,
          difficulty: 'advanced',
          resources: ['Hadoop Documentation', 'Apache Spark Documentation', 'Kafka Documentation'],
          projects: {
            beginner: [
              {
                title: 'Hadoop Basics',
                description: 'A project to practice Hadoop for batch processing.',
                technologies: ['Hadoop']
              },
              {
                title: 'Kafka Basics',
                description: 'A project to practice Apache Kafka for data streaming.',
                technologies: ['Kafka']
              }
            ],
            intermediate: [
              {
                title: 'Spark Basics',
                description: 'A project to practice Apache Spark for data processing.',
                technologies: ['Spark']
              },
              {
                title: 'Data Streaming',
                description: 'A project to practice data streaming with Kafka.',
                technologies: ['Kafka']
              }
            ],
            advanced: [
              {
                title: 'Advanced Big Data',
                description: 'A project to practice building advanced big data applications.',
                technologies: ['Hadoop', 'Spark', 'Kafka']
              },
              {
                title: 'Advanced Processing',
                description: 'A project to practice advanced data processing with Spark.',
                technologies: ['Spark']
              }
            ]
          }
        },
        {
          id: 'data-analytics',
          title: 'Data Analytics & Visualization',
          description: 'Business intelligence, dashboards, reporting, data storytelling',
          completed: false,
          estimatedHours: 20,
          difficulty: 'intermediate',
          resources: ['Data Analytics Guide', 'Visualization Best Practices', 'Official Documentation'],
          projects: {
            beginner: [
              {
                title: 'Data Analytics Basics',
                description: 'A project to practice data analytics concepts (BI, dashboards).',
                technologies: ['Data Analytics']
              },
              {
                title: 'Reporting',
                description: 'A project to practice data reporting.',
                technologies: ['Data Analytics']
              }
            ],
            intermediate: [
              {
                title: 'Advanced Analytics',
                description: 'A project to practice advanced data analytics techniques.',
                technologies: ['Data Analytics']
              },
              {
                title: 'Advanced Visualization',
                description: 'A project to practice advanced data visualization.',
                technologies: ['Data Analytics']
              }
            ],
            advanced: [
              {
                title: 'Advanced BI',
                description: 'A project to practice building advanced business intelligence.',
                technologies: ['Data Analytics']
              },
              {
                title: 'Advanced Reporting',
                description: 'A project to practice advanced data reporting.',
                technologies: ['Data Analytics']
              }
            ]
          }
        }
      ]
    },
    {
      id: 'soft-skills',
      title: 'Soft Skills & Career Development',
      description: 'Communication, leadership, project management, and career growth',
      icon: '🌟',
      color: 'bg-yellow-600',
      completed: false,
      order: 20,
      estimatedTotalHours: 80,
      subsections: [
        {
          id: 'communication',
          title: 'Technical Communication',
          description: 'Documentation, presentations, code reviews, team collaboration',
          completed: false,
          estimatedHours: 24,
          difficulty: 'intermediate',
          resources: ['Technical Writing Guide', 'Communication Skills', 'Best Practices'],
          projects: {
            beginner: [
              {
                title: 'Documentation Basics',
                description: 'A project to practice technical documentation.',
                technologies: ['Documentation']
              },
              {
                title: 'Code Reviews',
                description: 'A project to practice code reviews.',
                technologies: ['Code Review']
              }
            ],
            intermediate: [
              {
                title: 'Advanced Communication',
                description: 'A project to practice advanced communication skills.',
                technologies: ['Communication']
              },
              {
                title: 'Team Collaboration',
                description: 'A project to practice team collaboration.',
                technologies: ['Communication']
              }
            ],
            advanced: [
              {
                title: 'Advanced Communication',
                description: 'A project to practice advanced communication skills.',
                technologies: ['Communication']
              },
              {
                title: 'Leadership',
                description: 'A project to practice leadership skills.',
                technologies: ['Communication']
              }
            ]
          }
        },
        {
          id: 'leadership',
          title: 'Technical Leadership',
          description: 'Team management, mentoring, technical decision making',
          completed: false,
          estimatedHours: 28,
          difficulty: 'advanced',
          resources: ['Technical Leadership Guide', 'Leadership Skills', 'Best Practices'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'Team Management',
                description: 'A project to practice team management.',
                technologies: ['Leadership']
              },
              {
                title: 'Mentoring',
                description: 'A project to practice mentoring.',
                technologies: ['Leadership']
              }
            ],
            advanced: [
              {
                title: 'Advanced Leadership',
                description: 'A project to practice advanced leadership skills.',
                technologies: ['Leadership']
              },
              {
                title: 'Technical Decision Making',
                description: 'A project to practice technical decision making.',
                technologies: ['Leadership']
              }
            ]
          }
        },
        {
          id: 'project-management',
          title: 'Project Management',
          description: 'Agile methodologies, Scrum, Kanban, project planning',
          completed: false,
          estimatedHours: 28,
          difficulty: 'intermediate',
          resources: ['Agile Guide', 'Scrum Guide', 'Project Management Best Practices'],
          projects: {
            beginner: [
              {
                title: 'Agile Basics',
                description: 'A project to practice Agile methodologies (Scrum, Kanban).',
                technologies: ['Agile']
              },
              {
                title: 'Project Planning',
                description: 'A project to practice project planning.',
                technologies: ['Agile']
              }
            ],
            intermediate: [
              {
                title: 'Advanced Project Management',
                description: 'A project to practice advanced project management.',
                technologies: ['Agile']
              },
              {
                title: 'Scrum',
                description: 'A project to practice Scrum methodology.',
                technologies: ['Scrum']
              }
            ],
            advanced: [
              {
                title: 'Advanced Agile',
                description: 'A project to practice advanced Agile methodologies.',
                technologies: ['Agile']
              },
              {
                title: 'Leadership',
                description: 'A project to practice leadership skills.',
                technologies: ['Agile']
              }
            ]
          }
        }
      ]
    },
    {
      id: 'interview-prep',
      title: 'Interview Preparation & Career Growth',
      description: 'Technical interviews, system design questions, behavioral skills, and career advancement',
      icon: '🎯',
      color: 'bg-purple-600',
      completed: false,
      order: 21,
      estimatedTotalHours: 100,
      subsections: [
        {
          id: 'coding-interviews',
          title: 'Coding Interview Mastery',
          description: 'Data structures, algorithms, problem-solving strategies, whiteboard coding',
          completed: false,
          estimatedHours: 32,
          difficulty: 'intermediate',
          resources: ['LeetCode', 'HackerRank', 'Cracking the Coding Interview', 'Grokking Algorithms'],
          projects: {
            beginner: [
              {
                title: 'LeetCode Basics',
                description: 'A project to practice LeetCode easy problems.',
                technologies: ['LeetCode']
              },
              {
                title: 'Algorithm Basics',
                description: 'A project to practice different algorithms.',
                technologies: ['Algorithm']
              }
            ],
            intermediate: [
              {
                title: 'Advanced Coding',
                description: 'A project to practice advanced coding problems.',
                technologies: ['LeetCode']
              },
              {
                title: 'Problem Solving',
                description: 'A project to practice problem-solving strategies.',
                technologies: ['LeetCode']
              }
            ],
            advanced: [
              {
                title: 'Complex Problems',
                description: 'A project to practice solving complex coding problems.',
                technologies: ['LeetCode']
              },
              {
                title: 'Advanced Algorithms',
                description: 'A project to practice advanced algorithms.',
                technologies: ['Algorithm']
              }
            ]
          }
        },
        {
          id: 'system-design-interviews',
          title: 'System Design Interviews',
          description: 'Large-scale system design, scalability, trade-offs, real-world examples',
          completed: false,
          estimatedHours: 28,
          difficulty: 'advanced',
          resources: ['System Design Primer', 'Grokking System Design', 'Designing Data-Intensive Applications'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'System Design Basics',
                description: 'A project to practice system design concepts (scalability, trade-offs).',
                technologies: ['System Design']
              },
              {
                title: 'Real-world Examples',
                description: 'A project to practice system design with real-world examples.',
                technologies: ['System Design']
              }
            ],
            advanced: [
              {
                title: 'Advanced System Design',
                description: 'A project to practice building scalable systems.',
                technologies: ['System Design']
              },
              {
                title: 'Advanced Scalability',
                description: 'A project to practice advanced scalability concepts.',
                technologies: ['System Design']
              }
            ]
          }
        },
        {
          id: 'behavioral-interviews',
          title: 'Behavioral & Leadership Interviews',
          description: 'STAR method, conflict resolution, leadership examples, cultural fit',
          completed: false,
          estimatedHours: 20,
          difficulty: 'intermediate',
          resources: ['Cracking the PM Interview', 'Behavioral Interview Guide', 'Leadership Stories'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'STAR Method',
                description: 'A project to practice STAR method for behavioral interviews.',
                technologies: ['Interview']
              },
              {
                title: 'Conflict Resolution',
                description: 'A project to practice conflict resolution.',
                technologies: ['Interview']
              }
            ],
            advanced: [
              {
                title: 'Advanced Behavioral',
                description: 'A project to practice advanced behavioral interview techniques.',
                technologies: ['Interview']
              },
              {
                title: 'Leadership',
                description: 'A project to practice leadership examples.',
                technologies: ['Interview']
              }
            ]
          }
        },
        {
          id: 'negotiation',
          title: 'Salary Negotiation & Career Growth',
          description: 'Compensation negotiation, career planning, skill development, networking',
          completed: false,
          estimatedHours: 20,
          difficulty: 'intermediate',
          resources: ['Salary Negotiation Guide', 'Career Growth Strategies', 'Professional Networking'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'Salary Negotiation',
                description: 'A project to practice compensation negotiation.',
                technologies: ['Interview']
              },
              {
                title: 'Networking',
                description: 'A project to practice professional networking.',
                technologies: ['Networking']
              }
            ],
            advanced: [
              {
                title: 'Advanced Negotiation',
                description: 'A project to practice advanced negotiation strategies.',
                technologies: ['Interview']
              },
              {
                title: 'Career Growth',
                description: 'A project to practice career planning and skill development.',
                technologies: ['Interview']
              }
            ]
          }
        }
      ]
    },
    {
      id: 'specialized-domains',
      title: 'Specialized Domains & Emerging Tech',
      description: 'Game development, embedded systems, quantum computing, and cutting-edge technologies',
      icon: '🚀',
      color: 'bg-indigo-600',
      completed: false,
      order: 22,
      estimatedTotalHours: 120,
      subsections: [
        {
          id: 'game-development',
          title: 'Game Development',
          description: 'Unity, Unreal Engine, game physics, graphics programming, game design',
          completed: false,
          estimatedHours: 40,
          difficulty: 'intermediate',
          resources: ['Unity Documentation', 'Unreal Engine', 'Game Development Patterns', 'Game Physics'],
          projects: {
            beginner: [
              {
                title: 'Game Development Basics',
                description: 'A project to practice game development fundamentals (Unity, Unreal Engine).',
                technologies: ['Game Development']
              },
              {
                title: 'Game Physics',
                description: 'A project to practice game physics and collision detection.',
                technologies: ['Game Development']
              }
            ],
            intermediate: [
              {
                title: 'Advanced Game Development',
                description: 'A project to practice building advanced games.',
                technologies: ['Game Development']
              },
              {
                title: 'Game Design',
                description: 'A project to practice game design and level design.',
                technologies: ['Game Development']
              }
            ],
            advanced: [
              {
                title: 'Complex Game',
                description: 'A project to practice building complex games.',
                technologies: ['Game Development']
              },
              {
                title: 'Advanced Game Physics',
                description: 'A project to practice advanced game physics and AI.',
                technologies: ['Game Development']
              }
            ]
          }
        },
        {
          id: 'embedded-systems',
          title: 'Embedded Systems & IoT',
          description: 'Microcontrollers, real-time systems, sensor networks, IoT protocols',
          completed: false,
          estimatedHours: 32,
          difficulty: 'advanced',
          resources: ['Arduino Documentation', 'Embedded Systems Design', 'IoT Protocols', 'Real-time Systems'],
          projects: {
            beginner: [
              {
                title: 'Embedded Systems Basics',
                description: 'A project to practice embedded systems fundamentals (microcontrollers, sensors).',
                technologies: ['Embedded Systems']
              },
              {
                title: 'Real-time Systems',
                description: 'A project to practice real-time systems and interrupt handling.',
                technologies: ['Embedded Systems']
              }
            ],
            intermediate: [
              {
                title: 'Advanced Embedded',
                description: 'A project to practice building advanced embedded systems.',
                technologies: ['Embedded Systems']
              },
              {
                title: 'IoT Protocols',
                description: 'A project to practice IoT communication protocols.',
                technologies: ['IoT']
              }
            ],
            advanced: [
              {
                title: 'Complex Embedded',
                description: 'A project to practice building complex embedded systems.',
                technologies: ['Embedded Systems']
              },
              {
                title: 'Advanced IoT',
                description: 'A project to practice advanced IoT protocols and architectures.',
                technologies: ['IoT']
              }
            ]
          }
        },
        {
          id: 'quantum-computing',
          title: 'Quantum Computing',
          description: 'Quantum algorithms, qubits, quantum gates, quantum programming',
          completed: false,
          estimatedHours: 24,
          difficulty: 'advanced',
          resources: ['IBM Quantum Experience', 'Quantum Computing Guide', 'Qiskit Documentation'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'Quantum Basics',
                description: 'A project to practice quantum computing fundamentals (qubits, gates).',
                technologies: ['Quantum Computing']
              },
              {
                title: 'Algorithm Basics',
                description: 'A project to practice quantum algorithms.',
                technologies: ['Quantum Computing']
              }
            ],
            advanced: [
              {
                title: 'Advanced Quantum',
                description: 'A project to practice building advanced quantum algorithms.',
                technologies: ['Quantum Computing']
              },
              {
                title: 'Advanced Programming',
                description: 'A project to practice quantum programming.',
                technologies: ['Quantum Computing']
              }
            ]
          }
        },
        {
          id: 'edge-computing',
          title: 'Edge Computing & 5G',
          description: 'Edge devices, 5G networks, distributed computing, latency optimization',
          completed: false,
          estimatedHours: 24,
          difficulty: 'advanced',
          resources: ['Edge Computing Guide', '5G Technology', 'Distributed Systems', 'Latency Optimization'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'Edge Computing Basics',
                description: 'A project to practice edge computing concepts (5G, latency).',
                technologies: ['Edge Computing']
              },
              {
                title: 'Distributed Systems',
                description: 'A project to practice distributed computing.',
                technologies: ['Distributed Systems']
              }
            ],
            advanced: [
              {
                title: 'Advanced Edge',
                description: 'A project to practice building advanced edge computing applications.',
                technologies: ['Edge Computing']
              },
              {
                title: 'Advanced 5G',
                description: 'A project to practice advanced 5G technologies and architectures.',
                technologies: ['5G']
              }
            ]
          }
        }
      ]
    },
    {
      id: 'performance-optimization',
      title: 'Performance & Optimization Mastery',
      description: 'Code optimization, profiling, benchmarking, and performance engineering',
      icon: '⚡',
      color: 'bg-teal-600',
      completed: false,
      order: 23,
      estimatedTotalHours: 80,
      subsections: [
        {
          id: 'code-optimization',
          title: 'Code Optimization Techniques',
          description: 'Algorithm optimization, memory management, CPU optimization, profiling tools',
          completed: false,
          estimatedHours: 24,
          difficulty: 'advanced',
          resources: ['Performance Engineering', 'Code Optimization Guide', 'Profiling Tools', 'Algorithm Analysis'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'Code Optimization Basics',
                description: 'A project to practice code optimization techniques.',
                technologies: ['Performance Optimization']
              },
              {
                title: 'Memory Management',
                description: 'A project to practice memory management.',
                technologies: ['Performance Optimization']
              }
            ],
            advanced: [
              {
                title: 'Advanced Optimization',
                description: 'A project to practice building optimized code.',
                technologies: ['Performance Optimization']
              },
              {
                title: 'Performance Engineering',
                description: 'A project to practice performance engineering.',
                technologies: ['Performance Optimization']
              }
            ]
          }
        },
        {
          id: 'database-optimization',
          title: 'Database Performance & Tuning',
          description: 'Query optimization, indexing strategies, database tuning, performance monitoring',
          completed: false,
          estimatedHours: 20,
          difficulty: 'advanced',
          resources: ['Database Performance Tuning', 'Query Optimization', 'Indexing Strategies', 'Performance Monitoring'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'Database Optimization Basics',
                description: 'A project to practice database optimization techniques.',
                technologies: ['Database Optimization']
              },
              {
                title: 'Performance Monitoring',
                description: 'A project to practice monitoring database performance.',
                technologies: ['Database Optimization']
              }
            ],
            advanced: [
              {
                title: 'Advanced Optimization',
                description: 'A project to practice building optimized databases.',
                technologies: ['Database Optimization']
              },
              {
                title: 'Advanced Performance',
                description: 'A project to practice advanced performance monitoring.',
                technologies: ['Database Optimization']
              }
            ]
          }
        },
        {
          id: 'frontend-performance',
          title: 'Frontend Performance Optimization',
          description: 'Bundle optimization, lazy loading, image optimization, Core Web Vitals',
          completed: false,
          estimatedHours: 20,
          difficulty: 'intermediate',
          resources: ['Web Performance Guide', 'Core Web Vitals', 'Bundle Optimization', 'Image Optimization'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'Performance Optimization Basics',
                description: 'A project to practice frontend performance optimization techniques.',
                technologies: ['Performance Optimization']
              },
              {
                title: 'Core Web Vitals',
                description: 'A project to practice Core Web Vitals.',
                technologies: ['Performance Optimization']
              }
            ],
            advanced: [
              {
                title: 'Advanced Optimization',
                description: 'A project to practice building optimized frontend applications.',
                technologies: ['Performance Optimization']
              },
              {
                title: 'Advanced Performance',
                description: 'A project to practice advanced performance optimization.',
                technologies: ['Performance Optimization']
              }
            ]
          }
        },
        {
          id: 'monitoring-tools',
          title: 'Performance Monitoring & Tools',
          description: 'APM tools, metrics collection, alerting, performance dashboards',
          completed: false,
          estimatedHours: 16,
          difficulty: 'intermediate',
          resources: ['APM Tools', 'Performance Monitoring', 'Metrics Collection', 'Alerting Systems'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'APM Tools Basics',
                description: 'A project to practice APM tools for monitoring.',
                technologies: ['APM Tools']
              },
              {
                title: 'Metrics Collection',
                description: 'A project to practice collecting and analyzing metrics.',
                technologies: ['Performance Monitoring']
              }
            ],
            advanced: [
              {
                title: 'Advanced Monitoring',
                description: 'A project to practice implementing advanced monitoring.',
                technologies: ['APM Tools']
              },
              {
                title: 'Advanced Performance',
                description: 'A project to practice advanced performance monitoring.',
                technologies: ['Performance Monitoring']
              }
            ]
          }
        }
      ]
    },
    {
      id: 'computer-science',
      title: 'Computer Science Fundamentals',
      description: 'Essential computer science concepts, algorithms, and data structures',
      icon: '🧮',
      color: 'bg-purple-700',
      completed: false,
      order: 24,
      estimatedTotalHours: 120,
      subsections: [
        {
          id: 'advanced-algorithms',
          title: 'Advanced Algorithms & Complexity',
          description: 'Dynamic programming, greedy algorithms, graph algorithms, time complexity',
          completed: false,
          estimatedHours: 32,
          difficulty: 'advanced',
          resources: ['Introduction to Algorithms', 'Algorithm Design Manual', 'LeetCode Advanced', 'Competitive Programming'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'Algorithm Basics',
                description: 'A project to practice different algorithms.',
                technologies: ['Algorithm']
              },
              {
                title: 'Complexity',
                description: 'A project to practice time and space complexity.',
                technologies: ['Algorithm']
              }
            ],
            advanced: [
              {
                title: 'Advanced Algorithms',
                description: 'A project to practice advanced algorithms (dynamic programming, greedy).',
                technologies: ['Algorithm']
              },
              {
                title: 'Graph Algorithms',
                description: 'A project to practice graph algorithms (Dijkstra, Kruskal).',
                technologies: ['Algorithm']
              }
            ]
          }
        },
        {
          id: 'data-structures-advanced',
          title: 'Advanced Data Structures',
          description: 'Trees, graphs, heaps, advanced data structures implementation',
          completed: false,
          estimatedHours: 28,
          difficulty: 'advanced',
          resources: ['Data Structures and Algorithms', 'Advanced Data Structures', 'Implementation Guides'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'Advanced Data Structures',
                description: 'A project to practice advanced data structures (trees, graphs).',
                technologies: ['Data Structures']
              },
              {
                title: 'Heap',
                description: 'A project to practice heap data structures.',
                technologies: ['Data Structures']
              }
            ],
            advanced: [
              {
                title: 'Complex Data Structures',
                description: 'A project to practice building complex data structures.',
                technologies: ['Data Structures']
              },
              {
                title: 'Advanced Implementation',
                description: 'A project to practice implementing advanced data structures.',
                technologies: ['Data Structures']
              }
            ]
          }
        },
        {
          id: 'computer-architecture',
          title: 'Computer Architecture & Systems',
          description: 'CPU architecture, memory hierarchy, caching, operating systems',
          completed: false,
          estimatedHours: 24,
          difficulty: 'advanced',
          resources: ['Computer Organization', 'Operating Systems', 'Computer Architecture', 'Systems Programming'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'Computer Architecture Basics',
                description: 'A project to practice computer architecture concepts (CPU, memory).',
                technologies: ['Computer Architecture']
              },
              {
                title: 'Operating Systems',
                description: 'A project to practice operating systems concepts (processes, threads).',
                technologies: ['Operating Systems']
              }
            ],
            advanced: [
              {
                title: 'Advanced Architecture',
                description: 'A project to practice building scalable architectures.',
                technologies: ['Computer Architecture']
              },
              {
                title: 'Advanced Systems',
                description: 'A project to practice advanced system design.',
                technologies: ['Systems Programming']
              }
            ]
          }
        },
        {
          id: 'networking-fundamentals',
          title: 'Computer Networking',
          description: 'Network protocols, TCP/IP, HTTP, network security, distributed systems',
          completed: false,
          estimatedHours: 24,
          difficulty: 'intermediate',
          resources: ['Computer Networks', 'TCP/IP Guide', 'HTTP Protocol', 'Network Security'],
          projects: {
            beginner: [
              {
                title: 'Networking Basics',
                description: 'A project to practice network protocols (TCP/IP, HTTP).',
                technologies: ['Networking']
              },
              {
                title: 'Network Security',
                description: 'A project to practice network security concepts.',
                technologies: ['Networking']
              }
            ],
            intermediate: [
              {
                title: 'Advanced Networking',
                description: 'A project to practice advanced networking concepts (distributed systems).',
                technologies: ['Networking']
              },
              {
                title: 'Network Security',
                description: 'A project to practice securing networks.',
                technologies: ['Networking']
              }
            ],
            advanced: [
              {
                title: 'Advanced Networking',
                description: 'A project to practice advanced networking concepts.',
                technologies: ['Networking']
              },
              {
                title: 'Advanced Security',
                description: 'A project to practice advanced network security.',
                technologies: ['Networking']
              }
            ]
          }
        },
        {
          id: 'compiler-design',
          title: 'Compiler Design & Language Theory',
          description: 'Lexical analysis, parsing, code generation, language design',
          completed: false,
          estimatedHours: 12,
          difficulty: 'advanced',
          resources: ['Compiler Design', 'Language Theory', 'Parsing Techniques', 'Code Generation'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'Compiler Design Basics',
                description: 'A project to practice compiler design concepts (lexical analysis, parsing).',
                technologies: ['Compiler Design']
              },
              {
                title: 'Code Generation',
                description: 'A project to practice code generation.',
                technologies: ['Compiler Design']
              }
            ],
            advanced: [
              {
                title: 'Advanced Compiler',
                description: 'A project to practice building advanced compilers.',
                technologies: ['Compiler Design']
              },
              {
                title: 'Advanced Language Theory',
                description: 'A project to practice advanced language theory concepts.',
                technologies: ['Language Theory']
              }
            ]
          }
        }
      ]
    },
    {
      id: 'software-engineering-practices',
      title: 'Software Engineering Best Practices',
      description: 'Code quality, architecture patterns, design principles, and engineering practices',
      icon: '🏗️',
      color: 'bg-orange-700',
      completed: false,
      order: 24,
      estimatedTotalHours: 100,
      subsections: [
        {
          id: 'clean-code',
          title: 'Clean Code & SOLID Principles',
          description: 'Writing maintainable code, SOLID principles, code smells, refactoring',
          completed: false,
          estimatedHours: 24,
          difficulty: 'intermediate',
          resources: ['Clean Code by Robert Martin', 'SOLID Principles', 'Refactoring Guide', 'Code Quality'],
          projects: {
            beginner: [
              {
                title: 'Clean Code Basics',
                description: 'A project to practice writing clean code.',
                technologies: ['Clean Code']
              },
              {
                title: 'SOLID Principles',
                description: 'A project to practice SOLID principles.',
                technologies: ['Clean Code']
              }
            ],
            intermediate: [
              {
                title: 'Advanced Clean Code',
                description: 'A project to practice writing advanced clean code.',
                technologies: ['Clean Code']
              },
              {
                title: 'Design Patterns',
                description: 'A project to practice design patterns.',
                technologies: ['Clean Code']
              }
            ],
            advanced: [
              {
                title: 'Advanced Clean Code',
                description: 'A project to practice writing advanced clean code.',
                technologies: ['Clean Code']
              },
              {
                title: 'Advanced Patterns',
                description: 'A project to practice building complex architectures.',
                technologies: ['Architecture Patterns']
              }
            ]
          }
        },
        {
          id: 'design-patterns-advanced',
          title: 'Advanced Design Patterns',
          description: 'Creational, structural, behavioral patterns, anti-patterns',
          completed: false,
          estimatedHours: 28,
          difficulty: 'advanced',
          resources: ['Design Patterns', 'Pattern-Oriented Software Architecture', 'Anti-Patterns Guide'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'Advanced Patterns',
                description: 'A project to practice advanced design patterns.',
                technologies: ['Design Patterns']
              },
              {
                title: 'Anti-Patterns',
                description: 'A project to practice identifying and avoiding anti-patterns.',
                technologies: ['Design Patterns']
              }
            ],
            advanced: [
              {
                title: 'Complex Patterns',
                description: 'A project to practice building complex architectures.',
                technologies: ['Design Patterns']
              },
              {
                title: 'Advanced Anti-Patterns',
                description: 'A project to practice identifying and avoiding advanced anti-patterns.',
                technologies: ['Design Patterns']
              }
            ]
          }
        },
        {
          id: 'code-review',
          title: 'Code Review & Collaboration',
          description: 'Effective code reviews, pair programming, team collaboration',
          completed: false,
          estimatedHours: 16,
          difficulty: 'intermediate',
          resources: ['Code Review Best Practices', 'Pair Programming Guide', 'Team Collaboration'],
          projects: {
            beginner: [
              {
                title: 'Code Review Basics',
                description: 'A project to practice code review concepts.',
                technologies: ['Code Review']
              },
              {
                title: 'Pair Programming',
                description: 'A project to practice pair programming.',
                technologies: ['Code Review']
              }
            ],
            intermediate: [
              {
                title: 'Advanced Collaboration',
                description: 'A project to practice advanced collaboration.',
                technologies: ['Code Review']
              },
              {
                title: 'Team Management',
                description: 'A project to practice team management.',
                technologies: ['Code Review']
              }
            ],
            advanced: [
              {
                title: 'Advanced Collaboration',
                description: 'A project to practice advanced collaboration.',
                technologies: ['Code Review']
              },
              {
                title: 'Leadership',
                description: 'A project to practice leadership skills.',
                technologies: ['Code Review']
              }
            ]
          }
        },
        {
          id: 'technical-debt',
          title: 'Technical Debt Management',
          description: 'Identifying, measuring, and managing technical debt',
          completed: false,
          estimatedHours: 16,
          difficulty: 'intermediate',
          resources: ['Technical Debt Management', 'Code Quality Metrics', 'Refactoring Strategies'],
          projects: {
            beginner: [],
            intermediate: [
              {
                title: 'Technical Debt Basics',
                description: 'A project to practice technical debt concepts.',
                technologies: ['Technical Debt']
              },
              {
                title: 'Code Quality',
                description: 'A project to practice code quality.',
                technologies: ['Code Quality']
              }
            ],
            advanced: [
              {
                title: 'Advanced Technical Debt',
                description: 'A project to practice managing advanced technical debt.',
                technologies: ['Technical Debt']
              },
              {
                title: 'Advanced Code Quality',
                description: 'A project to practice achieving advanced code quality.',
                technologies: ['Code Quality']
              }
            ]
          }
        },
        {
          id: 'documentation',
          title: 'Technical Documentation',
          description: 'API documentation, code documentation, technical writing',
          completed: false,
          estimatedHours: 16,
          difficulty: 'intermediate',
          resources: ['Technical Writing', 'API Documentation', 'Code Documentation', 'Documentation Tools'],
          projects: {
            beginner: [
              {
                title: 'Documentation Basics',
                description: 'A project to practice technical documentation.',
                technologies: ['Documentation']
              },
              {
                title: 'Code Documentation',
                description: 'A project to practice code documentation.',
                technologies: ['Code Documentation']
              }
            ],
            intermediate: [
              {
                title: 'Advanced Documentation',
                description: 'A project to practice creating advanced documentation.',
                technologies: ['Documentation']
              },
              {
                title: 'API Documentation',
                description: 'A project to practice documenting APIs.',
                technologies: ['Documentation']
              }
            ],
            advanced: [
              {
                title: 'Advanced Documentation',
                description: 'A project to practice creating advanced documentation.',
                technologies: ['Documentation']
              },
              {
                title: 'Advanced Code Documentation',
                description: 'A project to practice creating advanced code documentation.',
                technologies: ['Code Documentation']
              }
            ]
          }
        }
      ]
    },
    {
      id: 'world-class-projects',
      title: 'World-Class Main Projects',
      description: 'Innovative startup-level projects that combine all your skills',
      icon: '🚀',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      completed: false,
      order: 26,
      estimatedTotalHours: 800,
      subsections: [
        {
          id: 'ai-powered-platforms',
          title: 'AI-Powered Innovation Platforms',
          description: 'Cutting-edge AI applications that solve real-world problems',
          completed: false,
          estimatedHours: 40,
          difficulty: 'advanced',
          resources: ['AI/ML Research Papers', 'Startup Case Studies', 'Innovation Frameworks'],
          projects: {
            beginner: [
              {
                title: 'AI-Powered Personal Health Coach',
                description: 'A comprehensive health platform that uses AI to create personalized fitness plans, nutrition advice, and wellness recommendations based on user data, medical history, and real-time health metrics.',
                technologies: ['React Native', 'Python', 'TensorFlow', 'Health APIs', 'Machine Learning', 'Real-time Data Processing', 'Mobile Development', 'AI/ML', 'Health Tech']
              },
              {
                title: 'Smart Home Energy Management System',
                description: 'An IoT-powered system that optimizes home energy consumption using AI, predicts usage patterns, and automatically adjusts smart devices to minimize costs while maintaining comfort.',
                technologies: ['IoT', 'Python', 'React', 'Node.js', 'Machine Learning', 'Real-time Analytics', 'Smart Home APIs', 'Energy Management', 'Predictive Analytics']
              }
            ],
            intermediate: [
              {
                title: 'AI-Powered Code Review Assistant',
                description: 'An intelligent code review system that analyzes code quality, suggests improvements, detects security vulnerabilities, and provides personalized learning recommendations for developers.',
                technologies: ['Python', 'React', 'Node.js', 'NLP', 'Code Analysis', 'Machine Learning', 'Security Scanning', 'Developer Tools', 'Code Quality']
              },
              {
                title: 'Real-time Language Translation Platform',
                description: 'A platform that provides real-time translation for conversations, documents, and media content with context awareness and cultural adaptation.',
                technologies: ['React Native', 'Python', 'NLP', 'Real-time Processing', 'WebRTC', 'Machine Learning', 'Translation APIs', 'Cultural Adaptation', 'Mobile Development']
              },
              {
                title: 'Predictive Maintenance System',
                description: 'An industrial IoT system that predicts equipment failures using sensor data, machine learning, and predictive analytics to prevent downtime and optimize maintenance schedules.',
                technologies: ['IoT', 'Python', 'React', 'Node.js', 'Machine Learning', 'Predictive Analytics', 'Sensor Data', 'Industrial APIs', 'Real-time Monitoring']
              }
            ],
            advanced: [
              {
                title: 'Autonomous Drone Delivery Network',
                description: 'A complete drone delivery system with autonomous navigation, real-time tracking, weather adaptation, and intelligent route optimization for last-mile delivery.',
                technologies: ['Python', 'React', 'Node.js', 'Computer Vision', 'Autonomous Systems', 'Real-time Tracking', 'Weather APIs', 'Route Optimization', 'Drone Control Systems']
              },
              {
                title: 'AI-Powered Mental Health Platform',
                description: 'A comprehensive mental health platform that uses AI to detect early signs of mental health issues, provides personalized therapy recommendations, and offers 24/7 support through chatbots and human counselors.',
                technologies: ['React Native', 'Python', 'NLP', 'Machine Learning', 'Mental Health APIs', 'Real-time Analysis', 'Privacy Protection', 'Therapy Integration', 'Mobile Development']
              },
              {
                title: 'Smart City Traffic Management System',
                description: 'An intelligent traffic management system that optimizes traffic flow, reduces congestion, and improves public transportation using real-time data from sensors, cameras, and mobile devices.',
                technologies: ['Python', 'React', 'Node.js', 'IoT', 'Real-time Analytics', 'Traffic Optimization', 'Public Transport APIs', 'Computer Vision', 'Urban Planning']
              },
              {
                title: 'Personalized Education AI Platform',
                description: 'An AI-powered education platform that creates personalized learning paths, adapts content difficulty, tracks progress, and provides real-time feedback to optimize learning outcomes.',
                technologies: ['React', 'Python', 'Node.js', 'Machine Learning', 'Educational APIs', 'Progress Tracking', 'Content Adaptation', 'Learning Analytics', 'Personalization']
              },
              {
                title: 'Sustainable Agriculture AI System',
                description: 'A comprehensive agricultural system that optimizes crop yields, water usage, and resource management using AI, IoT sensors, weather data, and predictive analytics.',
                technologies: ['Python', 'React', 'Node.js', 'IoT', 'Machine Learning', 'Agricultural APIs', 'Weather Integration', 'Resource Optimization', 'Sustainability']
              }
            ]
          }
        },
        {
          id: 'blockchain-innovation',
          title: 'Blockchain & Web3 Innovation',
          description: 'Next-generation blockchain applications and decentralized systems',
          completed: false,
          estimatedHours: 40,
          difficulty: 'advanced',
          resources: ['Web3 Documentation', 'Blockchain Research', 'DeFi Protocols'],
          projects: {
            beginner: [
              {
                title: 'Decentralized Social Media Platform',
                description: 'A censorship-resistant social media platform where users own their data, content creators are directly rewarded, and communities are governed by DAOs.',
                technologies: ['React', 'Solidity', 'Web3.js', 'IPFS', 'Smart Contracts', 'Decentralized Storage', 'Social Media', 'Content Monetization', 'DAO Governance']
              },
              {
                title: 'Carbon Credit Trading Platform',
                description: 'A blockchain-based platform for trading carbon credits, enabling transparent tracking of environmental impact and incentivizing sustainable practices.',
                technologies: ['React', 'Solidity', 'Web3.js', 'Carbon APIs', 'Smart Contracts', 'Environmental Data', 'Trading Platform', 'Sustainability', 'Transparency']
              }
            ],
            intermediate: [
              {
                title: 'DeFi Yield Farming Aggregator',
                description: 'An intelligent platform that automatically finds the best yield farming opportunities across multiple DeFi protocols and optimizes returns for users.',
                technologies: ['React', 'Solidity', 'Web3.js', 'DeFi APIs', 'Smart Contracts', 'Yield Optimization', 'Risk Management', 'Automated Trading', 'Financial Analytics']
              },
              {
                title: 'Decentralized Identity Management',
                description: 'A self-sovereign identity system that allows users to control their digital identity, share credentials securely, and maintain privacy across different platforms.',
                technologies: ['React', 'Solidity', 'Web3.js', 'Zero-Knowledge Proofs', 'Smart Contracts', 'Identity Verification', 'Privacy Protection', 'Credential Management', 'Security']
              },
              {
                title: 'NFT Marketplace with Royalties',
                description: 'An advanced NFT marketplace with automatic royalty distribution, fractional ownership, and dynamic pricing based on market demand and creator reputation.',
                technologies: ['React', 'Solidity', 'Web3.js', 'IPFS', 'Smart Contracts', 'NFT Standards', 'Royalty Distribution', 'Marketplace', 'Digital Art']
              }
            ],
            advanced: [
              {
                title: 'Cross-Chain DeFi Protocol',
                description: 'A DeFi protocol that enables seamless asset transfers and yield farming across multiple blockchains, with automated arbitrage and risk management.',
                technologies: ['React', 'Solidity', 'Web3.js', 'Cross-Chain Bridges', 'Smart Contracts', 'DeFi Protocols', 'Arbitrage', 'Risk Management', 'Multi-Chain']
              },
              {
                title: 'Decentralized Autonomous Organization (DAO)',
                description: 'A complete DAO platform with governance mechanisms, proposal systems, voting mechanisms, and treasury management for decentralized organizations.',
                technologies: ['React', 'Solidity', 'Web3.js', 'Governance Tokens', 'Smart Contracts', 'Voting Systems', 'Treasury Management', 'Decentralized Governance', 'Community Management']
              },
              {
                title: 'Blockchain-Based Supply Chain',
                description: 'A transparent supply chain system that tracks products from origin to consumer, ensuring authenticity, ethical sourcing, and real-time visibility.',
                technologies: ['React', 'Solidity', 'Web3.js', 'IoT', 'Smart Contracts', 'Supply Chain APIs', 'Product Tracking', 'Authenticity Verification', 'Transparency']
              },
              {
                title: 'Decentralized Cloud Storage Network',
                description: 'A peer-to-peer cloud storage network where users can rent out unused storage space and earn cryptocurrency while maintaining data privacy and security.',
                technologies: ['React', 'Solidity', 'Web3.js', 'P2P Networks', 'Smart Contracts', 'Encryption', 'Storage Optimization', 'Incentive Mechanisms', 'Privacy']
              },
              {
                title: 'AI-Powered DeFi Risk Assessment',
                description: 'An AI system that analyzes DeFi protocols, assesses risks, and provides recommendations for safe yield farming and investment strategies.',
                technologies: ['React', 'Python', 'Solidity', 'Machine Learning', 'DeFi APIs', 'Risk Assessment', 'Smart Contracts', 'Financial Analysis', 'AI/ML']
              }
            ]
          }
        },
        {
          id: 'enterprise-solutions',
          title: 'Enterprise-Level Solutions',
          description: 'Scalable enterprise applications that solve complex business problems',
          completed: false,
          estimatedHours: 40,
          difficulty: 'advanced',
          resources: ['Enterprise Architecture', 'Microservices Patterns', 'Cloud Native Development'],
          projects: {
            beginner: [
              {
                title: 'Real-time Business Intelligence Dashboard',
                description: 'A comprehensive BI platform that aggregates data from multiple sources, provides real-time analytics, and generates actionable insights for business decision-making.',
                technologies: ['React', 'Node.js', 'Python', 'Real-time Analytics', 'Data Visualization', 'Business Intelligence', 'Dashboard Design', 'Data Integration', 'Analytics']
              },
              {
                title: 'Enterprise Resource Planning System',
                description: 'A modular ERP system that manages inventory, human resources, finance, and customer relationships with real-time synchronization and reporting.',
                technologies: ['React', 'Node.js', 'Python', 'ERP Modules', 'Database Design', 'Business Logic', 'Reporting System', 'Integration APIs', 'Enterprise Software']
              }
            ],
            intermediate: [
              {
                title: 'Microservices Architecture Platform',
                description: 'A scalable microservices platform with service discovery, load balancing, API gateway, and monitoring for building distributed enterprise applications.',
                technologies: ['React', 'Node.js', 'Python', 'Microservices', 'Docker', 'Kubernetes', 'Service Mesh', 'API Gateway', 'Distributed Systems']
              },
              {
                title: 'Customer Relationship Management System',
                description: 'An advanced CRM system with lead management, sales automation, customer analytics, and AI-powered insights for improving customer relationships.',
                technologies: ['React', 'Node.js', 'Python', 'CRM', 'Sales Automation', 'Customer Analytics', 'AI/ML', 'Business Intelligence', 'Automation']
              },
              {
                title: 'Supply Chain Management Platform',
                description: 'A comprehensive supply chain platform that optimizes inventory, manages suppliers, tracks shipments, and provides end-to-end visibility.',
                technologies: ['React', 'Node.js', 'Python', 'Supply Chain', 'Inventory Management', 'Logistics', 'Real-time Tracking', 'Optimization', 'Business Operations']
              }
            ],
            advanced: [
              {
                title: 'AI-Powered Fraud Detection System',
                description: 'A real-time fraud detection system that uses machine learning to identify suspicious transactions, patterns, and behaviors across multiple channels.',
                technologies: ['React', 'Python', 'Node.js', 'Machine Learning', 'Fraud Detection', 'Real-time Processing', 'Pattern Recognition', 'Security', 'Financial Services']
              },
              {
                title: 'Distributed Computing Platform',
                description: 'A platform that distributes computational tasks across multiple nodes, enabling high-performance computing for complex calculations and data processing.',
                technologies: ['React', 'Python', 'Node.js', 'Distributed Computing', 'Load Balancing', 'Task Distribution', 'High Performance', 'Scalability', 'Computing']
              },
              {
                title: 'Real-time Collaboration Platform',
                description: 'A comprehensive collaboration platform with document editing, video conferencing, project management, and real-time communication features.',
                technologies: ['React', 'Node.js', 'WebRTC', 'Real-time Communication', 'Document Editing', 'Video Conferencing', 'Project Management', 'Collaboration', 'Communication']
              },
              {
                title: 'Predictive Analytics Engine',
                description: 'An advanced analytics engine that predicts business trends, customer behavior, and market changes using machine learning and big data processing.',
                technologies: ['React', 'Python', 'Node.js', 'Machine Learning', 'Predictive Analytics', 'Big Data', 'Business Intelligence', 'Trend Analysis', 'Data Science']
              },
              {
                title: 'Enterprise Security Management System',
                description: 'A comprehensive security system that monitors, detects, and responds to security threats across enterprise networks and applications.',
                technologies: ['React', 'Python', 'Node.js', 'Cybersecurity', 'Threat Detection', 'Security Monitoring', 'Incident Response', 'Network Security', 'Enterprise Security']
              }
            ]
          }
        },
        {
          id: 'emerging-tech',
          title: 'Emerging Technology Innovation',
          description: 'Cutting-edge applications using the latest technologies',
          completed: false,
          estimatedHours: 40,
          difficulty: 'advanced',
          resources: ['Emerging Tech Research', 'Innovation Frameworks', 'Future Technology Trends'],
          projects: {
            beginner: [
              {
                title: 'Quantum Computing Simulator',
                description: 'A quantum computing simulator that allows users to experiment with quantum algorithms, circuits, and quantum machine learning models.',
                technologies: ['React', 'Python', 'Quantum Computing', 'Quantum Algorithms', 'Simulation', 'Machine Learning', 'Quantum ML', 'Educational Platform', 'Research Tools']
              },
              {
                title: 'Augmented Reality Shopping Platform',
                description: 'An AR platform that allows users to visualize products in their space before purchasing, with virtual try-ons and interactive product demonstrations.',
                technologies: ['React Native', 'AR Frameworks', 'Computer Vision', '3D Rendering', 'E-commerce', 'Product Visualization', 'Mobile Development', 'AR/VR', 'Shopping Experience']
              }
            ],
            intermediate: [
              {
                title: 'Edge Computing IoT Platform',
                description: 'A platform that processes IoT data at the edge, reducing latency and bandwidth usage while providing real-time insights and automation.',
                technologies: ['React', 'Python', 'IoT', 'Edge Computing', 'Real-time Processing', 'Data Analytics', 'Automation', 'Low Latency', 'Distributed Systems']
              },
              {
                title: '5G Network Optimization System',
                description: 'A system that optimizes 5G network performance, manages bandwidth allocation, and provides quality of service guarantees for different applications.',
                technologies: ['React', 'Python', '5G Networks', 'Network Optimization', 'Bandwidth Management', 'Quality of Service', 'Telecommunications', 'Network Management', 'Performance']
              },
              {
                title: 'Digital Twin Platform',
                description: 'A platform that creates digital twins of physical systems, enabling real-time monitoring, predictive maintenance, and simulation-based optimization.',
                technologies: ['React', 'Python', 'IoT', 'Digital Twins', 'Real-time Monitoring', 'Simulation', 'Predictive Maintenance', '3D Modeling', 'Industrial IoT']
              }
            ],
            advanced: [
              {
                title: 'Brain-Computer Interface Platform',
                description: 'A platform that enables communication between the brain and computers, allowing users to control devices and applications through thought.',
                technologies: ['React', 'Python', 'Neural Interfaces', 'Signal Processing', 'Machine Learning', 'Real-time Processing', 'Neuroscience', 'Biotechnology', 'Human-Computer Interaction']
              },
              {
                title: 'Autonomous Vehicle Fleet Management',
                description: 'A comprehensive system for managing fleets of autonomous vehicles, including route optimization, safety monitoring, and passenger management.',
                technologies: ['React', 'Python', 'Autonomous Vehicles', 'Fleet Management', 'Route Optimization', 'Safety Systems', 'Real-time Monitoring', 'Transportation', 'AI/ML']
              },
              {
                title: 'Space Technology Platform',
                description: 'A platform for satellite data processing, space mission planning, and Earth observation analytics for environmental monitoring and research.',
                technologies: ['React', 'Python', 'Satellite Data', 'Space Technology', 'Earth Observation', 'Environmental Monitoring', 'Data Processing', 'Research Tools', 'Space Science']
              },
              {
                title: 'Biotechnology Research Platform',
                description: 'A platform for drug discovery, genetic analysis, and biological research using AI, machine learning, and advanced data analytics.',
                technologies: ['React', 'Python', 'Biotechnology', 'Drug Discovery', 'Genetic Analysis', 'Machine Learning', 'Research Tools', 'Healthcare', 'Life Sciences']
              },
              {
                title: 'Sustainable Energy Management System',
                description: 'A comprehensive system for managing renewable energy sources, optimizing energy distribution, and reducing carbon footprint through smart grid technology.',
                technologies: ['React', 'Python', 'Renewable Energy', 'Smart Grid', 'Energy Management', 'Sustainability', 'IoT', 'Real-time Optimization', 'Environmental Technology']
              }
            ]
          }
        },
        {
          id: 'user-focused-applications',
          title: 'User-Focused Social & Communication Apps',
          description: 'Innovative social media, chat, and user engagement platforms',
          completed: false,
          estimatedHours: 40,
          difficulty: 'advanced',
          resources: ['Social Media APIs', 'Real-time Communication', 'User Experience Design'],
          projects: {
            beginner: [
              {
                title: 'Voice-Based Social Network',
                description: 'A social media platform where users share voice messages instead of text, with voice-to-text transcription, emotion detection, and voice-based reactions.',
                technologies: ['React Native', 'Node.js', 'WebRTC', 'Voice Recognition', 'NLP', 'Real-time Communication', 'Social Media', 'Voice Processing', 'Emotion Detection']
              },
              {
                title: 'Anonymous Confession App',
                description: 'A platform where users can share anonymous confessions, secrets, and thoughts with a supportive community, featuring mood tracking and mental health resources.',
                technologies: ['React Native', 'Node.js', 'Anonymous Authentication', 'Community Features', 'Mental Health APIs', 'Privacy Protection', 'Social Support', 'Mood Tracking', 'Confession Platform']
              }
            ],
            intermediate: [
              {
                title: 'AI-Powered Dating App',
                description: 'A dating app that uses AI to analyze compatibility, personality traits, and conversation patterns to suggest better matches and provide relationship advice.',
                technologies: ['React Native', 'Python', 'Node.js', 'Machine Learning', 'NLP', 'Personality Analysis', 'Compatibility Algorithms', 'Chat Analysis', 'Relationship AI']
              },
              {
                title: 'Real-time Language Exchange Platform',
                description: 'A platform where users can practice languages with native speakers through video calls, text chat, and AI-powered language correction and learning tools.',
                technologies: ['React', 'Node.js', 'WebRTC', 'Video Calling', 'Language APIs', 'AI Translation', 'Learning Analytics', 'Cultural Exchange', 'Language Practice']
              },
              {
                title: 'Skill-Sharing Marketplace',
                description: 'A platform where users can teach and learn skills from each other through video lessons, live sessions, and interactive learning experiences with payment integration.',
                technologies: ['React', 'Node.js', 'Payment APIs', 'Video Streaming', 'Live Sessions', 'Skill Marketplace', 'Learning Management', 'User Reviews', 'E-commerce']
              }
            ],
            advanced: [
              {
                title: 'Holographic Social Media Platform',
                description: 'A next-generation social media platform that allows users to create and share 3D holographic content, virtual avatars, and immersive social experiences.',
                technologies: ['React', 'Three.js', 'WebGL', '3D Modeling', 'Holographic Display', 'Virtual Reality', 'Social VR', '3D Content Creation', 'Immersive Experience']
              },
              {
                title: 'Emotion-Aware Chat Application',
                description: 'A chat app that detects user emotions through text analysis, voice tone, and facial expressions, adapting the interface and responses accordingly.',
                technologies: ['React Native', 'Python', 'Node.js', 'Emotion Detection', 'Facial Recognition', 'Voice Analysis', 'Sentiment Analysis', 'Adaptive UI', 'Emotional Intelligence']
              },
              {
                title: 'Dream Journal & Analysis Platform',
                description: 'A platform where users can record and analyze their dreams using AI, track patterns, and connect with others who have similar dream experiences.',
                technologies: ['React Native', 'Python', 'Node.js', 'Dream Analysis', 'Pattern Recognition', 'Community Features', 'Dream Journaling', 'AI Interpretation', 'Psychology APIs']
              },
              {
                title: 'Time-Capsule Social Network',
                description: 'A social network where users can create time capsules with messages, photos, and videos that will be revealed to specific people at predetermined future dates.',
                technologies: ['React', 'Node.js', 'Time-based Release', 'Encrypted Storage', 'Future Messaging', 'Social Network', 'Privacy Protection', 'Time Capsules', 'Future Communication']
              },
              {
                title: 'Personality-Based Content Discovery',
                description: 'A content discovery platform that learns user personalities and preferences to curate personalized content feeds, recommendations, and social connections.',
                technologies: ['React', 'Python', 'Node.js', 'Personality Analysis', 'Content Curation', 'Recommendation Engine', 'User Profiling', 'Personalization', 'Content Discovery']
              }
            ]
          }
        },
        {
          id: 'creative-communication-platforms',
          title: 'Creative Communication & Expression Platforms',
          description: 'Innovative platforms for creative expression and unique communication',
          completed: false,
          estimatedHours: 40,
          difficulty: 'advanced',
          resources: ['Creative APIs', 'Multimedia Processing', 'User Experience Design'],
          projects: {
            beginner: [
              {
                title: 'Music-Based Social Network',
                description: 'A social network where users connect through music preferences, create collaborative playlists, and discover new music through AI-powered recommendations.',
                technologies: ['React', 'Node.js', 'Music APIs', 'Collaborative Playlists', 'Music Discovery', 'Social Features', 'AI Recommendations', 'Audio Processing', 'Music Social']
              },
              {
                title: 'Visual Storytelling Platform',
                description: 'A platform where users create and share visual stories using photos, videos, and text, with AI-powered story suggestions and collaborative storytelling features.',
                technologies: ['React Native', 'Node.js', 'Image Processing', 'Video Editing', 'Story Creation', 'Collaborative Features', 'AI Storytelling', 'Visual Content', 'Creative Platform']
              }
            ],
            intermediate: [
              {
                title: 'AI-Generated Art Collaboration',
                description: 'A platform where users collaborate with AI to create unique artwork, with real-time collaboration, style transfer, and community art galleries.',
                technologies: ['React', 'Python', 'Node.js', 'AI Art Generation', 'Style Transfer', 'Real-time Collaboration', 'Art Galleries', 'Creative AI', 'Collaborative Art']
              },
              {
                title: 'Interactive Podcast Platform',
                description: 'A podcast platform where listeners can interact with content through real-time comments, questions, and AI-powered content summaries and discussions.',
                technologies: ['React', 'Node.js', 'Audio Streaming', 'Real-time Interaction', 'Podcast Analytics', 'AI Summarization', 'Community Engagement', 'Interactive Audio', 'Podcast Platform']
              },
              {
                title: 'Virtual Event Creation Platform',
                description: 'A platform for creating and hosting virtual events with interactive features, virtual booths, networking rooms, and AI-powered event recommendations.',
                technologies: ['React', 'Node.js', 'WebRTC', 'Virtual Events', 'Interactive Features', 'Networking Tools', 'Event Management', 'Virtual Booths', 'Event Platform']
              }
            ],
            advanced: [
              {
                title: 'Mind-Mapping Social Network',
                description: 'A social network where users create and share interactive mind maps, collaborate on ideas, and build knowledge networks with AI-powered connections.',
                technologies: ['React', 'Python', 'Node.js', 'Mind Mapping', 'Knowledge Networks', 'Collaborative Thinking', 'AI Connections', 'Visual Thinking', 'Knowledge Platform']
              },
              {
                title: 'Sensory Communication Platform',
                description: 'A platform that enables communication through multiple senses - visual, auditory, and haptic feedback - for enhanced emotional expression and connection.',
                technologies: ['React Native', 'Node.js', 'Haptic Feedback', 'Multi-sensory', 'Emotional Communication', 'Sensory Technology', 'Enhanced Expression', 'Accessibility', 'Sensory Platform']
              },
              {
                title: 'Dream Collaboration Network',
                description: 'A platform where users can share and collaborate on dream interpretations, create dream-inspired art, and build communities around dream exploration.',
                technologies: ['React', 'Python', 'Node.js', 'Dream Interpretation', 'Collaborative Analysis', 'Dream Art', 'Community Building', 'Dream Psychology', 'Dream Platform']
              },
              {
                title: 'Time-Travel Social Network',
                description: 'A social network that simulates time travel by connecting users with people from different time periods, historical events, and future scenarios through immersive storytelling.',
                technologies: ['React', 'Node.js', 'Immersive Storytelling', 'Historical Data', 'Time Simulation', 'Virtual Time Travel', 'Educational Platform', 'Historical Social', 'Time Platform']
              },
              {
                title: 'Emotion-Sharing Network',
                description: 'A network where users share emotions through color, music, and abstract art, creating emotional landscapes and connecting through shared feelings.',
                technologies: ['React', 'Python', 'Node.js', 'Emotion Visualization', 'Color Psychology', 'Emotional Art', 'Feeling Networks', 'Emotional Expression', 'Emotion Platform']
              }
            ]
          }
        },
        {
          id: 'gaming-social-platforms',
          title: 'Gaming & Interactive Social Platforms',
          description: 'Innovative gaming and interactive social experiences',
          completed: false,
          estimatedHours: 40,
          difficulty: 'advanced',
          resources: ['Game Development', 'Social Gaming', 'Interactive Design'],
          projects: {
            beginner: [
              {
                title: 'Social Fitness Gaming Platform',
                description: 'A gaming platform that combines fitness challenges with social features, allowing users to compete, collaborate, and motivate each other through gamified workouts.',
                technologies: ['React Native', 'Node.js', 'Fitness APIs', 'Gamification', 'Social Competition', 'Workout Tracking', 'Health Gaming', 'Motivation System', 'Fitness Platform']
              },
              {
                title: 'Collaborative Puzzle Platform',
                description: 'A platform where users solve puzzles together in real-time, with AI-generated puzzles, collaborative problem-solving, and community puzzle creation.',
                technologies: ['React', 'Node.js', 'Real-time Collaboration', 'Puzzle Generation', 'Problem Solving', 'Community Creation', 'AI Puzzles', 'Collaborative Gaming', 'Puzzle Platform']
              }
            ],
            intermediate: [
              {
                title: 'Virtual Reality Social Hub',
                description: 'A VR social platform where users can meet, interact, and create experiences in virtual worlds with customizable avatars and immersive environments.',
                technologies: ['React', 'Three.js', 'WebVR', 'Virtual Reality', 'Social VR', 'Avatar Customization', 'Virtual Worlds', 'Immersive Experience', 'VR Social']
              },
              {
                title: 'AI-Powered Story Game',
                description: 'An interactive story game where AI generates personalized narratives based on user choices, creating unique experiences for each player.',
                technologies: ['React', 'Python', 'Node.js', 'AI Story Generation', 'Interactive Narratives', 'Personalized Gaming', 'Choice-based Stories', 'AI Gaming', 'Story Platform']
              },
              {
                title: 'Social Strategy Game',
                description: 'A strategy game where players form alliances, trade resources, and compete in a persistent world with real-time social interactions.',
                technologies: ['React', 'Node.js', 'Real-time Gaming', 'Strategy Game', 'Alliance System', 'Resource Trading', 'Persistent World', 'Social Strategy', 'Gaming Platform']
              }
            ],
            advanced: [
              {
                title: 'Dream-Based Adventure Game',
                description: 'A game where players explore and interact with each other\'s dreams, solving puzzles and uncovering stories in a collaborative dream world.',
                technologies: ['React', 'Python', 'Node.js', 'Dream World', 'Collaborative Gaming', 'Dream Exploration', 'Interactive Dreams', 'Dream Gaming', 'Adventure Platform']
              },
              {
                title: 'Emotion-Driven RPG',
                description: 'A role-playing game where character development and story progression are driven by player emotions and social interactions with other players.',
                technologies: ['React', 'Python', 'Node.js', 'Emotion-driven Gaming', 'Social RPG', 'Character Development', 'Emotional Storytelling', 'Social Gaming', 'RPG Platform']
              },
              {
                title: 'Time-Manipulation Social Game',
                description: 'A game where players can manipulate time, collaborate across different time periods, and solve puzzles that span multiple timelines.',
                technologies: ['React', 'Node.js', 'Time Manipulation', 'Multi-timeline Gaming', 'Collaborative Puzzles', 'Time-based Mechanics', 'Social Time Game', 'Innovative Gaming', 'Time Platform']
              },
              {
                title: 'Consciousness-Expansion Platform',
                description: 'A platform that combines meditation, mindfulness, and social interaction to create shared consciousness experiences and spiritual connections.',
                technologies: ['React', 'Python', 'Node.js', 'Meditation Apps', 'Mindfulness', 'Consciousness Expansion', 'Spiritual Connection', 'Meditation Social', 'Consciousness Platform']
              },
              {
                title: 'Reality-Augmented Social Network',
                description: 'A social network that overlays digital content on the real world, allowing users to leave messages, art, and experiences in physical locations.',
                technologies: ['React Native', 'Node.js', 'Augmented Reality', 'Location-based Content', 'AR Social', 'Digital Overlay', 'Physical World Integration', 'AR Platform', 'Reality Augmentation']
              }
            ]
          }
        }
      ]
    },
    {
      id: 'advanced-ai-ml',
      title: 'Advanced AI & Machine Learning Specializations',
      description: 'Master cutting-edge AI technologies and specialized ML applications',
      icon: '🧠',
      color: 'bg-gradient-to-r from-purple-600 to-pink-600',
      completed: false,
      order: 27,
      estimatedTotalHours: 400,
      subsections: [
        {
          id: 'computer-vision',
          title: 'Computer Vision & Image Recognition',
          description: 'Advanced image processing, object detection, and visual AI systems',
          completed: false,
          estimatedHours: 40,
          difficulty: 'advanced',
          resources: ['OpenCV Documentation', 'TensorFlow Computer Vision', 'PyTorch Vision'],
          projects: {
            beginner: [
              {
                title: 'Real-time Face Recognition System',
                description: 'Build a system that recognizes faces in real-time video streams with emotion detection and identity verification.',
                technologies: ['Python', 'OpenCV', 'TensorFlow', 'Face Recognition', 'Real-time Processing', 'Emotion Detection', 'Video Streaming', 'Computer Vision', 'AI/ML']
              },
              {
                title: 'Object Detection for Autonomous Vehicles',
                description: 'Create an object detection system that identifies pedestrians, vehicles, and traffic signs for autonomous driving applications.',
                technologies: ['Python', 'YOLO', 'TensorFlow', 'Object Detection', 'Autonomous Vehicles', 'Computer Vision', 'Real-time Detection', 'Safety Systems', 'AI/ML']
              }
            ],
            intermediate: [
              {
                title: 'Medical Image Analysis Platform',
                description: 'Build a platform that analyzes medical images (X-rays, MRIs) to detect diseases and abnormalities using deep learning.',
                technologies: ['Python', 'TensorFlow', 'Medical Imaging', 'Disease Detection', 'Healthcare AI', 'Image Analysis', 'Deep Learning', 'Medical Technology', 'AI/ML']
              },
              {
                title: 'Augmented Reality Object Recognition',
                description: 'Create an AR system that recognizes objects in the real world and overlays relevant information and interactions.',
                technologies: ['Python', 'React Native', 'AR Frameworks', 'Object Recognition', 'Augmented Reality', 'Real-time Processing', 'Computer Vision', 'AR/VR', 'AI/ML']
              },
              {
                title: 'Quality Control Vision System',
                description: 'Implement a computer vision system for manufacturing quality control that detects defects and ensures product quality.',
                technologies: ['Python', 'OpenCV', 'Manufacturing', 'Quality Control', 'Defect Detection', 'Industrial AI', 'Computer Vision', 'Automation', 'AI/ML']
              }
            ],
            advanced: [
              {
                title: '3D Scene Understanding System',
                description: 'Build a system that understands 3D scenes from 2D images, reconstructing depth and spatial relationships.',
                technologies: ['Python', '3D Vision', 'Scene Understanding', 'Depth Estimation', 'Spatial AI', 'Computer Vision', '3D Reconstruction', 'Advanced AI', 'AI/ML']
              },
              {
                title: 'Multi-Modal Vision-Language AI',
                description: 'Create an AI system that understands both images and text, enabling advanced visual question answering and image captioning.',
                technologies: ['Python', 'Transformers', 'Vision-Language Models', 'Multi-modal AI', 'Image Understanding', 'Natural Language', 'Advanced AI', 'AI/ML', 'Deep Learning']
              },
              {
                title: 'Real-time Video Analytics Platform',
                description: 'Build a platform that analyzes video streams in real-time for security, retail analytics, and behavioral analysis.',
                technologies: ['Python', 'Video Analytics', 'Real-time Processing', 'Behavioral Analysis', 'Security AI', 'Retail Analytics', 'Computer Vision', 'Streaming AI', 'AI/ML']
              },
              {
                title: 'Generative Computer Vision',
                description: 'Implement systems that generate, edit, and manipulate images using GANs, diffusion models, and other generative AI techniques.',
                technologies: ['Python', 'GANs', 'Diffusion Models', 'Image Generation', 'Generative AI', 'Image Editing', 'Creative AI', 'Advanced AI', 'AI/ML']
              },
              {
                title: 'Autonomous Drone Vision System',
                description: 'Create a vision system for autonomous drones that enables navigation, obstacle avoidance, and mission-specific tasks.',
                technologies: ['Python', 'Drone Control', 'Autonomous Navigation', 'Obstacle Avoidance', 'Computer Vision', 'Robotics', 'Autonomous Systems', 'Drone AI', 'AI/ML']
              }
            ]
          }
        },
        {
          id: 'nlp-advanced',
          title: 'Natural Language Processing & Chatbots',
          description: 'Advanced NLP, language models, and conversational AI systems',
          completed: false,
          estimatedHours: 40,
          difficulty: 'advanced',
          resources: ['Hugging Face Transformers', 'OpenAI API', 'NLP Research Papers'],
          projects: {
            beginner: [
              {
                title: 'Advanced Chatbot with Memory',
                description: 'Build a chatbot that remembers conversation history, maintains context, and provides personalized responses.',
                technologies: ['Python', 'NLP', 'Conversation Memory', 'Context Management', 'Personalization', 'Chatbot AI', 'Natural Language', 'AI/ML', 'Conversational AI']
              },
              {
                title: 'Multi-language Translation System',
                description: 'Create a translation system that supports multiple languages with real-time translation and cultural adaptation.',
                technologies: ['Python', 'Translation APIs', 'Multi-language', 'Real-time Translation', 'Cultural Adaptation', 'Language Processing', 'Global Communication', 'AI/ML', 'NLP']
              }
            ],
            intermediate: [
              {
                title: 'Sentiment Analysis Platform',
                description: 'Build a platform that analyzes sentiment in text, social media, and customer feedback for business intelligence.',
                technologies: ['Python', 'Sentiment Analysis', 'Social Media Analytics', 'Business Intelligence', 'Text Analysis', 'Customer Feedback', 'NLP', 'Analytics', 'AI/ML']
              },
              {
                title: 'Document Intelligence System',
                description: 'Create a system that extracts information from documents, contracts, and forms using NLP and OCR.',
                technologies: ['Python', 'Document Processing', 'Information Extraction', 'OCR', 'Contract Analysis', 'Form Processing', 'NLP', 'Document AI', 'AI/ML']
              },
              {
                title: 'Voice Assistant with NLP',
                description: 'Build a voice assistant that understands natural language commands and performs complex tasks.',
                technologies: ['Python', 'Voice Recognition', 'Natural Language Understanding', 'Voice Commands', 'Task Automation', 'Voice AI', 'NLP', 'Conversational AI', 'AI/ML']
              }
            ],
            advanced: [
              {
                title: 'Large Language Model Fine-tuning',
                description: 'Fine-tune large language models for specific domains and create custom AI assistants.',
                technologies: ['Python', 'LLM Fine-tuning', 'Custom AI', 'Domain-specific AI', 'Model Training', 'Advanced NLP', 'AI/ML', 'Deep Learning', 'Transformers']
              },
              {
                title: 'Conversational AI Platform',
                description: 'Create a platform for building conversational AI agents with advanced dialogue management and personality.',
                technologies: ['Python', 'Dialogue Management', 'Conversational AI', 'Personality AI', 'Agent Framework', 'Advanced NLP', 'AI/ML', 'Conversational Design', 'AI Platform']
              },
              {
                title: 'Real-time Language Processing',
                description: 'Build a system that processes language in real-time for live translation, transcription, and analysis.',
                technologies: ['Python', 'Real-time NLP', 'Live Translation', 'Real-time Transcription', 'Streaming AI', 'Language Processing', 'Advanced NLP', 'AI/ML', 'Real-time Systems']
              },
              {
                title: 'Emotion-Aware Language AI',
                description: 'Create an AI system that understands and responds to emotional context in language.',
                technologies: ['Python', 'Emotion Detection', 'Emotional AI', 'Context Understanding', 'Emotion-aware Responses', 'Advanced NLP', 'AI/ML', 'Emotional Intelligence', 'Conversational AI']
              },
              {
                title: 'Multi-modal Language AI',
                description: 'Build an AI system that understands language in combination with images, audio, and other modalities.',
                technologies: ['Python', 'Multi-modal AI', 'Language Understanding', 'Image-Text AI', 'Audio-Text AI', 'Advanced NLP', 'AI/ML', 'Multi-modal Processing', 'Advanced AI']
              }
            ]
          }
        },
        {
          id: 'deep-learning-applications',
          title: 'Deep Learning & Neural Networks',
          description: 'Advanced neural network architectures and deep learning applications',
          completed: false,
          estimatedHours: 40,
          difficulty: 'advanced',
          resources: ['Deep Learning Book', 'PyTorch Documentation', 'TensorFlow Advanced'],
          projects: {
            beginner: [
              {
                title: 'Custom Neural Network Framework',
                description: 'Build a custom neural network framework from scratch with backpropagation and optimization algorithms.',
                technologies: ['Python', 'Neural Networks', 'Backpropagation', 'Optimization', 'Custom Framework', 'Deep Learning', 'AI/ML', 'Mathematical AI', 'Advanced AI']
              },
              {
                title: 'Image Classification with CNNs',
                description: 'Implement convolutional neural networks for image classification with custom architectures.',
                technologies: ['Python', 'CNNs', 'Image Classification', 'Convolutional Networks', 'Deep Learning', 'Computer Vision', 'AI/ML', 'Neural Networks', 'Advanced AI']
              }
            ],
            intermediate: [
              {
                title: 'Recurrent Neural Network Applications',
                description: 'Build applications using RNNs, LSTMs, and GRUs for sequence prediction and time series analysis.',
                technologies: ['Python', 'RNNs', 'LSTMs', 'GRUs', 'Sequence Prediction', 'Time Series', 'Deep Learning', 'AI/ML', 'Neural Networks', 'Advanced AI']
              },
              {
                title: 'Generative Adversarial Networks',
                description: 'Implement GANs for image generation, style transfer, and creative AI applications.',
                technologies: ['Python', 'GANs', 'Image Generation', 'Style Transfer', 'Generative AI', 'Deep Learning', 'AI/ML', 'Creative AI', 'Advanced AI', 'Neural Networks']
              },
              {
                title: 'Transformer Architecture Implementation',
                description: 'Build transformer models from scratch for natural language processing and other sequence tasks.',
                technologies: ['Python', 'Transformers', 'Attention Mechanisms', 'NLP', 'Sequence Processing', 'Deep Learning', 'AI/ML', 'Advanced AI', 'Neural Networks', 'Attention']
              }
            ],
            advanced: [
              {
                title: 'Federated Learning System',
                description: 'Implement federated learning for training models across distributed data sources while preserving privacy.',
                technologies: ['Python', 'Federated Learning', 'Distributed AI', 'Privacy-preserving ML', 'Collaborative Learning', 'Deep Learning', 'AI/ML', 'Advanced AI', 'Privacy AI', 'Distributed Systems']
              },
              {
                title: 'Neural Architecture Search',
                description: 'Build a system that automatically discovers optimal neural network architectures for specific tasks.',
                technologies: ['Python', 'Neural Architecture Search', 'AutoML', 'Architecture Optimization', 'Automated AI', 'Deep Learning', 'AI/ML', 'Advanced AI', 'AutoML', 'Neural Networks']
              },
              {
                title: 'Multi-task Learning Framework',
                description: 'Create a framework for training models that can perform multiple tasks simultaneously.',
                technologies: ['Python', 'Multi-task Learning', 'Shared Representations', 'Task Optimization', 'Efficient AI', 'Deep Learning', 'AI/ML', 'Advanced AI', 'Multi-task AI', 'Neural Networks']
              },
              {
                title: 'Continual Learning System',
                description: 'Build a system that can learn continuously without forgetting previous knowledge.',
                technologies: ['Python', 'Continual Learning', 'Catastrophic Forgetting', 'Lifelong Learning', 'Adaptive AI', 'Deep Learning', 'AI/ML', 'Advanced AI', 'Lifelong AI', 'Neural Networks']
              },
              {
                title: 'Quantum Neural Networks',
                description: 'Implement neural networks that leverage quantum computing for enhanced computational power.',
                technologies: ['Python', 'Quantum Computing', 'Quantum Neural Networks', 'Quantum AI', 'Quantum ML', 'Deep Learning', 'AI/ML', 'Advanced AI', 'Quantum Technology', 'Future AI']
              }
            ]
          }
        },
        {
          id: 'ai-ethics',
          title: 'AI Ethics & Responsible AI',
          description: 'Ethical AI development, bias detection, and responsible AI practices',
          completed: false,
          estimatedHours: 40,
          difficulty: 'advanced',
          resources: ['AI Ethics Guidelines', 'Responsible AI Frameworks', 'Bias Detection Tools'],
          projects: {
            beginner: [
              {
                title: 'AI Bias Detection Tool',
                description: 'Build a tool that detects and measures bias in AI models and datasets.',
                technologies: ['Python', 'Bias Detection', 'Fairness Metrics', 'AI Ethics', 'Responsible AI', 'Bias Analysis', 'AI/ML', 'Ethical AI', 'Fairness AI', 'Responsible Development']
              },
              {
                title: 'Transparent AI System',
                description: 'Create an AI system that provides explanations for its decisions and reasoning.',
                technologies: ['Python', 'Explainable AI', 'Transparency', 'Decision Explanations', 'Responsible AI', 'AI Ethics', 'AI/ML', 'Transparent AI', 'Explainable ML', 'Responsible Development']
              }
            ],
            intermediate: [
              {
                title: 'Privacy-Preserving AI Platform',
                description: 'Build a platform that enables AI training and inference while preserving user privacy.',
                technologies: ['Python', 'Privacy-preserving AI', 'Differential Privacy', 'Secure AI', 'Privacy Protection', 'Responsible AI', 'AI/ML', 'Privacy AI', 'Secure ML', 'Responsible Development']
              },
              {
                title: 'AI Governance Framework',
                description: 'Create a framework for governing AI systems with accountability, monitoring, and control mechanisms.',
                technologies: ['Python', 'AI Governance', 'Accountability', 'Monitoring', 'Control Systems', 'Responsible AI', 'AI/ML', 'Governance AI', 'Accountable AI', 'Responsible Development']
              },
              {
                title: 'Ethical AI Assessment Tool',
                description: 'Build a tool that assesses the ethical implications of AI systems and provides recommendations.',
                technologies: ['Python', 'Ethical Assessment', 'AI Ethics', 'Impact Analysis', 'Recommendations', 'Responsible AI', 'AI/ML', 'Ethical AI', 'Assessment Tools', 'Responsible Development']
              }
            ],
            advanced: [
              {
                title: 'AI Safety Research Platform',
                description: 'Create a platform for researching AI safety, alignment, and control mechanisms.',
                technologies: ['Python', 'AI Safety', 'Alignment Research', 'Control Mechanisms', 'Safety AI', 'Responsible AI', 'AI/ML', 'Safety Research', 'Alignment AI', 'Responsible Development']
              },
              {
                title: 'Human-AI Collaboration Framework',
                description: 'Build a framework that enables safe and effective collaboration between humans and AI systems.',
                technologies: ['Python', 'Human-AI Collaboration', 'Safety Protocols', 'Collaboration AI', 'Responsible AI', 'AI/ML', 'Collaboration Framework', 'Human-AI Interface', 'Responsible Development']
              },
              {
                title: 'AI Impact Assessment System',
                description: 'Create a system that assesses the social, economic, and environmental impact of AI deployments.',
                technologies: ['Python', 'Impact Assessment', 'Social Impact', 'Economic Impact', 'Environmental Impact', 'Responsible AI', 'AI/ML', 'Impact Analysis', 'Assessment AI', 'Responsible Development']
              },
              {
                title: 'Ethical AI Training Platform',
                description: 'Build a platform for training AI systems with ethical principles and values.',
                technologies: ['Python', 'Ethical Training', 'Value Alignment', 'Ethical Principles', 'Training AI', 'Responsible AI', 'AI/ML', 'Ethical Training', 'Value AI', 'Responsible Development']
              },
              {
                title: 'AI Regulation Compliance System',
                description: 'Create a system that ensures AI deployments comply with regulations and ethical guidelines.',
                technologies: ['Python', 'Regulation Compliance', 'Ethical Guidelines', 'Compliance AI', 'Responsible AI', 'AI/ML', 'Compliance System', 'Regulatory AI', 'Responsible Development', 'Compliance Framework']
              }
            ]
          }
        },
        {
          id: 'mlops',
          title: 'AI Model Deployment & MLOps',
          description: 'Production AI deployment, model management, and ML operations',
          completed: false,
          estimatedHours: 40,
          difficulty: 'advanced',
          resources: ['MLOps Best Practices', 'Kubeflow Documentation', 'MLflow Guides'],
          projects: {
            beginner: [
              {
                title: 'Model Versioning System',
                description: 'Build a system for versioning, tracking, and managing AI models throughout their lifecycle.',
                technologies: ['Python', 'Model Versioning', 'Model Management', 'Lifecycle Management', 'MLOps', 'AI/ML', 'Version Control', 'Model Tracking', 'ML Operations', 'Production AI']
              },
              {
                title: 'Model Performance Monitoring',
                description: 'Create a system that monitors AI model performance in production and detects degradation.',
                technologies: ['Python', 'Performance Monitoring', 'Model Degradation', 'Production Monitoring', 'MLOps', 'AI/ML', 'Monitoring System', 'Performance AI', 'ML Operations', 'Production AI']
              }
            ],
            intermediate: [
              {
                title: 'Automated Model Training Pipeline',
                description: 'Build an automated pipeline for training, testing, and deploying AI models.',
                technologies: ['Python', 'Automated Training', 'CI/CD Pipeline', 'Model Deployment', 'MLOps', 'AI/ML', 'Automation', 'Training Pipeline', 'ML Operations', 'Production AI']
              },
              {
                title: 'Model A/B Testing Framework',
                description: 'Create a framework for A/B testing different AI models and measuring their performance.',
                technologies: ['Python', 'A/B Testing', 'Model Comparison', 'Performance Testing', 'MLOps', 'AI/ML', 'Testing Framework', 'Comparison AI', 'ML Operations', 'Production AI']
              },
              {
                title: 'Distributed Model Training',
                description: 'Implement distributed training systems for large-scale AI models across multiple machines.',
                technologies: ['Python', 'Distributed Training', 'Large-scale Models', 'Multi-machine Training', 'MLOps', 'AI/ML', 'Distributed Systems', 'Scale AI', 'ML Operations', 'Production AI']
              }
            ],
            advanced: [
              {
                title: 'Real-time Model Serving Platform',
                description: 'Build a platform for serving AI models in real-time with low latency and high throughput.',
                technologies: ['Python', 'Real-time Serving', 'Low Latency', 'High Throughput', 'MLOps', 'AI/ML', 'Serving Platform', 'Real-time AI', 'ML Operations', 'Production AI']
              },
              {
                title: 'Model Interpretability Platform',
                description: 'Create a platform that provides interpretability and explainability for deployed AI models.',
                technologies: ['Python', 'Model Interpretability', 'Explainability', 'Interpretable AI', 'MLOps', 'AI/ML', 'Interpretability Platform', 'Explainable AI', 'ML Operations', 'Production AI']
              },
              {
                title: 'Federated Learning Infrastructure',
                description: 'Build infrastructure for federated learning that enables collaborative model training across organizations.',
                technologies: ['Python', 'Federated Learning', 'Collaborative Training', 'Cross-organization', 'MLOps', 'AI/ML', 'Federated Infrastructure', 'Collaborative AI', 'ML Operations', 'Production AI']
              },
              {
                title: 'AutoML Platform',
                description: 'Create an automated machine learning platform that automatically builds and optimizes AI models.',
                technologies: ['Python', 'AutoML', 'Automated Model Building', 'Model Optimization', 'MLOps', 'AI/ML', 'AutoML Platform', 'Automated AI', 'ML Operations', 'Production AI']
              },
              {
                title: 'AI Model Marketplace',
                description: 'Build a marketplace where organizations can buy, sell, and share AI models with proper governance.',
                technologies: ['Python', 'Model Marketplace', 'Model Sharing', 'Governance', 'MLOps', 'AI/ML', 'Marketplace Platform', 'Model Economy', 'ML Operations', 'Production AI']
              }
            ]
          }
        }
      ]
    },
    {
      id: 'cybersecurity',
      title: 'Cybersecurity & Ethical Hacking',
      description: 'Master cybersecurity, penetration testing, and ethical hacking techniques',
      icon: '🔒',
      color: 'bg-gradient-to-r from-red-600 to-orange-600',
      completed: false,
      order: 28,
      estimatedTotalHours: 400,
      subsections: [
        {
          id: 'penetration-testing',
          title: 'Penetration Testing & Vulnerability Assessment',
          description: 'Advanced penetration testing techniques and vulnerability discovery',
          completed: false,
          estimatedHours: 40,
          difficulty: 'advanced',
          resources: ['OWASP Testing Guide', 'Metasploit Framework', 'Burp Suite'],
          projects: {
            beginner: [
              {
                title: 'Automated Vulnerability Scanner',
                description: 'Build a tool that automatically scans applications and networks for common vulnerabilities.',
                technologies: ['Python', 'Vulnerability Scanning', 'Automated Testing', 'Security Tools', 'Penetration Testing', 'Cybersecurity', 'Security Automation', 'Vulnerability Assessment', 'Security Testing', 'Ethical Hacking']
              },
              {
                title: 'Web Application Security Tester',
                description: 'Create a tool for testing web applications against OWASP Top 10 vulnerabilities.',
                technologies: ['Python', 'Web Security', 'OWASP Testing', 'Security Testing', 'Web Applications', 'Cybersecurity', 'Security Tools', 'Vulnerability Testing', 'Security Assessment', 'Ethical Hacking']
              }
            ],
            intermediate: [
              {
                title: 'Network Penetration Testing Framework',
                description: 'Build a comprehensive framework for conducting network penetration tests and security assessments.',
                technologies: ['Python', 'Network Security', 'Penetration Testing', 'Security Framework', 'Network Assessment', 'Cybersecurity', 'Security Tools', 'Network Testing', 'Security Framework', 'Ethical Hacking']
              },
              {
                title: 'Social Engineering Toolkit',
                description: 'Create tools for testing social engineering vulnerabilities and human security awareness.',
                technologies: ['Python', 'Social Engineering', 'Human Security', 'Awareness Testing', 'Social Testing', 'Cybersecurity', 'Security Tools', 'Human Testing', 'Security Awareness', 'Ethical Hacking']
              },
              {
                title: 'Mobile Application Security Scanner',
                description: 'Build a scanner for detecting security vulnerabilities in mobile applications.',
                technologies: ['Python', 'Mobile Security', 'App Security', 'Mobile Testing', 'Security Scanning', 'Cybersecurity', 'Security Tools', 'Mobile Testing', 'App Assessment', 'Ethical Hacking']
              }
            ],
            advanced: [
              {
                title: 'Advanced Persistent Threat Simulator',
                description: 'Create a simulator for testing defenses against advanced persistent threats and sophisticated attacks.',
                technologies: ['Python', 'APT Simulation', 'Advanced Threats', 'Threat Simulation', 'Defense Testing', 'Cybersecurity', 'Security Tools', 'Threat Testing', 'Advanced Security', 'Ethical Hacking']
              },
              {
                title: 'Zero-Day Vulnerability Research Platform',
                description: 'Build a platform for researching and discovering zero-day vulnerabilities in software and systems.',
                technologies: ['Python', 'Zero-Day Research', 'Vulnerability Discovery', 'Research Platform', 'Security Research', 'Cybersecurity', 'Security Tools', 'Research Tools', 'Vulnerability Research', 'Ethical Hacking']
              },
              {
                title: 'Red Team Automation Framework',
                description: 'Create an automated framework for red team operations and advanced penetration testing.',
                technologies: ['Python', 'Red Team', 'Automation Framework', 'Advanced Testing', 'Red Team Operations', 'Cybersecurity', 'Security Tools', 'Automation', 'Red Team Tools', 'Ethical Hacking']
              },
              {
                title: 'Threat Intelligence Platform',
                description: 'Build a platform for collecting, analyzing, and sharing threat intelligence information.',
                technologies: ['Python', 'Threat Intelligence', 'Intelligence Analysis', 'Threat Sharing', 'Intelligence Platform', 'Cybersecurity', 'Security Tools', 'Intelligence Tools', 'Threat Analysis', 'Ethical Hacking']
              },
              {
                title: 'Advanced Exploit Development Framework',
                description: 'Create a framework for developing and testing advanced exploits and attack techniques.',
                technologies: ['Python', 'Exploit Development', 'Advanced Exploits', 'Attack Techniques', 'Exploit Framework', 'Cybersecurity', 'Security Tools', 'Exploit Tools', 'Advanced Attacks', 'Ethical Hacking']
              }
            ]
          }
        },
        {
          id: 'cryptography',
          title: 'Cryptography & Encryption',
          description: 'Advanced cryptographic techniques and secure communication systems',
          completed: false,
          estimatedHours: 40,
          difficulty: 'advanced',
          resources: ['Cryptography Textbook', 'OpenSSL Documentation', 'Cryptographic Protocols'],
          projects: {
            beginner: [
              {
                title: 'Custom Encryption Algorithm',
                description: 'Implement a custom encryption algorithm with key management and secure communication.',
                technologies: ['Python', 'Custom Encryption', 'Key Management', 'Secure Communication', 'Cryptography', 'Cybersecurity', 'Encryption Tools', 'Custom Crypto', 'Security Algorithms', 'Cryptographic Security']
              },
              {
                title: 'Secure Messaging Application',
                description: 'Build a messaging app with end-to-end encryption and secure key exchange.',
                technologies: ['Python', 'End-to-End Encryption', 'Secure Messaging', 'Key Exchange', 'Messaging App', 'Cybersecurity', 'Encryption Tools', 'Secure Communication', 'Messaging Security', 'Cryptographic Security']
              }
            ],
            intermediate: [
              {
                title: 'Blockchain Cryptography Implementation',
                description: 'Implement cryptographic primitives for blockchain applications including digital signatures and hash functions.',
                technologies: ['Python', 'Blockchain Crypto', 'Digital Signatures', 'Hash Functions', 'Blockchain Security', 'Cybersecurity', 'Encryption Tools', 'Blockchain Tools', 'Crypto Implementation', 'Cryptographic Security']
              },
              {
                title: 'Zero-Knowledge Proof System',
                description: 'Build a system that implements zero-knowledge proofs for privacy-preserving authentication.',
                technologies: ['Python', 'Zero-Knowledge Proofs', 'Privacy Authentication', 'Proof Systems', 'Privacy Security', 'Cybersecurity', 'Encryption Tools', 'Privacy Tools', 'Proof Implementation', 'Cryptographic Security']
              },
              {
                title: 'Homomorphic Encryption Platform',
                description: 'Create a platform that enables computation on encrypted data without decryption.',
                technologies: ['Python', 'Homomorphic Encryption', 'Encrypted Computation', 'Privacy Computing', 'Secure Computation', 'Cybersecurity', 'Encryption Tools', 'Computation Tools', 'Privacy Computing', 'Cryptographic Security']
              }
            ],
            advanced: [
              {
                title: 'Post-Quantum Cryptography Implementation',
                description: 'Implement post-quantum cryptographic algorithms that are resistant to quantum attacks.',
                technologies: ['Python', 'Post-Quantum Crypto', 'Quantum Resistance', 'Future Crypto', 'Quantum Security', 'Cybersecurity', 'Encryption Tools', 'Quantum Tools', 'Future Security', 'Cryptographic Security']
              },
              {
                title: 'Multi-Party Computation Framework',
                description: 'Build a framework for secure multi-party computation that enables collaborative computation on private data.',
                technologies: ['Python', 'Multi-Party Computation', 'Collaborative Computing', 'Private Data', 'Secure Collaboration', 'Cybersecurity', 'Encryption Tools', 'Collaboration Tools', 'Private Computing', 'Cryptographic Security']
              },
              {
                title: 'Advanced Key Management System',
                description: 'Create a comprehensive key management system for enterprise-scale cryptographic operations.',
                technologies: ['Python', 'Key Management', 'Enterprise Crypto', 'Key Operations', 'Enterprise Security', 'Cybersecurity', 'Encryption Tools', 'Enterprise Tools', 'Key Operations', 'Cryptographic Security']
              },
              {
                title: 'Cryptographic Protocol Analyzer',
                description: 'Build a tool for analyzing and verifying the security of cryptographic protocols.',
                technologies: ['Python', 'Protocol Analysis', 'Security Verification', 'Protocol Security', 'Analysis Tools', 'Cybersecurity', 'Encryption Tools', 'Analysis Tools', 'Protocol Tools', 'Cryptographic Security']
              },
              {
                title: 'Quantum Key Distribution System',
                description: 'Implement a quantum key distribution system for ultra-secure key exchange.',
                technologies: ['Python', 'Quantum Key Distribution', 'Quantum Security', 'Ultra-secure Exchange', 'Quantum Crypto', 'Cybersecurity', 'Encryption Tools', 'Quantum Tools', 'Quantum Security', 'Cryptographic Security']
              }
            ]
          }
        },
        {
          id: 'network-security',
          title: 'Network Security & Defense',
          description: 'Advanced network security, intrusion detection, and defense systems',
          completed: false,
          estimatedHours: 40,
          difficulty: 'advanced',
          resources: ['Network Security Handbook', 'Snort Documentation', 'Wireshark Guides'],
          projects: {
            beginner: [
              {
                title: 'Network Intrusion Detection System',
                description: 'Build an IDS that monitors network traffic and detects suspicious activities and attacks.',
                technologies: ['Python', 'Intrusion Detection', 'Network Monitoring', 'Traffic Analysis', 'Security Monitoring', 'Cybersecurity', 'Security Tools', 'Network Tools', 'Detection System', 'Network Security']
              },
              {
                title: 'Firewall Management System',
                description: 'Create a system for managing and configuring firewalls with advanced rule sets.',
                technologies: ['Python', 'Firewall Management', 'Rule Configuration', 'Network Protection', 'Firewall System', 'Cybersecurity', 'Security Tools', 'Firewall Tools', 'Management System', 'Network Security']
              }
            ],
            intermediate: [
              {
                title: 'Advanced Threat Detection Platform',
                description: 'Build a platform that uses machine learning to detect advanced threats and anomalies in network traffic.',
                technologies: ['Python', 'Threat Detection', 'Machine Learning', 'Anomaly Detection', 'Advanced Threats', 'Cybersecurity', 'Security Tools', 'ML Tools', 'Detection Platform', 'Network Security']
              },
              {
                title: 'Network Traffic Analysis Tool',
                description: 'Create a tool for deep packet inspection and analysis of network traffic patterns.',
                technologies: ['Python', 'Traffic Analysis', 'Packet Inspection', 'Pattern Analysis', 'Network Analysis', 'Cybersecurity', 'Security Tools', 'Analysis Tools', 'Traffic Tools', 'Network Security']
              },
              {
                title: 'Secure Network Architecture Design',
                description: 'Design and implement secure network architectures with defense-in-depth principles.',
                technologies: ['Python', 'Network Architecture', 'Defense-in-Depth', 'Secure Design', 'Architecture Security', 'Cybersecurity', 'Security Tools', 'Architecture Tools', 'Design System', 'Network Security']
              }
            ],
            advanced: [
              {
                title: 'Deception Technology Platform',
                description: 'Build a platform that uses deception technology to detect and trap attackers.',
                technologies: ['Python', 'Deception Technology', 'Attack Trapping', 'Honeypots', 'Deception Security', 'Cybersecurity', 'Security Tools', 'Deception Tools', 'Trapping System', 'Network Security']
              },
              {
                title: 'Network Forensics Platform',
                description: 'Create a platform for conducting network forensics and incident response.',
                technologies: ['Python', 'Network Forensics', 'Incident Response', 'Forensic Analysis', 'Response Platform', 'Cybersecurity', 'Security Tools', 'Forensic Tools', 'Response System', 'Network Security']
              },
              {
                title: 'Zero Trust Network Architecture',
                description: 'Implement a zero trust network architecture with continuous verification and least privilege access.',
                technologies: ['Python', 'Zero Trust', 'Continuous Verification', 'Least Privilege', 'Trust Architecture', 'Cybersecurity', 'Security Tools', 'Trust Tools', 'Verification System', 'Network Security']
              },
              {
                title: 'Network Security Orchestration',
                description: 'Build a system that orchestrates security tools and automates incident response.',
                technologies: ['Python', 'Security Orchestration', 'Automated Response', 'Tool Integration', 'Orchestration System', 'Cybersecurity', 'Security Tools', 'Orchestration Tools', 'Automation System', 'Network Security']
              },
              {
                title: 'Advanced Network Monitoring',
                description: 'Create an advanced monitoring system that provides real-time visibility into network security posture.',
                technologies: ['Python', 'Network Monitoring', 'Real-time Visibility', 'Security Posture', 'Monitoring System', 'Cybersecurity', 'Security Tools', 'Monitoring Tools', 'Visibility System', 'Network Security']
              }
            ]
          }
        },
        {
          id: 'application-security',
          title: 'Application Security & Secure Development',
          description: 'Secure coding practices, application security testing, and DevSecOps',
          completed: false,
          estimatedHours: 40,
          difficulty: 'advanced',
          resources: ['OWASP Top 10', 'Secure Coding Guidelines', 'DevSecOps Practices'],
          projects: {
            beginner: [
              {
                title: 'Static Code Analysis Tool',
                description: 'Build a tool that analyzes source code for security vulnerabilities and coding issues.',
                technologies: ['Python', 'Static Analysis', 'Code Security', 'Vulnerability Detection', 'Code Analysis', 'Cybersecurity', 'Security Tools', 'Analysis Tools', 'Code Security', 'Application Security']
              },
              {
                title: 'Secure Code Review Platform',
                description: 'Create a platform for conducting secure code reviews and security assessments.',
                technologies: ['Python', 'Code Review', 'Security Assessment', 'Review Platform', 'Secure Review', 'Cybersecurity', 'Security Tools', 'Review Tools', 'Assessment Platform', 'Application Security']
              }
            ],
            intermediate: [
              {
                title: 'API Security Testing Framework',
                description: 'Build a framework for testing API security including authentication, authorization, and input validation.',
                technologies: ['Python', 'API Security', 'Security Testing', 'Authentication Testing', 'API Testing', 'Cybersecurity', 'Security Tools', 'API Tools', 'Testing Framework', 'Application Security']
              },
              {
                title: 'Container Security Scanner',
                description: 'Create a scanner for detecting security vulnerabilities in Docker containers and images.',
                technologies: ['Python', 'Container Security', 'Docker Security', 'Image Scanning', 'Container Scanning', 'Cybersecurity', 'Security Tools', 'Container Tools', 'Scanning System', 'Application Security']
              },
              {
                title: 'Secure Development Lifecycle Platform',
                description: 'Build a platform that integrates security into the software development lifecycle.',
                technologies: ['Python', 'Secure SDLC', 'Development Security', 'Lifecycle Integration', 'SDLC Security', 'Cybersecurity', 'Security Tools', 'SDLC Tools', 'Integration Platform', 'Application Security']
              }
            ],
            advanced: [
              {
                title: 'Runtime Application Self-Protection',
                description: 'Implement RASP technology that protects applications from attacks at runtime.',
                technologies: ['Python', 'RASP', 'Runtime Protection', 'Application Protection', 'Runtime Security', 'Cybersecurity', 'Security Tools', 'RASP Tools', 'Protection System', 'Application Security']
              },
              {
                title: 'Software Composition Analysis',
                description: 'Create a system for analyzing third-party dependencies and detecting vulnerabilities.',
                technologies: ['Python', 'Dependency Analysis', 'Third-party Security', 'Vulnerability Detection', 'Composition Analysis', 'Cybersecurity', 'Security Tools', 'Analysis Tools', 'Dependency Security', 'Application Security']
              },
              {
                title: 'Secure CI/CD Pipeline',
                description: 'Build a secure CI/CD pipeline that integrates security testing and compliance checks.',
                technologies: ['Python', 'Secure CI/CD', 'Pipeline Security', 'Compliance Checks', 'CI/CD Security', 'Cybersecurity', 'Security Tools', 'Pipeline Tools', 'Compliance System', 'Application Security']
              },
              {
                title: 'Threat Modeling Platform',
                description: 'Create a platform for conducting threat modeling and security architecture analysis.',
                technologies: ['Python', 'Threat Modeling', 'Security Architecture', 'Architecture Analysis', 'Modeling Platform', 'Cybersecurity', 'Security Tools', 'Modeling Tools', 'Architecture Analysis', 'Application Security']
              },
              {
                title: 'Secure Software Supply Chain',
                description: 'Build a system for securing the software supply chain from development to deployment.',
                technologies: ['Python', 'Supply Chain Security', 'Software Security', 'Chain Protection', 'Supply Security', 'Cybersecurity', 'Security Tools', 'Supply Tools', 'Chain Protection', 'Application Security']
              }
            ]
          }
        }
      ]
    }
  ],
  totalProgress: 0,
  totalEstimatedHours: 5100,
  completedHours: 0
};

// Calculate total hours
roadmapData.totalEstimatedHours = roadmapData.sections.reduce((total, section) => {
  return total + section.estimatedTotalHours;
}, 0);

export default roadmapData;

