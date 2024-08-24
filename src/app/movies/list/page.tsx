'use client';

//libs
import Image from 'next/image';
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

//custom component
import Footer from '@/components/ui/footer/footer';

//style
import style from './page.module.scss';

interface Movie {
  id: number;
  userId: number;
  image: string;
  title: string;
  publishingYear: string;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

function MovieList() {
  const router = useRouter();

  const [moviesList, setMoviesList] = useState<Movie[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ totalItems: 0, totalPages: 0, currentPage: 1, itemsPerPage: 10 });
  const [loading, setLoading] = useState<boolean>(false);

  const fetchMovies = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/movie/list?page=${page}&limit=${pagination.itemsPerPage}`);
      if (response.ok) {
        const data = await response.json();
        setMoviesList(data.movies);
        setPagination({
          totalItems: data.pagination?.totalItems,
          totalPages: data.pagination.totalPages,
          currentPage: data.pagination.currentPage,
          itemsPerPage: data.pagination.itemsPerPage,
        });
      } else {
        console.error('Failed to fetch movies:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handlePageChange = (page: number) => {
    fetchMovies(page);
  };

  const handleEditClick = (movieId: number) => {
    // Navigate to the edit page with the movie ID
    router.push(`/movies/${movieId}`);
  };

  const logout = async () => {
    try {
        await axios.get('/api/users/logout')
        router.push('/')
    } catch (error:any) {
        console.log(error.message);
    }
}

  return (
    <>
      <section className={style.movie_list}>
        <div className={style.container}>
          <div className={style.list_header}>
            <div className={style.headings}>
              <h2 className={style.title}>My movies</h2>
              <Image src="/images/plus.svg" alt="add" width={24} height={24} className={style.add} />
            </div>
            <div className={style.logout} onClick={logout}>
              <span>Logout</span>
              <Image src="/images/logout.svg" alt="logout" width={24} height={24} />
            </div>
          </div>
          <div className={style.list_wrapper}>
            {loading ? (
              <p>Loading...</p>
            ) : moviesList?.length > 0 ? (
              moviesList.map((movie) => (
                <div key={movie.id} className={style.movie_card}>
                  <div className={style.card_image}>
                    <Image
                      src={`/uploads/${movie.image}`} // Correct path for images
                      alt={movie.title}
                      width={200} // Set appropriate width
                      height={300} // Set appropriate height
                      className={style.movie_poster}
                    />
                  </div>
                  <div className={style.movie_details}>
                    <div>
                      <h4 className={style.movie_name}>{movie.title}</h4>
                      <p className={style.releasing_date}>{new Date(movie.publishingYear).getFullYear()}</p>
                    </div>
                    <Image
                      src="/images/edit.svg"
                      alt="edit"
                      width={20}
                      height={20}
                      className={style.edit}
                      onClick={() => handleEditClick(movie.id)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p>No movies found.</p>
            )}
          </div>
          <nav>
            <ul className={style.pagination}>
              <li className={style.page_item}>
                <button
                  className={style.page_link}
                  disabled={pagination.currentPage === 1}
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  aria-label="Previous"
                >
                  <span aria-hidden="true">Prev</span>
                </button>
              </li>
              {Array.from({ length: pagination.totalPages }).map((_, index) => (
                <li key={index} className={`${style.page_item} ${style.pg_number} ${pagination.currentPage === index + 1 ? style.active : ''}`}>
                  <button className={style.page_link} onClick={() => handlePageChange(index + 1)}>
                    {index + 1}
                  </button>
                </li>
              ))}
              <li className={style.page_item}>
                <button
                  className={style.page_link}
                  disabled={pagination.currentPage === pagination.totalPages}
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  aria-label="Next"
                >
                  <span aria-hidden="true">Next</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default MovieList;
