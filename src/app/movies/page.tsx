'use client';

//libs
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

//custom componet
import Footer from '@/components/ui/footer/footer';
import plus_svg from '../../assets/images/plus.svg';
import logout_svg from '../../assets/images/logout.svg';
import edit_svg from '../../assets/images/edit.svg';

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

function UserDashboard() {
  const router = useRouter();

  const [moviesList, setMoviesList] = useState<Movie[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ totalItems: 0, totalPages: 0, currentPage: 1, itemsPerPage: 4 });
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMovies = async (page: number = 1) => {
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
    setLoading(true);
    fetchMovies(page);
  };

  const handleEditClick = (movieId: number) => {
    // Navigate to the edit page with the movie ID
    router.push(`/movies/${movieId}`);
  };

  const logout = async () => {
    try {
      await axios.get('/api/users/logout');
      router.push('/');
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <>
      {!loading &&
        (moviesList?.length ?? 0 > 0 ? (
          <section className={'movie-list'}>
            <div className={'container'}>
              <div className={'list-header'}>
                <div className={'headings'}>
                  <h2 className={'title'}>My movies</h2>
                  <Image src={plus_svg} alt="add" width={24} height={24} className={'add'} onClick={() => router.push('/movies/create')} />
                </div>
                <div className={'logout'} onClick={logout}>
                  <span>Logout</span>
                  <Image src={logout_svg} alt="logout" width={24} height={24} />
                </div>
              </div>
              <div className={'list-wrapper'}>
                {moviesList.map((movie) => (
                  <div key={movie.id} className={'movie-card'}>
                    <div className={'card-image'}>
                      <Image
                        src={`/uploads/${movie.image}`} // Correct path for images
                        alt={movie.title}
                        width={200} // Set appropriate width
                        height={300} // Set appropriate height
                        className={'movie-poster'}
                      />
                    </div>
                    <div className={'movie-details'}>
                      <div>
                        <h4 className={'movie-name'}>{movie.title}</h4>
                        <p className={'releasing-date'}>{new Date(movie.publishingYear).getFullYear()}</p>
                      </div>
                      <Image src={edit_svg} alt="edit" width={20} height={20} className={'edit'} onClick={() => handleEditClick(movie.id)} />
                    </div>
                  </div>
                ))}
              </div>
              <nav>
                <ul className={'pagination'}>
                  <li className={'page-item'}>
                    <button
                      className={'page-link'}
                      disabled={pagination.currentPage === 1}
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      aria-label="Previous"
                    >
                      <span aria-hidden="true">Prev</span>
                    </button>
                  </li>
                  {Array.from({ length: pagination.totalPages }).map((_, index) => (
                    <li key={index} className={`page-item pg-number ${pagination.currentPage === index + 1 ? 'active' : ''}`}>
                      <button className={'page-link'} onClick={() => handlePageChange(index + 1)}>
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  <li className={'page-item'}>
                    <button
                      className={'page-link'}
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
        ) : (
          <div className="center">
            <h2>Your movie list is empty</h2>
            <button type="button" className="button button-green" onClick={() => router.push('/movies/create')}>
              Add a new movie
            </button>
          </div>
        ))}
      <Footer />
    </>
  );
}

export default UserDashboard;
