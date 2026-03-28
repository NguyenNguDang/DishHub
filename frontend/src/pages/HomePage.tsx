/**
 * HomePage.tsx
 * Trang chủ của ứng dụng DishHub
 */

import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-5xl font-bold text-center mb-6 text-gray-900">
          Chào mừng đến <span className="text-orange-500">DishHub</span>
        </h1>
        
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
            <Link
              to="/recipe/new"
              className="inline-block bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Thêm mới →
            </Link>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">
            Bạn chưa có tài khoản?
          </h3>
          <div className="flex gap-4 justify-center">
            <Link
              to="/login"
              className="px-6 py-2 border-2 border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors"
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
