import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, X, Coffee, Palette, Brain, Leaf, Edit3, Save, Target } from 'lucide-react';
import BMLogo from './BMLogo';
import { getBusinessAreas, addBusinessArea, updateBusinessArea } from '../lib/database';



interface BusinessArea {
    id: string;
    name: string;
    icon: string;
    color: string;
    description: string;
    currentFocus: string;
}

const MoroCompany: React.FC = () => {
    const navigate = useNavigate();

    const [businessAreas, setBusinessAreas] = useState<BusinessArea[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingArea, setEditingArea] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({
        name: '',
        description: '',
        currentFocus: ''
    });


    // Load data from database on component mount
    useEffect(() => {
        const loadBusinessAreas = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                // Try to get business areas from database
                const dbAreas = await getBusinessAreas();
                
                if (dbAreas.length === 0) {
                    // No areas in database, create default areas
                    await createDefaultBusinessAreas();
                } else {
                    // Convert database format to component format
                    setBusinessAreas(dbAreas.map(area => ({
                        id: area.id,
                        name: area.name,
                        icon: area.icon || 'Code',
                        color: area.color || 'bg-gray-500',
                        description: area.description || '',
                        currentFocus: area.current_focus || ''
                    })));
                }
            } catch (err) {
                console.error('Error loading business areas:', err);
                setError('Failed to load business areas');
            } finally {
                setIsLoading(false);
            }
        };
        
        loadBusinessAreas();
    }, []);

    // Create default business areas
    const createDefaultBusinessAreas = async () => {
        const defaultAreas = [
            { 
                name: 'Coffee Culture', 
                icon: 'Coffee', 
                color: 'bg-amber-500',
                description: 'A modern café experience with ethically sourced coffee in art-infused environments.',
                currentFocus: 'Research and connect with local farmers or roasters'
            },
            { 
                name: 'Art & Design', 
                icon: 'Palette', 
                color: 'bg-purple-500',
                description: 'A platform for discovering, curating, and selling unique artworks and creative projects.',
                currentFocus: 'Research technology for app development and AR features'
            },
            { 
                name: 'Tech Development', 
                icon: 'Code', 
                color: 'bg-blue-500',
                description: 'Building world-changing digital platforms, tools, and user-first software solutions.',
                currentFocus: 'Research market demand and define MVP scope'
            },
            { 
                name: 'AI-Driven Services', 
                icon: 'Brain', 
                color: 'bg-green-500',
                description: 'Creating smart systems, automation, and AI products that enhance daily life and business.',
                currentFocus: 'Research AI solutions and market demand'
            },
            { 
                name: 'Sustainable Products', 
                icon: 'Leaf', 
                color: 'bg-teal-500',
                description: 'Developing and promoting eco-friendly, future-conscious goods and ideas.',
                currentFocus: 'Research sustainable suppliers and manufacturers'
            }
        ];
        
        try {
            const createdAreas = [];
            for (const area of defaultAreas) {
                const dbArea = await addBusinessArea(area);
                createdAreas.push({
                    id: dbArea.id,
                    name: dbArea.name,
                    icon: dbArea.icon,
                    color: dbArea.color,
                    description: dbArea.description,
                    currentFocus: dbArea.current_focus
                });
            }
            setBusinessAreas(createdAreas);
    
        } catch (err) {
            console.error('Error creating default business areas:', err);
            setError('Failed to create default business areas');
        }
    };

    const iconMap = {
        Coffee: Coffee,
        Palette: Palette,
        Code: Code,
        Brain: Brain,
        Leaf: Leaf
    };



    const startEditing = (area: BusinessArea) => {
        setEditingArea(area.id);
        setEditForm({
            name: area.name,
            description: area.description,
            currentFocus: area.currentFocus
        });
    };

    const saveEdit = async () => {
        if (editingArea) {
            try {
                // Update in database
                await updateBusinessArea(editingArea, {
                    name: editForm.name,
                    description: editForm.description,
                    current_focus: editForm.currentFocus
                });
                
                // Update local state
                setBusinessAreas(prev => prev.map(area => 
                    area.id === editingArea ? {
                        ...area,
                        name: editForm.name,
                        description: editForm.description,
                        currentFocus: editForm.currentFocus
                    } : area
                ));
                
                setEditingArea(null);
    
            } catch (err) {
                console.error('Error updating business area:', err);
                setError('Failed to update business area');
            }
        }
    };

    const cancelEdit = () => {
        setEditingArea(null);
    };

    const navigateToBusinessArea = (areaId: string) => {
        // Navigate to individual business area page
        navigate(`/company/${areaId}`);
    };



    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
                <div className="max-w-6xl mx-auto p-4 md:p-6 flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">Loading Moro Company...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
                <div className="max-w-6xl mx-auto p-4 md:p-6 flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="text-red-500 mb-4">
                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-6 space-y-6 md:space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="inline-flex flex-col sm:flex-row items-center gap-3 md:gap-4 mb-4 md:mb-6">
                        <BMLogo size="lg" />
                        <div className="text-center sm:text-left">
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                Moro Company
                            </h1>
                            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">Where art meets code, coffee meets community, and ideas meet impact</p>
                        </div>
                    </div>
                </div>

                {/* Company Vision */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl md:rounded-2xl p-4 md:p-6 text-white text-center shadow-xl">
                    <p className="text-base md:text-lg font-medium mb-2">"Moro is a visionary company blending creativity, technology, and sustainability."</p>
                    <p className="text-xs md:text-sm opacity-90">Rooted in culture and innovation, operating across five interconnected spaces</p>
                </div>

                {/* Business Areas Overview */}
                <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl">
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4 text-center">Business Areas Overview</h2>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 text-center mb-4 md:mb-6">
                        Click on any business area below to manage its specific goals, ideas, and progress.
                    </p>
                </div>

                {/* Business Areas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {businessAreas.map(area => {
                        const IconComponent = iconMap[area.icon as keyof typeof iconMap];
                        return (
                            <div key={area.id} className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl relative group transition-all duration-300 hover:shadow-2xl">
                                {/* Edit Button */}
                                <button
                                    onClick={() => startEditing(area)}
                                    className="absolute top-3 right-3 md:top-4 md:right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 touch-manipulation"
                                >
                                    <Edit3 className="w-4 h-4" />
                                </button>

                                {/* Clickable Area */}
                                <div 
                                    onClick={() => navigateToBusinessArea(area.id)}
                                    className="cursor-pointer touch-manipulation"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-12 h-12 md:w-14 md:h-14 ${area.color} rounded-xl flex items-center justify-center shadow-lg`}>
                                            <IconComponent className="w-6 h-6 md:w-7 md:h-7 text-white" />
                                        </div>
                                        <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white flex-1">{area.name}</h3>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <div className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {area.description}
                                        </div>
                                        
                                        <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                                <Target className="w-4 h-4 text-orange-500" />
                                                Current Focus:
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                                {area.currentFocus}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Edit Form Overlay */}
                                {editingArea === area.id && (
                                    <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl z-10">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">Edit {area.name}</h4>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={saveEdit}
                                                        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-300 touch-manipulation"
                                                    >
                                                        <Save className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300 touch-manipulation"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <input
                                                type="text"
                                                placeholder="Business Area Name"
                                                value={editForm.name}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 touch-manipulation"
                                            />
                                            
                                            <textarea
                                                placeholder="Description"
                                                value={editForm.description}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 resize-none touch-manipulation"
                                                rows={3}
                                            />
                                            
                                            <textarea
                                                placeholder="Current Focus"
                                                value={editForm.currentFocus}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, currentFocus: e.target.value }))}
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 resize-none touch-manipulation"
                                                rows={2}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>


            </div>
        </div>
    );
};

export default MoroCompany; 