import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Code, 
    Trash2, 
    ArrowLeft, 
    Lightbulb, 
    Calendar, 
    X,
    Coffee,
    Palette,
    Brain,
    Leaf,
    Save,
    Edit3,
    Target,
    CheckCircle,
    Plus
} from 'lucide-react';
import { 
    getBusinessAreas, 
    updateBusinessArea,
    getBusinessGoals,
    addBusinessGoal,
    updateBusinessGoal,
    deleteBusinessGoal,
    getBusinessIdeas,
    addBusinessIdea,
    updateBusinessIdea,
    deleteBusinessIdea,
    getBusinessNotes,
    addBusinessNote,
    updateBusinessNote,
    deleteBusinessNote,
    getBusinessNoteFolders,
    addBusinessNoteFolder,

    deleteBusinessNoteFolder
} from '../lib/database';

interface BusinessGoal {
    id: string;
    businessArea: string;
    title: string;
    description: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
}

interface BrainstormIdea {
    id: string;
    businessArea: string;
    title: string;
    description: string;
    category: 'product' | 'service' | 'marketing' | 'partnership' | 'innovation';
    priority: 'low' | 'medium' | 'high';
    status: 'new' | 'in-progress' | 'completed' | 'archived';
}

interface Note {
    id: string;
    businessArea: string;
    title: string;
    content: string;
    folder: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    isPinned: boolean;
}

interface NoteFolder {
    id: string;
    businessArea: string;
    name: string;
    color: string;
    createdAt: string;
}

interface BusinessArea {
    id: string;
    name: string;
    icon: string;
    color: string;
    description: string;
    currentFocus: string;
}

