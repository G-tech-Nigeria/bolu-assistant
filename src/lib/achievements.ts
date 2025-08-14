import { 
  getAccountabilityTasks, 
  getAccountabilityPenalties, 
  getAccountabilityAchievements, 
  addAccountabilityAchievement,
  getAccountabilityUsers,
  AccountabilityUser 
} from './accountability'
import { format, isToday, isYesterday, startOfWeek, endOfWeek, subDays } from 'date-fns'

// Achievement definitions
export const ACHIEVEMENTS = {
  // Task Completion Achievements
  perfect_day: {
    id: 'perfect_day',
    title: 'Perfect Day',
    description: 'Complete all tasks for the day',
    icon: '🌟',
    points: 10,
    color: 'yellow'
  },
  perfect_week: {
    id: 'perfect_week',
    title: 'Perfect Week',
    description: 'Complete all tasks for 7 consecutive days',
    icon: '⭐',
    points: 100,
    color: 'yellow'
  },
  perfect_month: {
    id: 'perfect_month',
    title: 'Perfect Month',
    description: 'Complete all tasks for 30 consecutive days',
    icon: '💎',
    points: 500,
    color: 'purple'
  },

  // Streak Achievements
  streak_7: {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    points: 25,
    color: 'orange'
  },
  streak_30: {
    id: 'streak_30',
    title: 'Month Master',
    description: 'Maintain a 30-day streak',
    icon: '💎',
    points: 100,
    color: 'purple'
  },
  streak_100: {
    id: 'streak_100',
    title: 'Century Club',
    description: 'Maintain a 100-day streak',
    icon: '👑',
    points: 1000,
    color: 'gold'
  },

  // First Time Achievements
  first_completion: {
    id: 'first_completion',
    title: 'First Steps',
    description: 'Complete your first task',
    icon: '🎯',
    points: 5,
    color: 'green'
  },
  first_proof: {
    id: 'first_proof',
    title: 'Proof Pro',
    description: 'Upload proof for 10 tasks',
    icon: '📸',
    points: 20,
    color: 'blue'
  },

  // Consistency Achievements
  comeback_king: {
    id: 'comeback_king',
    title: 'Comeback King',
    description: 'Go from <50% to 100% completion',
    icon: '⚡',
    points: 15,
    color: 'blue'
  },
  consistency: {
    id: 'consistency',
    title: 'Consistency',
    description: 'Complete 80%+ tasks for 5 consecutive days',
    icon: '📈',
    points: 30,
    color: 'green'
  },

  // Task Count Achievements
  task_master: {
    id: 'task_master',
    title: 'Task Master',
    description: 'Complete 50 tasks total',
    icon: '👑',
    points: 50,
    color: 'purple'
  },
  task_legend: {
    id: 'task_legend',
    title: 'Task Legend',
    description: 'Complete 100 tasks total',
    icon: '🏆',
    points: 100,
    color: 'gold'
  },

  // Time-based Achievements
  early_bird: {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Complete all tasks before noon',
    icon: '🌅',
    points: 15,
    color: 'orange'
  },
  night_owl: {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Complete tasks after 10 PM',
    icon: '🦉',
    points: 10,
    color: 'blue'
  },
  weekend_warrior: {
    id: 'weekend_warrior',
    title: 'Weekend Warrior',
    description: 'Complete all weekend tasks',
    icon: '🏆',
    points: 20,
    color: 'green'
  },

  // Penalty Achievements
  penalty_king: {
    id: 'penalty_king',
    title: 'Penalty King',
    description: 'Most penalties in a week',
    icon: '💸',
    points: 20,
    color: 'red'
  },
  penalty_free: {
    id: 'penalty_free',
    title: 'Penalty Free',
    description: 'Go 7 days without any penalties',
    icon: '🛡️',
    points: 25,
    color: 'green'
  },

  // Special Achievements
  speed_demon: {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Complete 5 tasks in one day',
    icon: '⚡',
    points: 20,
    color: 'orange'
  },
  social_butterfly: {
    id: 'social_butterfly',
    title: 'Social Butterfly',
    description: 'Have 3+ users in the system',
    icon: '🦋',
    points: 15,
    color: 'pink'
  }
}

// Achievement checking functions
export const checkPerfectDay = async (userId: string, date: string) => {
  const tasks = await getAccountabilityTasks()
  const userTasks = tasks.filter(task => task.userId === userId && task.date === date)
  
  if (userTasks.length === 0) return false
  return userTasks.every(task => task.completed)
}

export const checkPerfectWeek = async (userId: string, endDate: string) => {
  const tasks = await getAccountabilityTasks()
  const endDateObj = new Date(endDate)
  
  for (let i = 0; i < 7; i++) {
    const checkDate = subDays(endDateObj, i)
    const dateStr = format(checkDate, 'yyyy-MM-dd')
    const dayTasks = tasks.filter(task => task.userId === userId && task.date === dateStr)
    
    if (dayTasks.length === 0) return false
    if (!dayTasks.every(task => task.completed)) return false
  }
  
  return true
}

