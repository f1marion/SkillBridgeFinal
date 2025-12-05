// pages/api/analyze-resume.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


const COLORS = ["#818cf8", "#10b981", "#c084fc", "#fbbf24"];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { resumeText } = req.body || {};
  if (!resumeText || typeof resumeText !== "string") {
    return res.status(400).json({ error: "resumeText is required" });
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
  "automationRisk": number,
  "skillScores": [
    {
      "skill": string,
      "score": number,
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
      "automationRisk": number,
      "salaryChange": string,
      "timeToTransition": string,
      "skillsFromCurrent": string[],
      "skillsToAdd": string[],
      "demandScore": number
    }
  ]
}

Rules:
- Only use the 5 skills listed above in skillScores/skill and top3ToDevelop.
- Make the JSON valid and parseable. Do not include any extra keys.
- If something is missing from the resume, make a reasonable guess but mention uncertainty in the "why".
`;

    const userPrompt = `Here is the resume text to analyze:\n\n"""${resumeText.slice(
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
    const skills = parsed.skillsExtracted || [];

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
      color: COLORS[idx % COLORS.length],
    }));

    const mapped = {
      name,
      currentRole,
      automationRisk,
      skills,
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
