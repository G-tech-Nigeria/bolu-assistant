import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, X, Sparkles, Lightbulb, TrendingUp, Target, Leaf, DollarSign, BookOpen, Activity } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  context?: string;
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi! 👋 I'm your personal AI assistant, ready to help you with your productivity app!\n\nI can assist with:\n🎯 **Dev Roadmap** - Study tips, project planning, progress analysis\n💰 **Finance** - Spending insights, budget advice, financial goals\n🌱 **Plant Care** - Care tips, troubleshooting, watering schedules\n🏃 **Health & Habits** - Workout suggestions, habit building, activity tracking\n📝 **Notes & Organization** - Note organization, productivity tips\n\n💡 **Just ask me anything!** I'll automatically detect what you need help with, or you can select a specific area using the buttons below.\n\nWhat would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [selectedContext, setSelectedContext] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const contextOptions = [
    { id: 'dev-roadmap', label: 'Dev Roadmap', icon: <BookOpen className="w-4 h-4" />, color: 'bg-blue-500' },
    { id: 'finance', label: 'Finance', icon: <DollarSign className="w-4 h-4" />, color: 'bg-green-500' },
    { id: 'plant-care', label: 'Plant Care', icon: <Leaf className="w-4 h-4" />, color: 'bg-emerald-500' },
    { id: 'health-habits', label: 'Health & Habits', icon: <Activity className="w-4 h-4" />, color: 'bg-purple-500' },
    { id: 'notes', label: 'Notes', icon: <Target className="w-4 h-4" />, color: 'bg-orange-500' },
    { id: 'general', label: 'General App Help', icon: <Lightbulb className="w-4 h-4" />, color: 'bg-gray-500' }
  ];

  const getContextPrompt = (context: string) => {
    const contextPrompts = {
      'dev-roadmap': 'You are helping with the Development Roadmap feature. Focus on: study strategies, project planning, learning paths, progress tracking, and development goals. Only discuss programming, software development, and learning topics.',
      'finance': 'You are helping with the Finance feature. Focus on: budgeting, spending analysis, financial planning, saving strategies, and money management. Only discuss personal finance topics.',
      'plant-care': 'You are helping with the Plant Care feature. Focus on: plant health, watering schedules, care tips, troubleshooting plant issues, and gardening advice. Only discuss plant care topics.',
      'health-habits': 'You are helping with the Health & Habits feature. Focus on: fitness, wellness, habit building, goal setting, and healthy living. Only discuss health and wellness topics.',
      'notes': 'You are helping with the Notes feature. Focus on: organization, productivity, note-taking strategies, and information management. Only discuss productivity and organization topics.',
      'general': 'You are helping with the overall application. Focus on: app features, productivity, goal setting, and personal development. Only discuss topics related to this productivity app.'
    };
    return contextPrompts[context as keyof typeof contextPrompts] || contextPrompts.general;
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      context: selectedContext
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Use the smart response system directly - more reliable than external APIs
    const smartResponse = generateSmartResponse(inputValue, selectedContext);
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: smartResponse,
      timestamp: new Date(),
      context: selectedContext
    };

    setMessages(prev => [...prev, aiMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const generateSmartResponse = (userInput: string, context: string): string => {
    const input = userInput.toLowerCase();
    
    // If no context is selected, try to detect it from the user's input
    if (!context) {
      if (input.includes('javascript') || input.includes('js') || input.includes('code') || input.includes('program') || input.includes('learn') || input.includes('study') || input.includes('project')) {
        context = 'dev-roadmap';
      } else if (input.includes('money') || input.includes('save') || input.includes('budget') || input.includes('spend') || input.includes('finance') || input.includes('expense')) {
        context = 'finance';
      } else if (input.includes('plant') || input.includes('water') || input.includes('grow') || input.includes('leaf') || input.includes('garden')) {
        context = 'plant-care';
      } else if (input.includes('workout') || input.includes('exercise') || input.includes('health') || input.includes('habit') || input.includes('fitness') || input.includes('gym')) {
        context = 'health-habits';
      } else if (input.includes('note') || input.includes('organize') || input.includes('productivity') || input.includes('task')) {
        context = 'notes';
      }
    }
    
    // Dev Roadmap responses
    if (context === 'dev-roadmap' || input.includes('javascript') || input.includes('js') || input.includes('code') || input.includes('program') || input.includes('learn') || input.includes('study') || input.includes('project')) {
      if (input.includes('javascript') || input.includes('js')) {
        return "Great question about JavaScript! Here are some effective study strategies:\n\n📚 **Start with fundamentals**: Variables, functions, arrays, objects\n🎯 **Practice daily**: Code for at least 30 minutes every day\n🏗️ **Build projects**: Start with simple apps like calculators, to-do lists\n📖 **Use resources**: MDN Web Docs, JavaScript.info, freeCodeCamp\n💻 **Practice coding**: LeetCode, HackerRank, or build your own projects\n\nRemember: Consistency beats intensity. Small daily practice builds lasting skills!";
      }
      if (input.includes('project') || input.includes('build')) {
        return "Excellent! Here are some great project ideas to build your skills:\n\n🎯 **Beginner Projects**:\n• Personal portfolio website\n• To-do list app\n• Calculator\n• Weather app\n\n🚀 **Intermediate Projects**:\n• E-commerce site\n• Social media clone\n• Real-time chat app\n• Task management system\n\n💡 **Tips**: Start simple, add features gradually, and focus on completing projects rather than making them perfect!";
      }
      if (input.includes('study') || input.includes('learn')) {
        return "Here's how to study programming effectively:\n\n⏰ **Time Management**:\n• Study in focused 25-minute sessions (Pomodoro technique)\n• Take regular breaks\n• Practice daily, even if just 30 minutes\n\n📚 **Learning Methods**:\n• Read → Watch → Code → Repeat\n• Build projects to apply what you learn\n• Teach others to reinforce knowledge\n• Use spaced repetition techniques\n\n🎯 **Focus Areas**:\n• Master fundamentals before advanced topics\n• Practice problem-solving daily\n• Build a portfolio of projects\n\nRemember: Learning to code is a marathon, not a sprint!";
      }
      if (input.includes('roadmap') || input.includes('plan')) {
        return "Great question about planning your development journey! Here's how to create an effective roadmap:\n\n🎯 **Phase 1: Foundations** (2-3 months)\n• HTML, CSS, JavaScript basics\n• Git version control\n• Command line basics\n\n🚀 **Phase 2: Frontend** (3-4 months)\n• React fundamentals\n• State management\n• Responsive design\n\n⚙️ **Phase 3: Backend** (3-4 months)\n• Node.js and Express\n• Database basics\n• API development\n\n🌐 **Phase 4: Full Stack** (2-3 months)\n• Connect frontend and backend\n• Deploy applications\n• Real-world projects\n\n💡 **Tips**: Focus on one phase at a time, build projects in each phase, and don't rush the fundamentals!";
      }
      return "Great question about your development roadmap! Here are some general tips:\n\n🎯 **Set clear goals**: Define what you want to achieve\n📚 **Create a learning plan**: Break down topics into manageable chunks\n💻 **Practice regularly**: Code every day, even if just a little\n🏗️ **Build projects**: Apply what you learn to real applications\n📊 **Track progress**: Use your roadmap to monitor advancement\n\nWhat specific area would you like to focus on?";
    }
    
    // Finance responses
    if (context === 'finance' || input.includes('money') || input.includes('save') || input.includes('budget') || input.includes('spend') || input.includes('finance') || input.includes('expense')) {
      if (input.includes('save') || input.includes('budget')) {
        return "Great financial question! Here are some effective saving and budgeting strategies:\n\n💰 **50/30/20 Rule**:\n• 50% for needs (rent, food, utilities)\n• 30% for wants (entertainment, shopping)\n• 20% for savings and debt repayment\n\n📊 **Budgeting Tips**:\n• Track all expenses for a month\n• Use your app's finance tracker consistently\n• Set realistic spending limits\n• Automate savings transfers\n\n🎯 **Saving Strategies**:\n• Start with 10% of income\n• Increase gradually\n• Use high-yield savings accounts\n• Set specific financial goals\n\nRemember: Small changes add up to big results over time!";
      }
      if (input.includes('spend') || input.includes('expense')) {
        return "Here's how to track and control your spending:\n\n📱 **Use Your App**:\n• Log every transaction immediately\n• Categorize expenses properly\n• Review spending patterns weekly\n• Set spending alerts\n\n🔍 **Analyze Patterns**:\n• Identify your biggest spending categories\n• Look for unnecessary expenses\n• Find areas to cut back\n• Track progress over time\n\n💡 **Smart Spending**:\n• Wait 24 hours before big purchases\n• Use cash for discretionary spending\n• Set monthly spending limits\n• Reward yourself for staying on track\n\nConsistent tracking is the key to financial success!";
      }
      if (input.includes('invest') || input.includes('stock') || input.includes('crypto')) {
        return "Great question about investing! Here are some important principles:\n\n💰 **Start with the Basics**:\n• Build an emergency fund first (3-6 months expenses)\n• Pay off high-interest debt\n• Start with retirement accounts (401k, IRA)\n\n📈 **Investment Options**:\n• Index funds (low-cost, diversified)\n• Target-date funds (automated allocation)\n• Robo-advisors (automated management)\n\n⚠️ **Important Notes**:\n• Don't invest money you'll need soon\n• Diversify your investments\n• Start small and increase gradually\n• Consider consulting a financial advisor\n\nRemember: Investing is a long-term strategy, not a get-rich-quick scheme!";
      }
      return "Great question about your finances! Here are some general financial tips:\n\n📊 **Track Everything**: Use your app to monitor all income and expenses\n💰 **Set Goals**: Define short-term and long-term financial objectives\n💳 **Control Debt**: Pay off high-interest debt first\n📈 **Invest Early**: Start investing as soon as possible\n🔄 **Review Regularly**: Check your financial progress monthly\n\nWhat specific financial area would you like help with?";
    }
    
    // Plant Care responses
    if (context === 'plant-care' || input.includes('plant') || input.includes('water') || input.includes('grow') || input.includes('leaf') || input.includes('garden')) {
      if (input.includes('yellow') || input.includes('leaves')) {
        return "Yellow leaves can indicate several issues:\n\n💧 **Overwatering**: Most common cause\n• Check if soil is soggy\n• Ensure proper drainage\n• Let soil dry between waterings\n\n☀️ **Light Issues**:\n• Too much direct sun can burn leaves\n• Too little light causes yellowing\n• Move to bright, indirect light\n\n🌱 **Nutrient Deficiency**:\n• Use balanced fertilizer\n• Check soil pH\n• Repot if soil is old\n\n🔍 **Other Causes**:\n• Pests (check undersides of leaves)\n• Root rot (smell the soil)\n• Temperature stress\n\nStart by checking your watering schedule and light conditions!";
      }
      if (input.includes('water') || input.includes('watering')) {
        return "Here's how to water your plants properly:\n\n💧 **Watering Basics**:\n• Check soil moisture with your finger\n• Water when top 1-2 inches feel dry\n• Water thoroughly until it drains out\n• Empty drainage tray\n\n⏰ **Frequency Tips**:\n• Most plants: 1-2 times per week\n• Succulents: Every 2-3 weeks\n• Tropical plants: More frequent\n• Adjust for season and humidity\n\n🌡️ **Factors to Consider**:\n• Temperature and humidity\n• Pot size and material\n• Plant type and size\n• Season and growth phase\n\nRemember: It's better to underwater than overwater!";
      }
      if (input.includes('light') || input.includes('sun')) {
        return "Great question about plant lighting! Here's what different plants need:\n\n☀️ **Bright Direct Light** (6+ hours direct sun):\n• Succulents and cacti\n• Most flowering plants\n• Herbs like rosemary and thyme\n\n🌤️ **Bright Indirect Light** (bright but no direct sun):\n• Monstera and philodendrons\n• Snake plants\n• Pothos and ivy\n\n🌥️ **Medium Light** (filtered or partial sun):\n• Peace lilies\n• Chinese evergreens\n• Some ferns\n\n💡 **Low Light** (minimal natural light):\n• ZZ plants\n• Snake plants\n• Cast iron plants\n\n🔍 **Signs of Wrong Light**:\n• Too much: scorched leaves, brown tips\n• Too little: leggy growth, small leaves\n\nAdjust your plant's position based on its needs!";
      }
      return "Great question about plant care! Here are some general tips:\n\n🌱 **Basic Care**:\n• Provide appropriate light\n• Water when soil is dry\n• Use well-draining soil\n• Maintain proper temperature\n\n📱 **Use Your App**:\n• Track watering schedules\n• Set reminders\n• Monitor plant health\n• Record care activities\n\n💡 **Pro Tips**:\n• Research your specific plants\n• Start with easy-care plants\n• Observe and adjust care routines\n• Don't be afraid to experiment\n\nWhat specific plant care question do you have?";
    }
    
    // Health & Habits responses
    if (context === 'health-habits' || input.includes('workout') || input.includes('exercise') || input.includes('health') || input.includes('habit') || input.includes('fitness') || input.includes('gym')) {
      if (input.includes('workout') || input.includes('exercise')) {
        return "Great question about building a workout routine! Here's how to get started:\n\n🏃 **Start Small**:\n• Begin with 10-15 minutes daily\n• Focus on consistency over intensity\n• Gradually increase duration and difficulty\n\n💪 **Basic Routine**:\n• Cardio: Walking, jogging, cycling\n• Strength: Bodyweight exercises, resistance bands\n• Flexibility: Stretching, yoga\n• Core: Planks, crunches, leg raises\n\n📱 **Use Your App**:\n• Track your workouts\n• Set achievable goals\n• Monitor progress\n• Celebrate milestones\n\n🎯 **Tips for Success**:\n• Schedule workouts like appointments\n• Find activities you enjoy\n• Work out with friends\n• Focus on how you feel, not just results\n\nRemember: Every workout counts, no matter how small!";
      }
      if (input.includes('habit') || input.includes('routine')) {
        return "Building good habits is all about consistency! Here's how:\n\n🎯 **Start with One Habit**:\n• Choose one habit to focus on\n• Make it small and specific\n• Attach it to an existing routine\n\n⏰ **Habit Stacking**:\n• After [existing habit], I will [new habit]\n• Example: After brushing teeth, I will do 10 push-ups\n• Build gradually, one habit at a time\n\n📱 **Track Progress**:\n• Use your app to monitor consistency\n• Celebrate small wins\n• Don't break the chain\n\n💡 **Success Tips**:\n• Start with 2-minute versions\n• Focus on consistency, not perfection\n• Use visual reminders\n• Reward yourself for sticking to it\n\nSmall daily actions create massive long-term results!";
      }
      if (input.includes('sleep') || input.includes('rest')) {
        return "Great question about sleep and rest! Here's how to improve your sleep quality:\n\n😴 **Sleep Hygiene**:\n• Stick to a consistent sleep schedule\n• Create a relaxing bedtime routine\n• Keep your bedroom cool and dark\n• Avoid screens 1 hour before bed\n\n🌙 **Bedtime Routine**:\n• Take a warm bath or shower\n• Read a book (not on screen)\n• Practice deep breathing\n• Use calming scents like lavender\n\n⏰ **Sleep Schedule**:\n• Aim for 7-9 hours per night\n• Go to bed and wake up at the same time\n• Avoid long naps during the day\n• Get natural sunlight in the morning\n\n💡 **Pro Tips**:\n• Track your sleep patterns in your app\n• Avoid caffeine after 2 PM\n• Exercise regularly but not close to bedtime\n• Keep a sleep journal\n\nQuality sleep is the foundation of good health!";
      }
      return "Great question about health and habits! Here are some general wellness tips:\n\n🏃 **Physical Health**:\n• Move your body daily\n• Eat nutritious foods\n• Get adequate sleep\n• Stay hydrated\n\n🧠 **Mental Health**:\n• Practice stress management\n• Build positive relationships\n• Set realistic goals\n• Celebrate progress\n\n📱 **Use Your App**:\n• Track your activities\n• Monitor your habits\n• Set wellness goals\n• Build healthy routines\n\nWhat specific health or habit question do you have?";
    }
    
    // Notes responses
    if (context === 'notes' || input.includes('note') || input.includes('organize') || input.includes('productivity') || input.includes('task')) {
      if (input.includes('organize') || input.includes('organize')) {
        return "Great question about organizing your notes! Here's how to create an effective system:\n\n📁 **Folder Structure**:\n• Create main categories (Work, Personal, Learning)\n• Use subfolders for specific topics\n• Keep it simple and logical\n\n🏷️ **Tagging System**:\n• Use consistent tags across notes\n• Create a tag hierarchy\n• Tag by topic, project, and priority\n\n📝 **Note Templates**:\n• Meeting notes template\n• Project planning template\n• Daily journal template\n• Learning notes template\n\n📱 **Use Your App Features**:\n• Pin important notes\n• Use search effectively\n• Create quick notes\n• Organize by date and topic\n\nA well-organized note system saves time and reduces stress!";
      }
      if (input.includes('productivity') || input.includes('efficient')) {
        return "Here are some productivity tips for your notes:\n\n⚡ **Quick Capture**:\n• Use voice notes for fast input\n• Create templates for common notes\n• Use shortcuts and hotkeys\n• Capture ideas immediately\n\n📊 **Organization**:\n• Review and organize notes weekly\n• Archive old notes regularly\n• Use consistent formatting\n• Link related notes together\n\n🎯 **Focus Techniques**:\n• Use the Pomodoro technique\n• Batch similar tasks\n• Eliminate distractions\n• Set clear priorities\n\n💡 **Pro Tips**:\n• Keep notes concise and actionable\n• Use bullet points and lists\n• Include action items and deadlines\n• Review notes regularly\n\nRemember: The best note system is the one you'll actually use!";
      }
      if (input.includes('template') || input.includes('format')) {
        return "Great question about note templates! Here are some useful templates you can create:\n\n📋 **Meeting Notes Template**:\n• Date, time, attendees\n• Agenda items\n• Discussion points\n• Action items with deadlines\n• Next meeting date\n\n📝 **Project Planning Template**:\n• Project name and description\n• Goals and objectives\n• Timeline and milestones\n• Resources needed\n• Progress tracking\n\n📔 **Daily Journal Template**:\n• Date and mood\n• Gratitude (3 things)\n• Main accomplishments\n• Challenges and solutions\n• Tomorrow's priorities\n\n📊 **Learning Notes Template**:\n• Topic and source\n• Key concepts\n• Examples and applications\n• Questions to research\n• Review schedule\n\n💡 **Tips**: Start with one template, customize it to your needs, and build your collection gradually!";
      }
      return "Great question about notes and organization! Here are some general tips:\n\n📝 **Note-Taking Basics**:\n• Keep it simple and consistent\n• Use clear, concise language\n• Include dates and context\n• Review notes regularly\n\n📱 **Use Your App Effectively**:\n• Organize notes into folders\n• Use tags for easy searching\n• Pin important notes\n• Create templates for common types\n\n💡 **Organization Tips**:\n• Develop a consistent system\n• Archive old notes regularly\n• Use search features\n• Link related notes together\n\nWhat specific note-taking or organization question do you have?";
    }
    
    // General app help
    if (context === 'general' || input.includes('feature') || input.includes('use') || input.includes('help') || input.includes('app')) {
      if (input.includes('feature') || input.includes('use')) {
        return "Great question about your app! Here are the main features:\n\n🎯 **Dev Roadmap**: Track learning progress, manage projects, set development goals\n💰 **Finance**: Track expenses, set budgets, analyze spending patterns\n🌱 **Plant Care**: Manage plants, set watering reminders, track care activities\n🏃 **Health & Habits**: Monitor fitness goals, track habits, build healthy routines\n📝 **Notes**: Organize information, create templates, manage knowledge\n📅 **Calendar**: Schedule events, set reminders, manage time\n\n💡 **Pro Tips**:\n• Use the dashboard for quick overview\n• Set up notifications for important reminders\n• Customize your experience in settings\n• Track progress consistently across all features\n\nWhat specific feature would you like to learn more about?";
      }
      if (input.includes('dashboard') || input.includes('overview')) {
        return "Great question about your dashboard! Here's how to make the most of it:\n\n📊 **Quick Stats**:\n• See your daily progress at a glance\n• Monitor key metrics across all features\n• Quick access to important information\n\n🎯 **Widget Cards**:\n• Tap any widget to go to the detailed view\n• Customize what information you see\n• Use as shortcuts to your most-used features\n\n📱 **Navigation**:\n• Quick access to all major features\n• Recent activity and updates\n• Important notifications and reminders\n\n💡 **Pro Tips**:\n• Use the dashboard as your command center\n• Check it regularly to stay on track\n• Customize widgets to show what matters most to you\n• Use the quick stats to identify areas for improvement\n\nYour dashboard is designed to give you a complete overview of your productivity!";
      }
      return "Welcome to your productivity app! I'm here to help you get the most out of all the features:\n\n🚀 **Getting Started**:\n• Explore each section to understand what's available\n• Set up your profile and preferences\n• Create your first goals and projects\n• Use the dashboard for quick access\n\n📱 **Key Features**:\n• Dev Roadmap for learning and development\n• Finance tracking for better money management\n• Plant Care for healthy plants\n• Health & Habits for wellness goals\n• Notes for organization\n• Calendar for time management\n\nWhat would you like to know more about?";
    }
    
    // Handle general questions and greetings
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return "Hello! 👋 I'm your AI assistant, here to help you with your productivity app. I can help with:\n\n🎯 **Dev Roadmap** - Study strategies, project planning, progress tracking\n💰 **Finance** - Budgeting, spending analysis, financial goals\n🌱 **Plant Care** - Care tips, troubleshooting, maintenance\n🏃 **Health & Habits** - Workout routines, habit building, wellness\n📝 **Notes** - Organization, productivity, information management\n\nWhat would you like help with today? You can also select a specific area using the buttons above, or just ask me anything!";
    }
    
    if (input.includes('thank') || input.includes('thanks')) {
      return "You're welcome! 😊 I'm here to help you succeed with your productivity goals. If you have any other questions about your app, learning, finances, plant care, health, or organization, just ask away!";
    }
    
    if (input.includes('how are you')) {
      return "I'm doing great, thank you for asking! 😊 I'm excited to help you with your productivity journey. Whether you need help with coding, finances, plant care, health habits, or organizing your notes, I'm here to assist. What can I help you with today?";
    }
    
    // If we still don't have a good match, provide a helpful response
    return "That's an interesting question! I'm here to help you with your productivity app. I can assist with:\n\n🎯 **Dev Roadmap** - Study strategies, project planning, progress tracking\n💰 **Finance** - Budgeting, spending analysis, financial goals\n🌱 **Plant Care** - Care tips, troubleshooting, maintenance\n🏃 **Health & Habits** - Workout routines, habit building, wellness\n📝 **Notes** - Organization, productivity, information management\n\nTry asking me something specific about any of these areas, or select a context using the buttons above. I'm here to help!";
  };

  const selectContext = (contextId: string) => {
    setSelectedContext(contextId);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'ai',
      content: `Great! I'm now focused on helping you with **${contextOptions.find(c => c.id === contextId)?.label}**. What specific question do you have?`,
      timestamp: new Date(),
      context: contextId
    }]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Assistant</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Your personal productivity companion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Context Selector */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Choose what you need help with:</p>
          <div className="flex flex-wrap gap-2">
            {contextOptions.map((context) => (
              <button
                key={context.id}
                onClick={() => selectContext(context.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedContext === context.id
                    ? `${context.color} text-white shadow-lg`
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {context.icon}
                <span>{context.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.type === 'ai' && (
                    <Bot className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
                <div className={`text-xs mt-2 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-3">
                          <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your app..."
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              Smart AI Assistant • Works offline • Free forever
            </p>
          </div>
        </div>
      </div>
    );
};

export default AIAssistant;
