import { useEffect, useState, type FormEvent } from "react";
import "./App.css";

const API = "http://localhost:5000";

type Section =
  | "Overview"
  | "My Skills"
  | "Learning Roadmap"
  | "EduTube Learning"
  | "Coding Practice"
  | "GitHub Intelligence"
  | "Resume AI"
  | "My Portfolio"
  | "Smart Mentor";

type RoadmapItem = {
  title: string;
  description: string;
  status: string;
};

type Skill = {
  name: string;
  level: number;
  color: string;
};

const navigation: { name: Section; icon: string }[] = [
  { name: "Overview", icon: "⌂" },
  { name: "My Skills", icon: "◈" },
  { name: "Learning Roadmap", icon: "☷" },
  { name: "EduTube Learning", icon: "▷" },
  { name: "Coding Practice", icon: "</>" },
  { name: "GitHub Intelligence", icon: "⌘" },
  { name: "Resume AI", icon: "▤" },
  { name: "My Portfolio", icon: "▣" },
  { name: "Smart Mentor", icon: "✧" },
];

const initialSkills: Skill[] = [
  { name: "React", level: 75, color: "#3478f6" },
  { name: "JavaScript", level: 82, color: "#f3ad42" },
  { name: "Node.js", level: 48, color: "#24ad80" },
  { name: "Python", level: 65, color: "#9272e8" },
];

const initialRoadmap: RoadmapItem[] = [
  {
    title: "JavaScript Fundamentals",
    description: "Variables, functions, arrays, objects and ES6",
    status: "In Progress",
  },
  {
    title: "React Development",
    description: "Components, props, state and hooks",
    status: "Upcoming",
  },
  {
    title: "Backend Development",
    description: "Node.js, Express and REST APIs",
    status: "Upcoming",
  },
  {
    title: "Database Management",
    description: "SQL, MySQL and MongoDB fundamentals",
    status: "Upcoming",
  },
  {
    title: "Build Real-Time Projects",
    description: "Apply your skills in practical projects",
    status: "Upcoming",
  },
];

const codingQuestions = [
  {
    title: "Reverse a String",
    difficulty: "Easy",
    description: "Write a function that reverses a string.",
    example: 'Input: "hello" → Output: "olleh"',
    answer: "olleh",
  },
  {
    title: "Even or Odd",
    difficulty: "Easy",
    description: "Determine whether a number is even or odd.",
    example: "Input: 7 → Output: Odd",
    answer: "odd",
  },
  {
    title: "Find the Maximum",
    difficulty: "Easy",
    description: "Find the largest number in an array.",
    example: "Input: [3, 8, 2] → Output: 8",
    answer: "8",
  },
  {
    title: "Palindrome Check",
    difficulty: "Medium",
    description: "Check whether a word reads the same backward.",
    example: 'Input: "madam" → Output: true',
    answer: "true",
  },
  {
    title: "Factorial",
    difficulty: "Medium",
    description: "Calculate the factorial of a non-negative integer.",
    example: "Input: 5 → Output: 120",
    answer: "120",
  },
  {
    title: "Prime Number",
    difficulty: "Medium",
    description: "Check whether a number is prime.",
    example: "Input: 7 → Output: true",
    answer: "true",
  },
  {
    title: "Fibonacci Number",
    difficulty: "Medium",
    description: "Return the nth Fibonacci number, with F(0) = 0.",
    example: "Input: 6 → Output: 8",
    answer: "8",
  },
  {
    title: "Sum of Array",
    difficulty: "Easy",
    description: "Calculate the sum of all numbers in an array.",
    example: "Input: [1, 2, 3] → Output: 6",
    answer: "6",
  },
  {
    title: "Remove Duplicates",
    difficulty: "Hard",
    description: "Return an array containing unique values.",
    example: "Input: [1, 1, 2] → Output: [1, 2]",
    answer: "[1,2]",
  },
  {
    title: "Count Vowels",
    difficulty: "Easy",
    description: "Count the vowels in a word or sentence.",
    example: 'Input: "hello" → Output: 2',
    answer: "2",
  },
];

