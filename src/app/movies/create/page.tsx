'use client';

//libs
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import moment from 'moment';

// Custom Component
import Footer from '@/components/ui/footer/footer';

// Styles
import '../../../assets/scss/globals.scss';
import fileDownloadIcon from '../../../assets/images/file-download.svg';

function MovieCreation() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [publishingYear, setPublishingYear] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ title?: string; publishingYear?: string }>({});
  const [loading, setLoading] = useState(false);

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
      setPreviewUrl(null);
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

    if (!/^\d{4}$/.test(publishingYear)) {
      newErrors.publishingYear = 'Publishing year must be a 4-digit year.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearForm = () => {
    setFile(null);
    setTitle('');
    setPublishingYear('');
    setPreviewUrl(null);

    // Reset the file input element's value to force re-selection of the same file
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

    setLoading(true);

    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }

    const metadata = JSON.stringify({
      title,
      publishingYear,
      movieId: null,
    });

    formData.append('metadata', metadata);

    try {
      const response = await fetch('/api/movie/create', {
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
      setLoading(false);
    }
  };

  return (
    <>
      <section className="add-edit">
        <div className="container">
          <div className="list-header">
            <div className="headings">
              <h2 className="title">Create a new movie</h2>
            </div>
          </div>
          <div className="drop-form-wrapper">
            <div className="drop-bx">
              <input type="file" name="my-file" id="my-file" onChange={handleFileChange} />
              {previewUrl ? (
                <div className="preview-image-wrapper">
                  <Image src={previewUrl} alt="Selected image" layout="fill" objectFit="cover" className="preview-image" />
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
                  value={title}
                  className={`input ${errors.title ? 'input-error' : ''}`}
                  onChange={handleTitleChange}
                  maxLength={100}
                />
                {errors.title && <p className="error-text">{errors.title}</p>}
              </div>
              <div className="input-field">
                <input
                  type="text"
                  placeholder="Publishing year"
                  value={publishingYear}
                  className={`input inline ${errors.publishingYear ? 'input-error' : ''}`}
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

export default MovieCreation;
