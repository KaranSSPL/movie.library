import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromToken, errorResponse } from '@/utils/utils';
import UserMovies from '@/db/models/usermovies';

export const GET = async (req: NextRequest, { params }: { params: { movieId: string } }) => {
  try {
    const token = req.cookies.get('token')?.value || '';
    const userId = getUserIdFromToken(token);

    if (!userId || isNaN(Number(userId))) {
      return errorResponse('Invalid userId.', 400);
    }

    const movieId = Number(params.movieId);

    if (isNaN(movieId)) {
      return errorResponse('Invalid movie ID.', 400);
    }

    const movie = await UserMovies.findOne({
      where: { userId: Number(userId), id: movieId },
    });

    if (!movie) {
      return errorResponse('Movie not found.', 404);
    }

    return NextResponse.json(movie, { status: 200 });
  } catch (error) {
    console.error('Error occurred while fetching movie details:', error);
    return errorResponse('Internal server error', 500);
  }
};
