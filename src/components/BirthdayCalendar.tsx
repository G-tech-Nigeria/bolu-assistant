import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit3, Trash2, Gift, Cake, Heart, Star, Users, Search, X } from 'lucide-react';
import { format, addDays, subDays, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';
import { getBirthdays, addBirthday, updateBirthday, deleteBirthday } from '../lib/database';

interface Birthday {
  id: string;
  name: string;
  date: string;
  relationship: string;
  age?: number;
  notes?: string;
  reminder: boolean;
  created_at: string;
}

const BirthdayCalendar: React.FC = () => {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBirthday, setEditingBirthday] = useState<Birthday | null>(null);
  const [deletingBirthday, setDeletingBirthday] = useState<Birthday | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBirthdays();
  }, []);

  const loadBirthdays = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBirthdays();
      setBirthdays(data);
    } catch (err) {
      console.error('Error loading birthdays:', err);
      setError('Failed to load birthdays. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const [newBirthday, setNewBirthday] = useState({
    name: '',
    date: '',
    relationship: '',
    notes: '',
    reminder: true
  });

  const getUpcomingBirthdays = () => {
    const today = new Date();
    const next30Days = addDays(today, 30);
    
    return birthdays.filter(birthday => {
      const birthdayDate = new Date(birthday.date);
      const nextBirthday = new Date(today.getFullYear(), birthdayDate.getMonth(), birthdayDate.getDate());
      
      // If birthday has passed this year, check next year
      if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
      }
      
      return nextBirthday <= next30Days;
    }).sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      const nextA = new Date(today.getFullYear(), dateA.getMonth(), dateA.getDate());
      const nextB = new Date(today.getFullYear(), dateB.getMonth(), dateB.getDate());
      
      if (nextA < today) nextA.setFullYear(today.getFullYear() + 1);
      if (nextB < today) nextB.setFullYear(today.getFullYear() + 1);
      
      return nextA.getTime() - nextB.getTime();
    });
  };

  const getDaysUntilBirthday = (birthdayDate: string) => {
    const today = new Date();
    const birthday = new Date(birthdayDate);
    const nextBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
    
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    const diffTime = nextBirthday.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today! 🎉';
    if (diffDays === 1) return 'Tomorrow! 🎂';
    if (diffDays <= 7) return `In ${diffDays} days ⏰`;
    if (diffDays <= 30) return `In ${diffDays} days 📅`;
    return `In ${diffDays} days`;
  };

  const getAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const getRelationshipIcon = (relationship: string) => {
    switch (relationship.toLowerCase()) {
      case 'family': return <Heart className="w-4 h-4 text-red-500" />;
      case 'friend': return <Users className="w-4 h-4 text-blue-500" />;
      case 'colleague': return <Star className="w-4 h-4 text-yellow-500" />;
      default: return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleAddBirthday = async () => {
    if (!newBirthday.name || !newBirthday.date) return;
    
    try {
      const birthdayData = {
        name: newBirthday.name,
        date: newBirthday.date,
        relationship: newBirthday.relationship || 'Other',
        notes: newBirthday.notes,
        reminder: newBirthday.reminder
      };
      
      const newBirthdayRecord = await addBirthday(birthdayData);
      
      if (newBirthdayRecord) {
        setBirthdays(prev => [...prev, newBirthdayRecord]);
        setNewBirthday({ name: '', date: '', relationship: '', notes: '', reminder: true });
        setShowAddForm(false);
      }
    } catch (err) {
      console.error('Error adding birthday:', err);
      setError('Failed to add birthday. Please try again.');
    }
  };

  const handleEditBirthday = async () => {
    if (!editingBirthday || !editingBirthday.name || !editingBirthday.date) return;
    
    try {
      const updateData = {
        name: editingBirthday.name,
        date: editingBirthday.date,
        relationship: editingBirthday.relationship,
        notes: editingBirthday.notes,
        reminder: editingBirthday.reminder
      };
      
      const updatedBirthday = await updateBirthday(editingBirthday.id, updateData);
      
      if (updatedBirthday) {
        setBirthdays(prev => prev.map(birthday => 
          birthday.id === editingBirthday.id ? updatedBirthday : birthday
        ));
        setEditingBirthday(null);
      }
    } catch (err) {
      console.error('Error updating birthday:', err);
      setError('Failed to update birthday. Please try again.');
    }
  };

  const handleDeleteBirthday = async (id: string) => {
    try {
      await deleteBirthday(id);
      setBirthdays(prev => prev.filter(birthday => birthday.id !== id));
      setDeletingBirthday(null); // Close the modal
    } catch (err) {
      console.error('Error deleting birthday:', err);
      setError('Failed to delete birthday. Please try again.');
    }
  };

  const confirmDelete = (birthday: Birthday) => {
    setDeletingBirthday(birthday);
  };

  const filteredBirthdays = birthdays.filter(birthday =>
    birthday.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    birthday.relationship.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const upcomingBirthdays = getUpcomingBirthdays();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
            <Cake className="w-12 h-12 text-pink-500 mr-4" />
            Birthday Calendar
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Never forget a special day! Track birthdays, anniversaries, and important dates
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-500 dark:text-red-300 dark:hover:text-red-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-3xl mb-2">🎂</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{birthdays.length}</div>
            <div className="text-gray-600 dark:text-gray-400">Total Birthdays</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-3xl mb-2">⏰</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{upcomingBirthdays.length}</div>
            <div className="text-gray-600 dark:text-gray-400">Upcoming (30 days)</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-3xl mb-2">👨‍👩‍👧‍👦</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {birthdays.filter(b => b.relationship.toLowerCase() === 'family').length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Family</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {birthdays.filter(b => b.relationship.toLowerCase() === 'friend').length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Friends</div>
          </div>
        </div>

        {/* Upcoming Birthdays */}
        {upcomingBirthdays.length > 0 && (
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-6 mb-8 text-white">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Gift className="w-6 h-6 mr-2" />
              Upcoming Birthdays
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingBirthdays.slice(0, 6).map(birthday => (
                <div key={birthday.id} className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{birthday.name}</h3>
                    <span className="text-sm bg-white/30 px-2 py-1 rounded-full">
                      {getDaysUntilBirthday(birthday.date)}
                    </span>
                  </div>
                  <p className="text-sm opacity-90">
                    {format(new Date(birthday.date), 'MMM dd')} • {birthday.relationship}
                  </p>
                  {birthday.age && (
                    <p className="text-sm opacity-75 mt-1">Turning {birthday.age + 1}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search and Add */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search birthdays by name or relationship..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Birthday
          </button>
          <button
            onClick={loadBirthdays}
            disabled={loading}
            className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all flex items-center disabled:opacity-50"
          >
            <div className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`}>
              {loading ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
            </div>
            Refresh
          </button>
        </div>

        {/* Birthday List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">All Birthdays</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
              <p className="text-lg">Loading birthdays...</p>
            </div>
          ) : filteredBirthdays.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <Cake className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No birthdays found</p>
              <p className="text-sm">Add your first birthday to get started!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredBirthdays.map(birthday => (
                <div key={birthday.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getRelationshipIcon(birthday.relationship)}
                        <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-full">
                          {birthday.relationship}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{birthday.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {format(new Date(birthday.date), 'MMMM dd, yyyy')}
                          {birthday.age && ` • ${birthday.age} years old`}
                        </p>
                        {birthday.notes && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{birthday.notes}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {getDaysUntilBirthday(birthday.date)}
                      </span>
                      <button
                        onClick={() => setEditingBirthday(birthday)}
                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => confirmDelete(birthday)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Birthday Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add Birthday</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={newBirthday.name}
                  onChange={(e) => setNewBirthday(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Birthday
                </label>
                <input
                  type="date"
                  value={newBirthday.date}
                  onChange={(e) => setNewBirthday(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Relationship
                </label>
                <select
                  value={newBirthday.relationship}
                  onChange={(e) => setNewBirthday(prev => ({ ...prev, relationship: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select relationship</option>
                  <option value="Family">Family</option>
                  <option value="Friend">Friend</option>
                  <option value="Colleague">Colleague</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={newBirthday.notes}
                  onChange={(e) => setNewBirthday(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                  rows={3}
                  placeholder="Add notes about this person..."
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="reminder"
                  checked={newBirthday.reminder}
                  onChange={(e) => setNewBirthday(prev => ({ ...prev, reminder: e.target.checked }))}
                  className="w-4 h-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
                />
                <label htmlFor="reminder" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Set reminder for this birthday
                </label>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex space-x-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBirthday}
                disabled={!newBirthday.name || !newBirthday.date}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Add Birthday
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Birthday Modal */}
      {editingBirthday && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit Birthday</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={editingBirthday.name}
                  onChange={(e) => setEditingBirthday(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Birthday
                </label>
                <input
                  type="date"
                  value={editingBirthday.date}
                  onChange={(e) => setEditingBirthday(prev => prev ? { ...prev, date: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Relationship
                </label>
                <select
                  value={editingBirthday.relationship}
                  onChange={(e) => setEditingBirthday(prev => prev ? { ...prev, relationship: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="Family">Family</option>
                  <option value="Friend">Friend</option>
                  <option value="Colleague">Colleague</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={editingBirthday.notes || ''}
                  onChange={(e) => setEditingBirthday(prev => prev ? { ...prev, notes: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                  rows={3}
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="edit-reminder"
                  checked={editingBirthday.reminder}
                  onChange={(e) => setEditingBirthday(prev => prev ? { ...prev, reminder: e.target.checked } : null)}
                  className="w-4 h-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
                />
                <label htmlFor="edit-reminder" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Set reminder for this birthday
                </label>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex space-x-3">
              <button
                onClick={() => setEditingBirthday(null)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditBirthday}
                disabled={!editingBirthday.name || !editingBirthday.date}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingBirthday && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Delete Birthday</h3>
            </div>
            
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    Delete {deletingBirthday.name}'s Birthday?
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Name:</strong> {deletingBirthday.name}<br />
                  <strong>Date:</strong> {format(new Date(deletingBirthday.date), 'MMMM dd, yyyy')}<br />
                  <strong>Relationship:</strong> {deletingBirthday.relationship}
                </p>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex space-x-3">
              <button
                onClick={() => setDeletingBirthday(null)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteBirthday(deletingBirthday.id)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              >
                Delete Birthday
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BirthdayCalendar;
