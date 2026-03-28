import { useState } from 'react';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface RegisterPageProps {
  onSwitchToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // TODO: Implement registration API call
      console.log('Register:', formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('Account created successfully!');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="layout-container flex h-full grow flex-col bg-background-light dark:bg-background-dark min-h-screen">
      {/* Top Navigation */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/10 px-6 md:px-10 py-4 bg-white dark:bg-background-dark">
        <div className="flex items-center gap-2 text-primary cursor-pointer">
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
              Create your account
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-base font-normal">
              Join our community of food lovers today.
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col gap-2">
                <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold">
                  First Name
                </span>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="John"
                  className="form-input flex w-full rounded-lg border border-primary/20 bg-white dark:bg-background-dark/50 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-base transition-all"
                  required
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold">
                  Last Name
                </span>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe"
                  className="form-input flex w-full rounded-lg border border-primary/20 bg-white dark:bg-background-dark/50 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-base transition-all"
                  required
                />
              </label>
            </div>

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
              <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold">
                Password
              </span>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="form-input flex w-full rounded-lg border border-primary/20 bg-white dark:bg-background-dark/50 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-base transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                backgroundColor: '#f27f0d',
              }}
              className="w-full text-white font-bold h-12 rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = 'rgba(242, 127, 13, 0.8)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = '#f27f0d')
              }
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-primary/10"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-sm">or</span>
              <div className="flex-grow border-t border-primary/10"></div>
            </div>

            {/* Google Sign Up */}
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

          {/* Login Link */}
          <div className="text-center pt-4">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-primary font-bold hover:underline"
              >
                Log in
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
