//libs
import path from 'path';
import jwt from 'jsonwebtoken';
import { unlink } from 'fs/promises';
import { writeFile } from 'fs/promises';

// Constants
const JWT_SECRET = process.env.JWT_SECRET as string;

// Utility function to extract user ID from token
export const getUserIdFromToken = (token: string): string | null => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
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
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
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

// Utility function to handle file deletion
export const deleteFile = async (filename: string): Promise<void> => {
  const filePath = path.join(process.cwd(), 'public/uploads/', filename);
  try {
    await unlink(filePath);
    console.log(`File ${filename} deleted successfully`);
  } catch (error) {
    console.error(`Failed to delete file ${filename}:`, error);
  }
};

// Utility function for standard error responses
export const errorResponse = (message: string, status: number) => {
  return new Response(JSON.stringify({ error: message }), { status });
};
