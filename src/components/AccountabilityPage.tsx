import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AccountabilityPageProps {
  onBack: () => void;
}

const AccountabilityPage: React.FC<AccountabilityPageProps> = ({ onBack }) => {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [completedSections, setCompletedSections] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(5);
  const [todayHours, setTodayHours] = useState(0);

  useEffect(() => {
    // Load saved data from localStorage
    const savedStreak = localStorage.getItem('codingStreak');
    const savedHours = localStorage.getItem('totalHours');
    const savedSections = localStorage.getItem('completedSections');
    const savedTodayHours = localStorage.getItem('todayHours');

    if (savedStreak) setCurrentStreak(parseInt(savedStreak));
    if (savedHours) setTotalHours(parseInt(savedHours));
    if (savedSections) setCompletedSections(parseInt(savedSections));
    if (savedTodayHours) setTodayHours(parseInt(savedTodayHours));
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && (timerMinutes > 0 || timerSeconds > 0)) {
      interval = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds(timerSeconds - 1);
        } else if (timerMinutes > 0) {
          setTimerMinutes(timerMinutes - 1);
          setTimerSeconds(59);
        } else {
          setIsTimerRunning(false);
          updateProgress(0.42);
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isTimerRunning, timerMinutes, timerSeconds]);

  const startTimer = () => setIsTimerRunning(true);
  const pauseTimer = () => setIsTimerRunning(false);
  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerMinutes(25);
    setTimerSeconds(0);
  };

  const updateProgress = (hours: number) => {
    const newTotalHours = totalHours + hours;
    const newTodayHours = todayHours + hours;
    setTotalHours(newTotalHours);
    setTodayHours(newTodayHours);
    localStorage.setItem('totalHours', newTotalHours.toString());
    localStorage.setItem('todayHours', newTodayHours.toString());
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={onBack}
            className="mb-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
          >
            ← Back to Roadmap
          </button>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            🎯 Accountability System
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Your personal motivation and productivity system
          </p>
        </div>

        {/* Progress Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{currentStreak}</div>
            <div className="text-gray-600 dark:text-gray-400">Day Streak</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-3xl mb-2">⏰</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalHours}h</div>
            <div className="text-gray-600 dark:text-gray-400">Total Hours</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{completedSections}</div>
            <div className="text-gray-600 dark:text-gray-400">Sections Done</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{todayHours}/{dailyGoal}h</div>
            <div className="text-gray-600 dark:text-gray-400">Today's Goal</div>
          </div>
        </motion.div>

        {/* Pomodoro Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">⏰ Focus Timer</h2>
          <div className="text-center">
            <div className="text-6xl font-bold text-blue-500 mb-6">
              {timerMinutes.toString().padStart(2, '0')}:{timerSeconds.toString().padStart(2, '0')}
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={startTimer}
                disabled={isTimerRunning}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors"
              >
                ▶️ Start
              </button>
              <button
                onClick={pauseTimer}
                disabled={!isTimerRunning}
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors"
              >
                ⏸️ Pause
              </button>
              <button
                onClick={resetTimer}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
              >
                🔄 Reset
              </button>
            </div>
          </div>
        </motion.div>

        {/* Success Formula */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">🎯 Your Success Formula</h2>
          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-8 rounded-xl">
            <div className="text-4xl font-bold mb-4 text-white">
              Consistency + Focus + Accountability + Visualization = SUCCESS
            </div>
            <p className="text-xl text-white">
              Start RIGHT NOW with Section 1, Subsection 1. Don't think about it - just DO IT!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AccountabilityPage;