export const checkStreak = async (userId: string, currentDate: string) => {
  const tasks = await getAccountabilityTasks()
  const currentDateObj = new Date(currentDate)
  let streak = 0
  
  for (let i = 0; i < 100; i++) {
    const checkDate = subDays(currentDateObj, i)
    const dateStr = format(checkDate, 'yyyy-MM-dd')
    const dayTasks = tasks.filter(task => task.userId === userId && task.date === dateStr)
    
    if (dayTasks.length === 0) break
    if (!dayTasks.every(task => task.completed)) break
    
    streak++
  }
  
  return streak
}

export const checkFirstCompletion = async (userId: string) => {
  const tasks = await getAccountabilityTasks()
  const userCompletedTasks = tasks.filter(task => task.userId === userId && task.completed)
  return userCompletedTasks.length === 1
}

export const checkProofUploads = async (userId: string) => {
  const tasks = await getAccountabilityTasks()
  const userTasksWithProof = tasks.filter(task => task.userId === userId && task.proof_image)
  return userTasksWithProof.length >= 10
}

export const checkComebackKing = async (userId: string, currentDate: string) => {
  const tasks = await getAccountabilityTasks()
  const currentDateObj = new Date(currentDate)
  const yesterday = subDays(currentDateObj, 1)
  const yesterdayStr = format(yesterday, 'yyyy-MM-dd')
  
  const yesterdayTasks = tasks.filter(task => task.userId === userId && task.date === yesterdayStr)
  const todayTasks = tasks.filter(task => task.userId === userId && task.date === currentDate)
  
  if (yesterdayTasks.length === 0 || todayTasks.length === 0) return false
  
  const yesterdayCompletion = yesterdayTasks.filter(task => task.completed).length / yesterdayTasks.length
  const todayCompletion = todayTasks.filter(task => task.completed).length / todayTasks.length
  
  return yesterdayCompletion < 0.5 && todayCompletion === 1
}

export const checkConsistency = async (userId: string, currentDate: string) => {
  const tasks = await getAccountabilityTasks()
  const currentDateObj = new Date(currentDate)
  
  for (let i = 0; i < 5; i++) {
    const checkDate = subDays(currentDateObj, i)
    const dateStr = format(checkDate, 'yyyy-MM-dd')
    const dayTasks = tasks.filter(task => task.userId === userId && task.date === dateStr)
    
    if (dayTasks.length === 0) return false
    
    const completionRate = dayTasks.filter(task => task.completed).length / dayTasks.length
    if (completionRate < 0.8) return false
  }
  
  return true
}

export const checkTaskCount = async (userId: string, targetCount: number) => {
  const tasks = await getAccountabilityTasks()
  const userCompletedTasks = tasks.filter(task => task.userId === userId && task.completed)
  return userCompletedTasks.length >= targetCount
}

export const checkEarlyBird = async (userId: string, date: string) => {
  const tasks = await getAccountabilityTasks()
  const userTasks = tasks.filter(task => task.userId === userId && task.date === date)
  
  if (userTasks.length === 0) return false
  
  // Check if all tasks were completed before noon (simplified check)
  return userTasks.every(task => task.completed)
}

export const checkNightOwl = async (userId: string, date: string) => {
  const tasks = await getAccountabilityTasks()
  const userTasks = tasks.filter(task => task.userId === userId && task.date === date)
  
  if (userTasks.length === 0) return false
  
  // Check if any tasks were completed (simplified check)
  return userTasks.some(task => task.completed)
}

export const checkWeekendWarrior = async (userId: string, date: string) => {
  const tasks = await getAccountabilityTasks()
  const currentDateObj = new Date(date)
  const dayOfWeek = currentDateObj.getDay()
  
  // Check if it's weekend (Saturday = 6, Sunday = 0)
  if (dayOfWeek !== 0 && dayOfWeek !== 6) return false
  
  const userTasks = tasks.filter(task => task.userId === userId && task.date === date)
  if (userTasks.length === 0) return false
  
  return userTasks.every(task => task.completed)
}

export const checkPenaltyKing = async (userId: string, currentDate: string) => {
  const penalties = await getAccountabilityPenalties()
  const currentDateObj = new Date(currentDate)
  const weekStart = startOfWeek(currentDateObj)
  const weekEnd = endOfWeek(currentDateObj)
  
  const weekPenalties = penalties.filter(penalty => {
    const penaltyDate = new Date(penalty.date)
    return penaltyDate >= weekStart && penaltyDate <= weekEnd
  })
  
  const userPenalties = weekPenalties.filter(penalty => penalty.userId === userId)
  const allUsers = await getAccountabilityUsers()
  
  // Check if this user has the most penalties
  let maxPenalties = 0
  for (const user of allUsers) {
    const userPenaltyCount = weekPenalties.filter(penalty => penalty.userId === user.id).length
    if (userPenaltyCount > maxPenalties) {
      maxPenalties = userPenaltyCount
    }
  }
  
  return userPenalties.length === maxPenalties && userPenalties.length > 0
}

