'use client';

//libs
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Custom Component
import Footer from '@/components/ui/footer/footer';

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
        router.push('/movies/list');
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
      <section className={style.add_edit}>
        <div className={style.container}>
          <div className={style.list_header}>
            <div className={style.headings}>
              <h2 className={style.title}>Create a new movie</h2>
            </div>
          </div>
          <div className={style.drop_form_wrapper}>
            <div className={style.drop_bx}>
              <input type="file" name="file" id="file" onChange={handleFileChange} />
              <img src="images/file_download.svg" alt="download icon" />
              <span>Drop an image here</span>
            </div>
            <div className={style.movie_form}>
              <div className={style.input_field}>
                <input type="text" placeholder="Title" className={style.input} value={title} onChange={handleTitleChange} />
              </div>
              <div className={style.input_field}>
                <input
                  type="text"
                  placeholder="Publishing year"
                  className={`${style.input} ${style.inline}`}
                  value={publishingYear}
                  onChange={handlePublishingYearChange}
                />
              </div>
              <div className={`${style.button_wrapper} ${style.mobile_hidden}`}>
                <button type="button" className={`${style.button} ${style.button_bordered}`} onClick={() => clearForm()}>
                  Cancel
                </button>
                <button type="button" className={`${style.button} ${style.button_green}`} onClick={handleSubmit}>
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
