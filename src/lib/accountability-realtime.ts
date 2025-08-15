import { accountabilitySupabase, ACCOUNTABILITY_TABLES } from './accountability-supabase';

// Store active subscriptions
let subscriptions = {
  users: null as any,
  tasks: null as any,
  penalties: null as any,
  achievements: null as any
};

// Store callback functions for data updates
let updateCallbacks = {
  users: [] as Function[],
  tasks: [] as Function[],
  penalties: [] as Function[],
  achievements: [] as Function[]
};

// Global reload callback
let globalReloadCallback: ((table: string, payload: any) => void) | null = null;

// Initialize real-time subscriptions
export const initializeAccountabilityRealtime = () => {
  // Subscribe to users table changes
  subscriptions.users = accountabilitySupabase
    .channel('accountability_users_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: ACCOUNTABILITY_TABLES.USERS },
      (payload) => {
        updateCallbacks.users.forEach(callback => callback(payload));
        // Trigger global reload
        if (globalReloadCallback) {
          globalReloadCallback('users', payload);
        }
      }
    )
    .subscribe();

  // Subscribe to tasks table changes
  subscriptions.tasks = accountabilitySupabase
    .channel('accountability_tasks_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: ACCOUNTABILITY_TABLES.TASKS },
      (payload) => {
        updateCallbacks.tasks.forEach(callback => callback(payload));
        // Trigger global reload
        if (globalReloadCallback) {
          globalReloadCallback('tasks', payload);
        }
      }
    )
    .subscribe();

  // Subscribe to penalties table changes
  subscriptions.penalties = accountabilitySupabase
    .channel('accountability_penalties_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: ACCOUNTABILITY_TABLES.PENALTIES },
      (payload) => {
        updateCallbacks.penalties.forEach(callback => callback(payload));
        // Trigger global reload
        if (globalReloadCallback) {
          globalReloadCallback('penalties', payload);
        }
      }
    )
    .subscribe();

  // Subscribe to achievements table changes
  subscriptions.achievements = accountabilitySupabase
    .channel('accountability_achievements_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: ACCOUNTABILITY_TABLES.ACHIEVEMENTS },
      (payload) => {
        updateCallbacks.achievements.forEach(callback => callback(payload));
        // Trigger global reload
        if (globalReloadCallback) {
          globalReloadCallback('achievements', payload);
        }
      }
    )
    .subscribe();

  console.log('Accountability real-time subscriptions initialized');
};

// Register callback for specific table updates
export const onAccountabilityTableUpdate = (table: string, callback: Function) => {
  if (updateCallbacks[table as keyof typeof updateCallbacks]) {
    updateCallbacks[table as keyof typeof updateCallbacks].push(callback);
  }
  return () => {
    // Return unsubscribe function
    if (updateCallbacks[table as keyof typeof updateCallbacks]) {
      updateCallbacks[table as keyof typeof updateCallbacks] = updateCallbacks[table as keyof typeof updateCallbacks].filter(cb => cb !== callback);
    }
  };
};

// Register global reload callback
export const onAccountabilityGlobalReload = (callback: (table: string, payload: any) => void) => {
  globalReloadCallback = callback;
  return () => {
    globalReloadCallback = null;
  };
};

// Cleanup subscriptions
export const cleanupAccountabilityRealtime = () => {
  Object.values(subscriptions).forEach(subscription => {
    if (subscription) {
      accountabilitySupabase.removeChannel(subscription);
    }
  });
  subscriptions = {
    users: null,
    tasks: null,
    penalties: null,
    achievements: null
  };
  updateCallbacks = {
    users: [],
    tasks: [],
    penalties: [],
    achievements: []
  };
  globalReloadCallback = null;
  console.log('Accountability real-time subscriptions cleaned up');
};

// Get subscription status
export const getAccountabilitySubscriptionStatus = () => {
  return {
    users: !!subscriptions.users,
    tasks: !!subscriptions.tasks,
    penalties: !!subscriptions.penalties,
    achievements: !!subscriptions.achievements
  };
};