export const checkPenaltyFree = async (userId: string, currentDate: string) => {
  const penalties = await getAccountabilityPenalties()
  const currentDateObj = new Date(currentDate)
  
  for (let i = 0; i < 7; i++) {
    const checkDate = subDays(currentDateObj, i)
    const dateStr = format(checkDate, 'yyyy-MM-dd')
    const dayPenalties = penalties.filter(penalty => penalty.userId === userId && penalty.date === dateStr)
    
    if (dayPenalties.length > 0) return false
  }
  
  return true
}

export const checkSpeedDemon = async (userId: string, date: string) => {
  const tasks = await getAccountabilityTasks()
  const userCompletedTasks = tasks.filter(task => task.userId === userId && task.date === date && task.completed)
  return userCompletedTasks.length >= 5
}

export const checkSocialButterfly = async () => {
  const users = await getAccountabilityUsers()
  return users.length >= 3
}

// Main achievement checking function
export const checkAllAchievements = async (userId: string, currentDate: string) => {
  const unlockedAchievements = await getAccountabilityAchievements()
  const userUnlockedAchievements = unlockedAchievements.filter(achievement => achievement.user_id === userId)
  const unlockedAchievementIds = userUnlockedAchievements.map(achievement => achievement.achievement_id)
  
  const newAchievements = []
  
  // Check each achievement
  for (const [achievementId, achievement] of Object.entries(ACHIEVEMENTS)) {
    if (unlockedAchievementIds.includes(achievementId)) continue
    
    let shouldUnlock = false
    
    switch (achievementId) {
      case 'perfect_day':
        shouldUnlock = await checkPerfectDay(userId, currentDate)
        break
      case 'perfect_week':
        shouldUnlock = await checkPerfectWeek(userId, currentDate)
        break
      case 'streak_7':
        const streak7 = await checkStreak(userId, currentDate)
        shouldUnlock = streak7 >= 7
        break
      case 'streak_30':
        const streak30 = await checkStreak(userId, currentDate)
        shouldUnlock = streak30 >= 30
        break
      case 'streak_100':
        const streak100 = await checkStreak(userId, currentDate)
        shouldUnlock = streak100 >= 100
        break
      case 'first_completion':
        shouldUnlock = await checkFirstCompletion(userId)
        break
      case 'first_proof':
        shouldUnlock = await checkProofUploads(userId)
        break
      case 'comeback_king':
        shouldUnlock = await checkComebackKing(userId, currentDate)
        break
      case 'consistency':
        shouldUnlock = await checkConsistency(userId, currentDate)
        break
      case 'task_master':
        shouldUnlock = await checkTaskCount(userId, 50)
        break
      case 'task_legend':
        shouldUnlock = await checkTaskCount(userId, 100)
        break
      case 'early_bird':
        shouldUnlock = await checkEarlyBird(userId, currentDate)
        break
      case 'night_owl':
        shouldUnlock = await checkNightOwl(userId, currentDate)
        break
      case 'weekend_warrior':
        shouldUnlock = await checkWeekendWarrior(userId, currentDate)
        break
      case 'penalty_king':
        shouldUnlock = await checkPenaltyKing(userId, currentDate)
        break
      case 'penalty_free':
        shouldUnlock = await checkPenaltyFree(userId, currentDate)
        break
      case 'speed_demon':
        shouldUnlock = await checkSpeedDemon(userId, currentDate)
        break
      case 'social_butterfly':
        shouldUnlock = await checkSocialButterfly()
        break
    }
    
    if (shouldUnlock) {
      const newAchievement = await addAccountabilityAchievement({
        user_id: userId,
        achievement_id: achievementId,
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        points: achievement.points,
        unlocked_at: new Date().toISOString()
      })
      
      if (newAchievement) {
        newAchievements.push(achievement)
        
        // Dispatch achievement unlocked event
        window.dispatchEvent(new CustomEvent('achievementUnlocked', {
          detail: { achievement }
        }))
      }
    }
  }
  
  return newAchievements
}

// Get user achievements
export const getUserAchievements = async (userId: string) => {
  const unlockedAchievements = await getAccountabilityAchievements()
  const userUnlockedAchievements = unlockedAchievements.filter(achievement => achievement.user_id === userId)
  
  return userUnlockedAchievements.map(userAchievement => {
    const achievement = ACHIEVEMENTS[userAchievement.achievement_id as keyof typeof ACHIEVEMENTS]
    return {
      ...achievement,
      unlocked_at: userAchievement.unlocked_at
    }
  })
}
