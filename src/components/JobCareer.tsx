import { useState, useEffect } from 'react'
import { 
    Briefcase, 
    Plus, 
    X, 
    MapPin, 
    DollarSign, 
    Calendar, 
    Clock, 
    ExternalLink, 
    Mail, 
    User, 
    FileText, 
    Star,
    Building,
    Search,
    Filter,
    Eye,
    Edit,
    Trash2
} from 'lucide-react'
import { getJobApplications, addJobApplication, updateJobApplication, deleteJobApplication } from '../lib/database'

interface JobApplication {
    id: string
    company_name: string
    job_title: string
    job_description?: string
    location?: string
    salary_range?: string
    employment_type?: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship'
    application_status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected' | 'withdrawn'
    application_date: string
    application_url?: string
    contact_person?: string
    contact_email?: string
    notes?: string
    interview_dates?: any[]
    documents_submitted?: any[]
    follow_up_date?: string
    priority_level: number
    created_at: string
    updated_at: string
}

const JobCareer = () => {
    const [jobApplications, setJobApplications] = useState<JobApplication[]>([])
    const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null)
    const [showJobDetails, setShowJobDetails] = useState(false)
    const [showAddJob, setShowAddJob] = useState(false)
    const [showEditJob, setShowEditJob] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    
    const [newJob, setNewJob] = useState<Omit<JobApplication, 'id' | 'created_at' | 'updated_at'>>({
        company_name: '',
        job_title: '',
        job_description: '',
        location: '',
        salary_range: '',
        employment_type: 'full-time',
        application_status: 'applied',
        application_date: new Date().toISOString().split('T')[0],
        application_url: '',
        contact_person: '',
        contact_email: '',
        notes: '',
        interview_dates: [],
        documents_submitted: [],
        follow_up_date: undefined, // Use undefined instead of empty string
        priority_level: 3
    })

    useEffect(() => {
        loadJobApplications()
    }, [])

    const loadJobApplications = async () => {
        try {
            setIsLoading(true)
            const applications = await getJobApplications()
            setJobApplications(applications)
        } catch (error) {
            console.error('Error loading job applications:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const addNewJobApplication = async () => {
        try {
            if (!newJob.company_name.trim() || !newJob.job_title.trim()) {
                alert('Please enter company name and job title')
                return
            }

            // Clean up the job data before sending to database
            const jobData = {
                ...newJob,
                // Convert empty strings to null for date fields
                follow_up_date: newJob.follow_up_date?.trim() || null,
                // Ensure required fields are not empty
                application_date: newJob.application_date || new Date().toISOString().split('T')[0],
                // Clean up optional text fields
                job_description: newJob.job_description?.trim() || null,
                location: newJob.location?.trim() || null,
                salary_range: newJob.salary_range?.trim() || null,
                application_url: newJob.application_url?.trim() || null,
                contact_person: newJob.contact_person?.trim() || null,
                contact_email: newJob.contact_email?.trim() || null,
                notes: newJob.notes?.trim() || null
            }

            const addedJob = await addJobApplication(jobData)
            setJobApplications([addedJob, ...jobApplications])
            
            // Reset form
            setNewJob({
                company_name: '',
                job_title: '',
                job_description: '',
                location: '',
                salary_range: '',
                employment_type: 'full-time',
                application_status: 'applied',
                application_date: new Date().toISOString().split('T')[0],
                application_url: '',
                contact_person: '',
                contact_email: '',
                notes: '',
                interview_dates: [],
                documents_submitted: [],
                follow_up_date: undefined, // Use undefined instead of empty string
                priority_level: 3
            })
            
            setShowAddJob(false)
        } catch (error) {
            console.error('Error adding job application:', error)
            alert('Error adding job application. Please try again.')
        }
    }

    const updateJobStatus = async (jobId: string, newStatus: JobApplication['application_status']) => {
        try {
            const updatedJob = await updateJobApplication(jobId, { application_status: newStatus })
            setJobApplications(jobApplications.map(job => 
                job.id === jobId ? { ...job, application_status: newStatus } : job
            ))
            
            if (selectedJob && selectedJob.id === jobId) {
                setSelectedJob({ ...selectedJob, application_status: newStatus })
            }
        } catch (error) {
            console.error('Error updating job status:', error)
        }
    }

    const deleteJobFromDatabase = async (jobId: string) => {
        try {
            await deleteJobApplication(jobId)
            setJobApplications(jobApplications.filter(job => job.id !== jobId))
            
            if (selectedJob && selectedJob.id === jobId) {
                setSelectedJob(null)
                setShowJobDetails(false)
            }
        } catch (error) {
            console.error('Error deleting job application:', error)
        }
    }

    const getStatusColor = (status: string) => {
        const colors = {
            applied: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
            screening: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
            interview: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
            offer: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
            rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
            withdrawn: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
        }
        return colors[status as keyof typeof colors] || colors.applied
    }

    const getPriorityColor = (priority: number) => {
        if (priority >= 5) return 'text-red-500'
        if (priority >= 4) return 'text-orange-500'
        if (priority >= 3) return 'text-yellow-500'
        return 'text-gray-400'
    }

    const filteredJobs = jobApplications.filter(job => {
        const matchesSearch = 
            job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.location?.toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesStatus = statusFilter === 'all' || job.application_status === statusFilter
        
        return matchesSearch && matchesStatus
    })

    const statusCounts = {
        all: jobApplications.length,
        applied: jobApplications.filter(job => job.application_status === 'applied').length,
        screening: jobApplications.filter(job => job.application_status === 'screening').length,
        interview: jobApplications.filter(job => job.application_status === 'interview').length,
        offer: jobApplications.filter(job => job.application_status === 'offer').length,
        rejected: jobApplications.filter(job => job.application_status === 'rejected').length,
        withdrawn: jobApplications.filter(job => job.application_status === 'withdrawn').length
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center">
                <div className="text-center">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-pulse" />
                    <p className="text-gray-600 dark:text-gray-400">Loading job applications...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900">
            <div className="container mx-auto px-3 md:px-4 py-4 md:py-6">
                {/* Header */}
                <div className="text-center mb-6 md:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4 mb-4 md:mb-6">
                        <div className="text-center sm:text-left">
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center sm:justify-start gap-2">
                                <Briefcase className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                                Job Applications
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                                Track your job applications and career progress
                            </p>
                        </div>
                        
                        <button
                            onClick={() => setShowAddJob(true)}
                            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 touch-manipulation min-h-[44px] whitespace-nowrap"
                        >
                            <Plus className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="hidden sm:inline">Add Application</span>
                            <span className="sm:hidden">Add</span>
                        </button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 md:gap-4 mb-6 md:mb-8">
                    <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-3 md:p-4 text-center backdrop-blur-sm border border-white/20 shadow-sm">
                        <div className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">{statusCounts.all}</div>
                        <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Total</div>
                    </div>
                    <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-3 md:p-4 text-center backdrop-blur-sm border border-white/20 shadow-sm">
                        <div className="text-lg md:text-2xl font-bold text-blue-600">{statusCounts.applied}</div>
                        <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Applied</div>
                    </div>
                    <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-3 md:p-4 text-center backdrop-blur-sm border border-white/20 shadow-sm">
                        <div className="text-lg md:text-2xl font-bold text-yellow-600">{statusCounts.screening}</div>
                        <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Screening</div>
                    </div>
                    <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-3 md:p-4 text-center backdrop-blur-sm border border-white/20 shadow-sm">
                        <div className="text-lg md:text-2xl font-bold text-purple-600">{statusCounts.interview}</div>
                        <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Interview</div>
                    </div>
                    <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-3 md:p-4 text-center backdrop-blur-sm border border-white/20 shadow-sm">
                        <div className="text-lg md:text-2xl font-bold text-green-600">{statusCounts.offer}</div>
                        <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Offers</div>
                    </div>
                    <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-3 md:p-4 text-center backdrop-blur-sm border border-white/20 shadow-sm">
                        <div className="text-lg md:text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
                        <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Rejected</div>
                    </div>
                    <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-3 md:p-4 text-center backdrop-blur-sm border border-white/20 shadow-sm">
                        <div className="text-lg md:text-2xl font-bold text-gray-600">{statusCounts.withdrawn}</div>
                        <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Withdrawn</div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl md:rounded-2xl p-4 md:p-6 mb-6 md:mb-8 backdrop-blur-sm border border-white/20 shadow-lg">
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                            <input
                                type="text"
                                placeholder="Search by company, job title, or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation text-base"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="pl-10 pr-8 py-3 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation text-base min-w-[120px]"
                            >
                                <option value="all">All Status</option>
                                <option value="applied">Applied</option>
                                <option value="screening">Screening</option>
                                <option value="interview">Interview</option>
                                <option value="offer">Offer</option>
                                <option value="rejected">Rejected</option>
                                <option value="withdrawn">Withdrawn</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Job Applications Grid */}
                {filteredJobs.length > 0 ? (
                    <div className="grid gap-4 md:gap-6">
                        {filteredJobs.map((job) => (
                            <div
                                key={job.id}
                                className="bg-white/70 dark:bg-gray-800/70 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                    {/* Main Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Building className="w-4 h-4 md:w-5 md:h-5 text-blue-600 flex-shrink-0" />
                                                    <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white truncate">
                                                        {job.company_name}
                                                    </h3>
                                                    <div className="flex items-center gap-1">
                                                        {[...Array(job.priority_level)].map((_, i) => (
                                                            <Star key={i} className={`w-3 h-3 md:w-4 md:h-4 ${getPriorityColor(job.priority_level)} fill-current`} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <h4 className="text-base md:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 line-clamp-1">
                                                    {job.job_title}
                                                </h4>
                                                <div className="flex flex-wrap gap-2 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                                                    {job.location && (
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                                                            <span className="truncate">{job.location}</span>
                                                        </div>
                                                    )}
                                                    {job.salary_range && (
                                                        <div className="flex items-center gap-1">
                                                            <DollarSign className="w-3 h-3 md:w-4 md:h-4" />
                                                            <span>{job.salary_range}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                                                        <span>{new Date(job.application_date).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(job.application_status)}`}>
                                                {job.application_status.charAt(0).toUpperCase() + job.application_status.slice(1)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 lg:flex-col lg:gap-3">
                                        <button
                                            onClick={() => {
                                                setSelectedJob(job)
                                                setShowJobDetails(true)
                                            }}
                                            className="flex items-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors touch-manipulation text-xs md:text-sm"
                                        >
                                            <Eye className="w-3 h-3 md:w-4 md:h-4" />
                                            <span className="hidden sm:inline">View</span>
                                        </button>
                                        
                                        <select
                                            value={job.application_status}
                                            onChange={(e) => updateJobStatus(job.id, e.target.value as JobApplication['application_status'])}
                                            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs touch-manipulation"
                                        >
                                            <option value="applied">Applied</option>
                                            <option value="screening">Screening</option>
                                            <option value="interview">Interview</option>
                                            <option value="offer">Offer</option>
                                            <option value="rejected">Rejected</option>
                                            <option value="withdrawn">Withdrawn</option>
                                        </select>
                                        
                                        <button
                                            onClick={() => deleteJobFromDatabase(job.id)}
                                            className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors touch-manipulation text-xs md:text-sm"
                                        >
                                            <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                                            <span className="hidden sm:inline">Delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 md:py-16">
                        <Briefcase className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 text-gray-400 opacity-50" />
                        <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {searchTerm || statusFilter !== 'all' ? 'No matching applications' : 'No job applications yet'}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                            {searchTerm || statusFilter !== 'all' 
                                ? 'Try adjusting your search or filters' 
                                : 'Start tracking your job applications by adding your first one'
                            }
                        </p>
                        {(!searchTerm && statusFilter === 'all') && (
                            <button
                                onClick={() => setShowAddJob(true)}
                                className="mt-4 inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                            >
                                <Plus className="w-5 h-5" />
                                Add Your First Application
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Add Job Modal */}
            {showAddJob && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 md:p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4 md:mb-6">
                            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Add Job Application</h2>
                            <button
                                onClick={() => setShowAddJob(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors touch-manipulation"
                            >
                                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Company Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={newJob.company_name}
                                        onChange={(e) => setNewJob({ ...newJob, company_name: e.target.value })}
                                        className="w-full px-3 py-3 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation text-base"
                                        placeholder="e.g., Google"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Job Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={newJob.job_title}
                                        onChange={(e) => setNewJob({ ...newJob, job_title: e.target.value })}
                                        className="w-full px-3 py-3 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation text-base"
                                        placeholder="e.g., Senior Frontend Developer"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={newJob.location}
                                        onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                                        className="w-full px-3 py-3 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation text-base"
                                        placeholder="e.g., San Francisco, CA (Remote)"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Salary Range
                                    </label>
                                    <input
                                        type="text"
                                        value={newJob.salary_range}
                                        onChange={(e) => setNewJob({ ...newJob, salary_range: e.target.value })}
                                        className="w-full px-3 py-3 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation text-base"
                                        placeholder="e.g., $120,000 - $150,000"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Employment Type
                                    </label>
                                    <select
                                        value={newJob.employment_type}
                                        onChange={(e) => setNewJob({ ...newJob, employment_type: e.target.value as JobApplication['employment_type'] })}
                                        className="w-full px-3 py-3 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation text-base"
                                    >
                                        <option value="full-time">Full-time</option>
                                        <option value="part-time">Part-time</option>
                                        <option value="contract">Contract</option>
                                        <option value="freelance">Freelance</option>
                                        <option value="internship">Internship</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Priority Level
                                    </label>
                                    <select
                                        value={newJob.priority_level}
                                        onChange={(e) => setNewJob({ ...newJob, priority_level: parseInt(e.target.value) })}
                                        className="w-full px-3 py-3 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation text-base"
                                    >
                                        <option value={1}>1 - Low</option>
                                        <option value={2}>2 - Below Average</option>
                                        <option value={3}>3 - Average</option>
                                        <option value={4}>4 - High</option>
                                        <option value={5}>5 - Very High</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Application Date
                                    </label>
                                    <input
                                        type="date"
                                        value={newJob.application_date}
                                        onChange={(e) => setNewJob({ ...newJob, application_date: e.target.value })}
                                        className="w-full px-3 py-3 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation text-base"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Application URL
                                    </label>
                                    <input
                                        type="url"
                                        value={newJob.application_url}
                                        onChange={(e) => setNewJob({ ...newJob, application_url: e.target.value })}
                                        className="w-full px-3 py-3 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation text-base"
                                        placeholder="https://company.com/jobs/123"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Contact Person
                                    </label>
                                    <input
                                        type="text"
                                        value={newJob.contact_person}
                                        onChange={(e) => setNewJob({ ...newJob, contact_person: e.target.value })}
                                        className="w-full px-3 py-3 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation text-base"
                                        placeholder="e.g., Sarah Johnson"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Contact Email
                                    </label>
                                    <input
                                        type="email"
                                        value={newJob.contact_email}
                                        onChange={(e) => setNewJob({ ...newJob, contact_email: e.target.value })}
                                        className="w-full px-3 py-3 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation text-base"
                                        placeholder="sarah@company.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Job Description
                                </label>
                                <textarea
                                    value={newJob.job_description}
                                    onChange={(e) => setNewJob({ ...newJob, job_description: e.target.value })}
                                    className="w-full px-3 py-3 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation text-base resize-none"
                                    rows={3}
                                    placeholder="Brief description of the role and requirements..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Notes
                                </label>
                                <textarea
                                    value={newJob.notes}
                                    onChange={(e) => setNewJob({ ...newJob, notes: e.target.value })}
                                    className="w-full px-3 py-3 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation text-base resize-none"
                                    rows={3}
                                    placeholder="Any additional notes about this application..."
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <button
                                    onClick={() => setShowAddJob(false)}
                                    className="flex-1 px-4 py-3 md:py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors touch-manipulation min-h-[44px] flex items-center justify-center"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={addNewJobApplication}
                                    className="flex-1 px-4 py-3 md:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors touch-manipulation min-h-[44px] flex items-center justify-center"
                                >
                                    Add Application
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Job Details Modal */}
            {showJobDetails && selectedJob && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 md:p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4 md:mb-6">
                            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Job Application Details</h2>
                            <button
                                onClick={() => setShowJobDetails(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors touch-manipulation"
                            >
                                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Building className="w-6 h-6 text-blue-600" />
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedJob.company_name}</h3>
                                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{selectedJob.job_title}</p>
                                </div>
                            </div>

                            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedJob.application_status)}`}>
                                {selectedJob.application_status.charAt(0).toUpperCase() + selectedJob.application_status.slice(1)}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                {selectedJob.location && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-600" />
                                        <span className="text-gray-900 dark:text-white">{selectedJob.location}</span>
                                    </div>
                                )}
                                {selectedJob.salary_range && (
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-gray-600" />
                                        <span className="text-gray-900 dark:text-white">{selectedJob.salary_range}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-600" />
                                    <span className="text-gray-900 dark:text-white">Applied: {new Date(selectedJob.application_date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-600" />
                                    <span className="text-gray-900 dark:text-white">{selectedJob.employment_type}</span>
                                </div>
                                {selectedJob.contact_person && (
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-600" />
                                        <span className="text-gray-900 dark:text-white">{selectedJob.contact_person}</span>
                                    </div>
                                )}
                                {selectedJob.contact_email && (
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-600" />
                                        <a href={`mailto:${selectedJob.contact_email}`} className="text-blue-600 hover:text-blue-700">
                                            {selectedJob.contact_email}
                                        </a>
                                    </div>
                                )}
                            </div>

                            {selectedJob.job_description && (
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Job Description</h4>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{selectedJob.job_description}</p>
                                </div>
                            )}

                            {selectedJob.notes && (
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Notes</h4>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{selectedJob.notes}</p>
                                </div>
                            )}

                            {selectedJob.application_url && (
                                <div>
                                    <a
                                        href={selectedJob.application_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        View Original Job Posting
                                    </a>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <button
                                    onClick={() => setShowJobDetails(false)}
                                    className="flex-1 px-4 py-3 md:py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors touch-manipulation min-h-[44px] flex items-center justify-center"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => deleteJobFromDatabase(selectedJob.id)}
                                    className="flex-1 px-4 py-3 md:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors touch-manipulation min-h-[44px] flex items-center justify-center"
                                >
                                    Delete Application
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default JobCareer