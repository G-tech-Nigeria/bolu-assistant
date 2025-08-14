import { 
  accountabilitySupabase, 
  ACCOUNTABILITY_TABLES, 
  handleAccountabilityDatabaseError, 
  generateAccountabilityUniqueId 
} from './accountability-supabase'

// Types for accountability system
export interface AccountabilityUser {
  id: string
  name: string
  avatar: string
  points: number
  streak: number
  created_at: string
}

export interface AccountabilityTask {
  id: string
  title: string
  user_id: string // Using snake_case to match database
  date: string
  time?: string
  status: string // 'pending' or 'completed'
  description?: string
  proof?: string
  created_at: string
}

export interface AccountabilityPenalty {
  id: string
  user_id: string
  date: string
  amount: number
  reason: string
  created_at: string
}

export interface AccountabilityAchievement {
  id: string
  user_id: string
  achievement_id: string
  title: string
  description: string
  icon: string
  points: number
  unlocked_at: string
}

export interface AccountabilitySettings {
  id: string
  penalty_amount: number
  points_per_task: number
  points_per_missed: number
  theme?: string
  notifications?: boolean
}

// User Management
export const getAccountabilityUsers = async (): Promise<AccountabilityUser[]> => {
  try {
    const { data, error } = await accountabilitySupabase
      .from(ACCOUNTABILITY_TABLES.USERS)
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    handleAccountabilityDatabaseError(error, 'get accountability users')
    return []
  }
}

export const saveAccountabilityUsers = async (users: AccountabilityUser[]) => {
  try {
    // First, delete all existing users
    const { error: deleteError } = await accountabilitySupabase
      .from(ACCOUNTABILITY_TABLES.USERS)
      .delete()
      .neq('id', '0')

    if (deleteError) throw deleteError

    // Then insert all users
    if (users.length > 0) {
      const { error: insertError } = await accountabilitySupabase
        .from(ACCOUNTABILITY_TABLES.USERS)
        .insert(users)

      if (insertError) throw insertError
    }
  } catch (error) {
    handleAccountabilityDatabaseError(error, 'save accountability users')
  }
}

export const updateAccountabilityUser = async (userId: string, updates: Partial<AccountabilityUser>) => {
  try {
    const { data, error } = await accountabilitySupabase
      .from(ACCOUNTABILITY_TABLES.USERS)
      .update(updates)
      .eq('id', userId)
      .select()

    if (error) throw error
    return data[0]
  } catch (error) {
    handleAccountabilityDatabaseError(error, 'update accountability user')
    return null
  }
}

// Task Management
export const getAccountabilityTasks = async (): Promise<AccountabilityTask[]> => {
  try {
    const { data, error } = await accountabilitySupabase
      .from(ACCOUNTABILITY_TABLES.TASKS)
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    handleAccountabilityDatabaseError(error, 'get accountability tasks')
    return []
  }
}

export const saveAccountabilityTasks = async (tasks: AccountabilityTask[]) => {
  try {
    // First, delete all existing tasks
    const { error: deleteError } = await accountabilitySupabase
      .from(ACCOUNTABILITY_TABLES.TASKS)
      .delete()
      .neq('id', '0')

    if (deleteError) throw deleteError

    // Then insert all tasks
    if (tasks.length > 0) {
      const { error: insertError } = await accountabilitySupabase
        .from(ACCOUNTABILITY_TABLES.TASKS)
        .insert(tasks)

      if (insertError) throw insertError
    }
  } catch (error) {
    handleAccountabilityDatabaseError(error, 'save accountability tasks')
  }
}

export const addAccountabilityTask = async (task: Omit<AccountabilityTask, 'id' | 'created_at'>) => {
  try {
    const newTask: AccountabilityTask = {
      ...task,
      id: generateAccountabilityUniqueId(),
      status: task.status || 'pending',
      created_at: new Date().toISOString()
    }

    const { data, error } = await accountabilitySupabase
      .from(ACCOUNTABILITY_TABLES.TASKS)
      .insert(newTask)
      .select()

    if (error) throw error
    return data[0]
  } catch (error) {
    handleAccountabilityDatabaseError(error, 'add accountability task')
    return null
  }
}

