// pages/api/analyze-resume.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "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",
});


const COLORS = ["#818cf8", "#10b981", "#c084fc", "#fbbf24"];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { resumeText, pdfBase64 } = req.body || {};

  let textToAnalyze = resumeText;

  // If PDF is provided, parse it first
  if (pdfBase64) {
    try {
      const pdfExtract = require('pdf-extraction');
      const pdfBuffer = Buffer.from(pdfBase64, 'base64');

      const data = await pdfExtract(pdfBuffer);
      textToAnalyze = data.text;

      console.log("Extracted text from PDF:", textToAnalyze.substring(0, 500));
    } catch (pdfError) {
      console.error("PDF parsing error:", pdfError);
      return res.status(400).json({
        error: "Failed to parse PDF",
        detail: pdfError.message
      });
    }
  }

  if (!textToAnalyze || typeof textToAnalyze !== "string") {
    return res.status(400).json({ error: "resumeText or pdfBase64 is required" });
  }

  try {
    const systemPrompt = `
You are a careers + future-of-work coach. You analyze a CV and map it to 5 future-proof skills:

1) Digital & Technological Literacy
2) Critical Thinking & Problem-Solving
3) Adaptability & Continuous Learning
4) Emotional Intelligence (EQ) & Collaboration
5) Creativity & Innovation

Return STRICT JSON with:
{
  "candidateName": string,
  "currentRole": string,
  "yearsExperience": number,
  "summary": string,
  "skillsExtracted": string[],
  "automationRisk": number (0-100, where 100 = high risk of automation),
  "futureProofScore": number (0-100, calculated as: 100 - automationRisk + average of skillScores),
  "skillScores": [
    {
      "skill": string (must be one of the 5 skills listed above),
      "score": number (0-100),
      "evidence": string,
      "why": string
    }
  ],
  "top3ToDevelop": string[],
  "careerIdeas": [
    {
      "id": string,
      "title": string,
      "type": "upskill" | "pivot",
      "description": string,
      "automationRisk": number (0-100),
      "salaryChange": string (e.g., "+20-30%", "-10%", "Similar"),
      "timeToTransition": string (e.g., "6-12 months", "1-2 years"),
      "skillsFromCurrent": string[] (SPECIFIC technical AND soft skills they ALREADY have that transfer, e.g., "Python programming", "Project management", "Stakeholder communication"),
      "skillsToAdd": string[] (SPECIFIC technical AND soft skills they NEED to learn, mix of both technical tools/frameworks AND soft skills, e.g., "React.js", "Docker", "Strategic thinking", "Executive communication", "Machine learning fundamentals"),
      "demandScore": number (0-100, market demand for this role)
    }
  ]
}

CRITICAL: You MUST provide EXACTLY 4 DIVERSE career paths in the careerIdeas array.

REALISM RULES - VERY IMPORTANT:
- Look at their ACTUAL years of experience and current level
- Junior/Intern (0-2 years): Cannot jump to "Senior" or "Lead" roles. Suggest Junior → Mid-level or entry roles in new fields
- Mid-level (3-5 years): Can move to senior IC roles or team lead, but NOT VP/Director
- Senior (6-10 years): Can move to Staff/Principal or management, but NOT C-suite
- Leadership (10+ years): Can consider executive roles
- Time-to-transition must match the jump: Intern → Senior is NOT possible in 1-2 years. Be honest about 3-5 year timelines for big jumps.
- If they're an intern/junior, upskilling means moving to mid-level or junior+ roles, NOT senior/lead
- Salary changes should be realistic: Intern → Mid-level might be +40-60%, but Intern → "Senior" is unrealistic

AUTOMATION RISK RULES - CRITICAL:
- Career paths should generally have LOWER automation risk than the current role (we want safer careers!)
- If current role has 60% automation risk, suggest paths with 30-50% risk (LOWER is better)
- Only suggest paths with HIGHER risk if they pay significantly more and are clearly stepping stones
- Aim for at least 2-3 paths with LOWER automation risk than current
- Roles with lower automation risk: creative work, strategic roles, people management, healthcare, education, consulting
- Roles with higher automation risk: data entry, repetitive tasks, rule-based work

Career Path Diversity Requirements:
1. First path: "Upskill" - REALISTIC progression in their current field based on experience level
   - Intern/Junior → Mid-level or Junior+ (NOT Senior)
   - Mid → Senior IC or Team Lead
   - Senior → Staff/Principal or Manager

2. Second path: "Pivot to Adjacent" - Move to a related field using transferable skills at APPROPRIATE level
   - Junior engineer → Junior product manager or technical writer
   - Mid-level teacher → instructional designer
   - Senior salesperson → customer success leader

3. Third path: "Cross-Industry Pivot" - Apply skills to a COMPLETELY DIFFERENT industry at APPROPRIATE level
   - Junior tech → junior healthtech role
   - Mid finance → fintech consulting
   - Senior teaching → corporate training manager

4. Fourth path: "Entrepreneurial/Freelance" - Independent work appropriate to experience level
   - Junior: Freelancer building portfolio
   - Mid: Freelance consultant or small business
   - Senior: Fractional executive or established consultancy

DO NOT only suggest tech jobs! Consider:
- Healthcare (clinical roles, health admin, medical technology)
- Education (teaching, training, curriculum design)
- Creative industries (design, content, media)
- Business/Consulting (strategy, operations, sales)
- Non-profit/Social impact
- Government/Public sector
- Finance/Legal
- Skilled trades (if transferable skills exist)

CRITICAL RULES for skillsFromCurrent and skillsToAdd:
- Be SPECIFIC and PRACTICAL. Don't say "communication" - say "client presentations" or "cross-team collaboration"
- Include a MIX of technical skills (tools, languages, frameworks) AND soft skills (leadership, strategy, etc.)
- For technical roles: include specific technologies, programming languages, tools
- For non-tech roles: include industry-specific skills like "regulatory compliance", "patient care protocols", "lesson planning", "fundraising strategy"
- skillsFromCurrent should have 4-8 items that the person demonstrably has based on their resume
- skillsToAdd should have 4-8 items representing the gap to the new role
- Make sure skillsToAdd are learnable within the timeToTransition period

Additional Rules:
- Only use the 5 skills listed above in skillScores/skill and top3ToDevelop.
- Make the JSON valid and parseable. Do not include any extra keys.
- Calculate automationRisk based on how repetitive/rule-based vs creative/interpersonal the role is
- Calculate futureProofScore as: (100 - automationRisk) + (average of all skillScores / 2)
- If something is missing from the resume, make a reasonable guess but mention uncertainty in the "why".
- REMEMBER: Provide EXACTLY 4 different career paths, not 1 or 2. The diversity creates the "butterfly effect" visualization.
`;

    const userPrompt = `Here is the resume text to analyze:\n\n"""${textToAnalyze.slice(
      0,
      8000
    )}"""`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const content = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);

    if (!Array.isArray(parsed.skillScores)) {
      return res
        .status(500)
        .json({ error: "Model returned invalid shape" });
    }

    // ---- map AI response -> UI-friendly object ----
    const name = parsed.candidateName || "";
    const currentRole = parsed.currentRole || "";
    const automationRisk =
      typeof parsed.automationRisk === "number"
        ? parsed.automationRisk
        : 0;

    // Calculate Future-Proof Score from AI or calculate it ourselves
    let futureProofScore = parsed.futureProofScore;
    if (typeof futureProofScore !== "number" && Array.isArray(parsed.skillScores)) {
      // Fallback calculation if AI didn't provide it
      const avgSkillScore = parsed.skillScores.reduce((sum, s) => sum + (s.score || 0), 0) / parsed.skillScores.length;
      futureProofScore = Math.round((100 - automationRisk) + (avgSkillScore / 2));
    }
    futureProofScore = Math.min(100, Math.max(0, futureProofScore || 0));

    const skills = parsed.skillsExtracted || [];
    const skillScores = parsed.skillScores || [];

    const ideas = Array.isArray(parsed.careerIdeas)
      ? parsed.careerIdeas
      : [];

    const careerPaths = ideas.slice(0, 4).map((idea, idx) => ({
      id: idea.id || `path-${idx}`,
      title: idea.title || `Path ${idx + 1}`,
      description: idea.description || "",
      automationRisk:
        typeof idea.automationRisk === "number"
          ? idea.automationRisk
          : null,
      salaryIncrease: idea.salaryChange || "",
      timeToTransition: idea.timeToTransition || "",
      skillsNeeded: idea.skillsToAdd || [],
      skillsFromCurrent: idea.skillsFromCurrent || [],
      demandScore: typeof idea.demandScore === "number" ? idea.demandScore : null,
      color: COLORS[idx % COLORS.length],
    }));

    const mapped = {
      name,
      currentRole,
      automationRisk,
      futureProofScore,
      skills,
      skillScores,
      careerPaths,
    };

    // helpful while debugging
    console.log("Mapped payload sent to frontend:", mapped);

    return res.status(200).json(mapped);
  } catch (err) {
    console.error("OpenAI error:", err);
    return res.status(500).json({
      error: "Failed to analyze resume",
      detail: err?.message || "Unknown error",
    });
  }
}
