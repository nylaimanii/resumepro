export type ResumeData = {
  personal: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    website: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    company: string;
    role: string;
    location: string;
    start_date: string;
    end_date: string;
    current: boolean;
    bullets: string[];
  }>;
  education: Array<{
    id: string;
    school: string;
    degree: string;
    field: string;
    location: string;
    start_date: string;
    end_date: string;
    gpa?: string;
  }>;
  skills: {
    categories: Array<{ id: string; name: string; items: string[] }>;
  };
  projects: Array<{
    id: string;
    name: string;
    description: string;
    link: string;
    tech: string[];
    bullets: string[];
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
  }>;
};

export const EMPTY_RESUME: ResumeData = {
  personal: { name: "", title: "", email: "", phone: "", location: "", linkedin: "", github: "", website: "" },
  summary: "",
  experience: [],
  education: [],
  skills: { categories: [{ id: "default", name: "Skills", items: [] }] },
  projects: [],
  certifications: [],
};
