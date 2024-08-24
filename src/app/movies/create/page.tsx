'use client';

//libs
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Custom Component
import Footer from '@/components/ui/footer/footer';
import image_file_download from '../../../assets/images/file-download.svg';

// Styles
import style from './page.module.scss';

function MovieCreation() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [publishingYear, setPublishingYear] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handlePublishingYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPublishingYear(event.target.value);
  };

  const clearForm = () => {
    setFile(null);
    setTitle('');
    setPublishingYear('');
  };

  const handleSubmit = async () => {
    if (!file || !title || !publishingYear) {
      alert('Please fill in all fields and select a file.');
      return;
    }

    // Ensure the publishing year is in the correct format
    const formattedPublishingYear = new Date(publishingYear).toISOString().split('T')[0];

    // Prepare FormData for the file
    const formData = new FormData();
    formData.append('file', file);

    // Create a JSON object for title and publishingYear
    const metadata = JSON.stringify({
      title,
      publishingYear: formattedPublishingYear,
      movieId: null,
    });

    // Append metadata as a Blob
    formData.append('metadata', metadata);

    try {
      const response = await fetch('/api/movie/create', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        router.push('/movies');
        // Clear the form or handle successful submission
        clearForm();
      } else {
        const result = await response.json();
        alert(`Error: ${result.error || 'Something went wrong'}`);
      }
    } catch (error) {
      alert('Network error: Please try again later.');
      console.error('Error:', error);
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
              <input type="file" name="file" id="file" onChange={handleFileChange} title="file" />
              {file !== null && (
                <Image
                  src={URL.createObjectURL(file)}
                  alt="Description of the image"
                  // layout="responsive"
                  width={473}
                  height={504}
                  objectFit="cover"
                />
              )}
              <Image src={image_file_download} width={24} height={24} alt="download icon" />
              <span>Drop an image here</span>
            </div>
            <div className="movie-form">
              <div className="input-field">
                <input type="text" placeholder="Title" className="input" value={title} onChange={handleTitleChange} />
              </div>
              <div className="input-field">
                <input
                  type="text"
                  placeholder="Publishing year"
                  className={`input inline`}
                  value={publishingYear}
                  onChange={handlePublishingYearChange}
                />
              </div>
              <div className={`button-wrapper mobile-hidden`}>
                <button
                  type="button"
                  className={`button button-bordered`}
                  onClick={() => {
                    clearForm();
                    router.push('/movies');
                  }}
                >
                  Cancel
                </button>
                <button type="button" className={`button button-green`} onClick={handleSubmit}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default MovieCreation;
