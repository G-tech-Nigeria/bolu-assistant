import { useState, useEffect } from 'react'
import { 
    getDevRoadmapPhases,
    getDevRoadmapTopics,
    getDevRoadmapResources,
    getDevRoadmapProjects,
    getDevRoadmapDailyLogs,
    getDevRoadmapAchievements,
    getDevRoadmapUserStats,
    addDevRoadmapPhase,
    addDevRoadmapTopic,
    addDevRoadmapResource,
    addDevRoadmapProject,
    addDevRoadmapDailyLog,
    addDevRoadmapAchievement,
    addDevRoadmapStudySession,
    updateDevRoadmapPhase,
    updateDevRoadmapTopic,
    updateDevRoadmapResource,
    updateDevRoadmapProject,
    updateDevRoadmapDailyLog,
    updateDevRoadmapAchievement,
    deleteDevRoadmapPhase,
    deleteDevRoadmapTopic,
    deleteDevRoadmapResource,
    deleteDevRoadmapProject,
    deleteDevRoadmapDailyLog,
    deleteDevRoadmapAchievement,
    migrateDevRoadmapData,
    recalculateUserStats
} from '../lib/database'
import { 
    Code, 
    BookOpen, 
    Target, 
    Trophy, 
    Calendar, 
    CheckCircle2,
    Circle, 
    TrendingUp,
    Star,
    Clock,
    Plus,
    Edit3,
    Trash2,
    Save,
    X,
    ChevronRight,
    ChevronDown,
    CheckCircle
} from 'lucide-react'

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

interface DailyLog {
    id: string
    date: string
    phaseId: string
    topicId?: string
    projectId?: string
    hoursSpent: number
    activities: string[]
    leetCodeProblems: number
    keyTakeaway: string
    nextUp: string
    readingMinutes?: number
    projectWorkMinutes?: number
    leetCodeMinutes?: number
    networkingMinutes?: number
}

interface Achievement {
    id: string
    title: string
    description: string
    icon: string
    unlocked: boolean
    unlockedDate?: string
    requirement: string
    category: 'daily' | 'progress' | 'milestone' | 'special' | 'streak' | 'project' | 'leetcode' | 'phase' | 'time' | 'social'
    points: number
    nextAchievement?: string
    isActive: boolean
    order: number
}

