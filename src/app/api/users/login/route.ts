// app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createToken } from '@/utils/utils';
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
    const { email, password }: LoginRequestBody = await request.json();

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) return errorResponse('Invalid email/password', 401);

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return errorResponse('Invalid email/password', 401);

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
    console.log(error);

    console.error('Error occurred during login:', error);
    return errorResponse('Internal server error', 500);
  }
};
