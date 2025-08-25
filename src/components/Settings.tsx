import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Trash2, X, ChevronDown, ChevronRight, Code, Circle, RotateCcw, Target, BookOpen, Plus, Edit3, CheckCircle2, Smartphone, Download, Share2 } from 'lucide-react'
import { pwaService } from '../lib/pwa'

interface Phase {
    id: string
    title: string
    description: string
    startDate: string
    endDate: string
    weeks: number
    progress: number
    status: 'not-started' | 'in-progress' | 'completed'
    topics: Topic[]
    projects: Project[]
    leetCodeTarget: number
    leetCodeCompleted: number
}

interface Topic {
    id: string
    name: string
    description: string
    completed: boolean
    resources: Resource[]
}

interface Resource {
    id: string
    name: string
    url: string
    type: 'documentation' | 'course' | 'article' | 'video' | 'book'
    completed: boolean
}

interface Project {
    id: string
    name: string
    description: string
    status: 'not-started' | 'in-progress' | 'completed'
    githubUrl?: string
    liveUrl?: string
    technologies: string[]
    isCustom?: boolean
}

const Settings = () => {
    const [phases, setPhases] = useState<Phase[]>([])
    const [activeTab, setActiveTab] = useState<'phases' | 'topics' | 'projects' | 'general' | 'pwa'>('phases')
    const [pwaInfo, setPwaInfo] = useState({ isInstalled: false, canInstall: false, isStandalone: false })
    // Modal states
    const [showPhaseModal, setShowPhaseModal] = useState(false)
    const [showTopicModal, setShowTopicModal] = useState(false)
    // const [showProjectModal, setShowProjectModal] = useState(false)
    const [editingPhase, setEditingPhase] = useState<Phase | null>(null)
    const [editingTopic, setEditingTopic] = useState<{ phaseId: string; topic: Topic } | null>(null)
    // const [editingProject, setEditingProject] = useState<{ phaseId: string; project: Project } | null>(null)
    const [expandedPhase, setExpandedPhase] = useState<string | null>(null)

    // Delete confirmation modals
    const [showDeletePhaseModal, setShowDeletePhaseModal] = useState(false)
    const [showDeleteTopicModal, setShowDeleteTopicModal] = useState(false)
    const [showResetModal, setShowResetModal] = useState(false)
    const [showRestoreModal, setShowRestoreModal] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<{ type: 'phase' | 'topic'; id: string; phaseId?: string; name: string } | null>(null)

    // Form states
    const [phaseForm, setPhaseForm] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        weeks: 0,
        leetCodeTarget: 0
    })

    const [topicForm, setTopicForm] = useState({
        name: '',
        description: '',
        phaseId: ''
    })

    useEffect(() => {
        // Load PWA info
        setPwaInfo(pwaService.getAppInfo())
    }, [])

    const savePhases = (newPhases: Phase[]) => {
        setPhases(newPhases)
        // Database-only mode - phases are managed by DevRoadmap component
    }

    const addPhase = () => {
        if (!phaseForm.title.trim() || !phaseForm.description.trim()) {
            return;
        }

        const newPhase: Phase = {
            id: Date.now().toString(),
            title: phaseForm.title.trim(),
            description: phaseForm.description.trim(),
            startDate: phaseForm.startDate,
            endDate: phaseForm.endDate,
            weeks: phaseForm.weeks || 1,
            progress: 0,
            status: 'not-started',
            topics: [],
            projects: [],
            leetCodeTarget: phaseForm.leetCodeTarget || 0,
            leetCodeCompleted: 0
        }

        const updatedPhases = [...phases, newPhase]
        savePhases(updatedPhases)
        setPhaseForm({
            title: '',
            description: '',
            startDate: '',
            endDate: '',
            weeks: 0,
            leetCodeTarget: 0
        })
        setShowPhaseModal(false)
    }

    const updatePhase = () => {
        if (!editingPhase || !phaseForm.title.trim()) return

        const updatedPhase: Phase = {
            ...editingPhase,
            title: phaseForm.title.trim(),
            description: phaseForm.description.trim(),
            startDate: phaseForm.startDate,
            endDate: phaseForm.endDate,
            weeks: phaseForm.weeks,
            leetCodeTarget: phaseForm.leetCodeTarget
        }

        savePhases(phases.map(p => p.id === editingPhase.id ? updatedPhase : p))
        setEditingPhase(null)
        setPhaseForm({
            title: '',
            description: '',
            startDate: '',
            endDate: '',
            weeks: 0,
            leetCodeTarget: 0
        })
        setShowPhaseModal(false)
    }

    const deletePhase = (phaseId: string) => {
        const phase = phases.find(p => p.id === phaseId)
        setItemToDelete({ type: 'phase', id: phaseId, name: phase?.title || 'Unknown Phase' })
        setShowDeletePhaseModal(true)
    }

    const addTopic = () => {
        if (!topicForm.name.trim() || !topicForm.description.trim() || !topicForm.phaseId) return

        const newTopic: Topic = {
            id: Date.now().toString(),
            name: topicForm.name.trim(),
            description: topicForm.description.trim(),
            completed: false,
            resources: []
        }

        const updatedPhases = phases.map(phase => {
            if (phase.id === topicForm.phaseId) {
                return {
                    ...phase,
                    topics: [...phase.topics, newTopic]
                }
            }
            return phase
        })

        savePhases(updatedPhases)
        setTopicForm({
            name: '',
            description: '',
            phaseId: ''
        })
        setShowTopicModal(false)
    }

    const updateTopic = () => {
        if (!editingTopic || !topicForm.name.trim()) return

        const updatedPhases = phases.map(phase => {
            if (phase.id === editingTopic.phaseId) {
                return {
                    ...phase,
                    topics: phase.topics.map(topic => 
                        topic.id === editingTopic.topic.id 
                            ? { ...topic, name: topicForm.name.trim(), description: topicForm.description.trim() }
                            : topic
                    )
                }
            }
            return phase
        })

        savePhases(updatedPhases)
        setEditingTopic(null)
        setTopicForm({
            name: '',
            description: '',
            phaseId: ''
        })
        setShowTopicModal(false)
    }

    const deleteTopic = (phaseId: string, topicId: string) => {
        const topic = phases.find(p => p.id === phaseId)?.topics.find(t => t.id === topicId)
        setItemToDelete({ type: 'topic', id: topicId, phaseId, name: topic?.name || 'Unknown Topic' })
        setShowDeleteTopicModal(true)
    }

    const confirmDeletePhase = () => {
        if (itemToDelete && itemToDelete.type === 'phase') {
            savePhases(phases.filter(p => p.id !== itemToDelete.id))
            setItemToDelete(null)
            setShowDeletePhaseModal(false)
        }
    }

    const confirmDeleteTopic = () => {
        if (itemToDelete && itemToDelete.type === 'topic' && itemToDelete.phaseId) {
            const updatedPhases = phases.map(phase => {
                if (phase.id === itemToDelete.phaseId) {
                    return {
                        ...phase,
                        topics: phase.topics.filter(t => t.id !== itemToDelete.id)
                    }
                }
                return phase
            })
            savePhases(updatedPhases)
            setItemToDelete(null)
            setShowDeleteTopicModal(false)
        }
    }

    const confirmReset = async () => {
        try {
            // Note: Database reset functionality would go here
            // For now, just reload to reset the component state
    
            window.location.reload()
        } catch (error) {
            console.error('Error resetting data:', error)
        }
    }

    const confirmRestore = async () => {
        try {
            // Note: Database restore functionality would go here
            // For now, just reload to restore the component state
    
            window.location.reload()
        } catch (error) {
            console.error('Error restoring data:', error)
        }
    }

    const cancelDelete = () => {
        setItemToDelete(null)
        setShowDeletePhaseModal(false)
        setShowDeleteTopicModal(false)
    }

    const cancelReset = () => {
        setShowResetModal(false)
    }

    const cancelRestore = () => {
        setShowRestoreModal(false)
    }

    const openPhaseModal = (phase?: Phase) => {
        if (phase) {
            setEditingPhase(phase)
            setPhaseForm({
                title: phase.title,
                description: phase.description,
                startDate: phase.startDate,
                endDate: phase.endDate,
                weeks: phase.weeks,
                leetCodeTarget: phase.leetCodeTarget
            })
        } else {
            setEditingPhase(null)
            setPhaseForm({
                title: '',
                description: '',
                startDate: '',
                endDate: '',
                weeks: 0,
                leetCodeTarget: 0
            })
        }
        setShowPhaseModal(true)
    }

    const openTopicModal = (phaseId: string, topic?: Topic) => {
        if (topic) {
            setEditingTopic({ phaseId, topic })
            setTopicForm({
                name: topic.name,
                description: topic.description,
                phaseId
            })
        } else {
            setEditingTopic(null)
            setTopicForm({
                name: '',
                description: '',
                phaseId
            })
        }
        setShowTopicModal(true)
    }

    const calculateWeeks = (startDate: string, endDate: string) => {
        if (!startDate || !endDate) return 0
        const start = new Date(startDate)
        const end = new Date(endDate)
        const diffTime = Math.abs(end.getTime() - start.getTime())
        const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7))
        return diffWeeks
    }

    const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
        setPhaseForm(prev => {
            const updated = { ...prev, [field]: value }
            if (updated.startDate && updated.endDate) {
                updated.weeks = calculateWeeks(updated.startDate, updated.endDate)
            }
            return updated
        })
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Debug info */}
            <div className="bg-yellow-100 dark:bg-yellow-900/20 p-4 rounded-lg">
                <p className="text-yellow-800 dark:text-yellow-200">
                    Settings component loaded! Phases count: {phases.length}
                </p>
            </div>
            
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Manage your development roadmap, phases, topics, and projects
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8">
                    {[
                        { id: 'phases', name: 'Phase Management', icon: Target },
                        { id: 'topics', name: 'Topic Management', icon: BookOpen },
                        { id: 'projects', name: 'Project Management', icon: Code },
                        { id: 'pwa', name: 'App Settings', icon: Smartphone },
                        { id: 'general', name: 'General Settings', icon: SettingsIcon }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === tab.id
                                    ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.name}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Phase Management */}
            {activeTab === 'phases' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Development Phases</h2>
                        <button
                            onClick={() => openPhaseModal()}
                            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Phase
                        </button>
                    </div>

                    <div className="space-y-4">
                        {phases.length === 0 ? (
                            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                <Target className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    No Phases Found
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    Get started by creating your first development phase
                                </p>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => {
                                            // Load the complete 5-phase roadmap with all details
                                            const completeRoadmap: Phase[] = [
                                                {
                                                    id: 'phase-1',
                                                    title: 'Phase 1: Web Foundations & Frontend Development',
                                                    description: 'Master HTML, CSS, JavaScript, React, and Next.js with web security',
                                                    startDate: '2025-08-08',
                                                    endDate: '2025-10-03',
                                                    weeks: 8,
                                                    progress: 0,
                                                    status: 'not-started',
                                                    leetCodeTarget: 20,
                                                    leetCodeCompleted: 0,
                                                    topics: [
                                                        {
                                                            id: 'html-css-js',
                                                            name: 'HTML, CSS, JavaScript Basics',
                                                            description: 'Week 1-2: HTML5, CSS Flexbox/Grid, JavaScript ES6+',
                                                            completed: false,
                                                            resources: [
                                                                { id: '1', name: 'MDN Web Docs', url: 'https://developer.mozilla.org', type: 'documentation' as const, completed: false },
                                                                { id: '2', name: 'CSS Flexbox Guide', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/', type: 'article' as const, completed: false },
                                                                { id: '3', name: 'JavaScript.info', url: 'https://javascript.info', type: 'documentation' as const, completed: false }
                                                            ]
                                                        },
                                                        {
                                                            id: 'advanced-js',
                                                            name: 'Advanced JavaScript & CSS Frameworks',
                                                            description: 'Week 3-4: Closures, Async/Await, Tailwind CSS',
                                                            completed: false,
                                                            resources: [
                                                                { id: '4', name: 'Tailwind CSS Docs', url: 'https://tailwindcss.com/docs', type: 'documentation' as const, completed: false },
                                                                { id: '5', name: 'JavaScript Closures', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures', type: 'documentation' as const, completed: false }
                                                            ]
                                                        },
                                                        {
                                                            id: 'react-basics',
                                                            name: 'React.js Fundamentals',
                                                            description: 'Week 5-6: Components, Props, State, Hooks',
                                                            completed: false,
                                                            resources: [
                                                                { id: '6', name: 'React Official Docs', url: 'https://react.dev', type: 'documentation' as const, completed: false },
                                                                { id: '7', name: 'React Router', url: 'https://reactrouter.com', type: 'documentation' as const, completed: false }
                                                            ]
                                                        },
                                                        {
                                                            id: 'advanced-react',
                                                            name: 'Advanced React & Web Security',
                                                            description: 'Week 7-8: Next.js, Authentication, Security',
                                                            completed: false,
                                                            resources: [
                                                                { id: '8', name: 'Next.js Docs', url: 'https://nextjs.org/docs', type: 'documentation' as const, completed: false },
                                                                { id: '9', name: 'Web Security Basics', url: 'https://owasp.org/www-project-top-ten/', type: 'article' as const, completed: false }
                                                            ]
                                                        }
                                                    ],
                                                    projects: [
                                                        {
                                                            id: 'portfolio',
                                                            name: 'Personal Portfolio Website',
                                                            description: 'Responsive portfolio using HTML, CSS, JavaScript',
                                                            status: 'not-started' as const,
                                                            technologies: ['HTML', 'CSS', 'JavaScript'],
                                                            githubUrl: '',
                                                            liveUrl: ''
                                                        },
                                                        {
                                                            id: 'todo-app',
                                                            name: 'React Todo Application',
                                                            description: 'Create a todo app with React hooks and local storage',
                                                            status: 'not-started' as const,
                                                            technologies: ['React', 'JavaScript', 'CSS'],
                                                            githubUrl: '',
                                                            liveUrl: ''
                                                        },
                                                        {
                                                            id: 'nextjs-blog',
                                                            name: 'Next.js Blog Platform',
                                                            description: 'Build a blog with Next.js, authentication, and CMS',
                                                            status: 'not-started' as const,
                                                            technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
                                                            githubUrl: '',
                                                            liveUrl: ''
                                                        }
                                                    ]
                                                },
                                                {
                                                    id: 'phase-2',
                                                    title: 'Phase 2: Backend Development with Node.js & TypeScript',
                                                    description: 'Master backend architecture, security, and performance with real-world APIs',
                                                    startDate: '2025-10-04',
                                                    endDate: '2025-11-28',
                                                    weeks: 8,
                                                    progress: 0,
                                                    status: 'not-started',
                                                    leetCodeTarget: 25,
                                                    leetCodeCompleted: 0,
                                                    topics: [
                                                        {
                                                            id: 'node-express',
                                                            name: 'Node.js & Express.js',
                                                            description: 'Week 1-2: Server setup, routing, middleware',
                                                            completed: false,
                                                            resources: [
                                                                { id: '10', name: 'Node.js Docs', url: 'https://nodejs.org/docs', type: 'documentation' as const, completed: false },
                                                                { id: '11', name: 'Express.js Guide', url: 'https://expressjs.com', type: 'documentation' as const, completed: false }
                                                            ]
                                                        },
                                                        {
                                                            id: 'databases',
                                                            name: 'Database Design & SQL',
                                                            description: 'Week 3-4: PostgreSQL, MongoDB, data modeling',
                                                            completed: false,
                                                            resources: [
                                                                { id: '12', name: 'PostgreSQL Tutorial', url: 'https://www.postgresqltutorial.com', type: 'documentation' as const, completed: false },
                                                                { id: '13', name: 'MongoDB University', url: 'https://university.mongodb.com', type: 'course' as const, completed: false }
                                                            ]
                                                        },
                                                        {
                                                            id: 'api-design',
                                                            name: 'RESTful API Design',
                                                            description: 'Week 5-6: API patterns, authentication, testing',
                                                            completed: false,
                                                            resources: [
                                                                { id: '14', name: 'REST API Design', url: 'https://restfulapi.net', type: 'documentation' as const, completed: false },
                                                                { id: '15', name: 'JWT Authentication', url: 'https://jwt.io', type: 'documentation' as const, completed: false }
                                                            ]
                                                        },
                                                        {
                                                            id: 'testing',
                                                            name: 'Testing & Deployment',
                                                            description: 'Week 7-8: Unit testing, integration testing, deployment',
                                                            completed: false,
                                                            resources: [
                                                                { id: '16', name: 'Jest Testing Framework', url: 'https://jestjs.io', type: 'documentation' as const, completed: false },
                                                                { id: '17', name: 'Heroku Deployment', url: 'https://devcenter.heroku.com', type: 'documentation' as const, completed: false }
                                                            ]
                                                        }
                                                    ],
                                                    projects: [
                                                        {
                                                            id: 'api-server',
                                                            name: 'RESTful API Server',
                                                            description: 'Build a complete API with authentication and database',
                                                            status: 'not-started' as const,
                                                            technologies: ['Node.js', 'Express', 'PostgreSQL', 'JWT'],
                                                            githubUrl: '',
                                                            liveUrl: ''
                                                        },
                                                        {
                                                            id: 'ecommerce-api',
                                                            name: 'E-commerce API',
                                                            description: 'Create a full e-commerce backend with payment integration',
                                                            status: 'not-started' as const,
                                                            technologies: ['Node.js', 'MongoDB', 'Stripe API', 'Express'],
                                                            githubUrl: '',
                                                            liveUrl: ''
                                                        }
                                                    ]
                                                },
                                                {
                                                    id: 'phase-3',
                                                    title: 'Phase 3: Full-Stack Development & DevOps',
                                                    description: 'Build complete applications and learn deployment',
                                                    startDate: '2025-11-29',
                                                    endDate: '2026-01-23',
                                                    weeks: 8,
                                                    progress: 0,
                                                    status: 'not-started',
                                                    leetCodeTarget: 30,
                                                    leetCodeCompleted: 0,
                                                    topics: [
                                                        {
                                                            id: 'fullstack',
                                                            name: 'Full-Stack Architecture',
                                                            description: 'Week 1-2: Connecting frontend and backend',
                                                            completed: false,
                                                            resources: [
                                                                { id: '18', name: 'Full-Stack Development Guide', url: 'https://www.fullstackopen.com', type: 'course' as const, completed: false }
                                                            ]
                                                        },
                                                        {
                                                            id: 'devops',
                                                            name: 'DevOps & CI/CD',
                                                            description: 'Week 3-4: Docker, GitHub Actions, deployment',
                                                            completed: false,
                                                            resources: [
                                                                { id: '19', name: 'Docker Tutorial', url: 'https://docs.docker.com/get-started/', type: 'documentation' as const, completed: false },
                                                                { id: '20', name: 'GitHub Actions', url: 'https://docs.github.com/en/actions', type: 'documentation' as const, completed: false }
                                                            ]
                                                        },
                                                        {
                                                            id: 'cloud',
                                                            name: 'Cloud Services',
                                                            description: 'Week 5-6: AWS, Vercel, cloud deployment',
                                                            completed: false,
                                                            resources: [
                                                                { id: '21', name: 'AWS Free Tier', url: 'https://aws.amazon.com/free/', type: 'documentation' as const, completed: false },
                                                                { id: '22', name: 'Vercel Platform', url: 'https://vercel.com/docs', type: 'documentation' as const, completed: false }
                                                            ]
                                                        },
                                                        {
                                                            id: 'monitoring',
                                                            name: 'Performance & Monitoring',
                                                            description: 'Week 7-8: Performance optimization, monitoring tools',
                                                            completed: false,
                                                            resources: [
                                                                { id: '23', name: 'Web Performance', url: 'https://web.dev/performance/', type: 'documentation' as const, completed: false }
                                                            ]
                                                        }
                                                    ],
                                                    projects: [
                                                        {
                                                            id: 'fullstack-app',
                                                            name: 'Full-Stack Social Media App',
                                                            description: 'Build a complete social media platform',
                                                            status: 'not-started' as const,
                                                            technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
                                                            githubUrl: '',
                                                            liveUrl: ''
                                                        },
                                                        {
                                                            id: 'saas-platform',
                                                            name: 'SaaS Platform',
                                                            description: 'Create a subscription-based SaaS application',
                                                            status: 'not-started' as const,
                                                            technologies: ['Next.js', 'Stripe', 'MongoDB', 'Vercel'],
                                                            githubUrl: '',
                                                            liveUrl: ''
                                                        }
                                                    ]
                                                },
                                                {
                                                    id: 'phase-4',
                                                    title: 'Phase 4: Advanced Topics & Specialization',
                                                    description: 'Deep dive into advanced concepts and specialization',
                                                    startDate: '2026-01-24',
                                                    endDate: '2026-03-20',
                                                    weeks: 8,
                                                    progress: 0,
                                                    status: 'not-started',
                                                    leetCodeTarget: 35,
                                                    leetCodeCompleted: 0,
                                                    topics: [
                                                        {
                                                            id: 'typescript',
                                                            name: 'TypeScript Mastery',
                                                            description: 'Week 1-2: Advanced TypeScript patterns',
                                                            completed: false,
                                                            resources: [
                                                                { id: '24', name: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/', type: 'documentation' as const, completed: false }
                                                            ]
                                                        },
                                                        {
                                                            id: 'graphql',
                                                            name: 'GraphQL & Advanced APIs',
                                                            description: 'Week 3-4: GraphQL, Apollo, advanced API patterns',
                                                            completed: false,
                                                            resources: [
                                                                { id: '25', name: 'GraphQL Tutorial', url: 'https://graphql.org/learn/', type: 'documentation' as const, completed: false }
                                                            ]
                                                        },
                                                        {
                                                            id: 'microservices',
                                                            name: 'Microservices Architecture',
                                                            description: 'Week 5-6: Service-oriented architecture, Docker Compose',
                                                            completed: false,
                                                            resources: [
                                                                { id: '26', name: 'Microservices Guide', url: 'https://microservices.io', type: 'documentation' as const, completed: false }
                                                            ]
                                                        },
                                                        {
                                                            id: 'security',
                                                            name: 'Advanced Security',
                                                            description: 'Week 7-8: OAuth, encryption, security best practices',
                                                            completed: false,
                                                            resources: [
                                                                { id: '27', name: 'OWASP Security', url: 'https://owasp.org', type: 'documentation' as const, completed: false }
                                                            ]
                                                        }
                                                    ],
                                                    projects: [
                                                        {
                                                            id: 'enterprise-app',
                                                            name: 'Enterprise Application',
                                                            description: 'Build a complex enterprise-level application',
                                                            status: 'not-started' as const,
                                                            technologies: ['TypeScript', 'GraphQL', 'Microservices', 'Docker'],
                                                            githubUrl: '',
                                                            liveUrl: ''
                                                        }
                                                    ]
                                                },
                                                {
                                                    id: 'phase-5',
                                                    title: 'Phase 5: Portfolio Building & Job Applications',
                                                    description: 'Build your portfolio, optimize your presence, and apply for jobs',
                                                    startDate: '2025-09-27',
                                                    endDate: '2025-11-07',
                                                    weeks: 6,
                                                    progress: 0,
                                                    status: 'not-started',
                                                    leetCodeTarget: 24,
                                                    leetCodeCompleted: 0,
                                                    topics: [
                                                        {
                                                            id: 'portfolio-job-applications',
                                                            name: 'Build Portfolio & Apply for Jobs',
                                                            description: 'Week 21-24: Optimize GitHub Profile, Write Technical Articles, Resume Optimization, Mock Interviews',
                                                            completed: false,
                                                            resources: [
                                                                { id: '22', name: 'GitHub Profile Guide', url: 'https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile', type: 'documentation' as const, completed: false },
                                                                { id: '23', name: 'LinkedIn Technical Writing', url: 'https://www.linkedin.com/learning/', type: 'course' as const, completed: false }
                                                            ]
                                                        }
                                                    ],
                                                    projects: [
                                                        {
                                                            id: 'portfolio-website-final',
                                                            name: 'Final Portfolio Website',
                                                            description: 'Create a comprehensive portfolio showcasing all your projects and skills',
                                                            status: 'not-started' as const,
                                                            technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
                                                            githubUrl: '',
                                                            liveUrl: ''
                                                        },
                                                        {
                                                            id: 'technical-blog',
                                                            name: 'Technical Blog/Articles',
                                                            description: 'Write and publish technical articles on LinkedIn and other platforms',
                                                            status: 'not-started' as const,
                                                            technologies: ['Content Writing', 'Technical Documentation'],
                                                            githubUrl: '',
                                                            liveUrl: ''
                                                        }
                                                    ]
                                                },
                                                {
                                                    id: 'phase-5',
                                                    title: 'Phase 5: Portfolio Building & Job Applications',
                                                    description: 'Build your portfolio, optimize your presence, and apply for jobs',
                                                    startDate: '2026-03-21',
                                                    endDate: '2026-05-15',
                                                    weeks: 8,
                                                    progress: 0,
                                                    status: 'not-started',
                                                    leetCodeTarget: 40,
                                                    leetCodeCompleted: 0,
                                                    topics: [
                                                        {
                                                            id: 'portfolio-building',
                                                            name: 'Portfolio Development',
                                                            description: 'Week 1-2: Build comprehensive portfolio, optimize GitHub profile',
                                                            completed: false,
                                                            resources: [
                                                                { id: '28', name: 'GitHub Profile Guide', url: 'https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile', type: 'documentation' as const, completed: false }
                                                            ]
                                                        },
                                                        {
                                                            id: 'networking',
                                                            name: 'Networking & LinkedIn',
                                                            description: 'Week 3-4: LinkedIn optimization, technical writing, networking',
                                                            completed: false,
                                                            resources: [
                                                                { id: '29', name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/', type: 'course' as const, completed: false }
                                                            ]
                                                        },
                                                        {
                                                            id: 'interview-prep',
                                                            name: 'Interview Preparation',
                                                            description: 'Week 5-6: Mock interviews, coding challenges, behavioral questions',
                                                            completed: false,
                                                            resources: [
                                                                { id: '30', name: 'LeetCode Interview Prep', url: 'https://leetcode.com/explore/interview/', type: 'documentation' as const, completed: false }
                                                            ]
                                                        },
                                                        {
                                                            id: 'job-applications',
                                                            name: 'Job Applications',
                                                            description: 'Week 7-8: Resume optimization, cover letters, job applications',
                                                            completed: false,
                                                            resources: [
                                                                { id: '31', name: 'Resume Writing Guide', url: 'https://www.indeed.com/career-advice/resumes-cover-letters', type: 'article' as const, completed: false }
                                                            ]
                                                        }
                                                    ],
                                                    projects: [
                                                        {
                                                            id: 'final-portfolio',
                                                            name: 'Final Portfolio Website',
                                                            description: 'Create a comprehensive portfolio showcasing all your projects and skills',
                                                            status: 'not-started' as const,
                                                            technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
                                                            githubUrl: '',
                                                            liveUrl: ''
                                                        },
                                                        {
                                                            id: 'technical-blog',
                                                            name: 'Technical Blog/Articles',
                                                            description: 'Write and publish technical articles on LinkedIn and other platforms',
                                                            status: 'not-started' as const,
                                                            technologies: ['Content Writing', 'Technical Documentation'],
                                                            githubUrl: '',
                                                            liveUrl: ''
                                                        }
                                                    ]
                                                }
                                            ]
                                            savePhases(completeRoadmap)
                                        }}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        Load Complete 5-Phase Roadmap
                                    </button>
                                </div>
                            </div>
                        ) : (
                            phases.map((phase) => (
                                <div key={phase.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                                                <Target className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{phase.title}</h3>
                                                <p className="text-gray-600 dark:text-gray-400">{phase.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openPhaseModal(phase)}
                                                className="p-2 text-gray-400 hover:text-blue-500 rounded-lg"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deletePhase(phase.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 rounded-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
                                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                                            >
                                                {expandedPhase === phase.id ? (
                                                    <ChevronDown className="w-4 h-4" />
                                                ) : (
                                                    <ChevronRight className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{phase.weeks}</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Weeks</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{phase.topics.length}</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Topics</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{phase.projects.length}</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Projects</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{phase.progress}%</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Progress</div>
                                        </div>
                                    </div>

                                    {expandedPhase === phase.id && (
                                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Topics</h4>
                                                    <div className="space-y-2">
                                                        {phase.topics.map((topic) => (
                                                            <div key={topic.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                                                                <div className="flex items-center gap-2">
                                                                    {topic.completed ? (
                                                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                                    ) : (
                                                                        <Circle className="w-4 h-4 text-gray-400" />
                                                                    )}
                                                                    <span className="text-sm">{topic.name}</span>
                                                                </div>
                                                                <div className="flex gap-1">
                                                                    <button
                                                                        onClick={() => openTopicModal(phase.id, topic)}
                                                                        className="p-1 text-gray-400 hover:text-blue-500"
                                                                    >
                                                                        <Edit3 className="w-3 h-3" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => deleteTopic(phase.id, topic.id)}
                                                                        className="p-1 text-gray-400 hover:text-red-500"
                                                                    >
                                                                        <Trash2 className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Projects</h4>
                                                    <div className="space-y-2">
                                                        {phase.projects.map((project) => (
                                                            <div key={project.id} className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className="text-sm font-medium">{project.name}</span>
                                                                    <span className={`px-2 py-1 text-xs rounded ${
                                                                        project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                                        project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                                                        'bg-gray-100 text-gray-800'
                                                                    }`}>
                                                                        {project.status}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-gray-600 dark:text-gray-400">{project.description}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Topic Management */}
            {activeTab === 'topics' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Topic Management</h2>
                        <button
                            onClick={() => setShowTopicModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Topic
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {phases.length === 0 ? (
                            <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    No Topics Found
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    Create phases first, then add topics to them
                                </p>
                                <button
                                    onClick={() => setActiveTab('phases')}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                >
                                    Go to Phase Management
                                </button>
                            </div>
                        ) : (
                            phases.map((phase) => (
                                <div key={phase.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">{phase.title}</h3>
                                    <div className="space-y-2">
                                        {phase.topics.map((topic) => (
                                            <div key={topic.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                                                <div className="flex items-center gap-2">
                                                    {topic.completed ? (
                                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                    ) : (
                                                        <Circle className="w-4 h-4 text-gray-400" />
                                                    )}
                                                    <span className="text-sm">{topic.name}</span>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => openTopicModal(phase.id, topic)}
                                                        className="p-1 text-gray-400 hover:text-blue-500"
                                                    >
                                                        <Edit3 className="w-3 h-3" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteTopic(phase.id, topic.id)}
                                                        className="p-1 text-gray-400 hover:text-red-500"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Project Management */}
            {activeTab === 'projects' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Project Management</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {phases.length === 0 ? (
                            <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                <Code className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    No Projects Found
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    Create phases first, then add projects to them
                                </p>
                                <button
                                    onClick={() => setActiveTab('phases')}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                >
                                    Go to Phase Management
                                </button>
                            </div>
                        ) : (
                            phases.map((phase) => (
                                <div key={phase.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">{phase.title}</h3>
                                    <div className="space-y-2">
                                        {phase.projects.map((project) => (
                                            <div key={project.id} className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm font-medium">{project.name}</span>
                                                    <span className={`px-2 py-1 text-xs rounded ${
                                                        project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {project.status}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">{project.description}</p>
                                                {project.technologies.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {project.technologies.map((tech) => (
                                                            <span key={tech} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-xs rounded">
                                                                {tech}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* PWA Settings */}
            {activeTab === 'pwa' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Progressive Web App</h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Installation Status */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Smartphone className="w-6 h-6 text-blue-600" />
                                <h3 className="font-medium text-gray-900 dark:text-white">Installation Status</h3>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">App Installed</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        pwaInfo.isInstalled 
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                                    }`}>
                                        {pwaInfo.isInstalled ? 'Yes' : 'No'}
                                    </span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Standalone Mode</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        pwaInfo.isStandalone 
                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                                    }`}>
                                        {pwaInfo.isStandalone ? 'Active' : 'Browser'}
                                    </span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Can Install</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        pwaInfo.canInstall 
                                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                                    }`}>
                                        {pwaInfo.canInstall ? 'Available' : 'Not Available'}
                                    </span>
                                </div>
                            </div>
                            
                            {pwaInfo.canInstall && (
                                <button
                                    onClick={() => pwaService.installApp().then(() => setPwaInfo(pwaService.getAppInfo()))}
                                    className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    Install App
                                </button>
                            )}
                        </div>

                        {/* App Actions */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Share2 className="w-6 h-6 text-green-600" />
                                <h3 className="font-medium text-gray-900 dark:text-white">App Actions</h3>
                            </div>
                            
                            <div className="space-y-3">
                                <button
                                    onClick={() => pwaService.shareApp()}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <Share2 className="w-4 h-4" />
                                    Share App
                                </button>
                                
                                <button
                                    onClick={() => pwaService.checkForUpdates()}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Check for Updates
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* PWA Features */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-4">Progressive Web App Features</h3>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white">Offline Access</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Works without internet connection</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white">App-like Experience</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Native app feel and performance</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white">Push Notifications</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Stay updated with reminders</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white">Fast Loading</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Optimized caching for speed</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white">Home Screen Icon</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Add to device home screen</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white">Cross-Platform</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Works on all devices</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* General Settings */}
            {activeTab === 'general' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">General Settings</h2>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">Reset Everything</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Reset all progress, achievements, daily logs, and custom projects back to initial state
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowResetModal(true)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Reset Everything
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">Restore Defaults</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Restore the original 5-phase roadmap with all default achievements and correct dates
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowRestoreModal(true)}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    Restore Defaults
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">Export Data</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Download your roadmap data as a JSON file
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        const data = {
                                            phases: phases,
                                            timestamp: new Date().toISOString()
                                        }
                                        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
                                        const url = URL.createObjectURL(blob)
                                        const a = document.createElement('a')
                                        a.href = url
                                        a.download = `dev-roadmap-${new Date().toISOString().split('T')[0]}.json`
                                        document.body.appendChild(a)
                                        a.click()
                                        document.body.removeChild(a)
                                        URL.revokeObjectURL(url)
                                    }}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    Export Data
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Phase Modal */}
            {showPhaseModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {editingPhase ? 'Edit Phase' : 'Add New Phase'}
                            </h3>
                            <button
                                onClick={() => setShowPhaseModal(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); editingPhase ? updatePhase() : addPhase(); }} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Phase Title
                                </label>
                                <input
                                    type="text"
                                    value={phaseForm.title}
                                    onChange={(e) => setPhaseForm({ ...phaseForm, title: e.target.value })}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={phaseForm.description}
                                    onChange={(e) => setPhaseForm({ ...phaseForm, description: e.target.value })}
                                    rows={3}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={phaseForm.startDate}
                                        onChange={(e) => handleDateChange('startDate', e.target.value)}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={phaseForm.endDate}
                                        onChange={(e) => handleDateChange('endDate', e.target.value)}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Weeks
                                    </label>
                                    <input
                                        type="number"
                                        value={phaseForm.weeks}
                                        onChange={(e) => setPhaseForm({ ...phaseForm, weeks: parseInt(e.target.value) || 0 })}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        min="1"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        LeetCode Target
                                    </label>
                                    <input
                                        type="number"
                                        value={phaseForm.leetCodeTarget}
                                        onChange={(e) => setPhaseForm({ ...phaseForm, leetCodeTarget: parseInt(e.target.value) || 0 })}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                >
                                    {editingPhase ? 'Update Phase' : 'Add Phase'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowPhaseModal(false)}
                                    className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Topic Modal */}
            {showTopicModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {editingTopic ? 'Edit Topic' : 'Add New Topic'}
                            </h3>
                            <button
                                onClick={() => setShowTopicModal(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); editingTopic ? updateTopic() : addTopic(); }} className="space-y-4">
                            {!editingTopic && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Phase
                                    </label>
                                    <select
                                        value={topicForm.phaseId}
                                        onChange={(e) => setTopicForm({ ...topicForm, phaseId: e.target.value })}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    >
                                        <option value="">Select a phase</option>
                                        {phases.map(phase => (
                                            <option key={phase.id} value={phase.id}>
                                                {phase.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Topic Name
                                </label>
                                <input
                                    type="text"
                                    value={topicForm.name}
                                    onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={topicForm.description}
                                    onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
                                    rows={3}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                >
                                    {editingTopic ? 'Update Topic' : 'Add Topic'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowTopicModal(false)}
                                    className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Phase Confirmation Modal */}
            {showDeletePhaseModal && itemToDelete && itemToDelete.type === 'phase' && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Phase</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone</p>
                            </div>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
                            <p className="text-gray-900 dark:text-white font-medium">{itemToDelete.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                This will also delete all topics and projects in this phase.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={confirmDeletePhase}
                                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Delete Phase
                            </button>
                            <button
                                onClick={cancelDelete}
                                className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Topic Confirmation Modal */}
            {showDeleteTopicModal && itemToDelete && itemToDelete.type === 'topic' && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Topic</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone</p>
                            </div>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
                            <p className="text-gray-900 dark:text-white font-medium">{itemToDelete.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                This will remove the topic from the phase.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={confirmDeleteTopic}
                                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Delete Topic
                            </button>
                            <button
                                onClick={cancelDelete}
                                className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reset Everything Confirmation Modal */}
            {showResetModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                                <RotateCcw className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reset Everything</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone</p>
                            </div>
                        </div>
                        
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-6">
                            <p className="text-red-800 dark:text-red-200 font-medium">Warning: This will delete all your data!</p>
                            <ul className="text-sm text-red-700 dark:text-red-300 mt-2 space-y-1">
                                <li>• All custom phases and topics</li>
                                <li>• All progress and achievements</li>
                                <li>• All daily logs</li>
                                <li>• All custom projects</li>
                            </ul>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={confirmReset}
                                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Reset Everything
                            </button>
                            <button
                                onClick={cancelReset}
                                className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Restore Defaults Confirmation Modal */}
            {showRestoreModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Restore Defaults</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">This will reset to the original roadmap</p>
                            </div>
                        </div>
                        
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-6">
                            <p className="text-green-800 dark:text-green-200 font-medium">This will restore the original 5-phase roadmap:</p>
                            <ul className="text-sm text-green-700 dark:text-green-300 mt-2 space-y-1">
                                <li>• Phase 1: Web Foundations & Frontend Development</li>
                                <li>• Phase 2: Backend Development with Node.js & TypeScript</li>
                                <li>• Phase 3: Go & Rust with Extensive Projects</li>
                                <li>• Phase 4: Cloud Computing & Deployment</li>
                                <li>• Phase 5: Portfolio Building & Job Applications</li>
                            </ul>
                            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                                Note: This will delete all your current custom data.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={confirmRestore}
                                className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                            >
                                Restore Defaults
                            </button>
                            <button
                                onClick={cancelRestore}
                                className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Settings 