export const updateAccountabilityTask = async (taskId: string, updates: Partial<AccountabilityTask>) => {
  try {
    const { data, error } = await accountabilitySupabase
      .from(ACCOUNTABILITY_TABLES.TASKS)
      .update(updates)
      .eq('id', taskId)
      .select()

    if (error) throw error
    return data[0]
  } catch (error) {
    handleAccountabilityDatabaseError(error, 'update accountability task')
    return null
  }
}

export const deleteAccountabilityTask = async (taskId: string) => {
  try {
    const { error } = await accountabilitySupabase
      .from(ACCOUNTABILITY_TABLES.TASKS)
      .delete()
      .eq('id', taskId)

    if (error) throw error
    return true
  } catch (error) {
    handleAccountabilityDatabaseError(error, 'delete accountability task')
    return false
  }
}

// Penalty Management
export const getAccountabilityPenalties = async (): Promise<AccountabilityPenalty[]> => {
  try {
    const { data, error } = await accountabilitySupabase
      .from(ACCOUNTABILITY_TABLES.PENALTIES)
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    handleAccountabilityDatabaseError(error, 'get accountability penalties')
    return []
  }
}

export const addAccountabilityPenalty = async (penalty: Omit<AccountabilityPenalty, 'id' | 'created_at'>) => {
  try {
    const newPenalty: AccountabilityPenalty = {
      ...penalty,
      id: generateAccountabilityUniqueId(),
      created_at: new Date().toISOString()
    }

    const { data, error } = await accountabilitySupabase
      .from(ACCOUNTABILITY_TABLES.PENALTIES)
      .insert(newPenalty)
      .select()

    if (error) throw error
    return data[0]
  } catch (error) {
    handleAccountabilityDatabaseError(error, 'add accountability penalty')
    return null
  }
}

