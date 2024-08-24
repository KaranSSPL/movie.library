// utils.ts
import jwt from 'jsonwebtoken';
import { writeFile } from 'fs/promises';
import path from 'path';

// Constants
const JWT_SECRET = 'secretjwtkey1990bdhbhd625313';

// Utility function to extract user ID from token
export const getUserIdFromToken = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    return decoded.id || null;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

// Utility function to create and sign a JWT token
export const createToken = (data: object, expiresIn: string = '1d'): string => {
  return jwt.sign(data, JWT_SECRET, { expiresIn });
};

// Utility function to handle file saving
export const saveFile = async (file: File): Promise<string> => {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.-]/g, '_');
  const fileExtension = path.extname(file.name);
  const filename = `${timestamp}${fileExtension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(process.cwd(), 'public/uploads/', filename), buffer);
  return filename;
};

// Utility function for standard error responses
export const errorResponse = (message: string, status: number) => {
  return new Response(JSON.stringify({ error: message }), { status });
};
