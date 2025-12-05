import React, { useState, useEffect } from "react";
import {
  Brain,
  Target,
  Coffee,
  CheckCircle,
  Upload,
  BookOpen,
  Shield,
} from "lucide-react";

const SkillBridgeApp = () => {
  const [stage, setStage] = useState("upload");
  const [activeView, setActiveView] = useState("dashboard");
  const [userData, setUserData] = useState(null);
  const [selectedCareerPath, setSelectedCareerPath] = useState(null);
  const [expandAnimation, setExpandAnimation] = useState(0);
  const [hoveredPath, setHoveredPath] = useState(null);
  const [fps, setFps] = useState(22);
const [completedNodes, setCompletedNodes] = useState([]);


  const [showCognitiveBreak, setShowCognitiveBreak] = useState(false);
  const [simulationActive, setSimulationActive] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [selectedSkillNode, setSelectedSkillNode] = useState(null);

    const trainingLibrary = {
    "AI Collaboration & Prompt Engineering": {
      tagline: "Turn AI into your smartest collaborator, not a black box.",
      outcomes: [
        "Write structured prompts that give you predictable results.",
        "Use AI to break big problems into smaller steps.",
        "Know when NOT to trust the model and how to debug outputs.",
      ],
      microLesson: [
        "Start each prompt with: role + goal + constraints (e.g. 'You are a fintech PM. Your goal is…').",
        "Ask AI to think in steps: 'List your reasoning step by step before giving the final answer.'",
        "Use 'critique mode': paste your own draft and ask AI to mark strengths, gaps, and blind spots.",
      ],
      practice: [
        "Pick a current task (email, report, homework) and rewrite your prompt using role + goal + constraints.",
        "Run the same prompt 2–3 times and compare outputs. What changed? What stayed consistent?",
        "Ask AI to explain *why* it chose a specific answer. Do you agree with the reasoning?",
      ],
      reflection: [
        "Where are you currently using AI as a 'copy-paste' machine instead of a thinking partner?",
        "Which parts of your workflow could you safely offload to AI this week?",
      ],
    },
    "Digital Literacy & Data Interpretation": {
      tagline: "Read data like a second language, not a scary spreadsheet.",
      outcomes: [
        "Recognize basic chart types and what they’re good for.",
        "Spot red flags: missing context, small samples, misleading axes.",
        "Turn raw numbers into one clear takeaway sentence.",
      ],
      microLesson: [
        "Whenever you see a chart, ask: *What’s on the x-axis? What’s on the y-axis? What’s the main trend?*",
        "Check the sample: *How many? From when? From where?* before trusting a conclusion.",
        "Practice writing one-sentence insights: 'Compared to __, __ increased/decreased by __%.'",
      ],
      practice: [
        "Grab any dashboard or chart you already have (school, work, project) and write 3 one-sentence insights.",
        "Ask AI: 'Explain this chart to a 10-year-old' and check if it matches your own explanation.",
        "Take a table of raw numbers and sketch how you’d visualize it (bar, line, scatter?).",
      ],
      reflection: [
        "When was the last time you accepted a number without questioning it?",
        "Which metric actually matters most in your current project—and are you tracking it?",
      ],
    },
    "Automation Tool Integration": {
      tagline: "Free your brain from repetitive work so it can do real thinking.",
      outcomes: [
        "Identify tasks that are repetitive, rule-based, and automatable.",
        "Break a workflow into clear steps that a tool could follow.",
        "Design a simple 'human in the loop' check before automation runs fully solo.",
      ],
      microLesson: [
        "List 5 tasks you do weekly that feel boring or repetitive.",
        "For one task, write the steps as if you were explaining it to an intern.",
        "Map each step to: 'manual', 'semi-automated', or 'fully automatable'.",
      ],
      practice: [
        "Use a basic tool (e.g., spreadsheet formula, Zapier/Make, keyboard macro) to automate *one* step.",
        "Ask AI: 'Given this process, what tools could help me automate 30–50% of it?'",
        "Run a small pilot on just a subset of data and review the outputs manually.",
      ],
      reflection: [
        "If you had 2 extra hours a week, what higher-value work would you do?",
        "What’s one automation you could ship in the next 7 days?",
      ],
    },
    "Critical Thinking / AI Output Evaluation": {
      tagline: "Don’t just accept AI answers—interrogate them.",
      outcomes: [
        "Use simple checks to detect hallucinations or weak logic.",
        "Compare multiple options instead of trusting the first answer.",
        "Ask better follow-ups that sharpen quality.",
      ],
      microLesson: [
        "Use the '3Cs' on any AI output: *Correct? Complete? Context-aware?*",
        "Ask AI to argue against itself: 'Give me reasons why this answer might be wrong.'",
        "Cross-check key facts with at least one external source when stakes are high.",
      ],
      practice: [
        "Take an AI answer you already used this week and run the 3Cs on it.",
        "Ask for two alternative solutions and compare pros/cons in a table.",
        "Have AI explain its answer using a different mental model (e.g., analogy, step-by-step, flow-chart).",
      ],
      reflection: [
        "Where are you most tempted to 'copy-paste and pray' with AI?",
        "What’s one rule you can adopt for high-stakes decisions (e.g., never act without external verification)?",
      ],
    },
    "Adaptability & Learning Agility": {
      tagline: "Become the person who updates faster than the tools do.",
      outcomes: [
        "Build a simple personal learning loop around new tools/skills.",
        "Get comfortable being 'bad at something' for a short, focused period.",
        "Turn new changes at work/school into experiments, not threats.",
      ],
      microLesson: [
        "Keep a 'learning backlog': a list of 5–10 skills you might want, ranked by impact.",
        "Use 3-phase learning: *Explore (1–2h) → Practice (3–5 reps) → Reflect (What stuck? What didn’t?).*",
        "Treat every new tool like a mini-project with a clear 'success criteria' you define in advance.",
      ],
      practice: [
        "Pick one micro-skill (e.g., a specific Excel function, Python library, or AI feature) and schedule 45 minutes for it.",
        "Ask AI to create a 3-day micro-curriculum with tiny daily exercises.",
        "After trying something new, write a 3-line retro: What worked? What failed? What will I change next time?",
      ],
      reflection: [
        "When did you last willingly step into a situation where you might fail publicly?",
        "How do you currently react when a tool or process suddenly changes?",
      ],
    },
    "Empathy & Communication": {
      tagline: "Translate between people, not just between systems.",
      outcomes: [
        "Listen for goals, fears, and constraints—not just words.",
        "Tailor your message to different audiences (execs, peers, users).",
        "Use AI to rehearse difficult conversations safely.",
      ],
      microLesson: [
        "When someone talks, mentally tag: 'goal', 'fear', 'constraint', or 'request'.",
        "Before sending a message, add a one-line 'TL;DR' at the top in plain language.",
        "Use AI to rewrite your draft for a different audience (e.g., 'rewrite for a non-technical manager').",
      ],
      practice: [
        "Take a recent message you sent and rewrite it in 3 tones: concise, supportive, and executive-summary.",
        "Role-play a tough conversation with AI as the other person, then ask for feedback on your phrasing.",
        "Ask a friend/colleague to paraphrase what they heard from you—compare it to what you *meant*.",
      ],
      reflection: [
        "Do people leave conversations with you more clear or more confused?",
        "What’s one relationship that would benefit most if your communication improved by 10%?",
      ],
    },
  };


    // % readiness for a given career path based on skills you already have
  const getPathProgress = (path) => {
    const have = (path.skillsFromCurrent || []).length;
    const need = (path.skillsNeeded || []).length;
    const total = have + need;

    if (!total) return 0; // fallback if model didn't send skills

    // 0% = none of the path skills yet, 100% = all of them
    return Math.round((have / total) * 100);
  };

    // Does the user already have this skill according to the AI?
  const hasSkillForNode = (id) => {
    if (!userData || !Array.isArray(userData.skills)) return false;

    const lower = userData.skills.map((s) => s.toLowerCase());

    const includesAny = (keywords) =>
      keywords.some((k) => lower.some((s) => s.includes(k)));

    switch (id) {
      case "ai-collab":
        return includesAny(["ai collaboration", "prompt engineering"]);
      case "digital-data":
        return includesAny(["digital literacy", "data interpretation"]);
      case "automation-tools":
        return includesAny(["automation tool integration", "automation tools"]);
      case "critical-thinking":
        return includesAny(["critical thinking", "output evaluation"]);
      case "adaptability":
        return includesAny(["adaptability", "learning agility"]);
      case "empathy":
        return includesAny(["empathy", "communication"]);
      default:
        return false;
    }
  };

  const skillNodes = [
    {
      id: "ai-collab",
      name: "AI Collaboration & Prompt Engineering",
      level: 1,
      x: 50,
      y: 150,
      value: 5,
    },
    {
      id: "digital-literacy",
      name: "Digital Literacy & Data Interpretation",
      level: 1,
      x: 50,
      y: 250,
      value: 5,
    },
    {
      id: "automation-tools",
      name: "Automation Tool Integration",
      level: 1,
      x: 50,
      y: 350,
      value: 5,
    },
    {
      id: "critical-thinking",
      name: "Critical Thinking / AI Output Evaluation",
      level: 2,
      x: 320,
      y: 200,
      value: 7,
    },
    {
      id: "adaptability",
      name: "Adaptability & Learning Agility",
      level: 2,
      x: 320,
      y: 300,
      value: 7,
    },
    {
      id: "empathy-comm",
      name: "Empathy & Communication",
      level: 3,
      x: 560,
      y: 250,
      value: 9,
    },
    // goal node will be created per-career below
  ];

  const dependencies = [
    { from: "ai-collab",        to: "critical-thinking" },
    { from: "digital-literacy", to: "critical-thinking" },
    { from: "automation-tools", to: "adaptability" },
    { from: "critical-thinking",to: "empathy-comm" },
    { from: "adaptability",     to: "empathy-comm" },
    // links from skills → goal will be added at render-time
  ];


    const scenarios = [
    {
      id: "ai-assistant-scenario",
      title: "AI Assistant in Your Daily Workflow",
      context:
        "You’ve just been given access to a powerful AI assistant in your current role.",
      initialPrompt:
        "Describe how you would use an AI assistant in your day-to-day work. Walk me through how you would: (1) prompt it effectively, (2) double-check its outputs, and (3) communicate AI-supported decisions to your team.",
      skillNode: "ai-collab",
      systemPrompt:
        "You are a senior manager assessing how well they use AI tools. Evaluate their answer across: AI Collaboration & Prompt Engineering, Critical Thinking / AI Output Evaluation, and Empathy & Communication. Provide constructive, skill-based feedback.",
    },
  ];


  // ------------- API RESPONSE → FRONTEND SHAPE -------------

  const mapApiResponseToUserData = (api) => {
    console.log("API raw payload from /api/analyze-resume:", api);

    const name = api.candidateName || api.name || "";
    const currentRole = api.currentRole || api.role || "";
    const automationRisk =
      api.automationRisk !== undefined ? api.automationRisk : null;
    const skills =
      api.skillsExtracted || api.skills || api.topSkills || [];

    const rawPaths =
      api.careerIdeas ||
      api.careerPaths ||
      api.career_paths ||
      api.paths ||
      [];

    const colors = ["#818cf8", "#10b981", "#c084fc", "#fbbf24"];

    const careerPaths = rawPaths.map((idea, idx) => ({
      id: idea.id || `path-${idx}`,
      title: idea.title || `Path ${idx + 1}`,
      type: idea.type,
      description: idea.description || "",
      automationRisk:
        idea.automationRisk !== undefined
          ? idea.automationRisk
          : null,
      salaryIncrease: idea.salaryChange || "",
      timeToTransition: idea.timeToTransition || "",
      skillsNeeded: idea.skillsToAdd || [],
      skillsFromCurrent: idea.skillsFromCurrent || [],
      demandScore:
        idea.demandScore !== undefined ? idea.demandScore : null,
      color: idea.color || colors[idx % colors.length],
    }));

    return {
      name,
      currentRole,
      automationRisk,
      skills,
      careerPaths,
    };
  };

  // ------------- UPLOAD + CALL /api/analyze-resume -----------

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // simple progress animation
    setStage("expanding");
    setExpandAnimation(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 3;
      setExpandAnimation((prev) =>
        prev >= 100 ? 100 : progress
      );
    }, 60);

    try {
      const resumeText = await file.text();

      const res = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const apiData = await res.json();
      console.log("Frontend got from /api/analyze-resume:", apiData);

      const mapped = mapApiResponseToUserData(apiData);
      setUserData(mapped);

      // simple FPS logic based on automation risk
      if (mapped.automationRisk != null) {
        setFps(100 - mapped.automationRisk);
      }

      setStage("timeline");
    } catch (err) {
      console.error("Failed to analyze resume:", err);
      alert("Failed to analyze resume – check console for details.");
      setStage("upload");
    } finally {
      clearInterval(interval);
      setExpandAnimation(100);
    }
  };

  // ------------- SKILL MAP --------------

  const completeNode = (nodeId) => {
    if (!completedNodes.includes(nodeId)) {
      setCompletedNodes([...completedNodes, nodeId]);
      const node = skillNodes.find((n) => n.id === nodeId);
      if (node) {
        setFps((prev) => Math.min(100, prev + node.value));
      }
    }
  };

  // ------------- SIMULATION -------------

    useEffect(() => {
    if (!selectedCareerPath || !userData) return;

    const haveFromPath = selectedCareerPath.skillsFromCurrent || [];
    const userSkills   = userData.skills || [];

    const autoCompletedIds = skillNodes
      .filter((node) =>
        haveFromPath.includes(node.name) || userSkills.includes(node.name)
      )
      .map((n) => n.id);

    setCompletedNodes((prev) => Array.from(new Set([...prev, ...autoCompletedIds])));
  }, [selectedCareerPath, userData]);


  const startSimulation = (scenario) => {
    setSelectedScenario(scenario);
    setSimulationActive(true);
    setChatHistory([
      { role: "manager", content: scenario.initialPrompt },
    ]);
  };

  const sendMessage = async () => {
    if (!userMessage.trim()) return;
    const newHistory = [
      ...chatHistory,
      { role: "user", content: userMessage },
    ];
    setChatHistory(newHistory);
    setUserMessage("");
    setIsLoading(true);

    setTimeout(() => {
      setChatHistory([
        ...newHistory,
        {
          role: "manager",
          content:
            "Good thinking. Consider: 1) Review trading history, 2) Check insider relationships, 3) Document the flag, 4) Escalate if needed. What would you prioritize?",
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  // ------------- UI -------------

  return (
    <div className="app">
      {stage === "upload" && (
        <div className="view upload-view">
          <Brain size={80} className="brain-icon" />
          <h1>Future-Proof Your Career</h1>
          <p>
            Upload your resume and discover your butterfly effect
          </p>
          <div className="upload-box">
            <input
              type="file"
              id="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
            <label htmlFor="file">
              <Upload size={48} />
              <span>Drop resume or click to upload</span>
              <small>PDF, DOC, DOCX, TXT</small>
            </label>
          </div>
        </div>
      )}

      {stage === "expanding" && (
        <div className="view expanding-view">
          <Brain size={60} className="spin-icon" />
          <h2>
            {expandAnimation < 50
              ? "Extracting skills..."
              : "Generating career paths..."}
          </h2>
          <div className="progress">
            <div
              className="fill"
              style={{ width: `${expandAnimation}%` }}
            />
          </div>
        </div>
      )}

      {stage === "timeline" && userData && (
        <div className="timeline-view">
          <h1>
            {userData.name
              ? `${userData.name}'s Career Butterfly Effect`
              : "Your Career Butterfly Effect"}
          </h1>
          <p>
            Each path shows your journey from current skills to new
            opportunities
          </p>

          <svg
            viewBox="0 0 1600 1000"
            className="butterfly-svg"
          >
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="8" />
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle
              cx="800"
              cy="500"
              r="70"
              fill="#ef4444"
              filter="url(#glow)"
            >
              <animate
                attributeName="r"
                values="70;75;70"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
            <text
              x="800"
              y="485"
              textAnchor="middle"
              fill="#fff"
              fontSize="18"
            >
              {userData.name || "You"}
            </text>
            <text
              x="800"
              y="510"
              textAnchor="middle"
              fill="#fff"
              fontSize="24"
              fontWeight="800"
            >
              TODAY
            </text>
            <text
              x="800"
              y="540"
              textAnchor="middle"
              fill="#fff"
              fontSize="16"
            >
              {userData.currentRole || "Current role"}
            </text>
            <text
              x="800"
              y="590"
              textAnchor="middle"
              fill="rgba(255,255,255,0.8)"
              fontSize="14"
            >
              {userData.automationRisk != null
                ? `${userData.automationRisk}% Risk`
                : "Automation risk"}
            </text>

            {[
              {
                path: "M 800 480 Q 550 350 250 220",
                x: 250,
                y: 220,
                ty: 160,
              },
              {
                path: "M 800 480 Q 1050 350 1350 220",
                x: 1350,
                y: 220,
                ty: 160,
              },
              {
                path: "M 800 520 Q 550 650 250 780",
                x: 250,
                y: 780,
                ty: 840,
              },
              {
                path: "M 800 520 Q 1050 650 1350 780",
                x: 1350,
                y: 780,
                ty: 840,
              },
            ].map((pos, i) => {
              const p = userData.careerPaths?.[i];
              if (!p) return null;
              return (
                <g
                  key={p.id}
                  className={
                    hoveredPath === p.id ? "hovered" : ""
                  }
                  onMouseEnter={() => setHoveredPath(p.id)}
                  onMouseLeave={() => setHoveredPath(null)}
                  onClick={() => {
                    setSelectedCareerPath(p);
                    setStage("dashboard");
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <path
                    d={pos.path}
                    stroke={p.color}
                    strokeWidth={hoveredPath === p.id ? 6 : 4}
                    fill="none"
                    opacity={hoveredPath === p.id ? 1 : 0.7}
                  />
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    fontSize="60"
                    filter="url(#glow)"
                  >
                    🦋
                  </text>
                  <text
                    x={pos.x}
                    y={pos.ty}
                    textAnchor="middle"
                    fill={p.color}
                    fontSize="20"
                    fontWeight="700"
                  >
                    {p.title}
                  </text>
                  <text
                    x={pos.x}
                    y={pos.ty + (i < 2 ? 130 : -70)}
                    textAnchor="middle"
                    fill={p.color}
                    fontSize="15"
                  >
                    {`${getPathProgress(p)}%`}{" "}
                    {p.salaryIncrease ? `• ${p.salaryIncrease}` : ""}
                  </text>

                  <text
                    x={pos.x}
                    y={pos.ty + (i < 2 ? 150 : -90)}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.7)"
                    fontSize="13"
                  >
                    {p.timeToTransition}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="skills-section">
            <div className="current-skills">
              <h3>
                <CheckCircle size={24} /> Your Current Skills
              </h3>
              <div className="badges">
                {(userData.skills || []).map((s, i) => (
                  <div key={i} className="badge">
                    {s}
                  </div>
                ))}
              </div>
            </div>

            <div className="paths-grid">
              {(userData.careerPaths || []).map((p) => (
                <div
                  key={p.id}
                  className={`path-card ${
                    hoveredPath === p.id ? "hovered" : ""
                  }`}
                  style={{ borderColor: p.color }}
                  onMouseEnter={() => setHoveredPath(p.id)}
                  onMouseLeave={() => setHoveredPath(null)}
                  onClick={() => {
                    setSelectedCareerPath(p);
                    setStage("dashboard");
                  }}
                >
                  <div className="header">
                    <span>🦋</span>
                    <h4 style={{ color: p.color }}>{p.title}</h4>
                  </div>
                  <p>{p.description}</p>
                  <div className="timeline-info">
                    <Target size={16} />
                    <span>{p.timeToTransition}</span>
                  </div>
                  <div className="skills-match">
                    <div>
                      <strong>You Have:</strong>
                      {(p.skillsFromCurrent || [])
                        .slice(0, 2)
                        .map((s, i) => (
                          <div
                            key={i}
                            className="match have"
                          >
                            <CheckCircle size={14} />
                            {s}
                          </div>
                        ))}
                    </div>
                    <div>
                      <strong>You'll Learn:</strong>
                      {(p.skillsNeeded || [])
                        .slice(0, 2)
                        .map((s, i) => (
                          <div
                            key={i}
                            className="match need"
                          >
                            <BookOpen size={14} />
                            {s}
                          </div>
                        ))}
                    </div>
                  </div>
                  <button style={{ background: p.color }}>
                    Explore Path →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {stage === "dashboard" && selectedCareerPath && (
        <>
          {activeView === "dashboard" && (
            <div className="dashboard">
              <div className="dash-header">
                <div>
                  <h1>
                    {userData?.name
                      ? `${userData.name}'s Journey to ${selectedCareerPath.title}`
                      : `Your Journey to ${selectedCareerPath.title}`}
                  </h1>
                  <p>
                    Track your progress and build future-proof
                    skills
                  </p>
                </div>
                <button
                  className="back-btn"
                  onClick={() => setStage("timeline")}
                >
                  ← Back to Paths
                </button>
              </div>

              <div className="fps-card">
                <div className="fps-header">
                  <Shield size={32} />
                  <div>
                    <h3>Future-Proof Score</h3>
                    <div className="fps-value">
                      {fps}/100
                    </div>
                  </div>
                </div>
                <div className="fps-bar">
                  <div
                    className="fps-fill"
                    style={{
                      width: `${fps}%`,
                      background:
                        fps > 60
                          ? "#10b981"
                          : fps > 30
                          ? "#fbbf24"
                          : "#ef4444",
                    }}
                  />
                </div>
                <div className="fps-breakdown">
                  <div>
                    <span>Current Risk:</span>
                    <span>
                      {userData.automationRisk != null
                        ? `${userData.automationRisk}%`
                        : "-"}
                    </span>
                  </div>
                  <div>
                    <span>Target Risk:</span>
                    <span>
                      {selectedCareerPath.automationRisk !=
                      null
                        ? `${selectedCareerPath.automationRisk}%`
                        : "-"}
                    </span>
                  </div>
                  <div>
                    <span>Skills Progress:</span>
                    <span>
                      {completedNodes.length}/
                      {skillNodes.length}
                    </span>
                  </div>
                  <div>
                    <span>Market Demand:</span>
                    <span>High</span>
                  </div>
                </div>
              </div>

              <div className="nav-cards">
                <div
                  className="nav-card"
                  onClick={() => setActiveView("skillMap")}
                >
                  <Target size={32} />
                  <h3>Skill Dependency Map</h3>
                  <p>See your learning path</p>
                </div>
                <div
                  className="nav-card"
                  onClick={() =>
                    setActiveView("simulation")
                  }
                >
                  <Brain size={32} />
                  <h3>Practice Scenarios</h3>
                  <p>Apply skills in context</p>
                </div>
              </div>
            </div>
          )}

          {activeView === "skillMap" && selectedCareerPath && userData && (() => {
            const path = selectedCareerPath;
            const userSkills = userData.skills || [];
            const pathSkillsHave = path.skillsFromCurrent || [];
            const pathSkillsNeed = path.skillsNeeded || [];

            // Only keep nodes that matter for THIS path
            const baseNodes = skillNodes.filter((node) =>
              pathSkillsHave.includes(node.name) || pathSkillsNeed.includes(node.name)
            );

            // Work out status per node (Completed / Current / Locked)
            const nodesWithStatus = baseNodes.map((node) => {
              const alreadyHave =
                completedNodes.includes(node.id) ||
                pathSkillsHave.includes(node.name) ||
                userSkills.includes(node.name) ||
                hasSkillForNode(node.id); // extra AI-based check

              let status = "locked";
              if (alreadyHave) {
                status = "completed";
              } else if (pathSkillsNeed.includes(node.name)) {
                status = "current";
              }

              return { ...node, status };
            });

            // Create a goal node for this specific career path
            const goalNode = {
              id: "goal-node",
              name: path.title,
              x: 780,
              y: 250,
              status: "goal",
            };

            const allNodes = [...nodesWithStatus, goalNode];
            const visibleIds = new Set(allNodes.map((n) => n.id));

            // Edges between visible nodes + each skill → goal
            const visibleDeps = [
              ...dependencies,
              ...nodesWithStatus.map((n) => ({ from: n.id, to: goalNode.id })),
            ].filter(
              (dep) => visibleIds.has(dep.from) && visibleIds.has(dep.to)
            );

            const getColor = (status) => {
              if (status === "completed") return "#10b981";
              if (status === "current")   return "#818cf8";
              if (status === "goal")      return "#fbbf24";
              return "#6b7280"; // locked
            };

            return (
              <div className="skill-map">
                <div className="map-header">
                  <h2>Dynamic Skill Dependency Map</h2>
                  <button onClick={() => setActiveView("dashboard")}>
                    ← Back
                  </button>
                </div>

                <svg viewBox="0 0 900 400" className="map-svg">
                  {/* Edges */}
                  {visibleDeps.map((dep, i) => {
                    const from = allNodes.find((n) => n.id === dep.from);
                    const to   = allNodes.find((n) => n.id === dep.to);
                    if (!from || !to) return null;
                    return (
                      <line
                        key={i}
                        x1={from.x + 220}
                        y1={from.y + 20}
                        x2={to.x}
                        y2={to.y + 20}
                        stroke="rgba(129,140,248,0.3)"
                        strokeWidth="2"
                      />
                    );
                  })}

                  {/* Nodes */}
                  {allNodes.map((node) => (
                    <g
                      key={node.id}
                      onClick={() => {
                        // only skills (not goal) & not completed open training
                        if (node.id !== "goal-node" && node.status !== "completed") {
                          setSelectedSkillNode(node);
                          setActiveView("training");
                        }
                      }}
                      style={{
                        cursor:
                          node.id !== "goal-node" && node.status !== "completed"
                            ? "pointer"
                            : "default",
                      }}
                    >
                      <rect
                        x={node.x}
                        y={node.y}
                        width={node.id === "goal-node" ? 180 : 260}
                        height="40"
                        rx="8"
                        fill={getColor(node.status)}
                        opacity="0.9"
                      />
                      <text
                        x={node.x + (node.id === "goal-node" ? 90 : 130)}
                        y={node.y + 25}
                        textAnchor="middle"
                        fill="#fff"
                        fontSize="11"
                        fontWeight="600"
                      >
                        {node.name}
                      </text>
                    </g>
                  ))}
                </svg>

                <div className="map-legend">
                  <div>
                    <div style={{ background: "#10b981" }} />
                    Completed
                  </div>
                  <div>
                    <div style={{ background: "#818cf8" }} />
                    Current
                  </div>
                  <div>
                    <div style={{ background: "#6b7280" }} />
                    Locked
                  </div>
                  <div>
                    <div style={{ background: "#fbbf24" }} />
                    Goal
                  </div>
                </div>
              </div>
            );
          })()}


          {activeView === "simulation" && (
            <div className="simulation">
              <div className="sim-header">
                <h2>Contextual Skill Anchoring</h2>
                <button
                  onClick={() => setActiveView("dashboard")}
                >
                  ← Back
                </button>
              </div>

              {!simulationActive ? (
                <div className="scenarios">
                  {scenarios.map((s) => (
                    <div
                      key={s.id}
                      className="scenario-card"
                      onClick={() => startSimulation(s)}
                    >
                      <h3>{s.title}</h3>
                      <p>{s.context}</p>
                      <button>Start Scenario →</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="chat-container">
                  <div className="chat-messages">
                    {chatHistory.map((msg, i) => (
                      <div
                        key={i}
                        className={`message ${msg.role}`}
                      >
                        <strong>
                          {msg.role === "manager"
                            ? "👔 Manager"
                            : "👤 You"}
                          :
                        </strong>
                        <p>{msg.content}</p>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="message manager">
                        <p>Thinking...</p>
                      </div>
                    )}
                  </div>
                  <div className="chat-input">
                    <input
                      value={userMessage}
                      onChange={(e) =>
                        setUserMessage(e.target.value)
                      }
                      onKeyPress={(e) =>
                        e.key === "Enter" && sendMessage()
                      }
                      placeholder="Type your response..."
                    />
                    <button onClick={sendMessage}>Send</button>
                  </div>
                </div>
              )}

              {showCognitiveBreak && (
                <div className="break-modal">
                  <Coffee size={48} />
                  <h3>Take a 2-minute break?</h3>
                  <p>
                    You've been focused for 45 seconds. A short
                    break helps retention.
                  </p>
                  <button
                    onClick={() => setShowCognitiveBreak(false)}
                  >
                    Continue
                  </button>
                </div>
              )}
            </div>
          )}
                    {activeView === "training" && selectedSkillNode && (
            <div className="training">
              <div className="training-header">
                <h2>{selectedSkillNode.name} – Skill Studio</h2>
                <button onClick={() => setActiveView("skillMap")}>
                  ← Back to Map
                </button>
              </div>

              {(() => {
                const t = trainingLibrary[selectedSkillNode.name] || {
                  tagline: "Practice this skill with a focused mini-sprint.",
                  outcomes: [],
                  microLesson: [],
                  practice: [],
                  reflection: [],
                };

                return (
                  <div className="training-grid">
                    <section className="training-card">
                      <h3>Why this skill matters</h3>
                      <p className="tagline">{t.tagline}</p>
                      {t.outcomes.length > 0 && (
                        <ul>
                          {t.outcomes.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </section>

                    <section className="training-card">
                      <h3>10–15 min Micro-Lesson</h3>
                      <ol>
                        {t.microLesson.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </section>

                    <section className="training-card">
                      <h3>Try it now</h3>
                      <ul>
                        {t.practice.map((task, i) => (
                          <li key={i}>{task}</li>
                        ))}
                      </ul>
                    </section>

                    <section className="training-card">
                      <h3>Reflect & Embed</h3>
                      <ul>
                        {t.reflection.map((q, i) => (
                          <li key={i}>{q}</li>
                        ))}
                      </ul>

                      {/* Optional: mark complete */}
                      <button
                        className="complete-btn"
                        onClick={() => {
                          if (!completedNodes.includes(selectedSkillNode.id)) {
                            completeNode(selectedSkillNode.id);
                          }
                        }}
                      >
                        Mark this skill as completed
                      </button>
                    </section>
                  </div>
                );
              })()}
            </div>
          )}

        </>
      )}

      {/* your styles unchanged */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .app { font-family: 'Outfit',sans-serif; min-height:100vh; background:linear-gradient(135deg,#0f0c29,#302b63,#24243e); color:#fff; padding:2rem; }
        .view { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:80vh; text-align:center; }
        .brain-icon { color:#818cf8; margin-bottom:2rem; animation:float 3s ease-in-out infinite; }
        @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-20px); } }
        .upload-view h1 { font-size:3.5rem; font-weight:800; background:linear-gradient(135deg,#fff,#c4b5fd); -webkit-background-clip:text; -webkit-text-fill-color:transparent; margin-bottom:1rem; }
        .upload-view p { font-size:1.25rem; color:rgba(255,255,255,0.7); margin-bottom:3rem; }
        .upload-box { width:600px; }
        .upload-box label { display:flex; flex-direction:column; align-items:center; padding:4rem 2rem; background:rgba(255,255,255,0.05); border:3px dashed rgba(129,140,248,0.4); border-radius:24px; cursor:pointer; transition:all 0.4s; }
        .upload-box label:hover { border-color:rgba(129,140,248,0.8); background:rgba(129,140,248,0.1); transform:translateY(-4px); }
        .upload-box label svg { color:#818cf8; margin-bottom:1.5rem; }
        .upload-box label span { font-size:1.25rem; font-weight:600; margin-bottom:0.5rem; }
        .upload-box label small { font-size:0.9rem; color:rgba(255,255,255,0.6); }
        .spin-icon { color:#818cf8; animation:spin 2s linear infinite; margin-bottom:2rem; }
        @keyframes spin { to { transform:rotate(360deg); } }
        .expanding-view h2 { font-size:1.75rem; margin-bottom:2rem; }
        .progress { width:400px; height:8px; background:rgba(255,255,255,0.1); border-radius:4px; overflow:hidden; }
        .fill { height:100%; background:linear-gradient(90deg,#818cf8,#c084fc); transition:width 0.3s; }
        .timeline-view { max-width:1600px; margin:0 auto; }
        .timeline-view h1 { font-size:3rem; font-weight:800; text-align:center; margin-bottom:1rem; }
        .timeline-view > p { font-size:1.2rem; color:rgba(255,255,255,0.7); text-align:center; margin-bottom:3rem; }
        .butterfly-svg { width:100%; height:800px; background:rgba(255,255,255,0.02); border-radius:24px; padding:2rem; margin-bottom:3rem; }
        .butterfly-svg g path { transition:all 0.3s; }
        .butterfly-svg g.hovered path { stroke-width:8; opacity:1; filter:drop-shadow(0 0 20px currentColor); }
        .skills-section { display:grid; gap:2rem; }
        .current-skills { background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); border-radius:20px; padding:2rem; }
        .current-skills h3 { display:flex; align-items:center; gap:0.75rem; font-size:1.5rem; margin-bottom:1.5rem; color:#10b981; }
        .badges { display:flex; flex-wrap:wrap; gap:0.75rem; }
        .badge { padding:0.75rem 1.25rem; border-radius:20px; font-weight:500; background:rgba(16,185,129,0.2); border:1px solid rgba(16,185,129,0.4); color:#10b981; }
        .paths-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:2rem; }
        .path-card { background:rgba(255,255,255,0.05); border:2px solid; border-radius:20px; padding:2rem; cursor:pointer; transition:all 0.4s; }
        .path-card:hover, .path-card.hovered { transform:translateY(-8px); box-shadow:0 20px 60px rgba(0,0,0,0.5); }
        .path-card .header { display:flex; align-items:center; gap:1rem; margin-bottom:1rem; }
        .path-card .header span { font-size:2rem; }
        .path-card .header h4 { font-size:1.5rem; font-weight:700; margin: 0; }
        .path-card p { color:rgba(255,255,255,0.8); margin-bottom:1.5rem; line-height:1.6; }
        .timeline-info { display:flex; align-items:center; gap:0.5rem; padding:0.75rem 1rem; background:rgba(255,255,255,0.05); border-radius:10px; margin-bottom:1.5rem; }
        .skills-match { display:grid; gap:1rem; margin-bottom:1.5rem; }
        .skills-match strong { display:block; font-size:0.85rem; color:rgba(255,255,255,0.7); margin-bottom:0.5rem; }
        .match { display:flex; align-items:center; gap:0.5rem; font-size:0.9rem; padding:0.5rem; border-radius:8px; margin-bottom: 0.5rem; }
        .match.have { background:rgba(16,185,129,0.1); color:#10b981; }
        .match.need { background:rgba(129,140,248,0.1); color:#818cf8; }
        .path-card button { width:100%; border:none; color:#fff; padding:1rem; border-radius:12px; font-size:1rem; font-weight:600; cursor:pointer; transition:all 0.3s; }
        .path-card button:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,0.4); }
        .dashboard { max-width:1400px; margin:0 auto; }
        .dash-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:3rem; }
        .dash-header h1 { font-size:2.5rem; font-weight:800; margin-bottom:0.5rem; }
        .dash-header p { color:rgba(255,255,255,0.7); }
        .back-btn { background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); color:#fff; padding:0.75rem 1.5rem; border-radius:12px; cursor:pointer; }
        .fps-card { background:rgba(255,255,255,0.05); border:2px solid rgba(129,140,248,0.3); border-radius:24px; padding:2rem; margin-bottom:3rem; }
        .fps-header { display:flex; align-items:center; gap:1.5rem; margin-bottom:1.5rem; }
        .fps-header svg { color:#818cf8; }
        .fps-header h3 { font-size:1.5rem; margin-bottom:0.5rem; }
        .fps-value { font-size:3rem; font-weight:800; font-family:'Space Mono',monospace; color:#818cf8; }
        .fps-bar { height:20px; background:rgba(255,255,255,0.1); border-radius:10px; overflow:hidden; margin-bottom:1.5rem; }
        .fps-fill { height:100%; transition:all 0.5s; }
        .fps-breakdown { display:grid; grid-template-columns:repeat(2,1fr); gap:1rem; }
        .fps-breakdown > div { display:flex; justify-content:space-between; padding:1rem; background:rgba(255,255,255,0.05); border-radius:12px; }
        .nav-cards { display:grid; grid-template-columns:repeat(2,1fr); gap:2rem; }
        .nav-card { background:rgba(255,255,255,0.05); border:2px solid rgba(129,140,248,0.2); border-radius:20px; padding:2rem; cursor:pointer; transition:all 0.4s; text-align:center; }
        .nav-card:hover { transform:translateY(-8px); border-color:rgba(129,140,248,0.6); }
        .nav-card svg { color:#818cf8; margin:0 auto 1rem; display: block; }
        .nav-card h3 { font-size:1.5rem; margin-bottom:0.5rem; }
        .nav-card p { color:rgba(255,255,255,0.7); }
        .skill-map, .simulation { max-width:1000px; margin:0 auto; }
        .map-header, .sim-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem; }
        .map-header h2, .sim-header h2 { font-size:2rem; font-weight:700; }
        .map-header button, .sim-header button { background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); color:#fff; padding:0.75rem 1.5rem; border-radius:12px; cursor:pointer; }
        .map-svg { width:100%; height:500px; background:rgba(255,255,255,0.02); border-radius:20px; padding:2rem; margin-bottom:2rem; }
        .map-legend { display:flex; gap:2rem; justify-content:center; flex-wrap: wrap; }
        .map-legend > div { display:flex; align-items:center; gap:0.5rem; }
        .map-legend > div > div { width:20px; height:20px; border-radius:4px; }
        .scenarios { display:grid; gap:2rem; }
        .scenario-card { background:rgba(255,255,255,0.05); border:2px solid rgba(129,140,248,0.2); border-radius:20px; padding:2rem; cursor:pointer; transition:all 0.4s; }
        .scenario-card:hover { transform:translateY(-4px); border-color:rgba(129,140,248,0.6); }
        .scenario-card h3 { font-size:1.5rem; margin-bottom:1rem; }
        .scenario-card p { color:rgba(255,255,255,0.7); margin-bottom:1.5rem; }
        .scenario-card button { background:#818cf8; border:none; color:#fff; padding:0.75rem 1.5rem; border-radius:12px; cursor:pointer; }
        .chat-container { background:rgba(255,255,255,0.05); border-radius:20px; padding:2rem; }
        .chat-messages { max-height:500px; overflow-y:auto; margin-bottom:1.5rem; }
        .message { margin-bottom:1.5rem; padding:1rem; border-radius:12px; }
        .message.manager { background:rgba(129,140,248,0.1); border-left:4px solid #818cf8; }
        .message.user { background:rgba(16,185,129,0.1); border-left:4px solid #10b981; }
        .message strong { display:block; margin-bottom:0.5rem; }
        .chat-input { display:flex; gap:1rem; }
        .chat-input input { flex:1; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); color:#fff; padding:1rem; border-radius:12px; }
        .chat-input button { background:#818cf8; border:none; color:#fff; padding:1rem 2rem; border-radius:12px; cursor:pointer; }
        .break-modal { position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background:rgba(0,0,0,0.95); border:2px solid #818cf8; border-radius:24px; padding:3rem; text-align:center; z-index:1000; max-width: 500px; }
        .break-modal svg { color:#fbbf24; margin:0 auto 1.5rem; display: block; }
        .break-modal h3 { font-size:1.75rem; margin-bottom:1rem; }
        .break-modal p { color:rgba(255,255,255,0.7); margin-bottom:2rem; }
        .break-modal button { background:#818cf8; border:none; color:#fff; padding:1rem 2rem; border-radius:12px; cursor:pointer; }
        @media (max-width:1024px) { .paths-grid, .nav-cards { grid-template-columns:1fr; } }
                .training { max-width: 1100px; margin: 0 auto; }
        .training-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .training-header h2 {
          font-size: 2rem;
          font-weight: 700;
        }
        .training-header button {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: #fff;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          cursor: pointer;
        }
        .training-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1.75rem;
        }
        .training-card {
          background: rgba(255,255,255,0.05);
          border-radius: 20px;
          padding: 1.75rem;
          border: 1px solid rgba(129,140,248,0.25);
        }
        .training-card h3 {
          font-size: 1.3rem;
          margin-bottom: 0.75rem;
        }
        .training-card .tagline {
          color: rgba(255,255,255,0.8);
          margin-bottom: 0.75rem;
        }
        .training-card ul,
        .training-card ol {
          padding-left: 1.1rem;
        }
        .training-card li {
          margin-bottom: 0.5rem;
          line-height: 1.5;
        }
        .complete-btn {
          margin-top: 1rem;
          background: #10b981;
          border: none;
          color: #fff;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
        }
        @media (max-width: 900px) {
          .training-grid {
            grid-template-columns: 1fr;
          }
        }

      `}</style>
    </div>
  );
};

export default SkillBridgeApp;
