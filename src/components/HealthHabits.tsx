import React, { useState, useEffect } from 'react';
import { 
    Calendar, 
    Circle, 
    Trash2, 
    ShoppingCart, 
    Apple, 
    Droplets, 
    Moon, 
    Smile, 
    Trophy,
    Heart,
    Dumbbell,
    Clock,
    TrendingUp,
    Target,
    Plus,
    CheckCircle,
    Star,
    Map
} from 'lucide-react';
import { saveHealthHabits, getTodayHealthData, getUserPreference, setUserPreference } from '../lib/database';

import ActivityTracker from './ActivityTracker';

interface GymDay {
    date: string;
    completed: boolean;
    workoutType?: 'cardio' | 'strength' | 'flexibility' | 'sports' | 'other';
    duration?: number; // in minutes
}

interface ShoppingItem {
    id: string;
    name: string;
    completed: boolean;
    category: 'proteins' | 'vegetables' | 'fruits' | 'grains' | 'dairy' | 'other';
    priority: 'low' | 'medium' | 'high';
}

interface HealthMetric {
    id: string;
    name: string;
    value: number;
    unit: string;
    date: string;
    target?: number;
    trend?: 'up' | 'down' | 'stable';
}

interface MoodEntry {
    id: string;
    date: string;
    mood: 'excellent' | 'good' | 'okay' | 'bad' | 'terrible';
    notes?: string;
}

interface WaterIntake {
    id: string;
    date: string;
    glasses: number;
    target: number;
    scheduledIntakes: ScheduledWaterIntake[];
}

interface ScheduledWaterIntake {
    id: string;
    time: string;
    action: string;
    completed: boolean;
    glasses: number;
}

interface SleepEntry {
    id: string;
    date: string;
    hours: number;
    quality: 'excellent' | 'good' | 'fair' | 'poor';
    notes?: string;
}

interface WeeklyHealthTask {
    id: string;
    name: string;
    description: string;
    completed: boolean;
    category: 'cleaning' | 'checkup' | 'self-care' | 'preparation';
    icon: string;
}

