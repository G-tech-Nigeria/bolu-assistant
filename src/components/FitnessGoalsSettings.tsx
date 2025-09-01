import React, { useState, useEffect } from 'react';
import { Target, Settings, Save, X } from 'lucide-react';
import { getFitnessGoals, updateFitnessGoal } from '../lib/database';

interface FitnessGoal {
  id: string;
  goal_type: string;
  target_value: number;
  current_value: number;
  period: string;
  is_active: boolean;
}

const FitnessGoalsSettings: React.FC = () => {
  const [goals, setGoals] = useState<FitnessGoal[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingGoals, setEditingGoals] = useState({
    runs: 5,
    distance: 20,
    calories: 1500
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const fetchedGoals = await getFitnessGoals();
      setGoals(fetchedGoals);
      
      // Set editing values based on current goals
      const runsGoal = fetchedGoals.find(g => g.goal_type === 'runs');
      const distanceGoal = fetchedGoals.find(g => g.goal_type === 'distance');
      const caloriesGoal = fetchedGoals.find(g => g.goal_type === 'calories');
      
      setEditingGoals({
        runs: runsGoal?.target_value || 5,
        distance: distanceGoal?.target_value || 20,
        calories: caloriesGoal?.target_value || 1500
      });
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const handleSave = async () => {
    try {
      await Promise.all([
        updateFitnessGoal('runs', editingGoals.runs),
        updateFitnessGoal('distance', editingGoals.distance),
        updateFitnessGoal('calories', editingGoals.calories)
      ]);
      
      await loadGoals();
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving goals:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadGoals(); // Reset to original values
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Target className="w-6 h-6 text-red-500 mr-3" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Weekly Goals Settings</h3>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Settings className="w-4 h-4 mr-1" />
            Edit
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Runs Goal */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">Weekly Runs</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Number of runs per week</div>
          </div>
          {isEditing ? (
            <input
              type="number"
              value={editingGoals.runs}
              onChange={(e) => setEditingGoals(prev => ({ ...prev, runs: parseInt(e.target.value) || 0 }))}
              className="w-20 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              min="1"
              max="20"
            />
          ) : (
            <div className="text-right">
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {goals.find(g => g.goal_type === 'runs')?.target_value || 5} runs
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Current: {goals.find(g => g.goal_type === 'runs')?.current_value || 0}
              </div>
            </div>
          )}
        </div>

        {/* Distance Goal */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">Weekly Distance</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total kilometers per week</div>
          </div>
          {isEditing ? (
            <input
              type="number"
              value={editingGoals.distance}
              onChange={(e) => setEditingGoals(prev => ({ ...prev, distance: parseInt(e.target.value) || 0 }))}
              className="w-20 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              min="1"
              max="100"
            />
          ) : (
            <div className="text-right">
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {goals.find(g => g.goal_type === 'distance')?.target_value || 20} km
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Current: {(goals.find(g => g.goal_type === 'distance')?.current_value || 0).toFixed(1)} km
              </div>
            </div>
          )}
        </div>

        {/* Calories Goal */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">Weekly Calories</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total calories burned per week</div>
          </div>
          {isEditing ? (
            <input
              type="number"
              value={editingGoals.calories}
              onChange={(e) => setEditingGoals(prev => ({ ...prev, calories: parseInt(e.target.value) || 0 }))}
              className="w-20 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              min="100"
              max="5000"
              step="100"
            />
          ) : (
            <div className="text-right">
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {goals.find(g => g.goal_type === 'calories')?.target_value || 1500} cal
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Current: {goals.find(g => g.goal_type === 'calories')?.current_value || 0}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Actions */}
      {isEditing && (
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleCancel}
            className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default FitnessGoalsSettings;
