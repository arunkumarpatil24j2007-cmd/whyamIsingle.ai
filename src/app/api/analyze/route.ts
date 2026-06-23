import { NextResponse } from 'next/server';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { saveAnalysisResult } from '@/lib/db';
import { getCache, setCache } from '@/lib/cache';

const analyzeRequestSchema = z.object({
  instagram: z.string().optional().default('anonymous'),
  age: z.number().min(18).max(100),
  height: z.number().min(100).max(250),
  imageUrl: z.string().url(),
});

// Mock analysis generator in case GEMINI_API_KEY is not set or fails
function generateMockAnalysis(instagram: string, age: number, height: number) {
  const score = Math.floor(Math.random() * 40) + 55; // 55 - 95
  const marriage = Math.floor(Math.random() * 30) + 65; // 65 - 95
  const situationship = Math.floor(Math.random() * 40) + 10; // 10 - 50

  const greenFlags = [
    'Uses correct punctuation in text messages.',
    'Has a dedicated savings account for a dog he doesn\'t own yet.',
    'Can cook a signature dish that isn\'t just instant noodles.',
    'Always puts his phone face down but doesn\'t lock it.',
    'Listens to your long stories without trying to solve the problem.'
  ];

  const redFlags = [
    'Replies 4 hours late with "sorry was sleeping" at 6 PM.',
    'Has a curated Spotify playlist for "late night drives" but drives a hatchback.',
    'His Instagram bio contains only his coordinates or a single emoji.',
    'Refuses to drink tap water under any circumstances.',
    'Sends voice notes that are either 2 seconds or 4 minutes long.'
  ];

  const assumptions = [
    'Girls probably assume he is a player, but he just gets distracted by Wikipedia holes.',
    'People assume he spends weekend nights partying, but he\'s actually building side projects in dark mode.',
    'Girls assume he\'s high maintenance, but his happiness is entirely dependent on garlic bread.'
  ];

  const whoWouldLikeYou = `A highly organized creative girl who works in design, reads thriller novels, and needs someone who is spontaneous but keeps his promises.`;

  const relationshipPotential = score > 80 ? 'Extremely High (Future Husband Material)' : 'Moderate (Needs guidance, but has potential)';

  // Shuffle and pick subset
  const selectedGreen = greenFlags.sort(() => 0.5 - Math.random()).slice(0, 3);
  const selectedRed = redFlags.sort(() => 0.5 - Math.random()).slice(0, 3);
  const selectedAssumptions = assumptions.sort(() => 0.5 - Math.random()).slice(0, 2);

  return {
    singleScore: score,
    greenFlags: selectedGreen,
    redFlags: selectedRed,
    assumptions: selectedAssumptions,
    whoWouldLikeYou,
    marriageScore: marriage,
    situationshipRisk: situationship,
    relationshipPotential,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = analyzeRequestSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: 'Invalid input parameters', details: validated.error.format() }, { status: 400 });
    }

    const { instagram, age, height, imageUrl } = validated.data;
    
    // Check cache
    const cacheKey = `analysis:${imageUrl}:${age}:${height}:${instagram.toLowerCase()}`;
    const cachedResult = await getCache(cacheKey);

    if (cachedResult) {
      return NextResponse.json(JSON.parse(cachedResult));
    }

    let analysis: {
      singleScore: number;
      greenFlags: string[];
      redFlags: string[];
      assumptions: string[];
      whoWouldLikeYou: string;
      marriageScore: number;
      situationshipRisk: number;
      relationshipPotential: string;
    };

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey !== 'mock') {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // Using gemini-1.5-flash or gemini-2.5-flash (both support vision and structured JSON outputs)
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: {
            responseMimeType: 'application/json',
          },
        });

        // Fetch target image and convert to Base64
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
          throw new Error(`Failed to fetch image from URL: ${imageUrl}`);
        }
        const arrayBuffer = await imageResponse.arrayBuffer();
        const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg';
        const base64Data = Buffer.from(arrayBuffer).toString('base64');

        const prompt = `
          You are an elite, highly perceptive, and slightly sarcastic relationship analyst. 
          Analyze this person's uploaded image. They are a ${age}-year-old with a height of ${height} cm, and Instagram handle: "${instagram}".
          
          Generate a detailed and humorous singlehood analysis.
          Return a JSON object conforming exactly to this structure:
          {
            "singleScore": number (0 to 100, representing how likely they are to remain single. Higher = more single),
            "greenFlags": string[] (3 premium, endearing green flags deduced from their vibe),
            "redFlags": string[] (3 funny, non-toxic red flags/quirks deduced from their vibe),
            "assumptions": string[] (2 funny assumptions that girls/people probably make about them based on this photo),
            "whoWouldLikeYou": string (description of the type of person who would actually date/like them),
            "marriageScore": number (0 to 100, marriage material rating),
            "situationshipRisk": number (0 to 100, situationship risk rating),
            "relationshipPotential": string (1-sentence summary of their relationship path)
          }
          
          Do not include markdown blocks or backticks. Return raw JSON. Keep the vibe upscale, Nothing-phone style, and witty.
        `;

        const result = await model.generateContent([
          prompt,
          {
            inlineData: {
              data: base64Data,
              mimeType,
            },
          },
        ]);

        const textResponse = result.response.text();
        analysis = JSON.parse(textResponse);
      } catch (err) {
        console.warn('Gemini vision API error, falling back to mock generator:', err);
        analysis = generateMockAnalysis(instagram, age, height);
      }
    } else {
      // API Key is not configured, use local mock generator
      analysis = generateMockAnalysis(instagram, age, height);
      // Add a slight latency to simulate AI thinking
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    // Save to Database
    const dbRecord = await saveAnalysisResult({
      instagram,
      age,
      height,
      imageUrl,
      ...analysis,
    });

    // Save to Cache
    await setCache(cacheKey, JSON.stringify(dbRecord), 86400); // Cache for 24 hours

    return NextResponse.json(dbRecord);
  } catch (error: any) {
    console.error('API Error in analyze route:', error);
    return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
  }
}