const BusinessAreaPage: React.FC = () => {
    const { areaId } = useParams<{ areaId: string }>();
    const navigate = useNavigate();
    const [businessArea, setBusinessArea] = useState<BusinessArea | null>(null);
    const [goals, setGoals] = useState<BusinessGoal[]>([]);
    const [ideas, setIdeas] = useState<BrainstormIdea[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [folders, setFolders] = useState<NoteFolder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'goals' | 'ideas' | 'notes'>('overview');
    const [newGoal, setNewGoal] = useState({
        title: '',
        description: '',
        priority: 'medium' as const
    });
    const [newIdea, setNewIdea] = useState({
        title: '',
        description: '',
        category: 'product' as const,
        priority: 'medium' as const
    });
    const [newNote, setNewNote] = useState({
        title: '',
        content: '',
        folder: '',
        tags: ''
    });
    const [newFolder, setNewFolder] = useState({
        name: '',
        color: 'bg-blue-500'
    });
    const [selectedFolder, setSelectedFolder] = useState<string>('all');
    const [noteView, setNoteView] = useState<'list' | 'grid'>('list');
    const [editingArea, setEditingArea] = useState(false);
    const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
    const [expandedIdea, setExpandedIdea] = useState<string | null>(null);
    const [expandedNote, setExpandedNote] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({
        name: '',
        description: '',
        currentFocus: ''
    });

    const iconMap = {
        Coffee: Coffee,
        Palette: Palette,
        Code: Code,
        Brain: Brain,
        Leaf: Leaf
    };

    // Load data from database
    useEffect(() => {
        const loadBusinessAreaData = async () => {
            if (!areaId) {
                setError('No business area ID provided');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                // Load business area details
                const businessAreas = await getBusinessAreas();
                const area = businessAreas.find(a => a.id === areaId);
                
                if (!area) {
                    setError('Business area not found');
                    setIsLoading(false);
                    return;
                }

                const businessAreaData = {
                    id: area.id,
                    name: area.name,
                    icon: area.icon || 'Code',
                    color: area.color || 'bg-gray-500',
                    description: area.description || '',
                    currentFocus: area.current_focus || ''
                };

                setBusinessArea(businessAreaData);
                setEditForm({
                    name: businessAreaData.name,
                    description: businessAreaData.description,
                    currentFocus: businessAreaData.currentFocus
                });

                // Try to load goals, ideas, notes, and folders from database
                try {
                    const [goalsResult, ideasResult, notesResult, foldersResult] = await Promise.allSettled([
                        getBusinessGoals(areaId),
                        getBusinessIdeas(areaId),
                        getBusinessNotes(areaId),
                        getBusinessNoteFolders(areaId)
                    ]);

                    // Handle goals
                    if (goalsResult.status === 'fulfilled') {
                        setGoals(goalsResult.value.map((goal: any) => ({
                            id: goal.id,
                            businessArea: goal.business_area,
                            title: goal.title,
                            description: goal.description || '',
                            completed: goal.completed,
                            priority: goal.priority
                        })));
        
                    } else {
        
                        setGoals([]);
                    }

                    // Handle ideas
                    if (ideasResult.status === 'fulfilled') {
                        setIdeas(ideasResult.value.map((idea: any) => ({
                            id: idea.id,
                            businessArea: idea.business_area,
                            title: idea.title,
                            description: idea.description || '',
                            category: idea.category,
                            priority: idea.priority,
                            status: idea.status
                        })));
        
                    } else {
        
                        setIdeas([]);
                    }

                    // Handle folders
                    if (foldersResult.status === 'fulfilled') {
                        setFolders(foldersResult.value.map((folder: any) => ({
                            id: folder.id,
                            businessArea: folder.business_area,
                            name: folder.name,
                            color: folder.color,
                            createdAt: folder.created_at
                        })));
        
                    } else {
        
                        setFolders([]);
                    }

                    // Handle notes
                    if (notesResult.status === 'fulfilled') {
                        setNotes(notesResult.value.map((note: any) => ({
                            id: note.id,
                            businessArea: note.business_area,
                            title: note.title,
                            content: note.content || '',
                            folder: note.folder_id || '',
                            tags: note.tags || [],
                            createdAt: note.created_at,
                            updatedAt: note.updated_at,
                            isPinned: note.is_pinned
                        })));
        
                    } else {
        
                        setNotes([]);
                    }

                } catch (dataError) {
    
                    setGoals([]);
                    setIdeas([]);
                    setNotes([]);
                    setFolders([]);
                }



            } catch (err) {
                console.error('Error loading business area data:', err);
                setError('Failed to load business area data');
            } finally {
                setIsLoading(false);
            }
        };

        loadBusinessAreaData();
    }, [areaId]);

    // Data is now automatically saved to database through individual operations

    const addGoal = async () => {
        if (newGoal.title.trim() && newGoal.description.trim() && businessArea) {
            try {
                // Create goal in database
                const dbGoal = await addBusinessGoal({
                    businessArea: businessArea.id,
                    title: newGoal.title,
                    description: newGoal.description,
                    completed: false,
                    priority: newGoal.priority
                });

                // Add to local state with database ID
                const goal: BusinessGoal = {
                    id: dbGoal.id,
                    businessArea: dbGoal.business_area,
                    title: dbGoal.title,
                    description: dbGoal.description,
                    completed: dbGoal.completed,
                    priority: dbGoal.priority
                };

                setGoals(prev => [...prev, goal]);
                setNewGoal({
                    title: '',
                    description: '',
                    priority: 'medium'
                });

    
            } catch (err) {
                console.error('Error creating goal:', err);
                // You could add user notification here
            }
        }
    };

    const addIdea = async () => {
        if (newIdea.title.trim() && newIdea.description.trim() && businessArea) {
            try {
                // Create idea in database
                const dbIdea = await addBusinessIdea({
                    businessArea: businessArea.id,
                    title: newIdea.title,
                    description: newIdea.description,
                    category: newIdea.category,
                    priority: newIdea.priority,
                    status: 'new'
                });

                // Add to local state with database ID
                const idea: BrainstormIdea = {
                    id: dbIdea.id,
                    businessArea: dbIdea.business_area,
                    title: dbIdea.title,
                    description: dbIdea.description,
                    category: dbIdea.category,
                    priority: dbIdea.priority,
                    status: dbIdea.status
                };

                setIdeas(prev => [...prev, idea]);
                setNewIdea({
                    title: '',
                    description: '',
                    category: 'product',
                    priority: 'medium'
                });

    
            } catch (err) {
                console.error('Error creating idea:', err);
            }
        }
    };

    const toggleGoal = async (id: string) => {
        try {
            // Find the goal to toggle
            const goalToToggle = goals.find(goal => goal.id === id);
            if (!goalToToggle) return;

            const newCompletedStatus = !goalToToggle.completed;

            // Update in database
            await updateBusinessGoal(id, { completed: newCompletedStatus });

            // Update local state
            setGoals(prev => prev.map(goal => 
                goal.id === id ? { ...goal, completed: newCompletedStatus } : goal
            ));


        } catch (err) {
            console.error('Error toggling goal:', err);
            // You could add user notification here
        }
    };

    const deleteGoal = async (id: string) => {
        try {
            // Find the goal to delete for logging
            const goalToDelete = goals.find(goal => goal.id === id);
            
            // Delete from database
            await deleteBusinessGoal(id);

            // Update local state
            setGoals(prev => prev.filter(goal => goal.id !== id));


        } catch (err) {
            console.error('Error deleting goal:', err);
            // You could add user notification here
        }
    };

    const deleteIdea = async (id: string) => {
        try {
            // Find the idea to delete for logging
            const ideaToDelete = ideas.find(idea => idea.id === id);
            
            // Delete from database
            await deleteBusinessIdea(id);

            // Update local state
            setIdeas(prev => prev.filter(idea => idea.id !== id));


        } catch (err) {
            console.error('Error deleting idea:', err);
        }
    };

    const updateIdeaStatus = async (id: string, status: BrainstormIdea['status']) => {
        try {
            // Find the idea for logging
            const ideaToUpdate = ideas.find(idea => idea.id === id);
            
            // Update in database
            await updateBusinessIdea(id, { status });

            // Update local state
            setIdeas(prev => prev.map(idea => 
                idea.id === id ? { ...idea, status } : idea
            ));


        } catch (err) {
            console.error('Error updating idea status:', err);
        }
    };

    const addNote = async () => {
        if (newNote.title.trim() && newNote.content.trim() && businessArea) {
            try {
                // Create note in database
                const dbNote = await addBusinessNote({
                    businessArea: businessArea.id,
                    title: newNote.title,
                    content: newNote.content,
                    folder: newNote.folder || null, // This is now the folder ID
                    tags: newNote.tags ? newNote.tags.split(',').map(tag => tag.trim()) : [],
                    isPinned: false
                });

                // Add to local state with database ID
                const note: Note = {
                    id: dbNote.id,
                    businessArea: dbNote.business_area,
                    title: dbNote.title,
                    content: dbNote.content || '',
                    folder: dbNote.folder_id || '',
                    tags: dbNote.tags || [],
                    createdAt: dbNote.created_at,
                    updatedAt: dbNote.updated_at,
                    isPinned: dbNote.is_pinned
                };

                setNotes(prev => [...prev, note]);
                setNewNote({
                    title: '',
                    content: '',
                    folder: '',
                    tags: ''
                });

    
            } catch (err) {
                console.error('Error creating note:', err);
            }
        }
    };

    const addFolder = async () => {
        if (newFolder.name.trim() && businessArea) {
            try {
                // Create folder in database
                const dbFolder = await addBusinessNoteFolder({
                    businessArea: businessArea.id,
                    name: newFolder.name,
                    color: newFolder.color
                });

                // Add to local state with database ID
                const folder: NoteFolder = {
                    id: dbFolder.id,
                    businessArea: dbFolder.business_area,
                    name: dbFolder.name,
                    color: dbFolder.color,
                    createdAt: dbFolder.created_at
                };

                setFolders(prev => [...prev, folder]);
                setNewFolder({
                    name: '',
                    color: 'bg-blue-500'
                });

    
            } catch (err) {
                console.error('Error creating folder:', err);
            }
        }
    };

    const deleteNote = async (id: string) => {
        try {
            // Find the note to delete for logging
            const noteToDelete = notes.find(note => note.id === id);
            
            // Delete from database
            await deleteBusinessNote(id);

            // Update local state
            setNotes(prev => prev.filter(note => note.id !== id));


        } catch (err) {
            console.error('Error deleting note:', err);
        }
    };

    const deleteFolder = async (id: string) => {
        try {
            // Find the folder to delete for logging
            const folderToDelete = folders.find(folder => folder.id === id);
            
            // Delete from database
            await deleteBusinessNoteFolder(id);

            // Update local state
            setFolders(prev => prev.filter(folder => folder.id !== id));
            
            // Notes with this folder_id will automatically be set to null in database due to foreign key constraint
            // Update local state to reflect this
            setNotes(prev => prev.map(note => 
                note.folder === folderToDelete?.id ? { ...note, folder: '' } : note
            ));


        } catch (err) {
            console.error('Error deleting folder:', err);
        }
    };

    const togglePinNote = async (id: string) => {
        try {
            // Find the note to toggle
            const noteToToggle = notes.find(note => note.id === id);
            if (!noteToToggle) return;

            const newPinnedStatus = !noteToToggle.isPinned;

            // Update in database
            await updateBusinessNote(id, { is_pinned: newPinnedStatus });

            // Update local state
            setNotes(prev => prev.map(note => 
                note.id === id ? { ...note, isPinned: newPinnedStatus } : note
            ));


        } catch (err) {
            console.error('Error toggling note pin:', err);
        }
    };

    // const updateNote = (id: string, updates: Partial<Note>) => {
    //     setNotes(prev => prev.map(note => 
    //         note.id === id ? { ...note, ...updates, updatedAt: new Date().toISOString() } : note
    //     ));
    // };

    const saveBusinessArea = async () => {
        if (businessArea) {
            try {
                // Update in database
                await updateBusinessArea(businessArea.id, {
                    name: editForm.name,
                    description: editForm.description,
                    current_focus: editForm.currentFocus
                });

                // Update local state
                setBusinessArea(prev => prev ? {
                    ...prev,
                    name: editForm.name,
                    description: editForm.description,
                    currentFocus: editForm.currentFocus
                } : null);

    
            } catch (err) {
                console.error('Error updating business area:', err);
            }
        }
        setEditingArea(false);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-600 bg-red-100';
            case 'medium': return 'text-yellow-600 bg-yellow-100';
            case 'low': return 'text-green-600 bg-green-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'text-blue-600 bg-blue-100';
            case 'in-progress': return 'text-yellow-600 bg-yellow-100';
            case 'completed': return 'text-green-600 bg-green-100';
            case 'archived': return 'text-gray-600 bg-gray-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'product': return 'text-purple-600 bg-purple-100';
            case 'service': return 'text-blue-600 bg-blue-100';
            case 'marketing': return 'text-green-600 bg-green-100';
            case 'partnership': return 'text-orange-600 bg-orange-100';
            case 'innovation': return 'text-pink-600 bg-pink-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getFilteredNotes = () => {
        if (selectedFolder === 'all') {
            return notes.sort((a, b) => {
                if (a.isPinned && !b.isPinned) return -1;
                if (!a.isPinned && b.isPinned) return 1;
                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            });
        }
        if (selectedFolder === 'no-folder') {
            return notes
                .filter(note => !note.folder || note.folder === '')
                .sort((a, b) => {
                    if (a.isPinned && !b.isPinned) return -1;
                    if (!a.isPinned && b.isPinned) return 1;
                    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
                });
        }
        return notes
            .filter(note => note.folder === selectedFolder)
            .sort((a, b) => {
                if (a.isPinned && !b.isPinned) return -1;
                if (!a.isPinned && b.isPinned) return 1;
                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
        
        if (diffInHours < 24) {
            return diffInHours === 0 ? 'Just now' : `${diffInHours}h ago`;
        } else if (diffInHours < 168) { // 7 days
            const days = Math.floor(diffInHours / 24);
            return `${days}d ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    const folderColors = [
        'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 
        'bg-red-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];

    // Helper function to truncate text
    const truncateText = (text: string, maxLength: number = 100) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    };

    // Helper function to toggle expanded state
    const toggleExpanded = (type: 'goal' | 'idea' | 'note', id: string) => {
        switch (type) {
            case 'goal':
                setExpandedGoal(expandedGoal === id ? null : id);
                break;
            case 'idea':
                setExpandedIdea(expandedIdea === id ? null : id);
                break;
            case 'note':
                setExpandedNote(expandedNote === id ? null : id);
                break;
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading business area...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 mb-4">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                    <div className="space-x-3">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            Retry
                        </button>
                        <button
                            onClick={() => navigate('/company')}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            Back to Company
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Business area not found (after loading)
    if (!businessArea) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400">Business area not found</p>
                    <button
                        onClick={() => navigate('/company')}
                        className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                    >
                        Back to Company
                    </button>
                </div>
            </div>
        );
    }

    const IconComponent = iconMap[businessArea.icon as keyof typeof iconMap];
    const completedGoals = goals.filter(goal => goal.completed).length;
    const totalGoals = goals.length;
    const activeIdeas = ideas.filter(idea => idea.status !== 'archived').length;
    const totalNotes = notes.length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-6 space-y-6 md:space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <button
                        onClick={() => navigate('/company')}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm md:text-base touch-manipulation p-2 -m-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                    >
                        <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                        Back to Company
                    </button>
                    
                    {editingArea ? (
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <button
                                onClick={saveBusinessArea}
                                className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm md:text-base touch-manipulation min-h-[48px] flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Save Changes
                            </button>
                            <button
                                onClick={() => setEditingArea(false)}
                                className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm md:text-base touch-manipulation min-h-[48px] flex items-center justify-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setEditingArea(true)}
                            className="px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm md:text-base touch-manipulation min-h-[48px] flex items-center justify-center gap-2"
                        >
                            <Edit3 className="w-4 h-4" />
                            Edit Area
                        </button>
                    )}
                </div>

                {/* Business Area Header */}
                <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6 mb-6">
                        <div className={`w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 ${businessArea.color} rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg`}>
                            <IconComponent className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white" />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            {editingArea ? (
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                    className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:border-orange-500 w-full text-base touch-manipulation"
                                />
                            ) : (
                                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{businessArea.name}</h1>
                            )}
                            {editingArea ? (
                                <textarea
                                    value={editForm.description}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                    className="mt-3 text-base text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500 w-full resize-none touch-manipulation"
                                    rows={3}
                                />
                            ) : (
                                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{businessArea.description}</p>
                            )}
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 md:p-5">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <Target className="w-4 h-4 text-orange-500" />
                                Current Focus
                            </h3>
                            {editingArea ? (
                                <textarea
                                    value={editForm.currentFocus}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, currentFocus: e.target.value }))}
                                    className="text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500 w-full text-base resize-none touch-manipulation"
                                    rows={3}
                                />
                            ) : (
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{businessArea.currentFocus}</p>
                            )}
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg md:rounded-xl p-3 md:p-4">
                            <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white mb-1 md:mb-2">Goals Progress</h3>
                            <p className="text-xl md:text-2xl font-bold text-orange-600">{completedGoals}/{totalGoals}</p>
                            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Goals Completed</p>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg md:rounded-xl p-3 md:p-4">
                            <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white mb-1 md:mb-2">Active Ideas</h3>
                            <p className="text-xl md:text-2xl font-bold text-blue-600">{activeIdeas}</p>
                            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Brainstorm Ideas</p>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg md:rounded-xl p-3 md:p-4">
                            <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white mb-1 md:mb-2">Total Notes</h3>
                            <p className="text-xl md:text-2xl font-bold text-purple-600">{totalNotes}</p>
                            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Notes & Resources</p>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center px-2">
                    <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-1.5 md:p-2 shadow-lg w-full max-w-lg">
                        <div className="flex space-x-1 md:space-x-2">
                            {[
                                { id: 'overview', label: 'Overview', icon: Target },
                                { id: 'goals', label: 'Goals', icon: CheckCircle },
                                { id: 'ideas', label: 'Ideas', icon: Lightbulb },
                                { id: 'notes', label: 'Notes', icon: Calendar }
                            ].map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id as any)}
                                    className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg md:rounded-xl font-medium transition-all duration-300 text-xs sm:text-sm flex-1 touch-manipulation ${
                                        activeTab === id
                                            ? 'bg-orange-500 text-white shadow-lg transform scale-105'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="text-xs sm:text-sm">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="space-y-6 md:space-y-8">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                            {/* Recent Goals */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl">
                                <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4 flex items-center gap-2">
                                    <Target className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
                                    Recent Goals
                                </h2>
                                <div className="space-y-2 md:space-y-3">
                                    {goals.slice(0, 5).map(goal => (
                                        <div key={goal.id} className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg ${
                                            goal.completed ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-700'
                                        }`}>
                                            <button
                                                onClick={() => toggleGoal(goal.id)}
                                                className="flex items-center gap-1 md:gap-2"
                                            >
                                                {goal.completed ? (
                                                    <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                                                ) : (
                                                    <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-gray-400 rounded-full"></div>
                                                )}
                                            </button>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-gray-900 dark:text-white text-xs md:text-sm truncate">{goal.title}</h4>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{goal.description}</p>
                                            </div>
                                            <span className={`px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-xs font-medium flex-shrink-0 ${getPriorityColor(goal.priority)}`}>
                                                {goal.priority}
                                            </span>
                                        </div>
                                    ))}
                                    {goals.length === 0 && (
                                        <p className="text-gray-500 dark:text-gray-400 text-center py-4 text-sm md:text-base">No goals yet</p>
                                    )}
                                </div>
                            </div>

                            {/* Recent Ideas */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                                    Recent Ideas
                                </h2>
                                <div className="space-y-3">
                                    {ideas.slice(0, 5).map(idea => (
                                        <div key={idea.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-medium text-gray-900 dark:text-white text-sm">{idea.title}</h4>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(idea.status)}`}>
                                                    {idea.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{idea.description}</p>
                                            <div className="flex gap-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(idea.category)}`}>
                                                    {idea.category}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(idea.priority)}`}>
                                                    {idea.priority}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {ideas.length === 0 && (
                                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">No ideas yet</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Goals Tab */}
                    {activeTab === 'goals' && (
                        <div className="space-y-6">
                            {/* Add Goal */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl">
                                <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Plus className="w-5 h-5 text-orange-500" />
                                    Add New Goal
                                </h2>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Goal title"
                                            value={newGoal.title}
                                            onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                                            className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent touch-manipulation"
                                        />
                                        <select
                                            value={newGoal.priority}
                                            onChange={(e) => setNewGoal(prev => ({ ...prev, priority: e.target.value as any }))}
                                            className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent touch-manipulation"
                                        >
                                            <option value="low">Low Priority</option>
                                            <option value="medium">Medium Priority</option>
                                            <option value="high">High Priority</option>
                                        </select>
                                    </div>
                                    <textarea
                                        placeholder="Goal description"
                                        value={newGoal.description}
                                        onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none touch-manipulation"
                                        rows={3}
                                    />
                                    <button
                                        onClick={addGoal}
                                        className="w-full sm:w-auto px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-300 touch-manipulation min-h-[48px] flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Goal
                                    </button>
                                </div>
                            </div>

                            {/* Goals List */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl">
                                <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4">All Goals</h2>
                                <div className="space-y-4">
                                    {goals.map(goal => (
                                        <div key={goal.id} className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-xl border transition-all duration-300 ${
                                            goal.completed
                                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                                                : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                                        }`}>
                                            <div className="flex items-start gap-3 flex-1">
                                                <button
                                                    onClick={() => toggleGoal(goal.id)}
                                                    className="flex items-center gap-2 p-2 -m-2 touch-manipulation"
                                                >
                                                    {goal.completed ? (
                                                        <CheckCircle className="w-6 h-6 text-green-500" />
                                                    ) : (
                                                        <div className="w-6 h-6 border-2 border-gray-400 rounded-full"></div>
                                                    )}
                                                </button>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-gray-900 dark:text-white text-base mb-1">{goal.title}</h4>
                                                    <div 
                                                        className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 touch-manipulation"
                                                        onClick={() => toggleExpanded('goal', goal.id)}
                                                    >
                                                        {expandedGoal === goal.id ? (
                                                            <div>
                                                                <p className="mb-2 leading-relaxed">{goal.description}</p>
                                                                <span className="text-xs text-blue-500 font-medium">Click to collapse</span>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <p className="line-clamp-2 leading-relaxed">{truncateText(goal.description, 80)}</p>
                                                                {goal.description.length > 80 && (
                                                                    <span className="text-xs text-blue-500 font-medium">Click to read more</span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between sm:justify-end gap-3 ml-9 sm:ml-0">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                                                    {goal.priority}
                                                </span>
                                                <button
                                                    onClick={() => deleteGoal(goal.id)}
                                                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300 touch-manipulation"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {goals.length === 0 && (
                                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No goals yet</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Ideas Tab */}
                    {activeTab === 'ideas' && (
                        <div className="space-y-6">
                            {/* Add Idea */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Plus className="w-5 h-5 text-yellow-500" />
                                    Add New Idea
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Idea title"
                                        value={newIdea.title}
                                        onChange={(e) => setNewIdea(prev => ({ ...prev, title: e.target.value }))}
                                        className="px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                                    />
                                    <select
                                        value={newIdea.category}
                                        onChange={(e) => setNewIdea(prev => ({ ...prev, category: e.target.value as any }))}
                                        className="px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                                    >
                                        <option value="product">Product</option>
                                        <option value="service">Service</option>
                                        <option value="marketing">Marketing</option>
                                        <option value="partnership">Partnership</option>
                                        <option value="innovation">Innovation</option>
                                    </select>
                                    <select
                                        value={newIdea.priority}
                                        onChange={(e) => setNewIdea(prev => ({ ...prev, priority: e.target.value as any }))}
                                        className="px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                                    >
                                        <option value="low">Low Priority</option>
                                        <option value="medium">Medium Priority</option>
                                        <option value="high">High Priority</option>
                                    </select>
                                </div>
                                <textarea
                                    placeholder="Idea description"
                                    value={newIdea.description}
                                    onChange={(e) => setNewIdea(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 mb-4"
                                    rows={3}
                                />
                                <button
                                    onClick={addIdea}
                                    className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                                >
                                    Add Idea
                                </button>
                            </div>

                            {/* Ideas List */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">All Ideas</h2>
                                <div className="space-y-4">
                                    {ideas.map(idea => (
                                        <div key={idea.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                                            <div className="flex items-start justify-between mb-3">
                                                <h4 className="font-medium text-gray-900 dark:text-white">{idea.title}</h4>
                                                <div className="flex items-center gap-2">
                                                    <select
                                                        value={idea.status}
                                                        onChange={(e) => updateIdeaStatus(idea.id, e.target.value as any)}
                                                        className="px-2 py-1 text-xs bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600"
                                                    >
                                                        <option value="new">New</option>
                                                        <option value="in-progress">In Progress</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="archived">Archived</option>
                                                    </select>
                                                    <button
                                                        onClick={() => deleteIdea(idea.id)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div 
                                                className="text-sm text-gray-600 dark:text-gray-400 mb-3 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200"
                                                onClick={() => toggleExpanded('idea', idea.id)}
                                            >
                                                {expandedIdea === idea.id ? (
                                                    <div>
                                                        <p className="mb-2">{idea.description}</p>
                                                        <span className="text-xs text-blue-500 font-medium">Click to collapse</span>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <p className="line-clamp-2">{truncateText(idea.description, 100)}</p>
                                                        {idea.description.length > 100 && (
                                                            <span className="text-xs text-blue-500 font-medium">Click to read more</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(idea.category)}`}>
                                                    {idea.category}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(idea.priority)}`}>
                                                    {idea.priority}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {ideas.length === 0 && (
                                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No ideas yet</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notes Tab */}
                    {activeTab === 'notes' && (
                        <div className="space-y-6">
                            {/* Add Folder */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl">
                                <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Plus className="w-5 h-5 text-purple-500" />
                                    Add New Folder
                                </h2>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Folder name"
                                            value={newFolder.name}
                                            onChange={(e) => setNewFolder(prev => ({ ...prev, name: e.target.value }))}
                                            className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent touch-manipulation"
                                        />
                                        <select
                                            value={newFolder.color}
                                            onChange={(e) => setNewFolder(prev => ({ ...prev, color: e.target.value }))}
                                            className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent touch-manipulation"
                                        >
                                            {folderColors.map(color => (
                                                <option key={color} value={color}>
                                                    {color.replace('bg-', '').replace('-500', '').charAt(0).toUpperCase() + 
                                                     color.replace('bg-', '').replace('-500', '').slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={addFolder}
                                            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-300 touch-manipulation min-h-[48px] flex items-center justify-center gap-2"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Folder
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Add Note */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl">
                                <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Plus className="w-5 h-5 text-green-500" />
                                    Add New Note
                                </h2>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Note title"
                                            value={newNote.title}
                                            onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                                            className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-base focus:ring-2 focus:ring-green-500 focus:border-transparent touch-manipulation"
                                        />
                                        <select
                                            value={newNote.folder}
                                            onChange={(e) => setNewNote(prev => ({ ...prev, folder: e.target.value }))}
                                            className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-base focus:ring-2 focus:ring-green-500 focus:border-transparent touch-manipulation"
                                        >
                                            <option value="">No folder</option>
                                            {folders.map(folder => (
                                                <option key={folder.id} value={folder.id}>{folder.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <textarea
                                        placeholder="Note content"
                                        value={newNote.content}
                                        onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-base focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none touch-manipulation"
                                        rows={4}
                                    />
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <input
                                            type="text"
                                            placeholder="Tags (comma separated)"
                                            value={newNote.tags}
                                            onChange={(e) => setNewNote(prev => ({ ...prev, tags: e.target.value }))}
                                            className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-base focus:ring-2 focus:ring-green-500 focus:border-transparent touch-manipulation"
                                        />
                                        <button
                                            onClick={addNote}
                                            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 touch-manipulation min-h-[48px] flex items-center justify-center gap-2"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Note
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Notes Management */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                    <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Notes & Resources</h2>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setNoteView('list')}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium touch-manipulation transition-all duration-300 ${
                                                noteView === 'list' 
                                                    ? 'bg-blue-500 text-white shadow-lg' 
                                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                                            }`}
                                        >
                                            List
                                        </button>
                                        <button
                                            onClick={() => setNoteView('grid')}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium touch-manipulation transition-all duration-300 ${
                                                noteView === 'grid' 
                                                    ? 'bg-blue-500 text-white shadow-lg' 
                                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                                            }`}
                                        >
                                            Grid
                                        </button>
                                    </div>
                                </div>

                                {/* Folder Navigation */}
                                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                                    <button
                                        onClick={() => setSelectedFolder('all')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap touch-manipulation transition-all duration-300 ${
                                            selectedFolder === 'all'
                                                ? 'bg-blue-500 text-white shadow-lg'
                                                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        All Notes ({notes.length})
                                    </button>
                                    <button
                                        onClick={() => setSelectedFolder('no-folder')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap touch-manipulation transition-all duration-300 ${
                                            selectedFolder === 'no-folder'
                                                ? 'bg-blue-500 text-white shadow-lg'
                                                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        No Folder ({notes.filter(note => !note.folder || note.folder === '').length})
                                    </button>
                                    {folders.map(folder => (
                                        <button
                                            key={folder.id}
                                            onClick={() => setSelectedFolder(folder.id)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-2 touch-manipulation transition-all duration-300 ${
                                                selectedFolder === folder.id
                                                    ? 'bg-blue-500 text-white shadow-lg'
                                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                                            }`}
                                        >
                                            <div className={`w-3 h-3 rounded-full ${folder.color}`}></div>
                                            {folder.name} ({notes.filter(note => note.folder === folder.id).length})
                                        </button>
                                    ))}
                                </div>

                                {/* Notes Display */}
                                {noteView === 'list' ? (
                                    <div className="space-y-4">
                                        {getFilteredNotes().map(note => (
                                            <div key={note.id} className={`p-4 rounded-xl border transition-all duration-300 ${
                                                note.isPinned
                                                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700'
                                                    : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                                            }`}>
                                                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                                                            <h4 className="font-medium text-gray-900 dark:text-white text-base">{note.title}</h4>
                                                            <div className="flex items-center gap-2">
                                                                {note.isPinned && (
                                                                    <span className="text-yellow-600 text-sm">📌</span>
                                                                )}
                                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                                                    {note.folder}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div 
                                                            className="text-sm text-gray-600 dark:text-gray-400 mb-3 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 touch-manipulation"
                                                            onClick={() => toggleExpanded('note', note.id)}
                                                        >
                                                            {expandedNote === note.id ? (
                                                                <div>
                                                                    <p className="mb-2 whitespace-pre-wrap leading-relaxed">{note.content}</p>
                                                                    <span className="text-xs text-blue-500 font-medium">Click to collapse</span>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <p className="line-clamp-3 leading-relaxed">{truncateText(note.content, 150)}</p>
                                                                    {note.content.length > 150 && (
                                                                        <span className="text-xs text-blue-500 font-medium">Click to read more</span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {note.tags.length > 0 && (
                                                            <div className="flex flex-wrap gap-2 mb-3">
                                                                {note.tags.map((tag, index) => (
                                                                    <span key={index} className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                                                                        #{tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                        <p className="text-xs text-gray-500 dark:text-gray-500">
                                                            Updated {formatDate(note.updatedAt)}
                                                        </p>
                                                    </div>
                                                    <div className="flex lg:flex-col gap-2 justify-end">
                                                        <button
                                                            onClick={() => togglePinNote(note.id)}
                                                            className="text-gray-500 hover:text-yellow-600 p-2 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-all duration-300 touch-manipulation"
                                                        >
                                                            📌
                                                        </button>
                                                        <button
                                                            onClick={() => deleteNote(note.id)}
                                                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300 touch-manipulation"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {getFilteredNotes().length === 0 && (
                                            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No notes in this folder</p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {getFilteredNotes().map(note => (
                                            <div key={note.id} className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-md ${
                                                note.isPinned
                                                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700'
                                                    : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                                            }`}>
                                                <div className="flex items-start justify-between mb-3">
                                                    <h4 className="font-medium text-gray-900 dark:text-white text-sm flex-1 mr-2">{note.title}</h4>
                                                    <div className="flex gap-1 flex-shrink-0">
                                                        {note.isPinned && (
                                                            <span className="text-yellow-600 text-sm">📌</span>
                                                        )}
                                                        <button
                                                            onClick={() => deleteNote(note.id)}
                                                            className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all duration-300 touch-manipulation"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div 
                                                    className="text-sm text-gray-600 dark:text-gray-400 mb-3 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 touch-manipulation"
                                                    onClick={() => toggleExpanded('note', note.id)}
                                                >
                                                    {expandedNote === note.id ? (
                                                        <div>
                                                            <p className="mb-2 whitespace-pre-wrap leading-relaxed">{note.content}</p>
                                                            <span className="text-xs text-blue-500 font-medium">Click to collapse</span>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <p className="line-clamp-3 leading-relaxed">{truncateText(note.content, 100)}</p>
                                                            {note.content.length > 100 && (
                                                                <span className="text-xs text-blue-500 font-medium">Click to read more</span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                {note.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mb-3">
                                                        {note.tags.slice(0, 3).map((tag, index) => (
                                                            <span key={index} className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                        {note.tags.length > 3 && (
                                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-300 dark:bg-gray-500 text-gray-600 dark:text-gray-400">
                                                                +{note.tags.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                                <div className="flex items-center justify-between">
                                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                                        {note.folder}
                                                    </span>
                                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                                        {formatDate(note.updatedAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        {getFilteredNotes().length === 0 && (
                                            <p className="text-gray-500 dark:text-gray-400 text-center py-8 col-span-full">No notes in this folder</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Folder Management */}
                            {folders.length > 0 && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl">
                                    <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4">Folder Management</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {folders.map(folder => (
                                            <div key={folder.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 transition-all duration-300 hover:shadow-md">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <div className={`w-4 h-4 rounded-full ${folder.color} flex-shrink-0`}></div>
                                                        <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">{folder.name}</h4>
                                                    </div>
                                                    <button
                                                        onClick={() => deleteFolder(folder.id)}
                                                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300 touch-manipulation flex-shrink-0"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {notes.filter(note => note.folder === folder.name).length} notes
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BusinessAreaPage; 