import type { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
  isLoggedIn: boolean;
  userName?: string;
  onLogout: () => void;
  showSidebar?: boolean;
}

export const MainLayout = ({
  children,
  isLoggedIn,
  userName,
  onLogout,
  showSidebar = true,
}: MainLayoutProps) => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <Header
        isLoggedIn={isLoggedIn}
        userName={userName}
        onLogout={onLogout}
      />

      {/* Main Content Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {showSidebar && <Sidebar isLoggedIn={isLoggedIn} />}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
