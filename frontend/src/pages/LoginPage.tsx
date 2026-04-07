import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginPageProps {
  onSwitchToRegister: () => void;
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSwitchToRegister,
  onLoginSuccess,
}) => {
  const navigate = useNavigate();
  const { login, isLoading: authLoading, error, clearError, isLoggedIn } = useAuthStore();
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Redirect nếu đã đăng nhập
  useEffect(() => {
    if (isLoggedIn) {
      onLoginSuccess();
      navigate('/recipes');
    }
  }, [isLoggedIn, navigate, onLoginSuccess]);

  // Clear error khi component unmount
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationError('');
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.password) {
      setValidationError('Please fill in all fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setValidationError('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    try {
      await login(formData.email, formData.password);
      setShowSuccessMessage(true);
    } catch (error) {
      console.error('Login error:', error);
      // Error được handle bởi AuthContext
    }
  };

  return (
    <div className="layout-container flex h-full grow flex-col bg-background-light dark:bg-background-dark min-h-screen">
      {/* Top Navigation */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/10 px-6 md:px-10 py-4 bg-white dark:bg-background-dark">
        <div className="flex items-center gap-2 text-primary">
          <div className="size-8 flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl font-bold">
              restaurant_menu
            </span>
          </div>
          <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-[-0.015em]">
            DishHub
          </h2>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-[480px] flex flex-col gap-8">
          {/* Hero Image Placeholder */}
          <div className="@container">
            <div
              className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden bg-primary/5 rounded-xl min-h-[180px] border border-primary/10"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&h=200&fit=crop')`,
              }}
            ></div>
          </div>

          {/* Form Header */}
          <div className="flex flex-col gap-2">
            <h1 className="text-slate-900 dark:text-slate-100 text-4xl font-bold leading-tight">
              Welcome back
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-base font-normal">
              Sign in to your DishHub account to continue.
            </p>
          </div>

          {/* Success Message */}
          {showSuccessMessage && (
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30">
                <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-5xl">
                  check_circle
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <p className="text-lg font-bold text-green-800 dark:text-green-300">
                  Login Successful!
                </p>
                <p className="text-sm text-green-700 dark:text-green-400">
                  Redirecting to recipes page...
                </p>
              </div>
            </div>
          )}

          {/* Login Form - Hide when success */}
          {!showSuccessMessage && (
            <>
              {/* Error Message */}
              {(error || validationError) && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800">
                  <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-xl mt-0.5 shrink-0">
                    error
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                      {error || validationError}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setValidationError('');
                      clearError();
                    }}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <label className="flex flex-col gap-2">
                  <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold">
                    Email
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@email.com"
                    className="form-input flex w-full rounded-lg border border-primary/20 bg-white dark:bg-background-dark/50 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-base transition-all"
                    required
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold">
                      Password
                    </span>
                    <a
                      href="#"
                      className="text-primary text-xs font-semibold hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="form-input flex w-full rounded-lg border border-primary/20 bg-white dark:bg-background-dark/50 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-base transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-0 h-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      <span className="material-symbols-outlined text-xl">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={authLoading}
                  style={{
                    backgroundColor: '#f27f0d',
                  }}
                  className="w-full text-white font-bold h-12 rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
                  onMouseEnter={(e) =>
                    !authLoading && (e.currentTarget.style.backgroundColor = 'rgba(242, 127, 13, 0.8)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = '#f27f0d')
                  }
                >
                  {authLoading && (
                    <span className="material-symbols-outlined text-xl animate-spin">
                      refresh
                    </span>
                  )}
                  {authLoading ? 'Signing In...' : 'Sign In'}
                </button>

                {/* Divider */}
                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-primary/10"></div>
                  <span className="flex-shrink mx-4 text-slate-400 text-sm">or</span>
                  <div className="flex-grow border-t border-primary/10"></div>
                </div>

                {/* Google Sign In */}
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-3 border border-primary/20 bg-white dark:bg-background-dark/50 hover:bg-primary/5 text-slate-900 dark:text-slate-100 font-semibold h-12 rounded-lg transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    ></path>
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    ></path>
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    ></path>
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    ></path>
                  </svg>
                  Continue with Google
                </button>
              </form>
            </>
          )}

          {/* Register Link */}
          <div className="text-center pt-4">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-primary font-bold hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-slate-400 text-xs">
        <p>© 2024 DishHub. All rights reserved.</p>
      </footer>
    </div>
  );
};
