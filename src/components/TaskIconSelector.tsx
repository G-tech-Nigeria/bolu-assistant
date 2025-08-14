import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

const TaskIconSelector = ({ selectedIcon, onIconSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const iconCategories = {
    all: { name: 'All Icons', icons: [] },
    fitness: { 
      name: 'Fitness & Health', 
      icons: ['💪', '🏃‍♂️', '🏋️‍♂️', '🧘‍♀️', '🚴‍♂️', '🏊‍♂️', '⚽', '🏀', '🎾', '🏸', '🥊', '🧗‍♂️', '🏃‍♀️', '🚶‍♂️', '💃', '🕺', '🏃', '🏃‍♀️', '🚴‍♀️', '🏊‍♀️']
    },
    work: { 
      name: 'Work & Study', 
      icons: ['💼', '📚', '✏️', '📝', '💻', '📱', '📊', '📈', '📉', '🎯', '📋', '📅', '⏰', '🎓', '📖', '✍️', '🔍', '💡', '📌', '📎']
    },
    home: { 
      name: 'Home & Life', 
      icons: ['🏠', '🧹', '🧺', '👕', '🍳', '🛒', '🌱', '🐕', '🐱', '🪴', '🛏️', '🚿', '🧽', '🧴', '🪞', '🪑', '🛋️', '📺', '🔌', '💡']
    },
    learning: { 
      name: 'Learning & Skills', 
      icons: ['🎨', '🎭', '🎵', '🎹', '🎸', '🎤', '📷', '🎬', '🎮', '🧩', '🎯', '🎪', '🎨', '✏️', '📝', '📚', '🎓', '🔬', '🧪', '🔭']
    },
    social: { 
      name: 'Social & Fun', 
      icons: ['👥', '🎉', '🎊', '🎈', '🎁', '🍕', '🍔', '🍦', '☕', '🍷', '🍺', '🎮', '🎲', '🎭', '🎪', '🎨', '📸', '🎵', '💃', '🕺']
    },
    finance: { 
      name: 'Finance & Money', 
      icons: ['💰', '💳', '🏦', '📊', '📈', '💵', '💸', '🪙', '💎', '🏆', '🎯', '📋', '📝', '💼', '📱', '💻', '📊', '📈', '📉', '🎯']
    }
  };

  // Combine all icons for search
  const allIcons = Object.values(iconCategories)
    .filter(cat => cat.name !== 'All Icons')
    .flatMap(cat => cat.icons);

  // Filter icons based on search and category
  const getFilteredIcons = () => {
    let icons = selectedCategory === 'all' ? allIcons : iconCategories[selectedCategory]?.icons || [];
    
    if (searchTerm) {
      icons = icons.filter(icon => 
        iconCategories[Object.keys(iconCategories).find(key => 
          iconCategories[key].icons.includes(icon)
        )]?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return [...new Set(icons)]; // Remove duplicates
  };

  const filteredIcons = getFilteredIcons();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-[600px] w-full max-h-[80vh] overflow-auto border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white m-0">
            🎯 Choose Task Icon
          </h2>
          <button
            onClick={onClose}
            className="bg-none border-none text-gray-500 dark:text-gray-400 cursor-pointer p-2 rounded-lg text-2xl hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {Object.entries(iconCategories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors ${
                selectedCategory === key 
                  ? 'bg-orange-500 text-white border border-orange-500' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Icons Grid */}
        <div className="grid grid-cols-8 gap-3 max-h-[400px] overflow-auto">
          {filteredIcons.map((icon) => (
            <button
              key={icon}
              onClick={() => {
                onIconSelect(icon);
                onClose();
              }}
              className={`border-2 rounded-lg p-4 cursor-pointer text-2xl flex items-center justify-center min-h-[60px] transition-all duration-200 hover:scale-105 ${
                selectedIcon === icon 
                  ? 'bg-orange-500 border-orange-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              title={icon}
            >
              {icon}
            </button>
          ))}
        </div>

        {filteredIcons.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
            No icons found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskIconSelector;
