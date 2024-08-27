//libs
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';

//utils and lib
import { dbConnect } from '@/lib/dbConnect';
import { createToken } from '@/utils/utils';

//models
import User from '@/db/models/user';

interface LoginRequestBody {
  email: string;
  password: string;
}

// Utility function for error responses
function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    // Connect to the database
    await dbConnect();
    
    const { email, password }: LoginRequestBody = await request.json();

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) return errorResponse('User does not exist', 400);

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return errorResponse('Invalid password', 400);

    // Create and sign the token
    const token = createToken({ id: user.id, email: user.email });

    // Create a response and set the cookie
    const response = NextResponse.json({
      message: 'Login successful',
      success: true,
    });

    response.cookies.set('token', token, { httpOnly: true });

    return response;
  } catch (error) {
    console.error('Error occurred during login:', error);
    return errorResponse('Internal server error', 500);
  }
};
