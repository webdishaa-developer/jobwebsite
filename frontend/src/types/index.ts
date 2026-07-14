export interface Job {
  id: string;
  title: string;
  slug: string;
  company: string;
  location: string;
  jobType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE';
  workMode: 'ON_SITE' | 'REMOTE' | 'HYBRID';
  industry: string;
  department: string;
  experienceMin: number;
  experienceMax: number;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency: string;
  description: string;
  requirements: string;
  responsibilities: string;
  benefits?: string | null;
  skills: string;
  openings: number;
  status: 'ACTIVE' | 'PAUSED' | 'CLOSED' | 'DRAFT';
  isFeatured: boolean;
  deadline?: string | null;
  views: number;
  createdAt: string;
  updatedAt: string;
  _count?: { applications: number };
}

export interface Application {
  id: string;
  jobId: string;
  job?: Pick<Job, 'title' | 'location' | 'department'>;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentLocation: string;
  currentCompany?: string | null;
  currentRole?: string | null;
  totalExperience: number;
  noticePeriod: string;
  expectedSalary?: number | null;
  currentSalary?: number | null;
  resumeUrl: string;
  coverLetter?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  status: ApplicationStatus;
  notes?: string | null;
  interviewDate?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStatus =
  | 'PENDING' | 'REVIEWING' | 'SHORTLISTED'
  | 'INTERVIEW_SCHEDULED' | 'OFFERED' | 'HIRED'
  | 'REJECTED' | 'WITHDRAWN';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatarUrl?: string | null;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR';
  lastLogin?: string | null;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: PaginationMeta;
}

export interface JobFilters {
  search?: string;
  industry?: string;
  jobType?: string;
  workMode?: string;
  location?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ApplyFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentLocation: string;
  currentCompany?: string;
  currentRole?: string;
  totalExperience: number;
  noticePeriod: string;
  expectedSalary?: number;
  currentSalary?: number;
  coverLetter?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resume: File;
}

export interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  thisMonthApplications: number;
  lastMonthApplications: number;
  pendingApplications: number;
  shortlistedApplications: number;
  totalCandidates: number;
  totalTestimonials: number;
  unreadMessages: number;
  applicationGrowth: number;
}
