// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromToken, saveFile, errorResponse } from '@/utils/utils';
import UserMovies from '@/db/models/usermovies';
import moment from 'moment';

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const fileEntry: File | null = formData.get('file') as File;
    const metadata: string = formData.get('metadata') as string;

    const token: string = req.cookies.get('token')?.value || '';
    const userId: string | null = getUserIdFromToken(token);

    if (!userId || isNaN(Number(userId))) {
      return errorResponse('Invalid userId.', 400);
    }

    let parsedMetadata;
    try {
      parsedMetadata = JSON.parse(metadata);
    } catch {
      return errorResponse('Invalid metadata format.', 400);
    }

    const { title, publishingYear, movieId, image } = parsedMetadata;

    if (movieId) {
      if (!fileEntry && !image) return errorResponse('No valid file received.', 400);
    } else if (!fileEntry) return errorResponse('No valid file received.', 400);

    if (!title || typeof title !== 'string') {
      return errorResponse('Invalid title.', 400);
    }

    const parsedPublishingYear = moment(publishingYear, 'YYYY-MM-DD', true).toDate();
    if (isNaN(parsedPublishingYear.getTime())) {
      return errorResponse('Invalid publishing year.', 400);
    }

    const filename = fileEntry ? await saveFile(fileEntry) : image;

    if (movieId) {
      const existingMovie = await UserMovies.findOne({ where: { id: Number(movieId) } });
      if (existingMovie) {
        await existingMovie.update({
          image: filename,
          title: title,
          publishingYear: parsedPublishingYear,
        });
        return NextResponse.json({ message: 'Movie updated successfully.', status: 200 });
      } else {
        return errorResponse('Movie not found.', 404);
      }
    } else {
      await UserMovies.create({
        userId: Number(userId),
        image: filename,
        title: title,
        publishingYear: parsedPublishingYear,
      });
      return NextResponse.json({ message: 'Movie created successfully.', status: 201 });
    }
  } catch (error) {
    console.error('Error occurred ', error);
    return errorResponse('Failed to process request.', 500);
  }
};
