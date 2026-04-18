import { scoreResume } from "../index";

const STRONG_RESUME = `
Summary
Senior software engineer with 8 years building scalable systems.

Experience
Staff Engineer — Acme Corp (2020–2024)
- Architected microservices platform that reduced deployment time by 70% across 12 services
- Led migration from monolith to Kubernetes, scaling to 2M daily active users
- Mentored 5 junior engineers, increasing team velocity by 40%
- Optimized PostgreSQL queries, cutting p99 latency from 800ms to 90ms

Skills
TypeScript, React, Node.js, PostgreSQL, Redis, AWS, Docker, Kubernetes, GraphQL, CI/CD

Education
B.S. Computer Science — State University (2016)

Projects
- Built open-source CLI tool with 3,000 GitHub stars
- Contributed to React ecosystem, 12 merged PRs
`;

const MEDIUM_RESUME = `
Experience
Software Developer — Some Company (2021–2024)
Responsible for building web applications using React and Node.js.
Worked on database migrations and helped with API development.
Participated in code reviews and assisted in deployments.

Skills
JavaScript, React, SQL, Git

Education
Computer Science degree
`;

const WEAK_RESUME = `
I am a passionate team player and hard worker who is results driven and self motivated.
I have exposure to various technologies and am familiar with web development.
Duties included helping with projects and participating in meetings.
I am an excellent communicator and detail oriented individual.
`;

const JD = `
We are looking for a Software Engineer with experience in TypeScript, React, Node.js,
PostgreSQL, AWS, and Docker. You will design and build scalable microservices,
optimize database performance, and mentor junior engineers. CI/CD experience required.
Experience with Kubernetes is a plus. Must have strong communication and collaboration skills.
`;

export function runSmokeTest() {
  console.log("\n=== RESUMEPRO SCORING SMOKE TEST ===\n");

  const results = [
    { label: "STRONG", resume: STRONG_RESUME },
    { label: "MEDIUM", resume: MEDIUM_RESUME },
    { label: "WEAK",   resume: WEAK_RESUME },
  ];

  for (const { label, resume } of results) {
    const result = scoreResume(resume, JD);
    console.log(`--- ${label} ---`);
    console.log(`ATS Score: ${result.ats_score}/100`);
    console.log(`Breakdown:`, result.score_breakdown);
    console.log(`Keywords matched: ${result.keywords_matched.length}`);
    console.log(`Keywords missing: ${result.keywords_missing.map((k) => k.keyword).join(", ")}`);
    console.log(`Red flags: ${result.red_flags.length}`);
    result.red_flags.forEach((f) => console.log(`  [${f.severity}] ${f.message}`));
    console.log();
  }
}

runSmokeTest();
