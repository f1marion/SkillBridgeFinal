// pages/api/generate-training.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: 'process.env.OPENAI_API_KEY',
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { skillName, category } = req.body || {};

  if (!skillName || typeof skillName !== "string") {
    return res.status(400).json({ error: "skillName is required" });
  }

  try {
    const systemPrompt = `
You are an innovative learning experience designer focused on PRACTICAL, hands-on skill development.

Your philosophy: 80% doing, 20% theory. People learn by building, not just watching.

Generate a dynamic, action-oriented learning plan for the skill: "${skillName}"

Return STRICT JSON with:
{
  "skillName": string,
  "tagline": string (one compelling sentence about why this skill matters NOW),
  "quickWins": string[] (3-4 things they can DO in the next 30 minutes to start learning),
  "buildProject": {
    "title": string (a real project they can build to learn this skill),
    "description": string (what they'll build and why it matters),
    "steps": string[] (4-6 concrete steps to build it),
    "timeEstimate": string (e.g., "2-3 hours", "1 weekend")
  },
  "resources": {
    "video": {
      "title": string (actual YouTube video or course title that exists),
      "creator": string (channel name or instructor),
      "duration": string,
      "searchQuery": string (YouTube search query that will find this video)
    },
    "course": {
      "title": string (actual Coursera/Udemy course that exists),
      "platform": string ("Coursera", "Udemy", "edX", etc.),
      "instructor": string,
      "searchQuery": string (search query for the platform)
    },
    "practice": {
      "title": string (interactive practice platform),
      "platform": string (e.g., "LeetCode", "CodePen", "Figma Community", "Kaggle"),
      "description": string,
      "searchQuery": string
    }
  },
  "challenges": string[] (3-4 progressively harder challenges to test mastery),
  "reflection": string[] (2-3 questions to deepen understanding after doing the work)
}

CRITICAL RULES:
1. Focus on DOING, not passive learning
2. Suggest REAL resources that actually exist (be specific with titles and creators)
3. The buildProject should be something tangible they can show off
4. quickWins should be actionable RIGHT NOW (no setup required)
5. Challenges should be specific, not vague ("Build X that does Y")
6. Resources should be free or freemium when possible
7. Make it exciting and momentum-building

For technical skills: suggest coding projects, repos to contribute to, tools to build
For soft skills: suggest role-play scenarios, real conversations to have, situations to navigate
For domain skills: suggest case studies to analyze, industry reports to read, communities to join

Make the searchQuery fields VERY specific so they'll actually find the right content.
`;

    const userPrompt = `Generate a practical, hands-on learning plan for: ${skillName}

Category context: ${category || "unknown"}

Make it action-packed and immediately useful!`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8, // More creative
    });

    const content = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);

    // Generate resource URLs
    const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(parsed.resources?.video?.searchQuery || skillName + " tutorial")}`;
    const courseraUrl = `https://www.coursera.org/search?query=${encodeURIComponent(parsed.resources?.course?.searchQuery || skillName)}`;
    const practiceUrl = getPracticeUrl(parsed.resources?.practice?.platform, parsed.resources?.practice?.searchQuery || skillName);

    const response = {
      ...parsed,
      resourceUrls: {
        youtube: youtubeUrl,
        course: courseraUrl,
        practice: practiceUrl,
      }
    };

    console.log("Generated training for:", skillName);
    return res.status(200).json(response);

  } catch (err) {
    console.error("Training generation error:", err);
    return res.status(500).json({
      error: "Failed to generate training",
      detail: err?.message || "Unknown error",
    });
  }
}

function getPracticeUrl(platform, query) {
  const encodedQuery = encodeURIComponent(query);

  switch (platform?.toLowerCase()) {
    case 'leetcode':
      return `https://leetcode.com/problemset/?search=${encodedQuery}`;
    case 'codepen':
      return `https://codepen.io/search/pens?q=${encodedQuery}`;
    case 'kaggle':
      return `https://www.kaggle.com/search?q=${encodedQuery}`;
    case 'figma':
    case 'figma community':
      return `https://www.figma.com/community/search?model_type=files&q=${encodedQuery}`;
    case 'github':
      return `https://github.com/search?q=${encodedQuery}`;
    case 'stack overflow':
      return `https://stackoverflow.com/search?q=${encodedQuery}`;
    default:
      return `https://www.google.com/search?q=${encodedQuery}+practice`;
  }
}
