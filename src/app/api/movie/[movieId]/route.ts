import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromToken, errorResponse } from '@/utils/utils';
import UserMovies from '@/db/models/usermovies';

export const GET = async (req: NextRequest, context: { params: { movieId: string } }) => {
  try {
    const token = req.cookies.get('token')?.value || '';
    const userId = Number(getUserIdFromToken(token));
    const movieId = Number(context.params.movieId);

    if (!userId || isNaN(userId)) {
      return errorResponse('Invalid userId.', 400);
    }

    if (!movieId || isNaN(movieId)) {
      return errorResponse('Invalid movieId.', 400);
    }

    const movie: UserMovies | null = await UserMovies.findOne({ where: { userId: userId, id: movieId } });

    if (movie === null) {
      return errorResponse(`No movie found for movie Id ${movieId} and user Id ${userId}.`, 404);
    }

    return NextResponse.json(movie, { status: 200 });
  } catch (error) {
    console.error('Error occurred while fetching movies:', error);
    return errorResponse('Internal server error', 500);
  }
};
