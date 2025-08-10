import { supabase } from './supabase'

// ===== CALENDAR EVENTS =====
export const getCalendarEvents = async () => {
  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .order('start_date', { ascending: true })
  
  if (error) throw error
  return data || []
}

export const addCalendarEvent = async (event: any) => {
  const { data, error } = await supabase
    .from('calendar_events')
    .insert([{
      title: event.title,
      description: event.description,
      start_date: event.startDate,
      end_date: event.endDate,
      category: event.category
    }])
    .select()
  
  if (error) throw error
  return data[0]
}

export const updateCalendarEvent = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('calendar_events')
    .update({
      title: updates.title,
      description: updates.description,
      start_date: updates.startDate,
      end_date: updates.endDate,
      category: updates.category,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteCalendarEvent = async (id: string) => {
  const { error } = await supabase
    .from('calendar_events')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// ===== AGENDA TASKS =====
export const getAgendaTasks = async (date: string) => {
  const { data, error } = await supabase
    .from('agenda_tasks')
    .select('*')
    .eq('date', date)
    .order('created_at', { ascending: true })
  
  if (error) throw error
  return data || []
}

export const addAgendaTask = async (task: any) => {
  const { data, error } = await supabase
    .from('agenda_tasks')
    .insert([{
      title: task.title,
      description: task.description,
      completed: task.completed || false,
      date: task.date,
      priority: task.priority || 'medium'
    }])
    .select()
  
  if (error) throw error
  return data[0]
}

export const updateAgendaTask = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('agenda_tasks')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteAgendaTask = async (id: string) => {
  const { error } = await supabase
    .from('agenda_tasks')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

export const clearAgendaTasksForDate = async (date: string) => {
  const { error } = await supabase
    .from('agenda_tasks')
    .delete()
    .eq('date', date)
  
  if (error) {
    console.error('Error clearing agenda tasks for date:', date, error)
    throw error
  }
  return { success: true }
}

export const clearAllAgendaTasks = async () => {
  const { error } = await supabase
    .from('agenda_tasks')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all
  
  if (error) {
    console.error('Error clearing all agenda tasks:', error)
    throw error
  }
  return { success: true }
}

// ===== DEV ROADMAP FUNCTIONS =====

// ===== PHASES =====
export const getDevRoadmapPhases = async () => {
  const { data, error } = await supabase
    .from('dev_roadmap_phases')
    .select('*')
    .order('created_at', { ascending: true })
  
  if (error) throw error
  return data || []
}

export const addDevRoadmapPhase = async (phase: any) => {
  const { data, error } = await supabase
    .from('dev_roadmap_phases')
    .insert([{
      title: phase.title,
      description: phase.description,
      start_date: phase.startDate,
      end_date: phase.endDate,
      weeks: phase.weeks,
      progress: phase.progress || 0,
      status: phase.status || 'not-started',
      leetcode_target: phase.leetCodeTarget || 0,
      leetcode_completed: phase.leetCodeCompleted || 0
    }])
    .select()
  
  if (error) throw error
  return data[0]
}

export const updateDevRoadmapPhase = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('dev_roadmap_phases')
    .update({
      title: updates.title,
      description: updates.description,
      start_date: updates.startDate,
      end_date: updates.endDate,
      weeks: updates.weeks,
      progress: updates.progress,
      status: updates.status,
      leetcode_target: updates.leetCodeTarget,
      leetcode_completed: updates.leetCodeCompleted,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteDevRoadmapPhase = async (id: string) => {
  const { error } = await supabase
    .from('dev_roadmap_phases')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// ===== TOPICS =====
export const getDevRoadmapTopics = async (phaseId?: string) => {
  let query = supabase
    .from('dev_roadmap_topics')
    .select('*')
  
  if (phaseId) {
    query = query.eq('phase_id', phaseId)
  }
  
  const { data, error } = await query.order('order_index', { ascending: true })
  
  if (error) throw error
  return data || []
}

export const addDevRoadmapTopic = async (topic: any) => {
  const { data, error } = await supabase
    .from('dev_roadmap_topics')
    .insert([{
      phase_id: topic.phaseId,
      name: topic.name,
      description: topic.description,
      completed: topic.completed || false,
      order_index: topic.orderIndex || 0
    }])
    .select()
  
  if (error) throw error
  return data[0]
}

export const updateDevRoadmapTopic = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('dev_roadmap_topics')
    .update({
      name: updates.name,
      description: updates.description,
      completed: updates.completed,
      order_index: updates.orderIndex,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteDevRoadmapTopic = async (id: string) => {
  const { error } = await supabase
    .from('dev_roadmap_topics')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// ===== RESOURCES =====
export const getDevRoadmapResources = async (topicId?: string) => {
  let query = supabase
    .from('dev_roadmap_resources')
    .select('*')
  
  if (topicId) {
    query = query.eq('topic_id', topicId)
  }
  
  const { data, error } = await query.order('order_index', { ascending: true })
  
  if (error) throw error
  return data || []
}

export const addDevRoadmapResource = async (resource: any) => {
  const { data, error } = await supabase
    .from('dev_roadmap_resources')
    .insert([{
      topic_id: resource.topicId,
      name: resource.name,
      url: resource.url,
      type: resource.type || 'documentation',
      completed: resource.completed || false,
      order_index: resource.orderIndex || 0
    }])
    .select()
  
  if (error) throw error
  return data[0]
}

export const updateDevRoadmapResource = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('dev_roadmap_resources')
    .update({
      name: updates.name,
      url: updates.url,
      type: updates.type,
      completed: updates.completed,
      order_index: updates.orderIndex,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteDevRoadmapResource = async (id: string) => {
  const { error } = await supabase
    .from('dev_roadmap_resources')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// ===== PROJECTS =====
export const getDevRoadmapProjects = async (phaseId?: string) => {
  let query = supabase
    .from('dev_roadmap_projects')
    .select('*')
  
  if (phaseId) {
    query = query.eq('phase_id', phaseId)
  }
  
  const { data, error } = await query.order('order_index', { ascending: true })
  
  if (error) throw error
  return data || []
}

export const addDevRoadmapProject = async (project: any) => {
  const { data, error } = await supabase
    .from('dev_roadmap_projects')
    .insert([{
      phase_id: project.phaseId,
      name: project.name,
      description: project.description,
      status: project.status || 'not-started',
      github_url: project.githubUrl,
      live_url: project.liveUrl,
      technologies: project.technologies || [],
      is_custom: project.isCustom || false,
      order_index: project.orderIndex || 0
    }])
    .select()
  
  if (error) throw error
  return data[0]
}

export const updateDevRoadmapProject = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('dev_roadmap_projects')
    .update({
      name: updates.name,
      description: updates.description,
      status: updates.status,
      github_url: updates.githubUrl,
      live_url: updates.liveUrl,
      technologies: updates.technologies,
      is_custom: updates.isCustom,
      order_index: updates.orderIndex,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteDevRoadmapProject = async (id: string) => {
  const { error } = await supabase
    .from('dev_roadmap_projects')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// ===== DAILY LOGS =====
export const getDevRoadmapDailyLogs = async (date?: string) => {
  let query = supabase
    .from('dev_roadmap_daily_logs')
    .select('*')
  
  if (date) {
    query = query.eq('date', date)
  }
  
  const { data, error } = await query.order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export const addDevRoadmapDailyLog = async (log: any) => {
  // Check if a log already exists for this date
  const { data: existingLog } = await supabase
    .from('dev_roadmap_daily_logs')
    .select('*')
    .eq('date', log.date)
    .limit(1)
  
  const logData = {
    date: log.date,
    phase_id: log.phaseId && log.phaseId !== '' ? log.phaseId : null,
    topic_id: log.topicId && log.topicId !== '' ? log.topicId : null,
    project_id: log.projectId && log.projectId !== '' ? log.projectId : null,
    hours_spent: log.hoursSpent || 0,
    activities: log.activities,
    leetcode_problems: log.leetCodeProblems || 0,
    key_takeaway: log.keyTakeaway,
    reading_minutes: log.readingMinutes,
    project_work_minutes: log.projectWorkMinutes,
    leetcode_minutes: log.leetCodeMinutes,
    networking_minutes: log.networkingMinutes
  }
  
  let data, error
  
  if (existingLog && existingLog.length > 0) {
    // Update existing log - accumulate hours and combine activities
    const existing = existingLog[0]
    const updatedLogData = {
      ...logData,
      hours_spent: (existing.hours_spent || 0) + (log.hoursSpent || 0),
      leetcode_problems: (existing.leetcode_problems || 0) + (log.leetCodeProblems || 0),
      activities: existing.activities 
        ? `${existing.activities}\n${log.activities}`
        : log.activities,
      key_takeaway: log.keyTakeaway || existing.key_takeaway,
      reading_minutes: (existing.reading_minutes || 0) + (log.readingMinutes || 0),
      project_work_minutes: (existing.project_work_minutes || 0) + (log.projectWorkMinutes || 0),
      leetcode_minutes: (existing.leetcode_minutes || 0) + (log.leetCodeMinutes || 0),
      networking_minutes: (existing.networking_minutes || 0) + (log.networkingMinutes || 0)
    }
    
    const result = await supabase
      .from('dev_roadmap_daily_logs')
      .update(updatedLogData)
      .eq('id', existing.id)
      .select()
    
    data = result.data
    error = result.error
  } else {
    // Create new log
    const result = await supabase
      .from('dev_roadmap_daily_logs')
      .insert([logData])
      .select()
    
    data = result.data
    error = result.error
  }
  
  if (error) throw error
  return data?.[0] || null
}

export const updateDevRoadmapDailyLog = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('dev_roadmap_daily_logs')
    .update({
      date: updates.date,
      phase_id: updates.phaseId && updates.phaseId !== '' ? updates.phaseId : null,
      topic_id: updates.topicId && updates.topicId !== '' ? updates.topicId : null,
      project_id: updates.projectId && updates.projectId !== '' ? updates.projectId : null,
      hours_spent: updates.hoursSpent,
      activities: updates.activities,
      leetcode_problems: updates.leetCodeProblems,
      key_takeaway: updates.keyTakeaway,
      reading_minutes: updates.readingMinutes,
      project_work_minutes: updates.projectWorkMinutes,
      leetcode_minutes: updates.leetCodeMinutes,
      networking_minutes: updates.networkingMinutes,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteDevRoadmapDailyLog = async (id: string) => {
  const { error } = await supabase
    .from('dev_roadmap_daily_logs')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// ===== ACHIEVEMENTS =====
export const getDevRoadmapAchievements = async () => {
  const { data, error } = await supabase
    .from('dev_roadmap_achievements')
    .select('*')
    .order('order_index', { ascending: true })
  
  if (error) throw error
  return data || []
}

export const addDevRoadmapAchievement = async (achievement: any) => {
  const { data, error } = await supabase
    .from('dev_roadmap_achievements')
    .insert([{
      id: achievement.id,
      title: achievement.title,
      description: achievement.description,
      icon: achievement.icon,
      unlocked: achievement.unlocked || false,
      unlocked_date: achievement.unlockedDate,
      requirement: achievement.requirement,
      category: achievement.category,
      points: achievement.points || 0,
      next_achievement: achievement.nextAchievement,
      is_active: achievement.isActive !== false,
      order_index: achievement.orderIndex || 0
    }])
    .select()
  
  if (error) throw error
  return data[0]
}

export const updateDevRoadmapAchievement = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('dev_roadmap_achievements')
    .update({
      title: updates.title,
      description: updates.description,
      icon: updates.icon,
      unlocked: updates.unlocked,
      unlocked_date: updates.unlockedDate,
      requirement: updates.requirement,
      category: updates.category,
      points: updates.points,
      next_achievement: updates.nextAchievement,
      is_active: updates.isActive,
      order_index: updates.orderIndex,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteDevRoadmapAchievement = async (id: string) => {
  const { error } = await supabase
    .from('dev_roadmap_achievements')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// ===== USER STATS =====
export const getDevRoadmapUserStats = async () => {
  const { data, error } = await supabase
    .from('dev_roadmap_user_stats')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
  
  if (error) throw error
  return data?.[0] || null
}

export const updateDevRoadmapUserStats = async (updates: any) => {
  const { data, error } = await supabase
    .from('dev_roadmap_user_stats')
    .update({
      total_hours: updates.totalHours,
      total_leetcode_solved: updates.totalLeetCodeSolved,
      current_streak: updates.currentStreak,
      longest_streak: updates.longestStreak,
      total_points: updates.totalPoints,
      total_achievements_unlocked: updates.totalAchievementsUnlocked,
      total_projects_completed: updates.totalProjectsCompleted,
      total_topics_completed: updates.totalTopicsCompleted,
      total_phases_completed: updates.totalPhasesCompleted,
      last_activity_date: updates.lastActivityDate,
      updated_at: new Date().toISOString()
    })
    .eq('id', updates.id)
    .select()
  
  if (error) throw error
  return data[0]
}

// Manual stats recalculation function
export const recalculateUserStats = async () => {
  try {

    
    // Get all daily logs
    const { data: logs, error: logsError } = await supabase
      .from('dev_roadmap_daily_logs')
      .select('*')
      .order('date', { ascending: false })
    
    if (logsError) throw logsError
    
    // Get achievements
    const { data: achievements, error: achievementsError } = await supabase
      .from('dev_roadmap_achievements')
      .select('*')
      .eq('unlocked', true)
    
    if (achievementsError) throw achievementsError
    
    // Get projects
    const { data: projects, error: projectsError } = await supabase
      .from('dev_roadmap_projects')
      .select('*')
      .eq('status', 'completed')
    
    if (projectsError) throw projectsError
    
    // Get topics
    const { data: topics, error: topicsError } = await supabase
      .from('dev_roadmap_topics')
      .select('*')
      .eq('completed', true)
    
    if (topicsError) throw topicsError
    
    // Get phases
    const { data: phases, error: phasesError } = await supabase
      .from('dev_roadmap_phases')
      .select('*')
      .eq('status', 'completed')
    
    if (phasesError) throw phasesError
    
    // Calculate totals
    const totalHours = logs.reduce((sum, log) => sum + (log.hours_spent || 0), 0)
    const totalLeetCode = logs.reduce((sum, log) => sum + (log.leetcode_problems || 0), 0)
    const totalPoints = achievements.reduce((sum, achievement) => sum + (achievement.points || 0), 0)
    
    // Calculate current streak
    let currentStreak = 0
    if (logs.length > 0) {
      const sortedLogs = logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      
      // Get unique dates (in case of multiple logs per day)
      const uniqueDates = [...new Set(sortedLogs.map(log => log.date))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      
      if (uniqueDates.length > 0) {
        // Get the most recent log date as starting point
        const mostRecentLogDate = uniqueDates[0]
        
        // Check if the most recent log is today or yesterday
        const today = new Date().toISOString().split('T')[0]
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        
        if (mostRecentLogDate === today || mostRecentLogDate === yesterday) {
          // Start counting from the most recent log date
          // Use a simple string-based approach to avoid timezone issues
          let currentDate = mostRecentLogDate
          
          // Count consecutive days backwards
          for (let i = 0; i < 365; i++) { // Max 365 days to prevent infinite loop
            const hasLog = uniqueDates.includes(currentDate)
            
            if (hasLog) {
              currentStreak++
              // Move to previous day by manipulating the date string
              const date = new Date(currentDate + 'T12:00:00') // Use noon to avoid timezone issues
              date.setDate(date.getDate() - 1)
              currentDate = date.toISOString().split('T')[0]
            } else {
              break
            }
          }
        }
      }
    }
    
    // Calculate longest streak (simplified version)
    const longestStreak = Math.max(currentStreak, 0) // For now, use current streak
    
    const updatedStats = {
      total_hours: totalHours,
      total_leetcode_solved: totalLeetCode,
      total_points: totalPoints,
      total_achievements_unlocked: achievements.length,
      current_streak: currentStreak,
      longest_streak: longestStreak,
      total_projects_completed: projects.length,
      total_topics_completed: topics.length,
      total_phases_completed: phases.length,
      last_activity_date: logs.length > 0 ? logs[0].date : null
    }
    

    
    // Update the stats in the database
    // First, get ALL user stats records to clean up duplicates
    const { data: allStats } = await supabase
      .from('dev_roadmap_user_stats')
      .select('*')
      .order('updated_at', { ascending: false })
    
    let data, error
    
    if (allStats && allStats.length > 0) {
      // Keep the most recent record, delete the rest
      const mostRecent = allStats[0]
      
      // If there are duplicates, clean them up
      if (allStats.length > 1) {

        
        // Delete all except the most recent
        for (let i = 1; i < allStats.length; i++) {
          await supabase
            .from('dev_roadmap_user_stats')
            .delete()
            .eq('id', allStats[i].id)
        }
        

      }
      
      // Update the remaining (most recent) record
      const result = await supabase
        .from('dev_roadmap_user_stats')
        .update(updatedStats)
        .eq('id', mostRecent.id)
        .select()
      
      data = result.data
      error = result.error
    } else {
      // Create the first record (should only happen once ever)
      
      const result = await supabase
        .from('dev_roadmap_user_stats')
        .insert([updatedStats])
        .select()
      
      data = result.data
      error = result.error
    }
    
    if (error) throw error
    

    return data?.[0] || updatedStats
    
  } catch (error) {
    console.error('Error recalculating stats:', error)
    throw error
  }
}

// ===== STUDY SESSIONS =====
export const getDevRoadmapStudySessions = async (date?: string) => {
  let query = supabase
    .from('dev_roadmap_study_sessions')
    .select('*')
  
  if (date) {
    query = query.gte('start_time', `${date}T00:00:00`).lt('start_time', `${date}T23:59:59`)
  }
  
  const { data, error } = await query.order('start_time', { ascending: false })
  
  if (error) throw error
  return data || []
}

export const addDevRoadmapStudySession = async (session: any) => {
  const { data, error } = await supabase
    .from('dev_roadmap_study_sessions')
    .insert([{
      start_time: session.startTime,
      end_time: session.endTime,
      duration_minutes: session.durationMinutes,
      mode: session.mode || 'focus',
      completed: session.completed || false,
      phase_id: session.phaseId,
      topic_id: session.topicId,
      project_id: session.projectId
    }])
    .select()
  
  if (error) throw error
  return data[0]
}

export const updateDevRoadmapStudySession = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('dev_roadmap_study_sessions')
    .update({
      start_time: updates.startTime,
      end_time: updates.endTime,
      duration_minutes: updates.durationMinutes,
      mode: updates.mode,
      completed: updates.completed,
      phase_id: updates.phaseId,
      topic_id: updates.topicId,
      project_id: updates.projectId
    })
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteDevRoadmapStudySession = async (id: string) => {
  const { error } = await supabase
    .from('dev_roadmap_study_sessions')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// ===== MIGRATION FUNCTIONS FOR DEV ROADMAP =====
export const migrateDevRoadmapData = async () => {
  
  
  const results = {
    phases: await migrateDevRoadmapPhases(),
    achievements: await migrateDevRoadmapAchievements(),
    userStats: await migrateDevRoadmapUserStats()
  }

  
  return results
}

// New function to migrate default data (phases and achievements)
export const migrateDefaultDevRoadmapData = async () => {
  
  
  try {
    // Insert all 5 phases
    const phases = [
      {
        title: 'Phase 1: Web Foundations & Frontend Development',
        description: 'Master HTML, CSS, JavaScript, React, and Next.js',
        start_date: '2025-08-08',
        end_date: '2025-10-03',
        weeks: 8,
        progress: 0,
        status: 'not-started',
        leetcode_target: 20,
        leetcode_completed: 0
      },
      {
        title: 'Phase 2: Backend Development with Node.js & TypeScript',
        description: 'Build robust APIs, authentication systems, and real-time apps',
        start_date: '2025-10-04',
        end_date: '2025-11-28',
        weeks: 8,
        progress: 0,
        status: 'not-started',
        leetcode_target: 30,
        leetcode_completed: 0
      },
      {
        title: 'Phase 3: DevOps & Cloud Services',
        description: 'Deploy applications, manage infrastructure, and implement CI/CD',
        start_date: '2025-11-29',
        end_date: '2025-12-27',
        weeks: 4,
        progress: 0,
        status: 'not-started',
        leetcode_target: 15,
        leetcode_completed: 0
      },
      {
        title: 'Phase 4: Advanced Topics & Specializations',
        description: 'Master advanced concepts and choose your specialization',
        start_date: '2025-12-28',
        end_date: '2026-01-24',
        weeks: 4,
        progress: 0,
        status: 'not-started',
        leetcode_target: 20,
        leetcode_completed: 0
      },
      {
        title: 'Phase 5: Interview Preparation & Job Search',
        description: 'Prepare for technical interviews and land your dream job',
        start_date: '2026-01-25',
        end_date: '2026-02-21',
        weeks: 4,
        progress: 0,
        status: 'not-started',
        leetcode_target: 25,
        leetcode_completed: 0
      }
    ]

    const { data: phaseData, error: phaseError } = await supabase
      .from('dev_roadmap_phases')
      .insert(phases)
      .select()

    if (phaseError) {
      console.error('Phase migration error:', phaseError)
      return { success: false, error: phaseError }
    }

    // Insert all 54 achievements
    const achievements = [
      // Daily & Streak Achievements
      { id: 'first-day', title: 'First Steps', description: 'Complete your first day of learning', icon: '🎯', unlocked: false, requirement: 'Log your first day of progress', category: 'daily', points: 10, is_active: true, order_index: 1 },
      { id: 'week-streak', title: 'Week Warrior', description: 'Maintain a 7-day learning streak', icon: '🔥', unlocked: false, requirement: 'Learn for 7 consecutive days', category: 'streak', points: 50, is_active: true, order_index: 2 },
      { id: 'month-streak', title: 'Monthly Master', description: 'Maintain a 30-day learning streak', icon: '📅', unlocked: false, requirement: 'Learn for 30 consecutive days', category: 'streak', points: 200, is_active: true, order_index: 3 },
      { id: 'quarter-streak', title: 'Quarter Champion', description: 'Maintain a 90-day learning streak', icon: '🏆', unlocked: false, requirement: 'Learn for 90 consecutive days', category: 'streak', points: 500, is_active: true, order_index: 4 },
      
      // LeetCode Achievements
      { id: 'leetcode-5', title: 'Problem Starter', description: 'Solve 5 LeetCode problems', icon: '💻', unlocked: false, requirement: 'Complete 5 LeetCode problems', category: 'leetcode', points: 25, is_active: true, order_index: 5 },
      { id: 'leetcode-10', title: 'Problem Solver', description: 'Solve 10 LeetCode problems', icon: '⚡', unlocked: false, requirement: 'Complete 10 LeetCode problems', category: 'leetcode', points: 50, is_active: true, order_index: 6 },
      { id: 'leetcode-25', title: 'Code Warrior', description: 'Solve 25 LeetCode problems', icon: '🛡️', unlocked: false, requirement: 'Complete 25 LeetCode problems', category: 'leetcode', points: 100, is_active: true, order_index: 7 },
      { id: 'leetcode-50', title: 'Algorithm Master', description: 'Solve 50 LeetCode problems', icon: '🧠', unlocked: false, requirement: 'Complete 50 LeetCode problems', category: 'leetcode', points: 200, is_active: true, order_index: 8 },
      { id: 'leetcode-100', title: 'LeetCode Legend', description: 'Solve 100 LeetCode problems', icon: '👑', unlocked: false, requirement: 'Complete 100 LeetCode problems', category: 'leetcode', points: 500, is_active: true, order_index: 9 },
      
      // Project Achievements
      { id: 'first-project', title: 'Project Creator', description: 'Complete your first project', icon: '🚀', unlocked: false, requirement: 'Mark your first project as completed', category: 'project', points: 100, is_active: true, order_index: 10 },
      { id: 'project-3', title: 'Triple Threat', description: 'Complete 3 projects', icon: '🎯', unlocked: false, requirement: 'Complete 3 projects', category: 'project', points: 200, is_active: true, order_index: 11 },
      { id: 'project-5', title: 'Project Portfolio', description: 'Complete 5 projects', icon: '📁', unlocked: false, requirement: 'Complete 5 projects', category: 'project', points: 300, is_active: true, order_index: 12 },
      { id: 'project-10', title: 'Project Master', description: 'Complete 10 projects', icon: '🏗️', unlocked: false, requirement: 'Complete 10 projects', category: 'project', points: 500, is_active: true, order_index: 13 },
      
      // Phase Achievements
      { id: 'phase-1-complete', title: 'Phase 1 Champion', description: 'Complete Phase 1', icon: '🥇', unlocked: false, requirement: 'Complete all topics and projects in Phase 1', category: 'phase', points: 300, is_active: true, order_index: 14 },
      { id: 'phase-2-complete', title: 'Phase 2 Champion', description: 'Complete Phase 2', icon: '🥈', unlocked: false, requirement: 'Complete all topics and projects in Phase 2', category: 'phase', points: 400, is_active: true, order_index: 15 },
      { id: 'phase-3-complete', title: 'Phase 3 Champion', description: 'Complete Phase 3', icon: '🥉', unlocked: false, requirement: 'Complete all topics and projects in Phase 3', category: 'phase', points: 500, is_active: true, order_index: 16 },
      { id: 'phase-4-complete', title: 'Phase 4 Champion', description: 'Complete Phase 4', icon: '💎', unlocked: false, requirement: 'Complete all topics and projects in Phase 4', category: 'phase', points: 600, is_active: true, order_index: 17 },
      { id: 'phase-5-complete', title: 'Phase 5 Champion', description: 'Complete Phase 5', icon: '👑', unlocked: false, requirement: 'Complete all topics and projects in Phase 5', category: 'phase', points: 700, is_active: true, order_index: 18 },
      
      // Time-based Achievements
      { id: 'hours-10', title: 'Dedicated Learner', description: 'Log 10 hours of learning', icon: '⏰', unlocked: false, requirement: 'Log 10 total hours', category: 'time', points: 50, is_active: true, order_index: 19 },
      { id: 'hours-50', title: 'Time Master', description: 'Log 50 hours of learning', icon: '⌛', unlocked: false, requirement: 'Log 50 total hours', category: 'time', points: 200, is_active: true, order_index: 20 },
      { id: 'hours-100', title: 'Century Club', description: 'Log 100 hours of learning', icon: '💯', unlocked: false, requirement: 'Log 100 total hours', category: 'time', points: 400, is_active: true, order_index: 21 },
      { id: 'hours-500', title: 'Learning Legend', description: 'Log 500 hours of learning', icon: '🌟', unlocked: false, requirement: 'Log 500 total hours', category: 'time', points: 1000, is_active: true, order_index: 22 },
      
      // Topic Achievements
      { id: 'topics-5', title: 'Knowledge Seeker', description: 'Complete 5 topics', icon: '📖', unlocked: false, requirement: 'Complete 5 topics', category: 'progress', points: 100, is_active: true, order_index: 23 },
      { id: 'topics-10', title: 'Knowledge Hunter', description: 'Complete 10 topics', icon: '🔍', unlocked: false, requirement: 'Complete 10 topics', category: 'progress', points: 200, is_active: true, order_index: 24 },
      { id: 'topics-20', title: 'Knowledge Master', description: 'Complete 20 topics', icon: '🎓', unlocked: false, requirement: 'Complete 20 topics', category: 'progress', points: 400, is_active: true, order_index: 25 },
      
      // Special Achievements
      { id: 'perfect-day', title: 'Perfect Day', description: 'Log 8+ hours in a single day', icon: '⭐', unlocked: false, requirement: 'Log 8+ hours in one day', category: 'special', points: 100, is_active: true, order_index: 26 },
      { id: 'weekend-warrior', title: 'Weekend Warrior', description: 'Learn on 5 consecutive weekends', icon: '🏃', unlocked: false, requirement: 'Learn on 5 weekends in a row', category: 'special', points: 150, is_active: true, order_index: 27 },
      { id: 'early-bird', title: 'Early Bird', description: 'Log progress before 8 AM', icon: '🌅', unlocked: false, requirement: 'Log progress before 8 AM', category: 'special', points: 50, is_active: true, order_index: 28 },
      { id: 'night-owl', title: 'Night Owl', description: 'Log progress after 10 PM', icon: '🦉', unlocked: false, requirement: 'Log progress after 10 PM', category: 'special', points: 50, is_active: true, order_index: 29 },
      
      // Milestone Achievements
      { id: 'first-week', title: 'First Week', description: 'Complete your first week of learning', icon: '📅', unlocked: false, requirement: 'Complete 7 days of learning', category: 'milestone', points: 75, is_active: true, order_index: 30 },
      { id: 'first-month', title: 'First Month', description: 'Complete your first month of learning', icon: '🗓️', unlocked: false, requirement: 'Complete 30 days of learning', category: 'milestone', points: 200, is_active: true, order_index: 31 },
      { id: 'first-quarter', title: 'First Quarter', description: 'Complete your first quarter of learning', icon: '📊', unlocked: false, requirement: 'Complete 90 days of learning', category: 'milestone', points: 500, is_active: true, order_index: 32 },
      
      // Social Achievements
      { id: 'github-commit', title: 'GitHub Committer', description: 'Make your first GitHub commit', icon: '🐙', unlocked: false, requirement: 'Make a GitHub commit', category: 'social', points: 100, is_active: true, order_index: 33 },
      { id: 'linkedin-post', title: 'LinkedIn Influencer', description: 'Share your learning journey on LinkedIn', icon: '💼', unlocked: false, requirement: 'Post about your learning on LinkedIn', category: 'social', points: 75, is_active: true, order_index: 34 },
      { id: 'blog-post', title: 'Blog Writer', description: 'Write a technical blog post', icon: '✍️', unlocked: false, requirement: 'Write a technical blog post', category: 'social', points: 150, is_active: true, order_index: 35 },
      
      // Advanced Achievements
      { id: 'fullstack-master', title: 'Fullstack Master', description: 'Complete both frontend and backend phases', icon: '🔄', unlocked: false, requirement: 'Complete Phase 1 and Phase 2', category: 'milestone', points: 600, is_active: true, order_index: 36 },
      { id: 'devops-expert', title: 'DevOps Expert', description: 'Master deployment and cloud services', icon: '☁️', unlocked: false, requirement: 'Complete Phase 3', category: 'milestone', points: 400, is_active: true, order_index: 37 },
      { id: 'interview-ready', title: 'Interview Ready', description: 'Complete all phases and be job-ready', icon: '🎯', unlocked: false, requirement: 'Complete all 5 phases', category: 'milestone', points: 1000, is_active: true, order_index: 38 },
      
      // Challenge Achievements
      { id: 'leetcode-daily', title: 'Daily Coder', description: 'Solve LeetCode problems for 7 consecutive days', icon: '📝', unlocked: false, requirement: 'Solve LeetCode problems for 7 days in a row', category: 'streak', points: 100, is_active: true, order_index: 39 },
      { id: 'project-week', title: 'Project Week', description: 'Complete a project in 7 days', icon: '⚡', unlocked: false, requirement: 'Complete a project within 7 days', category: 'special', points: 200, is_active: true, order_index: 40 },
      { id: 'topic-master', title: 'Topic Master', description: 'Complete all topics in a single phase', icon: '🎓', unlocked: false, requirement: 'Complete all topics in one phase', category: 'progress', points: 300, is_active: true, order_index: 41 },
      
      // Consistency Achievements
      { id: 'consistent-learner', title: 'Consistent Learner', description: 'Learn for 5 days in a row', icon: '📈', unlocked: false, requirement: 'Learn for 5 consecutive days', category: 'streak', points: 75, is_active: true, order_index: 42 },
      { id: 'dedicated-student', title: 'Dedicated Student', description: 'Learn for 15 days in a row', icon: '🎯', unlocked: false, requirement: 'Learn for 15 consecutive days', category: 'streak', points: 150, is_active: true, order_index: 43 },
      { id: 'learning-addict', title: 'Learning Addict', description: 'Learn for 50 days in a row', icon: '🔥', unlocked: false, requirement: 'Learn for 50 consecutive days', category: 'streak', points: 500, is_active: true, order_index: 44 },
      
      // Quality Achievements
      { id: 'quality-learner', title: 'Quality Learner', description: 'Log detailed progress for 10 days', icon: '✨', unlocked: false, requirement: 'Log detailed progress for 10 days', category: 'progress', points: 100, is_active: true, order_index: 45 },
      { id: 'reflection-master', title: 'Reflection Master', description: 'Write key takeaways for 20 days', icon: '💭', unlocked: false, requirement: 'Write key takeaways for 20 days', category: 'progress', points: 200, is_active: true, order_index: 46 },
      
      // Speed Achievements
      { id: 'fast-learner', title: 'Fast Learner', description: 'Complete a phase ahead of schedule', icon: '⚡', unlocked: false, requirement: 'Complete a phase before its end date', category: 'special', points: 300, is_active: true, order_index: 47 },
      { id: 'efficient-coder', title: 'Efficient Coder', description: 'Complete 3 projects in one month', icon: '🚀', unlocked: false, requirement: 'Complete 3 projects in 30 days', category: 'special', points: 400, is_active: true, order_index: 48 },
      
      // Community Achievements
      { id: 'help-others', title: 'Help Others', description: 'Help someone with their coding journey', icon: '🤝', unlocked: false, requirement: 'Help someone with coding', category: 'social', points: 100, is_active: true, order_index: 49 },
      { id: 'code-reviewer', title: 'Code Reviewer', description: 'Review someone else\'s code', icon: '🔍', unlocked: false, requirement: 'Review someone\'s code', category: 'social', points: 150, is_active: true, order_index: 50 },
      { id: 'open-source', title: 'Open Source Contributor', description: 'Contribute to an open source project', icon: '🌐', unlocked: false, requirement: 'Contribute to open source', category: 'social', points: 300, is_active: true, order_index: 51 },
      
      // Final Achievements
      { id: 'roadmap-complete', title: 'Roadmap Master', description: 'Complete the entire development roadmap', icon: '🏆', unlocked: false, requirement: 'Complete all phases, topics, and projects', category: 'milestone', points: 2000, is_active: true, order_index: 52 },
      { id: 'job-ready', title: 'Job Ready', description: 'Get your first developer job', icon: '💼', unlocked: false, requirement: 'Land your first developer job', category: 'milestone', points: 5000, is_active: true, order_index: 53 },
      { id: 'senior-developer', title: 'Senior Developer', description: 'Become a senior developer', icon: '👑', unlocked: false, requirement: 'Achieve senior developer status', category: 'milestone', points: 10000, is_active: true, order_index: 54 }
    ]

    const { error: achievementError } = await supabase
      .from('dev_roadmap_achievements')
      .insert(achievements)

    if (achievementError) {
      console.error('Achievement migration error:', achievementError)
      return { success: false, error: achievementError }
    }

    // Initialize user stats
    const { error: statsError } = await supabase
      .from('dev_roadmap_user_stats')
      .upsert({
        total_hours: 0,
        total_leetcode_solved: 0,
        total_points: 0,
        total_achievements_unlocked: 0,
        current_streak: 0,
        longest_streak: 0,
        total_projects_completed: 0,
        total_topics_completed: 0,
        total_phases_completed: 0
      }, {
        onConflict: 'id'
      })

    if (statsError) {
      console.error('Stats initialization error:', statsError)
      return { success: false, error: statsError }
    }

    
    return { success: true, migrated: phases.length + achievements.length + 1 }
  } catch (error) {
    console.error('Default Dev Roadmap migration failed:', error)
    return { success: false, error }
  }
}

const migrateDevRoadmapPhases = async () => {
  try {
    const savedPhases = localStorage.getItem('dev-roadmap-phases')
    if (!savedPhases) {
      
      return { success: true, migrated: 0 }
    }

    const phases = JSON.parse(savedPhases)
    

    for (const phase of phases) {
      // Insert phase
      const { data: phaseData, error: phaseError } = await supabase
        .from('dev_roadmap_phases')
        .insert({
          title: phase.title,
          description: phase.description,
          start_date: phase.startDate,
          end_date: phase.endDate,
          weeks: phase.weeks,
          progress: phase.progress,
          status: phase.status,
          leetcode_target: phase.leetCodeTarget,
          leetcode_completed: phase.leetCodeCompleted
        })
        .select()

      if (phaseError) {
        console.error('Phase migration error:', phaseError)
        continue
      }

      const phaseId = phaseData[0].id

      // Insert topics
      for (let i = 0; i < phase.topics.length; i++) {
        const topic = phase.topics[i]
        const { data: topicData, error: topicError } = await supabase
          .from('dev_roadmap_topics')
          .insert({
            phase_id: phaseId,
            name: topic.name,
            description: topic.description,
            completed: topic.completed,
            order_index: i
          })
          .select()

        if (topicError) {
          console.error('Topic migration error:', topicError)
          continue
        }

        const topicId = topicData[0].id

        // Insert resources
        for (let j = 0; j < topic.resources.length; j++) {
          const resource = topic.resources[j]
          await supabase
            .from('dev_roadmap_resources')
            .insert({
              topic_id: topicId,
              name: resource.name,
              url: resource.url,
              type: resource.type,
              completed: resource.completed,
              order_index: j
            })
        }
      }

      // Insert projects
      for (let i = 0; i < phase.projects.length; i++) {
        const project = phase.projects[i]
        await supabase
          .from('dev_roadmap_projects')
          .insert({
            phase_id: phaseId,
            name: project.name,
            description: project.description,
            status: project.status,
            github_url: project.githubUrl,
            live_url: project.liveUrl,
            technologies: project.technologies,
            is_custom: project.isCustom || false,
            order_index: i
          })
      }
    }

    
    return { success: true, migrated: phases.length }
  } catch (error) {
    console.error('Dev Roadmap phases migration failed:', error)
    return { success: false, error }
  }
}

const migrateDefaultPhases = async () => {
  try {
    

    const defaultPhases = [
      {
        title: 'Phase 1: Web Foundations & Frontend Development',
        description: 'Master HTML, CSS, JavaScript, React, and Next.js',
        startDate: '2025-08-11',
        endDate: '2025-10-05',
        weeks: 8,
        progress: 0,
        status: 'not-started',
        leetCodeTarget: 20,
        leetCodeCompleted: 0,
        topics: [
          {
            name: 'HTML, CSS, JavaScript Basics',
            description: 'Week 1-2: HTML5, CSS Flexbox/Grid, JavaScript ES6+',
            completed: false,
            resources: [
              { name: 'MDN Web Docs', url: 'https://developer.mozilla.org', type: 'documentation', completed: false },
              { name: 'CSS Flexbox Guide', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/', type: 'article', completed: false },
              { name: 'JavaScript.info', url: 'https://javascript.info', type: 'documentation', completed: false }
            ]
          },
          {
            name: 'Advanced JavaScript & CSS Frameworks',
            description: 'Week 3-4: Closures, Async/Await, Tailwind CSS',
            completed: false,
            resources: [
              { name: 'Tailwind CSS Docs', url: 'https://tailwindcss.com/docs', type: 'documentation', completed: false },
              { name: 'JavaScript Closures', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures', type: 'documentation', completed: false }
            ]
          },
          {
            name: 'React.js Fundamentals',
            description: 'Week 5-6: Components, Props, State, Hooks',
            completed: false,
            resources: [
              { name: 'React Official Docs', url: 'https://react.dev', type: 'documentation', completed: false },
              { name: 'React Router', url: 'https://reactrouter.com', type: 'documentation', completed: false }
            ]
          },
          {
            name: 'Advanced React & Web Security',
            description: 'Week 7-8: Next.js, Authentication, Security',
            completed: false,
            resources: [
              { name: 'Next.js Docs', url: 'https://nextjs.org/docs', type: 'documentation', completed: false },
              { name: 'Web Security Basics', url: 'https://owasp.org/www-project-top-ten/', type: 'article', completed: false }
            ]
          }
        ],
        projects: [
          {
            name: 'Personal Portfolio Website',
            description: 'Responsive portfolio using HTML, CSS, JavaScript',
            status: 'not-started',
            technologies: ['HTML', 'CSS', 'JavaScript'],
            githubUrl: '',
            liveUrl: '',
            isCustom: false
          },
          {
            name: 'Modern Landing Page',
            description: 'Landing page using Tailwind CSS',
            status: 'not-started',
            technologies: ['HTML', 'CSS', 'Tailwind CSS'],
            githubUrl: '',
            liveUrl: '',
            isCustom: false
          },
          {
            name: 'Todo App with React',
            description: 'Full-featured todo app with state management',
            status: 'not-started',
            technologies: ['React', 'TypeScript', 'Tailwind CSS'],
            githubUrl: '',
            liveUrl: '',
            isCustom: false
          },
          {
            name: 'Fullstack Authenticated Dashboard',
            description: 'Dashboard with Next.js and authentication',
            status: 'not-started',
            technologies: ['Next.js', 'TypeScript', 'JWT', 'Prisma'],
            githubUrl: '',
            liveUrl: '',
            isCustom: false
          }
        ]
      },
      {
        title: 'Phase 2: Backend Development with Node.js & TypeScript',
        description: 'Build robust APIs, authentication systems, and real-time apps',
        startDate: '2025-10-06',
        endDate: '2025-11-30',
        weeks: 8,
        progress: 0,
        status: 'not-started',
        leetCodeTarget: 30,
        leetCodeCompleted: 0,
        topics: [
          {
            name: 'Node.js Fundamentals',
            description: 'Week 1-2: Node.js, NPM, Express.js',
            completed: false,
            resources: [
              { name: 'Node.js Docs', url: 'https://nodejs.org/docs', type: 'documentation', completed: false },
              { name: 'Express.js Guide', url: 'https://expressjs.com', type: 'documentation', completed: false }
            ]
          },
          {
            name: 'TypeScript Mastery',
            description: 'Week 3-4: TypeScript, interfaces, generics',
            completed: false,
            resources: [
              { name: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs', type: 'documentation', completed: false }
            ]
          },
          {
            name: 'Database Design & ORMs',
            description: 'Week 5-6: PostgreSQL, Prisma, database design',
            completed: false,
            resources: [
              { name: 'Prisma Docs', url: 'https://www.prisma.io/docs', type: 'documentation', completed: false }
            ]
          },
          {
            name: 'API Design & Authentication',
            description: 'Week 7-8: REST APIs, JWT, OAuth',
            completed: false,
            resources: [
              { name: 'JWT.io', url: 'https://jwt.io', type: 'documentation', completed: false }
            ]
          }
        ],
        projects: [
          {
            name: 'REST API Server',
            description: 'Full-featured REST API with authentication',
            status: 'not-started',
            technologies: ['Node.js', 'Express', 'TypeScript', 'JWT'],
            githubUrl: '',
            liveUrl: '',
            isCustom: false
          },
          {
            name: 'Real-time Chat Application',
            description: 'Chat app with WebSocket and real-time features',
            status: 'not-started',
            technologies: ['Node.js', 'Socket.io', 'React', 'TypeScript'],
            githubUrl: '',
            liveUrl: '',
            isCustom: false
          }
        ]
      },
      {
        title: 'Phase 3: DevOps & Cloud Services',
        description: 'Deploy applications, manage infrastructure, and implement CI/CD',
        startDate: '2025-12-01',
        endDate: '2025-12-28',
        weeks: 4,
        progress: 0,
        status: 'not-started',
        leetCodeTarget: 15,
        leetCodeCompleted: 0,
        topics: [
          {
            name: 'Git & GitHub Mastery',
            description: 'Week 1: Git workflows, GitHub Actions',
            completed: false,
            resources: [
              { name: 'Git Documentation', url: 'https://git-scm.com/doc', type: 'documentation', completed: false }
            ]
          },
          {
            name: 'Docker & Containerization',
            description: 'Week 2: Docker, containerization, microservices',
            completed: false,
            resources: [
              { name: 'Docker Docs', url: 'https://docs.docker.com', type: 'documentation', completed: false }
            ]
          },
          {
            name: 'Cloud Deployment',
            description: 'Week 3-4: AWS, Vercel, deployment strategies',
            completed: false,
            resources: [
              { name: 'AWS Documentation', url: 'https://aws.amazon.com/documentation', type: 'documentation', completed: false }
            ]
          }
        ],
        projects: [
          {
            name: 'CI/CD Pipeline',
            description: 'Automated deployment pipeline with GitHub Actions',
            status: 'not-started',
            technologies: ['GitHub Actions', 'Docker', 'AWS'],
            githubUrl: '',
            liveUrl: '',
            isCustom: false
          }
        ]
      },
      {
        title: 'Phase 4: Advanced Topics & Specializations',
        description: 'Master advanced concepts and choose your specialization',
        startDate: '2025-12-29',
        endDate: '2026-01-25',
        weeks: 4,
        progress: 0,
        status: 'not-started',
        leetCodeTarget: 20,
        leetCodeCompleted: 0,
        topics: [
          {
            name: 'Advanced Algorithms & Data Structures',
            description: 'Week 1-2: Advanced algorithms, optimization',
            completed: false,
            resources: [
              { name: 'LeetCode', url: 'https://leetcode.com', type: 'course', completed: false }
            ]
          },
          {
            name: 'System Design & Architecture',
            description: 'Week 3-4: Scalable system design, microservices',
            completed: false,
            resources: [
              { name: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', type: 'documentation', completed: false }
            ]
          }
        ],
        projects: [
          {
            name: 'Scalable Web Application',
            description: 'High-traffic web application with microservices',
            status: 'not-started',
            technologies: ['Node.js', 'Docker', 'Kubernetes', 'Redis'],
            githubUrl: '',
            liveUrl: '',
            isCustom: false
          }
        ]
      },
      {
        title: 'Phase 5: Interview Preparation & Job Search',
        description: 'Prepare for technical interviews and land your dream job',
        startDate: '2026-01-26',
        endDate: '2026-02-22',
        weeks: 4,
        progress: 0,
        status: 'not-started',
        leetCodeTarget: 25,
        leetCodeCompleted: 0,
        topics: [
          {
            name: 'Technical Interview Preparation',
            description: 'Week 1-2: Mock interviews, common questions',
            completed: false,
            resources: [
              { name: 'Interview Preparation', url: 'https://www.interviewbit.com', type: 'course', completed: false }
            ]
          },
          {
            name: 'Job Search & Career Development',
            description: 'Week 3-4: Resume building, networking, job applications',
            completed: false,
            resources: [
              { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning', type: 'course', completed: false }
            ]
          }
        ],
        projects: [
          {
            name: 'Professional Portfolio v2',
            description: 'Advanced portfolio showcasing all skills',
            status: 'not-started',
            technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
            githubUrl: '',
            liveUrl: '',
            isCustom: false
          }
        ]
      }
    ]

    let migratedCount = 0

    for (const phase of defaultPhases) {
      // Insert phase
      const { data: phaseData, error: phaseError } = await supabase
        .from('dev_roadmap_phases')
        .insert({
          title: phase.title,
          description: phase.description,
          start_date: phase.startDate,
          end_date: phase.endDate,
          weeks: phase.weeks,
          progress: phase.progress,
          status: phase.status,
          leetcode_target: phase.leetCodeTarget,
          leetcode_completed: phase.leetCodeCompleted
        })
        .select()

      if (phaseError) {
        console.error('Phase migration error:', phaseError)
        continue
      }

      const phaseId = phaseData[0].id

      // Insert topics
      for (let i = 0; i < phase.topics.length; i++) {
        const topic = phase.topics[i]
        const { data: topicData, error: topicError } = await supabase
          .from('dev_roadmap_topics')
          .insert({
            phase_id: phaseId,
            name: topic.name,
            description: topic.description,
            completed: topic.completed,
            order_index: i
          })
          .select()

        if (topicError) {
          console.error('Topic migration error:', topicError)
          continue
        }

        const topicId = topicData[0].id

        // Insert resources
        for (let j = 0; j < topic.resources.length; j++) {
          const resource = topic.resources[j]
          await supabase
            .from('dev_roadmap_resources')
            .insert({
              topic_id: topicId,
              name: resource.name,
              url: resource.url,
              type: resource.type,
              completed: resource.completed,
              order_index: j
            })
        }
      }

      // Insert projects
      for (let i = 0; i < phase.projects.length; i++) {
        const project = phase.projects[i]
        await supabase
          .from('dev_roadmap_projects')
          .insert({
            phase_id: phaseId,
            name: project.name,
            description: project.description,
            status: project.status,
            github_url: project.githubUrl,
            live_url: project.liveUrl,
            technologies: project.technologies,
            is_custom: project.isCustom || false,
            order_index: i
          })
      }

      migratedCount++
    }

    
    return { success: true, migrated: migratedCount }
  } catch (error) {
    console.error('Default Dev Roadmap phases migration failed:', error)
    return { success: false, error }
  }
}

const migrateDefaultAchievements = async () => {
  try {
    

    const defaultAchievements = [
      // Daily & Streak Achievements
      { title: 'First Steps', description: 'Complete your first day of learning', icon: '🎯', unlocked: false, requirement: 'Log your first day of progress', category: 'daily', points: 10, isActive: true, order: 1 },
      { title: 'Week Warrior', description: 'Maintain a 7-day learning streak', icon: '🔥', unlocked: false, requirement: 'Learn for 7 consecutive days', category: 'streak', points: 50, isActive: true, order: 2 },
      { title: 'Monthly Master', description: 'Maintain a 30-day learning streak', icon: '📅', unlocked: false, requirement: 'Learn for 30 consecutive days', category: 'streak', points: 200, isActive: true, order: 3 },
      { title: 'Quarter Champion', description: 'Maintain a 90-day learning streak', icon: '🏆', unlocked: false, requirement: 'Learn for 90 consecutive days', category: 'streak', points: 500, isActive: true, order: 4 },
      
      // LeetCode Achievements
      { title: 'Problem Starter', description: 'Solve 5 LeetCode problems', icon: '💻', unlocked: false, requirement: 'Complete 5 LeetCode problems', category: 'leetcode', points: 25, isActive: true, order: 5 },
      { title: 'Problem Solver', description: 'Solve 10 LeetCode problems', icon: '⚡', unlocked: false, requirement: 'Complete 10 LeetCode problems', category: 'leetcode', points: 50, isActive: true, order: 6 },
      { title: 'Code Warrior', description: 'Solve 25 LeetCode problems', icon: '🛡️', unlocked: false, requirement: 'Complete 25 LeetCode problems', category: 'leetcode', points: 100, isActive: true, order: 7 },
      { title: 'Algorithm Master', description: 'Solve 50 LeetCode problems', icon: '🧠', unlocked: false, requirement: 'Complete 50 LeetCode problems', category: 'leetcode', points: 200, isActive: true, order: 8 },
      { title: 'LeetCode Legend', description: 'Solve 100 LeetCode problems', icon: '👑', unlocked: false, requirement: 'Complete 100 LeetCode problems', category: 'leetcode', points: 500, isActive: true, order: 9 },
      
      // Project Achievements
      { title: 'Project Creator', description: 'Complete your first project', icon: '🚀', unlocked: false, requirement: 'Mark your first project as completed', category: 'project', points: 100, isActive: true, order: 10 },
      { title: 'Triple Threat', description: 'Complete 3 projects', icon: '🎯', unlocked: false, requirement: 'Complete 3 projects', category: 'project', points: 200, isActive: true, order: 11 },
      { title: 'Project Portfolio', description: 'Complete 5 projects', icon: '📁', unlocked: false, requirement: 'Complete 5 projects', category: 'project', points: 300, isActive: true, order: 12 },
      { title: 'Project Master', description: 'Complete 10 projects', icon: '🏗️', unlocked: false, requirement: 'Complete 10 projects', category: 'project', points: 500, isActive: true, order: 13 },
      
      // Phase Achievements
      { title: 'Phase 1 Champion', description: 'Complete Phase 1', icon: '🥇', unlocked: false, requirement: 'Complete all topics and projects in Phase 1', category: 'phase', points: 300, isActive: true, order: 14 },
      { title: 'Phase 2 Champion', description: 'Complete Phase 2', icon: '🥈', unlocked: false, requirement: 'Complete all topics and projects in Phase 2', category: 'phase', points: 400, isActive: true, order: 15 },
      { title: 'Phase 3 Champion', description: 'Complete Phase 3', icon: '🥉', unlocked: false, requirement: 'Complete all topics and projects in Phase 3', category: 'phase', points: 500, isActive: true, order: 16 },
      { title: 'Phase 4 Champion', description: 'Complete Phase 4', icon: '💎', unlocked: false, requirement: 'Complete all topics and projects in Phase 4', category: 'phase', points: 600, isActive: true, order: 17 },
      { title: 'Phase 5 Champion', description: 'Complete Phase 5', icon: '👑', unlocked: false, requirement: 'Complete all topics and projects in Phase 5', category: 'phase', points: 700, isActive: true, order: 18 },
      
      // Time-based Achievements
      { title: 'Dedicated Learner', description: 'Log 10 hours of learning', icon: '⏰', unlocked: false, requirement: 'Log 10 total hours', category: 'time', points: 50, isActive: true, order: 19 },
      { title: 'Time Master', description: 'Log 50 hours of learning', icon: '⌛', unlocked: false, requirement: 'Log 50 total hours', category: 'time', points: 200, isActive: true, order: 20 },
      { title: 'Century Club', description: 'Log 100 hours of learning', icon: '💯', unlocked: false, requirement: 'Log 100 total hours', category: 'time', points: 400, isActive: true, order: 21 },
      { title: 'Learning Legend', description: 'Log 500 hours of learning', icon: '🌟', unlocked: false, requirement: 'Log 500 total hours', category: 'time', points: 1000, isActive: true, order: 22 },
      
      // Topic Achievements
      { title: 'Knowledge Seeker', description: 'Complete 5 topics', icon: '📖', unlocked: false, requirement: 'Complete 5 topics', category: 'progress', points: 100, isActive: true, order: 23 },
      { title: 'Knowledge Hunter', description: 'Complete 10 topics', icon: '🔍', unlocked: false, requirement: 'Complete 10 topics', category: 'progress', points: 200, isActive: true, order: 24 },
      { title: 'Knowledge Master', description: 'Complete 20 topics', icon: '🎓', unlocked: false, requirement: 'Complete 20 topics', category: 'progress', points: 400, isActive: true, order: 25 },
      
      // Special Achievements
      { title: 'Perfect Day', description: 'Log 8+ hours in a single day', icon: '⭐', unlocked: false, requirement: 'Log 8+ hours in one day', category: 'special', points: 100, isActive: true, order: 26 },
      { title: 'Weekend Warrior', description: 'Learn on 5 consecutive weekends', icon: '🏃', unlocked: false, requirement: 'Learn on 5 weekends in a row', category: 'special', points: 150, isActive: true, order: 27 },
      { title: 'Early Bird', description: 'Log progress before 8 AM', icon: '🌅', unlocked: false, requirement: 'Log progress before 8 AM', category: 'special', points: 50, isActive: true, order: 28 },
      { title: 'Night Owl', description: 'Log progress after 10 PM', icon: '🦉', unlocked: false, requirement: 'Log progress after 10 PM', category: 'special', points: 50, isActive: true, order: 29 },
      
      // Milestone Achievements
      { title: 'First Week', description: 'Complete your first week of learning', icon: '📅', unlocked: false, requirement: 'Complete 7 days of learning', category: 'milestone', points: 75, isActive: true, order: 30 },
      { title: 'First Month', description: 'Complete your first month of learning', icon: '🗓️', unlocked: false, requirement: 'Complete 30 days of learning', category: 'milestone', points: 200, isActive: true, order: 31 },
      { title: 'First Quarter', description: 'Complete your first quarter of learning', icon: '📊', unlocked: false, requirement: 'Complete 90 days of learning', category: 'milestone', points: 500, isActive: true, order: 32 },
      
      // Social Achievements
      { title: 'GitHub Committer', description: 'Make your first GitHub commit', icon: '🐙', unlocked: false, requirement: 'Make a GitHub commit', category: 'social', points: 100, isActive: true, order: 33 },
      { title: 'LinkedIn Influencer', description: 'Share your learning journey on LinkedIn', icon: '💼', unlocked: false, requirement: 'Post about your learning on LinkedIn', category: 'social', points: 75, isActive: true, order: 34 },
      { title: 'Blog Writer', description: 'Write a technical blog post', icon: '✍️', unlocked: false, requirement: 'Write a technical blog post', category: 'social', points: 150, isActive: true, order: 35 },
      
      // Advanced Achievements
      { title: 'Fullstack Master', description: 'Complete both frontend and backend phases', icon: '🔄', unlocked: false, requirement: 'Complete Phase 1 and Phase 2', category: 'milestone', points: 600, isActive: true, order: 36 },
      { title: 'DevOps Expert', description: 'Master deployment and cloud services', icon: '☁️', unlocked: false, requirement: 'Complete Phase 3', category: 'milestone', points: 400, isActive: true, order: 37 },
      { title: 'Interview Ready', description: 'Complete all phases and be job-ready', icon: '🎯', unlocked: false, requirement: 'Complete all 5 phases', category: 'milestone', points: 1000, isActive: true, order: 38 },
      
      // Challenge Achievements
      { title: 'Daily Coder', description: 'Solve LeetCode problems for 7 consecutive days', icon: '📝', unlocked: false, requirement: 'Solve LeetCode problems for 7 days in a row', category: 'streak', points: 100, isActive: true, order: 39 },
      { title: 'Project Week', description: 'Complete a project in 7 days', icon: '⚡', unlocked: false, requirement: 'Complete a project within 7 days', category: 'special', points: 200, isActive: true, order: 40 },
      { title: 'Topic Master', description: 'Complete all topics in a single phase', icon: '🎓', unlocked: false, requirement: 'Complete all topics in one phase', category: 'progress', points: 300, isActive: true, order: 41 },
      
      // Consistency Achievements
      { title: 'Consistent Learner', description: 'Learn for 5 days in a row', icon: '📈', unlocked: false, requirement: 'Learn for 5 consecutive days', category: 'streak', points: 75, isActive: true, order: 42 },
      { title: 'Dedicated Student', description: 'Learn for 15 days in a row', icon: '🎯', unlocked: false, requirement: 'Learn for 15 consecutive days', category: 'streak', points: 150, isActive: true, order: 43 },
      { title: 'Learning Addict', description: 'Learn for 50 days in a row', icon: '🔥', unlocked: false, requirement: 'Learn for 50 consecutive days', category: 'streak', points: 500, isActive: true, order: 44 },
      
      // Quality Achievements
      { title: 'Quality Learner', description: 'Log detailed progress for 10 days', icon: '✨', unlocked: false, requirement: 'Log detailed progress for 10 days', category: 'progress', points: 100, isActive: true, order: 45 },
      { title: 'Reflection Master', description: 'Write key takeaways for 20 days', icon: '💭', unlocked: false, requirement: 'Write key takeaways for 20 days', category: 'progress', points: 200, isActive: true, order: 46 },
      
      // Speed Achievements
      { title: 'Fast Learner', description: 'Complete a phase ahead of schedule', icon: '⚡', unlocked: false, requirement: 'Complete a phase before its end date', category: 'special', points: 300, isActive: true, order: 47 },
      { title: 'Efficient Coder', description: 'Complete 3 projects in one month', icon: '🚀', unlocked: false, requirement: 'Complete 3 projects in 30 days', category: 'special', points: 400, isActive: true, order: 48 },
      
      // Community Achievements
      { title: 'Help Others', description: 'Help someone with their coding journey', icon: '🤝', unlocked: false, requirement: 'Help someone with coding', category: 'social', points: 100, isActive: true, order: 49 },
      { title: 'Code Reviewer', description: 'Review someone else\'s code', icon: '🔍', unlocked: false, requirement: 'Review someone\'s code', category: 'social', points: 150, isActive: true, order: 50 },
      { title: 'Open Source Contributor', description: 'Contribute to an open source project', icon: '🌐', unlocked: false, requirement: 'Contribute to open source', category: 'social', points: 300, isActive: true, order: 51 },
      
      // Final Achievements
      { title: 'Roadmap Master', description: 'Complete the entire development roadmap', icon: '🏆', unlocked: false, requirement: 'Complete all phases, topics, and projects', category: 'milestone', points: 2000, isActive: true, order: 52 },
      { title: 'Job Ready', description: 'Get your first developer job', icon: '💼', unlocked: false, requirement: 'Land your first developer job', category: 'milestone', points: 5000, isActive: true, order: 53 },
      { title: 'Senior Developer', description: 'Become a senior developer', icon: '👑', unlocked: false, requirement: 'Achieve senior developer status', category: 'milestone', points: 10000, isActive: true, order: 54 }
    ]

    for (const achievement of defaultAchievements) {
      await supabase
        .from('dev_roadmap_achievements')
        .insert({
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon,
          unlocked: achievement.unlocked,
          unlocked_date: null,
          requirement: achievement.requirement,
          category: achievement.category,
          points: achievement.points,
          next_achievement: null,
          is_active: achievement.isActive,
          order_index: achievement.order
        })
    }

    
    return { success: true, migrated: defaultAchievements.length }
  } catch (error) {
    console.error('Default Dev Roadmap achievements migration failed:', error)
    return { success: false, error }
  }
}

const migrateDevRoadmapAchievements = async () => {
  try {
    const savedAchievements = localStorage.getItem('dev-roadmap-achievements')
    if (!savedAchievements) {
      
      return { success: true, migrated: 0 }
    }

    const achievements = JSON.parse(savedAchievements)
    

    for (const achievement of achievements) {
      await supabase
        .from('dev_roadmap_achievements')
        .upsert({
          id: achievement.id,
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon,
          unlocked: achievement.unlocked,
          unlocked_date: achievement.unlockedDate,
          requirement: achievement.requirement,
          category: achievement.category,
          points: achievement.points,
          next_achievement: achievement.nextAchievement,
          is_active: achievement.isActive,
          order_index: achievement.order
        }, {
          onConflict: 'id'
        })
    }

    
    return { success: true, migrated: achievements.length }
  } catch (error) {
    console.error('Dev Roadmap achievements migration failed:', error)
    return { success: false, error }
  }
}

const migrateDevRoadmapUserStats = async () => {
  try {
    // Calculate stats from existing data
    const savedLogs = localStorage.getItem('dev-roadmap-logs')
    const savedAchievements = localStorage.getItem('dev-roadmap-achievements')
    
    let totalHours = 0
    let totalLeetCode = 0
    let totalPoints = 0
    let totalAchievements = 0

    if (savedLogs) {
      const logs = JSON.parse(savedLogs)
      totalHours = logs.reduce((sum: number, log: any) => sum + (log.hoursSpent || 0), 0)
      totalLeetCode = logs.reduce((sum: number, log: any) => sum + (log.leetCodeProblems || 0), 0)
    }

    if (savedAchievements) {
      const achievements = JSON.parse(savedAchievements)
      totalPoints = achievements.filter((a: any) => a.unlocked).reduce((sum: number, a: any) => sum + (a.points || 0), 0)
      totalAchievements = achievements.filter((a: any) => a.unlocked).length
    }

    // Update user stats
    const { data, error } = await supabase
      .from('dev_roadmap_user_stats')
      .upsert({
        total_hours: totalHours,
        total_leetcode_solved: totalLeetCode,
        total_points: totalPoints,
        total_achievements_unlocked: totalAchievements,
        current_streak: 0,
        longest_streak: 0,
        total_projects_completed: 0,
        total_topics_completed: 0,
        total_phases_completed: 0
      }, {
        onConflict: 'id'
      })
      .select()

    if (error) {
      console.error('User stats migration error:', error)
      return { success: false, error }
    }

    
    return { success: true, migrated: 1 }
  } catch (error) {
    console.error('Dev Roadmap user stats migration failed:', error)
    return { success: false, error }
  }
}

// ===== PLANTS =====
export const getPlants = async () => {
  const { data, error } = await supabase
    .from('plants')
    .select('*')
    .order('created_at', { ascending: true })
  
  if (error) throw error
  return data || []
}

export const addPlant = async (plant: any) => {
  const { data, error } = await supabase
    .from('plants')
    .insert([{
      name: plant.name,
      species: plant.species,
      location: plant.location,
      last_watered: plant.lastWatered,
      next_watering: plant.nextWatering,
      watering_frequency: plant.wateringFrequency,
      light_needs: plant.lightNeeds,
      humidity_needs: plant.humidityNeeds,
      temperature_range: plant.temperatureRange,
      fertilizer_frequency: plant.fertilizerFrequency,
      last_fertilized: plant.lastFertilized,
      notes: plant.notes,
      health: plant.health,
      size: plant.size,
      pot_size: plant.potSize,
      image_url: plant.imageUrl,
      care_tasks: plant.careTasks,
      pot_color: plant.potColor,
      plant_type: plant.plantType
    }])
    .select()
  
  if (error) throw error
  return data[0]
}

export const updatePlant = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('plants')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deletePlant = async (id: string) => {
  const { error } = await supabase
    .from('plants')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Migration function for default plants
export const migrateDefaultPlants = async () => {
  try {

    
    // Check if plants already exist in database
    const { data: existingPlants } = await supabase
      .from('plants')
      .select('id')
      .limit(1)
    
    if (existingPlants && existingPlants.length > 0) {
      
      return { success: true, migrated: 0 }
    }
    
    const defaultPlants = [
      {
        name: 'Spider Plant',
        species: 'Chlorophytum comosum',
        location: 'Living Room',
        lastWatered: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        nextWatering: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        wateringFrequency: 4,
        lightNeeds: 'medium',
        humidityNeeds: 'medium',
        temperatureRange: '18-24°C',
        fertilizerFrequency: 14,
        lastFertilized: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: 'Loves bright indirect light and regular watering',
        health: 'excellent',
        size: 'medium',
        potSize: '6 inch',
        careTasks: [],
        potColor: '#8B4513',
        plantType: 'tropical'
      },
      {
        name: 'Monstera',
        species: 'Monstera deliciosa',
        location: 'Living Room',
        lastWatered: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        nextWatering: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        wateringFrequency: 4,
        lightNeeds: 'medium',
        humidityNeeds: 'high',
        temperatureRange: '18-24°C',
        fertilizerFrequency: 14,
        lastFertilized: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: 'Famous for its distinctive leaves with natural holes',
        health: 'good',
        size: 'large',
        potSize: '12 inch',
        careTasks: [],
        potColor: '#A0522D',
        plantType: 'tropical'
      },
      {
        name: 'Snake Plant',
        species: 'Sansevieria trifasciata',
        location: 'Bedroom',
        lastWatered: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        nextWatering: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        wateringFrequency: 7,
        lightNeeds: 'low',
        humidityNeeds: 'low',
        temperatureRange: '16-24°C',
        fertilizerFrequency: 21,
        lastFertilized: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: 'Perfect for beginners - very low maintenance',
        health: 'excellent',
        size: 'medium',
        potSize: '8 inch',
        careTasks: [],
        potColor: '#CD853F',
        plantType: 'succulent'
      },
      {
        name: 'Golden Pothos',
        species: 'Epipremnum aureum',
        location: 'Kitchen',
        lastWatered: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        nextWatering: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        wateringFrequency: 4,
        lightNeeds: 'medium',
        humidityNeeds: 'medium',
        temperatureRange: '18-24°C',
        fertilizerFrequency: 14,
        lastFertilized: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: 'Trailing vine that purifies the air',
        health: 'good',
        size: 'medium',
        potSize: '6 inch',
        careTasks: [],
        potColor: '#D2691E',
        plantType: 'vine'
      },
      {
        name: 'Phalaenopsis Orchid',
        species: 'Phalaenopsis',
        location: 'Living Room',
        lastWatered: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        nextWatering: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        wateringFrequency: 7,
        lightNeeds: 'medium',
        humidityNeeds: 'high',
        temperatureRange: '18-26°C',
        fertilizerFrequency: 21,
        lastFertilized: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: 'Elegant flowering plant that blooms for months',
        health: 'good',
        size: 'medium',
        potSize: '8 inch',
        careTasks: [],
        potColor: '#B8860B',
        plantType: 'flower'
      },
      {
        name: 'Sweet Basil',
        species: 'Ocimum basilicum',
        location: 'Kitchen',
        lastWatered: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        nextWatering: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        wateringFrequency: 2,
        lightNeeds: 'high',
        humidityNeeds: 'medium',
        temperatureRange: '20-25°C',
        fertilizerFrequency: 7,
        lastFertilized: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: 'Aromatic herb perfect for cooking',
        health: 'excellent',
        size: 'small',
        potSize: '4 inch',
        careTasks: [],
        potColor: '#8FBC8F',
        plantType: 'herb'
      }
    ]
    
    // Migrate plants one by one
    let migratedCount = 0
    
    for (const plant of defaultPlants) {
      try {
        await addPlant(plant)
        migratedCount++
        
      } catch (error) {
        console.error(`Failed to migrate plant ${plant.name}:`, error)
      }
    }
    
    
    
    return { success: true, migrated: migratedCount }
    
  } catch (error) {
    console.error('Default plants migration failed:', error)
    return { success: false, error }
  }
}

// ===== HEALTH HABITS =====
export const getHealthHabits = async (type: string, date?: string) => {
  let query = supabase
    .from('health_habits')
    .select('*')
    .eq('type', type)
  
  if (date) {
    query = query.eq('date', date)
  }
  
  const { data, error } = await query.order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export const saveHealthHabits = async (type: string, data: any, date: string) => {
  // Check if entry exists for this type and date
  const existing = await getHealthHabits(type, date)
  
  if (existing.length > 0) {
    // Update existing entry
    const { data: updatedData, error } = await supabase
      .from('health_habits')
      .update({ data })
      .eq('id', existing[0].id)
      .select()
    
    if (error) throw error
    return updatedData[0]
  } else {
    // Create new entry
    const { data: newData, error } = await supabase
      .from('health_habits')
      .insert([{ type, data, date }])
      .select()
    
    if (error) throw error
    return newData[0]
  }
}

export const deleteHealthHabits = async (id: string) => {
  const { error } = await supabase
    .from('health_habits')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Specific functions for different health habit types
export const getTodayHealthData = async () => {
  const today = new Date().toISOString().split('T')[0]
  
  try {
    const [gymData, shoppingData, metricsData, moodData, waterData, sleepData, weeklyTasksData] = await Promise.all([
      getHealthHabits('gym', today),
      getHealthHabits('shopping', today), 
      getHealthHabits('metrics', today),
      getHealthHabits('mood', today),
      getHealthHabits('water', today),
      getHealthHabits('sleep', today),
      getHealthHabits('weekly_tasks', today)
    ])
    
    return {
      gym: gymData.length > 0 ? gymData[0].data : [],
      shopping: shoppingData.length > 0 ? shoppingData[0].data : [],
      metrics: metricsData.length > 0 ? metricsData[0].data : [],
      mood: moodData.length > 0 ? moodData[0].data : [],
      water: waterData.length > 0 ? waterData[0].data : [],
      sleep: sleepData.length > 0 ? sleepData[0].data : [],
      weeklyTasks: weeklyTasksData.length > 0 ? weeklyTasksData[0].data : []
    }
  } catch (error) {
    console.error('Error getting today\'s health data:', error)
    throw error
  }
}

export const getHealthDataByDateRange = async (type: string, startDate: string, endDate: string) => {
  const { data, error } = await supabase
    .from('health_habits')
    .select('*')
    .eq('type', type)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true })
  
  if (error) throw error
  return data || []
}

// ===== NOTES =====
export const getNotes = async () => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('is_pinned', { ascending: false })
    .order('updated_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export const addNote = async (note: any) => {
  const { data, error } = await supabase
    .from('notes')
    .insert([{
      title: note.title,
      content: note.content,
      folder_id: note.folderId,
      tags: note.tags,
      is_pinned: note.isPinned || false
    }])
    .select()
  
  if (error) throw error
  return data[0]
}

export const updateNote = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('notes')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteNote = async (id: string) => {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// ===== NOTE FOLDERS =====
export const getNoteFolders = async () => {
  const { data, error } = await supabase
    .from('note_folders')
    .select('*')
    .order('created_at', { ascending: true })
  
  if (error) throw error
  return data || []
}

export const addNoteFolder = async (folder: any) => {
  const { data, error } = await supabase
    .from('note_folders')
    .insert([{
      name: folder.name,
      color: folder.color
    }])
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteNoteFolder = async (id: string) => {
  const { error } = await supabase
    .from('note_folders')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

export const updateNoteFolder = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('note_folders')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

// ===== BUSINESS AREAS =====
export const getBusinessAreas = async () => {
  const { data, error } = await supabase
    .from('business_areas')
    .select('*')
    .order('created_at', { ascending: true })
  
  if (error) throw error
  return data || []
}

export const addBusinessArea = async (area: any) => {
  const { data, error } = await supabase
    .from('business_areas')
    .insert([{
      name: area.name,
      description: area.description,
      current_focus: area.currentFocus,
      icon: area.icon,
      color: area.color
    }])
    .select()
  
  if (error) throw error
  return data[0]
}

export const updateBusinessArea = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('business_areas')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteBusinessArea = async (id: string) => {
  const { error } = await supabase
    .from('business_areas')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// ===== CALENDAR CATEGORIES =====
export const getCalendarCategories = async () => {
  const { data, error } = await supabase
    .from('calendar_categories')
    .select('*')
    .order('created_at', { ascending: true })
  
  if (error) {
    console.error('Error fetching calendar categories:', error)
    throw error
  }
  return data || []
}

export const saveCalendarCategories = async (categories: any[]) => {
  // Use upsert to insert or update categories
  const { data, error } = await supabase
    .from('calendar_categories')
    .upsert(categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      color: cat.color,
      is_visible: cat.isVisible
    })), {
      onConflict: 'id' // Use the id column for conflict resolution
    })
    .select()
  
  if (error) {
    console.error('Error saving calendar categories:', error)
    throw error
  }
  return data
}

export const clearCalendarCategories = async () => {
  const { error } = await supabase
    .from('calendar_categories')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all
  
  if (error) {
    console.error('Error clearing calendar categories:', error)
    throw error
  }
  return { success: true }
}

// ===== MIGRATION FUNCTIONS =====
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Database connection error:', error)
      return { success: false, error }
    }
    
    
    return { success: true, data }
  } catch (error) {
    console.error('Connection test failed:', error)
    return { success: false, error }
  }
}

export const migrateAllData = async () => {
  
  
  const results = {
    calendar: await migrateCalendarEvents(),
    agenda: await migrateAgendaTasks(),
    plants: await migratePlants(),
    health: await migrateHealthHabits(),
    devRoadmap: await migrateDevRoadmapData()
  }

  
  return results
}

// Helper migration functions
const migrateCalendarEvents = async () => {
  try {
    const savedEvents = localStorage.getItem('calendar-events')
    if (!savedEvents) {
      
      return { success: true, migrated: 0 }
    }

    const events = JSON.parse(savedEvents)
    

    const { data, error } = await supabase
      .from('calendar_events')
      .insert(events.map((event: any) => ({
        title: event.title,
        description: event.description,
        start_date: event.startDate,
        end_date: event.endDate,
        category: event.category
      })))
      .select()

    if (error) {
      console.error('Migration error:', error)
      return { success: false, error }
    }

    
    return { success: true, migrated: Array.isArray(data) ? data.length : 0 }
  } catch (error) {
    console.error('Migration failed:', error)
    return { success: false, error }
  }
}

const migrateAgendaTasks = async () => {
  try {
    const today = new Date().toISOString().split('T')[0]
    const savedTasks = localStorage.getItem(`tasks-${today}`)
    if (!savedTasks) {
      
      return { success: true, migrated: 0 }
    }

    const tasks = JSON.parse(savedTasks)
    

    const { data, error } = await supabase
      .from('agenda_tasks')
      .insert(tasks.map((task: any) => ({
        title: task.title,
        description: task.description,
        completed: task.completed,
        date: today,
        priority: task.priority || 'medium'
      })))
      .select()

    if (error) {
      console.error('Migration error:', error)
      return { success: false, error }
    }

    
    return { success: true, migrated: Array.isArray(data) ? data.length : 0 }
  } catch (error) {
    console.error('Migration failed:', error)
    return { success: false, error }
  }
}

const migratePlants = async () => {
  try {
    const savedPlants = localStorage.getItem('plant-care-plants')
    if (!savedPlants) {
      
      return { success: true, migrated: 0 }
    }

    const plants = JSON.parse(savedPlants)
    

    const { data, error } = await supabase
      .from('plants')
      .insert(plants.map((plant: any) => ({
        name: plant.name,
        species: plant.species,
        location: plant.location,
        last_watered: plant.lastWatered,
        next_watering: plant.nextWatering,
        watering_frequency: plant.wateringFrequency,
        care_tasks: plant.careTasks,
        pot_color: plant.potColor,
        plant_type: plant.plantType
      })))
      .select()

    if (error) {
      console.error('Migration error:', error)
      return { success: false, error }
    }

    
    return { success: true, migrated: Array.isArray(data) ? data.length : 0 }
  } catch (error) {
    console.error('Migration failed:', error)
    return { success: false, error }
  }
}

const migrateHealthHabits = async () => {
  try {
    const healthData = [
      { key: 'health-habits-gym', type: 'gym' },
      { key: 'health-habits-water', type: 'water' },
      { key: 'health-habits-sleep', type: 'sleep' },
      { key: 'health-habits-mood', type: 'mood' },
      { key: 'health-habits-weekly-tasks', type: 'weekly_tasks' }
    ]

    let totalMigrated = 0

    for (const { key, type } of healthData) {
      const savedData = localStorage.getItem(key)
      if (savedData) {
        const data = JSON.parse(savedData)
        const today = new Date().toISOString().split('T')[0]

        const { error } = await supabase
          .from('health_habits')
          .insert({
            type,
            data,
            date: today
          })

        if (error) {
          console.error(`Migration error for ${type}:`, error)
        } else {
          totalMigrated++
  
        }
      }
    }

    return { success: true, migrated: totalMigrated }
  } catch (error) {
    console.error('Health habits migration failed:', error)
    return { success: false, error }
  }
}

// ===== FINANCE FUNCTIONS =====

export const getFinanceTransactions = async () => {
  const { data, error } = await supabase
    .from('finance_transactions')
    .select('*')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export const addFinanceTransaction = async (transaction: any) => {
  const { data, error } = await supabase
    .from('finance_transactions')
    .insert([{
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category,
      date: transaction.date
    }])
    .select()
  
  if (error) throw error
  return data[0]
}

export const updateFinanceTransaction = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('finance_transactions')
    .update({
      type: updates.type,
      amount: updates.amount,
      description: updates.description,
      category: updates.category,
      date: updates.date
    })
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteFinanceTransaction = async (id: string) => {
  const { error } = await supabase
    .from('finance_transactions')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Migration function for Finance data
export const migrateFinanceData = async () => {
  try {

    
    // Get existing localStorage data
    const savedTransactions = localStorage.getItem('finance-transactions')
    
    if (!savedTransactions) {
      
      return { success: true, migrated: 0 }
    }
    
    const localTransactions = JSON.parse(savedTransactions)
    
    if (!Array.isArray(localTransactions) || localTransactions.length === 0) {
      
      return { success: true, migrated: 0 }
    }
    
    
    
    // Check if data already exists in database
    const { data: existingTransactions } = await supabase
      .from('finance_transactions')
      .select('id')
      .limit(1)
    
    if (existingTransactions && existingTransactions.length > 0) {
      
      return { success: true, migrated: 0 }
    }
    
    // Migrate transactions
    let migratedCount = 0
    
    for (const transaction of localTransactions) {
      try {
        await supabase
          .from('finance_transactions')
          .insert({
            type: transaction.type,
            amount: parseFloat(transaction.amount),
            description: transaction.description,
            category: transaction.category,
            date: transaction.date
          })
        
        migratedCount++
        
      } catch (error) {
        console.error(`Failed to migrate Finance transaction:`, error)
      }
    }
    
    
    
    // Backup localStorage data before clearing (optional)
    localStorage.setItem('finance-transactions-backup', savedTransactions)
    
    return { success: true, migrated: migratedCount }
    
  } catch (error) {
    console.error('Finance migration failed:', error)
    return { success: false, error }
  }
}

// ===== BUSINESS GOALS =====
export const getBusinessGoals = async (businessArea?: string) => {
  let query = supabase
    .from('business_goals')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (businessArea) {
    query = query.eq('business_area', businessArea)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data || []
}

export const addBusinessGoal = async (goal: any) => {
  const { data, error } = await supabase
    .from('business_goals')
    .insert([{
      business_area: goal.businessArea,
      title: goal.title,
      description: goal.description,
      completed: goal.completed || false,
      priority: goal.priority || 'medium'
    }])
    .select()
  
  if (error) throw error
  return data[0]
}

export const updateBusinessGoal = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('business_goals')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteBusinessGoal = async (id: string) => {
  const { error } = await supabase
    .from('business_goals')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// ===== BUSINESS IDEAS =====
export const getBusinessIdeas = async (businessArea?: string) => {
  let query = supabase
    .from('business_ideas')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (businessArea) {
    query = query.eq('business_area', businessArea)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data || []
}

export const addBusinessIdea = async (idea: any) => {
  const { data, error } = await supabase
    .from('business_ideas')
    .insert([{
      business_area: idea.businessArea,
      title: idea.title,
      description: idea.description,
      category: idea.category || 'product',
      priority: idea.priority || 'medium',
      status: idea.status || 'new'
    }])
    .select()
  
  if (error) throw error
  return data[0]
}

export const updateBusinessIdea = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('business_ideas')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteBusinessIdea = async (id: string) => {
  const { error } = await supabase
    .from('business_ideas')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// ===== BUSINESS NOTES & FOLDERS =====
export const getBusinessNotes = async (businessArea: string, folderId?: string) => {
  let query = supabase
    .from('business_notes')
    .select('*')
    .eq('business_area', businessArea)
    .order('updated_at', { ascending: false })
  
  if (folderId && folderId !== 'all') {
    query = query.eq('folder_id', folderId)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data || []
}

export const addBusinessNote = async (note: any) => {
  const { data, error } = await supabase
    .from('business_notes')
    .insert([{
      business_area: note.businessArea,
      title: note.title,
      content: note.content,
      folder_id: note.folder || null,
      tags: note.tags || [],
      is_pinned: note.isPinned || false
    }])
    .select()
  
  if (error) throw error
  return data[0]
}

export const updateBusinessNote = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('business_notes')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteBusinessNote = async (id: string) => {
  const { error } = await supabase
    .from('business_notes')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

export const getBusinessNoteFolders = async (businessArea: string) => {
  const { data, error } = await supabase
    .from('business_note_folders')
    .select('*')
    .eq('business_area', businessArea)
    .order('created_at', { ascending: true })
  
  if (error) throw error
  return data || []
}

export const addBusinessNoteFolder = async (folder: any) => {
  const { data, error } = await supabase
    .from('business_note_folders')
    .insert([{
      business_area: folder.businessArea,
      name: folder.name,
      color: folder.color
    }])
    .select()
  
  if (error) throw error
  return data[0]
}

export const updateBusinessNoteFolder = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('business_note_folders')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteBusinessNoteFolder = async (id: string) => {
  const { error } = await supabase
    .from('business_note_folders')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// ===== MORO COMPANY MIGRATION =====
export const migrateBusinessAreas = async () => {
  try {

    
    // Check if business areas already exist
    const existingAreas = await getBusinessAreas()
    if (existingAreas.length > 0) {
      
      return { success: true, migrated: 0 }
    }
    
    // Get business areas from localStorage
    const savedAreas = localStorage.getItem('moro-business-areas')
    if (!savedAreas) {
      
      return { success: true, migrated: 0 }
    }
    
    const businessAreas = JSON.parse(savedAreas)
    
    
    let migratedCount = 0
    
    for (const area of businessAreas) {
      await addBusinessArea({
        name: area.name,
        description: area.description,
        currentFocus: area.currentFocus,
        icon: area.icon,
        color: area.color
      })
      migratedCount++
    }
    
    
    
    // Backup localStorage data
    localStorage.setItem('moro-business-areas-backup', savedAreas)
    
    return { success: true, migrated: migratedCount }
    
  } catch (error) {
    console.error('Business areas migration failed:', error)
    return { success: false, error }
  }
}

// User Preferences Functions
export const getUserPreference = async (key: string) => {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('preference_value')
    .eq('preference_key', key)
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') {
      // No row found, return null
      return null
    }
    throw error
  }
  return data.preference_value
}

export const setUserPreference = async (key: string, value: string) => {
  const { data, error } = await supabase
    .from('user_preferences')
    .upsert({
      preference_key: key,
      preference_value: value,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'preference_key'
    })
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteUserPreference = async (key: string) => {
  const { error } = await supabase
    .from('user_preferences')
    .delete()
    .eq('preference_key', key)
  
  if (error) throw error
}

export const getAllUserPreferences = async () => {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
  
  if (error) throw error
  return data
}

// Job Applications Functions
export const getJobApplications = async () => {
  const { data, error } = await supabase
    .from('job_applications')
    .select('*')
    .order('application_date', { ascending: false })
  
  if (error) throw error
  return data || []
}

export const addJobApplication = async (jobApplication: any) => {
  const { data, error } = await supabase
    .from('job_applications')
    .insert([jobApplication])
    .select()
  
  if (error) throw error
  return data[0]
}

export const updateJobApplication = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('job_applications')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteJobApplication = async (id: string) => {
  const { data, error } = await supabase
    .from('job_applications')
    .delete()
    .eq('id', id)
  
  if (error) throw error
  return data
} 