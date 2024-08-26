'use client';

//libs
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, ChangeEvent, MouseEvent } from 'react';

//styles and images
import '../../assets/scss/globals.scss';
import bgShape from '@/assets/images/bg-shape.png';

// Define types for the form state
interface FormState {
  email: string;
  password: string;
  error: string;
  emailError: string;
  passwordError: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>({
    email: '',
    password: '',
    error: '',
    emailError: '',
    passwordError: '',
  });
  const [loading, setLoading] = useState(false); // Add loading state

  // Validate email format
  const validateEmail = (email: string): string => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email) ? '' : 'Invalid email address.';
  };

  // Validate password
  const validatePassword = (password: string): string => {
    return password.trim() !== '' ? '' : 'Password cannot be empty.';
  };

  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Clear the specific error message when user types
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
      ...(name === 'email' && { emailError: '' }),
      ...(name === 'password' && { passwordError: '' }),
    }));
  };

  // Handle login button click
  const handleLogin = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent any default behavior if applicable

    // Validate form fields
    const emailError = validateEmail(formState.email);
    const passwordError = validatePassword(formState.password);

    if (emailError || passwordError) {
      setFormState((prevState) => ({
        ...prevState,
        emailError,
        passwordError,
      }));
      return; // Stop execution if there are validation errors
    }

    setLoading(true); // Set loading to true when API call starts

    try {
      const response = await axios.post('/api/users/login', {
        email: formState.email,
        password: formState.password,
      });
      if (response.status === 200) {
        router.push('/movies');
      } else {
        setFormState((prevState) => ({
          ...prevState,
          error: 'Login failed. Please check your credentials.',
          emailError: '',
          passwordError: '',
        }));
      }
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || 'An error occurred. Please try again.'
        : 'An unexpected error occurred.';

      setFormState((prevState) => ({
        ...prevState,
        error: errorMessage,
        emailError: '',
        passwordError: '',
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="center">
        <div className="sign-up">
          <h1 className="title">Sign in</h1>
          <form>
            <div className="input-field">
              <input
                type="text"
                name="email"
                placeholder="Email"
                className="input"
                value={formState.email}
                onChange={handleInputChange}
              />
              {formState.emailError && <p className="error">{formState.emailError}</p>}
            </div>
            <div className="input-field">
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="input"
                value={formState.password}
                onChange={handleInputChange}
              />
              {formState.passwordError && <p className="error">{formState.passwordError}</p>}
            </div>
            <div className="remember-ext">
              <input type="checkbox" name="check" id="check" />
              <label htmlFor="check">Remember me</label>
            </div>
            <button type="button" className="button button-green" onClick={handleLogin} disabled={loading}>
              {loading ? 'Please wait...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
      <div className="bg-shape">
        <Image src={bgShape} alt="Background Shapes" />
      </div>
    </>
  );
}
