import React, { useState, useEffect, useRef } from 'react';
import { saveRun, getRuns, deleteRun, getRunStats } from '../lib/database';
import { 
  Play, 
  Pause, 
  Square, 
  MapPin, 
  Clock, 
  Navigation, 
  TrendingUp, 
  Target,
  Activity,
  Heart,
  Zap,
  Map,
  Calendar,
  Trophy,
  Plus,
  Settings,
  Save,
  X,
  Dumbbell
} from 'lucide-react';

interface RunSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
  distance: number; // in meters
  pace: number; // minutes per kilometer
  calories: number;
  route: GPSPoint[];
  isActive: boolean;
}

interface GPSPoint {
  latitude: number;
  longitude: number;
  timestamp: Date;
  accuracy?: number;
}



interface ActivityMetrics {
  steps: number;
  calories: number;
  distance: number; // in meters
  activeMinutes: number;
  heartRate?: number;
}

const ActivityTracker: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<'dashboard' | 'run'>('dashboard');
  const [isTracking, setIsTracking] = useState(false);
  const [currentRun, setCurrentRun] = useState<RunSession | null>(null);
  const [runHistory, setRunHistory] = useState<RunSession[]>([]);

  const [todayMetrics, setTodayMetrics] = useState<ActivityMetrics>({
    steps: 0,
    calories: 0,
    distance: 0,
    activeMinutes: 0
  });



  // GPS tracking
  const [currentPosition, setCurrentPosition] = useState<GPSPoint | null>(null);
  const [routePoints, setRoutePoints] = useState<GPSPoint[]>([]);
  const [watchId, setWatchId] = useState<number | null>(null);

  // Real-time metrics
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentDistance, setCurrentDistance] = useState(0);
  const [currentPace, setCurrentPace] = useState(0);
  const [currentCalories, setCurrentCalories] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load runs from Supabase on component mount
  useEffect(() => {
    const loadRuns = async () => {
      try {
        const runs = await getRuns();
        setRunHistory(runs.map(run => ({
          ...run,
          startTime: new Date(run.start_time),
          endTime: run.end_time ? new Date(run.end_time) : undefined
        })));
      } catch (error) {
        console.error('Error loading runs:', error);
      }
    };
    
    loadRuns();
  }, []);

  // Initialize GPS tracking
  useEffect(() => {
    if (isTracking && !watchId) {
      startGPSTracking();
    } else if (!isTracking && watchId) {
      stopGPSTracking();
    }
  }, [isTracking]);

  // Update real-time metrics
  useEffect(() => {
    if (isTracking && currentRun) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
        updateMetrics();
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTracking, currentRun]);

  const startGPSTracking = () => {
    if ('geolocation' in navigator) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const newPoint: GPSPoint = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date(),
            accuracy: position.coords.accuracy
          };
          
          setCurrentPosition(newPoint);
          setRoutePoints(prev => [...prev, newPoint]);
          
          if (currentRun) {
            updateRunDistance(newPoint);
          }
        },
        (error) => {
          console.error('GPS Error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
      setWatchId(id);
    }
  };

  const stopGPSTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  const updateRunDistance = (newPoint: GPSPoint) => {
    if (routePoints.length > 0) {
      const lastPoint = routePoints[routePoints.length - 1];
      const distance = calculateDistance(lastPoint, newPoint);
      setCurrentDistance(prev => prev + distance);
    }
  };

  const calculateDistance = (point1: GPSPoint, point2: GPSPoint): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = point1.latitude * Math.PI / 180;
    const φ2 = point2.latitude * Math.PI / 180;
    const Δφ = (point2.latitude - point1.latitude) * Math.PI / 180;
    const Δλ = (point2.longitude - point1.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  const updateMetrics = () => {
    if (currentDistance > 0 && elapsedTime > 0) {
      const paceInSeconds = elapsedTime / (currentDistance / 1000); // seconds per km
      const paceInMinutes = paceInSeconds / 60;
      setCurrentPace(paceInMinutes);
      
      // Estimate calories (rough calculation)
      const caloriesPerKm = 60; // Average calories burned per km
      const calories = (currentDistance / 1000) * caloriesPerKm;
      setCurrentCalories(calories);
    }
  };

  const startRun = () => {
    const newRun: RunSession = {
      id: Date.now().toString(),
      startTime: new Date(),
      duration: 0,
      distance: 0,
      pace: 0,
      calories: 0,
      route: [],
      isActive: true
    };
    
    setCurrentRun(newRun);
    setIsTracking(true);
    setElapsedTime(0);
    setCurrentDistance(0);
    setCurrentPace(0);
    setCurrentCalories(0);
    setRoutePoints([]);
  };

  const pauseRun = () => {
    setIsTracking(false);
  };

  const resumeRun = () => {
    setIsTracking(true);
  };

  const stopRun = async () => {
    if (currentRun) {
      const completedRun: RunSession = {
        ...currentRun,
        endTime: new Date(),
        duration: elapsedTime,
        distance: currentDistance,
        pace: currentPace,
        calories: currentCalories,
        route: routePoints,
        isActive: false
      };
      
      try {
        // Save to Supabase
        const savedRun = await saveRun({
          startTime: completedRun.startTime,
          endTime: completedRun.endTime,
          duration: completedRun.duration,
          distance: completedRun.distance,
          pace: completedRun.pace,
          calories: completedRun.calories,
          route: completedRun.route,
          userId: 'default'
        });
        
        // Update local state with the saved run (including Supabase ID)
        const runWithId = { ...completedRun, id: savedRun.id };
        setRunHistory(prev => [runWithId, ...prev]);
        

      } catch (error) {
        console.error('Error saving run to Supabase:', error);
        // Still update local state even if Supabase save fails
        setRunHistory(prev => [completedRun, ...prev]);
      }
      
      setCurrentRun(null);
      setIsTracking(false);
      setElapsedTime(0);
      setCurrentDistance(0);
      setCurrentPace(0);
      setCurrentCalories(0);
      setRoutePoints([]);
      stopGPSTracking();
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDistance = (meters: number): string => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(2)} km`;
    }
    return `${Math.round(meters)} m`;
  };

  const formatPace = (minutesPerKm: number): string => {
    const minutes = Math.floor(minutesPerKm);
    const seconds = Math.round((minutesPerKm - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')} /km`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Activity Tracker</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track your runs and fitness progress</p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={startRun}
            className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Start Run
          </button>

        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                 {[
           { id: 'dashboard', label: 'Dashboard', icon: Activity },
           { id: 'run', label: 'Run Tracker', icon: Map },
  

         ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Run Tracker */}
      {currentRun && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Active Run</h2>
            <div className="flex space-x-2">
              {isTracking ? (
                <button
                  onClick={pauseRun}
                  className="flex items-center px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <Pause className="w-4 h-4 mr-1" />
                  Pause
                </button>
              ) : (
                <button
                  onClick={resumeRun}
                  className="flex items-center px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Resume
                </button>
              )}
              <button
                onClick={stopRun}
                className="flex items-center px-3 py-1 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
              >
                <Square className="w-4 h-4 mr-1" />
                Stop
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{formatTime(elapsedTime)}</div>
              <div className="text-sm opacity-90">Duration</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{formatDistance(currentDistance)}</div>
              <div className="text-sm opacity-90">Distance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{formatPace(currentPace)}</div>
              <div className="text-sm opacity-90">Pace</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.round(currentCalories)}</div>
              <div className="text-sm opacity-90">Calories</div>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Today's Metrics */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <Activity className="w-6 h-6 text-blue-500 mr-3" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Today's Activity</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Steps</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{todayMetrics.steps.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Calories</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{todayMetrics.calories}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Distance</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{formatDistance(todayMetrics.distance)}</span>
              </div>
            </div>
          </div>

                     {/* Recent Runs */}
           <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
             <div className="flex items-center mb-4">
               <Map className="w-6 h-6 text-green-500 mr-3" />
               <h3 className="font-semibold text-gray-900 dark:text-gray-100">Recent Runs</h3>
             </div>
            <div className="space-y-3">
              {runHistory.slice(0, 3).map((run) => (
                <div key={run.id} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {formatDistance(run.distance)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {run.startTime.toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {formatTime(run.duration)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formatPace(run.pace)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <Zap className="w-6 h-6 text-yellow-500 mr-3" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Quick Actions</h3>
            </div>
            <div className="space-y-3">
              <button
                onClick={startRun}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Run
              </button>

            </div>
          </div>

          {/* Goals */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <Target className="w-6 h-6 text-red-500 mr-3" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Weekly Goals</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Runs</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">3/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Distance</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">15/20 km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Calories</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">1200/1500</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Run History Tab */}
      {activeTab === 'run' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Run History</h2>
            <div className="space-y-4">
              {runHistory.map((run) => (
                <div key={run.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                     <div className="flex items-center space-x-4">
                     <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                       <Map className="w-6 h-6 text-blue-500" />
                     </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {formatDistance(run.distance)} • {formatTime(run.duration)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {run.startTime.toLocaleDateString()} • {formatPace(run.pace)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {Math.round(run.calories)} cal
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}




    </div>
  );
};

export default ActivityTracker;
