export type ScoreBreakdown = {
  keyword_coverage:    number;
  quantification:      number;
  action_verbs:        number;
  section_completeness: number;
  length:              number;
  parseability:        number;
};

export type Profile = {
  id:                   string;
  email:                string;
  full_name:            string | null;
  avatar_url:           string | null;
  daily_analyses_used:  number;
  daily_reset_at:       string;
  created_at:           string;
  updated_at:           string;
};

export type Resume = {
  id:              string;
  user_id:         string;
  title:           string;
  raw_text:        string;
  parsed_json:     Record<string, unknown> | null;
  source_file_url: string | null;
  created_at:      string;
  updated_at:      string;
};

export type JobTarget = {
  id:              string;
  user_id:         string;
  resume_id:       string | null;
  job_title:       string;
  company:         string | null;
  job_description: string;
  job_url:         string | null;
  created_at:      string;
};

export type Analysis = {
  id:               string;
  user_id:          string;
  resume_id:        string;
  job_target_id:    string | null;
  ats_score:        number;
  score_breakdown:  ScoreBreakdown;
  keywords_matched: string[];
  keywords_missing: string[];
  suggestions:      string[];
  red_flags:        string[];
  content_hash:     string;
  created_at:       string;
};

export type CoverLetter = {
  id:           string;
  user_id:      string;
  resume_id:    string;
  job_target_id: string | null;
  content:      string;
  tone:         'formal' | 'professional' | 'conversational';
  word_count:   number;
  created_at:   string;
};
