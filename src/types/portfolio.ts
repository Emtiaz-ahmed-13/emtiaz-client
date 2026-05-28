export type Profile = {
  id: string;
  headline: string;
  bio: string;
  location: string | null;
  resumeUrl: string | null;
  avatarUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  websiteUrl: string | null;
  email: string;
  phone: string | null;
  available: boolean;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDesc: string | null;
  techStack: string[];
  imageUrl: string | null;
  liveUrl: string | null;
  githubUrl: string | null;
  featured: boolean;
  published: boolean;
  order: number;
  problem?: string | null;
  approach?: string | null;
  outcome?: string | null;
  challenges?: string | null;
  role?: string | null;
  duration?: string | null;
  features?: string[];
  screenshots?: string[];
};

export type Skill = {
  id: string;
  name: string;
  category: "LANGUAGE" | "FRAMEWORK" | "DATABASE" | "TOOL" | "OTHER";
  level: number | null;
  order: number;
};

export type Experience = {
  id: string;
  company: string;
  position: string;
  description: string | null;
  location: string | null;
  startDate: string;
  endDate: string | null;
  current: boolean;
  order: number;
};

export type Education = {
  id: string;
  institution: string;
  degree: string;
  field: string | null;
  description: string | null;
  startDate: string;
  endDate: string | null;
  current: boolean;
  order: number;
};

export type AchievementCategory =
  | "HACKATHON"
  | "CONTEST"
  | "CERTIFICATE"
  | "COURSE"
  | "AWARD";

export type Achievement = {
  id: string;
  title: string;
  organizer: string;
  category: AchievementCategory;
  description: string | null;
  date: string;
  endDate: string | null;
  location: string | null;
  rank: string | null;
  team: string | null;
  link: string | null;
  imageUrl: string | null;
  images: string[];
  order: number;
  published: boolean;
};

export type PortfolioData = {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  education: Education[];
  achievements: Achievement[];
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};
