import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

export interface AnalysisResultInput {
  instagram: string;
  age: number;
  height: number;
  imageUrl: string;
  singleScore: number;
  greenFlags: string[];
  redFlags: string[];
  assumptions: string[];
  whoWouldLikeYou: string;
  marriageScore: number;
  situationshipRisk: number;
  relationshipPotential: string;
}

export interface AnalysisResultRecord extends AnalysisResultInput {
  id: string;
  createdAt: Date;
}

const mockDbPath = path.join(process.cwd(), 'prisma', 'mock-db.json');

// Check if PostgreSQL Database URL is provided
const hasDbUrl = !!process.env.DATABASE_URL && process.env.DATABASE_URL !== 'mock';

// Singleton instance setup for PrismaClient with pg adapter
let prisma: PrismaClient | null = null;

if (hasDbUrl) {
  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    
    const globalForPrisma = global as unknown as { prisma: PrismaClient };
    prisma = globalForPrisma.prisma || new PrismaClient({ adapter });
    
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prisma;
    }
  } catch (error) {
    console.error('Failed to initialize Prisma Client with PostgreSQL adapter:', error);
  }
}

// Fallback JSON-based Database helper
function readMockDb(): AnalysisResultRecord[] {
  try {
    if (!fs.existsSync(mockDbPath)) {
      // Ensure prisma directory exists
      fs.mkdirSync(path.dirname(mockDbPath), { recursive: true });
      fs.writeFileSync(mockDbPath, JSON.stringify([]));
      return [];
    }
    const data = fs.readFileSync(mockDbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to read local mock database:', error);
    return [];
  }
}

function writeMockDb(data: AnalysisResultRecord[]): void {
  try {
    fs.mkdirSync(path.dirname(mockDbPath), { recursive: true });
    fs.writeFileSync(mockDbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Failed to write to local mock database:', error);
  }
}

// Global Database API Methods
export async function saveAnalysisResult(input: AnalysisResultInput): Promise<AnalysisResultRecord> {
  if (prisma) {
    try {
      const record = await prisma.analysisResult.create({
        data: {
          ...input,
          greenFlags: JSON.stringify(input.greenFlags),
          redFlags: JSON.stringify(input.redFlags),
          assumptions: JSON.stringify(input.assumptions),
        },
      });
      
      return {
        ...record,
        greenFlags: JSON.parse(record.greenFlags),
        redFlags: JSON.parse(record.redFlags),
        assumptions: JSON.parse(record.assumptions),
      };
    } catch (error) {
      console.warn('Prisma insert failed, falling back to local JSON database:', error);
    }
  }

  // Fallback Mode
  const mockDb = readMockDb();
  const newRecord: AnalysisResultRecord = {
    id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
    ...input,
    createdAt: new Date(),
  };

  mockDb.push(newRecord);
  writeMockDb(mockDb);
  return newRecord;
}

export async function getAnalysisResult(id: string): Promise<AnalysisResultRecord | null> {
  if (prisma) {
    try {
      const record = await prisma.analysisResult.findUnique({
        where: { id },
      });
      if (record) {
        return {
          ...record,
          greenFlags: JSON.parse(record.greenFlags),
          redFlags: JSON.parse(record.redFlags),
          assumptions: JSON.parse(record.assumptions),
        };
      }
      return null;
    } catch (error) {
      console.warn('Prisma query failed, falling back to local JSON database:', error);
    }
  }

  // Fallback Mode
  const mockDb = readMockDb();
  const record = mockDb.find((item) => item.id === id);
  if (record) {
    return {
      ...record,
      createdAt: new Date(record.createdAt), // Ensure Date object
    };
  }
  return null;
}
