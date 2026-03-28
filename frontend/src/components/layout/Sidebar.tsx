import { useLocation } from 'react-router-dom';
import { NavLink } from '../common/NavLink';
import type { NavItem } from '../../types';

interface SidebarProps {
  isLoggedIn: boolean;
}

export const Sidebar = ({ isLoggedIn }: SidebarProps) => {
  const location = useLocation();

  const mainNavItems: NavItem[] = [
    { label: 'Khám phá', path: '/recipes', icon: '🔍' },
    { label: 'Công thức của tôi', path: '/my-recipes', icon: '❤️' },
    { label: 'Danh sách mua', path: '/shopping-list', icon: '🛒', badge: 3 },
    { label: 'Lên kế hoạch bữa', path: '/meal-planner', icon: '📅' },
  ];

  const categoryItems: NavItem[] = [
    { label: 'Các món ăn Việt', path: '/recipes?category=vietnamese', icon: '🍜' },
    { label: 'Ăn chay', path: '/recipes?category=vegetarian', icon: '🥗' },
    { label: 'Nước ngoài', path: '/recipes?category=international', icon: '🌍' },
    { label: 'Tráng miệng', path: '/recipes?category=dessert', icon: '🍰' },
  ];

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
      <nav className="p-4">
        {/* Main Navigation */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 mb-2">
            Menu chính
          </h3>
          <div className="space-y-2">
            {mainNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                label={item.label}
                icon={item.icon}
                badge={item.badge}
                isActive={location.pathname === item.path}
              />
            ))}
          </div>
        </div>

        {/* Categories */}
        {isLoggedIn && (
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 mb-2">
              Danh mục
            </h3>
            <div className="space-y-2">
              {categoryItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  label={item.label}
                  icon={item.icon}
                  badge={item.badge}
                  isActive={location.pathname.includes('category')}
                />
              ))}
            </div>
          </div>
        )}

        {/* Settings */}
        {isLoggedIn && (
          <div className="pt-4 border-t border-gray-200">
            <NavLink
              to="/profile"
              label="Hồ sơ"
              icon="👤"
              isActive={location.pathname === '/profile'}
            />
            <NavLink
              to="/settings"
              label="Cài đặt"
              icon="⚙️"
              isActive={location.pathname === '/settings'}
            />
          </div>
        )}
      </nav>
    </aside>
  );
};
