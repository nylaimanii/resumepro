export const SKILL_TAXONOMY = {
  languages: [
    "javascript", "typescript", "python", "java", "c++", "c#", "go", "rust", "ruby", "php",
    "swift", "kotlin", "scala", "r", "matlab", "sql", "html", "css", "bash", "shell",
    "powershell", "perl", "lua", "haskell", "elixir", "erlang", "clojure", "f#", "dart",
    "objective-c", "assembly", "cobol", "fortran", "groovy", "julia", "ocaml", "solidity",
    "vhdl", "verilog", "zig", "nim", "crystal",
  ],
  frameworks: [
    "react", "next.js", "vue", "angular", "svelte", "node.js", "express", "django", "flask",
    "fastapi", "spring", "rails", "laravel", ".net", "tailwind", "bootstrap", "nuxt",
    "remix", "astro", "gatsby", "nestjs", "hapi", "koa", "fastify", "gin", "fiber",
    "echo", "actix", "rocket", "axum", "phoenix", "ecto", "hibernate", "jpa", "mybatis",
    "struts", "play", "ktor", "quarkus", "micronaut", "grpc", "graphql", "apollo",
    "relay", "redux", "zustand", "mobx", "rxjs", "ngrx", "pinia", "vuex", "storybook",
    "electron", "react native", "flutter", "expo", "ionic", "xamarin", "unity",
  ],
  databases: [
    "postgresql", "mysql", "mongodb", "redis", "sqlite", "dynamodb", "firestore", "supabase",
    "cassandra", "elasticsearch", "neo4j", "couchdb", "influxdb", "timescaledb", "cockroachdb",
    "planetscale", "neon", "turso", "mariadb", "oracle", "mssql", "snowflake", "bigquery",
    "redshift", "databricks", "pinecone", "weaviate", "qdrant", "chroma", "fauna",
  ],
  cloud: [
    "aws", "gcp", "azure", "vercel", "netlify", "heroku", "docker", "kubernetes", "terraform",
    "lambda", "s3", "ec2", "ecs", "eks", "rds", "cloudfront", "route53", "iam", "sqs", "sns",
    "cloudwatch", "cloud run", "cloud functions", "app engine", "gke", "bigquery", "pubsub",
    "azure devops", "azure functions", "blob storage", "pulumi", "ansible", "chef", "puppet",
    "vagrant", "packer", "helm", "istio", "linkerd", "consul", "vault", "nginx", "caddy",
    "traefik", "cloudflare", "fly.io", "railway", "render",
  ],
  tools: [
    "git", "github", "gitlab", "bitbucket", "jira", "figma", "postman", "linux", "webpack",
    "vite", "jest", "cypress", "playwright", "selenium", "vitest", "mocha", "chai", "pytest",
    "unittest", "rspec", "junit", "gradle", "maven", "npm", "yarn", "pnpm", "cargo", "pip",
    "poetry", "conda", "make", "cmake", "bazel", "nx", "turbo", "eslint", "prettier",
    "husky", "lint-staged", "sonarqube", "datadog", "sentry", "new relic", "grafana",
    "prometheus", "kibana", "logstash", "splunk", "pagerduty", "notion", "confluence",
    "slack", "linear", "github actions", "gitlab ci", "jenkins", "circleci", "travis ci",
  ],
  ai_ml: [
    "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy", "openai", "anthropic",
    "claude", "groq", "langchain", "llm", "rag", "machine learning", "deep learning",
    "nlp", "computer vision", "transformers", "hugging face", "keras", "xgboost", "lightgbm",
    "catboost", "spark", "hadoop", "airflow", "mlflow", "kubeflow", "weights & biases",
    "vertex ai", "sagemaker", "azure ml", "embeddings", "vector database", "fine-tuning",
    "prompt engineering", "reinforcement learning", "generative ai", "diffusion models",
    "stable diffusion", "opencv", "pillow", "matplotlib", "seaborn", "plotly", "dbt",
    "data pipeline", "feature engineering", "model deployment",
  ],
  soft_skills: [
    "leadership", "collaboration", "communication", "problem solving", "mentoring",
    "project management", "agile", "scrum", "kanban", "cross-functional", "stakeholder",
    "product thinking", "technical writing", "code review", "pair programming",
    "architecture", "system design", "ownership", "initiative",
  ],
  concepts: [
    "rest", "graphql", "microservices", "ci/cd", "devops", "tdd", "bdd", "oop",
    "functional programming", "system design", "data structures", "algorithms",
    "accessibility", "responsive design", "web performance", "seo", "security",
    "oauth", "jwt", "authentication", "authorization", "encryption", "api design",
    "event-driven", "message queue", "caching", "cdn", "load balancing", "sharding",
    "replication", "distributed systems", "concurrency", "multithreading", "websockets",
    "server-sent events", "webhooks", "openapi", "swagger", "documentation",
  ],
} as const;

export const ACTION_VERBS: string[] = [
  "accelerated", "achieved", "architected", "automated", "built", "championed", "collaborated",
  "contributed", "created", "cut", "debugged", "defined", "delivered", "deployed", "designed",
  "developed", "diagnosed", "drove", "eliminated", "enabled", "engineered", "enhanced",
  "established", "executed", "expanded", "founded", "generated", "grew", "guided", "implemented",
  "improved", "increased", "integrated", "introduced", "launched", "led", "leveraged",
  "maintained", "managed", "mentored", "migrated", "modernized", "monitored", "optimized",
  "orchestrated", "owned", "pioneered", "productionized", "reduced", "refactored", "released",
  "replaced", "researched", "resolved", "restructured", "scaled", "secured", "shaped", "shipped",
  "simplified", "solved", "spearheaded", "standardized", "streamlined", "transformed", "triaged",
  "unified", "upgraded", "wrote", "authored", "analyzed", "assessed", "built", "calculated",
  "coached", "coordinated", "decreased", "delegated", "demonstrated", "documented", "drafted",
  "evaluated", "facilitated", "forecasted", "identified", "influenced", "initiated", "led",
  "negotiated", "planned", "presented", "prioritized", "produced", "proposed", "provided",
  "recommended", "reported", "reviewed", "saved", "supported", "tested", "trained", "validated",
];

export const WEAK_PHRASES: string[] = [
  "responsible for", "helped with", "worked on", "assisted in", "participated in",
  "involved in", "duties included", "tasks included", "familiar with", "exposure to",
  "hard worker", "team player", "detail oriented", "detail-oriented", "self-motivated",
  "results driven", "results-driven", "go-getter", "rockstar", "ninja", "guru",
  "synergy", "think outside the box", "thought leader", "best practices", "leverage",
  "utilized", "passionate about", "dynamic", "proactive", "strategic thinker",
  "excellent communicator", "strong work ethic",
];

export const FILLER_WORDS: string[] = [
  "basically", "literally", "actually", "very", "really", "quite", "somewhat",
  "kind of", "sort of", "just", "simply",
];
