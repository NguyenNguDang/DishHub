export interface AuthFormData {
  email?: string;
  password?: string;
  name?: string;
}

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}
