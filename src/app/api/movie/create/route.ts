import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromToken, saveFile, deleteFile, errorResponse } from '@/utils/utils';
import UserMovies from '@/db/models/usermovies';

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const fileEntry = formData.get('file') as File | null;
    const metadata = formData.get('metadata') as string;

    const token = req.cookies.get('token')?.value || '';
    const userId = getUserIdFromToken(token);
    if (!userId || isNaN(Number(userId))) {
      return errorResponse('Invalid userId.', 400);
    }

    const { title, publishingYear, movieId } = JSON.parse(metadata);
    if (!title || typeof title !== 'string') {
      return errorResponse('Invalid title.', 400);
    }

    const parsedPublishingYear = parseInt(publishingYear, 10);
    if (isNaN(parsedPublishingYear) || parsedPublishingYear.toString().length !== 4) {
      return errorResponse('Invalid publishing year.', 400);
    }

    let filename: string | undefined;
    if (fileEntry) {
      filename = await saveFile(fileEntry);
    }

    const movieData = {
      title,
      publishingYear: parsedPublishingYear,
      ...(filename && { image: filename }),
    };

    if (movieId) {
      const existingMovie = await UserMovies.findOne({ where: { id: Number(movieId) } });
      if (!existingMovie) {
        return errorResponse('Movie not found.', 404);
      }

      if (filename && existingMovie.image) {
        await deleteFile(existingMovie.image); // Delete the old image if a new one is uploaded
      }

      await existingMovie.update(movieData);
      return NextResponse.json({ message: 'Movie updated successfully.', status: 200 });
    } else {
      if (!filename) {
        return errorResponse('File is required for creating a new movie.', 400);
      }

      await UserMovies.create({
        userId: Number(userId),
        ...movieData,
      });

      return NextResponse.json({ message: 'Movie created successfully.', status: 201 });
    }
  } catch (error) {
    console.error('Error occurred', error);
    return errorResponse('Failed to process request.', 500);
  }
};
