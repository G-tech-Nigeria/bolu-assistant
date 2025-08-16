import { openDB, DBSchema } from 'idb';

interface ActivityDB extends DBSchema {
  runs: {
    key: string;
    value: {
      id: string;
      startTime: Date;
      endTime?: Date;
      duration: number;
      distance: number;
      pace: number;
      calories: number;
      route: Array<{
        latitude: number;
        longitude: number;
        timestamp: Date;
        accuracy?: number;
      }>;
      isActive: boolean;
    };
  };
  workouts: {
    key: string;
    value: {
      id: string;
      name: string;
      type: 'cardio' | 'strength' | 'flexibility' | 'sports';
      duration: number;
      exercises: Array<{
        id: string;
        name: string;
        sets: number;
        reps: number;
        weight?: number;
        duration?: number;
        restTime: number;
      }>;
      targetCalories?: number;
      date: string;
    };
  };
  activityMetrics: {
    key: string;
    value: {
      date: string;
      steps: number;
      calories: number;
      distance: number;
      activeMinutes: number;
      heartRate?: number;
    };
  };
}

const dbName = 'ActivityTrackerDB';
const dbVersion = 1;

const initDB = async () => {
  return openDB<ActivityDB>(dbName, dbVersion, {
    upgrade(db) {
      // Create runs store
      if (!db.objectStoreNames.contains('runs')) {
        const runsStore = db.createObjectStore('runs', { keyPath: 'id' });
        runsStore.createIndex('startTime', 'startTime');
        runsStore.createIndex('isActive', 'isActive');
      }

      // Create workouts store
      if (!db.objectStoreNames.contains('workouts')) {
        const workoutsStore = db.createObjectStore('workouts', { keyPath: 'id' });
        workoutsStore.createIndex('date', 'date');
        workoutsStore.createIndex('type', 'type');
      }

      // Create activity metrics store
      if (!db.objectStoreNames.contains('activityMetrics')) {
        const metricsStore = db.createObjectStore('activityMetrics', { keyPath: 'date' });
      }
    },
  });
};

// Run tracking functions
export const saveRun = async (run: any) => {
  const db = await initDB();
  return db.put('runs', run);
};

export const getRuns = async (): Promise<any[]> => {
  const db = await initDB();
  return db.getAll('runs');
};

export const getRunById = async (id: string): Promise<any> => {
  const db = await initDB();
  return db.get('runs', id);
};

export const getActiveRun = async (): Promise<any> => {
  const db = await initDB();
  const tx = db.transaction('runs', 'readonly');
  const store = tx.objectStore('runs');
  const index = store.index('isActive');
  const runs = await index.getAll(true);
  return runs.length > 0 ? runs[0] : null;
};

export const deleteRun = async (id: string) => {
  const db = await initDB();
  return db.delete('runs', id);
};

// Workout functions
export const saveWorkout = async (workout: any) => {
  const db = await initDB();
  return db.put('workouts', workout);
};

export const getWorkouts = async (): Promise<any[]> => {
  const db = await initDB();
  return db.getAll('workouts');
};

export const getWorkoutsByDate = async (date: string): Promise<any[]> => {
  const db = await initDB();
  const tx = db.transaction('workouts', 'readonly');
  const store = tx.objectStore('workouts');
  const index = store.index('date');
  return index.getAll(date);
};

export const deleteWorkout = async (id: string) => {
  const db = await initDB();
  return db.delete('workouts', id);
};

// Activity metrics functions
export const saveActivityMetrics = async (metrics: any) => {
  const db = await initDB();
  return db.put('activityMetrics', metrics);
};

export const getActivityMetrics = async (date: string): Promise<any> => {
  const db = await initDB();
  return db.get('activityMetrics', date);
};

export const getActivityMetricsRange = async (startDate: string, endDate: string): Promise<any[]> => {
  const db = await initDB();
  const tx = db.transaction('activityMetrics', 'readonly');
  const store = tx.objectStore('activityMetrics');
  const allMetrics = await store.getAll();
  
  return allMetrics.filter(metric => 
    metric.date >= startDate && metric.date <= endDate
  );
};

// Utility functions
export const clearAllData = async () => {
  const db = await initDB();
  await db.clear('runs');
  await db.clear('workouts');
  await db.clear('activityMetrics');
};

export const getDatabaseStats = async () => {
  const db = await initDB();
  const runsCount = await db.count('runs');
  const workoutsCount = await db.count('workouts');
  const metricsCount = await db.count('activityMetrics');
  
  return {
    runs: runsCount,
    workouts: workoutsCount,
    metrics: metricsCount
  };
};