const learningResources = [
  {
    title: "HTML and CSS",
    description: "Learn web page structure, styling and responsive layouts.",
    query: "HTML CSS full course for beginners",
  },
  {
    title: "JavaScript",
    description: "Understand functions, arrays, objects and DOM concepts.",
    query: "JavaScript full course for beginners",
  },
  {
    title: "React",
    description: "Learn components, props, state and React hooks.",
    query: "React JS full course for beginners",
  },
  {
    title: "Java Programming",
    description: "Practice Java syntax, OOP concepts and problem solving.",
    query: "Java programming full course for beginners",
  },
  {
    title: "Python",
    description: "Start with Python variables, loops, functions and collections.",
    query: "Python full course for beginners",
  },
  {
    title: "SQL and Databases",
    description: "Learn SQL queries, tables, joins and database concepts.",
    query: "SQL full course for beginners",
  },
];

function App() {
  const [activeSection, setActiveSection] = useState<Section>("Overview");
  const [apiStatus, setApiStatus] = useState("Checking...");
  const [apiMessage, setApiMessage] = useState("");

  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>(initialRoadmap);

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeResult, setResumeResult] = useState<any>(null);
  const [resumeError, setResumeError] = useState("");
  const [resumeLoading, setResumeLoading] = useState(false);

  const [difficulty, setDifficulty] = useState("All");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checkedAnswers, setCheckedAnswers] = useState<Record<number, boolean>>(
    {}
  );

  const [codeLanguage, setCodeLanguage] = useState("Java");

  const [assessmentResults, setAssessmentResults] = useState<
    Record<number, string>
    >({});

  const [assessmentLoading, setAssessmentLoading] = useState<
    Record<number, boolean>
    >({});

  const [githubUsername, setGithubUsername] = useState("");
  const [githubMessage, setGithubMessage] = useState("");

  const [portfolioName, setPortfolioName] = useState("Student User");
  const [portfolioRole, setPortfolioRole] = useState("Aspiring Software Developer");
  const [portfolioAbout, setPortfolioAbout] = useState(
    "I am learning software development and building projects to improve my technical skills."
  );

  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { role: string; text: string }[]
  >([
    {
      role: "Smart Mentor",
      text: "Hello! Ask me about programming, projects, interview preparation or your learning roadmap.",
    },
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    async function checkBackend() {
      try {
        const response = await fetch(`${API}/api`);

        if (!response.ok) {
          throw new Error("Backend request failed");
        }

        const data = await response.json();

        setApiStatus("running");
        setApiMessage(data.message || "Backend connected successfully.");
      } catch {
        setApiStatus("offline");
        setApiMessage(
          "Start your backend server to connect Smart Skill Hub."
        );
      }
    }

    checkBackend();
  }, []);

  const completedRoadmap = roadmap.filter(
    (item) => item.status === "Completed"
  ).length;

  const readiness = Math.round((completedRoadmap / roadmap.length) * 100);

  function updateRoadmap(index: number, status: string) {
    const updated = roadmap.map((item, i) =>
      i === index ? { ...item, status } : item
    );

    setRoadmap(updated);

    fetch(`${API}/api/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roadmap: updated,
        completed: updated.filter((item) => item.status === "Completed").length,
      }),
    }).catch(() => {
      // The roadmap remains updated in the current page if the API is unavailable.
    });
  }

  async function analyzeResume(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!resumeFile) {
      setResumeError("Please select a resume file first.");
      return;
    }

    const allowedExtensions = [".pdf", ".docx"];
    const validExtension = allowedExtensions.some((extension) =>
      resumeFile.name.toLowerCase().endsWith(extension)
    );

    if (!validExtension) {
      setResumeError("Please upload a PDF or DOCX file.");
      return;
    }

    if (resumeFile.size > 5 * 1024 * 1024) {
      setResumeError("Your resume must be smaller than 5 MB.");
      return;
    }

    setResumeLoading(true);
    setResumeError("");
    setResumeResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);

      const response = await fetch(`${API}/api/resume/analyze`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Resume analysis failed.");
      }

      setResumeResult(data);
    } catch (error) {
      setResumeError(
        error instanceof Error
          ? error.message
          : "Could not analyze your resume. Check the backend server."
      );
    } finally {
      setResumeLoading(false);
    }
  }

  function checkAnswer(index: number) {
    setCheckedAnswers((previous) => ({
      ...previous,
      [index]: true,
    }));
  }

  async function assessCode(index: number) {
  const studentCode = answers[index]?.trim();

  if (!studentCode) {
    setAssessmentResults((previous) => ({
      ...previous,
      [index]: "Please enter your code first.",
    }));
    return;
  }

  setAssessmentLoading((previous) => ({
    ...previous,
    [index]: true,
  }));

  setAssessmentResults((previous) => ({
    ...previous,
    [index]: "",
  }));

  try {
    const question = codingQuestions[index];

    const response = await fetch(`${API}/api/code-assessment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: question.title,
        description: question.description,
        example: question.example,
        language: codeLanguage,
        code: studentCode,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Assessment failed.");
    }

    setAssessmentResults((previous) => ({
      ...previous,
      [index]: data.reply,
    }));
  } catch (error) {
    setAssessmentResults((previous) => ({
      ...previous,
      [index]:
        error instanceof Error
          ? error.message
          : "Could not assess your code.",
    }));
  } finally {
    setAssessmentLoading((previous) => ({
      ...previous,
      [index]: false,
    }));
  }
}

  async function askMentor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const question = chatInput.trim();

    if (!question || chatLoading) return;

    setChatMessages((previous) => [
      ...previous,
      { role: "You", text: question },
    ]);

    setChatInput("");
    setChatLoading(true);

    try {
      const response = await fetch(`${API}/api/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Mentor request failed.");
      }

      const reply =
        data.reply ||
        data.response ||
        data.message ||
        "The mentor returned a response without text.";

      setChatMessages((previous) => [
        ...previous,
        { role: "Smart Mentor", text: String(reply) },
      ]);
    } catch (error) {
      setChatMessages((previous) => [
        ...previous,
        {
          role: "Smart Mentor",
          text:
            error instanceof Error
              ? error.message
              : "Could not connect to Smart Mentor. Check the backend.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  function renderOverview() {
    return (
      <>
        <section className="welcome-banner">
          <div className="welcome-copy">
            <span className="welcome-tag">CAREER DEVELOPMENT WORKSPACE</span>
            <h2>Build skills. Shape your future.</h2>
            <p>
              Learn new technologies, practice coding, improve your resume and
              prepare for your dream career.
            </p>
            <button
              className="primary-button"
              onClick={() => setActiveSection("Learning Roadmap")}
            >
              Explore Learning Roadmap <span>→</span>
            </button>
          </div>

          <div className="banner-art" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit-core">✧</div>
            <div className="floating-card floating-one">✦ Learn</div>
            <div className="floating-card floating-two">✓ Grow</div>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-heading">
              <span className="stat-icon purple">◈</span>
              <span className="stat-caption">TECHNICAL SKILLS</span>
            </div>
            <h3>{skills.length} Skills</h3>
            <p>Track your current skills</p>
            <a
              href="#skills"
              onClick={(event) => {
                event.preventDefault();
                setActiveSection("My Skills");
              }}
            >
              View skills →
            </a>
          </div>

          <div className="stat-card">
            <div className="stat-heading">
              <span className="stat-icon blue">☷</span>
              <span className="stat-caption">LEARNING JOURNEY</span>
            </div>
            <h3>
              {completedRoadmap}/{roadmap.length}
            </h3>
            <p>Roadmap stages completed</p>
            <a
              href="#roadmap"
              onClick={(event) => {
                event.preventDefault();
                setActiveSection("Learning Roadmap");
              }}
            >
              View roadmap →
            </a>
          </div>

          <div className="stat-card">
            <div className="stat-heading">
              <span className="stat-icon green">✓</span>
              <span className="stat-caption">CAREER READINESS</span>
            </div>
            <h3>{readiness}%</h3>
            <p>Based on completed roadmap stages</p>
            <a
              href="#readiness"
              onClick={(event) => {
                event.preventDefault();
                setActiveSection("Learning Roadmap");
              }}
            >
              Track progress →
            </a>
          </div>

          <div className="stat-card">
            <div className="stat-heading">
              <span className="stat-icon orange">⌘</span>
              <span className="stat-caption">BACKEND STATUS</span>
            </div>
            <h3>{apiStatus === "running" ? "Connected" : apiStatus}</h3>
            <p>{apiMessage}</p>
          </div>
        </section>

        <div className="content-grid">
          <section className="panel skills-panel" id="skills">
            <div className="section-heading">
              <div>
                <p className="eyebrow">YOUR DEVELOPMENT</p>
                <h2>Skill Overview</h2>
              </div>
              <a
                href="#all-skills"
                onClick={(event) => {
                  event.preventDefault();
                  setActiveSection("My Skills");
                }}
              >
                View all →
              </a>
            </div>

            <p className="muted">
              Sample skill levels. You can update these in My Skills.
            </p>

            <div className="skill-list">
              {skills.map((skill) => (
                <div className="skill-row" key={skill.name}>
                  <div className="skill-label">
                    <strong>{skill.name}</strong>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${skill.level}%`,
                        background: skill.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel readiness-panel" id="readiness">
            <p className="eyebrow">YOUR PROGRESS</p>
            <h2>Career Readiness</h2>
            <div className="readiness-circle">
              <div>
                <strong>{readiness}%</strong>
                <span>Roadmap complete</span>
              </div>
            </div>
            <p className="muted center-text">
              Complete roadmap stages to track your learning progress.
            </p>
            <button
              className="secondary-button"
              onClick={() => setActiveSection("Learning Roadmap")}
            >
              Continue Learning →
            </button>
          </section>
        </div>

        {renderRoadmap(true)}
      </>
    );
  }

  function renderSkills() {
    return (
      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">TECHNICAL DEVELOPMENT</p>
            <h2>My Skills</h2>
          </div>
        </div>

        <p className="muted">
          Adjust your skill percentages as you learn. These values are currently
          maintained in this page's state.
        </p>

        <div className="skill-list">
          {skills.map((skill, index) => (
            <div className="skill-row" key={skill.name}>
              <div className="skill-label">
                <strong>{skill.name}</strong>
                <span>{skill.level}%</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${skill.level}%`,
                    background: skill.color,
                  }}
                />
              </div>
              <input
                aria-label={`${skill.name} skill level`}
                type="range"
                min="0"
                max="100"
                value={skill.level}
                onChange={(event) => {
                  const updated = [...skills];
                  updated[index] = {
                    ...skill,
                    level: Number(event.target.value),
                  };
                  setSkills(updated);
                }}
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  function renderRoadmap(compact = false) {
    return (
      <section className="panel roadmap-panel" id="roadmap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">PERSONALIZED LEARNING</p>
            <h2>Learning Roadmap</h2>
          </div>
          <span className="roadmap-count">
            {completedRoadmap} / {roadmap.length} Completed
          </span>
        </div>

        {!compact && (
          <p className="muted">
            Update each stage as you progress through your learning journey.
          </p>
        )}

        <div className="roadmap-list">
          {roadmap.map((item, index) => (
            <div className="roadmap-item" key={item.title}>
              <div className="roadmap-number">{index + 1}</div>
              <div className="roadmap-info">
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>
              <select
                aria-label={`Status for ${item.title}`}
                value={item.status}
                onChange={(event) =>
                  updateRoadmap(index, event.target.value)
                }
              >
                <option>Upcoming</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
          ))}
        </div>
      </section>
    );
  }

  function renderEduTube() {
    return (
      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">LEARN AT YOUR OWN PACE</p>
            <h2>EduTube Learning</h2>
          </div>
        </div>

        <p className="muted">
          Find educational videos for the technologies you want to learn.
        </p>

        <div className="resource-grid">
          {learningResources.map((resource) => (
            <article className="resource-card" key={resource.title}>
              <h3>{resource.title}</h3>
              <p>{resource.description}</p>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                  resource.query
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                Find videos on YouTube ↗
              </a>
            </article>
          ))}
        </div>
      </section>
    );
  }

  function renderCodingPractice() {
    const filteredQuestions =
      difficulty === "All"
        ? codingQuestions
        : codingQuestions.filter(
            (question) => question.difficulty === difficulty
          );

    return (
      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">PRACTICE AND IMPROVE</p>
            <h2>Coding Practice</h2>
          </div>
        </div>

        <p className="muted">
          Read each question, enter your answer and check it against the sample
          answer. These are practice checks, not code execution.
        </p>

        <div className="difficulty-filters">
          {["All", "Easy", "Medium", "Hard"].map((level) => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              style={
                difficulty === level
                  ? { background: "#2563eb", color: "#fff" }
                  : undefined
              }
            >
              {level}
            </button>
          ))}
        </div>

        <div className="resource-grid">
          {filteredQuestions.map((question) => {
            const index = codingQuestions.indexOf(question);
            const correct = checkedAnswers[index];

            return (
              <article className="resource-card" key={question.title}>
                <span className="stat-caption">{question.difficulty}</span>
                <h3>{question.title}</h3>
                <p>{question.description}</p>
                <p>{question.example}</p>

                <label htmlFor={`answer-${index}`}>Your answer</label>
                <input
                  id={`answer-${index}`}
                  type="text"
                  placeholder="Enter your answer"
                  value={answers[index] || ""}
                  onChange={(event) => {
                    setAnswers((previous) => ({
                      ...previous,
                      [index]: event.target.value,
                    }));
                    setCheckedAnswers((previous) => ({
                      ...previous,
                      [index]: false,
                    }));
                  }}
                />

                <button onClick={() => checkAnswer(index)}>
                  Check Answer
                </button>

                {correct && (
                  <p>
                    {answers[index]?.trim().toLowerCase().replace(/\s/g, "") ===
                    question.answer.toLowerCase().replace(/\s/g, "")
                      ? "Correct! Well done."
                      : `Not quite. Sample answer: ${question.answer}`}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </section>
    );
  }

  function renderGithub() {
    return (
      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">DEVELOPER PROFILE</p>
            <h2>GitHub Intelligence</h2>
          </div>
        </div>

        <p className="muted">
          Enter your GitHub username to view your public profile and
          repositories. This section uses GitHub's public API.
        </p>

        <form
          onSubmit={async (event) => {
            event.preventDefault();

            const username = githubUsername.trim();

            if (!username) {
              setGithubMessage("Please enter a GitHub username.");
              return;
            }

            setGithubMessage("Loading GitHub profile...");

            try {
              const response = await fetch(
                `https://api.github.com/users/${encodeURIComponent(username)}`
              );

              if (!response.ok) {
                throw new Error("GitHub user not found.");
              }

              const profile = await response.json();

              setGithubMessage(
                `${profile.name || profile.login}\n` +
                  `Public repositories: ${profile.public_repos}\n` +
                  `Followers: ${profile.followers}\n` +
                  `Following: ${profile.following}\n` +
                  `Profile: ${profile.html_url}`
              );
            } catch (error) {
              setGithubMessage(
                error instanceof Error
                  ? error.message
                  : "Could not load the GitHub profile."
              );
            }
          }}
        >
          <label htmlFor="github-username">GitHub username</label>
          <input
            id="github-username"
            type="text"
            value={githubUsername}
            onChange={(event) => setGithubUsername(event.target.value)}
            placeholder="Enter your GitHub username"
          />
          <button type="submit">View Profile</button>
        </form>

        {githubMessage && (
          <pre className="github-result">{githubMessage}</pre>
        )}

        {githubUsername.trim() && (
          <p>
            <a
              href={`https://github.com/${encodeURIComponent(
                githubUsername.trim()
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              Open GitHub profile ↗
            </a>
          </p>
        )}
      </section>
    );
  }

  function renderResumeAI() {
    return (
      <>
        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">CAREER DOCUMENTS</p>
              <h2>Resume AI</h2>
            </div>
          </div>

          <p className="muted">
            Upload a PDF or DOCX resume to request analysis from your backend.
            Maximum file size: 5 MB.
          </p>

          <form className="resume-upload" onSubmit={analyzeResume}>
            <label htmlFor="resume-file">Choose your resume</label>
            <input
              id="resume-file"
              type="file"
              accept=".pdf,.docx"
              onChange={(event) => {
                setResumeFile(event.target.files?.[0] || null);
                setResumeError("");
                setResumeResult(null);
              }}
            />

            {resumeFile && (
              <p className="muted">
                Selected file: {resumeFile.name}
              </p>
            )}

            <button className="secondary-button" type="submit" disabled={resumeLoading}>
              {resumeLoading ? "Analyzing..." : "Analyze Resume"}
            </button>
          </form>

          {resumeError && <p className="resume-error">{resumeError}</p>}

          {resumeResult && (
            <div className="resume-results">
              <h3>Resume Analysis Results</h3>

              <pre>{JSON.stringify(resumeResult, null, 2)}</pre>
            </div>
          )}
        </section>

        <section className="panel" style={{ marginTop: 16 }}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">SKILL DEVELOPMENT</p>
              <h2>Skill Progress Tracker</h2>
            </div>
          </div>

          <p className="muted">
            Use the roadmap to keep track of skills you want to improve.
          </p>

          {["SQL and MySQL", "JDBC", "Spring Boot", "React", "Git and GitHub"].map(
            (name) => (
              <div className="progress-skill" key={name}>
                <div className="progress-skill-info">
                  <label>{name}</label>
                  <span className="progress-status">
                    Add this skill to your learning roadmap.
                  </span>
                </div>
                <a
                  href="#roadmap"
                  onClick={(event) => {
                    event.preventDefault();
                    setActiveSection("Learning Roadmap");
                  }}
                >
                  View roadmap →
                </a>
              </div>
            )
          )}
        </section>
      </>
    );
  }

  function renderPortfolio() {
    return (
      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR PROFESSIONAL IDENTITY</p>
            <h2>My Portfolio</h2>
          </div>
        </div>

        <p className="muted">
          Fill in your details to preview a simple portfolio introduction.
          This preview is not saved to a database.
        </p>

        <form
          className="resume-upload"
          onSubmit={(event) => event.preventDefault()}
        >
          <label htmlFor="portfolio-name">Your name</label>
          <input
            id="portfolio-name"
            type="text"
            value={portfolioName}
            onChange={(event) => setPortfolioName(event.target.value)}
          />

          <label htmlFor="portfolio-role">Career goal</label>
          <input
            id="portfolio-role"
            type="text"
            value={portfolioRole}
            onChange={(event) => setPortfolioRole(event.target.value)}
          />

          <label htmlFor="portfolio-about">About you</label>
          <textarea
            id="portfolio-about"
            rows={4}
            value={portfolioAbout}
            onChange={(event) => setPortfolioAbout(event.target.value)}
          />
        </form>

        <div className="resume-results">
          <p className="eyebrow">PORTFOLIO PREVIEW</p>
          <h3>{portfolioName || "Your Name"}</h3>
          <p>{portfolioRole || "Your Career Goal"}</p>
          <p>{portfolioAbout || "Write a short introduction about yourself."}</p>
          <button
            className="secondary-button"
            onClick={() =>
              navigator.clipboard
                .writeText(
                  `${portfolioName}\n${portfolioRole}\n\n${portfolioAbout}`
                )
                .catch(() => {
                  window.alert("Clipboard access is unavailable in this browser.");
                })
            }
          >
            Copy Portfolio Text
          </button>
        </div>
      </section>
    );
  }

  function renderSmartMentor() {
    return (
      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR LEARNING ASSISTANT</p>
            <h2>Smart Mentor</h2>
          </div>
        </div>

        <p className="muted">
          Ask questions about programming, projects, learning plans and
          interview preparation.
        </p>

        <div className="chatbot-container">
          <div className="chatbot-messages" aria-live="polite">
            {chatMessages.map((message, index) => (
              <p key={`${message.role}-${index}`}>
                <strong>{message.role}:</strong> {message.text}
              </p>
            ))}

            {chatLoading && <p>Smart Mentor is thinking...</p>}
          </div>

          <form onSubmit={askMentor}>
            <input
              type="text"
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              placeholder="Ask your question..."
              aria-label="Ask Smart Mentor"
            />
            <button type="submit" disabled={chatLoading}>
              {chatLoading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </section>
    );
  }

  function renderActivePage() {
    switch (activeSection) {
      case "Overview":
        return renderOverview();
      case "My Skills":
        return renderSkills();
      case "Learning Roadmap":
        return renderRoadmap();
      case "EduTube Learning":
        return renderEduTube();
      case "Coding Practice":
        return renderCodingPractice();
      case "GitHub Intelligence":
        return renderGithub();
      case "Resume AI":
        return renderResumeAI();
      case "My Portfolio":
        return renderPortfolio();
      case "Smart Mentor":
        return renderSmartMentor();
      default:
        return renderOverview();
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">S</div>
          <div>
            <h2>Smart Skill Hub</h2>
            <p>CAREER DEVELOPMENT</p>
          </div>
        </div>

        <p className="nav-label">WORKSPACE</p>

        <nav className="navigation">
          {navigation.map((item) => (
            <button
              key={item.name}
              className={`nav-item ${
                activeSection === item.name ? "active" : ""
              }`}
              onClick={() => setActiveSection(item.name)}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">✧</div>
            <strong>Need help learning?</strong>
            <p>Ask Smart Mentor for help with your learning journey.</p>
            <button
              className="secondary-button"
              onClick={() => setActiveSection("Smart Mentor")}
            >
              Ask Smart Mentor →
            </button>
          </div>

          <div className="user-mini">
            <div className="avatar">S</div>
            <div>
              <strong>Student User</strong>
              <p>Career Explorer</p>
            </div>
          </div>
        </div>
      </aside>
      

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">SMART SKILL HUB / WORKSPACE</p>
            <h1>{activeSection}</h1>
            <p>Track your learning and build your future.</p>
          </div>

          <div className="topbar-right">
            <span className="date-label">
              Backend: {apiStatus}
            </span>
            <button
              className="profile-button"
              title="Open My Portfolio"
              onClick={() => setActiveSection("My Portfolio")}
            >
              S
            </button>
          </div>
        </header>

        {renderActivePage()}

        <footer className="page-footer">
          SMART SKILL HUB <span>•</span> LEARN <span>•</span> PRACTICE{" "}
          <span>•</span> GROW
        </footer>
      </main>
    </div>
  );
}

export default App;