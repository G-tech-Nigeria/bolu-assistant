import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript (Single User)
export interface Database {
  public: {
    Tables: {
      calendar_events: {
        Row: {
          id: string
          title: string
          description: string | null
          start_date: string | null
          end_date: string | null
          category: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          category?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          category?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      agenda_tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          completed: boolean
          date: string
          priority: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          completed?: boolean
          date: string
          priority?: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          completed?: boolean
          date?: string
          priority?: string
          created_at?: string
        }
      }
      plants: {
        Row: {
          id: string
          name: string
          species: string | null
          location: string | null
          last_watered: string | null
          next_watering: string | null
          watering_frequency: number | null
          care_tasks: any | null
          pot_color: string | null
          plant_type: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          species?: string | null
          location?: string | null
          last_watered?: string | null
          next_watering?: string | null
          watering_frequency?: number | null
          care_tasks?: any | null
          pot_color?: string | null
          plant_type?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          species?: string | null
          location?: string | null
          last_watered?: string | null
          next_watering?: string | null
          watering_frequency?: number | null
          care_tasks?: any | null
          pot_color?: string | null
          plant_type?: string | null
          created_at?: string
        }
      }
      health_habits: {
        Row: {
          id: string
          type: string
          data: any
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          type: string
          data: any
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          type?: string
          data?: any
          date?: string
          created_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          title: string
          content: string | null
          folder_id: string | null
          tags: string[] | null
          is_pinned: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content?: string | null
          folder_id?: string | null
          tags?: string[] | null
          is_pinned?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string | null
          folder_id?: string | null
          tags?: string[] | null
          is_pinned?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      note_folders: {
        Row: {
          id: string
          name: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          color: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          created_at?: string
        }
      }
      business_areas: {
        Row: {
          id: string
          name: string
          description: string | null
          current_focus: string | null
          icon: string | null
          color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          current_focus?: string | null
          icon?: string | null
          color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          current_focus?: string | null
          icon?: string | null
          color?: string | null
          created_at?: string
        }
      }
      // ===== DEV ROADMAP TABLES =====
      dev_roadmap_phases: {
        Row: {
          id: string
          title: string
          description: string | null
          start_date: string
          end_date: string
          weeks: number
          progress: number
          status: 'not-started' | 'in-progress' | 'completed'
          leetcode_target: number
          leetcode_completed: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          start_date: string
          end_date: string
          weeks?: number
          progress?: number
          status?: 'not-started' | 'in-progress' | 'completed'
          leetcode_target?: number
          leetcode_completed?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          start_date?: string
          end_date?: string
          weeks?: number
          progress?: number
          status?: 'not-started' | 'in-progress' | 'completed'
          leetcode_target?: number
          leetcode_completed?: number
          created_at?: string
          updated_at?: string
        }
      }
      dev_roadmap_topics: {
        Row: {
          id: string
          phase_id: string
          name: string
          description: string | null
          completed: boolean
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          phase_id: string
          name: string
          description?: string | null
          completed?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          phase_id?: string
          name?: string
          description?: string | null
          completed?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      dev_roadmap_resources: {
        Row: {
          id: string
          topic_id: string
          name: string
          url: string | null
          type: 'documentation' | 'course' | 'article' | 'video' | 'book'
          completed: boolean
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          topic_id: string
          name: string
          url?: string | null
          type?: 'documentation' | 'course' | 'article' | 'video' | 'book'
          completed?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          topic_id?: string
          name?: string
          url?: string | null
          type?: 'documentation' | 'course' | 'article' | 'video' | 'book'
          completed?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      dev_roadmap_projects: {
        Row: {
          id: string
          phase_id: string
          name: string
          description: string | null
          status: 'not-started' | 'in-progress' | 'completed'
          github_url: string | null
          live_url: string | null
          technologies: string[]
          is_custom: boolean
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          phase_id: string
          name: string
          description?: string | null
          status?: 'not-started' | 'in-progress' | 'completed'
          github_url?: string | null
          live_url?: string | null
          technologies?: string[]
          is_custom?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          phase_id?: string
          name?: string
          description?: string | null
          status?: 'not-started' | 'in-progress' | 'completed'
          github_url?: string | null
          live_url?: string | null
          technologies?: string[]
          is_custom?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      dev_roadmap_daily_logs: {
        Row: {
          id: string
          date: string
          phase_id: string | null
          topic_id: string | null
          project_id: string | null
          hours_spent: number
          activities: string | null
          leetcode_problems: number
          key_takeaway: string | null
          reading_minutes: number | null
          project_work_minutes: number | null
          leetcode_minutes: number | null
          networking_minutes: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          date: string
          phase_id?: string | null
          topic_id?: string | null
          project_id?: string | null
          hours_spent?: number
          activities?: string | null
          leetcode_problems?: number
          key_takeaway?: string | null
          reading_minutes?: number | null
          project_work_minutes?: number | null
          leetcode_minutes?: number | null
          networking_minutes?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          date?: string
          phase_id?: string | null
          topic_id?: string | null
          project_id?: string | null
          hours_spent?: number
          activities?: string | null
          leetcode_problems?: number
          key_takeaway?: string | null
          reading_minutes?: number | null
          project_work_minutes?: number | null
          leetcode_minutes?: number | null
          networking_minutes?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      dev_roadmap_achievements: {
        Row: {
          id: string
          title: string
          description: string | null
          icon: string
          unlocked: boolean
          unlocked_date: string | null
          requirement: string | null
          category: 'daily' | 'progress' | 'milestone' | 'special' | 'streak' | 'project' | 'leetcode' | 'phase' | 'time' | 'social'
          points: number
          next_achievement: string | null
          is_active: boolean
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          title: string
          description?: string | null
          icon: string
          unlocked?: boolean
          unlocked_date?: string | null
          requirement?: string | null
          category: 'daily' | 'progress' | 'milestone' | 'special' | 'streak' | 'project' | 'leetcode' | 'phase' | 'time' | 'social'
          points?: number
          next_achievement?: string | null
          is_active?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          icon?: string
          unlocked?: boolean
          unlocked_date?: string | null
          requirement?: string | null
          category?: 'daily' | 'progress' | 'milestone' | 'special' | 'streak' | 'project' | 'leetcode' | 'phase' | 'time' | 'social'
          points?: number
          next_achievement?: string | null
          is_active?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      dev_roadmap_user_stats: {
        Row: {
          id: string
          total_hours: number
          total_leetcode_solved: number
          current_streak: number
          longest_streak: number
          total_points: number
          total_achievements_unlocked: number
          total_projects_completed: number
          total_topics_completed: number
          total_phases_completed: number
          last_activity_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          total_hours?: number
          total_leetcode_solved?: number
          current_streak?: number
          longest_streak?: number
          total_points?: number
          total_achievements_unlocked?: number
          total_projects_completed?: number
          total_topics_completed?: number
          total_phases_completed?: number
          last_activity_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          total_hours?: number
          total_leetcode_solved?: number
          current_streak?: number
          longest_streak?: number
          total_points?: number
          total_achievements_unlocked?: number
          total_projects_completed?: number
          total_topics_completed?: number
          total_phases_completed?: number
          last_activity_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      dev_roadmap_study_sessions: {
        Row: {
          id: string
          start_time: string
          end_time: string | null
          duration_minutes: number
          mode: 'focus' | 'break'
          completed: boolean
          phase_id: string | null
          topic_id: string | null
          project_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          start_time: string
          end_time?: string | null
          duration_minutes: number
          mode?: 'focus' | 'break'
          completed?: boolean
          phase_id?: string | null
          topic_id?: string | null
          project_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          start_time?: string
          end_time?: string | null
          duration_minutes?: number
          mode?: 'focus' | 'break'
          completed?: boolean
          phase_id?: string | null
          topic_id?: string | null
          project_id?: string | null
          created_at?: string
        }
      }
      finance_transactions: {
        Row: {
          id: string
          type: string
          amount: number
          description: string
          category: string
          date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: string
          amount: number
          description: string
          category: string
          date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: string
          amount?: number
          description?: string
          category?: string
          date?: string
          created_at?: string
          updated_at?: string
        }
      }
      business_goals: {
        Row: {
          id: string
          business_area: string
          title: string
          description: string | null
          completed: boolean
          priority: 'low' | 'medium' | 'high'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_area: string
          title: string
          description?: string | null
          completed?: boolean
          priority?: 'low' | 'medium' | 'high'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_area?: string
          title?: string
          description?: string | null
          completed?: boolean
          priority?: 'low' | 'medium' | 'high'
          created_at?: string
          updated_at?: string
        }
      }
      business_ideas: {
        Row: {
          id: string
          business_area: string
          title: string
          description: string | null
          category: 'product' | 'service' | 'marketing' | 'partnership' | 'innovation'
          priority: 'low' | 'medium' | 'high'
          status: 'new' | 'in-progress' | 'completed' | 'archived'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_area: string
          title: string
          description?: string | null
          category?: 'product' | 'service' | 'marketing' | 'partnership' | 'innovation'
          priority?: 'low' | 'medium' | 'high'
          status?: 'new' | 'in-progress' | 'completed' | 'archived'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_area?: string
          title?: string
          description?: string | null
          category?: 'product' | 'service' | 'marketing' | 'partnership' | 'innovation'
          priority?: 'low' | 'medium' | 'high'
          status?: 'new' | 'in-progress' | 'completed' | 'archived'
          created_at?: string
          updated_at?: string
        }
      }
      business_notes: {
        Row: {
          id: string
          business_area: string
          title: string
          content: string | null
          folder_id: string | null
          tags: string[] | null
          is_pinned: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_area: string
          title: string
          content?: string | null
          folder_id?: string | null
          tags?: string[] | null
          is_pinned?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_area?: string
          title?: string
          content?: string | null
          folder_id?: string | null
          tags?: string[] | null
          is_pinned?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      business_note_folders: {
        Row: {
          id: string
          business_area: string
          name: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          business_area: string
          name: string
          color: string
          created_at?: string
        }
        Update: {
          id?: string
          business_area?: string
          name?: string
          color?: string
          created_at?: string
        }
      }
      job_applications: {
        Row: {
          id: string
          company_name: string
          job_title: string
          job_description: string | null
          location: string | null
          salary_range: string | null
          employment_type: string | null
          application_status: string
          application_date: string
          application_url: string | null
          contact_person: string | null
          contact_email: string | null
          notes: string | null
          interview_dates: any
          documents_submitted: any
          follow_up_date: string | null
          priority_level: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_name: string
          job_title: string
          job_description?: string | null
          location?: string | null
          salary_range?: string | null
          employment_type?: string | null
          application_status?: string
          application_date?: string
          application_url?: string | null
          contact_person?: string | null
          contact_email?: string | null
          notes?: string | null
          interview_dates?: any
          documents_submitted?: any
          follow_up_date?: string | null
          priority_level?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_name?: string
          job_title?: string
          job_description?: string | null
          location?: string | null
          salary_range?: string | null
          employment_type?: string | null
          application_status?: string
          application_date?: string
          application_url?: string | null
          contact_person?: string | null
          contact_email?: string | null
          notes?: string | null
          interview_dates?: any
          documents_submitted?: any
          follow_up_date?: string | null
          priority_level?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          preference_key: string
          preference_value: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          preference_key: string
          preference_value?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          preference_key?: string
          preference_value?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // ===== CODING JOURNEY TABLES =====
      coding_journey_sections: {
        Row: {
          id: string
          title: string
          description: string | null
          icon: string
          color: string
          estimated_total_hours: number
          completed: boolean
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          icon: string
          color: string
          estimated_total_hours: number
          completed?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          icon?: string
          color?: string
          estimated_total_hours?: number
          completed?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      coding_journey_subsections: {
        Row: {
          id: string
          section_id: string
          title: string
          description: string | null
          difficulty: string
          estimated_hours: number
          completed: boolean
          resources: string[]
          projects: any
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          section_id: string
          title: string
          description?: string | null
          difficulty: string
          estimated_hours: number
          completed?: boolean
          resources?: string[]
          projects?: any
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          section_id?: string
          title?: string
          description?: string | null
          difficulty?: string
          estimated_hours?: number
          completed?: boolean
          resources?: string[]
          projects?: any
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      coding_journey_progress: {
        Row: {
          id: string
          total_sections: number
          completed_sections: number
          total_subsections: number
          completed_subsections: number
          total_hours: number
          completed_hours: number
          progress_percentage: number
          last_updated: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          total_sections?: number
          completed_sections?: number
          total_subsections?: number
          completed_subsections?: number
          total_hours?: number
          completed_hours?: number
          progress_percentage?: number
          last_updated?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          total_sections?: number
          completed_sections?: number
          total_subsections?: number
          completed_subsections?: number
          total_hours?: number
          completed_hours?: number
          progress_percentage?: number
          last_updated?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 