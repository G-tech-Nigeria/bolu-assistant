import { useState, useEffect, useRef } from 'react'
import { 
    Save, 
    Plus, 
    Trash2, 
    FileText, 
    Folder, 
    FolderPlus, 
    ChevronRight, 
    ChevronDown,
    Edit3,
    AlertCircle,
    Search,
    X,
    Pin,
    PinOff,
    Download,
    Share2,
    FileText as FileTextIcon,
    Calendar,
    Target,
    BookOpen,
    Lightbulb,
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Quote,
    Code,
    Workflow,
    TrendingUp
} from 'lucide-react'
import { getNotes, addNote, updateNote, deleteNote, getNoteFolders, addNoteFolder, deleteNoteFolder, updateNoteFolder } from '../lib/database'

interface Note {
    id: string
    title: string
    content: string
    created_at: string
    updated_at: string
    folder_id: string | null
    is_pinned?: boolean
    tags?: string[]
}

interface Folder {
    id: string
    name: string
    created_at: string
    color?: string
    isExpanded?: boolean
}

const Notes = () => {
    const [folders, setFolders] = useState<Folder[]>([])
    const [notes, setNotes] = useState<Note[]>([])
    const [selectedNote, setSelectedNote] = useState<Note | null>(null)
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [showNewFolderModal, setShowNewFolderModal] = useState(false)
    const [newFolderName, setNewFolderName] = useState('')
    const [editingFolder, setEditingFolder] = useState<string | null>(null)
    const [editingFolderName, setEditingFolderName] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)
    const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [noteTags, setNoteTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState('')
    const [showTemplates, setShowTemplates] = useState(false)
    const contentEditorRef = useRef<HTMLDivElement>(null)

    // Load data from database
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true)
                setError(null)
                
                // Load folders and notes in parallel
                const [foldersData, notesData] = await Promise.all([
                    getNoteFolders(),
                    getNotes()
                ])
                
                // Add isExpanded property to folders
                const foldersWithExpansion = foldersData.map(folder => ({
                    ...folder,
                    isExpanded: true
                }))
                
                setFolders(foldersWithExpansion)
                setNotes(notesData)
                
    
            } catch (err) {
                console.error('❌ Error loading notes data:', err)
                setError('Failed to load notes. Please try refreshing the page.')
            } finally {
                setIsLoading(false)
            }
        }
        
        loadData()
    }, [])

    const createNewFolder = async () => {
        if (!newFolderName.trim()) return
        
        try {
            const newFolder = await addNoteFolder({
            name: newFolderName.trim(),
                color: '#3b82f6' // Default blue color
            })
            
            const folderWithExpansion = {
                ...newFolder,
            isExpanded: true
        }
            
            setFolders([...folders, folderWithExpansion])
        setNewFolderName('')
        setShowNewFolderModal(false)
            

        } catch (err) {
            console.error('❌ Error creating folder:', err)
            setError('Failed to create folder. Please try again.')
        }
    }

    const createNewNote = async (folderId?: string) => {
        const targetFolderId = folderId || selectedFolder || null
        
        try {
            const newNote = await addNote({
            title: 'Untitled Note',
            content: '',
                folderId: targetFolderId,
                tags: [],
                isPinned: false
            })
            
        setNotes([newNote, ...notes])
        setSelectedNote(newNote)
        setSelectedFolder(targetFolderId)
        setTitle(newNote.title)
        setContent(newNote.content)
            setNoteTags(newNote.tags || [])
            

        } catch (err) {
            console.error('❌ Error creating note:', err)
            setError('Failed to create note. Please try again.')
        }
    }

    const saveNote = async () => {
        if (!selectedNote) return

        try {
            setSaving(true)
            
            const updatedNote = await updateNote(selectedNote.id, {
                    title,
                    content,
                tags: noteTags
            })
            
            const updatedNotes = notes.map(note =>
                note.id === selectedNote.id ? updatedNote : note
            )
            setNotes(updatedNotes)
            setSelectedNote(updatedNote)
            

        } catch (err) {
            console.error('❌ Error saving note:', err)
            setError('Failed to save note. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    // Auto-save function with debouncing
    const autoSaveNote = async () => {
        if (!selectedNote || !title.trim() && !content.trim()) return
        
        try {
            const updatedNote = await updateNote(selectedNote.id, {
                title: title.trim() || 'Untitled Note',
                content,
                tags: noteTags
            })
            
            const updatedNotes = notes.map(note =>
                note.id === selectedNote.id ? updatedNote : note
        )
        setNotes(updatedNotes)
            
            // Update selectedNote without causing re-render that might affect focus
            setSelectedNote(prev => prev?.id === updatedNote.id ? updatedNote : prev)
            

        } catch (err) {
            console.error('❌ Error auto-saving note:', err)
            setError('Failed to auto-save note. Please save manually.')
        }
    }

    // Debounced auto-save effect
    useEffect(() => {
        if (autoSaveTimeout) {
            clearTimeout(autoSaveTimeout)
        }
        
        if (selectedNote && (title !== selectedNote.title || content !== selectedNote.content)) {
            const timeout = setTimeout(() => {
                autoSaveNote()
            }, 2000) // Auto-save after 2 seconds of no typing
            
            setAutoSaveTimeout(timeout)
        }
        
        return () => {
            if (autoSaveTimeout) {
                clearTimeout(autoSaveTimeout)
            }
        }
    }, [title, content, selectedNote?.id]) // Only depend on selectedNote.id, not the entire object

    // Set content in editor when note is selected (without causing cursor jump)
    useEffect(() => {
        if (contentEditorRef.current && selectedNote) {
            const editor = contentEditorRef.current
            if (editor.innerHTML !== selectedNote.content) {
                editor.innerHTML = selectedNote.content
            }
        }
    }, [selectedNote?.id]) // Only when note ID changes, not content

    const deleteNoteFromDB = async (noteId: string) => {
        try {
            await deleteNote(noteId)
            
        setNotes(notes.filter(note => note.id !== noteId))
        if (selectedNote?.id === noteId) {
            setSelectedNote(null)
            setTitle('')
            setContent('')
                setNoteTags([])
            }
            

        } catch (err) {
            console.error('❌ Error deleting note:', err)
            setError('Failed to delete note. Please try again.')
        }
    }

    const toggleNotePin = async (noteId: string) => {
        try {
            const note = notes.find(n => n.id === noteId)
            if (!note) return
            
            const updatedNote = await updateNote(noteId, {
                is_pinned: !note.is_pinned
            })
            
            const updatedNotes = notes.map(n => n.id === noteId ? updatedNote : n)
            setNotes(updatedNotes)
            
            if (selectedNote?.id === noteId) {
                setSelectedNote(updatedNote)
            }
            

        } catch (err) {
            console.error('❌ Error toggling note pin:', err)
            setError('Failed to pin/unpin note. Please try again.')
        }
    }

    const deleteFolderFromDB = async (folderId: string) => {
        try {
            // Delete all notes in the folder first
            const folderNotes = notes.filter(note => note.folder_id === folderId)
            await Promise.all(folderNotes.map(note => deleteNote(note.id)))
            
        // Delete the folder
            await deleteNoteFolder(folderId)
            
            // Update local state
            setNotes(notes.filter(note => note.folder_id !== folderId))
        setFolders(folders.filter(folder => folder.id !== folderId))
        
        if (selectedFolder === folderId) {
            setSelectedFolder(null)
        }
            if (selectedNote && selectedNote.folder_id === folderId) {
            setSelectedNote(null)
            setTitle('')
            setContent('')
                setNoteTags([])
            }
            

        } catch (err) {
            console.error('❌ Error deleting folder:', err)
            setError('Failed to delete folder. Please try again.')
        }
    }

    const toggleFolderExpansion = (folderId: string) => {
        setFolders(folders.map(folder =>
            folder.id === folderId
                ? { ...folder, isExpanded: !folder.isExpanded }
                : folder
        ))
    }

    const startEditFolder = (folder: Folder) => {
        setEditingFolder(folder.id)
        setEditingFolderName(folder.name)
    }

    const saveFolderEdit = async () => {
        if (!editingFolder || !editingFolderName.trim()) return
        
        try {
            const updatedFolder = await updateNoteFolder(editingFolder, {
                name: editingFolderName.trim()
            })
        
        setFolders(folders.map(folder =>
            folder.id === editingFolder
                    ? { ...folder, name: updatedFolder.name }
                : folder
        ))
        setEditingFolder(null)
        setEditingFolderName('')
            

        } catch (err) {
            console.error('❌ Error updating folder:', err)
            setError('Failed to update folder. Please try again.')
        }
    }

    const getNotesForFolder = (folderId: string) => {
        const folderNotes = notes.filter(note => note.folder_id === folderId)
        const filteredNotes = searchQuery ? filterNotesBySearch(folderNotes) : folderNotes
        return sortNotesByPinned(filteredNotes)
    }

    const getRootNotes = () => {
        const rootNotes = notes.filter(note => !note.folder_id)
        const filteredNotes = searchQuery ? filterNotesBySearch(rootNotes) : rootNotes
        return sortNotesByPinned(filteredNotes)
    }

    const sortNotesByPinned = (notesToSort: Note[]) => {
        return notesToSort.sort((a, b) => {
            // Pinned notes first
            if (a.is_pinned && !b.is_pinned) return -1
            if (!a.is_pinned && b.is_pinned) return 1
            // Then by updated date (newest first)
            return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        })
    }

    const filterNotesBySearch = (notesToFilter: Note[]) => {
        if (!searchQuery.trim()) return notesToFilter
        
        const query = searchQuery.toLowerCase()
        return notesToFilter.filter(note => 
            note.title.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query) ||
            (note.tags && note.tags.some(tag => tag.toLowerCase().includes(query)))
        )
    }



    const addTag = (tag: string) => {
        const trimmedTag = tag.trim().toLowerCase()
        if (trimmedTag && !noteTags.includes(trimmedTag)) {
            setNoteTags([...noteTags, trimmedTag])
        }
    }

    const removeTag = (tagToRemove: string) => {
        setNoteTags(noteTags.filter(tag => tag !== tagToRemove))
    }

    const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            if (tagInput.trim()) {
                addTag(tagInput)
                setTagInput('')
            }
        }
    }

    const exportNoteAsText = () => {
        if (!selectedNote) return
        
        const content = `Title: ${selectedNote.title}\n\n${selectedNote.content}`
        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${selectedNote.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        

    }



    const exportAllNotes = () => {
        const allNotesData = {
            notes: notes.map(note => ({
                title: note.title,
                content: note.content,
                tags: note.tags || [],
                is_pinned: note.is_pinned || false,
                created_at: note.created_at,
                updated_at: note.updated_at,
                folder_id: note.folder_id
            })),
            folders: folders.map(folder => ({
                name: folder.name,
                color: folder.color,
                created_at: folder.created_at
            })),
            exported_at: new Date().toISOString(),
            total_notes: notes.length,
            total_folders: folders.length
        }
        
        const content = JSON.stringify(allNotesData, null, 2)
        const blob = new Blob([content], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `notes_backup_${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        

    }

    const noteTemplates = [
        {
            id: 'meeting',
            name: 'Meeting Notes',
            icon: Calendar,
            title: 'Meeting Notes',
            content: `<h1 style="color: #1f2937;">📅 Meeting Notes</h1>

<div style="background: #fef3c7; padding: 16px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 16px; color: #1f2937;">
<strong>📅 Date:</strong> ${new Date().toLocaleDateString()}<br>
<strong>⏰ Time:</strong> ${new Date().toLocaleTimeString()}<br>
<strong>👥 Attendees:</strong> 
</div>

<h2 style="color: #1f2937;">📋 Agenda</h2>
<ul style="color: #1f2937;">
<li></li>
</ul>

<h2 style="color: #1f2937;">💬 Discussion Points</h2>
<ul style="color: #1f2937;">
<li></li>
</ul>

<h2 style="color: #1f2937;">✅ Action Items</h2>
<ul style="color: #1f2937;">
<li>☐ </li>
<li>☐ </li>
<li>☐ </li>
</ul>

<h2 style="color: #1f2937;">🚀 Next Steps</h2>
<ul style="color: #1f2937;">
<li></li>
</ul>

<h2 style="color: #1f2937;">📝 Notes</h2>
<p style="color: #1f2937;"></p>`,
            tags: ['meeting', 'work', 'professional']
        },
        {
            id: 'todo',
            name: 'To-Do List',
            icon: Target,
            title: 'To-Do List',
            content: `<h1 style="color: #1f2937;">🎯 To-Do List</h1>

<div style="background: #fee2e2; padding: 16px; border-radius: 8px; border-left: 4px solid #ef4444; margin-bottom: 16px; color: #1f2937;">
<h2 style="color: #1f2937;">🔥 Priority 1 (High)</h2>
<ul style="color: #1f2937;">
<li>☐ </li>
<li>☐ </li>
</ul>
</div>

<div style="background: #fef3c7; padding: 16px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 16px; color: #1f2937;">
<h2 style="color: #1f2937;">⚡ Priority 2 (Medium)</h2>
<ul style="color: #1f2937;">
<li>☐ </li>
<li>☐ </li>
</ul>
</div>

<div style="background: #f0f9ff; padding: 16px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 16px; color: #1f2937;">
<h2 style="color: #1f2937;">💡 Priority 3 (Low)</h2>
<ul style="color: #1f2937;">
<li>☐ </li>
<li>☐ </li>
</ul>
</div>

<div style="background: #f0fdf4; padding: 16px; border-radius: 8px; border-left: 4px solid #22c55e; margin-bottom: 16px; color: #1f2937;">
<h2 style="color: #1f2937;">✅ Completed</h2>
<ul style="color: #1f2937;">
<li>☑ </li>
</ul>
</div>

<h2 style="color: #1f2937;">📝 Notes</h2>
<p style="color: #1f2937;"></p>`,
            tags: ['todo', 'tasks', 'productivity']
        },
        {
            id: 'journal',
            name: 'Daily Journal',
            icon: BookOpen,
            title: 'Daily Journal',
            content: `<h1 style="color: #1f2937;">📖 Daily Journal - ${new Date().toLocaleDateString()}</h1>

<div style="background: #f0f9ff; padding: 16px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 16px; color: #1f2937;">
<h2 style="color: #1f2937;">🎯 Today's Goals</h2>
<ul style="color: #1f2937;">
<li></li>
<li></li>
</ul>
</div>

<div style="background: #f0fdf4; padding: 16px; border-radius: 8px; border-left: 4px solid #22c55e; margin-bottom: 16px; color: #1f2937;">
<h2 style="color: #1f2937;">✨ What I Accomplished</h2>
<ul style="color: #1f2937;">
<li></li>
<li></li>
</ul>
</div>

<div style="background: #fef3c7; padding: 16px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 16px; color: #1f2937;">
<h2 style="color: #1f2937;">💪 Challenges Faced</h2>
<ul style="color: #1f2937;">
<li></li>
</ul>
</div>

<div style="background: #f3e8ff; padding: 16px; border-radius: 8px; border-left: 4px solid #a855f7; margin-bottom: 16px; color: #1f2937;">
<h2 style="color: #1f2937;">🧠 Lessons Learned</h2>
<ul style="color: #1f2937;">
<li></li>
</ul>
</div>

<div style="background: #f0f9ff; padding: 16px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 16px; color: #1f2937;">
<h2 style="color: #1f2937;">🚀 Tomorrow's Plan</h2>
<ul style="color: #1f2937;">
<li></li>
</ul>
</div>

<div style="background: #fef3c7; padding: 16px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 16px; color: #1f2937;">
<h2 style="color: #1f2937;">🙏 Gratitude</h2>
<ul style="color: #1f2937;">
<li></li>
<li></li>
</ul>
</div>

<div style="background: #fef2f2; padding: 16px; border-radius: 8px; border-left: 4px solid #ef4444; margin-bottom: 16px; color: #1f2937;">
<h2 style="color: #1f2937;">😊 Mood</h2>
<p style="color: #1f2937;"></p>
</div>`,
            tags: ['journal', 'daily', 'reflection', 'personal']
        },
        {
            id: 'ideas',
            name: 'Ideas & Brainstorming',
            icon: Lightbulb,
            title: 'Ideas & Brainstorming',
            content: `<h1 style="color: #1f2937;">💡 Ideas & Brainstorming</h1>

<div style="background: #f0f9ff; padding: 16px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 16px; color: #1f2937;">
<h2 style="color: #1f2937;">🎯 Main Idea</h2>
<p style="color: #1f2937;"><strong>Title:</strong> </p>
<p style="color: #1f2937;"><strong>Description:</strong> </p>
</div>

<div style="background: #fef3c7; padding: 16px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 16px; color: #1f2937;">
<h2 style="color: #1f2937;">🔗 Related Ideas</h2>
<ul style="color: #1f2937;">
<li></li>
<li></li>
</ul>
</div>

<div style="background: #f0fdf4; padding: 16px; border-radius: 8px; border-left: 4px solid #22c55e; margin-bottom: 16px; color: #1f2937;">
<h2 style="color: #1f2937;">🔍 Research Needed</h2>
<ul style="color: #1f2937;">
<li></li>
<li></li>
</ul>
</div>

<div style="background: #f0fdf4; padding: 16px; border-radius: 8px; border-left: 4px solid #22c55e; margin-bottom: 16px; color: #1f2937;">
<h2 style="color: #1f2937;">✅ Potential Benefits</h2>
<ul style="color: #1f2937;">
<li></li>
<li></li>
</ul>
</div>

<div style="background: #fee2e2; padding: 16px; border-radius: 8px; border-left: 4px solid #ef4444; margin-bottom: 16px; color: #1f2937;">
<h2 style="color: #1f2937;">⚠️ Challenges</h2>
<ul style="color: #1f2937;">
<li></li>
<li></li>
</ul>
</div>

<div style="background: #f0f9ff; padding: 16px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 16px; color: #1f2937;">
<h2 style="color: #1f2937;">🚀 Next Steps</h2>
<ul style="color: #1f2937;">
<li></li>
<li></li>
</ul>
</div>

<div style="background: #f3e8ff; padding: 16px; border-radius: 8px; border-left: 4px solid #a855f7; margin-bottom: 16px; color: #1f2937;">
<h2 style="color: #1f2937;">📚 Resources</h2>
<ul style="color: #1f2937;">
<li></li>
</ul>
</div>`,
            tags: ['ideas', 'brainstorming', 'creative', 'innovation']
        },
        {
            id: 'project',
            name: 'Project Plan',
            icon: Workflow,
            title: 'Project Plan',
            content: `<h1 style="color: #1f2937;">🚀 Project Plan</h1>

<div style="background: #f0f9ff; padding: 16px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 16px; color: #1f2937;">
<h2 style="color: #1f2937;">📋 Project Overview</h2>
<p style="color: #1f2937;"><strong>Project Name:</strong> </p>
<p style="color: #1f2937;"><strong>Description:</strong> </p>
<p style="color: #1f2937;"><strong>Start Date:</strong> ${new Date().toLocaleDateString()}</p>
<p style="color: #1f2937;"><strong>Target End Date:</strong> </p>
</div>

<div style="background: #fef3c7; padding: 16px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 16px; color: #1f2937;">
<h2 style="color: #1f2937;">🎯 Objectives</h2>
<ul style="color: #1f2937;">
<li></li>
<li></li>
<li></li>
</ul>
</div>

<div style="background: #f0fdf4; padding: 16px; border-radius: 8px; border-left: 4px solid #22c55e; margin-bottom: 16px; color: #1f2937;">
<h2 style="color: #1f2937;">✅ Deliverables</h2>
<ul style="color: #1f2937;">
<li>☐ </li>
<li>☐ </li>
<li>☐ </li>
</ul>
</div>

<div style="background: #fee2e2; padding: 16px; border-radius: 8px; border-left: 4px solid #ef4444; margin-bottom: 16px; color: #1f2937;">
<h2 style="color: #1f2937;">⚠️ Risks & Challenges</h2>
<ul style="color: #1f2937;">
<li></li>
<li></li>
</ul>
</div>

<div style="background: #f3e8ff; padding: 16px; border-radius: 8px; border-left: 4px solid #a855f7; margin-bottom: 16px; color: #1f2937;">
<h2 style="color: #1f2937;">👥 Team & Resources</h2>
<ul style="color: #1f2937;">
<li></li>
<li></li>
</ul>
</div>

<div style="background: #f0f9ff; padding: 16px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 16px; color: #1f2937;">
<h2 style="color: #1f2937;">📅 Timeline</h2>
<ul style="color: #1f2937;">
<li><strong>Phase 1:</strong> </li>
<li><strong>Phase 2:</strong> </li>
<li><strong>Phase 3:</strong> </li>
</ul>
</div>

<div style="background: #fef3c7; padding: 16px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 16px; color: #1f2937;">
<h2 style="color: #1f2937;">💰 Budget</h2>
<p style="color: #1f2937;"></p>
</div>`,
            tags: ['project', 'planning', 'management', 'business']
        },
        {
            id: 'review',
            name: 'Performance Review',
            icon: TrendingUp,
            title: 'Performance Review',
            content: `<h1 style="color: #1f2937;">📊 Performance Review</h1>

<div style="background: #f0f9ff; padding: 16px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 16px; color: #1f2937;">
<h2 style="color: #1f2937;">👤 Employee Information</h2>
<p style="color: #1f2937;"><strong>Name:</strong> </p>
<p style="color: #1f2937;"><strong>Position:</strong> </p>
<p style="color: #1f2937;"><strong>Review Period:</strong> ${new Date().toLocaleDateString()}</p>
<p style="color: #1f2937;"><strong>Reviewer:</strong> </p>
</div>

<div style="background: #f0fdf4; padding: 16px; border-radius: 8px; border-left: 4px solid #22c55e; margin-bottom: 16px; color: #1f2937;">
<h2 style="color: #1f2937;">✅ Achievements & Strengths</h2>
<ul style="color: #1f2937;">
<li></li>
<li></li>
<li></li>
</ul>
</div>

<div style="background: #fef3c7; padding: 16px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 16px; color: #1f2937;">
<h2 style="color: #1f2937;">🎯 Goals & Objectives</h2>
<ul style="color: #1f2937;">
<li>☐ </li>
<li>☐ </li>
<li>☐ </li>
</ul>
</div>

<div style="background: #fee2e2; padding: 16px; border-radius: 8px; border-left: 4px solid #ef4444; margin-bottom: 16px; color: #1f2937;">
<h2 style="color: #1f2937;">⚠️ Areas for Improvement</h2>
<ul style="color: #1f2937;">
<li></li>
<li></li>
</ul>
</div>

<div style="background: #f3e8ff; padding: 16px; border-radius: 8px; border-left: 4px solid #a855f7; margin-bottom: 16px; color: #1f2937;">
<h2 style="color: #1f2937;">📈 Performance Rating</h2>
<p style="color: #1f2937;"><strong>Overall Rating:</strong> </p>
<p style="color: #1f2937;"><strong>Comments:</strong> </p>
</div>

<div style="background: #f0f9ff; padding: 16px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 16px; color: #1f2937;">
<h2 style="color: #1f2937;">🚀 Development Plan</h2>
<ul style="color: #1f2937;">
<li></li>
<li></li>
</ul>
</div>

<div style="background: #fef3c7; padding: 16px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 16px; color: #1f2937;">
<h2 style="color: #1f2937;">📝 Additional Comments</h2>
<p style="color: #1f2937;"></p>
</div>`,
            tags: ['review', 'performance', 'hr', 'professional']
        }
    ]

    const createNoteFromTemplate = async (template: any) => {
        const targetFolderId = selectedFolder || null
        
        try {
            const newNote = await addNote({
                title: template.title,
                content: template.content,
                folderId: targetFolderId,
                tags: template.tags,
                isPinned: false
            })
            
            setNotes([newNote, ...notes])
            setSelectedNote(newNote)
            setSelectedFolder(targetFolderId)
            setTitle(newNote.title)
            setContent(newNote.content)
            setNoteTags(newNote.tags || [])
            setShowTemplates(false)
            

        } catch (err) {
            console.error('❌ Error creating note from template:', err)
            setError('Failed to create note from template. Please try again.')
        }
    }



    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    // Rich Text Editor Functions
    const execCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value)
    }

    const formatText = (format: string) => {
        switch (format) {
            case 'bold':
                execCommand('bold')
                break
            case 'italic':
                execCommand('italic')
                break
            case 'underline':
                execCommand('underline')
                break
            case 'h1':
                execCommand('formatBlock', '<h1>')
                break
            case 'h2':
                execCommand('formatBlock', '<h2>')
                break
            case 'ul':
                execCommand('insertUnorderedList')
                break
            case 'ol':
                execCommand('insertOrderedList')
                break
            case 'quote':
                execCommand('formatBlock', '<blockquote>')
                break
            case 'code':
                execCommand('formatBlock', '<pre>')
                break
        }
    }

    const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
        const newContent = e.currentTarget.innerHTML
        setContent(newContent)
    }

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Loading notes...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col lg:flex-row max-w-7xl mx-auto">
            {/* Error Banner */}
            {error && (
                <div className="fixed top-4 left-4 right-4 z-50 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 md:p-4 flex items-center">
                    <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-500 mr-2" />
                    <span className="text-sm md:text-base text-red-700 dark:text-red-300">{error}</span>
                    <button
                        onClick={() => setError(null)}
                        className="ml-auto text-red-500 hover:text-red-700 p-1"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Sidebar with folders and notes */}
            <div className="w-full lg:w-80 xl:w-96 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 md:p-4 lg:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-3 sm:space-y-0">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">Notes</h2>
                    <div className="flex gap-1 sm:gap-2">
                        <button
                            onClick={exportAllNotes}
                            className="p-2 md:p-2.5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
                            aria-label="Export all notes"
                            title="Export all notes as backup"
                        >
                            <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button
                            onClick={() => setShowNewFolderModal(true)}
                            className="p-2 md:p-2.5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
                            aria-label="Create new folder"
                        >
                            <FolderPlus className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button
                            onClick={() => setShowTemplates(true)}
                            className="p-2 md:p-2.5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
                            aria-label="Create note from template"
                            title="Create note from template"
                        >
                            <FileTextIcon className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button
                            onClick={() => createNewNote()}
                            className="p-2 md:p-2.5 bg-orange-500 text-white hover:bg-orange-600 rounded-lg transition-colors touch-manipulation"
                            aria-label="Create new note"
                        >
                            <Plus className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search notes..."
                        className="w-full pl-10 md:pl-12 pr-10 md:pr-12 py-2.5 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm md:text-base"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 touch-manipulation"
                        >
                            <X className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                    )}
                </div>

                <div className="space-y-2">
                    {/* Root notes */}
                    <div 
                        className={`p-3 sm:p-2 rounded-lg cursor-pointer transition-colors ${selectedFolder === 'root' ? 'bg-orange-50 dark:bg-gray-800 border-orange-500' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                        onClick={() => setSelectedFolder('root')}
                    >
                        <div className="flex items-center">
                            <FileText className="w-4 h-4 text-gray-500 mr-2" />
                            <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Root Notes</span>
                            <span className="ml-auto text-xs sm:text-sm text-gray-500">({getRootNotes().length})</span>
                        </div>
                    </div>

                    {/* Folders */}
                    {folders.map(folder => {
                        const folderNotes = getNotesForFolder(folder.id)
                        return (
                            <div key={folder.id} className="space-y-1">
                                <div className="flex items-center justify-between p-3 sm:p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <div className="flex items-center flex-1 cursor-pointer" onClick={() => toggleFolderExpansion(folder.id)}>
                                        {folder.isExpanded ? (
                                            <ChevronDown className="w-4 h-4 text-gray-500 mr-1" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4 text-gray-500 mr-1" />
                                        )}
                                        <Folder className="w-4 h-4 text-blue-500 mr-2" />
                                        {editingFolder === folder.id ? (
                                            <input
                                                type="text"
                                                value={editingFolderName}
                                                onChange={(e) => setEditingFolderName(e.target.value)}
                                                onBlur={saveFolderEdit}
                                                onKeyPress={(e) => e.key === 'Enter' && saveFolderEdit()}
                                                className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white text-sm"
                                                autoFocus
                                            />
                                        ) : (
                                            <span className="font-medium text-gray-900 dark:text-white text-sm flex-1">
                                                {folder.name}
                                            </span>
                                        )}
                                        <span className="text-xs text-gray-500">({folderNotes.length})</span>
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                startEditFolder(folder)
                                            }}
                                            className="p-2 sm:p-1 text-gray-400 hover:text-blue-500 rounded transition-colors"
                                            aria-label="Edit folder"
                                        >
                                            <Edit3 className="w-3 h-3" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                deleteFolderFromDB(folder.id)
                                            }}
                                            className="p-2 sm:p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                                            aria-label="Delete folder"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Notes in folder */}
                                {folder.isExpanded && (
                                    <div className="ml-4 sm:ml-6 space-y-1">
                                        {folderNotes.map(note => (
                                            <div
                                                key={note.id}
                                                className={`p-3 sm:p-2 rounded-lg cursor-pointer transition-colors ${selectedNote?.id === note.id ? 'bg-orange-50 dark:bg-gray-800 border-orange-500' : 'hover:bg-gray-50 dark:hover:bg-gray-800'} ${note.is_pinned ? 'border-l-4 border-orange-500' : ''}`}
                                                onClick={() => {
                                                    setSelectedNote(note)
                                                    setSelectedFolder(folder.id)
                                                    setTitle(note.title)
                                                    setContent(note.content)
                                                    setNoteTags(note.tags || [])
                                                }}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        {note.is_pinned && (
                                                            <Pin className="w-3 h-3 text-orange-500 mr-1" />
                                                        )}
                                                        <FileText className="w-3 h-3 text-gray-400 mr-2" />
                                                        <span className="text-sm text-gray-900 dark:text-white truncate">
                                                            {note.title}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-1">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                                toggleNotePin(note.id)
                                                            }}
                                                            className="p-2 sm:p-1 text-gray-400 hover:text-orange-500 rounded transition-colors"
                                                            aria-label={note.is_pinned ? "Unpin note" : "Pin note"}
                                                        >
                                                            {note.is_pinned ? (
                                                                <PinOff className="w-3 h-3" />
                                                            ) : (
                                                                <Pin className="w-3 h-3" />
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                deleteNoteFromDB(note.id)
                                                        }}
                                                        className="p-2 sm:p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                                                        aria-label="Delete note"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 ml-5">
                                                    {formatDate(note.updated_at)}
                                                </p>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => createNewNote(folder.id)}
                                            className="w-full p-3 sm:p-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center"
                                        >
                                            <Plus className="w-3 h-3 mr-1" />
                                            Add note
                                        </button>
                                    </div>
                                )}
                            </div>
                        )
                    })}

                    {/* Root notes list */}
                    {selectedFolder === null && (
                        <div className="ml-4 sm:ml-6 space-y-1">
                            {getRootNotes().map(note => (
                                <div
                                    key={note.id}
                                    className={`p-3 sm:p-2 rounded-lg cursor-pointer transition-colors ${selectedNote?.id === note.id ? 'bg-orange-50 dark:bg-gray-800 border-orange-500' : 'hover:bg-gray-50 dark:hover:bg-gray-800'} ${note.is_pinned ? 'border-l-4 border-orange-500' : ''}`}
                                    onClick={() => {
                                        setSelectedNote(note)
                                        setSelectedFolder(null)
                                        setTitle(note.title)
                                        setContent(note.content)
                                        setNoteTags(note.tags || [])
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            {note.is_pinned && (
                                                <Pin className="w-3 h-3 text-orange-500 mr-1" />
                                            )}
                                            <FileText className="w-3 h-3 text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-900 dark:text-white truncate">
                                                {note.title}
                                            </span>
                                        </div>
                                        <div className="flex gap-1">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                    toggleNotePin(note.id)
                                                }}
                                                className="p-2 sm:p-1 text-gray-400 hover:text-orange-500 rounded transition-colors"
                                                aria-label={note.is_pinned ? "Unpin note" : "Pin note"}
                                            >
                                                {note.is_pinned ? (
                                                    <PinOff className="w-3 h-3" />
                                                ) : (
                                                    <Pin className="w-3 h-3" />
                                                )}
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    deleteNoteFromDB(note.id)
                                            }}
                                            className="p-2 sm:p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                                            aria-label="Delete note"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 ml-5">
                                        {formatDate(note.updated_at)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {folders.length === 0 && notes.length === 0 && (
                        <div className="text-center py-6 sm:py-8">
                            <FileText className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400" />
                            <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm sm:text-base">No notes yet</p>
                            <div className="mt-4 space-y-2">
                                <button
                                    onClick={() => setShowNewFolderModal(true)}
                                    className="block w-full px-4 py-3 sm:py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    Create your first folder
                                </button>
                                <button
                                    onClick={() => createNewNote()}
                                    className="block w-full px-4 py-3 sm:py-2 text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    Create your first note
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Note editor */}
            <div className="flex-1 p-3 md:p-4 lg:p-6">
                {selectedNote ? (
                    <>
                        <div className="flex flex-col space-y-3 mb-4">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="text-lg md:text-xl lg:text-2xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white w-full px-2 py-1 rounded-lg focus:bg-gray-50 dark:focus:bg-gray-800"
                                placeholder="Note title"
                            />
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                <button
                                    onClick={exportNoteAsText}
                                    disabled={!selectedNote}
                                    className="flex items-center justify-center gap-2 px-3 py-2.5 md:py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
                                    title="Export as text file"
                                >
                                    <Download className="w-4 h-4" />
                                    <span className="text-sm">Export Text</span>
                                </button>

                            <button
                                onClick={saveNote}
                                    disabled={saving}
                                    className="flex items-center justify-center gap-2 px-4 py-2.5 md:py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
                            >
                                    {saving ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                <Save className="w-4 h-4" />
                                    )}
                                    <span className="text-sm">{saving ? 'Saving...' : 'Save Note'}</span>
                            </button>
                        </div>
                        </div>

                        {/* Tags Section */}
                        <div className="mb-4">
                            <div className="flex flex-wrap gap-2 mb-3">
                                {noteTags.map(tag => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                                    >
                                        #{tag}
                                        <button
                                            onClick={() => removeTag(tag)}
                                            className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 ml-1 touch-manipulation"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={handleTagInputKeyPress}
                                placeholder="Add tags (press Enter or comma)"
                                className="w-full px-3 py-2.5 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm md:text-base"
                            />
                        </div>

                        {/* Rich Text Editor Toolbar */}
                        <div className="flex flex-wrap gap-1 p-2 md:p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-t-lg overflow-x-auto">
                            <div className="flex gap-1">
                                <button
                                    onClick={() => formatText('bold')}
                                    className="p-2 md:p-2.5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors touch-manipulation"
                                    title="Bold (Ctrl+B)"
                                >
                                    <Bold className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                                <button
                                    onClick={() => formatText('italic')}
                                    className="p-2 md:p-2.5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors touch-manipulation"
                                    title="Italic (Ctrl+I)"
                                >
                                    <Italic className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                                <button
                                    onClick={() => formatText('underline')}
                                    className="p-2 md:p-2.5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors touch-manipulation"
                                    title="Underline (Ctrl+U)"
                                >
                                    <Underline className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                            </div>
                            
                            <div className="w-px h-6 md:h-8 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                            
                            <div className="flex gap-1">
                                <button
                                    onClick={() => formatText('h1')}
                                    className="p-2 md:p-2.5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors touch-manipulation"
                                    title="Heading 1"
                                >
                                    <Heading1 className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                                <button
                                    onClick={() => formatText('h2')}
                                    className="p-2 md:p-2.5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors touch-manipulation"
                                    title="Heading 2"
                                >
                                    <Heading2 className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                            </div>
                            
                            <div className="w-px h-6 md:h-8 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                            
                            <div className="flex gap-1">
                                <button
                                    onClick={() => formatText('ul')}
                                    className="p-2 md:p-2.5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors touch-manipulation"
                                    title="Bullet List"
                                >
                                    <List className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                                <button
                                    onClick={() => formatText('ol')}
                                    className="p-2 md:p-2.5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors touch-manipulation"
                                    title="Numbered List"
                                >
                                    <ListOrdered className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                            </div>
                            
                            <div className="w-px h-6 md:h-8 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                            
                            <div className="flex gap-1">
                                <button
                                    onClick={() => formatText('quote')}
                                    className="p-2 md:p-2.5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors touch-manipulation"
                                    title="Quote"
                                >
                                    <Quote className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                                <button
                                    onClick={() => formatText('code')}
                                    className="p-2 md:p-2.5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors touch-manipulation"
                                    title="Code Block"
                                >
                                    <Code className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Rich Text Editor */}
                        <div
                            ref={contentEditorRef}
                            contentEditable
                            onInput={handleContentChange}
                            className="w-full h-[calc(100vh-400px)] sm:h-[calc(100vh-350px)] lg:h-[calc(100vh-300px)] p-3 md:p-4 bg-white dark:bg-gray-800 border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white text-sm md:text-base overflow-y-auto"
                            style={{ minHeight: '200px' }}
                            data-placeholder="Start writing your note..."
                            suppressContentEditableWarning={true}
                        />
                    </>
                ) : (
                    <div className="h-full flex items-center justify-center p-4 md:p-6">
                        <div className="text-center max-w-md">
                            <FileText className="w-16 h-16 md:w-20 md:h-20 mx-auto text-gray-400" />
                            <h3 className="mt-4 text-lg md:text-xl font-medium text-gray-900 dark:text-white">
                                Select a note or create a new one
                            </h3>
                            <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm md:text-base">
                                Choose a note from the sidebar or create a new one to start writing
                            </p>
                            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => setShowNewFolderModal(true)}
                                    className="px-6 py-3 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors border border-blue-200 dark:border-blue-800 touch-manipulation"
                                >
                                    Create Folder
                                </button>
                                <button
                                    onClick={() => createNewNote()}
                                    className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors touch-manipulation"
                                >
                                    Create Note
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* New Folder Modal */}
            {showNewFolderModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-sm mx-4 shadow-2xl">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Create New Folder
                        </h3>
                        <input
                            type="text"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            placeholder="Folder name"
                            className="w-full p-3 md:p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-base"
                            onKeyPress={(e) => e.key === 'Enter' && createNewFolder()}
                            autoFocus
                        />
                        <div className="flex flex-col gap-3 mt-6">
                            <button
                                onClick={createNewFolder}
                                className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium touch-manipulation"
                            >
                                Create Folder
                            </button>
                            <button
                                onClick={() => {
                                    setShowNewFolderModal(false)
                                    setNewFolderName('')
                                }}
                                className="w-full px-4 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors font-medium touch-manipulation"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Templates Modal */}
            {showTemplates && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-2 md:p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-6xl mx-2 md:mx-4 max-h-[95vh] md:max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700">
                        {/* Header with Pattern */}
                        <div className="relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700"></div>
                            <div className="absolute inset-0 opacity-30" style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                            }}></div>
                            <div className="relative p-4 md:p-8 text-white">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 md:p-3 bg-white/20 rounded-xl md:rounded-2xl backdrop-blur-sm">
                                                <FileTextIcon className="w-6 h-6 md:w-8 md:h-8" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl md:text-3xl font-bold">Choose Your Template</h3>
                                                <p className="text-orange-100 text-sm md:text-lg">Start with a beautifully structured foundation</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowTemplates(false)}
                                        className="p-2 md:p-3 hover:bg-white/20 rounded-xl md:rounded-2xl transition-all duration-300 hover:scale-110 touch-manipulation"
                                    >
                                        <X className="w-5 h-5 md:w-7 md:h-7" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Templates Grid */}
                        <div className="p-4 md:p-8 overflow-y-auto max-h-[calc(95vh-120px)] md:max-h-[calc(90vh-140px)]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                                {noteTemplates.map((template, index) => {
                                    const IconComponent = template.icon
                                    return (
                                        <div
                                            key={template.id}
                                            onClick={() => createNoteFromTemplate(template)}
                                            className="group relative bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-500 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden transform hover:scale-[1.02]"
                                            style={{
                                                animationDelay: `${index * 100}ms`
                                            }}
                                        >
                                            {/* Decorative Background Pattern */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 opacity-50"></div>
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-500/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

                                            {/* Template Content */}
                                            <div className="relative p-8">
                                                {/* Header Section */}
                                                <div className="flex items-start gap-6 mb-6">
                                                    <div className="relative">
                                                        <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl text-white shadow-xl transform group-hover:scale-110 transition-transform duration-300">
                                                            <IconComponent className="w-8 h-8" />
                                                        </div>
                                                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                                            <span className="text-white text-xs font-bold">★</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors mb-2">
                                                            {template.name}
                                                        </h4>
                                                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                                            Professional template designed for optimal productivity and organization
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-3">
                                                            <div className="flex items-center gap-1">
                                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                                <span className="text-xs text-gray-500 dark:text-gray-400">Ready to use</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                                <span className="text-xs text-gray-500 dark:text-gray-400">Auto-save</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Template Preview */}
                                                <div className="space-y-4 mb-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                                        <div className="h-3 bg-gradient-to-r from-orange-200 to-orange-300 dark:from-orange-700 dark:to-orange-600 rounded-full w-4/5"></div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                        <div className="h-3 bg-gradient-to-r from-blue-200 to-blue-300 dark:from-blue-700 dark:to-blue-600 rounded-full w-3/5"></div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                        <div className="h-3 bg-gradient-to-r from-green-200 to-green-300 dark:from-green-700 dark:to-green-600 rounded-full w-2/3"></div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                                        <div className="h-3 bg-gradient-to-r from-purple-200 to-purple-300 dark:from-purple-700 dark:to-purple-600 rounded-full w-1/2"></div>
                                                    </div>
                                                </div>

                                                {/* Tags */}
                                                <div className="flex flex-wrap gap-2 mb-6">
                                                    {template.tags.map(tag => (
                                                        <span
                                                            key={tag}
                                                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-full shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                                                        >
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Features List */}
                                                <div className="space-y-2 mb-6">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                                                        <span>Professional formatting</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                                        <span>Auto-save enabled</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                                        <span>Rich text support</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Hover Effects */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                                            
                                            {/* Use Template Button */}
                                            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                                                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
                                                    ✨ Use Template
                                                </div>
                                            </div>

                                            {/* Corner Decoration */}
                                            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-orange-500 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-blue-500 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Coming Soon Section */}
                            <div className="mt-12 text-center">
                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border-2 border-dashed border-gray-300 dark:border-gray-600">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <span className="text-white text-2xl">🚀</span>
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">More Templates Coming Soon</h4>
                                    <p className="text-gray-600 dark:text-gray-400">We're working on more beautiful templates for your needs</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Notes
