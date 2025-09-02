import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  MoreHorizontal,
  ArrowRight,
  Copy,
  Camera,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { 
  getAccountabilityUsers as getUsers, 
  getAccountabilityTasks as getTasks, 
  addAccountabilityTask as addTask, 
  updateAccountabilityTask as updateTask, 
  deleteAccountabilityTask as deleteTask, 
  // calculateMissedTaskPenalties, // Temporarily disabled due to database schema mismatch
  getAccountabilityPenalties,
  getAccountabilitySettings,
  uploadProofImage,
  deleteProofImage,
  getImageUrl,
  getDatesWithTasks
} from '../lib/accountability';
import { checkAllAchievements } from '../lib/achievements';
import { format, addDays, subDays, isToday, isYesterday } from 'date-fns';
import { onAccountabilityTableUpdate, initializeAccountabilityRealtime, cleanupAccountabilityRealtime } from '../lib/accountability-realtime';
import './Accountability.css';

const Accountability = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState({ title: '', userId: '', time: '' });
  const [showAddForm, setShowAddForm] = useState<Record<string, boolean>>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // Helper function to get current date in local timezone (same as Check project)
  const getCurrentDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getCurrentDateString());
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [achievementPopup, setAchievementPopup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const taskTitleRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    const loadDataAsync = async () => {
      await loadData();
      await loadAvailableDates();
    };
    loadDataAsync();
  }, [selectedDate]);

  // Auto-update to today's date when component mounts if viewing a past date
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDateObj = new Date(selectedDate);
    selectedDateObj.setHours(0, 0, 0, 0);
    
    // If the selected date is in the past, automatically update to today
    if (selectedDateObj < today) {
      const todayString = getCurrentDateString();
      setSelectedDate(todayString);
    }
  }, []); // Only run once when component mounts

  // Check for penalties when component mounts and when date changes
  useEffect(() => {
    const calculatePenaltiesForCurrentDate = async () => {
      try {
        // Only calculate penalties for the specific date being viewed if it's in the past
        const selectedDateObj = new Date(selectedDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Temporarily disabled penalty calculation due to database schema mismatch
        // if (selectedDateObj < today) {
        //   console.log('Accountability: Calculating penalties for specific date:', selectedDate);
        //   await calculateMissedTaskPenalties(selectedDate);
        // }
      } catch (error) {
        console.error('Error calculating penalties:', error);
      }
    };
    
    // Temporarily disabled penalty calculation due to database schema mismatch
    // calculatePenaltiesForCurrentDate();
  }, [selectedDate]);

  // Listen for achievement unlock events
  useEffect(() => {
    const handleAchievementUnlock = (event: any) => {
      const { achievement } = event.detail;
      setAchievementPopup(achievement);
      
      // Auto-hide popup after 5 seconds
      setTimeout(() => {
        setAchievementPopup(null);
      }, 5000);
    };

    window.addEventListener('achievementUnlocked', handleAchievementUnlock);
    return () => {
      window.removeEventListener('achievementUnlocked', handleAchievementUnlock);
    };
  }, []);

  // Real-time updates for tasks and users
  useEffect(() => {
    const unsubscribeTasks = onAccountabilityTableUpdate('tasks', async (payload: any) => {
      // Reload tasks data
      try {
        const tasksData = await getTasks();
        const filteredTasks = tasksData.filter(task => task.date === selectedDate);
        setTasks(filteredTasks);
      } catch (err) {
        console.error('Error updating tasks in Accountability:', err);
      }
    });

    const unsubscribeUsers = onAccountabilityTableUpdate('users', async (payload: any) => {
      // Reload users data
      try {
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (err) {
        console.error('Error updating users in Accountability:', err);
      }
    });

    // Initialize real-time subscriptions
    initializeAccountabilityRealtime();

    // Cleanup on unmount
    return () => {
      unsubscribeTasks();
      unsubscribeUsers();
      cleanupAccountabilityRealtime();
    };
  }, [selectedDate]);

    const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const usersData = await getUsers();
      const tasksData = await getTasks();
      const filteredTasks = tasksData.filter(task => task.date === selectedDate);
      
      setUsers(usersData);
      setTasks(filteredTasks);
      
      // Temporarily disabled penalty calculation due to database schema mismatch
      // // Calculate penalties for missed tasks if viewing a past date
      // const selectedDateObj = new Date(selectedDate);
      // const today = new Date();
      // today.setHours(0, 0, 0, 0);
      // 
      // if (selectedDateObj < today) {
      //   await calculateMissedTaskPenalties(selectedDate);
      // }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableDates = async () => {
    try {
      const dates = await getDatesWithTasks();
      setAvailableDates(dates);
    } catch (err) {
      console.error('Error loading available dates:', err);
      // Don't set error state for this as it's not critical
    }
  };

  const handleDateChange = async (direction: 'prev' | 'next') => {
    const currentDateObj = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let newDate;
    
    if (direction === 'prev') {
      // Allow going to previous days
      newDate = subDays(currentDateObj, 1);
    } else {
      // Allow going to next day, but only if it's not more than 1 day in the future
      newDate = addDays(currentDateObj, 1);
      const nextDateObj = new Date(newDate);
      nextDateObj.setHours(0, 0, 0, 0);
      
      // Allow if the next date is today or earlier
      if (nextDateObj > today) {
        // Don't allow going to future dates beyond today
        return;
      }
    }
    
    // Use the same date string format as Check project
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const day = String(newDate.getDate()).padStart(2, '0');
    const newDateString = `${year}-${month}-${day}`;
    setSelectedDate(newDateString);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const getDateDisplayText = (date: string) => {
    const dateObj = new Date(date);
    if (isToday(dateObj)) {
      return 'Today';
    } else if (isYesterday(dateObj)) {
      return 'Yesterday';
    } else {
      return format(dateObj, 'EEEE, MMMM do');
    }
  };

  // Check if the selected date is in the past (read-only mode)
  const isDateInPast = () => {
    const selectedDateObj = new Date(selectedDate);
    selectedDateObj.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDateObj < today;
  };

  const handleShowAddForm = (userId: string) => {
    setShowAddForm({ ...showAddForm, [userId]: true });
    // Focus the input after a short delay to ensure the form is rendered
    setTimeout(() => {
      if (taskTitleRefs.current[userId]) {
        taskTitleRefs.current[userId]?.focus();
      }
    }, 100);
  };

    const handleAddTask = async (userId: string) => {
    if (!newTask.title.trim()) return;
    
    // Prevent adding tasks to past dates only
    if (isDateInPast()) {
      alert('Cannot add tasks to past dates. Tasks can only be added to today or future dates.');
      return;
    }

    try {
      const task = {
        title: newTask.title,
        user_id: userId,
        date: selectedDate,
        time: newTask.time || '',
        status: 'pending',
        description: ''
      };

      // Add task to database
      const newTaskData = await addTask(task);
      
      // Optimistically update the UI immediately
      if (newTaskData) {
        const transformedTask = {
          ...newTaskData,
          userId: newTaskData.user_id
        };
        setTasks(prevTasks => [...prevTasks, transformedTask]);
      }
      
      // Reset form
      setNewTask({ title: '', userId: '', time: '' });
      setShowAddForm({ ...showAddForm, [userId]: false });
      
      // Check for achievements in the background (don't wait for it)
      checkAllAchievements(userId, selectedDate).catch(err => 
        console.error('Error checking achievements:', err)
      );
    } catch (err) {
      console.error('Error adding task:', err);
      alert('Failed to add task. Please try again.');
    }
  };

    const handleToggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Prevent toggling tasks on past dates
    if (isDateInPast()) {
      alert('Cannot modify tasks on past dates. Tasks are read-only for previous days.');
      return;
    }

    try {
      const updatedTask = {
        ...task,
        status: task.status === 'completed' ? 'pending' : 'completed'
      };

      // Optimistically update the UI immediately
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === taskId ? updatedTask : t)
      );

      // Update in database
      await updateTask(taskId, updatedTask);
      
      // Check for achievements in the background when task is completed
      if (updatedTask.status === 'completed') {
        checkAllAchievements(task.user_id, selectedDate).catch(err => 
          console.error('Error checking achievements:', err)
        );
      }
    } catch (err) {
      console.error('Error toggling task:', err);
      alert('Failed to update task. Please try again.');
      
      // Revert optimistic update
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === taskId ? task : t)
      );
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    // Prevent deleting tasks on past dates
    if (isDateInPast()) {
      alert('Cannot delete tasks on past dates. Tasks are read-only for previous days.');
      return;
    }

    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      // Optimistically remove from UI immediately
      setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
      
      // Delete from database
      await deleteTask(taskId);
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task. Please try again.');
      
      // Revert optimistic update
      if (task) {
        setTasks(prevTasks => [...prevTasks, task]);
      }
    }
  };

  const handleProofUpload = async (taskId: string) => {
    // Prevent uploading proof on past dates
    if (isDateInPast()) {
      alert('Cannot upload proof on past dates. Tasks are read-only for previous days.');
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        try {
          const task = tasks.find(t => t.id === taskId);
          if (task) {
            // Show loading state
            const loadingTask = {
              ...task,
              proof: 'uploading...',
              status: 'completed'
            };
            
            // Optimistically update the UI immediately
      setTasks(prevTasks => 
              prevTasks.map(t => t.id === taskId ? loadingTask : t)
            );
            
            // Upload image to Supabase Storage
            const imageUrl = await uploadProofImage(file, taskId);
            
            const updatedTask = {
              ...task,
              proof: imageUrl,
              status: 'completed'
            };
            
            // Update UI with actual image URL
            setTasks(prevTasks => 
              prevTasks.map(t => t.id === taskId ? updatedTask : t)
            );
            
            // Update in database
            await updateTask(taskId, updatedTask);
            
            // Check for achievements in the background
            checkAllAchievements(task.user_id, selectedDate).catch(err => 
              console.error('Error checking achievements:', err)
            );
          }
        } catch (error: any) {
          console.error('Error uploading proof:', error);
          alert(`Failed to upload proof: ${error.message}. Please try again.`);
          
          // Revert the optimistic update
          const task = tasks.find(t => t.id === taskId);
          if (task) {
            setTasks(prevTasks => 
              prevTasks.map(t => t.id === taskId ? task : t)
            );
          }
        }
      }
    };
    
    input.click();
  };

  const handleRemoveProof = async (taskId: string) => {
    // Prevent removing proof on past dates
    if (isDateInPast()) {
      alert('Cannot modify tasks on past dates. Tasks are read-only for previous days.');
      return;
    }

    const task = tasks.find(t => t.id === taskId);
    if (task) {
      try {
        // Delete image from storage if it exists
        if (task.proof && task.proof !== 'uploading...') {
          await deleteProofImage(task.proof);
        }
        
        const updatedTask = {
          ...task,
          proof: null
        };
        
        // Optimistically update the UI immediately
        setTasks(prevTasks => 
          prevTasks.map(t => t.id === taskId ? updatedTask : t)
        );
        
        // Update in database
        await updateTask(taskId, updatedTask);
      } catch (error) {
        console.error('Error removing proof:', error);
        alert('Failed to remove proof. Please try again.');
      }
    }
  };

  const getTasksForUser = (userId: string) => {
    return tasks.filter(task => task.user_id === userId);
  };

  const getTaskCount = (userId: string) => {
    return getTasksForUser(userId).length;
  };

  return (
    <div className="accountability-container">
      <div className="container">
        {/* Breadcrumbs */}
        <div className="breadcrumbs">
          <span>Dashboard</span>
          <span className="breadcrumb-separator">{'>'}</span>
          <span>Daily Tasks</span>
        </div>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          Daily Tasks
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {format(new Date(selectedDate), 'EEEE, MMMM do, yyyy')}
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1rem',
          color: '#ef4444'
        }}>
          <strong>Error:</strong> {error}
          <button
            onClick={() => setError(null)}
            style={{
              background: 'none',
              border: 'none',
              color: '#ef4444',
              cursor: 'pointer',
              float: 'right',
              fontSize: '1.2rem'
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          color: 'var(--text-secondary)'
        }}>
          Loading tasks...
        </div>
      )}

      {/* Date Picker */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2rem',
        padding: '0.5rem 1rem',
        background: 'var(--bg-card)',
        borderRadius: '12px',
        border: '1px solid var(--sidebar-border)'
      }}>
          <button
            onClick={() => handleDateChange('prev')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '0.5rem'
          }}
        >
          <ChevronLeft size={16} />
          </button>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Calendar size={16} />
          <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
              {getDateDisplayText(selectedDate)}
          </span>

          {isDateInPast() && (
            <span style={{
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}>
              Read Only
            </span>
          )}

          {selectedDate !== getCurrentDateString() && (
            <button
              onClick={() => setSelectedDate(getCurrentDateString())}
              style={{
                background: 'var(--accent-blue)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              Go to Today
            </button>
          )}
        </div>
          <button
            onClick={() => handleDateChange('next')}
            disabled={selectedDate === getCurrentDateString()}
            style={{
              background: 'none',
              border: 'none',
              color: selectedDate === getCurrentDateString() ? 'var(--text-muted)' : 'var(--text-secondary)',
              cursor: selectedDate === getCurrentDateString() ? 'not-allowed' : 'pointer',
              padding: '0.5rem',
              opacity: selectedDate === getCurrentDateString() ? 0.5 : 1
            }}
          >
            <ChevronRight size={16} />
          </button>
      </div>

      {/* Dynamic Column Layout */}
      {!loading && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(auto-fit, minmax(280px, 1fr))`,
          gap: '1rem',
          minHeight: 'calc(100vh - 200px)'
        }}>
        {users.map(user => (
          <div key={user.id} style={{ 
            background: 'var(--bg-card)', 
            borderRadius: '12px',
            border: '1px solid var(--sidebar-border)',
            padding: '1rem'
          }}>
            {/* Column Header */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              marginBottom: '1rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid var(--sidebar-border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{user.avatar}</span>
            <div>
                  <h2 style={{ fontSize: '1rem', fontWeight: '600' }}>
                    {user.name} ({getTaskCount(user.id)})
                  </h2>
            </div>
          </div>
        </div>

            {/* Task List */}
            <div style={{ marginBottom: '1rem' }}>
              {getTasksForUser(user.id).map(task => (
                <div key={task.id} style={{
                  background: 'var(--bg-primary)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  marginBottom: '0.5rem',
                  border: '1px solid var(--sidebar-border)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    {/* Checkbox */}
                    <div 
                      onClick={() => !isDateInPast() && handleToggleTask(task.id)}
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: '2px solid var(--text-muted)',
                        cursor: isDateInPast() ? 'not-allowed' : 'pointer',
                        marginTop: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: task.status === 'completed' ? 'var(--accent-green)' : 'transparent',
                        borderColor: task.status === 'completed' ? 'var(--accent-green)' : 'var(--text-muted)',
                        flexShrink: 0,
                        opacity: isDateInPast() ? 0.5 : 1
                      }}
                    >
                      {task.status === 'completed' && (
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: 'white'
                        }} />
                      )}
                    </div>

                    {/* Task Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.25rem'
                      }}>
                        <span style={{ fontSize: '1rem' }}>
                          📝
                        </span>
                        <div style={{
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                          color: task.status === 'completed' ? 'var(--text-muted)' : 'var(--text-primary)',
                          wordWrap: 'break-word',
                          flex: 1
                        }}>
                          {task.title}
                    </div>
                  </div>
                  
                      {/* Date and Time */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.75rem',
                        color: 'var(--accent-orange)',
                        marginBottom: '0.5rem',
                        flexWrap: 'wrap'
                      }}>
                        <Calendar size={12} />
                        <span>{format(new Date(task.date), 'dd MMM')}</span>
                        {task.time && (
                          <>
                            <Clock size={12} />
                            <span>{task.time}</span>
                          </>
                        )}
                        <ArrowRight size={12} style={{ color: 'var(--text-muted)' }} />
                        <Copy size={12} style={{ color: 'var(--text-muted)' }} />
                      <button
                          onClick={() => !isDateInPast() && handleDeleteTask(task.id)}
                          disabled={isDateInPast()}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: isDateInPast() ? 'var(--text-muted)' : 'var(--accent-red)',
                            cursor: isDateInPast() ? 'not-allowed' : 'pointer',
                            padding: '0.25rem',
                            opacity: isDateInPast() ? 0.5 : 1
                          }}
                          title={isDateInPast() ? 'Cannot delete past tasks' : 'Delete task'}
                        >
                          <X size={12} />
                      </button>
                      </div>

                      {/* Proof of Completion */}
                      {task.proof ? (
                        <div style={{ marginTop: '0.5rem' }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '0.5rem'
                          }}>
                            <span style={{
                              fontSize: '0.75rem',
                              color: task.proof === 'uploading...' ? 'var(--accent-orange)' : 'var(--accent-green)',
                              fontWeight: '500'
                            }}>
                              {task.proof === 'uploading...' ? '⏳ Uploading...' : '✅ Proof uploaded'}
                            </span>
                            {task.proof !== 'uploading...' && (
                            <button
                                onClick={() => !isDateInPast() && handleRemoveProof(task.id)}
                                disabled={isDateInPast()}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: isDateInPast() ? 'var(--text-muted)' : 'var(--text-muted)',
                                  cursor: isDateInPast() ? 'not-allowed' : 'pointer',
                                  padding: '0.25rem',
                                  opacity: isDateInPast() ? 0.5 : 1
                                }}
                              >
                                <X size={12} />
                            </button>
                            )}
                          </div>
                          {task.proof === 'uploading...' ? (
                            <div style={{
                              width: '100%',
                              maxWidth: '200px',
                              height: '120px',
                              background: 'var(--bg-secondary)',
                              borderRadius: '6px',
                              border: '1px solid var(--sidebar-border)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--text-muted)',
                              fontSize: '0.75rem'
                            }}>
                              ⏳ Uploading...
                          </div>
                        ) : (
                            <img
                              src={getImageUrl(task.proof) || ''}
                              alt="Task proof"
                              onClick={() => setSelectedImage(getImageUrl(task.proof) || null)}
                              style={{
                                width: '100%',
                                maxWidth: '200px',
                                height: '120px',
                                objectFit: 'cover',
                                borderRadius: '6px',
                                border: '1px solid var(--sidebar-border)',
                                cursor: 'pointer',
                                transition: 'transform 0.2s ease'
                              }}
                              onMouseEnter={(e) => (e.target as HTMLElement).style.transform = 'scale(1.05)'}
                              onMouseLeave={(e) => (e.target as HTMLElement).style.transform = 'scale(1)'}
                              onError={(e) => {
                                console.error('Failed to load image:', task.proof);
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                              )}
                            </div>
                      ) : (
                        <div style={{ marginTop: '0.5rem' }}>
                              <button
                            onClick={() => !isDateInPast() && handleProofUpload(task.id)}
                            disabled={isDateInPast()}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              background: isDateInPast() ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                              border: '1px solid var(--sidebar-border)',
                              borderRadius: '6px',
                              padding: '0.5rem',
                              color: isDateInPast() ? 'var(--text-muted)' : 'var(--text-secondary)',
                              fontSize: '0.75rem',
                              cursor: isDateInPast() ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s ease',
                              width: '100%',
                              justifyContent: 'center',
                              opacity: isDateInPast() ? 0.5 : 1
                            }}
                          >
                            <Camera size={14} />
                            {isDateInPast() ? 'Read-only' : 'Upload proof'}
                              </button>
                          </div>
                        )}
                    </div>
                      </div>
                    </div>
                  ))}
            </div>

            {/* Add Task Button */}
            <div style={{ marginTop: 'auto' }}>
              {showAddForm[user.id] ? (
                <div style={{
                  background: 'var(--bg-primary)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  border: '1px solid var(--sidebar-border)'
                }}>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <input
                      ref={(el) => taskTitleRefs.current[user.id] = el}
                          type="text"
                      placeholder="Task title"
                          value={newTask.title}
                          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      style={{
                        flex: 1,
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--sidebar-border)',
                        borderRadius: '6px',
                        padding: '0.5rem',
                        color: 'var(--text-primary)',
                        fontSize: '0.875rem'
                      }}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddTask(user.id)}
                        />
                  </div>
                        <input
                    type="text"
                    placeholder="Time (optional)"
                          value={newTask.time}
                          onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--sidebar-border)',
                      borderRadius: '6px',
                      padding: '0.5rem',
                      color: 'var(--text-primary)',
                      fontSize: '0.875rem',
                      marginBottom: '0.5rem'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleAddTask(user.id)}
                      style={{
                        background: 'var(--accent-blue)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        flex: 1
                      }}
                    >
                      Add
                        </button>
                        <button
                          onClick={() => setShowAddForm({ ...showAddForm, [user.id]: false })}
                      style={{
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--sidebar-border)',
                        borderRadius: '6px',
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        flex: 1
                      }}
                    >
                      Cancel
                        </button>
                      </div>
                </div>
              ) : (
                <div>
                  {isDateInPast() && (
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--accent-orange)',
                      textAlign: 'center',
                      marginBottom: '0.5rem',
                      padding: '0.25rem',
                      background: 'rgba(255, 165, 0, 0.1)',
                      borderRadius: '4px',
                      border: '1px solid rgba(255, 165, 0, 0.3)'
                    }}>
                      📅 Read-only mode - Past date
                    </div>
                  )}
                    <button
                      onClick={() => handleShowAddForm(user.id)}
                    disabled={isDateInPast()}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: isDateInPast() ? 'var(--bg-secondary)' : 'none',
                      border: 'none',
                      color: isDateInPast() ? 'var(--text-secondary)' : 'var(--text-secondary)',
                      fontSize: '0.875rem',
                      cursor: isDateInPast() ? 'not-allowed' : 'pointer',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      width: '100%',
                      justifyContent: 'center',
                      opacity: isDateInPast() ? 0.5 : 1
                    }}
                    >
                      <Plus size={16} />
                    {isDateInPast() ? 'Read-only' : 'Add task'}
                    </button>
                </div>
                  )}
                </div>
              </div>
        ))}
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}
        onClick={() => setSelectedImage(null)}
        >
          <div style={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh'
          }}>
            <img
              src={selectedImage}
              alt="Task proof"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                borderRadius: '8px'
              }}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'var(--accent-red)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              ×
            </button>
      </div>
        </div>
      )}



      {/* Achievement Popup */}
      {achievementPopup && (
        <div 
          className="achievement-popup"
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-purple) 100%)',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
            zIndex: 1000,
            minWidth: '320px',
            maxWidth: '90vw',
            width: '400px',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.25rem'
              }}>
                🏆
              </div>
              <span style={{
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Achievement Unlocked!
              </span>
            </div>
            <button
              onClick={() => setAchievementPopup(null)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '0.25rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '32px',
                minHeight: '32px'
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Achievement Content */}
          <div 
            className="achievement-content"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1rem'
            }}
          >
            <div 
              className="achievement-icon"
              style={{
                width: '60px',
                height: '60px',
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                flexShrink: 0
              }}
            >
              {achievementPopup.icon || '🎯'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '700',
                color: 'white',
                marginBottom: '0.25rem',
                lineHeight: '1.2',
                wordWrap: 'break-word'
              }}>
                {achievementPopup.title}
          </h3>
              <p style={{
                fontSize: '0.875rem',
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: '1.4',
                marginBottom: '0.5rem',
                wordWrap: 'break-word'
              }}>
                {achievementPopup.description}
              </p>
            </div>
          </div>

          {/* User and Points Info */}
          <div 
            className="user-points-info"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{
                fontSize: '1.5rem'
              }}>
                {achievementPopup.user?.avatar || '👤'}
              </span>
              <span style={{
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                {achievementPopup.user?.name || 'User'}
              </span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              flexShrink: 0
            }}>
              <span style={{
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                +{achievementPopup.points || 0}
              </span>
              <span style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.75rem'
              }}>
                pts
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div 
            className="progress-bar"
            style={{
              marginTop: '0.75rem',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              height: '4px',
              overflow: 'hidden'
            }}
          >
            <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              height: '100%',
              width: '100%',
              animation: 'slideIn 0.5s ease-out'
            }} />
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Accountability;