const DevRoadmap = () => {
    // Database state
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [useDatabase, setUseDatabase] = useState(false)
    
    // Main state
    const [phases, setPhases] = useState<Phase[]>([])
    const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([])
    const [achievements, setAchievements] = useState<Achievement[]>([])
    const [userStats, setUserStats] = useState<any>(null)
    
    // UI state
    const [currentPhase, setCurrentPhase] = useState<string>('phase-1')
    const [showLogModal, setShowLogModal] = useState(false)
    const [showProjectModal, setShowProjectModal] = useState(false)
    const [showReadingModal, setShowReadingModal] = useState(false)
    const [newProject, setNewProject] = useState({
        name: '',
        description: '',
        technologies: '',
        phaseId: 'phase-1'
    })
    const [expandedPhase, setExpandedPhase] = useState<string>('phase-1')
    const [streak, setStreak] = useState(0)
    const [totalHours, setTotalHours] = useState(0)
    const [totalLeetCode, setTotalLeetCode] = useState(0)
    const [showCompletedAchievements, setShowCompletedAchievements] = useState(false)
    const [showCelebration, setShowCelebration] = useState(false)
    const [celebratedAchievement, setCelebratedAchievement] = useState<Achievement | null>(null)
    const [achievementUpdateTrigger, setAchievementUpdateTrigger] = useState(0)
    const [processingAchievement, setProcessingAchievement] = useState<string | null>(null)
    const [achievementQueue, setAchievementQueue] = useState<Achievement[]>([])
    const [showMultipleNotification, setShowMultipleNotification] = useState(false)
    const [multipleAchievements, setMultipleAchievements] = useState<Achievement[]>([])
    const [showResetAchievementsModal, setShowResetAchievementsModal] = useState(false)
    const [showPointsDashboard, setShowPointsDashboard] = useState(false)
    const [showStudyTimer, setShowStudyTimer] = useState(false)
    const [isTimerRunning, setIsTimerRunning] = useState(false)
    const [timeRemaining, setTimeRemaining] = useState(25 * 60) // 25 minutes
    const [timerMode, setTimerMode] = useState<'focus' | 'break'>('focus')
    const [completedSessions, setCompletedSessions] = useState(0)
    const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)
    const [formData, setFormData] = useState({
        phaseId: '',
        topicId: '',
        projectId: '',
        hoursSpent: 0,
        activities: '',
        leetCodeProblems: 0,
        keyTakeaway: ''
    })

    // Data loading functions
    const loadDataFromDatabase = async () => {
        try {
            setIsLoading(true)
            setError(null)
            
            // Load all data in parallel
            // Loading data from database...
            const [phasesData, logsData, achievementsData, statsData] = await Promise.all([
                getDevRoadmapPhases(),
                getDevRoadmapDailyLogs(),
                getDevRoadmapAchievements(),
                getDevRoadmapUserStats()
            ])
            
            // Data loaded successfully
            
            // Transform database data to component format
            const transformedPhases = await Promise.all(
                phasesData.map(async (phase) => {
                    // Loading topics and projects for phase
                    const topics = await getDevRoadmapTopics(phase.id)
                    const projects = await getDevRoadmapProjects(phase.id)
                    // Phase data loaded
                    
                    // Transform topics with resources
                    const transformedTopics = await Promise.all(
                        topics.map(async (topic) => {
                            const resources = await getDevRoadmapResources(topic.id)
                            return {
                                id: topic.id,
                                name: topic.name,
                                description: topic.description,
                                completed: topic.completed,
                                resources: resources.map(resource => ({
                                    id: resource.id,
                                    name: resource.name,
                                    url: resource.url,
                                    type: resource.type,
                                    completed: resource.completed
                                }))
                            }
                        })
                    )
                    
                    // Transform projects
                    const transformedProjects = projects.map(project => ({
                        id: project.id,
                        name: project.name,
                        description: project.description,
                        status: project.status,
                        githubUrl: project.github_url,
                        liveUrl: project.live_url,
                        technologies: project.technologies,
                        isCustom: project.is_custom
                    }))
                    
                    return {
                        id: phase.id,
                        title: phase.title,
                        description: phase.description,
                        startDate: phase.start_date,
                        endDate: phase.end_date,
                        weeks: phase.weeks,
                        progress: phase.progress,
                        status: phase.status,
                        leetCodeTarget: phase.leetcode_target,
                        leetCodeCompleted: phase.leetcode_completed,
                        topics: transformedTopics,
                        projects: transformedProjects
                    }
                })
            )
            
            // Transform daily logs
            const transformedLogs = logsData.map(log => ({
                id: log.id,
                date: log.date,
                phaseId: log.phase_id,
                topicId: log.topic_id,
                projectId: log.project_id,
                hoursSpent: log.hours_spent,
                activities: log.activities,
                leetCodeProblems: log.leetcode_problems,
                keyTakeaway: log.key_takeaway,
                nextUp: '', // Not stored in database
                readingMinutes: log.reading_minutes,
                projectWorkMinutes: log.project_work_minutes,
                leetCodeMinutes: log.leetcode_minutes,
                networkingMinutes: log.networking_minutes
            }))
            
            // Transform achievements
            const transformedAchievements = achievementsData.map(achievement => ({
                id: achievement.id,
                title: achievement.title,
                description: achievement.description,
                icon: achievement.icon,
                unlocked: achievement.unlocked,
                unlockedDate: achievement.unlocked_date,
                requirement: achievement.requirement,
                category: achievement.category,
                points: achievement.points,
                nextAchievement: achievement.next_achievement,
                isActive: achievement.is_active,
                order: achievement.order_index
            }))
            
            setPhases(transformedPhases)
            setDailyLogs(transformedLogs)
            setAchievements(transformedAchievements)
            // Handle userStats - now it's a single object from the updated function
            setUserStats(statsData)
            setUseDatabase(true)
            
            // Immediately update UI stats if we have userStats
            if (statsData) {
                setTotalHours(statsData.total_hours || 0)
                setTotalLeetCode(statsData.total_leetcode_solved || 0)
                setStreak(statsData.current_streak || 0)
            }
            
            // All data loaded and transformed successfully
            
        } catch (err) {
            console.error('Error loading data from database:', err)
            setError('Failed to load data from database. Falling back to localStorage.')
            loadDataFromLocalStorage()
        } finally {
            setIsLoading(false)
        }
    }
    
    const loadDataFromLocalStorage = () => {
        try {
            const savedPhases = localStorage.getItem('dev-roadmap-phases')
            const savedLogs = localStorage.getItem('dev-roadmap-logs')
            const savedAchievements = localStorage.getItem('dev-roadmap-achievements')
            
            setPhases(savedPhases ? JSON.parse(savedPhases) : getDefaultPhases())
            setDailyLogs(savedLogs ? JSON.parse(savedLogs) : [])
            setAchievements(savedAchievements ? JSON.parse(savedAchievements) : getDefaultAchievements())
            setUseDatabase(false)
        } catch (err) {
            console.error('Error loading data from localStorage:', err)
            setError('Failed to load data from localStorage.')
            setPhases(getDefaultPhases())
            setDailyLogs([])
            setAchievements(getDefaultAchievements())
        }
    }
    
    const migrateDataToDatabase = async () => {
        try {
            setIsLoading(true)
            setError(null)
            
            const result = await migrateDevRoadmapData()
            // Migration completed
            
            if (result.phases.success || result.achievements.success) {
                // Reload data from database after migration
                await loadDataFromDatabase()
            } else {
                setError('Migration failed. Using localStorage data.')
                loadDataFromLocalStorage()
            }
        } catch (err) {
            console.error('Error during migration:', err)
            setError('Migration failed. Using localStorage data.')
            loadDataFromLocalStorage()
        } finally {
            setIsLoading(false)
        }
    }
    
    // Initialize data on component mount
    useEffect(() => {
        const initializeData = async () => {
            try {
                // Try to load from database first
                // Attempting to load data from database...
                await loadDataFromDatabase()
                // Successfully loaded data from database
            } catch (err) {
                console.error('Database loading failed:', err)
                // Falling back to localStorage
                loadDataFromLocalStorage()
            }
        }
        
        initializeData()
    }, [])
    
    // Note: Removed localStorage backup saves - using database only



    // Update stats when userStats changes (database mode)
    useEffect(() => {
        if (useDatabase && userStats) {
            // Using database stats
            setTotalHours(userStats.total_hours || 0)
            setTotalLeetCode(userStats.total_leetcode_solved || 0)
            setStreak(userStats.current_streak || 0)
        }
    }, [userStats, useDatabase])

    // Calculate stats from localStorage (non-database mode)
    useEffect(() => {
        if (!useDatabase && dailyLogs.length >= 0) {
            // Using localStorage calculation
        const totalHrs = dailyLogs.reduce((sum, log) => sum + log.hoursSpent, 0)
        const totalLC = dailyLogs.reduce((sum, log) => sum + log.leetCodeProblems, 0)
        setTotalHours(totalHrs)
        setTotalLeetCode(totalLC)
        // Note: Streak is now handled by database when useDatabase is true
        }
    }, [dailyLogs, useDatabase])

    // Check achievements when stats change
    useEffect(() => {
        checkAchievements(totalHours, totalLeetCode).catch(err => {
            console.error('Error checking achievements:', err)
        })
    }, [totalHours, totalLeetCode, phases])

    const checkAchievements = async (totalHours: number, totalLeetCode: number) => {
        try {
    
            const today = new Date().toISOString().split('T')[0]
            let newlyUnlockedAchievements: Achievement[] = []
            
            // Helper function to unlock achievement
            const unlockAchievement = async (achievementId: string) => {
                const achievement = achievements.find(a => a.id === achievementId && !a.unlocked)
                if (achievement) {
                    const updatedAchievement = {
                        ...achievement,
                        unlocked: true,
                        unlockedDate: today
                    }
                    
                    if (useDatabase) {
                        // Update in database
                        await updateDevRoadmapAchievement(achievementId, {
                            unlocked: true,
                            unlocked_date: today
                        })
                    }
                    
                    newlyUnlockedAchievements.push(updatedAchievement)
                    
                    // Update local state
                    setAchievements(prev => 
                        prev.map(a => a.id === achievementId ? updatedAchievement : a)
                    )
                    
                    // Trigger celebration
                    triggerCelebration(updatedAchievement)
                }
            }
            
            // Calculate various metrics
            const completedProjects = phases.reduce((count, phase) => 
                count + phase.projects.filter(p => p.status === 'completed').length, 0
            )
            const completedTopics = phases.reduce((count, phase) => 
                count + phase.topics.filter(t => t.completed).length, 0
            )
            const completedResources = phases.reduce((count, phase) => 
                count + phase.topics.reduce((topicCount, topic) => 
                    topicCount + topic.resources.filter(r => r.completed).length, 0
                ), 0
            )
            const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0)
            
            // Check if all phases are complete
            const allPhasesComplete = phases.every(phase => 
                phase.topics.every(t => t.completed) && 
                phase.projects.every(p => p.status === 'completed')
            )
            
            // Check if all topics are complete
            const allTopicsComplete = phases.every(phase => 
                phase.topics.every(t => t.completed)
            )
            
            // Check if all resources are complete
            const allResourcesComplete = phases.every(phase => 
                phase.topics.every(topic => 
                    topic.resources.every(r => r.completed)
                )
            )
            
            // DAILY ACHIEVEMENTS
            if (dailyLogs.length > 0) await unlockAchievement('first-log')
            if (dailyLogs.length >= 7) await unlockAchievement('first-week')
            if (dailyLogs.length >= 30) await unlockAchievement('first-month')
            
            // Check for perfect week (7 consecutive days)
            const uniqueDates = [...new Set(dailyLogs.map(log => log.date))].sort()
            if (uniqueDates.length >= 7) {
                const last7Days = uniqueDates.slice(-7)
                const isPerfectWeek = last7Days.every((date, index) => {
                    const expectedDate = new Date(last7Days[0])
                    expectedDate.setDate(expectedDate.getDate() + index)
                    return date === expectedDate.toISOString().split('T')[0]
                })
                if (isPerfectWeek) await unlockAchievement('perfect-week')
            }
            
            // STREAK ACHIEVEMENTS
            if (streak >= 3) await unlockAchievement('streak-3')
            if (streak >= 7) await unlockAchievement('week-streak')
            if (streak >= 14) await unlockAchievement('streak-14')
            if (streak >= 30) await unlockAchievement('month-streak')
            if (streak >= 60) await unlockAchievement('streak-60')
            if (streak >= 100) await unlockAchievement('streak-100')
            
            // TIME ACHIEVEMENTS
            if (totalHours >= 10) await unlockAchievement('hours-10')
            if (totalHours >= 25) await unlockAchievement('hours-25')
            if (totalHours >= 50) await unlockAchievement('hours-50')
            if (totalHours >= 100) await unlockAchievement('hours-100')
            if (totalHours >= 200) await unlockAchievement('hours-200')
            if (totalHours >= 500) await unlockAchievement('hours-500')
            if (totalHours >= 1000) await unlockAchievement('hours-1000')
            
            // LEETCODE ACHIEVEMENTS
            if (totalLeetCode >= 10) await unlockAchievement('leetcode-10')
            if (totalLeetCode >= 25) await unlockAchievement('leetcode-25')
            if (totalLeetCode >= 50) await unlockAchievement('leetcode-50')
            if (totalLeetCode >= 75) await unlockAchievement('leetcode-75')
            if (totalLeetCode >= 100) await unlockAchievement('leetcode-100')
            if (totalLeetCode >= 150) await unlockAchievement('leetcode-150')
            if (totalLeetCode >= 300) await unlockAchievement('leetcode-300')
            
            // PROJECT ACHIEVEMENTS
    
            if (completedProjects >= 1) await unlockAchievement('first-project')
            if (completedProjects >= 3) await unlockAchievement('three-projects')
            if (completedProjects >= 5) await unlockAchievement('five-projects')
            if (completedProjects >= 10) await unlockAchievement('ten-projects')
            
            // PHASE ACHIEVEMENTS
    
            for (let i = 0; i < phases.length; i++) {
                const phase = phases[i]
                const isPhaseComplete = phase.topics.every(t => t.completed) && 
                                      phase.projects.every(p => p.status === 'completed')
    
                if (isPhaseComplete) {
                    await unlockAchievement(`phase-${i + 1}-complete`)
                }
            }
            if (allPhasesComplete) await unlockAchievement('all-phases')
            
            // PROGRESS ACHIEVEMENTS (Topics & Resources)
            if (completedTopics >= 1) await unlockAchievement('first-topic')
            if (completedTopics >= 5) await unlockAchievement('five-topics')
            if (completedTopics >= 10) await unlockAchievement('ten-topics')
            if (allTopicsComplete) await unlockAchievement('all-topics')
            
            if (completedResources >= 1) await unlockAchievement('first-resource')
            if (completedResources >= 10) await unlockAchievement('ten-resources')
            if (completedResources >= 20) await unlockAchievement('twenty-resources')
            
            // MILESTONE ACHIEVEMENTS
            if (totalPoints >= 100) await unlockAchievement('first-100-points')
            if (totalPoints >= 500) await unlockAchievement('first-500-points')
            if (totalPoints >= 1000) await unlockAchievement('first-1000-points')
            if (totalPoints >= 2000) await unlockAchievement('first-2000-points')
            
            // SPECIAL ACHIEVEMENTS
            // Check for early bird (study before 8 AM)
            const earlyBirdLogs = dailyLogs.filter(log => {
                const logDate = new Date(log.date)
                const hour = logDate.getHours()
                return hour < 8
            })
            if (earlyBirdLogs.length > 0) await unlockAchievement('early-bird')
            
            // Check for night owl (study after 10 PM)
            const nightOwlLogs = dailyLogs.filter(log => {
                const logDate = new Date(log.date)
                const hour = logDate.getHours()
                return hour >= 22
            })
            if (nightOwlLogs.length > 0) await unlockAchievement('night-owl')
            
            // Check for weekend warrior
            const weekendLogs = dailyLogs.filter(log => {
                const logDate = new Date(log.date)
                const day = logDate.getDay()
                return day === 0 || day === 6 // Sunday or Saturday
            })
            if (weekendLogs.length > 0) await unlockAchievement('weekend-warrior')
            
            // Check for marathon session (4+ hours in one day)
            const marathonLogs = dailyLogs.filter(log => log.hoursSpent >= 4)
            if (marathonLogs.length > 0) await unlockAchievement('marathon-session')
            
            // Check for consistency king (study every day for 2 weeks)
            if (streak >= 14) await unlockAchievement('consistency-king')
            
            // SOCIAL ACHIEVEMENTS (These would need manual triggering or external integration)
            // For now, we'll leave them as manual achievements that users can unlock themselves
            
            // Show celebration for newly unlocked achievements
            if (newlyUnlockedAchievements.length > 0) {
        
            }
            
        } catch (error) {
            console.error('Error checking achievements:', error)
        }
    }

    // Fix any NaN progress values
    useEffect(() => {
        setPhases(prevPhases => {
            const fixedPhases = prevPhases.map(phase => {
                if (isNaN(phase.progress)) {
                    const totalTopics = phase.topics.length
                    const completedTopics = phase.topics.filter(t => t.completed).length
                    const totalProjects = phase.projects.length
                    const completedProjects = phase.projects.filter(p => p.status === 'completed').length
                    
                    const topicProgress = totalTopics > 0 ? (completedTopics / totalTopics) * 50 : 0
                    const projectProgress = totalProjects > 0 ? (completedProjects / totalProjects) * 50 : 0
                    const newProgress = Math.round(topicProgress + projectProgress)
                    
                    return {
                        ...phase,
                        progress: newProgress
                    }
                }
                return phase
            })
            return fixedPhases
        })
    }, [])

    const getDefaultAchievements = (): Achievement[] => {
        return [
            // Daily & Streak Achievements
            { id: 'first-day', title: 'First Steps', description: 'Complete your first day of learning', icon: '🎯', unlocked: false, requirement: 'Log your first day of progress', category: 'daily', points: 10, isActive: true, order: 1 },
            { id: 'week-streak', title: 'Week Warrior', description: 'Maintain a 7-day learning streak', icon: '🔥', unlocked: false, requirement: 'Learn for 7 consecutive days', category: 'streak', points: 50, isActive: true, order: 2 },
            { id: 'month-streak', title: 'Monthly Master', description: 'Maintain a 30-day learning streak', icon: '��', unlocked: false, requirement: 'Learn for 30 consecutive days', category: 'streak', points: 200, isActive: true, order: 3 },
            { id: 'quarter-streak', title: 'Quarter Champion', description: 'Maintain a 90-day learning streak', icon: '🏆', unlocked: false, requirement: 'Learn for 90 consecutive days', category: 'streak', points: 500, isActive: true, order: 4 },
            
            // LeetCode Achievements
            { id: 'leetcode-5', title: 'Problem Starter', description: 'Solve 5 LeetCode problems', icon: '💻', unlocked: false, requirement: 'Complete 5 LeetCode problems', category: 'leetcode', points: 25, isActive: true, order: 5 },
            { id: 'leetcode-10', title: 'Problem Solver', description: 'Solve 10 LeetCode problems', icon: '⚡', unlocked: false, requirement: 'Complete 10 LeetCode problems', category: 'leetcode', points: 50, isActive: true, order: 6 },
            { id: 'leetcode-25', title: 'Code Warrior', description: 'Solve 25 LeetCode problems', icon: '🛡️', unlocked: false, requirement: 'Complete 25 LeetCode problems', category: 'leetcode', points: 100, isActive: true, order: 7 },
            { id: 'leetcode-50', title: 'Algorithm Master', description: 'Solve 50 LeetCode problems', icon: '🧠', unlocked: false, requirement: 'Complete 50 LeetCode problems', category: 'leetcode', points: 200, isActive: true, order: 8 },
            { id: 'leetcode-100', title: 'LeetCode Legend', description: 'Solve 100 LeetCode problems', icon: '👑', unlocked: false, requirement: 'Complete 100 LeetCode problems', category: 'leetcode', points: 500, isActive: true, order: 9 },
            
            // Project Achievements
            { id: 'first-project', title: 'Project Creator', description: 'Complete your first project', icon: '🚀', unlocked: false, requirement: 'Mark your first project as completed', category: 'project', points: 100, isActive: true, order: 10 },
            { id: 'project-3', title: 'Triple Threat', description: 'Complete 3 projects', icon: '🎯', unlocked: false, requirement: 'Complete 3 projects', category: 'project', points: 200, isActive: true, order: 11 },
            { id: 'project-5', title: 'Project Portfolio', description: 'Complete 5 projects', icon: '📁', unlocked: false, requirement: 'Complete 5 projects', category: 'project', points: 300, isActive: true, order: 12 },
            { id: 'project-10', title: 'Project Master', description: 'Complete 10 projects', icon: '🏗️', unlocked: false, requirement: 'Complete 10 projects', category: 'project', points: 500, isActive: true, order: 13 },
            
            // Phase Achievements
            { id: 'phase-1-complete', title: 'Phase 1 Champion', description: 'Complete Phase 1', icon: '🥇', unlocked: false, requirement: 'Complete all topics and projects in Phase 1', category: 'phase', points: 300, isActive: true, order: 14 },
            { id: 'phase-2-complete', title: 'Phase 2 Champion', description: 'Complete Phase 2', icon: '🥈', unlocked: false, requirement: 'Complete all topics and projects in Phase 2', category: 'phase', points: 400, isActive: true, order: 15 },
            { id: 'phase-3-complete', title: 'Phase 3 Champion', description: 'Complete Phase 3', icon: '🥉', unlocked: false, requirement: 'Complete all topics and projects in Phase 3', category: 'phase', points: 500, isActive: true, order: 16 },
            { id: 'phase-4-complete', title: 'Phase 4 Champion', description: 'Complete Phase 4', icon: '💎', unlocked: false, requirement: 'Complete all topics and projects in Phase 4', category: 'phase', points: 600, isActive: true, order: 17 },
            { id: 'phase-5-complete', title: 'Phase 5 Champion', description: 'Complete Phase 5', icon: '👑', unlocked: false, requirement: 'Complete all topics and projects in Phase 5', category: 'phase', points: 700, isActive: true, order: 18 },
            
            // Time-based Achievements
            { id: 'hours-10', title: 'Dedicated Learner', description: 'Log 10 hours of learning', icon: '⏰', unlocked: false, requirement: 'Log 10 total hours', category: 'time', points: 50, isActive: true, order: 19 },
            { id: 'hours-50', title: 'Time Master', description: 'Log 50 hours of learning', icon: '⌛', unlocked: false, requirement: 'Log 50 total hours', category: 'time', points: 200, isActive: true, order: 20 },
            { id: 'hours-100', title: 'Century Club', description: 'Log 100 hours of learning', icon: '💯', unlocked: false, requirement: 'Log 100 total hours', category: 'time', points: 400, isActive: true, order: 21 },
            { id: 'hours-500', title: 'Learning Legend', description: 'Log 500 hours of learning', icon: '🌟', unlocked: false, requirement: 'Log 500 total hours', category: 'time', points: 1000, isActive: true, order: 22 },
            
            // Topic Achievements
            { id: 'topics-5', title: 'Knowledge Seeker', description: 'Complete 5 topics', icon: '📖', unlocked: false, requirement: 'Complete 5 topics', category: 'progress', points: 100, isActive: true, order: 23 },
            { id: 'topics-10', title: 'Knowledge Hunter', description: 'Complete 10 topics', icon: '🔍', unlocked: false, requirement: 'Complete 10 topics', category: 'progress', points: 200, isActive: true, order: 24 },
            { id: 'topics-20', title: 'Knowledge Master', description: 'Complete 20 topics', icon: '🎓', unlocked: false, requirement: 'Complete 20 topics', category: 'progress', points: 400, isActive: true, order: 25 },
            
            // Special Achievements
            { id: 'perfect-day', title: 'Perfect Day', description: 'Log 8+ hours in a single day', icon: '⭐', unlocked: false, requirement: 'Log 8+ hours in one day', category: 'special', points: 100, isActive: true, order: 26 },
            { id: 'weekend-warrior', title: 'Weekend Warrior', description: 'Learn on 5 consecutive weekends', icon: '🏃', unlocked: false, requirement: 'Learn on 5 weekends in a row', category: 'special', points: 150, isActive: true, order: 27 },
            { id: 'early-bird', title: 'Early Bird', description: 'Log progress before 8 AM', icon: '🌅', unlocked: false, requirement: 'Log progress before 8 AM', category: 'special', points: 50, isActive: true, order: 28 },
            { id: 'night-owl', title: 'Night Owl', description: 'Log progress after 10 PM', icon: '🦉', unlocked: false, requirement: 'Log progress after 10 PM', category: 'special', points: 50, isActive: true, order: 29 },
            
            // Milestone Achievements
            { id: 'first-week', title: 'First Week', description: 'Complete your first week of learning', icon: '📅', unlocked: false, requirement: 'Complete 7 days of learning', category: 'milestone', points: 75, isActive: true, order: 30 },
            { id: 'first-month', title: 'First Month', description: 'Complete your first month of learning', icon: '🗓️', unlocked: false, requirement: 'Complete 30 days of learning', category: 'milestone', points: 200, isActive: true, order: 31 },
            { id: 'first-quarter', title: 'First Quarter', description: 'Complete your first quarter of learning', icon: '📊', unlocked: false, requirement: 'Complete 90 days of learning', category: 'milestone', points: 500, isActive: true, order: 32 },
            
            // Social Achievements
            { id: 'github-commit', title: 'GitHub Committer', description: 'Make your first GitHub commit', icon: '🐙', unlocked: false, requirement: 'Make a GitHub commit', category: 'social', points: 100, isActive: true, order: 33 },
            { id: 'linkedin-post', title: 'LinkedIn Influencer', description: 'Share your learning journey on LinkedIn', icon: '💼', unlocked: false, requirement: 'Post about your learning on LinkedIn', category: 'social', points: 75, isActive: true, order: 34 },
            { id: 'blog-post', title: 'Blog Writer', description: 'Write a technical blog post', icon: '✍️', unlocked: false, requirement: 'Write a technical blog post', category: 'social', points: 150, isActive: true, order: 35 },
            
            // Advanced Achievements
            { id: 'fullstack-master', title: 'Fullstack Master', description: 'Complete both frontend and backend phases', icon: '🔄', unlocked: false, requirement: 'Complete Phase 1 and Phase 2', category: 'milestone', points: 600, isActive: true, order: 36 },
            { id: 'devops-expert', title: 'DevOps Expert', description: 'Master deployment and cloud services', icon: '☁️', unlocked: false, requirement: 'Complete Phase 3', category: 'milestone', points: 400, isActive: true, order: 37 },
            { id: 'interview-ready', title: 'Interview Ready', description: 'Complete all phases and be job-ready', icon: '🎯', unlocked: false, requirement: 'Complete all 5 phases', category: 'milestone', points: 1000, isActive: true, order: 38 },
            
            // Challenge Achievements
            { id: 'leetcode-daily', title: 'Daily Coder', description: 'Solve LeetCode problems for 7 consecutive days', icon: '📝', unlocked: false, requirement: 'Solve LeetCode problems for 7 days in a row', category: 'streak', points: 100, isActive: true, order: 39 },
            { id: 'project-week', title: 'Project Week', description: 'Complete a project in 7 days', icon: '⚡', unlocked: false, requirement: 'Complete a project within 7 days', category: 'special', points: 200, isActive: true, order: 40 },
            { id: 'topic-master', title: 'Topic Master', description: 'Complete all topics in a single phase', icon: '🎓', unlocked: false, requirement: 'Complete all topics in one phase', category: 'progress', points: 300, isActive: true, order: 41 },
            
            // Consistency Achievements
            { id: 'consistent-learner', title: 'Consistent Learner', description: 'Learn for 5 days in a row', icon: '📈', unlocked: false, requirement: 'Learn for 5 consecutive days', category: 'streak', points: 75, isActive: true, order: 42 },
            { id: 'dedicated-student', title: 'Dedicated Student', description: 'Learn for 15 days in a row', icon: '🎯', unlocked: false, requirement: 'Learn for 15 consecutive days', category: 'streak', points: 150, isActive: true, order: 43 },
            { id: 'learning-addict', title: 'Learning Addict', description: 'Learn for 50 days in a row', icon: '🔥', unlocked: false, requirement: 'Learn for 50 consecutive days', category: 'streak', points: 500, isActive: true, order: 44 },
            
            // Quality Achievements
            { id: 'quality-learner', title: 'Quality Learner', description: 'Log detailed progress for 10 days', icon: '✨', unlocked: false, requirement: 'Log detailed progress for 10 days', category: 'progress', points: 100, isActive: true, order: 45 },
            { id: 'reflection-master', title: 'Reflection Master', description: 'Write key takeaways for 20 days', icon: '💭', unlocked: false, requirement: 'Write key takeaways for 20 days', category: 'progress', points: 200, isActive: true, order: 46 },
            
            // Speed Achievements
            { id: 'fast-learner', title: 'Fast Learner', description: 'Complete a phase ahead of schedule', icon: '⚡', unlocked: false, requirement: 'Complete a phase before its end date', category: 'special', points: 300, isActive: true, order: 47 },
            { id: 'efficient-coder', title: 'Efficient Coder', description: 'Complete 3 projects in one month', icon: '🚀', unlocked: false, requirement: 'Complete 3 projects in 30 days', category: 'special', points: 400, isActive: true, order: 48 },
            
            // Community Achievements
            { id: 'help-others', title: 'Help Others', description: 'Help someone with their coding journey', icon: '🤝', unlocked: false, requirement: 'Help someone with coding', category: 'social', points: 100, isActive: true, order: 49 },
            { id: 'code-reviewer', title: 'Code Reviewer', description: 'Review someone else\'s code', icon: '🔍', unlocked: false, requirement: 'Review someone\'s code', category: 'social', points: 150, isActive: true, order: 50 },
            { id: 'open-source', title: 'Open Source Contributor', description: 'Contribute to an open source project', icon: '🌐', unlocked: false, requirement: 'Contribute to open source', category: 'social', points: 300, isActive: true, order: 51 },
            
            // Final Achievements
            { id: 'roadmap-complete', title: 'Roadmap Master', description: 'Complete the entire development roadmap', icon: '🏆', unlocked: false, requirement: 'Complete all phases, topics, and projects', category: 'milestone', points: 2000, isActive: true, order: 52 },
            { id: 'job-ready', title: 'Job Ready', description: 'Get your first developer job', icon: '💼', unlocked: false, requirement: 'Land your first developer job', category: 'milestone', points: 5000, isActive: true, order: 53 },
            { id: 'senior-developer', title: 'Senior Developer', description: 'Become a senior developer', icon: '👑', unlocked: false, requirement: 'Achieve senior developer status', category: 'milestone', points: 10000, isActive: true, order: 54 }
        ]
    }

    const getDefaultPhases = (): Phase[] => {
        return [
            {
                id: 'phase-1',
                title: 'Phase 1: Web Foundations & Frontend Development',
                description: 'Master HTML, CSS, JavaScript, React, and Next.js',
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
                            { id: '1', name: 'MDN Web Docs', url: 'https://developer.mozilla.org', type: 'documentation', completed: false },
                            { id: '2', name: 'CSS Flexbox Guide', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/', type: 'article', completed: false },
                            { id: '3', name: 'JavaScript.info', url: 'https://javascript.info', type: 'documentation', completed: false }
                        ]
                    },
                    {
                        id: 'advanced-js',
                        name: 'Advanced JavaScript & CSS Frameworks',
                        description: 'Week 3-4: Closures, Async/Await, Tailwind CSS',
                        completed: false,
                        resources: [
                            { id: '4', name: 'Tailwind CSS Docs', url: 'https://tailwindcss.com/docs', type: 'documentation', completed: false },
                            { id: '5', name: 'JavaScript Closures', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures', type: 'documentation', completed: false }
                        ]
                    },
                    {
                        id: 'react-basics',
                        name: 'React.js Fundamentals',
                        description: 'Week 5-6: Components, Props, State, Hooks',
                        completed: false,
                        resources: [
                            { id: '6', name: 'React Official Docs', url: 'https://react.dev', type: 'documentation', completed: false },
                            { id: '7', name: 'React Router', url: 'https://reactrouter.com', type: 'documentation', completed: false }
                        ]
                    },
                    {
                        id: 'advanced-react',
                        name: 'Advanced React & Web Security',
                        description: 'Week 7-8: Next.js, Authentication, Security',
                        completed: false,
                        resources: [
                            { id: '8', name: 'Next.js Docs', url: 'https://nextjs.org/docs', type: 'documentation', completed: false },
                            { id: '9', name: 'Web Security Basics', url: 'https://owasp.org/www-project-top-ten/', type: 'article', completed: false }
                        ]
                    }
                ],
                projects: [
                    {
                        id: 'portfolio',
                        name: 'Personal Portfolio Website',
                        description: 'Responsive portfolio using HTML, CSS, JavaScript',
                        status: 'not-started',
                        technologies: ['HTML', 'CSS', 'JavaScript']
                    },
                    {
                        id: 'landing-page',
                        name: 'Modern Landing Page',
                        description: 'Landing page using Tailwind CSS',
                        status: 'not-started',
                        technologies: ['HTML', 'CSS', 'Tailwind CSS']
                    },
                    {
                        id: 'todo-app',
                        name: 'Todo App with React',
                        description: 'Full-featured todo app with state management',
                        status: 'not-started',
                        technologies: ['React', 'TypeScript', 'Tailwind CSS']
                    },
                    {
                        id: 'dashboard',
                        name: 'Fullstack Authenticated Dashboard',
                        description: 'Dashboard with Next.js and authentication',
                        status: 'not-started',
                        technologies: ['Next.js', 'TypeScript', 'JWT', 'Prisma']
                    }
                ]
            },
            {
                id: 'phase-2',
                title: 'Phase 2: Backend Development with Node.js & TypeScript',
                description: 'Build robust APIs, authentication systems, and real-time apps',
                startDate: '2025-10-04',
                endDate: '2025-11-14',
                weeks: 6,
                progress: 0,
                status: 'not-started',
                leetCodeTarget: 30,
                leetCodeCompleted: 0,
                topics: [
                    {
                        id: 'typescript-basics',
                        name: 'TypeScript & Node.js Basics',
                        description: 'Week 9-10: TypeScript fundamentals, Express.js',
                        completed: false,
                        resources: [
                            { id: '10', name: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/', type: 'documentation', completed: false },
                            { id: '11', name: 'Express.js Guide', url: 'https://expressjs.com', type: 'documentation', completed: false }
                        ]
                    },
                    {
                        id: 'databases-auth',
                        name: 'Databases & Authentication',
                        description: 'Week 11-12: PostgreSQL, MongoDB, JWT, OAuth',
                        completed: false,
                        resources: [
                            { id: '12', name: 'Prisma Docs', url: 'https://www.prisma.io/docs', type: 'documentation', completed: false },
                            { id: '13', name: 'MongoDB University', url: 'https://university.mongodb.com', type: 'course', completed: false }
                        ]
                    },
                    {
                        id: 'advanced-backend',
                        name: 'Advanced Backend & Security',
                        description: 'Week 13-14: WebSockets, Docker, API Security',
                        completed: false,
                        resources: [
                            { id: '14', name: 'Socket.io Docs', url: 'https://socket.io/docs', type: 'documentation', completed: false },
                            { id: '15', name: 'Docker Tutorial', url: 'https://docs.docker.com/get-started/', type: 'documentation', completed: false }
                        ]
                    }
                ],
                projects: [
                    {
                        id: 'blog-api',
                        name: 'RESTful Blog API',
                        description: 'Full CRUD API with TypeScript and Express',
                        status: 'not-started',
                        technologies: ['Node.js', 'TypeScript', 'Express', 'Prisma']
                    },
                    {
                        id: 'auth-system',
                        name: 'Authentication System',
                        description: 'Complete auth system with JWT and OAuth',
                        status: 'not-started',
                        technologies: ['Node.js', 'TypeScript', 'JWT', 'PostgreSQL']
                    },
                    {
                        id: 'chat-app',
                        name: 'Real-Time Chat App',
                        description: 'WebSocket-based chat with authentication',
                        status: 'not-started',
                        technologies: ['Node.js', 'Socket.io', 'MongoDB', 'JWT']
                    }
                ]
            },
            {
                id: 'phase-3',
                title: 'Phase 3: Go & Rust with Extensive Projects',
                description: 'Master Go and Rust for high-performance applications',
                startDate: '2025-11-15',
                endDate: '2026-01-09',
                weeks: 8,
                progress: 0,
                status: 'not-started',
                leetCodeTarget: 40,
                leetCodeCompleted: 0,
                topics: [
                    {
                        id: 'go-basics',
                        name: 'Go Language Fundamentals',
                        description: 'Week 15-16: Go syntax, concurrency, REST APIs',
                        completed: false,
                        resources: [
                            { id: '16', name: 'Go by Example', url: 'https://gobyexample.com', type: 'documentation', completed: false },
                            { id: '17', name: 'Go Fiber', url: 'https://gofiber.io', type: 'documentation', completed: false }
                        ]
                    },
                    {
                        id: 'rust-basics',
                        name: 'Rust Fundamentals',
                        description: 'Week 17-20: Ownership, borrowing, memory safety',
                        completed: false,
                        resources: [
                            { id: '18', name: 'Rust Book', url: 'https://doc.rust-lang.org/book/', type: 'book', completed: false },
                            { id: '19', name: 'Rust by Example', url: 'https://doc.rust-lang.org/rust-by-example/', type: 'documentation', completed: false }
                        ]
                    },
                    {
                        id: 'advanced-rust',
                        name: 'Advanced Rust & Projects',
                        description: 'Week 21-24: Lifetimes, traits, web APIs with Axum',
                        completed: false,
                        resources: [
                            { id: '20', name: 'Axum Framework', url: 'https://docs.rs/axum', type: 'documentation', completed: false },
                            { id: '21', name: 'Rust Async Book', url: 'https://rust-lang.github.io/async-book/', type: 'book', completed: false }
                        ]
                    }
                ],
                projects: [
                    {
                        id: 'go-microservices',
                        name: 'Microservices Architecture with Go',
                        description: 'Distributed system with multiple Go services',
                        status: 'not-started',
                        technologies: ['Go', 'Docker', 'gRPC', 'PostgreSQL']
                    },
                    {
                        id: 'rust-api',
                        name: 'Rust Web API with Axum',
                        description: 'High-performance web API using Rust',
                        status: 'not-started',
                        technologies: ['Rust', 'Axum', 'Tokio', 'PostgreSQL']
                    },
                    {
                        id: 'rust-cli',
                        name: 'High-Performance CLI Tool',
                        description: 'System programming with Rust',
                        status: 'not-started',
                        technologies: ['Rust', 'Clap', 'Tokio']
                    },
                    {
                        id: 'hybrid-system',
                        name: 'Go-Rust Hybrid System',
                        description: 'Rust for performance, Go for concurrency',
                        status: 'not-started',
                        technologies: ['Go', 'Rust', 'gRPC', 'Docker']
                    },
                    {
                        id: 'blockchain-rust',
                        name: 'Blockchain-inspired Rust App',
                        description: 'Distributed ledger implementation',
                        status: 'not-started',
                        technologies: ['Rust', 'Cryptography', 'Networking']
                    }
                ]
            },
            {
                id: 'phase-4',
                title: 'Phase 4: Cloud Computing & Deployment',
                description: 'Master AWS, Docker, Kubernetes, and CI/CD',
                startDate: '2025-12-20',
                endDate: '2026-01-09',
                weeks: 3,
                progress: 0,
                status: 'not-started',
                leetCodeTarget: 15,
                leetCodeCompleted: 0,
                topics: [
                    {
                        id: 'aws-basics',
                        name: 'AWS Fundamentals',
                        description: 'EC2, S3, RDS, Lambda, CloudFormation',
                        completed: false,
                        resources: [
                            { id: '22', name: 'AWS Documentation', url: 'https://docs.aws.amazon.com', type: 'documentation', completed: false },
                            { id: '23', name: 'AWS Free Tier', url: 'https://aws.amazon.com/free/', type: 'documentation', completed: false }
                        ]
                    },
                    {
                        id: 'kubernetes',
                        name: 'Kubernetes & Container Orchestration',
                        description: 'Docker, Kubernetes, containerization',
                        completed: false,
                        resources: [
                            { id: '24', name: 'Kubernetes Docs', url: 'https://kubernetes.io/docs/', type: 'documentation', completed: false },
                            { id: '25', name: 'Docker Tutorial', url: 'https://docs.docker.com/get-started/', type: 'documentation', completed: false }
                        ]
                    },
                    {
                        id: 'cicd',
                        name: 'CI/CD Pipelines',
                        description: 'GitHub Actions, Jenkins, automated deployment',
                        completed: false,
                        resources: [
                            { id: '26', name: 'GitHub Actions', url: 'https://docs.github.com/en/actions', type: 'documentation', completed: false },
                            { id: '27', name: 'Jenkins User Guide', url: 'https://www.jenkins.io/doc/book/', type: 'documentation', completed: false }
                        ]
                    }
                ],
                projects: [
                    {
                        id: 'fullstack-deployment',
                        name: 'Fullstack App with CI/CD',
                        description: 'Deploy complete application with automated pipeline',
                        status: 'not-started',
                        technologies: ['AWS', 'Docker', 'Kubernetes', 'GitHub Actions']
                    }
                ]
            },
            {
                id: 'phase-5',
                title: 'Phase 5: Portfolio Building & Job Applications',
                description: 'Build portfolio, optimize profiles, and apply for jobs',
                startDate: '2025-11-29',
                endDate: '2026-01-09',
                weeks: 6,
                progress: 0,
                status: 'not-started',
                leetCodeTarget: 36,
                leetCodeCompleted: 0,
                topics: [
                    {
                        id: 'portfolio-building',
                        name: 'Portfolio Development',
                        description: 'GitHub optimization, project showcase',
                        completed: false,
                        resources: [
                            { id: '28', name: 'GitHub Profile README', url: 'https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme', type: 'documentation', completed: false }
                        ]
                    },
                    {
                        id: 'content-creation',
                        name: 'Content Creation & Networking',
                        description: 'LinkedIn posts, technical articles',
                        completed: false,
                        resources: [
                            { id: '29', name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/', type: 'course', completed: false }
                        ]
                    },
                    {
                        id: 'interview-prep',
                        name: 'Interview Preparation',
                        description: 'Mock interviews, resume optimization',
                        completed: false,
                        resources: [
                            { id: '30', name: 'LeetCode', url: 'https://leetcode.com', type: 'documentation', completed: false }
                        ]
                    }
                ],
                projects: [
                    {
                        id: 'portfolio-website',
                        name: 'Professional Portfolio Website',
                        description: 'Showcase all projects and skills',
                        status: 'not-started',
                        technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel']
                    }
                ]
            }
        ]
    }

    const calculateStreak = () => {
        const today = new Date()
        let currentStreak = 0
        let checkDate = new Date(today)
        
        while (true) {
            const dateStr = checkDate.toISOString().split('T')[0]
            const hasLog = dailyLogs.some(log => log.date === dateStr)
            
            if (hasLog) {
                currentStreak++
                checkDate.setDate(checkDate.getDate() - 1)
            } else {
                break
            }
        }
        
        setStreak(currentStreak)
    }

    const updatePhaseProgress = (phaseId: string) => {
        const phase = phases.find(p => p.id === phaseId)
        if (!phase) return

        const totalTopics = phase.topics.length
        const completedTopics = phase.topics.filter(t => t.completed).length
        const totalProjects = phase.projects.length
        const completedProjects = phase.projects.filter(p => p.status === 'completed').length
        
        const topicProgress = (completedTopics / totalTopics) * 50 // 50% weight
        const projectProgress = (completedProjects / totalProjects) * 50 // 50% weight
        
        const newProgress = Math.round(topicProgress + projectProgress)
        
        setPhases(phases.map(p => 
            p.id === phaseId 
                ? { ...p, progress: newProgress }
                : p
        ))
    }



    const toggleTopicCompletion = async (phaseId: string, topicId: string) => {
        try {
            const phase = phases.find(p => p.id === phaseId)
            const topic = phase?.topics.find(t => t.id === topicId)
            
            if (!phase || !topic) return
            
            const newCompleted = !topic.completed
            
            if (useDatabase) {
                // Update in database
                await updateDevRoadmapTopic(topicId, {
                    completed: newCompleted
                })
                
                // Reload the entire phase to get updated progress
                const updatedPhaseData = await getDevRoadmapPhases()
                const phaseData = updatedPhaseData.find(p => p.id === phaseId)
                
                if (phaseData) {
                    const topics = await getDevRoadmapTopics(phaseId)
                    const projects = await getDevRoadmapProjects(phaseId)
                    
                    const transformedTopics = await Promise.all(
                        topics.map(async (topic) => {
                            const resources = await getDevRoadmapResources(topic.id)
                            return {
                                id: topic.id,
                                name: topic.name,
                                description: topic.description,
                                completed: topic.completed,
                                resources: resources.map(resource => ({
                                    id: resource.id,
                                    name: resource.name,
                                    url: resource.url,
                                    type: resource.type,
                                    completed: resource.completed
                                }))
                            }
                        })
                    )
                    
                    const transformedProjects = projects.map(project => ({
                        id: project.id,
                        name: project.name,
                        description: project.description,
                        status: project.status,
                        githubUrl: project.github_url,
                        liveUrl: project.live_url,
                        technologies: project.technologies,
                        isCustom: project.is_custom
                    }))
                    
                    const updatedPhase = {
                        id: phaseData.id,
                        title: phaseData.title,
                        description: phaseData.description,
                        startDate: phaseData.start_date,
                        endDate: phaseData.end_date,
                        weeks: phaseData.weeks,
                        progress: phaseData.progress,
                        status: phaseData.status,
                        leetCodeTarget: phaseData.leetcode_target,
                        leetCodeCompleted: phaseData.leetcode_completed,
                        topics: transformedTopics,
                        projects: transformedProjects
                    }
                    
                    setPhases(prevPhases => 
                        prevPhases.map(p => p.id === phaseId ? updatedPhase : p)
                    )
                    
                    // Check achievements after updating topic completion
                    setTimeout(() => {
                        checkAchievements(totalHours, totalLeetCode).catch(err => {
                            console.error('Error checking achievements after topic update:', err)
                        })
                    }, 100)
                }
            } else {
                // Update in localStorage
        setPhases(prevPhases => {
            const updatedPhases = prevPhases.map(phase => {
                if (phase.id === phaseId) {
                    const updatedTopics = phase.topics.map(topic =>
                        topic.id === topicId
                                    ? { ...topic, completed: newCompleted }
                            : topic
                    )
                    
                    // Calculate progress directly here
                    const totalTopics = updatedTopics.length
                    const completedTopics = updatedTopics.filter(t => t.completed).length
                    const totalProjects = phase.projects.length
                    const completedProjects = phase.projects.filter(p => p.status === 'completed').length
                    
                    const topicProgress = totalTopics > 0 ? (completedTopics / totalTopics) * 50 : 0
                    const projectProgress = totalProjects > 0 ? (completedProjects / totalProjects) * 50 : 0
                    const newProgress = Math.round(topicProgress + projectProgress)
                    
                    return {
                        ...phase,
                        topics: updatedTopics,
                        progress: newProgress
                    }
                }
                return phase
            })
            return updatedPhases
        })
            }
        } catch (err) {
            console.error('Error toggling topic completion:', err)
            setError('Failed to update topic completion. Please try again.')
        }
    }

    const updateProjectStatus = async (phaseId: string, projectId: string, status: Project['status']) => {
        try {
            if (useDatabase) {
                // Update in database
                await updateDevRoadmapProject(projectId, {
                    status
                })
                
                // Reload the entire phase to get updated progress
                const updatedPhaseData = await getDevRoadmapPhases()
                const phaseData = updatedPhaseData.find(p => p.id === phaseId)
                
                if (phaseData) {
                    const topics = await getDevRoadmapTopics(phaseId)
                    const projects = await getDevRoadmapProjects(phaseId)
                    
                    const transformedTopics = await Promise.all(
                        topics.map(async (topic) => {
                            const resources = await getDevRoadmapResources(topic.id)
                            return {
                                id: topic.id,
                                name: topic.name,
                                description: topic.description,
                                completed: topic.completed,
                                resources: resources.map(resource => ({
                                    id: resource.id,
                                    name: resource.name,
                                    url: resource.url,
                                    type: resource.type,
                                    completed: resource.completed
                                }))
                            }
                        })
                    )
                    
                    const transformedProjects = projects.map(project => ({
                        id: project.id,
                        name: project.name,
                        description: project.description,
                        status: project.status,
                        githubUrl: project.github_url,
                        liveUrl: project.live_url,
                        technologies: project.technologies,
                        isCustom: project.is_custom
                    }))
                    
                    const updatedPhase = {
                        id: phaseData.id,
                        title: phaseData.title,
                        description: phaseData.description,
                        startDate: phaseData.start_date,
                        endDate: phaseData.end_date,
                        weeks: phaseData.weeks,
                        progress: phaseData.progress,
                        status: phaseData.status,
                        leetCodeTarget: phaseData.leetcode_target,
                        leetCodeCompleted: phaseData.leetcode_completed,
                        topics: transformedTopics,
                        projects: transformedProjects
                    }
                    
                    setPhases(prevPhases => 
                        prevPhases.map(p => p.id === phaseId ? updatedPhase : p)
                    )
                    
                    // Check achievements after updating project status
                    setTimeout(() => {
                        checkAchievements(totalHours, totalLeetCode).catch(err => {
                            console.error('Error checking achievements after project update:', err)
                        })
                    }, 100)
                }
            } else {
                // Update in localStorage
        setPhases(prevPhases => {
            const updatedPhases = prevPhases.map(phase => {
                if (phase.id === phaseId) {
                    const updatedProjects = phase.projects.map(project =>
                        project.id === projectId
                            ? { ...project, status }
                            : project
                    )
                    
                    // Calculate progress directly here
                    const totalTopics = phase.topics.length
                    const completedTopics = phase.topics.filter(t => t.completed).length
                    const totalProjects = updatedProjects.length
                    const completedProjects = updatedProjects.filter(p => p.status === 'completed').length
                    
                    const topicProgress = totalTopics > 0 ? (completedTopics / totalTopics) * 50 : 0
                    const projectProgress = totalProjects > 0 ? (completedProjects / totalProjects) * 50 : 0
                    const newProgress = Math.round(topicProgress + projectProgress)
                    
                    return {
                        ...phase,
                        projects: updatedProjects,
                        progress: newProgress
                    }
                }
                return phase
            })
            return updatedPhases
        })
            }
        } catch (err) {
            console.error('Error updating project status:', err)
            setError('Failed to update project status. Please try again.')
        }
    }

    const addDailyLog = async (log: Omit<DailyLog, 'id'>) => {
        try {
            if (useDatabase) {
                // Add to database
                const databaseLog = {
                    date: log.date,
                    phaseId: log.phaseId,
                    topicId: log.topicId,
                    projectId: log.projectId,
                    hoursSpent: log.hoursSpent,
                    activities: log.activities,
                    leetCodeProblems: log.leetCodeProblems,
                    keyTakeaway: log.keyTakeaway,
                    readingMinutes: log.readingMinutes,
                    projectWorkMinutes: log.projectWorkMinutes,
                    leetCodeMinutes: log.leetCodeMinutes,
                    networkingMinutes: log.networkingMinutes
                }
                
                const newLog = await addDevRoadmapDailyLog(databaseLog)
                
                // Transform back to component format
                const transformedLog: DailyLog = {
                    id: newLog.id,
                    date: newLog.date,
                    phaseId: newLog.phase_id,
                    topicId: newLog.topic_id,
                    projectId: newLog.project_id,
                    hoursSpent: newLog.hours_spent,
                    activities: newLog.activities,
                    leetCodeProblems: newLog.leetcode_problems,
                    keyTakeaway: newLog.key_takeaway,
                    nextUp: '',
                    readingMinutes: newLog.reading_minutes,
                    projectWorkMinutes: newLog.project_work_minutes,
                    leetCodeMinutes: newLog.leetcode_minutes,
                    networkingMinutes: newLog.networking_minutes
                }
                
                setDailyLogs([transformedLog, ...dailyLogs])
                
                // Manually recalculate and update user stats
                // Recalculating user stats after adding daily log...
                const updatedStats = await recalculateUserStats()
                setUserStats(updatedStats)
                // Updated user stats
                
                // Force update of display values
                setTotalHours(updatedStats.total_hours || 0)
                setTotalLeetCode(updatedStats.total_leetcode_solved || 0)
                setStreak(updatedStats.current_streak || 0)
            } else {
                // Add to localStorage
        const newLog: DailyLog = {
            ...log,
            id: Date.now().toString()
        }
        setDailyLogs([newLog, ...dailyLogs])
            }
            
        setShowLogModal(false)
        } catch (err) {
            console.error('Error adding daily log:', err)
            setError('Failed to save daily log. Please try again.')
        }
    }

    const addProject = async () => {
        if (!newProject.name.trim() || !newProject.description.trim()) return
        
        try {
            const projectData = {
                phaseId: newProject.phaseId,
                name: newProject.name.trim(),
                description: newProject.description.trim(),
                status: 'not-started' as const,
                technologies: newProject.technologies.split(',').map(tech => tech.trim()).filter(tech => tech),
                isCustom: true
            }
            
            if (useDatabase) {
                // Add to database
                const newProjectData = await addDevRoadmapProject(projectData)
                
                // Transform back to component format
                const project: Project = {
                    id: newProjectData.id,
                    name: newProjectData.name,
                    description: newProjectData.description,
                    status: newProjectData.status,
                    githubUrl: newProjectData.github_url,
                    liveUrl: newProjectData.live_url,
                    technologies: newProjectData.technologies,
                    isCustom: newProjectData.is_custom
                }
                
                setPhases(phases.map(phase => {
                    if (phase.id === newProject.phaseId) {
                        return {
                            ...phase,
                            projects: [...phase.projects, project]
                        }
                    }
                    return phase
                }))
            } else {
                // Add to localStorage
        const project: Project = {
            id: Date.now().toString(),
            name: newProject.name.trim(),
            description: newProject.description.trim(),
            status: 'not-started',
            technologies: newProject.technologies.split(',').map(tech => tech.trim()).filter(tech => tech),
                    isCustom: true
        }
        
        setPhases(phases.map(phase => {
            if (phase.id === newProject.phaseId) {
                return {
                    ...phase,
                    projects: [...phase.projects, project]
                }
            }
            return phase
        }))
            }
        
        setNewProject({
            name: '',
            description: '',
            technologies: '',
            phaseId: 'phase-1'
        })
        setShowProjectModal(false)
        } catch (err) {
            console.error('Error adding project:', err)
            setError('Failed to add project. Please try again.')
        }
    }

    const triggerCelebration = (achievement: Achievement) => {
        setCelebratedAchievement(achievement)
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
    }

    const generateNewAchievement = () => {
        const achievementTemplates = [
            { title: 'Code Warrior', description: 'Write 100 lines of code today', icon: '⚔️', category: 'daily', points: 25 },
            { title: 'Debug Master', description: 'Fix 5 bugs in your code', icon: '🐛', category: 'progress', points: 30 },
            { title: 'Git Guru', description: 'Make 10 Git commits today', icon: '📝', category: 'daily', points: 20 },
            { title: 'Documentation Hero', description: 'Write documentation for a project', icon: '📚', category: 'progress', points: 40 },
            { title: 'Test Champion', description: 'Write 20 unit tests', icon: '🧪', category: 'progress', points: 35 },
            { title: 'Performance Optimizer', description: 'Optimize code performance', icon: '⚡', category: 'special', points: 50 },
            { title: 'Security Expert', description: 'Implement security best practices', icon: '🔒', category: 'special', points: 45 },
            { title: 'UI/UX Designer', description: 'Improve user interface design', icon: '🎨', category: 'progress', points: 30 },
            { title: 'API Builder', description: 'Create a RESTful API endpoint', icon: '🔗', category: 'project', points: 40 },
            { title: 'Database Master', description: 'Design and implement a database', icon: '🗄️', category: 'project', points: 45 },
            { title: 'Cloud Deployer', description: 'Deploy an application to the cloud', icon: '☁️', category: 'milestone', points: 60 },
            { title: 'Mobile Developer', description: 'Build a mobile app feature', icon: '📱', category: 'project', points: 50 },
            { title: 'Full Stack Hero', description: 'Complete a full-stack feature', icon: '🦸', category: 'milestone', points: 70 },
            { title: 'Code Reviewer', description: 'Review someone else\'s code', icon: '👀', category: 'social', points: 25 },
            { title: 'Mentor', description: 'Help someone learn to code', icon: '🤝', category: 'social', points: 35 },
            { title: 'Open Source Contributor', description: 'Contribute to open source', icon: '🌐', category: 'social', points: 50 },
            { title: 'Tech Blogger', description: 'Write a technical blog post', icon: '✍️', category: 'social', points: 30 },
            { title: 'Conference Speaker', description: 'Present at a tech meetup', icon: '🎤', category: 'social', points: 80 },
            { title: 'Algorithm Master', description: 'Solve a complex algorithm', icon: '🧮', category: 'leetcode', points: 40 },
            { title: 'Data Structure Expert', description: 'Implement advanced data structures', icon: '📊', category: 'leetcode', points: 35 },
            { title: 'System Design Guru', description: 'Design a scalable system', icon: '🏗️', category: 'milestone', points: 100 },
            { title: 'DevOps Engineer', description: 'Set up CI/CD pipeline', icon: '🔄', category: 'milestone', points: 75 },
            { title: 'Machine Learning Pioneer', description: 'Implement a ML model', icon: '🤖', category: 'special', points: 90 },
            { title: 'Blockchain Developer', description: 'Create a smart contract', icon: '⛓️', category: 'special', points: 85 },
            { title: 'Game Developer', description: 'Build a simple game', icon: '🎮', category: 'project', points: 55 },
            { title: 'E-commerce Builder', description: 'Create an online store', icon: '🛒', category: 'project', points: 65 },
            { title: 'Social Media App', description: 'Build a social media feature', icon: '📱', category: 'project', points: 60 },
            { title: 'Real-time Chat', description: 'Implement real-time messaging', icon: '💬', category: 'project', points: 70 },
            { title: 'Payment Integration', description: 'Integrate payment processing', icon: '💳', category: 'project', points: 55 },
            { title: 'Email System', description: 'Build an email notification system', icon: '📧', category: 'project', points: 40 },
            { title: 'File Upload System', description: 'Create a file upload feature', icon: '📁', category: 'project', points: 35 },
            { title: 'Search Engine', description: 'Implement search functionality', icon: '🔍', category: 'project', points: 45 },
            { title: 'Analytics Dashboard', description: 'Build a data visualization dashboard', icon: '📈', category: 'project', points: 50 },
            { title: 'Authentication System', description: 'Implement user authentication', icon: '🔐', category: 'project', points: 40 },
            { title: 'Role-based Access', description: 'Create role-based permissions', icon: '👥', category: 'project', points: 35 },
            { title: 'Multi-language Support', description: 'Add internationalization', icon: '🌍', category: 'project', points: 30 },
            { title: 'Dark Mode', description: 'Implement dark/light theme toggle', icon: '🌙', category: 'progress', points: 25 },
            { title: 'Responsive Design', description: 'Make app fully responsive', icon: '📱', category: 'progress', points: 30 },
            { title: 'Accessibility Expert', description: 'Implement accessibility features', icon: '♿', category: 'progress', points: 35 },
            { title: 'Progressive Web App', description: 'Convert to PWA', icon: '📲', category: 'milestone', points: 60 },
            { title: 'Microservices Architect', description: 'Break down into microservices', icon: '🏢', category: 'milestone', points: 80 },
            { title: 'Load Balancer', description: 'Implement load balancing', icon: '⚖️', category: 'milestone', points: 70 },
            { title: 'Caching Expert', description: 'Implement caching strategies', icon: '💾', category: 'progress', points: 40 },
            { title: 'Database Optimization', description: 'Optimize database queries', icon: '🚀', category: 'progress', points: 45 },
            { title: 'API Rate Limiting', description: 'Implement rate limiting', icon: '⏱️', category: 'progress', points: 30 },
            { title: 'Error Handling', description: 'Implement comprehensive error handling', icon: '⚠️', category: 'progress', points: 25 },
            { title: 'Logging System', description: 'Set up application logging', icon: '📋', category: 'progress', points: 20 },
            { title: 'Monitoring Dashboard', description: 'Create system monitoring', icon: '📊', category: 'milestone', points: 55 },
            { title: 'Automated Testing', description: 'Set up automated test suite', icon: '🤖', category: 'progress', points: 40 },
            { title: 'Code Coverage', description: 'Achieve 90% code coverage', icon: '📊', category: 'progress', points: 35 },
            { title: 'Performance Testing', description: 'Run performance tests', icon: '⚡', category: 'progress', points: 30 },
            { title: 'Security Testing', description: 'Perform security audit', icon: '🔍', category: 'progress', points: 35 },
            { title: 'Dependency Management', description: 'Update and manage dependencies', icon: '📦', category: 'progress', points: 20 },
            { title: 'Code Documentation', description: 'Document all functions and classes', icon: '📖', category: 'progress', points: 25 },
            { title: 'Code Style Guide', description: 'Follow consistent coding standards', icon: '📏', category: 'progress', points: 20 },
            { title: 'Version Control', description: 'Use Git effectively', icon: '📝', category: 'progress', points: 15 },
            { title: 'Code Review Process', description: 'Establish code review workflow', icon: '👀', category: 'progress', points: 25 },
            { title: 'Deployment Automation', description: 'Automate deployment process', icon: '🤖', category: 'milestone', points: 50 },
            { title: 'Environment Management', description: 'Set up multiple environments', icon: '🌍', category: 'milestone', points: 40 },
            { title: 'Backup Strategy', description: 'Implement data backup system', icon: '💾', category: 'milestone', points: 35 },
            { title: 'Disaster Recovery', description: 'Plan disaster recovery', icon: '🆘', category: 'milestone', points: 45 },
            { title: 'Scalability Planning', description: 'Plan for application scaling', icon: '📈', category: 'milestone', points: 60 },
            { title: 'Cost Optimization', description: 'Optimize cloud costs', icon: '💰', category: 'milestone', points: 40 },
            { title: 'Compliance Expert', description: 'Implement compliance requirements', icon: '📋', category: 'milestone', points: 50 },
            { title: 'API Documentation', description: 'Create comprehensive API docs', icon: '📚', category: 'progress', points: 30 },
            { title: 'User Documentation', description: 'Write user guides', icon: '📖', category: 'progress', points: 25 },
            { title: 'Video Tutorial', description: 'Create a tutorial video', icon: '🎥', category: 'social', points: 40 },
            { title: 'Podcast Guest', description: 'Appear on a tech podcast', icon: '🎙️', category: 'social', points: 60 },
            { title: 'Tech Conference', description: 'Attend a tech conference', icon: '🎪', category: 'social', points: 30 },
            { title: 'Hackathon Winner', description: 'Win a hackathon', icon: '🏆', category: 'milestone', points: 100 },
            { title: 'Startup Founder', description: 'Launch your own startup', icon: '🚀', category: 'milestone', points: 500 },
            { title: 'Tech Lead', description: 'Become a technical lead', icon: '👑', category: 'milestone', points: 300 },
            { title: 'CTO', description: 'Become a Chief Technology Officer', icon: '👑', category: 'milestone', points: 1000 }
        ]
        
        // Get existing achievement titles to avoid duplicates
        const existingTitles = achievements.map(a => a.title)
        
        // Filter out templates that already exist
        const availableTemplates = achievementTemplates.filter(template => 
            !existingTitles.includes(template.title)
        )
        
        // If no unique templates available, create a numbered version
        let selectedTemplate
        if (availableTemplates.length === 0) {
            const baseTemplate = achievementTemplates[Math.floor(Math.random() * achievementTemplates.length)]
            const count = existingTitles.filter(title => title.startsWith(baseTemplate.title)).length + 1
            selectedTemplate = {
                ...baseTemplate,
                title: `${baseTemplate.title} ${count}`,
                description: `${baseTemplate.description} (${count}nd time)`
            }
        } else {
            selectedTemplate = availableTemplates[Math.floor(Math.random() * availableTemplates.length)]
        }
        
        const newId = `achievement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        
        return {
            id: newId,
            title: selectedTemplate.title,
            description: selectedTemplate.description,
            icon: selectedTemplate.icon,
            unlocked: false,
            requirement: selectedTemplate.description,
            category: selectedTemplate.category as any,
            points: selectedTemplate.points,
            isActive: true,
            order: achievements.length + 1
        }
    }







    // Calculate total points from unlocked achievements
    const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0)

    // Calculate level based on points
    const getLevel = (points: number) => {
        if (points >= 5000) return { name: 'Diamond', icon: '💎', color: 'from-purple-500 to-pink-500' }
        if (points >= 3000) return { name: 'Platinum', icon: '🥇', color: 'from-gray-400 to-gray-600' }
        if (points >= 1500) return { name: 'Gold', icon: '🥇', color: 'from-yellow-400 to-yellow-600' }
        if (points >= 500) return { name: 'Silver', icon: '🥈', color: 'from-gray-300 to-gray-500' }
        return { name: 'Bronze', icon: '🥉', color: 'from-orange-400 to-orange-600' }
    }

    const currentLevel = getLevel(totalPoints)
    const nextLevel = getLevel(currentLevel.name === 'Bronze' ? 501 : currentLevel.name === 'Silver' ? 1501 : currentLevel.name === 'Gold' ? 3001 : currentLevel.name === 'Platinum' ? 5000 : 5000)
    const pointsToNextLevel = nextLevel.name === currentLevel.name ? 0 : 
        currentLevel.name === 'Bronze' ? 501 - totalPoints :
        currentLevel.name === 'Silver' ? 1501 - totalPoints :
        currentLevel.name === 'Gold' ? 3001 - totalPoints :
        currentLevel.name === 'Platinum' ? 5000 - totalPoints : 0

    // Timer functions
    const startTimer = (durationMinutes: number = 25) => {
        setIsTimerRunning(true)
        setTimeRemaining(durationMinutes * 60)
        setSessionStartTime(new Date())
        setTimerMode('focus')
    }

    const pauseTimer = () => {
        setIsTimerRunning(false)
    }

    const resetTimer = () => {
        setIsTimerRunning(false)
        setTimeRemaining(25 * 60)
        setSessionStartTime(null)
    }

    const completeTimerSession = async () => {
        try {
        const sessionDuration = sessionStartTime ? (new Date().getTime() - sessionStartTime.getTime()) / (1000 * 60 * 60) : 0.42 // Convert to hours
        const sessionTime = Math.max(sessionDuration, 0.42) // Minimum 25 minutes
            
            // Save study session to database if using database
            if (useDatabase && sessionStartTime) {
                const currentPhase = phases.find(p => p.status === 'in-progress') || phases[0]
                const currentTopic = currentPhase?.topics.find(t => !t.completed)
                
                const sessionData = {
                    startTime: sessionStartTime.toISOString(),
                    endTime: new Date().toISOString(),
                    durationMinutes: Math.round(sessionTime * 60),
                    mode: 'focus' as const,
                    completed: true,
                    phaseId: currentPhase?.id,
                    topicId: currentTopic?.id,
                    projectId: null
                }
                
                await addDevRoadmapStudySession(sessionData)
            }
        
        // Get current context for smart pre-filling
        const currentPhase = phases.find(p => p.status === 'in-progress') || phases[0]
        const currentTopic = currentPhase?.topics.find(t => !t.completed)
        
        // Pre-fill the daily log form
        setFormData({
            phaseId: currentPhase?.id || phases[0]?.id || '',
            topicId: currentTopic?.id || '',
            projectId: '',
            hoursSpent: sessionTime,
            activities: `Pomodoro study session - ${currentTopic?.name || currentPhase?.title}`,
            leetCodeProblems: 0,
            keyTakeaway: ''
        })
        
        // Update completed sessions
        setCompletedSessions(prev => prev + 1)
        
        // Close timer modal and open log modal
        setShowStudyTimer(false)
        setShowLogModal(true)
        
        // Reset timer
        setIsTimerRunning(false)
        setTimeRemaining(25 * 60)
        setSessionStartTime(null)
        } catch (err) {
            console.error('Error completing timer session:', err)
            setError('Failed to save study session. Please try again.')
        }
    }

    // Timer effect
    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null
        
        if (isTimerRunning && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        completeTimerSession()
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }
        
        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isTimerRunning, timeRemaining])

    // Format time helper
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const deleteProject = async (phaseId: string, projectId: string) => {
        try {
            if (useDatabase) {
                // Delete from database
                await deleteDevRoadmapProject(projectId)
                
                // Reload the entire phase to get updated progress
                const updatedPhaseData = await getDevRoadmapPhases()
                const phaseData = updatedPhaseData.find(p => p.id === phaseId)
                
                if (phaseData) {
                    const topics = await getDevRoadmapTopics(phaseId)
                    const projects = await getDevRoadmapProjects(phaseId)
                    
                    const transformedTopics = await Promise.all(
                        topics.map(async (topic) => {
                            const resources = await getDevRoadmapResources(topic.id)
                            return {
                                id: topic.id,
                                name: topic.name,
                                description: topic.description,
                                completed: topic.completed,
                                resources: resources.map(resource => ({
                                    id: resource.id,
                                    name: resource.name,
                                    url: resource.url,
                                    type: resource.type,
                                    completed: resource.completed
                                }))
                            }
                        })
                    )
                    
                    const transformedProjects = projects.map(project => ({
                        id: project.id,
                        name: project.name,
                        description: project.description,
                        status: project.status,
                        githubUrl: project.github_url,
                        liveUrl: project.live_url,
                        technologies: project.technologies,
                        isCustom: project.is_custom
                    }))
                    
                    const updatedPhase = {
                        id: phaseData.id,
                        title: phaseData.title,
                        description: phaseData.description,
                        startDate: phaseData.start_date,
                        endDate: phaseData.end_date,
                        weeks: phaseData.weeks,
                        progress: phaseData.progress,
                        status: phaseData.status,
                        leetCodeTarget: phaseData.leetcode_target,
                        leetCodeCompleted: phaseData.leetcode_completed,
                        topics: transformedTopics,
                        projects: transformedProjects
                    }
                    
                    setPhases(prevPhases => 
                        prevPhases.map(p => p.id === phaseId ? updatedPhase : p)
                    )
                }
            } else {
                // Delete from localStorage
        setPhases(phases.map(phase => {
            if (phase.id === phaseId) {
                return {
                    ...phase,
                    projects: phase.projects.filter(project => project.id !== projectId)
                }
            }
            return phase
        }))
            }
        } catch (err) {
            console.error('Error deleting project:', err)
            setError('Failed to delete project. Please try again.')
        }
    }

    const confirmResetAchievements = () => {
        setAchievements(prev => {
            // Reset all achievements to default state
            const resetAchievements = prev.map(a => ({ 
                ...a, 
                unlocked: false, 
                unlockedDate: undefined, 
                isActive: true 
            }))
            
            // Remove any dynamically generated achievements (keep only default ones)
            const defaultAchievementIds = getDefaultAchievements().map(a => a.id)
            const filteredAchievements = resetAchievements.filter(a => 
                defaultAchievementIds.includes(a.id)
            )
            
            return filteredAchievements
        })
        setAchievementUpdateTrigger(prev => prev + 1)
        setShowResetAchievementsModal(false)
    }

    const cancelResetAchievements = () => {
        setShowResetAchievementsModal(false)
    }

    const getPhaseStatusColor = (status: Phase['status']) => {
        switch (status) {
            case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/20'
            case 'in-progress': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20'
            case 'not-started': return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
        }
    }

    const getProgressColor = (progress: number) => {
        if (progress >= 80) return 'text-green-600'
        if (progress >= 60) return 'text-blue-600'
        if (progress >= 40) return 'text-yellow-600'
        return 'text-red-600'
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto p-8">
                <div className="flex items-center justify-center space-x-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading Dev Roadmap...</p>
                </div>
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className="max-w-7xl mx-auto p-8">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                        Error Loading Data
                    </h3>
                    <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
                    <div className="flex space-x-4">
                        <button
                            onClick={loadDataFromDatabase}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Retry Database
                        </button>

                        <button
                            onClick={loadDataFromLocalStorage}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                            Use LocalStorage
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 px-4 md:px-0">
            {/* Database Status Indicator */}
            {useDatabase && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-green-700 dark:text-green-300">
                                Connected to Database
                            </span>
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400 font-mono break-all">
                            <span className="hidden sm:inline">Debug: </span>H:{totalHours} | LC:{totalLeetCode} | S:{streak}
                        </div>
                    </div>
                </div>
            )}
            
            {/* Header Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
                <div className="p-4 md:p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center mb-3 md:mb-4">
                        <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400 mr-2 md:mr-3" />
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100 text-sm md:text-base">Total Hours</h3>
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-100 mb-1">{totalHours}</p>
                    <p className="text-xs md:text-sm text-blue-700 dark:text-blue-300">Hours invested</p>
                </div>

                <div className="p-4 md:p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="flex items-center mb-3 md:mb-4">
                        <Code className="w-5 h-5 md:w-6 md:h-6 text-green-600 dark:text-green-400 mr-2 md:mr-3" />
                        <h3 className="font-semibold text-green-900 dark:text-green-100 text-sm md:text-base">LeetCode Solved</h3>
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-green-900 dark:text-green-100 mb-1">{totalLeetCode}</p>
                    <p className="text-xs md:text-sm text-green-700 dark:text-green-300">Problems completed</p>
                </div>

                <div className="p-4 md:p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center mb-3 md:mb-4">
                        <Trophy className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400 mr-2 md:mr-3" />
                        <h3 className="font-semibold text-purple-900 dark:text-purple-100 text-sm md:text-base">Current Streak</h3>
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-purple-900 dark:text-purple-100 mb-1">{streak}</p>
                    <p className="text-xs md:text-sm text-purple-700 dark:text-purple-300">Days in a row</p>
                </div>

                <div className="p-4 md:p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center mb-3 md:mb-4">
                        <Target className="w-5 h-5 md:w-6 md:h-6 text-orange-600 dark:text-orange-400 mr-2 md:mr-3" />
                        <h3 className="font-semibold text-orange-900 dark:text-orange-100 text-sm md:text-base">Overall Progress</h3>
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-orange-900 dark:text-orange-100 mb-1">
                        {(() => {
                            if (phases.length === 0) return 0;
                            const totalProgress = phases.reduce((sum, p) => {
                                return sum + (p.progress || 0);
                            }, 0);
                            const average = Math.round(totalProgress / phases.length);
                            return average;
                        })()}%
                    </p>
                    <p className="text-xs md:text-sm text-orange-700 dark:text-orange-300">Journey completion</p>
                </div>

                <div className="p-4 md:p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-800 col-span-2 lg:col-span-1">
                    <div className="flex items-center mb-3 md:mb-4">
                        <Star className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400 mr-2 md:mr-3" />
                        <h3 className="font-semibold text-purple-900 dark:text-purple-100 text-sm md:text-base">Total Points</h3>
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-purple-900 dark:text-purple-100 mb-1">{totalPoints}</p>
                    <div className="flex items-center gap-2">
                        <span className="text-base md:text-lg">{currentLevel.icon}</span>
                        <p className="text-xs md:text-sm text-purple-700 dark:text-purple-300">{currentLevel.name} Level</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                <button
                    onClick={() => setShowProjectModal(true)}
                    className="flex items-center justify-center gap-2 px-4 py-3 md:py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium touch-manipulation"
                >
                    <Code className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-sm md:text-base">Add Project</span>
                </button>
                <button
                    onClick={() => setShowPointsDashboard(true)}
                    className="flex items-center justify-center gap-2 px-4 py-3 md:py-2.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium touch-manipulation"
                    title="View your points, level, and achievements"
                >
                    <Star className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-sm md:text-base">Points Dashboard</span>
                </button>
                <button
                    onClick={() => setShowStudyTimer(true)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 md:py-2.5 rounded-lg transition-colors font-medium touch-manipulation sm:col-span-2 lg:col-span-1 ${
                        isTimerRunning 
                            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                            : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                    }`}
                    title="Start a focused study session"
                >
                    <Clock className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-sm md:text-base">{isTimerRunning ? 'Timer Running' : 'Study Timer'}</span>
                </button>
            </div>

            {/* Gamification Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {/* Achievements */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-6">
                    <div className="flex flex-col space-y-3 sm:space-y-2 sm:flex-row sm:items-center justify-between mb-4">
                        <div className="flex items-center">
                            <Trophy className="w-5 h-5 md:w-6 md:h-6 text-yellow-600 dark:text-yellow-400 mr-2 md:mr-3" />
                            <h3 className="font-semibold text-gray-900 dark:text-white text-base md:text-lg">Achievements</h3>
                        </div>
                        <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 text-center sm:text-right" key={achievementUpdateTrigger}>
                            {achievements.filter(a => a.isActive && !a.unlocked).length} available • {achievements.filter(a => a.unlocked).length} completed
                        </span>
                    </div>
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                            💡 <strong>Tip:</strong> Some achievements require manual verification (like GitHub commits, blog posts, etc.). 
                            Click "Mark Complete" when you've done the activity!
                        </p>
                    </div>
                    {achievements.filter(a => a.isActive && !a.unlocked).length < 5 && (
                        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                                    ⚠️ <strong>Low on achievements!</strong> Only {achievements.filter(a => a.isActive && !a.unlocked).length} available.
                                </p>
                                <button
                                    onClick={() => {
                                        const newAchievement = generateNewAchievement()
                                        setAchievements(prev => [...prev, newAchievement])
                                        setAchievementUpdateTrigger(prev => prev + 1)
                                    }}
                                    className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                                >
                                    Generate New
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 md:max-h-96 overflow-y-auto">
                        {achievements.filter(a => a.isActive && !a.unlocked).map(achievement => {
                            const isExternalAchievement = ['github-commit', 'linkedin-post', 'blog-post', 'open-source', 'help-others', 'code-reviewer', 'conference-speaker', 'podcast-guest', 'tech-conference', 'hackathon-winner', 'startup-founder', 'tech-lead', 'cto'].includes(achievement.id)
                            
                            return (
                                <div 
                                    key={`available-${achievement.id}`} 
                                    className={`p-3 rounded-lg border transition-all duration-300 hover:shadow-md ${
                                        processingAchievement === achievement.id
                                            ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 scale-105 animate-pulse'
                                            : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600/50'
                                    }`}
                                >
                                    <div className="flex flex-col h-full">
                                        <div className="flex items-start gap-2 mb-2">
                                            <div className="relative flex-shrink-0">
                                                <span className="text-2xl">{achievement.icon}</span>
                                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-400 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                                    <span className="text-xs text-white">
                                                        {processingAchievement === achievement.id ? '⏳' : '🔒'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                                    {achievement.title}
                                                </h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-2">
                                                    {achievement.requirement}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                                                +{achievement.points} pts
                                            </span>
                                            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                                                {achievement.category}
                                            </span>
                                        </div>
                                        
                                        {isExternalAchievement && (
                                            <div className="mt-auto">
                                                <p className="text-xs text-orange-600 dark:text-orange-400 mb-2">
                                                    ⚠️ Manual verification required
                                                </p>
                                                <button
                                                    onClick={() => {
                                                        setProcessingAchievement(achievement.id)
                                                        
                                                        // Update the achievement to unlocked (don't generate new one for manual completion)
                                                        setAchievements(prev => {
                                                            const updated = prev.map(a => 
                                                                a.id === achievement.id 
                                                                    ? { ...a, unlocked: true, unlockedDate: new Date().toISOString().split('T')[0], isActive: false }
                                                                    : a
                                                            )
                                                            return updated
                                                        })
                                                        
                                                        // Trigger celebration and update
                                                        triggerCelebration(achievement)
                                                        setAchievementUpdateTrigger(prev => prev + 1)
                                                        
                                                        // Force a re-render to update counters
                                                        setTimeout(() => {
                                                            setAchievementUpdateTrigger(prev => prev + 1)
                                                        }, 100)
                                                        
                                                        // Clear processing state after a short delay
                                                        setTimeout(() => {
                                                            setProcessingAchievement(null)
                                                        }, 1000)
                                                        

                                                    }}
                                                    disabled={processingAchievement === achievement.id}
                                                    className={`w-full text-xs px-3 py-2 rounded-lg font-medium transition-colors ${
                                                        processingAchievement === achievement.id
                                                            ? 'bg-gray-400 cursor-not-allowed'
                                                            : 'bg-green-500 hover:bg-green-600'
                                                    } text-white`}
                                                >
                                                    {processingAchievement === achievement.id ? 'Processing...' : 'Mark Complete'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Completed Achievements */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-6">
                    <div className="flex flex-col space-y-3 sm:space-y-2 sm:flex-row sm:items-center justify-between mb-4">
                        <div className="flex items-center">
                            <Trophy className="w-5 h-5 md:w-6 md:h-6 text-yellow-600 dark:text-yellow-400 mr-2 md:mr-3" />
                            <h3 className="font-semibold text-gray-900 dark:text-white text-base md:text-lg">Completed Achievements</h3>
                            <span className="ml-2 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                                ({achievements.filter(a => a.unlocked).length})
                            </span>
                        </div>
                        <div className="flex items-center gap-2 justify-center sm:justify-end">
                            {achievements.filter(a => a.unlocked).length > 0 && (
                                <button
                                    onClick={() => setShowResetAchievementsModal(true)}
                                    className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                                    title="Reset all achievements to uncompleted status"
                                >
                                    Reset All
                                </button>
                            )}
                            <button
                                onClick={() => setShowCompletedAchievements(true)}
                                className="text-xs md:text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                View All
                            </button>
                        </div>
                    </div>
                    
                    {/* Enhanced Completed Achievements Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 md:max-h-96 overflow-y-auto">
                        {achievements.filter(a => a.unlocked).map(achievement => (
                            <div key={`completed-${achievement.id}`} className="flex flex-col p-3 bg-gradient-to-br from-yellow-400 to-orange-400 dark:from-yellow-500 dark:to-orange-500 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="relative">
                                        <span className="text-2xl">{achievement.icon}</span>
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                            <span className="text-xs text-white">✅</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-white truncate">
                                            {achievement.title}
                                        </h4>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-xs text-white opacity-90">
                                    <span className="font-semibold">+{achievement.points} pts</span>
                                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs font-medium">
                                        {achievement.category}
                                    </span>
                                </div>
                                {achievement.unlockedDate && (
                                    <p className="text-xs text-white opacity-75 mt-1">
                                        Unlocked {achievement.unlockedDate}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                    
                    {achievements.filter(a => a.unlocked).length === 0 && (
                        <div className="text-center py-8">
                            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                                No achievements unlocked yet
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                Start your journey to unlock amazing achievements!
                            </p>
                        </div>
                    )}
                    
                    {/* Achievement Progress Summary */}
                    {achievements.filter(a => a.unlocked).length > 0 && (
                        <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-green-700 dark:text-green-300 font-medium">
                                    🎉 Progress Summary
                                </span>
                                <span className="text-green-600 dark:text-green-400 font-bold">
                                    {achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0)} total points
                                </span>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div 
                                        className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                                        style={{ 
                                            width: `${(achievements.filter(a => a.unlocked).length / achievements.length) * 100}%` 
                                        }}
                                    ></div>
                                </div>
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                    {Math.round((achievements.filter(a => a.unlocked).length / achievements.length) * 100)}%
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Phases */}
            <div className="space-y-4 md:space-y-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white px-2 md:px-0">Development Roadmap</h2>
                
                {phases.map(phase => (
                    <div key={phase.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {/* Phase Header */}
                        <div 
                            className="p-4 md:p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors touch-manipulation"
                            onClick={() => setExpandedPhase(expandedPhase === phase.id ? '' : phase.id)}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                                <div className="flex items-start sm:items-center gap-3 md:gap-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Code className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                                            {phase.title}
                                        </h3>
                                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            {phase.description}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
                                            <span className="text-xs text-gray-500">
                                                {phase.startDate} - {phase.endDate}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {phase.weeks} weeks
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPhaseStatusColor(phase.status)}`}>
                                                {phase.status.replace('-', ' ')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-4">
                                    <div className="text-left sm:text-right">
                                        <p className={`text-lg font-bold ${getProgressColor(phase.progress)}`}>
                                            {phase.progress}%
                                        </p>
                                        <p className="text-xs text-gray-500">Complete</p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        {expandedPhase === phase.id ? (
                                            <ChevronDown className="w-5 h-5 text-gray-500" />
                                        ) : (
                                            <ChevronRight className="w-5 h-5 text-gray-500" />
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="mt-4">
                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    <span>Progress</span>
                                    <span>{phase.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div 
                                        className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${phase.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Expanded Content */}
                        {expandedPhase === phase.id && (
                            <div className="border-t border-gray-200 dark:border-gray-700 p-4 md:p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                                    {/* Topics */}
                                    <div>
                                        <h4 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                            <BookOpen className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                                            Learning Topics
                                        </h4>
                                        <div className="space-y-3">
                                            {phase.topics.map(topic => (
                                                <div key={topic.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg touch-manipulation">
                                                    <button
                                                        onClick={() => toggleTopicCompletion(phase.id, topic.id)}
                                                        className="flex-shrink-0 p-1 -m-1 touch-manipulation"
                                                    >
                                                        {topic.completed ? (
                                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                        ) : (
                                                            <Circle className="w-5 h-5 text-gray-400" />
                                                        )}
                                                    </button>
                                                    <div className="flex-1 min-w-0">
                                                        <h5 className="font-medium text-gray-900 dark:text-white text-sm md:text-base">
                                                            {topic.name}
                                                        </h5>
                                                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                            {topic.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Projects */}
                                    <div>
                                        <h4 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                            <Code className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                                            Projects
                                        </h4>
                                        <div className="space-y-3">
                                                                                         {phase.projects.map(project => (
                                                 <div key={project.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                     <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                                                         <h5 className="font-medium text-gray-900 dark:text-white text-sm md:text-base flex-1">
                                                             {project.name}
                                                         </h5>
                                                         <div className="flex items-center gap-2 flex-shrink-0">
                                                             <select
                                                                 value={project.status}
                                                                 onChange={(e) => updateProjectStatus(phase.id, project.id, e.target.value as Project['status'])}
                                                                 className="text-xs px-2 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 min-w-0"
                                                             >
                                                                 <option value="not-started">Not Started</option>
                                                                 <option value="in-progress">In Progress</option>
                                                                 <option value="completed">Completed</option>
                                                             </select>
                                                             {project.isCustom && (
                                                                 <button
                                                                     onClick={() => deleteProject(phase.id, project.id)}
                                                                     className="p-1.5 text-gray-400 hover:text-red-500 rounded transition-colors touch-manipulation"
                                                                     aria-label="Delete project"
                                                                     title="Delete project"
                                                                 >
                                                                     <Trash2 className="w-3.5 h-3.5" />
                                                                 </button>
                                                             )}
                                                         </div>
                                                     </div>
                                                     <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                         {project.description}
                                                     </p>
                                                     <div className="flex flex-wrap gap-1.5">
                                                         {project.technologies.map(tech => (
                                                             <span key={tech} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-xs rounded">
                                                                 {tech}
                                                             </span>
                                                         ))}
                                                     </div>
                                                 </div>
                                             ))}
                                        </div>
                                    </div>
                                </div>


                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                <div className="space-y-3 md:space-y-4">
                    {dailyLogs.slice(0, 5).map(log => (
                        <div key={log.id} className="flex items-start gap-3 md:gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-4 h-4 md:w-5 md:h-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 dark:text-white text-sm md:text-base">
                                    {new Date(log.date).toLocaleDateString()}
                                </p>
                                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                                    {log.hoursSpent} hours • {log.leetCodeProblems} LeetCode problems
                                </p>
                                {log.keyTakeaway && (
                                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                        💡 {log.keyTakeaway}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                    {dailyLogs.length === 0 && (
                        <div className="text-center py-8 md:py-12">
                            <Calendar className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base mb-2">
                                No activity logged yet
                            </p>
                            <p className="text-xs md:text-sm text-gray-400 dark:text-gray-500">
                                Start your journey by logging today's progress!
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Daily Log Modal */}
            {showLogModal && (
                <DailyLogModal 
                    onClose={() => setShowLogModal(false)}
                    onSave={addDailyLog}
                    phases={phases}
                    initialData={formData}
                />
            )}

            {/* Project Modal */}
            {showProjectModal && (
                <ProjectModal
                    onClose={() => setShowProjectModal(false)}
                    onSave={addProject}
                    newProject={newProject}
                    setNewProject={setNewProject}
                    phases={phases}
                />
            )}

            {/* Achievement Celebration Modal */}
            {showCelebration && celebratedAchievement && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-8 text-center animate-bounce">
                        <div className="text-6xl mb-4">🎉</div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Achievement Unlocked!
                        </h2>
                        <div className="text-4xl mb-4">{celebratedAchievement.icon}</div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                            {celebratedAchievement.title}
                        </h3>
                        <p className="text-white mb-4">
                            {celebratedAchievement.description}
                        </p>
                        <div className="bg-white bg-opacity-20 rounded-lg p-3">
                            <p className="text-white font-bold">
                                +{celebratedAchievement.points} Points!
                            </p>
                            <p className="text-white text-sm opacity-90">
                                Total: {totalPoints} points • {currentLevel.name} Level
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Multiple Achievements Notification */}
            {showMultipleNotification && multipleAchievements.length > 0 && (
                <div className="fixed top-4 right-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-4 text-white shadow-lg z-50 animate-slide-in">
                    <div className="flex items-center gap-3">
                        <div className="text-2xl">🎉</div>
                        <div>
                            <h4 className="font-bold text-lg">
                                {multipleAchievements.length} Achievements Unlocked!
                            </h4>
                            <p className="text-sm opacity-90">
                                Total: +{multipleAchievements.reduce((sum, a) => sum + a.points, 0)} points
                            </p>
                        </div>
                    </div>
                    <div className="mt-2 text-xs opacity-75">
                        Check your completed achievements to see all of them!
                    </div>
                </div>
            )}

            {/* Points Dashboard Modal */}
            {showPointsDashboard && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-8 w-full max-w-4xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Points Dashboard</h2>
                            <button
                                onClick={() => setShowPointsDashboard(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Level Display */}
                        <div className={`mb-8 p-6 rounded-xl bg-gradient-to-r ${currentLevel.color} text-white`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-4xl">{currentLevel.icon}</span>
                                        <h3 className="text-2xl font-bold">{currentLevel.name} Level</h3>
                                    </div>
                                    <p className="text-lg opacity-90">Total Points: {totalPoints}</p>
                                    {pointsToNextLevel > 0 && (
                                        <p className="text-sm opacity-75 mt-1">
                                            {pointsToNextLevel} points to {nextLevel.name} Level
                                        </p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold">{totalPoints}</div>
                                    <div className="text-sm opacity-75">POINTS</div>
                                </div>
                            </div>
                        </div>

                        {/* Points Breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Points by Category</h3>
                                <div className="space-y-3">
                                    {Object.entries(
                                        achievements
                                            .filter(a => a.unlocked)
                                            .reduce((acc, a) => {
                                                acc[a.category] = (acc[a.category] || 0) + a.points;
                                                return acc;
                                            }, {} as Record<string, number>)
                                    )
                                        .sort(([,a], [,b]) => b - a)
                                        .map(([category, points]) => (
                                            <div key={category} className="flex items-center justify-between">
                                                <span className="capitalize text-gray-600 dark:text-gray-300">{category}</span>
                                                <span className="font-semibold text-gray-900 dark:text-white">{points}</span>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Achievements</h3>
                                <div className="space-y-3">
                                    {achievements
                                        .filter(a => a.unlocked)
                                        .sort((a, b) => new Date(b.unlockedDate || '').getTime() - new Date(a.unlockedDate || '').getTime())
                                        .slice(0, 5)
                                        .map(achievement => (
                                            <div key={`recent-${achievement.id}`} className="flex items-center gap-3">
                                                <span className="text-xl">{achievement.icon}</span>
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900 dark:text-white">{achievement.title}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">+{achievement.points} points</p>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>

                        {/* Level Progression */}
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Level Progression</h3>
                            <div className="space-y-4">
                                {[
                                    { name: 'Bronze', points: 0, icon: '🥉' },
                                    { name: 'Silver', points: 501, icon: '🥈' },
                                    { name: 'Gold', points: 1501, icon: '🥇' },
                                    { name: 'Platinum', points: 3001, icon: '🥇' },
                                    { name: 'Diamond', points: 5000, icon: '💎' }
                                ].map((level, index) => {
                                    const isCurrent = level.name === currentLevel.name;
                                    const isCompleted = totalPoints >= level.points;
                                    const isNext = !isCompleted && index > 0 && totalPoints >= (index > 0 ? [0, 501, 1501, 3001, 5000][index - 1] : 0);
                                    
                                    return (
                                        <div key={level.name} className={`flex items-center gap-4 p-3 rounded-lg ${
                                            isCurrent ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white' :
                                            isCompleted ? 'bg-green-100 dark:bg-green-900/20' :
                                            isNext ? 'bg-blue-100 dark:bg-blue-900/20' :
                                            'bg-gray-100 dark:bg-gray-600/20'
                                        }`}>
                                            <span className="text-2xl">{level.icon}</span>
                                            <div className="flex-1">
                                                <p className="font-medium">{level.name} Level</p>
                                                <p className="text-sm opacity-75">{level.points} points required</p>
                                            </div>
                                            {isCurrent && <span className="text-sm font-bold">CURRENT</span>}
                                            {isCompleted && <span className="text-green-600 dark:text-green-400">✓</span>}
                                            {isNext && <span className="text-blue-600 dark:text-blue-400">NEXT</span>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Study Timer Modal */}
            {showStudyTimer && (
                <StudyTimerModal 
                    onClose={() => setShowStudyTimer(false)}
                    isTimerRunning={isTimerRunning}
                    timeRemaining={timeRemaining}
                    completedSessions={completedSessions}
                    onStart={startTimer}
                    onPause={pauseTimer}
                    onReset={resetTimer}
                />
            )}

            {/* Reset Achievements Confirmation Modal */}
            {showResetAchievementsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                                <Trophy className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reset Achievements</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone</p>
                            </div>
                        </div>
                        
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-6">
                            <p className="text-red-800 dark:text-red-200 font-medium">Warning: This will reset all achievements!</p>
                            <ul className="text-sm text-red-700 dark:text-red-300 mt-2 space-y-1">
                                <li>• All unlocked achievements will be locked</li>
                                <li>• Progress dates will be cleared</li>
                                <li>• Points will be reset to 0</li>
                                <li>• You'll need to earn them again</li>
                            </ul>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={confirmResetAchievements}
                                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Reset Achievements
                            </button>
                            <button
                                onClick={cancelResetAchievements}
                                className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Completed Achievements Modal */}
            {showCompletedAchievements && (
                <CompletedAchievementsModal
                    onClose={() => setShowCompletedAchievements(false)}
                    achievements={achievements}
                />
            )}

        </div>
    )
}

// Daily Log Modal Component
const DailyLogModal = ({ onClose, onSave, phases, initialData }: {
    onClose: () => void
    onSave: (log: Omit<DailyLog, 'id'>) => void
    phases: Phase[]
    initialData?: {
        phaseId: string
        topicId: string
        projectId: string
        hoursSpent: number
        activities: string
        leetCodeProblems: number
        keyTakeaway: string
    }
}) => {
    const [formData, setFormData] = useState({
        phaseId: initialData?.phaseId || phases[0]?.id || '',
        topicId: initialData?.topicId || '',
        projectId: initialData?.projectId || '',
        hoursSpent: initialData?.hoursSpent || 0,
        activities: initialData?.activities || '',
        leetCodeProblems: initialData?.leetCodeProblems || 0,
        keyTakeaway: initialData?.keyTakeaway || ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave({
            date: new Date().toISOString().split('T')[0],
            ...formData,
            activities: formData.activities.split('\n').filter(a => a.trim()),
            nextUp: '' // Default empty value since we removed this field
        })
    }

    const selectedPhase = phases.find(p => p.id === formData.phaseId)

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 w-full max-w-2xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                        Log Today's Progress
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Phase
                            </label>
                            <select
                                value={formData.phaseId}
                                onChange={(e) => setFormData({ ...formData, phaseId: e.target.value })}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                {phases.map(phase => (
                                    <option key={phase.id} value={phase.id}>
                                        {phase.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Hours Spent
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="24"
                                step="0.5"
                                value={formData.hoursSpent}
                                onChange={(e) => setFormData({ ...formData, hoursSpent: parseFloat(e.target.value) || 0 })}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                LeetCode Problems Solved
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.leetCodeProblems}
                                onChange={(e) => setFormData({ ...formData, leetCodeProblems: parseInt(e.target.value) || 0 })}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Topic (Optional)
                            </label>
                            <select
                                value={formData.topicId}
                                onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value="">Select a topic</option>
                                {selectedPhase?.topics.map(topic => (
                                    <option key={topic.id} value={topic.id}>
                                        {topic.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Activities (One per line)
                        </label>
                        <textarea
                            value={formData.activities}
                            onChange={(e) => setFormData({ ...formData, activities: e.target.value })}
                            placeholder="What did you work on today?"
                            rows={3}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Key Takeaway
                        </label>
                        <input
                            type="text"
                            value={formData.keyTakeaway}
                            onChange={(e) => setFormData({ ...formData, keyTakeaway: e.target.value })}
                            placeholder="One important thing you learned today"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>



                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            Save Progress
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// Project Modal Component

const ProjectModal = ({ onClose, onSave, newProject, setNewProject, phases }: {
    onClose: () => void
    onSave: () => void
    newProject: { name: string; description: string; technologies: string; phaseId: string }
    setNewProject: (project: { name: string; description: string; technologies: string; phaseId: string }) => void
    phases: Phase[]
}) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave()
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 w-full max-w-2xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                        Add New Project
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Project Name
                        </label>
                        <input
                            type="text"
                            value={newProject.name}
                            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                            placeholder="Enter project name"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description
                        </label>
                        <textarea
                            value={newProject.description}
                            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                            placeholder="Describe your project"
                            rows={3}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Technologies (comma-separated)
                        </label>
                        <input
                            type="text"
                            value={newProject.technologies}
                            onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                            placeholder="React, TypeScript, Node.js"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Phase
                        </label>
                        <select
                            value={newProject.phaseId}
                            onChange={(e) => setNewProject({ ...newProject, phaseId: e.target.value })}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            {phases.map(phase => (
                                <option key={phase.id} value={phase.id}>
                                    {phase.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Add Project
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 sm:py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// Study Timer Modal Component
const StudyTimerModal = ({ 
    onClose, 
    isTimerRunning, 
    timeRemaining, 
    completedSessions,
    onStart, 
    onPause, 
    onReset 
}: {
    onClose: () => void
    isTimerRunning: boolean
    timeRemaining: number
    completedSessions: number
    onStart: (durationMinutes: number) => void
    onPause: () => void
    onReset: () => void
}) => {
    const [selectedDuration, setSelectedDuration] = useState(25)
    const [customMinutes, setCustomMinutes] = useState('')
    const [showCustomInput, setShowCustomInput] = useState(false)

    const presetDurations = [
        { label: '25 min', value: 25 },
        { label: '30 min', value: 30 },
        { label: '1 hour', value: 60 },
        { label: '2 hours', value: 120 },
        { label: '3 hours', value: 180 },
        { label: '4 hours', value: 240 }
    ]

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60
        
        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        }
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const handleStart = () => {
        const duration = showCustomInput ? parseInt(customMinutes) || 25 : selectedDuration
        onStart(duration)
    }

    return (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
            <div className="w-full h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 md:p-6 text-white">
                    <h1 className="text-xl md:text-2xl font-bold">Study Timer</h1>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 md:w-8 md:h-8" />
                    </button>
                </div>

                {/* Main Timer Display */}
                <div className="flex-1 flex flex-col items-center justify-center">
                    {/* Flip Clock Style Timer */}
                    <div className="mb-8">
                        <div className="flex items-center justify-center space-x-2 md:space-x-6">
                            {formatTime(timeRemaining).split('').map((char, index) => (
                                <div key={index} className="relative">
                                    {char === ':' ? (
                                        <div className="text-4xl md:text-9xl font-mono text-white mx-2 md:mx-6">:</div>
                                    ) : (
                                        <div className={`
                                            w-16 h-20 md:w-48 md:h-64 bg-gray-800 border border-gray-700 rounded-lg md:rounded-2xl
                                            flex items-center justify-center
                                            ${isTimerRunning ? 'bg-gray-700 border-gray-600' : 'bg-gray-800 border-gray-700'}
                                        `}>
                                            <span className="text-3xl md:text-9xl font-mono font-bold text-white">
                                                {char}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Status */}
                    <div className="text-center mb-8">
                        <p className={`text-lg md:text-2xl font-medium ${isTimerRunning ? 'text-green-400' : 'text-gray-400'}`}>
                            {isTimerRunning ? 'FOCUS TIME' : 'READY TO START'}
                        </p>
                        <p className="text-gray-500 mt-2 text-sm md:text-base">
                            {completedSessions} sessions completed today
                        </p>
                    </div>

                    {/* Duration Selection (when not running) */}
                    {!isTimerRunning && (
                        <div className="mb-8">
                            <div className="flex flex-wrap gap-3 justify-center mb-4">
                                {presetDurations.map((preset) => (
                                    <button
                                        key={preset.value}
                                        onClick={() => {
                                            setSelectedDuration(preset.value)
                                            setShowCustomInput(false)
                                        }}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                            selectedDuration === preset.value && !showCustomInput
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                    >
                                        {preset.label}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setShowCustomInput(true)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        showCustomInput
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                >
                                    Custom
                                </button>
                            </div>

                            {showCustomInput && (
                                <div className="flex items-center justify-center gap-3">
                                    <input
                                        type="number"
                                        value={customMinutes}
                                        onChange={(e) => setCustomMinutes(e.target.value)}
                                        placeholder="Enter minutes"
                                        className="w-32 px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                                        min="1"
                                        max="480"
                                    />
                                    <span className="text-gray-400">minutes</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Controls */}
                    <div className="flex gap-6">
                        {!isTimerRunning ? (
                            <button 
                                onClick={handleStart} 
                                className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-lg transition-colors"
                            >
                                START SESSION
                            </button>
                        ) : (
                            <button 
                                onClick={onPause} 
                                className="px-8 py-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-bold text-lg transition-colors"
                            >
                                PAUSE
                            </button>
                        )}
                        <button 
                            onClick={onReset} 
                            className="px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-bold text-lg transition-colors"
                        >
                            RESET
                        </button>
                    </div>

                    {/* Info */}
                    <div className="mt-8 text-center text-gray-400 text-sm">
                        💡 When timer completes, it will automatically log your progress!
                    </div>
                </div>
            </div>
        </div>
    )
}

// Completed Achievements Modal
const CompletedAchievementsModal = ({ 
    onClose, 
    achievements 
}: {
    onClose: () => void
    achievements: Achievement[]
}) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [sortBy, setSortBy] = useState<'date' | 'points' | 'name'>('date')
    
    const completedAchievements = achievements.filter(a => a.unlocked)
    const categories = ['all', ...Array.from(new Set(completedAchievements.map(a => a.category)))]
    
    const filteredAchievements = completedAchievements.filter(a => 
        selectedCategory === 'all' || a.category === selectedCategory
    )
    
    const sortedAchievements = [...filteredAchievements].sort((a, b) => {
        switch (sortBy) {
            case 'points':
                return b.points - a.points
            case 'name':
                return a.title.localeCompare(b.title)
            case 'date':
            default:
                return new Date(b.unlockedDate || '').getTime() - new Date(a.unlockedDate || '').getTime()
        }
    })
    
    const totalPoints = completedAchievements.reduce((sum, a) => sum + a.points, 0)
    const completionPercentage = Math.round((completedAchievements.length / achievements.length) * 100)
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl max-w-6xl w-full max-h-[98vh] md:max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Trophy className="w-6 h-6 md:w-8 md:h-8 text-yellow-600 dark:text-yellow-400" />
                            <div>
                                <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                                    Completed Achievements
                                </h2>
                                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                                    {completedAchievements.length} of {achievements.length} achievements unlocked
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors touch-manipulation self-end sm:self-auto"
                        >
                            <X className="w-5 h-5 md:w-6 md:h-6 text-gray-500" />
                        </button>
                    </div>
                    
                    {/* Stats */}
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-3 md:p-4 rounded-lg">
                            <div className="flex items-center gap-2">
                                <span className="text-xl md:text-2xl">🏆</span>
                                <div>
                                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Total Points</p>
                                    <p className="text-lg md:text-2xl font-bold text-green-600 dark:text-green-400">{totalPoints}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-3 md:p-4 rounded-lg">
                            <div className="flex items-center gap-2">
                                <span className="text-xl md:text-2xl">📊</span>
                                <div>
                                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Completion</p>
                                    <p className="text-lg md:text-2xl font-bold text-blue-600 dark:text-blue-400">{completionPercentage}%</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-3 md:p-4 rounded-lg sm:col-span-3 md:col-span-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xl md:text-2xl">🎯</span>
                                <div>
                                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Categories</p>
                                    <p className="text-lg md:text-2xl font-bold text-purple-600 dark:text-purple-400">
                                        {Array.from(new Set(completedAchievements.map(a => a.category))).length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Filters */}
                <div className="p-3 md:p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex-shrink-0">
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
                            <label className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Category:</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-xs md:text-sm w-full sm:w-auto min-w-0"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
                            <label className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Sort by:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as 'date' | 'points' | 'name')}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-xs md:text-sm w-full sm:w-auto min-w-0"
                            >
                                <option value="date">Date Unlocked</option>
                                <option value="points">Points</option>
                                <option value="name">Name</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                {/* Achievements Grid */}
                <div className="flex-1 overflow-y-auto p-3 md:p-6">
                    {sortedAchievements.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                            {sortedAchievements.map(achievement => (
                                <div key={`modal-${achievement.id}`} className="bg-gradient-to-br from-yellow-400 to-orange-400 dark:from-yellow-500 dark:to-orange-500 rounded-lg md:rounded-xl p-3 md:p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 touch-manipulation">
                                    <div className="flex items-start gap-2 md:gap-3">
                                        <div className="relative flex-shrink-0">
                                            <span className="text-2xl md:text-3xl">{achievement.icon}</span>
                                            <div className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                <span className="text-xs text-white">✅</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-white text-sm md:text-lg mb-1 line-clamp-2">
                                                {achievement.title}
                                            </h3>
                                            <p className="text-white opacity-90 text-xs md:text-sm mb-2 line-clamp-2">
                                                {achievement.description}
                                            </p>
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs font-medium text-white truncate">
                                                    {achievement.category}
                                                </span>
                                                <span className="text-white font-bold text-sm md:text-lg whitespace-nowrap">
                                                    +{achievement.points}
                                                </span>
                                            </div>
                                            {achievement.unlockedDate && (
                                                <p className="text-white opacity-75 text-xs mt-2">
                                                    Unlocked: {achievement.unlockedDate}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 md:py-12 px-4">
                            <Trophy className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-3 md:mb-4" />
                            <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg mb-2">
                                No achievements in this category
                            </p>
                            <p className="text-gray-400 dark:text-gray-500 text-sm md:text-base">
                                Try selecting a different category or sort option
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DevRoadmap 