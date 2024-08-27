'use client';

//libs
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

// Custom Component
import Footer from '@/components/ui/footer/footer';

// Styles
import '../../../assets/scss/globals.scss';
import fileDownloadIcon from '../../../assets/images/file-download.svg';

function MovieEdit() {
  const router = useRouter();
  const { movieId } = useParams(); // Extract ID using useParams

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [publishingYear, setPublishingYear] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Track loading state
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ title?: string; publishingYear?: string }>({});

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true); // Start loading when fetching details
      try {
        const response = await fetch(`/api/movie/${movieId}`);
        if (response.ok) {
          const movie = await response.json();
          setTitle(movie.title);
          setPublishingYear(String(movie.publishingYear));
          setExistingImage(movie.image); // Store the existing image filename
          setPreviewUrl(`/uploads/${movie.image}`);
        } else {
          console.error('Failed to fetch movie details:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false); // Stop loading when done
      }
    };

    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl(existingImage ? `/uploads/${existingImage}` : null);
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    if (errors.title) {
      setErrors((prevErrors) => ({ ...prevErrors, title: '' }));
    }
  };

  const handlePublishingYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPublishingYear(event.target.value);
    if (errors.publishingYear) {
      setErrors((prevErrors) => ({ ...prevErrors, publishingYear: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { title?: string; publishingYear?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required.';
    } else if (title.length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters.';
    }

    // Validate publishing year (YYYY format)
    const parsedYear = parseInt(publishingYear, 10);
    if (isNaN(parsedYear) || publishingYear.length !== 4) {
      newErrors.publishingYear = 'Publishing year must be a 4-digit year.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearForm = () => {
    setFile(null);
    setTitle('');
    setPublishingYear('');
    setPreviewUrl(existingImage ? `/uploads/${existingImage}` : null);

    const fileInput = document.getElementById('my-file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }

    // Reset errors
    setErrors({});
  };

  const handleCancel = () => {
    clearForm();
    router.push('/movies');
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true); // Set loading state to true when submitting
    const formData = new FormData();
    // Append new file only if it’s different from the existing one
    if (file && existingImage && file.name !== existingImage) {
      formData.append('file', file);
    }

    const metadata = JSON.stringify({
      title,
      publishingYear: publishingYear,
      movieId: movieId,
    });

    formData.append('metadata', metadata);

    try {
      const response = await fetch(`/api/movie/create`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        router.push('/movies');
        clearForm();
      } else {
        const result = await response.json();
        alert(`Error: ${result.error || 'Something went wrong'}`);
      }
    } catch (error) {
      alert('Network error: Please try again later.');
      console.error('Error:', error);
    } finally {
      setLoading(false); // Set loading state to false when done
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreviewUrl(null)
  };

  return (
    <>
      <section className="add-edit">
        <div className="container">
          <div className="list-header">
            <div className="headings">
              <h2 className="title">Edit Movie</h2>
            </div>
          </div>
          <div className="drop-form-wrapper">
            <div className="drop-bx">
              <input type="file" name="my-file" id="my-file" onChange={handleFileChange} />
              {previewUrl ? (
                <div className="preview-image-wrapper">
                  <Image src={previewUrl} alt="Selected image" layout="fill" objectFit="cover" className="preview-image" />
                  <span className="remove" onClick={() => handleRemoveImage()}>
                    X
                  </span>
                  <span className="title">{file !== null ? file.name : title}</span>
                </div>
              ) : (
                <>
                  <Image src={fileDownloadIcon} alt="download icon" />
                  <span>Drop an image here</span>
                </>
              )}
            </div>
            <div className="movie-form">
              <div className="input-field">
                <input
                  type="text"
                  placeholder="Title"
                  className="input"
                  value={title}
                  onChange={handleTitleChange}
                  maxLength={100} // Set max length for title
                />
                {errors.title && <p className="error-text">{errors.title}</p>}
              </div>
              <div className="input-field">
                <input
                  type="text"
                  placeholder="Publishing year"
                  className="input inline"
                  value={publishingYear}
                  onChange={handlePublishingYearChange}
                  maxLength={4} // Set max length for publishing year (YYYY)
                />
                {errors.publishingYear && <p className="error-text">{errors.publishingYear}</p>}
              </div>
              <div className="button-wrapper mobile-hidden">
                <button type="button" className="button button-bordered" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="button" className="button button-green" onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Please wait...' : 'Submit'}
                </button>
              </div>
            </div>
            <div className="button-wrapper desktop-hidden">
              <button type="button" className="button button-bordered" onClick={handleCancel}>
                Cancel
              </button>
              <button type="button" className="button button-green" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Please wait...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default MovieEdit;
