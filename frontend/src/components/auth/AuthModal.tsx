import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import type { AuthFormData, AuthModalProps } from '../../types/auth';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login',
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (data: AuthFormData) => {
    setIsLoading(true);
    try {
      // TODO: Implement login API call
      console.log('Login:', data);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onClose();
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (data: AuthFormData) => {
    setIsLoading(true);
    try {
      // TODO: Implement register API call
      console.log('Register:', data);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onClose();
    } catch (error) {
      console.error('Register error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Background Overlay for Modal */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40"
        onClick={onClose}
      ></div>

      {/* Auth Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-[440px] bg-white dark:bg-slate-900 shadow-2xl rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 mx-4 max-h-[90vh] overflow-y-auto">
          {/* Header / Branding */}
          <div className="px-8 pt-8 pb-4 flex flex-col items-center">
            <div className="flex items-center gap-2 text-primary mb-2">
              <span className="material-symbols-outlined text-4xl font-display" style={{ fontVariationSettings: "'FILL' 1" }}>
                restaurant_menu
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                DishHub
              </h2>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Join the community of food lovers
            </p>
          </div>

          {/* Tabs */}
          <div className="px-8 border-b border-slate-100 dark:border-slate-800">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('login')}
                className={`border-b-2 pb-3 pt-2 text-sm font-bold transition-colors ${
                  activeTab === 'login'
                    ? 'border-primary text-slate-900 dark:text-slate-100'
                    : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-primary'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`border-b-2 pb-3 pt-2 text-sm font-bold transition-colors ${
                  activeTab === 'register'
                    ? 'border-primary text-slate-900 dark:text-slate-100'
                    : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-primary'
                }`}
              >
                Register
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {activeTab === 'login' ? (
              <LoginForm onSubmit={handleLoginSubmit} isLoading={isLoading} />
            ) : (
              <RegisterForm onSubmit={handleRegisterSubmit} isLoading={isLoading} />
            )}
          </div>

          {/* Footer Note */}
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              By signing in, you agree to our{' '}
              <a
                href="#"
                className="text-primary hover:underline"
                onClick={(e) => e.preventDefault()}
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="#"
                className="text-primary hover:underline"
                onClick={(e) => e.preventDefault()}
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
