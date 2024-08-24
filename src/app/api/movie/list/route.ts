// app/api/movies/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromToken, errorResponse } from '@/utils/utils';
import UserMovies from '@/db/models/usermovies';

export const GET = async (req: NextRequest) => {
  try {
    const token = req.cookies.get('token')?.value || '';
    const userId = getUserIdFromToken(token);

    if (!userId || isNaN(Number(userId))) {
      return errorResponse('Invalid userId.', 400);
    }

    const page = Number(req.nextUrl.searchParams.get('page')) || 1;
    const limit = Number(req.nextUrl.searchParams.get('limit')) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: movies } = await UserMovies.findAndCountAll({
      where: { userId: Number(userId) },
      limit,
      offset,
    });

    if (movies.length === 0) {
      return errorResponse('No movies found for this user.', 404);
    }

    return NextResponse.json(
      {
        movies,
        pagination: {
          totalItems: count,
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          itemsPerPage: limit,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error occurred while fetching movies:', error);
    return errorResponse('Internal server error', 500);
  }
};
