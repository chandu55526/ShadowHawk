import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { themes, setTheme } from '../utils/themes';
import '../styles/login.css';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:5001';
axios.defaults.withCredentials = true;

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Set default theme
    setTheme(themes[0]);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('/api/auth/forgot-password', { email });
      setSuccess('Password reset instructions have been sent to your email.');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to process your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="container">
      <div className="login-container">
        <div className="circle circle-one"></div>
        <div className="form-container">
          <img 
            src="https://raw.githubusercontent.com/hicodersofficial/glassmorphism-login-form/master/assets/illustration.png" 
            alt="illustration" 
            className="illustration" 
          />
          <h1 className="opacity">FORGOT PASSWORD</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="EMAIL"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <button type="submit" className="opacity" disabled={isLoading}>
              {isLoading ? 'SENDING...' : 'SEND RESET LINK'}
            </button>
          </form>
          <div className="register-forget opacity">
            <Link to="/login">BACK TO LOGIN</Link>
          </div>
        </div>
        <div className="circle circle-two"></div>
      </div>
      <div className="theme-btn-container">
        {themes.map((theme, index) => (
          <div
            key={index}
            className="theme-btn"
            style={{ background: theme.background, width: '25px', height: '25px' }}
            onClick={() => setTheme(theme)}
          />
        ))}
      </div>
    </section>
  );
} 