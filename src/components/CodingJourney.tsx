import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import roadmapData from '../utils/roadmapData';
import { Section, RoadmapData } from '../utils/codingJourneyTypes';
import { 
  saveCodingJourneyProgress, 
  getCodingJourneyProgress, 
  getCodingJourneyStats,
  resetCodingJourneyProgress
} from '../lib/database';

interface ProgressData {
  section_id: string;
  subsection_id: string;
  completed: boolean;
  user_id: string;
}

const CodingJourney = () => {
  const [data, setData] = useState<RoadmapData>(roadmapData);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [savingProgress, setSavingProgress] = useState<string | null>(null);

  // Calculate progress
  const calculateProgress = () => {
    let totalSubsections = 0;
    let completedSubsections = 0;
    let totalHours = 0;
    let completedHours = 0;

    data.sections.forEach(section => {
      section.subsections.forEach(subsection => {
        totalSubsections++;
        totalHours += subsection.estimatedHours;
        if (subsection.completed) {
          completedSubsections++;
          completedHours += subsection.estimatedHours;
        }
      });
    });

    const progress = totalSubsections > 0 ? (completedSubsections / totalSubsections) * 100 : 0;
    
    return {
      progress,
      totalSubsections,
      completedSubsections,
      totalHours,
      completedHours
    };
  };

  const progressData = calculateProgress();

  // Load progress from database on component mount
  useEffect(() => {
    const loadProgress = async () => {
      try {
        setIsLoading(true);
        const progress = await getCodingJourneyProgress();
        
        // Update the roadmap data with saved progress
        setData(prevData => {
          const newSections = prevData.sections.map(section => {
                         const newSubsections = section.subsections.map(subsection => {
               const savedProgress = progress.find((p: ProgressData) => 
                 p.section_id === section.id && p.subsection_id === subsection.id
               );
              return {
                ...subsection,
                completed: savedProgress?.completed || false
              };
            });
            
            const allCompleted = newSubsections.every(sub => sub.completed);
            return { ...section, subsections: newSubsections, completed: allCompleted };
          });
          
          return { ...prevData, sections: newSections };
        });
      } catch (error) {
        console.error('Error loading coding journey progress:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProgress();
  }, []);

  const handleSubsectionToggle = async (sectionId: string, subsectionId: string) => {
    try {
      setSavingProgress(`${sectionId}-${subsectionId}`);
      
      // Find current subsection to get the new completed state
      const section = data.sections.find(s => s.id === sectionId);
      const subsection = section?.subsections.find(sub => sub.id === subsectionId);
      const newCompletedState = !subsection?.completed;
      
      // Save to database
      await saveCodingJourneyProgress(sectionId, subsectionId, newCompletedState);
      
      // Update local state
    setData(prevData => {
      const newSections = prevData.sections.map(section => {
        if (section.id === sectionId) {
          const newSubsections = section.subsections.map(subsection => {
            if (subsection.id === subsectionId) {
                return { ...subsection, completed: newCompletedState };
            }
            return subsection;
          });
          
          const allCompleted = newSubsections.every(sub => sub.completed);
          const updatedSection = { ...section, subsections: newSubsections, completed: allCompleted };
          
          if (selectedSection && selectedSection.id === sectionId) {
            setTimeout(() => setSelectedSection(updatedSection), 0);
          }
          
          return updatedSection;
        }
        return section;
      });
      
      return { ...prevData, sections: newSections };
    });
    } catch (error) {
      console.error('Error saving coding journey progress:', error);
      // Revert the change if save failed
      setData(prevData => {
        const newSections = prevData.sections.map(section => {
          if (section.id === sectionId) {
            const newSubsections = section.subsections.map(subsection => {
              if (subsection.id === subsectionId) {
                return { ...subsection, completed: subsection.completed }; // Keep original state
              }
              return subsection;
            });
            
            const allCompleted = newSubsections.every(sub => sub.completed);
            const updatedSection = { ...section, subsections: newSubsections, completed: allCompleted };
            
            if (selectedSection && selectedSection.id === sectionId) {
              setTimeout(() => setSelectedSection(updatedSection), 0);
            }
            
            return updatedSection;
          }
          return section;
        });
        
        return { ...prevData, sections: newSections };
      });
    } finally {
      setSavingProgress(null);
    }
  };

  const handleSectionClick = (section: Section) => {
    setSelectedSection(section);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
    setSelectedSection(null);
  };



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your coding journey progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            🚀 Coding Journey Roadmap
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Your comprehensive guide to becoming a world-class software engineer. 
            Follow this roadmap to master every skill you need for success.
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-8"
          >
            <button
              onClick={async () => {
                if (window.confirm('Are you sure you want to reset all progress? This action cannot be undone.')) {
                  try {
                    setIsLoading(true);
                    await resetCodingJourneyProgress();
                    // Reload the component to refresh progress
                    window.location.reload();
                  } catch (error) {
                    console.error('Error resetting progress:', error);
                    setIsLoading(false);
                  }
                }
              }}
              className="px-6 py-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-white"
            >
              🔄 Reset Progress
            </button>
          </motion.div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="w-8 h-8 text-blue-500 mx-auto mb-2">🎯</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{progressData.progress.toFixed(1)}%</div>
            <div className="text-gray-600 dark:text-gray-400">Progress</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="w-8 h-8 text-green-500 mx-auto mb-2">✅</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{progressData.completedSubsections}/{progressData.totalSubsections}</div>
            <div className="text-gray-600 dark:text-gray-400">Completed</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="w-8 h-8 text-purple-500 mx-auto mb-2">⏰</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{progressData.completedHours}/{progressData.totalHours}</div>
            <div className="text-gray-600 dark:text-gray-400">Hours</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="w-8 h-8 text-orange-500 mx-auto mb-2">💻</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{data.sections.length}</div>
            <div className="text-gray-600 dark:text-gray-400">Sections</div>
          </div>
        </motion.div>

        {/* Roadmap Road */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative"
        >
          {/* Road Background */}
          <div className="absolute inset-0 flex justify-center">
            <div className="w-1 bg-gradient-to-b from-blue-400 via-purple-500 to-indigo-500 rounded-full"></div>
          </div>

          {/* Sections */}
          <div className="relative space-y-8">
            {data.sections.map((section, index) => {
              const completedSubsections = section.subsections.filter(sub => sub.completed).length;
              const totalSubsections = section.subsections.length;
              const sectionProgress = totalSubsections > 0 ? (completedSubsections / totalSubsections) * 100 : 0;
              const isCompleted = section.completed;
              const isNextUp = index === 0 || data.sections[index - 1]?.completed;

              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                >
                  {/* Section Card */}
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    className={`p-6 max-w-md cursor-pointer transition-all duration-300 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${
                      isCompleted ? 'ring-2 ring-green-500 shadow-md' : 
                      isNextUp ? 'ring-2 ring-blue-500 shadow-md' : 'ring-1 ring-gray-200 dark:ring-gray-600'
                    } hover:shadow-md hover:ring-2 hover:ring-blue-300 dark:hover:ring-blue-400`}
                    onClick={() => handleSectionClick(section)}
                  >
                    {/* Section Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${section.color}`}>
                        {section.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                          {section.title}
                          <span className="text-xs text-blue-600 dark:text-blue-400 font-normal">(Click to open)</span>
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{section.description}</p>
                      </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {completedSubsections}/{totalSubsections}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${sectionProgress}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            isCompleted ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Section Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4">⏰</div>
                        <span>{section.estimatedTotalHours}h</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4">⭐</div>
                        <span>{section.order}/32</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isCompleted 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : isNextUp 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {isCompleted ? 'Completed' : isNextUp ? 'Next Up' : 'Locked'}
                      </div>
                      
                      {isCompleted && (
                        <div className="w-5 h-5 text-green-500">✅</div>
                      )}
                      
                      {!isCompleted && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <span>Click to view</span>
                          <div className="w-4 h-4">→</div>
                        </div>
                      )}
                    </div>

                    {/* Quick Preview of Subsections */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <div className="grid grid-cols-1 gap-2">
                        {section.subsections.slice(0, 3).map((subsection) => (
                          <div key={subsection.id} className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              subsection.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                            }`}></div>
                            <div className="flex-1">
                              <span className={`text-xs ${
                                subsection.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                {subsection.title}
                              </span>
                              {subsection.projects && (
                                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                  📁 {subsection.projects.beginner.length + subsection.projects.intermediate.length + subsection.projects.advanced.length} projects
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        {section.subsections.length > 3 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            +{section.subsections.length - 3} more items
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Road Connection Line */}
                  {index < data.sections.length - 1 && (
                    <div className={`absolute top-1/2 w-16 h-0.5 transform -translate-y-1/2 ${
                      index % 2 === 0 ? 'left-full' : 'right-full'
                    } bg-gradient-to-r from-blue-400 to-purple-500`}></div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Road End Goal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 2 }}
            className="text-center mt-16"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-6 shadow-lg border-4 border-white dark:border-gray-800">
              <div className="w-12 h-12 text-white">⭐</div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              🎯 Your Goal: Become the BEST Software Engineer!
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Complete this roadmap to unlock unlimited opportunities in software engineering. 
              You'll be ready for any role: Frontend, Backend, Full-Stack, DevOps, AI/ML, and more!
            </p>
          </motion.div>
        </motion.div>

        {/* Section Detail Modal */}
        {showDetail && selectedSection && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* Header */}
              <div className={`p-6 ${selectedSection.color} text-white rounded-t-2xl`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{selectedSection.icon}</div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedSection.title}</h2>
                      <p className="text-white/90">{selectedSection.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={closeDetail}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    type="button"
                  >
                    <div className="w-6 h-6">✕</div>
                  </button>
                </div>

                {/* Section Progress */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{Math.round((selectedSection.subsections.filter(sub => sub.completed).length / selectedSection.subsections.length) * 100)}%</div>
                    <div className="text-sm text-white/80">Complete</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{selectedSection.subsections.filter(sub => sub.completed).length}/{selectedSection.subsections.length}</div>
                    <div className="text-sm text-white/80">Items</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{selectedSection.subsections.filter(sub => sub.completed).reduce((total, sub) => total + sub.estimatedHours, 0)}h/{selectedSection.subsections.reduce((total, sub) => total + sub.estimatedHours, 0)}h</div>
                    <div className="text-sm text-white/80">Hours</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(selectedSection.subsections.filter(sub => sub.completed).length / selectedSection.subsections.length) * 100}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="bg-white h-3 rounded-full transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-6">
                  {selectedSection.subsections.map((subsection, index) => (
                    <motion.div
                      key={subsection.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        subsection.completed
                          ? 'border-green-400 bg-green-50 dark:bg-green-900/20 shadow-sm'
                          : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div 
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center cursor-pointer transition-all duration-300 ease-out ${
                            subsection.completed
                              ? 'bg-green-500 border-green-500 text-white scale-110'
                              : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                          } ${savingProgress === `${selectedSection.id}-${subsection.id}` ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => {
                            if (savingProgress !== `${selectedSection.id}-${subsection.id}`) {
                            handleSubsectionToggle(selectedSection.id, subsection.id);
                            }
                          }}
                        >
                          {savingProgress === `${selectedSection.id}-${subsection.id}` ? (
                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                          ) : subsection.completed ? (
                            <motion.span 
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.2, ease: "easeOut" }}
                              className="text-white font-bold text-sm"
                            >
                              ✓
                            </motion.span>
                          ) : null}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className={`text-lg font-semibold ${
                              subsection.completed ? 'text-green-800 dark:text-green-200' : 'text-gray-900 dark:text-white'
                            }`}>
                              {subsection.title}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                              subsection.difficulty === 'beginner' ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700' :
                              subsection.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700' :
                              'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700'
                            }`}>
                              {subsection.difficulty}
                            </span>
                          </div>
                          
                          <p className={`text-sm mb-3 ${
                            subsection.completed ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {subsection.description}
                          </p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                            <div className="flex items-center gap-1">
                              <div className="w-4 h-4">⏰</div>
                              <span>{subsection.estimatedHours}h</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-4 h-4">📚</div>
                              <span>{subsection.resources.length} resources</span>
                            </div>
                          </div>

                          {/* Resources */}
                          <div className="space-y-2 mb-4">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Learning Resources:</h4>
                            <div className="flex flex-wrap gap-2">
                              {subsection.resources.map((resource, resourceIndex) => (
                                <button
                                  key={resourceIndex}
                                  className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors flex items-center gap-1"
                                  onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(resource)}`, '_blank')}
                                >
                                  {resource}
                                  <div className="w-3 h-3">🔗</div>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Projects */}
                          {subsection.projects && (
                            <div className="space-y-4">
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">World-Class Projects:</h4>
                              
                              {/* Beginner Projects */}
                              <div className="space-y-2">
                                <h5 className="text-xs font-semibold text-green-600 uppercase tracking-wide">Beginner Projects ({subsection.projects.beginner.length})</h5>
                                <div className="space-y-2">
                                  {subsection.projects.beginner.map((project, projectIndex) => (
                                    <div key={projectIndex} className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3">
                                      <h6 className="font-medium text-green-800 dark:text-green-200 text-sm mb-1">{project.title}</h6>
                                      <p className="text-xs text-green-700 dark:text-green-300 mb-2">{project.description}</p>
                                      <div className="flex flex-wrap gap-1">
                                        {project.technologies.map((tech, techIndex) => (
                                          <span key={techIndex} className="bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 text-xs px-2 py-1 rounded">
                                            {tech}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Intermediate Projects */}
                              <div className="space-y-2">
                                <h5 className="text-xs font-semibold text-yellow-600 uppercase tracking-wide">Intermediate Projects ({subsection.projects.intermediate.length})</h5>
                                <div className="space-y-2">
                                  {subsection.projects.intermediate.map((project, projectIndex) => (
                                    <div key={projectIndex} className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
                                      <h6 className="font-medium text-yellow-800 dark:text-yellow-200 text-sm mb-1">{project.title}</h6>
                                      <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-2">{project.description}</p>
                                      <div className="flex flex-wrap gap-1">
                                        {project.technologies.map((tech, techIndex) => (
                                          <span key={techIndex} className="bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-200 text-xs px-2 py-1 rounded">
                                            {tech}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Advanced Projects */}
                              <div className="space-y-2">
                                <h5 className="text-xs font-semibold text-red-600 uppercase tracking-wide">Advanced Projects ({subsection.projects.advanced.length})</h5>
                                <div className="space-y-2">
                                  {subsection.projects.advanced.map((project, projectIndex) => (
                                    <div key={projectIndex} className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-3">
                                      <h6 className="font-medium text-red-800 dark:text-red-200 text-sm mb-1">{project.title}</h6>
                                      <p className="text-xs text-red-700 dark:text-red-300 mb-2">{project.description}</p>
                                      <div className="flex flex-wrap gap-1">
                                        {project.technologies.map((tech, techIndex) => (
                                          <span key={techIndex} className="bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 text-xs px-2 py-1 rounded">
                                            {tech}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {subsection.completed && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-green-500"
                          >
                            <div className="w-6 h-6 animate-bounce">✅</div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Section {selectedSection.order}/32</span> • 
                    <span className="ml-2">Estimated total time: {selectedSection.subsections.reduce((total, sub) => total + sub.estimatedHours, 0)} hours</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {(selectedSection.subsections.filter(sub => sub.completed).length / selectedSection.subsections.length) === 1 ? (
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold">
                        <div className="w-5 h-5">✅</div>
                        Section Complete!
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold">
                        <div className="w-5 h-5">⚠️</div>
                        {selectedSection.subsections.length - selectedSection.subsections.filter(sub => sub.completed).length} items remaining
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodingJourney;