const HealthHabits: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'gym' | 'food' | 'health'>('gym');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [gymDays, setGymDays] = useState<GymDay[]>([]);
    const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
    const [newShoppingItem, setNewShoppingItem] = useState('');
    const [shoppingCategory, setShoppingCategory] = useState<ShoppingItem['category']>('other');
    const [shoppingPriority, setShoppingPriority] = useState<ShoppingItem['priority']>('medium');
    const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
    const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
    const [waterIntake, setWaterIntake] = useState<WaterIntake[]>([]);
    const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([]);
    const [showAddMetric, setShowAddMetric] = useState(false);
    const [showAddMood, setShowAddMood] = useState(false);
    const [showWorkoutModal, setShowWorkoutModal] = useState(false);
    const [selectedWorkoutDay, setSelectedWorkoutDay] = useState<GymDay | null>(null);
    const [newMetric, setNewMetric] = useState({ name: '', value: '', unit: '', target: '' });
    const [newMood, setNewMood] = useState({ mood: 'good' as MoodEntry['mood'], notes: '' });
    const [newWorkout, setNewWorkout] = useState({
        workoutType: 'cardio' as GymDay['workoutType'],
        duration: ''
    });
    // const [todayWater, setTodayWater] = useState(0);
    const [todaySleep, setTodaySleep] = useState({ hours: 8, quality: 'good' as SleepEntry['quality'], notes: '' });
  
  
    const [sleepHistoryPage, setSleepHistoryPage] = useState(0);
    const [weeklyHealthTasks, setWeeklyHealthTasks] = useState<WeeklyHealthTask[]>([
        {
            id: '1',
            name: 'Clean the fridge',
            description: 'Take stock of what you still have and throw out anything that\'s gone bad during the week.',
            completed: false,
            category: 'cleaning',
            icon: '🧹'
        },
        {
            id: '2',
            name: 'Self-care session',
            description: 'Dedicate time for relaxation, meditation, or any activity that helps you recharge.',
            completed: false,
            category: 'self-care',
            icon: '🧘'
        },
        {
            id: '3',
            name: 'Check health metrics',
            description: 'Review and update your health tracking data (weight, blood pressure, etc.).',
            completed: false,
            category: 'checkup',
            icon: '📊'
        },
        {
            id: '4',
            name: 'Take daily vitamin',
            description: 'Ensure you take your daily vitamin supplement to maintain good health.',
            completed: false,
            category: 'checkup',
            icon: '💊'
        },
        {
            id: '5',
            name: 'Take fruits daily',
            description: 'Include fresh fruits in your daily diet for essential vitamins and nutrients.',
            completed: false,
            category: 'self-care',
            icon: '🍎'
        },
        {
            id: '6',
            name: 'Spend at least 30min in nature',
            description: 'Get outside and spend time in nature for mental and physical well-being.',
            completed: false,
            category: 'self-care',
            icon: '🌳'
        }
    ]);

    // Load data from database on component mount
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                // Use the optimized function to get all today's data
                const healthData = await getTodayHealthData();
                
                // Set all data from database
                setGymDays(healthData.gym || []);
                setShoppingList(healthData.shopping || []);
                setHealthMetrics(healthData.metrics || []);
                setMoodEntries(healthData.mood || []);
                setWaterIntake(healthData.water || []);
                setSleepEntries(healthData.sleep || []);
                setWeeklyHealthTasks(healthData.weeklyTasks || [
                    // Default weekly tasks if none exist
                    {
                        id: '1',
                        name: 'Clean the fridge',
                        description: 'Take stock of what you still have and throw out anything that\'s gone bad during the week.',
                        completed: false,
                        category: 'cleaning',
                        icon: '🧹'
                    },
                    {
                        id: '2',
                        name: 'Self-care session',
                        description: 'Dedicate time for relaxation, meditation, or any activity that helps you recharge.',
                        completed: false,
                        category: 'self-care',
                        icon: '🧘'
                    },
                    {
                        id: '3',
                        name: 'Check health metrics',
                        description: 'Review and update your health tracking data (weight, blood pressure, etc.).',
                        completed: false,
                        category: 'checkup',
                        icon: '📊'
                    },
                    {
                        id: '4',
                        name: 'Take daily vitamin',
                        description: 'Ensure you take your daily vitamin supplement to maintain good health.',
                        completed: false,
                        category: 'checkup',
                        icon: '💊'
                    },
                    {
                        id: '5',
                        name: 'Take fruits daily',
                        description: 'Include fresh fruits in your daily diet for essential vitamins and nutrients.',
                        completed: false,
                        category: 'self-care',
                        icon: '🍎'
                    },
                    {
                        id: '6',
                        name: 'Spend at least 30min in nature',
                        description: 'Get outside and spend time in nature for mental and physical well-being.',
                        completed: false,
                        category: 'self-care',
                        icon: '🌳'
                    }
                ]);
                

                setIsDataLoaded(true);
                
            } catch (error) {
                console.error('❌ Error loading health data:', error);
                setError('Failed to load health data from database');
            } finally {
                setIsLoading(false);
            }
        };
        
        loadData();



        // Check and reset weekly tasks if it's the beginning of a new week
        checkAndResetWeeklyTasks();
        
        // Check and reset water intakes daily (after data is loaded)
        setTimeout(() => {
    
            checkAndResetWaterIntakes();
        }, 100);
    }, []);

    // Save data to database whenever it changes (only after initial load)
    useEffect(() => {
        if (!isDataLoaded) return; // Don't save during initial load
        
        const saveGymData = async () => {
            try {
                await saveHealthHabits('gym', gymDays, new Date().toISOString().split('T')[0]);
    
            } catch (error) {
                console.error('Error saving gym data:', error);
                setError('Failed to save gym data');
            }
        };
        saveGymData();
    }, [gymDays, isDataLoaded]);

    useEffect(() => {
        if (!isDataLoaded) return;
        
        const saveShoppingData = async () => {
            try {
                await saveHealthHabits('shopping', shoppingList, new Date().toISOString().split('T')[0]);
    
            } catch (error) {
                console.error('Error saving shopping data:', error);
                setError('Failed to save shopping data');
            }
        };
        saveShoppingData();
    }, [shoppingList, isDataLoaded]);

    useEffect(() => {
        if (!isDataLoaded) return;
        
        const saveMetricsData = async () => {
            try {
                await saveHealthHabits('metrics', healthMetrics, new Date().toISOString().split('T')[0]);
    
            } catch (error) {
                console.error('Error saving metrics data:', error);
                setError('Failed to save health metrics');
            }
        };
        saveMetricsData();
    }, [healthMetrics, isDataLoaded]);

    useEffect(() => {
        if (!isDataLoaded) return;
        
        const saveMoodData = async () => {
            try {
                await saveHealthHabits('mood', moodEntries, new Date().toISOString().split('T')[0]);
    
            } catch (error) {
                console.error('Error saving mood data:', error);
                setError('Failed to save mood data');
            }
        };
        saveMoodData();
    }, [moodEntries, isDataLoaded]);

    useEffect(() => {
        if (!isDataLoaded) return;
        
        const saveWaterData = async () => {
            try {
                await saveHealthHabits('water', waterIntake, new Date().toISOString().split('T')[0]);

            } catch (error) {
                console.error('Error saving water data:', error);
                setError('Failed to save water intake');
            }
        };
        saveWaterData();
    }, [waterIntake, isDataLoaded]);

    useEffect(() => {
        if (!isDataLoaded) return;
        
        const saveSleepData = async () => {
            try {
                await saveHealthHabits('sleep', sleepEntries, new Date().toISOString().split('T')[0]);
    
            } catch (error) {
                console.error('Error saving sleep data:', error);
                setError('Failed to save sleep data');
            }
        };
        saveSleepData();
    }, [sleepEntries, isDataLoaded]);

    useEffect(() => {
        if (!isDataLoaded) return;
        
        const saveWeeklyTasksData = async () => {
            try {
                await saveHealthHabits('weekly_tasks', weeklyHealthTasks, new Date().toISOString().split('T')[0]);
    
            } catch (error) {
                console.error('Error saving weekly tasks data:', error);
                setError('Failed to save weekly tasks');
            }
        };
        saveWeeklyTasksData();
    }, [weeklyHealthTasks, isDataLoaded]);

    // Initialize gym days for the current week
    const initializeGymWeek = () => {
        const today = new Date();
        const weekDays: GymDay[] = [];
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - today.getDay() + i);
            const dateString = date.toISOString().split('T')[0];
            
            // Check if this day already exists
            const existingDay = gymDays.find(day => day.date === dateString);
            if (!existingDay) {
                weekDays.push({
                    date: dateString,
                    completed: false
                });
            }
        }
        
        setGymDays(prev => [...prev, ...weekDays]);
    };



    // Get current gym streak (FIXED)
    const getCurrentStreak = () => {
        // Sort days by date (newest first)
        const sortedDays = [...gymDays].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        let streak = 0;
        
        // Find the most recent completed day
        const mostRecentCompleted = sortedDays.find(day => day.completed);
        
        if (!mostRecentCompleted) {
            return 0; // No completed workouts
        }
        
        // Start from the most recent completed day and go backwards
        const startDate = new Date(mostRecentCompleted.date);
        
        // Check consecutive days backwards from the most recent completed day
        for (let i = 0; i < 30; i++) { // Check up to 30 days back
            const checkDate = new Date(startDate);
            checkDate.setDate(startDate.getDate() - i);
            const dateString = checkDate.toISOString().split('T')[0];
            
            const dayEntry = sortedDays.find(day => day.date === dateString);
            
            if (dayEntry && dayEntry.completed) {
                streak++;
            } else {
                // Either no entry or not completed - streak broken
                break;
            }
        }
        
        return streak;
    };

    // Get weekly stats
    const getWeeklyStats = () => {
        const today = new Date();
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const weekDays = gymDays.filter(day => {
            const dayDate = new Date(day.date);
            return dayDate >= weekAgo;
        });
        
        const completedDays = weekDays.filter(day => day.completed);
        const totalDuration = completedDays.reduce((sum, day) => sum + (day.duration || 0), 0);
        
        return {
            workouts: completedDays.length,
            totalDuration,
            averageDuration: completedDays.length > 0 ? Math.round(totalDuration / completedDays.length) : 0
        };
    };

    // Get workout type stats
    const getWorkoutTypeStats = () => {
        const today = new Date();
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        const monthDays = gymDays.filter(day => {
            const dayDate = new Date(day.date);
            return dayDate >= monthAgo && day.completed;
        });
        
        const stats = {
            cardio: 0,
            strength: 0,
            flexibility: 0,
            sports: 0,
            other: 0
        };
        
        monthDays.forEach(day => {
            if (day.workoutType) {
                stats[day.workoutType]++;
            }
        });
        
        return stats;
    };

    // Toggle gym day completion
    // const toggleGymDay = (date: string) => {
    //     setGymDays(prev => prev.map(day => 
    //         day.date === date ? { ...day, completed: !day.completed } : day
    //     ));
    // };

    // Open workout modal
    const openWorkoutModal = (day: GymDay) => {
        setSelectedWorkoutDay(day);
        if (day.workoutType) {
            setNewWorkout({
                workoutType: day.workoutType,
                duration: day.duration?.toString() || ''
            });
        } else {
            setNewWorkout({
                workoutType: 'cardio',
                duration: ''
            });
        }
        setShowWorkoutModal(true);
    };

    // Save workout details
    const saveWorkoutDetails = async () => {
        if (selectedWorkoutDay) {
            setGymDays(prev => prev.map(day => 
                day.date === selectedWorkoutDay.date ? {
                    ...day,
                    completed: true,
                    workoutType: newWorkout.workoutType,
                    duration: newWorkout.duration ? parseInt(newWorkout.duration) : undefined
                } : day
            ));

            // Workout completion notification removed
        }
        setShowWorkoutModal(false);
        setSelectedWorkoutDay(null);
        setNewWorkout({
            workoutType: 'cardio',
            duration: ''
        });
    };

    // Add shopping item
    const addShoppingItem = () => {
        if (newShoppingItem.trim()) {
            const item: ShoppingItem = {
                id: Date.now().toString(),
                name: newShoppingItem.trim(),
                completed: false,
                category: shoppingCategory,
                priority: shoppingPriority
            };
            setShoppingList(prev => [...prev, item]);
            setNewShoppingItem('');
            setShoppingCategory('other');
            setShoppingPriority('medium');
        }
    };

    // Toggle shopping item completion
    const toggleShoppingItem = (id: string) => {
        setShoppingList(prev => prev.map(item => 
            item.id === id ? { ...item, completed: !item.completed } : item
        ));
    };

    // Remove shopping item
    const removeShoppingItem = (id: string) => {
        setShoppingList(prev => prev.filter(item => item.id !== id));
    };

    // Add health metric
    const addHealthMetric = () => {
        if (newMetric.name && newMetric.value && newMetric.unit) {
            const metric: HealthMetric = {
                id: Date.now().toString(),
                name: newMetric.name,
                value: parseFloat(newMetric.value),
                unit: newMetric.unit,
                date: new Date().toISOString().split('T')[0],
                target: newMetric.target ? parseFloat(newMetric.target) : undefined
            };
            setHealthMetrics(prev => [...prev, metric]);
            setNewMetric({ name: '', value: '', unit: '', target: '' });
            setShowAddMetric(false);
        }
    };

    // Add mood entry
    const addMoodEntry = () => {
        const entry: MoodEntry = {
            id: Date.now().toString(),
            date: new Date().toISOString().split('T')[0],
            mood: newMood.mood,
            notes: newMood.notes.trim() || undefined
        };
        setMoodEntries(prev => [...prev, entry]);
        setNewMood({ mood: 'good', notes: '' });
        setShowAddMood(false);
    };

    // Initialize scheduled water intakes
    const getScheduledWaterIntakes = (): ScheduledWaterIntake[] => {
        return [
            {
                id: '1',
                time: '7:00 AM',
                action: '1 glass to jumpstart metabolism',
                completed: false,
                glasses: 1
            },
            {
                id: '2',
                time: '9:30 AM',
                action: '1 glass for mid-morning hydration',
                completed: false,
                glasses: 1
            },
            {
                id: '3',
                time: '11:30 AM',
                action: '1 glass before lunch',
                completed: false,
                glasses: 1
            },
            {
                id: '4',
                time: '2:00 PM',
                action: '1 glass for afternoon energy',
                completed: false,
                glasses: 1
            },
            {
                id: '5',
                time: '4:30 PM',
                action: '1 glass for late afternoon',
                completed: false,
                glasses: 1
            },
            {
                id: '6',
                time: '6:30 PM',
                action: '1 glass before dinner',
                completed: false,
                glasses: 1
            },
            {
                id: '7',
                time: '8:00 PM',
                action: '1 glass for evening hydration',
                completed: false,
                glasses: 1
            },
            {
                id: '8',
                time: '9:30 PM',
                action: '1 glass (last one of the day)',
                completed: false,
                glasses: 1
            }
        ];
    };

    // Add water glass
    const addWaterGlass = () => {
        const today = new Date().toISOString().split('T')[0];
        const existingEntry = waterIntake.find(entry => entry.date === today);
        
        if (existingEntry) {
            setWaterIntake(prev => prev.map(entry => 
                entry.date === today ? { ...entry, glasses: entry.glasses + 1 } : entry
            ));
        } else {
            const newEntry: WaterIntake = {
                id: Date.now().toString(),
                date: today,
                glasses: 1,
                target: 8,
                scheduledIntakes: getScheduledWaterIntakes()
            };
            setWaterIntake(prev => [...prev, newEntry]);
        }
    };

    // Determine sleep quality based on hours
    const getSleepQuality = (hours: number): SleepEntry['quality'] => {
        if (hours >= 8) return 'excellent';
        if (hours >= 7 && hours < 8) return 'good';
        if (hours >= 6 && hours < 7) return 'fair';
        return 'poor';
    };

    // Save sleep entry
    const saveSleepEntry = () => {
        const today = new Date().toISOString().split('T')[0];
        const existingEntry = sleepEntries.find(entry => entry.date === today);
        
        const sleepEntry: SleepEntry = {
            id: existingEntry?.id || Date.now().toString(),
            date: today,
            hours: todaySleep.hours,
            quality: getSleepQuality(todaySleep.hours),
            notes: todaySleep.notes.trim() || undefined
        };
        
        if (existingEntry) {
            setSleepEntries(prev => prev.map(entry => 
                entry.date === today ? sleepEntry : entry
            ));
        } else {
            setSleepEntries(prev => [...prev, sleepEntry]);
        }
    };

    // Get day name from date
    const getDayName = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    // Get formatted date
    const getFormattedDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Get mood emoji
    const getMoodEmoji = (mood: MoodEntry['mood']) => {
        const emojis = {
            excellent: '😄',
            good: '🙂',
            okay: '😐',
            bad: '😔',
            terrible: '😢'
        };
        return emojis[mood];
    };

    // Get priority color
    const getPriorityColor = (priority: ShoppingItem['priority']) => {
        const colors = {
            low: 'text-green-600 bg-green-100 dark:bg-green-900/30',
            medium: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30',
            high: 'text-red-600 bg-red-100 dark:bg-red-900/30'
        };
        return colors[priority];
    };

    // Toggle weekly health task completion
    const toggleWeeklyTask = (taskId: string) => {
        setWeeklyHealthTasks(prev => prev.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
        ));
    };

    // Toggle scheduled water intake completion
    const toggleScheduledWaterIntake = async (intakeId: string) => {
        const today = new Date().toISOString().split('T')[0];
        const existingEntry = waterIntake.find(entry => entry.date === today);
        const intake = getScheduledWaterIntakes().find(i => i.id === intakeId);
        
        if (!intake) return;
        
        if (existingEntry) {
            // Calculate new scheduled intakes with the toggle
            const newScheduledIntakes = existingEntry.scheduledIntakes.map(scheduledIntake => 
                scheduledIntake.id === intakeId ? { ...scheduledIntake, completed: !scheduledIntake.completed } : scheduledIntake
            );
            
            // Calculate total glasses from completed scheduled intakes
            const totalGlassesFromScheduled = newScheduledIntakes
                .filter(scheduledIntake => scheduledIntake.completed)
                .reduce((total, scheduledIntake) => total + scheduledIntake.glasses, 0);
            
            // Add any extra glasses that were added manually
            const extraGlasses = existingEntry.glasses - existingEntry.scheduledIntakes
                .filter(scheduledIntake => scheduledIntake.completed)
                .reduce((total, scheduledIntake) => total + scheduledIntake.glasses, 0);
            
            const newTotalGlasses = totalGlassesFromScheduled + Math.max(0, extraGlasses);
            
            setWaterIntake(prev => {
                return prev.map(entry => 
                    entry.date === today ? {
                        ...entry,
                        scheduledIntakes: newScheduledIntakes,
                        glasses: newTotalGlasses
                    } : entry
                );
            });

            // Water intake notification removed
        } else {
            const newEntry: WaterIntake = {
                id: Date.now().toString(),
                date: today,
                glasses: intake.glasses,
                target: 8,
                scheduledIntakes: getScheduledWaterIntakes().map(scheduledIntake => 
                    scheduledIntake.id === intakeId ? { ...scheduledIntake, completed: true } : scheduledIntake
                )
            };
            setWaterIntake(prev => [...prev, newEntry]);

            // Water intake notification removed
        }
    };

    // Get category color
    const getCategoryColor = (category: WeeklyHealthTask['category']) => {
        switch (category) {
            case 'cleaning': return 'from-blue-400 to-cyan-500';
            case 'checkup': return 'from-green-400 to-emerald-500';
            case 'self-care': return 'from-purple-400 to-pink-500';
            case 'preparation': return 'from-orange-400 to-red-500';
            default: return 'from-gray-400 to-gray-500';
        }
    };

    // Get sleep statistics
    const getSleepStats = () => {
        const allSleepData = sleepEntries
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        if (allSleepData.length === 0) {
            return {
                averageHours: 0,
                totalDays: 0,
                bestQuality: 'No data',
                averageQuality: 'No data'
            };
        }
        
        const totalHours = allSleepData.reduce((sum, entry) => sum + entry.hours, 0);
        const averageHours = Math.round((totalHours / allSleepData.length) * 10) / 10;
        
        const qualityCounts = {
            excellent: 0,
            good: 0,
            fair: 0,
            poor: 0
        };
        
        allSleepData.forEach(entry => {
            qualityCounts[entry.quality]++;
        });
        
        const bestQuality = Object.entries(qualityCounts)
            .sort(([,a], [,b]) => b - a)[0][0];
        
        const qualityScores = {
            excellent: 4,
            good: 3,
            fair: 2,
            poor: 1
        };
        
        const averageQualityScore = allSleepData.reduce((sum, entry) => sum + qualityScores[entry.quality], 0) / allSleepData.length;
        const averageQuality = averageQualityScore >= 3.5 ? 'excellent' :
                              averageQualityScore >= 2.5 ? 'good' :
                              averageQualityScore >= 1.5 ? 'fair' : 'poor';
        
        return {
            averageHours,
            totalDays: allSleepData.length,
            bestQuality,
            averageQuality
        };
    };





    // Notification setup removed





    // Check if it's the beginning of a new week and reset weekly tasks
    const checkAndResetWeeklyTasks = async () => {
        try {
            const lastResetDate = await getUserPreference('health-habits-last-weekly-reset');
            const today = new Date();
            const todayString = today.toISOString().split('T')[0];
            
            if (!lastResetDate || lastResetDate !== todayString) {
                // Check if it's Monday (beginning of week) or if we haven't reset this week
                const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday
                const isBeginningOfWeek = dayOfWeek === 1; // Monday
                
                if (isBeginningOfWeek || !lastResetDate) {
                    // Reset all weekly tasks to uncompleted
                    setWeeklyHealthTasks(prev => prev.map(task => ({
                        ...task,
                        completed: false
                    })));
                    
                    // Save the reset date
                    await setUserPreference('health-habits-last-weekly-reset', todayString);
                }
            }
        } catch (error) {
            console.error('Error checking weekly reset:', error);
        }
    };

    // Check and reset water intakes daily
    const checkAndResetWaterIntakes = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const lastWaterResetDate = await getUserPreference('health-habits-water-reset-date');
            
    
            
            // If it's a new day and we haven't reset today yet
        if (lastWaterResetDate !== today) {

            
            // Check if we already have an entry for today
            const existingTodayEntry = waterIntake.find(entry => entry.date === today);
            
            if (existingTodayEntry) {
                // Reset existing entry for today
                setWaterIntake(prev => prev.map(entry => 
                    entry.date === today ? {
                        ...entry,
                        glasses: 0, // Reset glasses count for new day
                        scheduledIntakes: entry.scheduledIntakes.map(intake => ({ ...intake, completed: false }))
                    } : entry
                ));
            } else {
                // Create new entry for today with reset scheduled intakes
                const newEntry: WaterIntake = {
                    id: Date.now().toString(),
                    date: today,
                    glasses: 0,
                    target: 8,
                    scheduledIntakes: getScheduledWaterIntakes().map(intake => ({ ...intake, completed: false }))
                };
    
                setWaterIntake(prev => {
                    const updated = [...prev, newEntry];
        
                    return updated;
                });
            }
            
            await setUserPreference('health-habits-water-reset-date', today);
        } else {

            
            // Only create a new entry if one doesn't exist
            const existingTodayEntry = waterIntake.find(entry => entry.date === today);
            if (!existingTodayEntry) {
    
                const newEntry: WaterIntake = {
                    id: Date.now().toString(),
                    date: today,
                    glasses: 0,
                    target: 8,
                    scheduledIntakes: getScheduledWaterIntakes().map(intake => ({ ...intake, completed: false }))
                };
                setWaterIntake(prev => [...prev, newEntry]);
            } else {
    
            }
        }
        } catch (error) {
            console.error('Error checking water reset:', error);
        }
    };



    const currentStreak = getCurrentStreak();
    const weeklyStats = getWeeklyStats();
    const workoutTypeStats = getWorkoutTypeStats();
    const sleepStats = getSleepStats();
    const today = new Date().toISOString().split('T')[0];

    // Get next water intake time
    const getNextWaterIntake = () => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        const scheduledIntakes = getScheduledWaterIntakes();
        const nextIntake = scheduledIntakes.find(intake => {
            const [time, period] = intake.time.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            
            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;
            
            const intakeTime = hours * 60 + minutes;
            const currentTime = currentHour * 60 + currentMinute;
            
            return intakeTime > currentTime;
        });
        
        return nextIntake;
    };
    const todayWaterEntry = waterIntake.find(entry => entry.date === today);
    const todaySleepEntry = sleepEntries.find(entry => entry.date === today);
    
    // Calculate total glasses from completed scheduled intakes
    // const getCompletedWaterGlasses = () => {
    //     if (!todayWaterEntry) return 0;
    //     return todayWaterEntry.scheduledIntakes
    //         .filter(intake => intake.completed)
    //         .reduce((total, intake) => total + intake.glasses, 0);
    // };
    const todayMoodEntry = moodEntries.find(entry => entry.date === today);

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-indigo-900/20">
                <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-6 animate-pulse">
                            <Heart className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Loading Health Data...</h2>
                        <p className="text-gray-600 dark:text-gray-400">Please wait while we load your health and habits data from the database.</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-indigo-900/20">
                <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-6">
                            <Heart className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Data</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-indigo-900/20">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6 space-y-6 md:space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="inline-flex flex-col sm:flex-row items-center gap-3 md:gap-4 mb-4 md:mb-6">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                            <Heart className="w-6 h-6 md:w-8 md:h-8 text-white" />
                        </div>
                        <div className="text-center sm:text-left">
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Health & Habits
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mt-1">Your wellness journey starts here</p>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center px-2">
                    <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl md:rounded-2xl p-1.5 md:p-2 backdrop-blur-sm border border-white/20 shadow-lg w-full max-w-lg">
                        <div className="flex space-x-1 md:space-x-2">
                            {[
                                { id: 'gym', label: 'Fitness', icon: Dumbbell, color: 'from-orange-500 to-red-500' },
                                { id: 'food', label: 'Nutrition', icon: Apple, color: 'from-green-500 to-emerald-500' },
                                { id: 'health', label: 'Wellness', icon: Heart, color: 'from-blue-500 to-purple-500' },

                            ].map(({ id, label, icon: Icon, color }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id as any)}
                                    className={`flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-6 py-2 sm:py-3 rounded-lg md:rounded-xl font-medium transition-all duration-300 text-xs sm:text-sm flex-1 ${
                                        activeTab === id
                                            ? `bg-gradient-to-r ${color} text-white shadow-lg transform scale-105`
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                                    }`}
                                >
                                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="hidden sm:inline">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="space-y-6 md:space-y-8">
                    {/* Gym Tab */}
                    {activeTab === 'gym' && (
                        <div className="space-y-6 md:space-y-8">
                            {/* Streak Card */}
                            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white shadow-2xl">
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4">
                                        <Trophy className="w-6 h-6 md:w-8 md:h-8" />
                                        <h2 className="text-lg md:text-2xl font-bold">Current Streak</h2>
                                    </div>
                                    <div className="text-4xl md:text-6xl font-bold mb-2">
                                        {currentStreak}
                                    </div>
                                    <div className="text-lg md:text-xl mb-3 md:mb-4">
                                        {currentStreak === 1 ? 'Day' : 'Days'}
                                    </div>
                                    <p className="text-orange-100 text-sm md:text-base">
                                        {currentStreak === 0 ? 'Start your fitness journey today!' : 
                                         currentStreak === 1 ? 'Great start! Keep it going!' :
                                         currentStreak < 7 ? 'You\'re building momentum! 💪' :
                                         currentStreak < 30 ? 'Incredible dedication! 🔥' :
                                         'You\'re absolutely crushing it! 🏆'}
                                    </p>
                                </div>
                            </div>

                            {/* Weekly Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                                <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm border border-white/20 shadow-xl">
                                    <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                                        <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg md:rounded-xl flex items-center justify-center">
                                            <Dumbbell className="w-4 h-4 md:w-5 md:h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">{weeklyStats.workouts}</p>
                                            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Workouts This Week</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm border border-white/20 shadow-xl">
                                    <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                                        <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 dark:bg-green-900/30 rounded-lg md:rounded-xl flex items-center justify-center">
                                            <Clock className="w-4 h-4 md:w-5 md:h-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">{weeklyStats.totalDuration}</p>
                                            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Total Minutes</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm border border-white/20 shadow-xl">
                                    <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                                        <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg md:rounded-xl flex items-center justify-center">
                                            <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">{currentStreak}</p>
                                            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Current Streak</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm border border-white/20 shadow-xl">
                                    <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                                        <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg md:rounded-xl flex items-center justify-center">
                                            <Target className="w-4 h-4 md:w-5 md:h-5 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <div>
                                            <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">{weeklyStats.averageDuration}</p>
                                            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Avg. Duration</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Workout Type Distribution */}
                            <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl md:rounded-3xl p-6 md:p-8 backdrop-blur-sm border border-white/20 shadow-xl">
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                                    <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                                    Workout Types (Last 30 Days)
                                </h3>
                                <div className="grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
                                    {[
                                        { type: 'cardio', label: 'Cardio', color: 'from-red-500 to-pink-500', icon: '🏃' },
                                        { type: 'strength', label: 'Strength', color: 'from-blue-500 to-indigo-500', icon: '💪' },
                                        { type: 'flexibility', label: 'Flexibility', color: 'from-green-500 to-emerald-500', icon: '🧘' },
                                        { type: 'sports', label: 'Sports', color: 'from-yellow-500 to-orange-500', icon: '⚽' },
                                        { type: 'other', label: 'Other', color: 'from-purple-500 to-violet-500', icon: '🎯' }
                                    ].map(({ type, label, color, icon }) => (
                                        <div key={type} className="text-center">
                                            <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br ${color} rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-3 shadow-lg`}>
                                                <span className="text-lg md:text-2xl">{icon}</span>
                                            </div>
                                            <p className="font-bold text-gray-900 dark:text-white text-sm md:text-base">{workoutTypeStats[type as keyof typeof workoutTypeStats]}</p>
                                            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Weekly Checklist */}
                            <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl md:rounded-3xl p-6 md:p-8 backdrop-blur-sm border border-white/20 shadow-xl">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
                                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 md:gap-3">
                                        <Calendar className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
                                        This Week's Workouts
                                    </h2>
                                    <button
                                        onClick={initializeGymWeek}
                                        className="px-4 md:px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm md:text-base"
                                    >
                                        <Plus className="w-4 h-4 inline mr-2" />
                                        Initialize Week
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3 md:gap-4">
                                    {gymDays
                                        .filter(day => {
                                            const dayDate = new Date(day.date);
                                            const today = new Date();
                                            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                                            return dayDate >= weekAgo;
                                        })
                                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                        .map((day) => (
                                            <div
                                                key={day.date}
                                                className={`p-4 md:p-6 rounded-xl md:rounded-2xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                                                    day.completed
                                                        ? 'bg-gradient-to-br from-green-500 to-emerald-500 border-green-400 shadow-lg'
                                                        : 'bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-lg'
                                                }`}
                                                onClick={() => openWorkoutModal(day)}
                                            >
                                                <div className="text-center">
                                                    <div className="flex justify-center mb-2 md:mb-3">
                                                        {day.completed ? (
                                                            <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                                        ) : (
                                                            <Circle className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div className={`text-sm md:text-lg font-bold mb-1 ${
                                                        day.completed ? 'text-white' : 'text-gray-900 dark:text-white'
                                                    }`}>
                                                        {getDayName(day.date)}
                                                    </div>
                                                    <div className={`text-xs md:text-sm ${
                                                        day.completed ? 'text-green-100' : 'text-gray-500 dark:text-gray-400'
                                                    }`}>
                                                        {getFormattedDate(day.date)}
                                                    </div>
                                                    {day.completed && day.workoutType && (
                                                        <div className="mt-2">
                                                            <span className="text-xs bg-white/20 px-2 py-1 rounded-full text-white">
                                                                {day.workoutType}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {day.completed && day.duration && (
                                                        <div className="text-xs text-green-100 mt-1">
                                                            {day.duration}min
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Activity Tracker */}
                            <ActivityTracker />
                        </div>
                    )}

                    {/* Food Tab */}
                    {activeTab === 'food' && (
                        <div className="space-y-8">
                            {/* Shopping List */}
                            <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl md:rounded-3xl p-6 md:p-8 backdrop-blur-sm border border-white/20 shadow-xl">
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                                    <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
                                    Shopping List
                                </h2>
                                
                                {/* Add new item */}
                                <div className="space-y-3 mb-6 md:mb-8">
                                    <input
                                        type="text"
                                        value={newShoppingItem}
                                        onChange={(e) => setNewShoppingItem(e.target.value)}
                                        placeholder="Add item to shopping list..."
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm md:text-base touch-manipulation"
                                        onKeyPress={(e) => e.key === 'Enter' && addShoppingItem()}
                                    />
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <select
                                            value={shoppingCategory}
                                            onChange={(e) => setShoppingCategory(e.target.value as ShoppingItem['category'])}
                                            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm md:text-base touch-manipulation"
                                        >
                                            <option value="proteins">Proteins</option>
                                            <option value="vegetables">Vegetables</option>
                                            <option value="fruits">Fruits</option>
                                            <option value="grains">Grains</option>
                                            <option value="dairy">Dairy</option>
                                            <option value="other">Other</option>
                                        </select>
                                        <select
                                            value={shoppingPriority}
                                            onChange={(e) => setShoppingPriority(e.target.value as ShoppingItem['priority'])}
                                            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm md:text-base touch-manipulation"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                        <button
                                            onClick={addShoppingItem}
                                            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 touch-manipulation min-h-[48px] flex items-center justify-center gap-2"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span className="hidden sm:inline">Add Item</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Shopping items by category */}
                                {['proteins', 'vegetables', 'fruits', 'grains', 'dairy', 'other'].map(category => {
                                    const categoryItems = shoppingList.filter(item => item.category === category);
                                    if (categoryItems.length === 0) return null;
                                    
                                    return (
                                        <div key={category} className="mb-6">
                                            <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3 md:mb-4 capitalize flex items-center gap-2">
                                                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500"></div>
                                                {category}
                                            </h3>
                                            <div className="space-y-3">
                                                {categoryItems.map(item => (
                                                    <div
                                                        key={item.id}
                                                        className={`flex items-center gap-3 md:gap-4 p-4 rounded-xl transition-all duration-200 touch-manipulation ${
                                                            item.completed
                                                                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700'
                                                                : 'bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 hover:shadow-md'
                                                        }`}
                                                    >
                                                        <button
                                                            onClick={() => toggleShoppingItem(item.id)}
                                                            className="flex-shrink-0 p-2 -m-2 touch-manipulation"
                                                        >
                                                            {item.completed ? (
                                                                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                                                            ) : (
                                                                <Circle className="w-6 h-6 text-gray-400" />
                                                            )}
                                                        </button>
                                                        <span className={`flex-1 text-sm md:text-base ${
                                                            item.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'
                                                        }`}>
                                                            {item.name}
                                                        </span>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                                                            {item.priority}
                                                        </span>
                                                        <button
                                                            onClick={() => removeShoppingItem(item.id)}
                                                            className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Weekly Meal Schedule */}
                            <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl md:rounded-3xl p-6 md:p-8 backdrop-blur-sm border border-white/20 shadow-xl">
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                                    <Apple className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
                                    Weekly Meal Schedule
                                </h2>
                                
                                {/* Desktop Table View */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b-2 border-gray-200 dark:border-gray-600">
                                                <th className="text-left py-4 px-3 font-bold text-gray-900 dark:text-white">Day</th>
                                                <th className="text-left py-4 px-3 font-bold text-gray-900 dark:text-white">4:30am</th>
                                                <th className="text-left py-4 px-3 font-bold text-gray-900 dark:text-white">9:00am</th>
                                                <th className="text-left py-4 px-3 font-bold text-gray-900 dark:text-white">3:30pm</th>
                                                <th className="text-left py-4 px-3 font-bold text-gray-900 dark:text-white">8:30pm</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                { day: 'Monday', meals: [
                                                    'Herbal tea + overnight oats with chai seeds and berries',
                                                    'Boiled eggs + carrot sticks + 1 banana',
                                                    'Brown rice + stir fried mixed veggies + grilled chicken + Sauce',
                                                    'Green smoothie (Spinach, banana, peanut butter, oat milk)'
                                                ]},
                                                { day: 'Tuesday', meals: [
                                                    'Green tea + peanut butter toast on whole grain bread',
                                                    'Greek yoghurt (unsweetened) + almonds + apple Slices',
                                                    'Boiled plantain & Egg + veggies and Sardine',
                                                    'Cucumber + Carrots'
                                                ]},
                                                { day: 'Wednesday', meals: [
                                                    'Overnight oats with peanut butter and sliced banana',
                                                    'Boiled egg and carrot sticks',
                                                    'Potatoes + Sauce + stir fried mixed veggies',
                                                    'Green smoothie (Spinach, banana, peanut butter, oat milk)'
                                                ]},
                                                { day: 'Thursday', meals: [
                                                    'Avocado Toast with whole meal bread',
                                                    'Earl grey tea + avocado Toast',
                                                    'Bread & Egg with veggies',
                                                    'Creamy Oat & Apple (1 small apple, 2 tbsp rolled oats, 1/2 banana, Dash of cinnamon, 200ml unsweetened oat milk)'
                                                ]},
                                                { day: 'Friday', meals: [
                                                    'Greek yoghurt + chai + oat milk',
                                                    'Apple + Peanut butter Toast',
                                                    'Pasta + Veggies + Chicken',
                                                    'Handful of walnuts'
                                                ]},
                                                { day: 'Saturday', meals: [
                                                    '',
                                                    'Green Smoothie (Spinach, Cucumber, Green Apple, unsweetened almond milk, Lemon)',
                                                    'Plantain & Egg',
                                                    'Green Smoothie (Spinach, Cucumber, Green Apple, unsweetened almond milk, Lemon)'
                                                ]},
                                                { day: 'Sunday', meals: ['', '', '', '']}
                                            ].map(({ day, meals }) => (
                                                <tr key={day} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                    <td className="py-4 px-3 font-bold text-gray-900 dark:text-white">{day}</td>
                                                    {meals.map((meal, index) => (
                                                        <td key={index} className="py-4 px-3 text-gray-700 dark:text-gray-300">
                                                            {meal || '-'}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Card View */}
                                <div className="md:hidden space-y-4">
                                    {[
                                        { day: 'Monday', meals: [
                                            { time: '4:30am', meal: 'Herbal tea + overnight oats with chai seeds and berries' },
                                            { time: '9:00am', meal: 'Boiled eggs + carrot sticks + 1 banana' },
                                            { time: '3:30pm', meal: 'Brown rice + stir fried mixed veggies + grilled chicken + Sauce' },
                                            { time: '8:30pm', meal: 'Green smoothie (Spinach, banana, peanut butter, oat milk)' }
                                        ]},
                                        { day: 'Tuesday', meals: [
                                            { time: '4:30am', meal: 'Green tea + peanut butter toast on whole grain bread' },
                                            { time: '9:00am', meal: 'Greek yoghurt (unsweetened) + almonds + apple Slices' },
                                            { time: '3:30pm', meal: 'Boiled plantain & Egg + veggies and Sardine' },
                                            { time: '8:30pm', meal: 'Cucumber + Carrots' }
                                        ]},
                                        { day: 'Wednesday', meals: [
                                            { time: '4:30am', meal: 'Overnight oats with peanut butter and sliced banana' },
                                            { time: '9:00am', meal: 'Boiled egg and carrot sticks' },
                                            { time: '3:30pm', meal: 'Potatoes + Sauce + stir fried mixed veggies' },
                                            { time: '8:30pm', meal: 'Green smoothie (Spinach, banana, peanut butter, oat milk)' }
                                        ]},
                                        { day: 'Thursday', meals: [
                                            { time: '4:30am', meal: 'Avocado Toast with whole meal bread' },
                                            { time: '9:00am', meal: 'Earl grey tea + avocado Toast' },
                                            { time: '3:30pm', meal: 'Bread & Egg with veggies' },
                                            { time: '8:30pm', meal: 'Creamy Oat & Apple (1 small apple, 2 tbsp rolled oats, 1/2 banana, Dash of cinnamon, 200ml unsweetened oat milk)' }
                                        ]},
                                        { day: 'Friday', meals: [
                                            { time: '4:30am', meal: 'Greek yoghurt + chai + oat milk' },
                                            { time: '9:00am', meal: 'Apple + Peanut butter Toast' },
                                            { time: '3:30pm', meal: 'Pasta + Veggies + Chicken' },
                                            { time: '8:30pm', meal: 'Handful of walnuts' }
                                        ]},
                                        { day: 'Saturday', meals: [
                                            { time: '4:30am', meal: '' },
                                            { time: '9:00am', meal: 'Green Smoothie (Spinach, Cucumber, Green Apple, unsweetened almond milk, Lemon)' },
                                            { time: '3:30pm', meal: 'Plantain & Egg' },
                                            { time: '8:30pm', meal: 'Green Smoothie (Spinach, Cucumber, Green Apple, unsweetened almond milk, Lemon)' }
                                        ]},
                                        { day: 'Sunday', meals: [
                                            { time: '4:30am', meal: '' },
                                            { time: '9:00am', meal: '' },
                                            { time: '3:30pm', meal: '' },
                                            { time: '8:30pm', meal: '' }
                                        ]}
                                    ].map(({ day, meals }) => (
                                        <div key={day} className="bg-white/50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                                            <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">{day}</h4>
                                            <div className="space-y-3">
                                                {meals.map(({ time, meal }, index) => (
                                                    <div key={index} className="flex items-start gap-3">
                                                        <div className="flex-shrink-0 w-16 text-sm font-medium text-gray-600 dark:text-gray-400">
                                                            {time}
                                                        </div>
                                                        <div className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                                                            {meal || '-'}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Health Tab */}
                    {activeTab === 'health' && (
                        <div className="space-y-8">
                            {/* Today's Quick Actions */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                                {/* Water Intake */}
                                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl md:rounded-3xl p-4 md:p-6 text-white shadow-xl">
                                    <div className="flex items-center justify-between mb-3 md:mb-4">
                                        <h3 className="text-base md:text-lg font-bold flex items-center gap-2">
                                            <Droplets className="w-4 h-4 md:w-5 md:h-5" />
                                            Water Intake
                                        </h3>
                                        <span className="text-xl md:text-2xl font-bold">
                                            {todayWaterEntry?.glasses || 0}/8
                                        </span>
                                    </div>
                                    <div className="w-full bg-white/20 rounded-full h-3 mb-4">
                                        <div 
                                            className="bg-white rounded-full h-3 transition-all duration-300"
                                            style={{ width: `${Math.min((todayWaterEntry?.glasses || 0) / 8 * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                    <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
                                        <div className="text-xs text-white/80 text-center mb-2">
                                            Today's Schedule
                                            {getNextWaterIntake() && (
                                                <div className="mt-1 text-yellow-200 text-xs">
                                                    Next: {getNextWaterIntake()?.time}
                                                </div>
                                            )}
                                        </div>
                                        {todayWaterEntry?.scheduledIntakes?.map(intake => (
                                            <div 
                                                key={intake.id}
                                                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 cursor-pointer touch-manipulation ${
                                                    intake.completed 
                                                        ? 'bg-white/30' 
                                                        : 'bg-white/10 hover:bg-white/20'
                                                }`}
                                                onClick={() => toggleScheduledWaterIntake(intake.id)}
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-xs md:text-sm font-medium truncate">{intake.time}</div>
                                                    <div className="text-xs opacity-80 truncate">{intake.action}</div>
                                                </div>
                                                <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                                                    <span className="text-xs">{intake.glasses} glass{intake.glasses > 1 ? 'es' : ''}</span>
                                                    {intake.completed ? (
                                                        <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-300" />
                                                    ) : (
                                                        <Circle className="w-3 h-3 md:w-4 md:h-4 opacity-60" />
                                                    )}
                                                </div>
                                            </div>
                                        )) || getScheduledWaterIntakes().map(intake => (
                                            <div 
                                                key={intake.id}
                                                className="flex items-center justify-between p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 cursor-pointer"
                                                onClick={() => toggleScheduledWaterIntake(intake.id)}
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-xs md:text-sm font-medium truncate">{intake.time}</div>
                                                    <div className="text-xs opacity-80 truncate">{intake.action}</div>
                                                </div>
                                                <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                                                    <span className="text-xs">{intake.glasses} glass{intake.glasses > 1 ? 'es' : ''}</span>
                                                    <Circle className="w-3 h-3 md:w-4 md:h-4 opacity-60" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-2">

                                        <button
                                            onClick={addWaterGlass}
                                            className="w-full py-2 md:py-3 bg-white/20 rounded-xl hover:bg-white/30 transition-all duration-300 font-medium text-xs md:text-sm"
                                        >
                                            + Add Extra Glass
                                        </button>
                                    </div>
                                </div>

                                {/* Sleep Tracking */}
                                <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl md:rounded-3xl p-4 md:p-6 text-white shadow-xl">
                                    <div className="flex items-center justify-between mb-3 md:mb-4">
                                        <h3 className="text-base md:text-lg font-bold flex items-center gap-2">
                                            <Moon className="w-4 h-4 md:w-5 md:h-5" />
                                            Sleep
                                        </h3>
                                        <span className="text-xl md:text-2xl font-bold">
                                            {todaySleepEntry?.hours || 0}h
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        <input
                                            type="number"
                                            min="0"
                                            max="24"
                                            value={todaySleep.hours}
                                            onChange={(e) => setTodaySleep(prev => ({ ...prev, hours: parseFloat(e.target.value) || 0 }))}
                                            className="w-full px-3 py-2 bg-white/20 rounded-lg text-white placeholder-white/70 text-sm md:text-base"
                                            placeholder="Hours slept"
                                        />
                                        <textarea
                                            value={todaySleep.notes}
                                            onChange={(e) => setTodaySleep(prev => ({ ...prev, notes: e.target.value }))}
                                            className="w-full px-3 py-2 bg-white/20 rounded-lg text-white placeholder-white/70 resize-none text-sm md:text-base"
                                            placeholder="How did you sleep? (optional)"
                                            rows={2}
                                        />
                                        <div className="text-xs text-white/80 text-center">
                                            {todaySleep.hours > 0 && (
                                                <span className="text-xs">
                                                    Quality: <span className="font-medium capitalize">
                                                        {getSleepQuality(todaySleep.hours)}
                                                    </span>
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={saveSleepEntry}
                                            className="w-full py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all duration-300 font-medium"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>

                                {/* Mood Tracking */}
                                <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl md:rounded-3xl p-4 md:p-6 text-white shadow-xl">
                                    <div className="flex items-center justify-between mb-3 md:mb-4">
                                        <h3 className="text-base md:text-lg font-bold flex items-center gap-2">
                                            <Smile className="w-4 h-4 md:w-5 md:h-5" />
                                            Today's Mood
                                        </h3>
                                        <span className="text-xl md:text-2xl">
                                            {todayMoodEntry ? getMoodEmoji(todayMoodEntry.mood) : '😐'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setShowAddMood(true)}
                                        className="w-full py-3 bg-white/20 rounded-xl hover:bg-white/30 transition-all duration-300 font-medium"
                                    >
                                        {todayMoodEntry ? 'Update Mood' : 'Log Mood'}
                                    </button>
                                </div>
                            </div>

                            {/* Sleep Statistics */}
                            <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl md:rounded-3xl p-4 md:p-6 backdrop-blur-sm border border-white/20 shadow-xl mb-6 md:mb-8">
                                <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-3 md:mb-4 flex items-center gap-2 md:gap-3">
                                    <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
                                    Sleep Statistics (All Time)
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                                    <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm border border-white/20 shadow-xl">
                                    <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                                        <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg md:rounded-xl flex items-center justify-center">
                                            <Moon className="w-4 h-4 md:w-5 md:h-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">{sleepStats.averageHours}</p>
                                            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Avg. Hours</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm border border-white/20 shadow-xl">
                                    <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                                        <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg md:rounded-xl flex items-center justify-center">
                                            <Calendar className="w-4 h-4 md:w-5 md:h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">{sleepStats.totalDays}</p>
                                            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Days Tracked</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm border border-white/20 shadow-xl">
                                    <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                                        <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 dark:bg-green-900/30 rounded-lg md:rounded-xl flex items-center justify-center">
                                            <Star className="w-4 h-4 md:w-5 md:h-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm md:text-lg font-bold text-gray-900 dark:text-white capitalize">{sleepStats.bestQuality}</p>
                                            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Best Quality</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm border border-white/20 shadow-xl">
                                    <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                                        <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg md:rounded-xl flex items-center justify-center">
                                            <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm md:text-lg font-bold text-gray-900 dark:text-white capitalize">{sleepStats.averageQuality}</p>
                                            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Avg. Quality</p>
                                        </div>
                                    </div>
                                </div>
                                </div>
                            </div>

                            {/* Sleep History */}
                            <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl md:rounded-3xl p-6 md:p-8 backdrop-blur-sm border border-white/20 shadow-xl">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-2">
                                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 md:gap-3">
                                        <Moon className="w-5 h-5 md:w-6 md:h-6 text-purple-500" />
                                        Sleep History
                                    </h2>
                                    <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                                        Last 7 days
                                    </div>
                                </div>
                                
                                <div className="space-y-3 md:space-y-4">
                                    {sleepEntries
                                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                        .slice(sleepHistoryPage * 7, (sleepHistoryPage + 1) * 7)
                                        .map(entry => (
                                            <div key={entry.id} className="flex items-center justify-between p-3 md:p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl md:rounded-2xl border border-purple-200 dark:border-purple-700">
                                                <div className="flex items-center gap-3 md:gap-4">
                                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                                                        <Moon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                                                            <p className="font-bold text-gray-900 dark:text-white text-sm md:text-base">
                                                                {new Date(entry.date).toLocaleDateString('en-US', { 
                                                                    weekday: 'short', 
                                                                    month: 'short', 
                                                                    day: 'numeric' 
                                                                })}
                                                            </p>
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium self-start sm:self-auto ${
                                                                entry.quality === 'excellent' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                                entry.quality === 'good' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                                                entry.quality === 'fair' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                            }`}>
                                                                {entry.quality.charAt(0).toUpperCase() + entry.quality.slice(1)}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                                                            {entry.hours} hours of sleep
                                                        </p>
                                                        {entry.notes && (
                                                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                                "{entry.notes}"
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                                        {entry.hours}h
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {entry.hours >= 8 ? 'Great sleep!' : 
                                                         entry.hours >= 7 ? 'Good sleep' : 
                                                         entry.hours >= 6 ? 'Fair sleep' : 'Need more sleep'}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    
                                    {sleepEntries.length === 0 && (
                                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                            <Moon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                            <p className="text-lg">No sleep data recorded yet.</p>
                                            <p className="text-sm">Start tracking your sleep above!</p>
                                        </div>
                                    )}
                                </div>

                                {/* Pagination */}
                                {sleepEntries.length > 7 && (
                                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            Showing {sleepHistoryPage * 7 + 1} - {Math.min((sleepHistoryPage + 1) * 7, sleepEntries.length)} of {sleepEntries.length} entries
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setSleepHistoryPage(prev => Math.max(0, prev - 1))}
                                                disabled={sleepHistoryPage === 0}
                                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                                    sleepHistoryPage === 0
                                                        ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                                                        : 'bg-purple-500 text-white hover:bg-purple-600'
                                                }`}
                                            >
                                                Previous
                                            </button>
                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: Math.ceil(sleepEntries.length / 7) }, (_, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setSleepHistoryPage(i)}
                                                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                                            sleepHistoryPage === i
                                                                ? 'bg-purple-500 text-white'
                                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                                                        }`}
                                                    >
                                                        {i + 1}
                                                    </button>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => setSleepHistoryPage(prev => Math.min(Math.ceil(sleepEntries.length / 7) - 1, prev + 1))}
                                                disabled={sleepHistoryPage >= Math.ceil(sleepEntries.length / 7) - 1}
                                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                                    sleepHistoryPage >= Math.ceil(sleepEntries.length / 7) - 1
                                                        ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                                                        : 'bg-purple-500 text-white hover:bg-purple-600'
                                                }`}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Weekly Tasks */}
                            <div className="bg-white/80 dark:bg-gray-800/80 rounded-3xl p-8 backdrop-blur-sm border border-white/20 shadow-xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                        <Calendar className="w-6 h-6 text-yellow-500" />
                                        Weekly Health Tasks
                                    </h2>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {weeklyHealthTasks.filter(task => task.completed).length}/{weeklyHealthTasks.length} completed
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {weeklyHealthTasks.map(task => (
                                        <div 
                                            key={task.id} 
                                            className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                                                task.completed
                                                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700'
                                                    : 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                                            }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                                                    task.completed 
                                                        ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                                                        : `bg-gradient-to-br ${getCategoryColor(task.category)}`
                                                }`}>
                                                    <span className="text-2xl">{task.icon}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <p className={`font-bold text-lg ${
                                                            task.completed 
                                                                ? 'text-green-800 dark:text-green-200 line-through' 
                                                                : 'text-gray-900 dark:text-white'
                                                        }`}>
                                                            {task.name}
                                                        </p>
                                                        {task.completed && (
                                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                                        )}
                                                    </div>
                                                    <p className={`text-sm ${
                                                        task.completed 
                                                            ? 'text-green-600 dark:text-green-400' 
                                                            : 'text-gray-600 dark:text-gray-400'
                                                    }`}>
                                                        {task.description}
                                                    </p>
                                                </div>
                                                <button 
                                                    onClick={() => toggleWeeklyTask(task.id)}
                                                    className={`px-4 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                                                        task.completed
                                                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                                                            : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700'
                                                    }`}
                                                >
                                                    {task.completed ? 'Completed' : 'Mark Done'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Health Metrics */}
                            <div className="bg-white/80 dark:bg-gray-800/80 rounded-3xl p-8 backdrop-blur-sm border border-white/20 shadow-xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                        <TrendingUp className="w-6 h-6 text-blue-500" />
                                        Health Metrics
                                    </h2>
                                    <button
                                        onClick={() => setShowAddMetric(true)}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                    >
                                        <Plus className="w-4 h-4 inline mr-2" />
                                        Add Metric
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {healthMetrics.length === 0 ? (
                                        <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                                            <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                            <p className="text-lg">No health metrics added yet.</p>
                                            <p className="text-sm">Start tracking your health data!</p>
                                        </div>
                                    ) : (
                                        healthMetrics
                                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                            .slice(0, 6)
                                            .map(metric => (
                                                <div key={metric.id} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">{metric.name}</h3>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-600/50 px-2 py-1 rounded-full">
                                                            {new Date(metric.date).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                                        {metric.value} {metric.unit}
                                                    </div>
                                                    {metric.target && (
                                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                                            Target: {metric.target} {metric.unit}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                    )}
                                </div>
                            </div>

                        </div>
                    )}
                </div>

                {/* Add Health Metric Modal */}
                {showAddMetric && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl p-6 md:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">Add Health Metric</h3>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Metric name (e.g., Weight, Blood Pressure)"
                                    value={newMetric.name}
                                    onChange={(e) => setNewMetric(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-base touch-manipulation"
                                />
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        type="number"
                                        placeholder="Value"
                                        value={newMetric.value}
                                        onChange={(e) => setNewMetric(prev => ({ ...prev, value: e.target.value }))}
                                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-base touch-manipulation"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Unit (kg, mmHg, etc.)"
                                        value={newMetric.unit}
                                        onChange={(e) => setNewMetric(prev => ({ ...prev, unit: e.target.value }))}
                                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-base touch-manipulation"
                                    />
                                </div>
                                <input
                                    type="number"
                                    placeholder="Target value (optional)"
                                    value={newMetric.target}
                                    onChange={(e) => setNewMetric(prev => ({ ...prev, target: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-base touch-manipulation"
                                />
                                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                    <button
                                        onClick={addHealthMetric}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl touch-manipulation min-h-[48px]"
                                    >
                                        Add Metric
                                    </button>
                                    <button
                                        onClick={() => setShowAddMetric(false)}
                                        className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-300 touch-manipulation min-h-[48px]"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Mood Modal */}
                {showAddMood && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl p-6 md:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">How are you feeling today?</h3>
                            <div className="space-y-4 md:space-y-6">
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                                    {[
                                        { mood: 'excellent', emoji: '😄', label: 'Excellent' },
                                        { mood: 'good', emoji: '🙂', label: 'Good' },
                                        { mood: 'okay', emoji: '😐', label: 'Okay' },
                                        { mood: 'bad', emoji: '😔', label: 'Bad' },
                                        { mood: 'terrible', emoji: '😢', label: 'Terrible' }
                                    ].map(({ mood, emoji, label }) => (
                                        <button
                                            key={mood}
                                            onClick={() => setNewMood(prev => ({ ...prev, mood: mood as MoodEntry['mood'] }))}
                                            className={`p-3 md:p-4 rounded-2xl transition-all duration-300 touch-manipulation ${
                                                newMood.mood === mood
                                                    ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg transform scale-105'
                                                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                        >
                                            <div className="text-xl md:text-2xl mb-1">{emoji}</div>
                                            <div className="text-xs font-medium">{label}</div>
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    placeholder="Add notes about your mood (optional)"
                                    value={newMood.notes}
                                    onChange={(e) => setNewMood(prev => ({ ...prev, notes: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none text-base touch-manipulation"
                                    rows={3}
                                />
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={addMoodEntry}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl touch-manipulation min-h-[48px]"
                                    >
                                        Save Mood
                                    </button>
                                    <button
                                        onClick={() => setShowAddMood(false)}
                                        className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-300 touch-manipulation min-h-[48px]"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}



                {/* Workout Details Modal */}
                {showWorkoutModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl p-6 md:p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
                                {selectedWorkoutDay ? `Workout for ${getDayName(selectedWorkoutDay.date)}` : 'Add Workout Details'}
                            </h3>
                            <div className="space-y-6">
                                {/* Workout Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Workout Type</label>
                                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-3">
                                        {[
                                            { type: 'cardio', label: 'Cardio', icon: '🏃', color: 'from-red-500 to-pink-500' },
                                            { type: 'strength', label: 'Strength', icon: '💪', color: 'from-blue-500 to-indigo-500' },
                                            { type: 'flexibility', label: 'Flexibility', icon: '🧘', color: 'from-green-500 to-emerald-500' },
                                            { type: 'sports', label: 'Sports', icon: '⚽', color: 'from-yellow-500 to-orange-500' },
                                            { type: 'other', label: 'Other', icon: '🎯', color: 'from-purple-500 to-violet-500' }
                                        ].map(({ type, label, icon, color }) => (
                                            <button
                                                key={type}
                                                onClick={() => setNewWorkout(prev => ({ ...prev, workoutType: type as GymDay['workoutType'] }))}
                                                className={`p-3 md:p-4 rounded-xl md:rounded-2xl transition-all duration-300 ${
                                                    newWorkout.workoutType === type
                                                        ? `bg-gradient-to-br ${color} text-white shadow-lg transform scale-105`
                                                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                }`}
                                            >
                                                <div className="text-lg md:text-2xl mb-1">{icon}</div>
                                                <div className="text-xs font-medium">{label}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Duration */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration (minutes)</label>
                                    <input
                                        type="number"
                                        value={newWorkout.duration}
                                        onChange={(e) => setNewWorkout(prev => ({ ...prev, duration: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-base touch-manipulation"
                                        placeholder="45"
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                    <button
                                        onClick={saveWorkoutDetails}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl touch-manipulation min-h-[48px]"
                                    >
                                        Save Workout
                                    </button>
                                    <button
                                        onClick={() => setShowWorkoutModal(false)}
                                        className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-300 touch-manipulation min-h-[48px]"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HealthHabits; 