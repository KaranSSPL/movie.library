// app/api/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Create a response object with the logout message
    const response = NextResponse.json({
      message: 'Logout successful',
      success: true,
    });

    // Clear the token cookie by setting its value to an empty string and setting an expiration date in the past
    response.cookies.set('token', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/', // Ensure the cookie is cleared from all paths
    });

    return response;
  } catch (error: any) {
    // Handle any errors that occur
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
