import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      console.error('Google authentication failed:', error);
      navigate('/login?error=google_auth_failed');
      return;
    }

    if (token) {
      // Save token to localStorage
      localStorage.setItem('token', token);

      // Update auth context
      login(token);

      // Redirect to dashboard
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, login]);
  return (
    <div>
      <p>Processing Google authentication...</p>
    </div>
  );
}

function GithubCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");
    if (error) {
      console.error("GitHub authentication failed:", error);
      navigate("/login?error=github_auth_failed");
      return;
    }
    if (token) {
      localStorage.setItem("token", token);
      login(token);
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [searchParams, navigate, login]);
  return (
    <div>
      <p>Processing Github authentication...</p>
    </div>
  );
}

export default {
  GoogleCallback,
  GithubCallback
}