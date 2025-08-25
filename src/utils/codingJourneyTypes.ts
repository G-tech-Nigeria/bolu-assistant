export interface Subsection {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  estimatedHours: number;
  resources: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  projects: {
    beginner: Array<{
      title: string;
      description: string;
      technologies: string[];
      githubUrl?: string;
      liveUrl?: string;
    }>;
    intermediate: Array<{
      title: string;
      description: string;
      technologies: string[];
      githubUrl?: string;
      liveUrl?: string;
    }>;
    advanced: Array<{
      title: string;
      description: string;
      technologies: string[];
      githubUrl?: string;
      liveUrl?: string;
    }>;
  };
}

export interface Section {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  completed: boolean;
  subsections: Subsection[];
  estimatedTotalHours: number;
  order: number;
}

export interface RoadmapData {
  sections: Section[];
  totalProgress: number;
  totalEstimatedHours: number;
  completedHours: number;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  completed: boolean;
  sections: string[];
}

