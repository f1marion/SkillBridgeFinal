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
  const [skillProgress, setSkillProgress] = useState({});
  // skillProgress structure: { [skillId]: { quickWins: [true, false, ...], challenges: [true, false, ...], project: false } }

  const [showCognitiveBreak, setShowCognitiveBreak] = useState(false);
  const [simulationActive, setSimulationActive] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [selectedSkillNode, setSelectedSkillNode] = useState(null);
  const [showMetricExplanation, setShowMetricExplanation] = useState(null);
  const [skillCategoryFilter, setSkillCategoryFilter] = useState('all');
  const [trainingContent, setTrainingContent] = useState(null);
  const [loadingTraining, setLoadingTraining] = useState(false);

  // Load progress from localStorage on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('skillBridgeProgress');
      if (saved) {
        setSkillProgress(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  }, []);

  // Save progress to localStorage whenever it changes
  React.useEffect(() => {
    try {
      localStorage.setItem('skillBridgeProgress', JSON.stringify(skillProgress));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }, [skillProgress]);

  // Fetch training content when skill is selected (MUST be at top level, not in conditional)
  React.useEffect(() => {
    if (activeView === 'training' && selectedSkillNode) {
      const fetchTraining = async () => {
        setLoadingTraining(true);
        setTrainingContent(null);
        try {
          const res = await fetch('/api/generate-training', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              skillName: selectedSkillNode.name,
              category: selectedSkillNode.category
            })
          });
          const data = await res.json();
          setTrainingContent(data);
        } catch (error) {
          console.error('Failed to fetch training:', error);
        } finally {
          setLoadingTraining(false);
        }
      };
      fetchTraining();
    }
  }, [activeView, selectedSkillNode]);

  // Initialize progress tracking when training content loads
  React.useEffect(() => {
    if (trainingContent && selectedSkillNode) {
      const numQuickWins = trainingContent.quickWins?.length || 0;
      const numChallenges = trainingContent.challenges?.length || 0;
      initializeSkillProgress(selectedSkillNode.id, numQuickWins, numChallenges);
    }
  }, [trainingContent, selectedSkillNode]);

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
    const futureProofScore =
      api.futureProofScore !== undefined ? api.futureProofScore : null;
    const skills =
      api.skillsExtracted || api.skills || api.topSkills || [];
    const skillScores = api.skillScores || [];

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
      salaryIncrease: idea.salaryChange || idea.salaryIncrease || "",
      timeToTransition: idea.timeToTransition || "",
      skillsNeeded: idea.skillsNeeded || idea.skillsToAdd || [],
      skillsFromCurrent: idea.skillsFromCurrent || [],
      demandScore:
        idea.demandScore !== undefined ? idea.demandScore : null,
      color: idea.color || colors[idx % colors.length],
    }));

    return {
      name,
      currentRole,
      automationRisk,
      futureProofScore,
      skills,
      skillScores,
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
      let resumeText;
      const isPDF = file.name.toLowerCase().endsWith('.pdf');

      if (isPDF) {
        // For PDFs, convert to base64 and send to backend for parsing
        const arrayBuffer = await file.arrayBuffer();
        const base64 = btoa(
          new Uint8Array(arrayBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        );

        const res = await fetch("/api/analyze-resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pdfBase64: base64 }),
        });

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const apiData = await res.json();
        console.log("Frontend got from /api/analyze-resume:", apiData);

        const mapped = mapApiResponseToUserData(apiData);
        setUserData(mapped);

        // Set FPS from AI-calculated score or fallback to automation-based calculation
        if (mapped.futureProofScore != null) {
          setFps(mapped.futureProofScore);
        } else if (mapped.automationRisk != null) {
          setFps(100 - mapped.automationRisk);
        }

        setStage("timeline");
      } else {
        // For text files, read as text
        resumeText = await file.text();

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

        // Set FPS from AI-calculated score or fallback to automation-based calculation
        if (mapped.futureProofScore != null) {
          setFps(mapped.futureProofScore);
        } else if (mapped.automationRisk != null) {
          setFps(100 - mapped.automationRisk);
        }

        setStage("timeline");
      }
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

  // Helper functions for tracking individual items
  const initializeSkillProgress = (skillId, numQuickWins, numChallenges) => {
    if (!skillProgress[skillId]) {
      setSkillProgress(prev => ({
        ...prev,
        [skillId]: {
          quickWins: Array(numQuickWins).fill(false),
          challenges: Array(numChallenges).fill(false),
          project: false
        }
      }));
    }
  };

  const toggleQuickWin = (skillId, index) => {
    setSkillProgress(prev => {
      const current = prev[skillId] || { quickWins: [], challenges: [], project: false };
      const newQuickWins = [...current.quickWins];
      newQuickWins[index] = !newQuickWins[index];
      return {
        ...prev,
        [skillId]: { ...current, quickWins: newQuickWins }
      };
    });
  };

  const toggleChallenge = (skillId, index) => {
    setSkillProgress(prev => {
      const current = prev[skillId] || { quickWins: [], challenges: [], project: false };
      const newChallenges = [...current.challenges];
      newChallenges[index] = !newChallenges[index];
      return {
        ...prev,
        [skillId]: { ...current, challenges: newChallenges }
      };
    });
  };

  const toggleProject = (skillId) => {
    setSkillProgress(prev => {
      const current = prev[skillId] || { quickWins: [], challenges: [], project: false };
      return {
        ...prev,
        [skillId]: { ...current, project: !current.project }
      };
    });
  };

  const getSkillCompletionPercentage = (skillId) => {
    const progress = skillProgress[skillId];
    if (!progress) return 0;

    const quickWinsCompleted = progress.quickWins.filter(Boolean).length;
    const challengesCompleted = progress.challenges.filter(Boolean).length;
    const projectCompleted = progress.project ? 1 : 0;

    const totalItems = progress.quickWins.length + progress.challenges.length + 1; // +1 for project
    const completedItems = quickWinsCompleted + challengesCompleted + projectCompleted;

    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
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
                      {(() => {
                        // Calculate target FPS for this career path
                        const targetRisk = selectedCareerPath.automationRisk || 50;
                        const skillCoverage = selectedCareerPath.skillsFromCurrent?.length || 0;
                        const totalSkills = (selectedCareerPath.skillsFromCurrent?.length || 0) + (selectedCareerPath.skillsNeeded?.length || 0);
                        const skillPercentage = totalSkills > 0 ? (skillCoverage / totalSkills) * 100 : 0;

                        // Target FPS = (100 - target automation risk) + skill readiness
                        const targetFPS = Math.round((100 - targetRisk) + (skillPercentage / 2));
                        return Math.min(100, Math.max(0, targetFPS));
                      })()}/100
                    </div>
                  </div>
                </div>
                <div className="fps-bar">
                  <div
                    className="fps-fill"
                    style={{
                      width: `${(() => {
                        const targetRisk = selectedCareerPath.automationRisk || 50;
                        const skillCoverage = selectedCareerPath.skillsFromCurrent?.length || 0;
                        const totalSkills = (selectedCareerPath.skillsFromCurrent?.length || 0) + (selectedCareerPath.skillsNeeded?.length || 0);
                        const skillPercentage = totalSkills > 0 ? (skillCoverage / totalSkills) * 100 : 0;
                        const targetFPS = Math.round((100 - targetRisk) + (skillPercentage / 2));
                        return Math.min(100, Math.max(0, targetFPS));
                      })()}%`,
                      background: (() => {
                        const targetRisk = selectedCareerPath.automationRisk || 50;
                        const skillCoverage = selectedCareerPath.skillsFromCurrent?.length || 0;
                        const totalSkills = (selectedCareerPath.skillsFromCurrent?.length || 0) + (selectedCareerPath.skillsNeeded?.length || 0);
                        const skillPercentage = totalSkills > 0 ? (skillCoverage / totalSkills) * 100 : 0;
                        const targetFPS = Math.round((100 - targetRisk) + (skillPercentage / 2));
                        const score = Math.min(100, Math.max(0, targetFPS));
                        return score > 60 ? "#10b981" : score > 30 ? "#fbbf24" : "#ef4444";
                      })(),
                    }}
                  />
                </div>
                <div className="fps-breakdown">
                  <div
                    className="metric-box"
                    onClick={() => setShowMetricExplanation('currentRisk')}
                    title="Click for explanation"
                  >
                    <span>Current Risk:</span>
                    <span>
                      {userData.automationRisk != null
                        ? `${userData.automationRisk}%`
                        : "-"}
                    </span>
                  </div>
                  <div
                    className="metric-box"
                    onClick={() => setShowMetricExplanation('targetRisk')}
                    title="Click for explanation"
                  >
                    <span>Target Risk:</span>
                    <span>
                      {selectedCareerPath.automationRisk != null
                        ? `${selectedCareerPath.automationRisk}%`
                        : "-"}
                    </span>
                  </div>
                  <div
                    className="metric-box"
                    onClick={() => setShowMetricExplanation('riskChange')}
                    title="Click for explanation"
                  >
                    <span>Risk Change:</span>
                    <span style={{
                      color: (selectedCareerPath.automationRisk || 0) < (userData.automationRisk || 0)
                        ? "#10b981"
                        : (selectedCareerPath.automationRisk || 0) > (userData.automationRisk || 0)
                        ? "#ef4444"
                        : "#fbbf24"
                    }}>
                      {userData.automationRisk != null && selectedCareerPath.automationRisk != null
                        ? `${selectedCareerPath.automationRisk - userData.automationRisk > 0 ? '+' : ''}${selectedCareerPath.automationRisk - userData.automationRisk}%`
                        : "-"}
                    </span>
                  </div>
                  <div>
                    <span>Skills Have:</span>
                    <span>
                      {selectedCareerPath.skillsFromCurrent?.length || 0}
                    </span>
                  </div>
                  <div>
                    <span>Skills to Learn:</span>
                    <span>
                      {selectedCareerPath.skillsNeeded?.length || 0}
                    </span>
                  </div>
                  <div>
                    <span>Readiness:</span>
                    <span>
                      {(() => {
                        const have = selectedCareerPath.skillsFromCurrent?.length || 0;
                        const need = selectedCareerPath.skillsNeeded?.length || 0;
                        const total = have + need;
                        return total > 0 ? `${Math.round((have / total) * 100)}%` : "-";
                      })()}
                    </span>
                  </div>
                  <div
                    className="metric-box"
                    onClick={() => setShowMetricExplanation('demand')}
                    title="Click for explanation"
                  >
                    <span>Market Demand:</span>
                    <span>
                      {selectedCareerPath.demandScore != null
                        ? `${selectedCareerPath.demandScore}/100`
                        : "High"}
                    </span>
                  </div>
                  <div
                    className="metric-box"
                    onClick={() => setShowMetricExplanation('time')}
                    title="Click for explanation"
                  >
                    <span>Time Needed:</span>
                    <span>{selectedCareerPath.timeToTransition || "-"}</span>
                  </div>
                </div>

                {/* Metric Explanation Modal */}
                {showMetricExplanation && (
                  <div className="explanation-modal" onClick={() => setShowMetricExplanation(null)}>
                    <div className="explanation-content" onClick={(e) => e.stopPropagation()}>
                      <button className="close-btn" onClick={() => setShowMetricExplanation(null)}>✕</button>

                      {showMetricExplanation === 'currentRisk' && (
                        <>
                          <h3>Current Automation Risk: {userData.automationRisk}%</h3>
                          <p><strong>What this means:</strong></p>
                          <p>This percentage represents how likely your current role is to be automated or significantly changed by AI/automation in the next 5-10 years.</p>
                          <p><strong>How it's calculated:</strong></p>
                          <ul>
                            <li>AI analyzes your job description and tasks</li>
                            <li>Evaluates how repetitive vs. creative the work is</li>
                            <li>Considers how rule-based vs. strategic the role is</li>
                            <li>Lower scores (0-30%) = More future-proof (creative, strategic, people-focused)</li>
                            <li>Higher scores (60-100%) = Higher risk (repetitive, rule-based, data-heavy)</li>
                          </ul>
                        </>
                      )}

                      {showMetricExplanation === 'targetRisk' && (
                        <>
                          <h3>Target Role Automation Risk: {selectedCareerPath.automationRisk}%</h3>
                          <p><strong>What this means:</strong></p>
                          <p>This is the automation risk for <strong>{selectedCareerPath.title}</strong>.</p>
                          <p><strong>Why this role:</strong></p>
                          <p>{selectedCareerPath.description}</p>
                          <p><strong>Risk factors considered:</strong></p>
                          <ul>
                            <li>Job market trends and AI advancement in this field</li>
                            <li>How much human judgment and creativity is required</li>
                            <li>Level of interpersonal interaction needed</li>
                            <li>Regulatory and ethical considerations that require humans</li>
                          </ul>
                          <p><strong>Goal:</strong> We recommend paths with LOWER risk than your current {userData.automationRisk}%.</p>
                        </>
                      )}

                      {showMetricExplanation === 'riskChange' && (
                        <>
                          <h3>Risk Change: {selectedCareerPath.automationRisk - userData.automationRisk > 0 ? '+' : ''}{selectedCareerPath.automationRisk - userData.automationRisk}%</h3>
                          <p><strong>What this means:</strong></p>
                          {(selectedCareerPath.automationRisk - userData.automationRisk) < 0 ? (
                            <p style={{color: '#10b981'}}>✅ <strong>Good news!</strong> This career path has LOWER automation risk than your current role. You're moving to a more future-proof position.</p>
                          ) : (selectedCareerPath.automationRisk - userData.automationRisk) > 0 ? (
                            <p style={{color: '#ef4444'}}>⚠️ This path has HIGHER automation risk. Consider if the salary increase or other benefits justify this trade-off.</p>
                          ) : (
                            <p style={{color: '#fbbf24'}}>→ Similar risk level. You're moving laterally in terms of automation safety.</p>
                          )}
                          <p><strong>How to interpret:</strong></p>
                          <ul>
                            <li>Negative numbers (green) = Safer career move</li>
                            <li>Positive numbers (red) = Higher risk career move</li>
                            <li>Zero (yellow) = Similar risk level</li>
                          </ul>
                        </>
                      )}

                      {showMetricExplanation === 'demand' && (
                        <>
                          <h3>Market Demand: {selectedCareerPath.demandScore}/100</h3>
                          <p><strong>What this means:</strong></p>
                          <p>This score represents current and projected market demand for <strong>{selectedCareerPath.title}</strong> professionals.</p>
                          <p><strong>How it's calculated:</strong></p>
                          <ul>
                            <li>Current job posting trends and growth rates</li>
                            <li>Industry reports on workforce needs</li>
                            <li>Projected growth in related sectors</li>
                            <li>Skills gap analysis (supply vs. demand)</li>
                            <li>Geographic availability of opportunities</li>
                          </ul>
                          <p><strong>Scoring:</strong></p>
                          <ul>
                            <li>80-100: Very high demand, excellent prospects</li>
                            <li>60-79: Good demand, solid opportunities</li>
                            <li>40-59: Moderate demand, competitive market</li>
                            <li>0-39: Low demand, challenging market</li>
                          </ul>
                          <p><strong>Explore Current Job Openings:</strong></p>
                          <div className="job-links">
                            <a
                              href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(selectedCareerPath.title)}&location=Worldwide&f_TPR=r604800`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="job-link linkedin"
                            >
                              🔗 LinkedIn Jobs (Past Week)
                            </a>
                            <a
                              href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(selectedCareerPath.title)}&location=United%20States&f_E=2`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="job-link linkedin"
                            >
                              🔗 Entry-Level Positions (US)
                            </a>
                            <a
                              href={`https://www.indeed.com/jobs?q=${encodeURIComponent(selectedCareerPath.title)}&l=&fromage=7`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="job-link indeed"
                            >
                              🔗 Indeed Jobs (Past Week)
                            </a>
                            <a
                              href={`https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${encodeURIComponent(selectedCareerPath.title)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="job-link glassdoor"
                            >
                              🔗 Glassdoor (with Salary Info)
                            </a>
                          </div>
                          <p style={{fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginTop: '1rem'}}>
                            💡 Tip: Bookmark these searches and check them weekly to see market trends and requirements.
                          </p>
                        </>
                      )}

                      {showMetricExplanation === 'time' && (
                        <>
                          <h3>Time to Transition: {selectedCareerPath.timeToTransition}</h3>
                          <p><strong>What this means:</strong></p>
                          <p>This is a realistic estimate of how long it will take you to become job-ready for <strong>{selectedCareerPath.title}</strong>.</p>
                          <p><strong>What's included in this estimate:</strong></p>
                          <ul>
                            <li>Time to learn the {selectedCareerPath.skillsNeeded?.length || 0} new skills required</li>
                            <li>Building a portfolio or relevant experience</li>
                            <li>Networking and making industry connections</li>
                            <li>Job search and interview preparation</li>
                          </ul>
                          <p><strong>Your starting point:</strong></p>
                          <p>You already have {selectedCareerPath.skillsFromCurrent?.length || 0} transferable skills, which accelerates your transition.</p>
                          <p><strong>Note:</strong> This assumes consistent part-time learning (10-15 hours/week). Full-time dedication could cut this timeline in half.</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
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

            // Categorize skills by type for logical grouping
            const categorizeSkill = (skillName) => {
              const skill = skillName.toLowerCase();
              // Technical skills
              if (skill.match(/(programming|python|javascript|react|code|development|sql|database|api|git|docker|aws|cloud|framework|library|typescript|java|c\+\+|html|css)/)) {
                return 'technical';
              }
              // Soft/Leadership skills
              if (skill.match(/(leadership|communication|management|collaboration|teamwork|presentation|negotiation|emotional|empathy|stakeholder|strategy|planning)/)) {
                return 'soft';
              }
              // Domain/Industry skills
              if (skill.match(/(healthcare|medical|finance|marketing|sales|design|ux|ui|analytics|data|research|compliance|regulatory)/)) {
                return 'domain';
              }
              // Learning/Process skills
              return 'learning';
            };

            // Group skills by category
            const skillsByCategory = {
              technical: [],
              soft: [],
              domain: [],
              learning: []
            };

            pathSkillsHave.forEach(skill => {
              const category = categorizeSkill(skill);
              skillsByCategory[category].push({ name: skill, status: 'completed' });
            });

            pathSkillsNeed.forEach(skill => {
              const category = categorizeSkill(skill);
              skillsByCategory[category].push({ name: skill, status: 'current' });
            });

            // Create nodes with strategic positioning in columns by category
            const categoryPositions = {
              technical: { x: 80, label: 'Technical Skills', color: '#818cf8' },
              soft: { x: 320, label: 'Soft Skills', color: '#c084fc' },
              domain: { x: 560, label: 'Domain Knowledge', color: '#10b981' },
              learning: { x: 800, label: 'Growth Skills', color: '#fbbf24' }
            };

            let allNodes = [];
            let nodeId = 0;

            Object.keys(skillsByCategory).forEach(category => {
              const skills = skillsByCategory[category];
              if (skills.length === 0) return;

              const baseX = categoryPositions[category].x;
              const startY = 120;
              const spacing = 75;

              skills.forEach((skill, idx) => {
                allNodes.push({
                  id: `skill-${nodeId++}`,
                  name: skill.name,
                  x: baseX,
                  y: startY + (idx * spacing),
                  status: skill.status,
                  category: category,
                  categoryColor: categoryPositions[category].color
                });
              });
            });

            // Create goal node at the center bottom
            const goalNode = {
              id: "goal-node",
              name: path.title,
              x: 450,
              y: 600,
              status: "goal",
            };

            allNodes.push(goalNode);

            // Create logical connections
            const createLogicalConnections = () => {
              const connections = [];

              // Connect completed skills to skills that need them as prerequisites
              const completedNodes = allNodes.filter(n => n.status === 'completed' && n.id !== 'goal-node');
              const needNodes = allNodes.filter(n => n.status === 'current' && n.id !== 'goal-node');

              // Connect within same category (vertical flow)
              Object.keys(skillsByCategory).forEach(category => {
                const categoryNodes = allNodes.filter(n => n.category === category);
                for (let i = 0; i < categoryNodes.length - 1; i++) {
                  if (categoryNodes[i].status === 'completed' && categoryNodes[i + 1].status === 'current') {
                    connections.push({ from: categoryNodes[i].id, to: categoryNodes[i + 1].id, type: 'prerequisite' });
                  }
                }
              });

              // Connect across categories for logical dependencies
              completedNodes.forEach(completed => {
                needNodes.forEach(needed => {
                  // Technical skills often prerequisite for domain skills
                  if (completed.category === 'technical' && needed.category === 'domain') {
                    connections.push({ from: completed.id, to: needed.id, type: 'supports' });
                  }
                  // Soft skills support all other skills
                  if (completed.category === 'soft' && Math.random() > 0.6) {
                    connections.push({ from: completed.id, to: needed.id, type: 'enables' });
                  }
                });
              });

              // All skills eventually lead to goal
              allNodes.forEach(node => {
                if (node.id !== 'goal-node') {
                  connections.push({ from: node.id, to: goalNode.id, type: 'contributes' });
                }
              });

              return connections;
            };

            const connections = createLogicalConnections();

            const getColor = (status) => {
              if (status === "completed") return "#10b981";
              if (status === "current")   return "#818cf8";
              if (status === "goal")      return "#fbbf24";
              return "#6b7280";
            };

            const getConnectionStyle = (type) => {
              switch(type) {
                case 'prerequisite':
                  return { stroke: "rgba(129,140,248,0.6)", strokeWidth: "3", strokeDasharray: "none" };
                case 'supports':
                  return { stroke: "rgba(16,185,129,0.4)", strokeWidth: "2", strokeDasharray: "5,5" };
                case 'enables':
                  return { stroke: "rgba(192,132,252,0.4)", strokeWidth: "2", strokeDasharray: "3,3" };
                case 'contributes':
                  return { stroke: "rgba(251,191,36,0.2)", strokeWidth: "1.5", strokeDasharray: "none" };
                default:
                  return { stroke: "rgba(129,140,248,0.3)", strokeWidth: "2", strokeDasharray: "none" };
              }
            };

            // Filter nodes based on selected category
            const filteredNodes = skillCategoryFilter === 'all'
              ? allNodes
              : allNodes.filter(node => node.id === 'goal-node' || node.category === skillCategoryFilter);

            // Filter connections to only show connections between visible nodes
            const visibleNodeIds = new Set(filteredNodes.map(n => n.id));
            const filteredConnections = connections.filter(
              conn => visibleNodeIds.has(conn.from) && visibleNodeIds.has(conn.to)
            );

            return (
              <div className="skill-map">
                <div className="map-header">
                  <div>
                    <h2>Skill Journey Map</h2>
                    <p style={{fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem'}}>
                      Your path to {path.title}
                    </p>
                  </div>
                  <button className="back-btn" onClick={() => setActiveView("dashboard")}>
                    ← Back to Dashboard
                  </button>
                </div>

                <div className="filter-controls">
                  <div className="filter-label">Filter by Category:</div>
                  <div className="filter-buttons">
                    <button
                      className={`filter-btn ${skillCategoryFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setSkillCategoryFilter('all')}
                    >
                      All Skills
                    </button>
                    {Object.entries(categoryPositions).map(([key, val]) => (
                      skillsByCategory[key].length > 0 && (
                        <button
                          key={key}
                          className={`filter-btn ${skillCategoryFilter === key ? 'active' : ''}`}
                          onClick={() => setSkillCategoryFilter(key)}
                          style={{
                            borderColor: skillCategoryFilter === key ? val.color : 'rgba(255,255,255,0.2)',
                            color: skillCategoryFilter === key ? val.color : 'rgba(255,255,255,0.7)'
                          }}
                        >
                          {val.label}
                        </button>
                      )
                    ))}
                  </div>
                </div>

                <div className="category-labels">
                  {Object.entries(categoryPositions).map(([key, val]) => (
                    skillsByCategory[key].length > 0 && (skillCategoryFilter === 'all' || skillCategoryFilter === key) && (
                      <div
                        key={key}
                        className="category-label"
                        style={{
                          left: `${val.x - 20}px`,
                          color: val.color,
                          borderColor: val.color
                        }}
                      >
                        {val.label}
                      </div>
                    )
                  ))}
                </div>

                <svg viewBox="0 0 1050 700" className="map-svg">
                  <defs>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                    <linearGradient id="goalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#fbbf24', stopOpacity: 1}} />
                      <stop offset="100%" style={{stopColor: '#f59e0b', stopOpacity: 1}} />
                    </linearGradient>
                  </defs>

                  {/* Draw connections */}
                  {filteredConnections.map((conn, i) => {
                    const from = filteredNodes.find((n) => n.id === conn.from);
                    const to = filteredNodes.find((n) => n.id === conn.to);
                    if (!from || !to) return null;

                    const style = getConnectionStyle(conn.type);

                    // Calculate control points for curved paths
                    const midX = (from.x + to.x) / 2;
                    const midY = (from.y + to.y) / 2;

                    return (
                      <path
                        key={`conn-${i}`}
                        d={`M ${from.x + 100} ${from.y + 20} Q ${midX} ${midY} ${to.x + (to.id === 'goal-node' ? 130 : 100)} ${to.y + 20}`}
                        fill="none"
                        stroke={style.stroke}
                        strokeWidth={style.strokeWidth}
                        strokeDasharray={style.strokeDasharray}
                        opacity="0.6"
                      />
                    );
                  })}

                  {/* Draw nodes */}
                  {filteredNodes.map((node) => {
                    const isGoal = node.id === "goal-node";
                    const width = isGoal ? 260 : 200;
                    const height = isGoal ? 60 : 45;
                    const nodeColor = isGoal ? "url(#goalGradient)" : getColor(node.status);
                    const completionPct = !isGoal ? getSkillCompletionPercentage(node.id) : 0;
                    const hasProgress = completionPct > 0 && completionPct < 100;

                    return (
                      <g
                        key={node.id}
                        onClick={() => {
                          if (!isGoal && node.status !== "completed") {
                            setSelectedSkillNode(node);
                            setActiveView("training");
                          }
                        }}
                        style={{
                          cursor: !isGoal && node.status !== "completed" ? "pointer" : "default",
                        }}
                        className={`skill-node ${node.status}`}
                      >
                        <rect
                          x={node.x}
                          y={node.y}
                          width={width}
                          height={height}
                          rx="12"
                          fill={nodeColor}
                          opacity="0.95"
                          filter={isGoal ? "url(#glow)" : "none"}
                          stroke={node.categoryColor || (isGoal ? "#fbbf24" : "rgba(255,255,255,0.2)")}
                          strokeWidth={isGoal ? "3" : "2"}
                        />

                        {/* Status icon with progress */}
                        {!isGoal && (
                          <>
                            {hasProgress && (
                              <>
                                {/* Progress ring background */}
                                <circle
                                  cx={node.x + 15}
                                  cy={node.y + 22.5}
                                  r="10"
                                  fill="none"
                                  stroke="rgba(255,255,255,0.2)"
                                  strokeWidth="2"
                                />
                                {/* Progress ring fill */}
                                <circle
                                  cx={node.x + 15}
                                  cy={node.y + 22.5}
                                  r="10"
                                  fill="none"
                                  stroke="#10b981"
                                  strokeWidth="2"
                                  strokeDasharray={`${(completionPct / 100) * 62.83} 62.83`}
                                  strokeDashoffset="15.7075"
                                  transform={`rotate(-90 ${node.x + 15} ${node.y + 22.5})`}
                                />
                                {/* Percentage text */}
                                <text
                                  x={node.x + 15}
                                  y={node.y + 26}
                                  fill="#fff"
                                  fontSize="8"
                                  fontWeight="700"
                                  textAnchor="middle"
                                >
                                  {completionPct}
                                </text>
                              </>
                            )}
                            {!hasProgress && (
                              <text
                                x={node.x + 15}
                                y={node.y + 28}
                                fill="#fff"
                                fontSize="16"
                              >
                                {node.status === 'completed' || completionPct === 100 ? '✓' : '○'}
                              </text>
                            )}
                          </>
                        )}

                        {/* Skill name */}
                        <text
                          x={node.x + (isGoal ? 130 : 35)}
                          y={node.y + (isGoal ? 35 : 28)}
                          textAnchor={isGoal ? "middle" : "start"}
                          fill="#fff"
                          fontSize={isGoal ? "14" : "12"}
                          fontWeight={isGoal ? "700" : "600"}
                        >
                          {node.name.length > (isGoal ? 35 : 25)
                            ? node.name.substring(0, isGoal ? 35 : 25) + '...'
                            : node.name}
                        </text>

                        {/* Hover effect */}
                        {!isGoal && node.status !== "completed" && (
                          <rect
                            x={node.x}
                            y={node.y}
                            width={width}
                            height={height}
                            rx="12"
                            fill="rgba(255,255,255,0.1)"
                            opacity="0"
                            className="hover-overlay"
                          />
                        )}
                      </g>
                    );
                  })}
                </svg>

                <div className="map-legend">
                  <div className="legend-item">
                    <div className="legend-dot" style={{ background: "#10b981" }} />
                    <span>You Have This</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-dot" style={{ background: "#818cf8" }} />
                    <span>Need to Learn</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-dot" style={{ background: "#fbbf24" }} />
                    <span>Career Goal</span>
                  </div>
                </div>

                <div className="map-stats">
                  <div className="stat-card">
                    <div className="stat-value">{pathSkillsHave.length}</div>
                    <div className="stat-label">Skills You Have</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{pathSkillsNeed.length}</div>
                    <div className="stat-label">Skills to Acquire</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {Math.round((pathSkillsHave.length / (pathSkillsHave.length + pathSkillsNeed.length)) * 100)}%
                    </div>
                    <div className="stat-label">Journey Progress</div>
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
                    {activeView === "training" && selectedSkillNode && (() => {
            return (
              <div className="training">
                <div className="training-header">
                  <div>
                    <h2>{selectedSkillNode.name}</h2>
                    <p style={{fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem'}}>
                      Action-Based Learning Studio
                    </p>
                  </div>
                  <button className="back-btn" onClick={() => {
                    setActiveView("skillMap");
                    setTrainingContent(null);
                  }}>
                    ← Back to Map
                  </button>
                </div>

                {loadingTraining ? (
                  <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Generating your personalized learning plan...</p>
                  </div>
                ) : trainingContent ? (
                  <>
                    <div className="training-hero">
                      <h3>{trainingContent.tagline}</h3>
                      <div className="progress-stats">
                        <div className="progress-bar-container">
                          <div
                            className="progress-bar-fill"
                            style={{width: `${getSkillCompletionPercentage(selectedSkillNode.id)}%`}}
                          ></div>
                        </div>
                        <p className="progress-text">
                          {getSkillCompletionPercentage(selectedSkillNode.id)}% Complete
                        </p>
                      </div>
                    </div>

                    <div className="quick-wins-section">
                      <h3>🚀 Start Right Now (30 min)</h3>
                      <p style={{color: 'rgba(255,255,255,0.7)', marginBottom: '1rem'}}>
                        No setup required. Just pick one and DO it:
                      </p>
                      <div className="quick-wins-grid">
                        {trainingContent.quickWins?.map((win, i) => {
                          const isChecked = skillProgress[selectedSkillNode.id]?.quickWins[i] || false;
                          return (
                            <div
                              key={i}
                              className={`quick-win-card ${isChecked ? 'completed' : ''}`}
                              onClick={() => toggleQuickWin(selectedSkillNode.id, i)}
                              style={{cursor: 'pointer'}}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleQuickWin(selectedSkillNode.id, i)}
                                onClick={(e) => e.stopPropagation()}
                                className="win-checkbox"
                              />
                              <div className="win-content">
                                <span className="win-number">{i + 1}</span>
                                <p>{win}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="build-project-section">
                      <h3>🛠️ Build Something Real</h3>
                      <div className={`project-card ${skillProgress[selectedSkillNode.id]?.project ? 'completed' : ''}`}>
                        <div className="project-header">
                          <h4>{trainingContent.buildProject?.title}</h4>
                          <button
                            className={`project-complete-btn ${skillProgress[selectedSkillNode.id]?.project ? 'checked' : ''}`}
                            onClick={() => toggleProject(selectedSkillNode.id)}
                          >
                            {skillProgress[selectedSkillNode.id]?.project ? '✓ Completed' : 'Mark Complete'}
                          </button>
                        </div>
                        <p className="project-description">{trainingContent.buildProject?.description}</p>
                        <div className="project-meta">
                          <span>⏱️ {trainingContent.buildProject?.timeEstimate}</span>
                        </div>
                        <div className="project-steps">
                          <strong>Steps:</strong>
                          <ol>
                            {trainingContent.buildProject?.steps?.map((step, i) => (
                              <li key={i}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </div>

                    <div className="resources-section">
                      <h3>📚 Learn From the Best</h3>
                      <div className="resources-grid">
                        <a
                          href={trainingContent.resourceUrls?.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="resource-card youtube"
                        >
                          <div className="resource-icon">▶️</div>
                          <div className="resource-content">
                            <h4>{trainingContent.resources?.video?.title}</h4>
                            <p className="resource-creator">{trainingContent.resources?.video?.creator}</p>
                            <span className="resource-meta">{trainingContent.resources?.video?.duration}</span>
                          </div>
                        </a>

                        <a
                          href={trainingContent.resourceUrls?.course}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="resource-card course"
                        >
                          <div className="resource-icon">🎓</div>
                          <div className="resource-content">
                            <h4>{trainingContent.resources?.course?.title}</h4>
                            <p className="resource-creator">{trainingContent.resources?.course?.platform} • {trainingContent.resources?.course?.instructor}</p>
                          </div>
                        </a>

                        <a
                          href={trainingContent.resourceUrls?.practice}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="resource-card practice"
                        >
                          <div className="resource-icon">💪</div>
                          <div className="resource-content">
                            <h4>{trainingContent.resources?.practice?.title}</h4>
                            <p className="resource-creator">{trainingContent.resources?.practice?.platform}</p>
                            <span className="resource-meta">{trainingContent.resources?.practice?.description}</span>
                          </div>
                        </a>
                      </div>
                    </div>

                    <div className="challenges-section">
                      <h3>🎯 Test Your Skills</h3>
                      <p style={{color: 'rgba(255,255,255,0.7)', marginBottom: '1rem'}}>
                        Complete these challenges to prove mastery:
                      </p>
                      <div className="challenges-list">
                        {trainingContent.challenges?.map((challenge, i) => {
                          const isChecked = skillProgress[selectedSkillNode.id]?.challenges[i] || false;
                          return (
                            <div
                              key={i}
                              className={`challenge-item ${isChecked ? 'completed' : ''}`}
                              onClick={() => toggleChallenge(selectedSkillNode.id, i)}
                              style={{cursor: 'pointer'}}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleChallenge(selectedSkillNode.id, i)}
                                onClick={(e) => e.stopPropagation()}
                                className="challenge-checkbox"
                              />
                              <div className="challenge-content">
                                <div className="challenge-level">Level {i + 1}</div>
                                <p>{challenge}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="reflection-section">
                      <h3>🧠 Deepen Your Understanding</h3>
                      <p style={{color: 'rgba(255,255,255,0.7)', marginBottom: '1rem'}}>
                        After completing the project, reflect on these:
                      </p>
                      <ul className="reflection-list">
                        {trainingContent.reflection?.map((q, i) => (
                          <li key={i}>{q}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="completion-section">
                      <button
                        className="complete-btn-large"
                        onClick={() => {
                          if (!completedNodes.includes(selectedSkillNode.id)) {
                            completeNode(selectedSkillNode.id);
                            setActiveView("skillMap");
                          }
                        }}
                      >
                        {completedNodes.includes(selectedSkillNode.id) ? '✓ Completed' : 'Mark as Complete & Return to Map'}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="error-state">
                    <p>Failed to load training content. Please try again.</p>
                  </div>
                )}
              </div>
            );
          })()}

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
        .fps-breakdown { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; }
        .fps-breakdown > div { display:flex; justify-content:space-between; padding:1rem; background:rgba(255,255,255,0.05); border-radius:12px; }
        .fps-breakdown .metric-box { cursor:pointer; transition:all 0.3s; position:relative; }
        .fps-breakdown .metric-box:hover { background:rgba(129,140,248,0.15); transform:translateY(-2px); box-shadow:0 4px 12px rgba(129,140,248,0.3); }
        .fps-breakdown .metric-box:hover::after { content:"ℹ️ Click for details"; position:absolute; bottom:-25px; left:50%; transform:translateX(-50%); font-size:0.75rem; color:#818cf8; white-space:nowrap; }
        .explanation-modal { position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.8); display:flex; align-items:center; justify-content:center; z-index:1000; padding:2rem; }
        .explanation-content { background:linear-gradient(135deg,#1e1b4b,#312e81); border:2px solid #818cf8; border-radius:24px; padding:2rem; max-width:600px; max-height:80vh; overflow-y:auto; position:relative; }
        .explanation-content h3 { font-size:1.75rem; margin-bottom:1rem; color:#818cf8; }
        .explanation-content p { margin-bottom:1rem; line-height:1.6; }
        .explanation-content ul { margin-left:1.5rem; margin-bottom:1rem; }
        .explanation-content li { margin-bottom:0.5rem; line-height:1.5; }
        .explanation-content strong { color:#c4b5fd; }
        .close-btn { position:absolute; top:1rem; right:1rem; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); color:#fff; width:32px; height:32px; border-radius:50%; cursor:pointer; font-size:1.25rem; display:flex; align-items:center; justify-content:center; transition:all 0.3s; }
        .close-btn:hover { background:rgba(239,68,68,0.3); border-color:#ef4444; }
        .nav-cards { display:grid; grid-template-columns:repeat(2,1fr); gap:2rem; }
        .nav-card { background:rgba(255,255,255,0.05); border:2px solid rgba(129,140,248,0.2); border-radius:20px; padding:2rem; cursor:pointer; transition:all 0.4s; text-align:center; }
        .nav-card:hover { transform:translateY(-8px); border-color:rgba(129,140,248,0.6); }
        .nav-card svg { color:#818cf8; margin:0 auto 1rem; display: block; }
        .nav-card h3 { font-size:1.5rem; margin-bottom:0.5rem; }
        .nav-card p { color:rgba(255,255,255,0.7); }
        .skill-map { max-width:1100px; margin:0 auto; }
        .simulation { max-width:1000px; margin:0 auto; }
        .map-header, .sim-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem; }
        .map-header h2, .sim-header h2 { font-size:2rem; font-weight:700; }
        .map-header button, .sim-header button { background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); color:#fff; padding:0.75rem 1.5rem; border-radius:12px; cursor:pointer; transition:all 0.3s; }
        .map-header button:hover, .sim-header button:hover { background:rgba(255,255,255,0.15); transform:translateY(-2px); }

        .filter-controls { display:flex; align-items:center; gap:1.5rem; margin-bottom:2rem; padding:1.5rem; background:rgba(255,255,255,0.03); border-radius:16px; border:1px solid rgba(129,140,248,0.1); }
        .filter-label { font-size:0.95rem; font-weight:600; color:rgba(255,255,255,0.8); white-space:nowrap; }
        .filter-buttons { display:flex; gap:0.75rem; flex-wrap:wrap; }
        .filter-btn { padding:0.65rem 1.25rem; border-radius:10px; border:2px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.05); color:rgba(255,255,255,0.7); font-size:0.9rem; font-weight:600; cursor:pointer; transition:all 0.3s; white-space:nowrap; }
        .filter-btn:hover { transform:translateY(-2px); background:rgba(255,255,255,0.1); box-shadow:0 4px 12px rgba(0,0,0,0.2); }
        .filter-btn.active { background:rgba(129,140,248,0.15); border-color:#818cf8; color:#818cf8; box-shadow:0 4px 12px rgba(129,140,248,0.3); }

        .category-labels { position:relative; height:50px; margin-bottom:1rem; }
        .category-label { position:absolute; top:0; font-size:0.85rem; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; padding:0.5rem 1rem; border:1px solid; border-radius:8px; background:rgba(0,0,0,0.3); backdrop-filter:blur(10px); }

        .map-svg { width:100%; height:750px; background:linear-gradient(135deg, rgba(15,12,41,0.6), rgba(48,43,99,0.4)); border:2px solid rgba(129,140,248,0.2); border-radius:24px; padding:1rem; margin-bottom:2rem; overflow:visible; }

        .skill-node { transition:all 0.3s ease; }
        .skill-node:hover { transform:scale(1.05); }
        .skill-node .hover-overlay { transition:opacity 0.3s; }
        .skill-node:hover .hover-overlay { opacity:1; }

        .map-legend { display:flex; gap:2rem; justify-content:center; flex-wrap:wrap; margin-bottom:2rem; padding:1.5rem; background:rgba(255,255,255,0.03); border-radius:16px; border:1px solid rgba(129,140,248,0.1); }
        .map-legend .legend-item { display:flex; align-items:center; gap:0.75rem; }
        .map-legend .legend-dot { width:24px; height:24px; border-radius:6px; box-shadow:0 2px 8px rgba(0,0,0,0.3); }
        .map-legend span { font-size:0.95rem; font-weight:500; }

        .map-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem; margin-top:2rem; }
        .stat-card { background:linear-gradient(135deg, rgba(129,140,248,0.1), rgba(192,132,252,0.1)); border:2px solid rgba(129,140,248,0.3); border-radius:20px; padding:2rem; text-align:center; transition:all 0.3s; }
        .stat-card:hover { transform:translateY(-4px); border-color:rgba(129,140,248,0.5); box-shadow:0 8px 24px rgba(129,140,248,0.2); }
        .stat-value { font-size:3rem; font-weight:800; font-family:'Space Mono',monospace; background:linear-gradient(135deg,#818cf8,#c084fc); -webkit-background-clip:text; -webkit-text-fill-color:transparent; margin-bottom:0.5rem; }
        .stat-label { font-size:0.95rem; color:rgba(255,255,255,0.7); font-weight:500; }
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

        .job-links { display:flex; flex-direction:column; gap:0.75rem; margin-top:1rem; }
        .job-link { display:inline-block; padding:0.75rem 1.25rem; border-radius:12px; text-decoration:none; font-weight:600; transition:all 0.3s; border:2px solid; text-align:center; }
        .job-link:hover { transform:translateY(-2px); box-shadow:0 4px 12px rgba(0,0,0,0.3); }
        .job-link.linkedin { background:rgba(0,119,181,0.2); border-color:#0077b5; color:#0077b5; }
        .job-link.linkedin:hover { background:rgba(0,119,181,0.3); }
        .job-link.indeed { background:rgba(45,103,185,0.2); border-color:#2d67b9; color:#2d67b9; }
        .job-link.indeed:hover { background:rgba(45,103,185,0.3); }
        .job-link.glassdoor { background:rgba(13,161,58,0.2); border-color:#0da13a; color:#0da13a; }
        .job-link.glassdoor:hover { background:rgba(13,161,58,0.3); }

        @media (max-width: 1024px) {
          .map-stats { grid-template-columns:1fr; }
          .category-labels { display:none; }
          .filter-controls { flex-direction:column; align-items:flex-start; gap:1rem; }
          .filter-buttons { width:100%; }
        }

        /* Dynamic Training Studio Styles */
        .training { max-width:1200px; margin:0 auto; }
        .loading-state, .error-state { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:400px; }
        .spinner { width:60px; height:60px; border:4px solid rgba(129,140,248,0.2); border-top-color:#818cf8; border-radius:50%; animation:spin 1s linear infinite; margin-bottom:1rem; }

        .training-hero { background:linear-gradient(135deg, rgba(129,140,248,0.2), rgba(192,132,252,0.2)); border:2px solid rgba(129,140,248,0.3); border-radius:20px; padding:2rem; margin-bottom:3rem; text-align:center; }
        .training-hero h3 { font-size:1.75rem; line-height:1.4; color:#c4b5fd; margin-bottom:1.5rem; }

        .progress-stats { margin-top:1.5rem; }
        .progress-bar-container { width:100%; height:12px; background:rgba(255,255,255,0.1); border-radius:6px; overflow:hidden; margin-bottom:0.75rem; }
        .progress-bar-fill { height:100%; background:linear-gradient(90deg, #10b981, #059669); transition:width 0.5s ease; border-radius:6px; }
        .progress-text { font-size:1rem; color:rgba(255,255,255,0.8); font-weight:600; }

        .quick-wins-section, .build-project-section, .resources-section, .challenges-section, .reflection-section { margin-bottom:3rem; }
        .quick-wins-section h3, .build-project-section h3, .resources-section h3, .challenges-section h3, .reflection-section h3 { font-size:1.75rem; margin-bottom:1.5rem; }

        .quick-wins-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.5rem; }
        .quick-win-card { background:rgba(16,185,129,0.1); border:2px solid rgba(16,185,129,0.3); border-radius:16px; padding:1.5rem; position:relative; transition:all 0.3s; display:flex; align-items:flex-start; gap:1rem; }
        .quick-win-card:hover { transform:translateY(-4px); border-color:rgba(16,185,129,0.5); box-shadow:0 8px 24px rgba(16,185,129,0.2); }
        .quick-win-card.completed { background:rgba(16,185,129,0.2); border-color:rgba(16,185,129,0.6); opacity:0.8; }
        .win-checkbox { width:20px; height:20px; cursor:pointer; accent-color:#10b981; flex-shrink:0; margin-top:0.25rem; }
        .win-content { flex:1; }
        .win-number { background:#10b981; color:#0f0c29; width:28px; height:28px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-weight:700; font-size:0.9rem; margin-right:0.5rem; }
        .quick-win-card p { line-height:1.5; display:inline; }

        .project-card { background:rgba(129,140,248,0.1); border:2px solid rgba(129,140,248,0.3); border-radius:20px; padding:2rem; transition:all 0.3s; }
        .project-card.completed { background:rgba(129,140,248,0.2); border-color:rgba(129,140,248,0.6); }
        .project-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem; gap:1rem; flex-wrap:wrap; }
        .project-card h4 { font-size:1.5rem; color:#818cf8; margin:0; }
        .project-complete-btn { background:rgba(129,140,248,0.2); border:2px solid rgba(129,140,248,0.4); color:#fff; padding:0.5rem 1.25rem; border-radius:8px; font-weight:600; cursor:pointer; transition:all 0.3s; white-space:nowrap; }
        .project-complete-btn:hover { background:rgba(129,140,248,0.3); border-color:rgba(129,140,248,0.6); }
        .project-complete-btn.checked { background:#818cf8; border-color:#818cf8; }
        .project-description { color:rgba(255,255,255,0.8); margin-bottom:1.5rem; line-height:1.6; }
        .project-meta { display:flex; gap:1rem; margin-bottom:1.5rem; }
        .project-meta span { background:rgba(255,255,255,0.1); padding:0.5rem 1rem; border-radius:8px; font-size:0.9rem; }
        .project-steps { background:rgba(255,255,255,0.05); padding:1.5rem; border-radius:12px; }
        .project-steps strong { display:block; margin-bottom:0.75rem; color:#c4b5fd; }
        .project-steps ol { padding-left:1.5rem; }
        .project-steps li { margin-bottom:0.75rem; line-height:1.5; }

        .resources-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:1.5rem; }
        .resource-card { display:flex; gap:1.5rem; background:rgba(255,255,255,0.05); border:2px solid rgba(255,255,255,0.1); border-radius:16px; padding:1.5rem; text-decoration:none; transition:all 0.3s; }
        .resource-card:hover { transform:translateY(-4px); box-shadow:0 8px 24px rgba(0,0,0,0.3); }
        .resource-card.youtube:hover { border-color:#ff0000; }
        .resource-card.course:hover { border-color:#0056d2; }
        .resource-card.practice:hover { border-color:#10b981; }
        .resource-icon { font-size:2.5rem; flex-shrink:0; }
        .resource-content { flex:1; }
        .resource-content h4 { font-size:1.1rem; margin-bottom:0.5rem; color:#fff; }
        .resource-creator { font-size:0.9rem; color:rgba(255,255,255,0.6); margin-bottom:0.5rem; }
        .resource-meta { font-size:0.85rem; color:rgba(255,255,255,0.5); }

        .challenges-list { display:grid; gap:1rem; }
        .challenge-item { display:flex; align-items:flex-start; gap:1rem; background:rgba(251,191,36,0.1); border:2px solid rgba(251,191,36,0.3); border-radius:16px; padding:1.5rem; transition:all 0.3s; }
        .challenge-item:hover { border-color:rgba(251,191,36,0.5); transform:translateX(8px); }
        .challenge-item.completed { background:rgba(251,191,36,0.2); border-color:rgba(251,191,36,0.6); opacity:0.8; }
        .challenge-checkbox { width:20px; height:20px; cursor:pointer; accent-color:#fbbf24; flex-shrink:0; margin-top:0.25rem; }
        .challenge-content { flex:1; display:flex; gap:1rem; align-items:flex-start; }
        .challenge-level { background:#fbbf24; color:#0f0c29; padding:0.5rem 1rem; border-radius:8px; font-weight:700; white-space:nowrap; flex-shrink:0; }
        .challenge-item p { line-height:1.5; flex:1; }

        .reflection-list { list-style:none; padding:0; }
        .reflection-list li { background:rgba(192,132,252,0.1); border-left:4px solid #c084fc; padding:1.25rem 1.5rem; margin-bottom:1rem; border-radius:8px; line-height:1.6; }

        .completion-section { text-align:center; padding:2rem; }
        .complete-btn-large { background:linear-gradient(135deg, #10b981, #059669); border:none; color:#fff; padding:1.25rem 3rem; border-radius:16px; font-size:1.1rem; font-weight:700; cursor:pointer; transition:all 0.3s; box-shadow:0 8px 24px rgba(16,185,129,0.3); }
        .complete-btn-large:hover { transform:translateY(-4px); box-shadow:0 12px 32px rgba(16,185,129,0.4); }

        @media (max-width: 768px) {
          .quick-wins-grid { grid-template-columns:1fr; }
          .resources-grid { grid-template-columns:1fr; }
        }

      `}</style>
    </div>
  );
};

export default SkillBridgeApp;