// Achievement Management
export const getAccountabilityAchievements = async (): Promise<AccountabilityAchievement[]> => {
  try {
    const { data, error } = await accountabilitySupabase
      .from(ACCOUNTABILITY_TABLES.ACHIEVEMENTS)
      .select('*')
      .order('unlocked_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    handleAccountabilityDatabaseError(error, 'get accountability achievements')
    return []
  }
}

export const addAccountabilityAchievement = async (achievement: Omit<AccountabilityAchievement, 'id' | 'unlocked_at'>) => {
  try {
    const newAchievement: AccountabilityAchievement = {
      ...achievement,
      id: generateAccountabilityUniqueId(),
      unlocked_at: new Date().toISOString()
    }

    const { data, error } = await accountabilitySupabase
      .from(ACCOUNTABILITY_TABLES.ACHIEVEMENTS)
      .insert(newAchievement)
      .select()

    if (error) throw error
    return data[0]
  } catch (error) {
    handleAccountabilityDatabaseError(error, 'add accountability achievement')
    return null
  }
}

// Settings Management
export const getAccountabilitySettings = async (): Promise<AccountabilitySettings | null> => {
  try {
    const { data, error } = await accountabilitySupabase
      .from(ACCOUNTABILITY_TABLES.SETTINGS)
      .select('*')
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 is "no rows returned"
    return data
  } catch (error) {
    handleAccountabilityDatabaseError(error, 'get accountability settings')
    return null
  }
}

export const saveAccountabilitySettings = async (settings: Partial<AccountabilitySettings>) => {
  try {
    const existingSettings = await getAccountabilitySettings()
    
    if (existingSettings) {
      // Update existing settings
      const { data, error } = await accountabilitySupabase
        .from(ACCOUNTABILITY_TABLES.SETTINGS)
        .update(settings)
        .eq('id', existingSettings.id)
        .select()

      if (error) throw error
      return data[0]
    } else {
      // Create new settings
      const newSettings: AccountabilitySettings = {
        id: generateAccountabilityUniqueId(),
        penalty_amount: 5,
        points_per_task: 10,
        points_per_missed: -5,
        theme: 'dark',
        notifications: true,
        ...settings
      }

      const { data, error } = await accountabilitySupabase
        .from(ACCOUNTABILITY_TABLES.SETTINGS)
        .insert(newSettings)
        .select()

      if (error) throw error
      return data[0]
    }
  } catch (error) {
    handleAccountabilityDatabaseError(error, 'save accountability settings')
    return null
  }
}

// Utility Functions
export const calculateMissedTaskPenalties = async (date: string) => {
  try {
    const tasks = await getAccountabilityTasks()
    const settings = await getAccountabilitySettings()
    const penaltyAmount = settings?.penalty_amount || 5

    const dateTasks = tasks.filter(task => task.date === date && task.status !== 'completed')
    
    for (const task of dateTasks) {
      // Check if penalty already exists
      const penalties = await getAccountabilityPenalties()
      const existingPenalty = penalties.find(p => p.user_id === task.user_id && p.date === date && p.reason.includes(task.title))
      
      if (!existingPenalty) {
        await addAccountabilityPenalty({
          user_id: task.user_id,
          date: date,
          amount: penaltyAmount,
          reason: `Missed task: ${task.title}`
        })
      }
    }
  } catch (error) {
    console.error('Error calculating penalties:', error)
  }
}

export const getPenaltySummary = async () => {
  try {
    const penalties = await getAccountabilityPenalties()
    const users = await getAccountabilityUsers()
    
    const summary: Record<string, number> = {}
    
    users.forEach(user => {
      summary[user.id] = penalties
        .filter(penalty => penalty.user_id === user.id)
        .reduce((total, penalty) => total + penalty.amount, 0)
    })
    
    return summary
  } catch (error) {
    console.error('Error getting penalty summary:', error)
    return {}
  }
}

// Image Storage Functions
export const uploadProofImage = async (file: File, taskId: string): Promise<string> => {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${taskId}_${Date.now()}.${fileExt}`;
    
    // Upload file to Supabase Storage
    const { data, error } = await accountabilitySupabase.storage
      .from('proof-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      throw error;
    }
    
    // Get public URL
    const { data: urlData } = accountabilitySupabase.storage
      .from('proof-images')
      .getPublicUrl(fileName);
    
    return urlData.publicUrl;
  } catch (error) {
    handleAccountabilityDatabaseError(error, 'upload proof image');
    throw error;
  }
};

export const deleteProofImage = async (imageUrl: string): Promise<void> => {
  try {
    if (!imageUrl) return;
    
    // Extract file path from URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    
    // Delete file from Supabase Storage
    const { error } = await accountabilitySupabase.storage
      .from('proof-images')
      .remove([fileName]);
    
    if (error) throw error;
  } catch (error) {
    handleAccountabilityDatabaseError(error, 'delete proof image');
  }
};

export const getImageUrl = (imageUrl: string): string | null => {
  if (!imageUrl) return null;
  
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // If it's a base64 string, return as is (for backward compatibility)
  if (imageUrl.startsWith('data:image')) {
    return imageUrl;
  }
  
  // Otherwise, assume it's a file path and get public URL
  const { data } = accountabilitySupabase.storage
    .from('proof-images')
    .getPublicUrl(imageUrl);
  
  return data.publicUrl;
};

export const getDatesWithTasks = async (): Promise<string[]> => {
  try {
    const { data, error } = await accountabilitySupabase
      .from(ACCOUNTABILITY_TABLES.TASKS)
      .select('date')
      .order('date', { ascending: false });

    if (error) throw error;
    
    const dates = [...new Set(data.map(task => task.date))];
    return dates;
  } catch (error) {
    handleAccountabilityDatabaseError(error, 'get dates with tasks');
    return [];
  }
};
