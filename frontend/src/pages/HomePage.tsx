/**
 * HomePage.tsx
 * Trang chủ của ứng dụng DishHub
 * Kiểm tra trạng thái đăng nhập từ localStorage/State Management
 */

import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';

export const HomePage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout, user, isLoading } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Kiểm tra trạng thái từ localStorage
  const hasAccessToken = localStorage.getItem('accessToken') !== null;
  const isAuthenticated = isLoggedIn || hasAccessToken;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-5xl font-bold text-center mb-6 text-gray-900">
          Chào mừng đến <span className="text-orange-500">DishHub</span>
        </h1>
        
        {/* Loading state */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <p className="text-gray-600">Đang tải...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Hiển thị tên người dùng nếu đã đăng nhập */}
            {isAuthenticated && user && (
              <p className="text-lg text-center text-orange-600 mb-6">
                👋 Xin chào, <span className="font-semibold">{user.username}</span>!
              </p>
            )}

            {/* Hiển thị trạng thái debug (có thể xóa sau) */}
            <div className="text-center text-xs text-gray-400 mb-6">
              <p>Token: {hasAccessToken ? '✓' : '✗'} | Logged In: {isLoggedIn ? '✓' : '✗'}</p>
            </div>

            <p className="text-xl text-center text-gray-600 mb-12">
              Khám phá, chia sẻ và yêu thích những công thức nấu ăn tuyệt vời
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">
                  Danh sách công thức
                </h2>
                <p className="text-gray-600 mb-4">
                  Xem hơn 1000 công thức nấu ăn từ các đầu bếp khác nhau
                </p>
                <Link
                  to="/recipes"
                  className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Xem ngay →
                </Link>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">
                  Thêm công thức của bạn
                </h2>
                <p className="text-gray-600 mb-4">
                  Chia sẻ những công thức yêu thích của bạn với cộng đồng
                </p>
                {/* Chỉ hiển thị nếu đã đăng nhập */}
                {isAuthenticated ? (
                  <Link
                    to="/recipe/new"
                    className="inline-block bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Thêm mới →
                  </Link>
                ) : (
                  <p className="text-sm text-gray-500">
                    Vui lòng <Link to="/login" className="text-orange-500 font-semibold hover:underline">đăng nhập</Link> để thêm công thức
                  </p>
                )}
              </div>
            </div>

            {/* Hiển thị nút khác nhau tùy theo trạng thái đăng nhập */}
            <div className="text-center">
              {!isAuthenticated ? (
                <>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">
                    Bạn chưa có tài khoản?
                  </h3>
                  <div className="flex gap-4 justify-center">
                    <Link
                      to="/login"
                      className="px-6 py-2 border-2 border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors font-medium"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      to="/register"
                      className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                    >
                      Đăng ký
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">
                    Bạn có thể thực hiện
                  </h3>
                  <div className="flex gap-4 justify-center flex-wrap">
                    <Link
                      to="/recipes"
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    >
                      📖 Xem công thức
                    </Link>
                    <Link
                      to="/my-recipes"
                      className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
                    >
                      ⭐ Công thức của tôi
                    </Link>
                    <Link
                      to="/profile"
                      className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium"
                    >
                      👤 Hồ sơ
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-6 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-medium"
                    >
                      🚪 Đăng xuất
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
