import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../common';

interface HeaderProps {
  isLoggedIn: boolean;
  userName?: string;
  onLogout: () => void;
}

export const Header = ({ isLoggedIn, userName, onLogout }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <span className="text-xl font-bold text-gray-900">DishHub</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 mx-8">
          <input
            type="text"
            placeholder="Tìm công thức..."
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          />
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link
                to="/shopping-list"
                className="relative px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <span className="text-lg">🛒</span>
              </Link>
              <div className="flex items-center gap-2 pl-4 border-l border-gray-300">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500">Người dùng</p>
                </div>
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'User')}&background=random&bold=true`}
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
              </div>
              <Button variant="outline" size="sm" onClick={onLogout}>
                Đăng xuất
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/login')}
              >
                Đăng nhập
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/register')}
              >
                Đăng ký
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
