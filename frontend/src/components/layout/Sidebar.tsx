import { useLocation } from 'react-router-dom';
import { NavLink } from '../common';
import type { NavItem } from '../../types';
import { IoMdSearch } from "react-icons/io";
import { FaHeart } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { TbCalendarWeek } from "react-icons/tb";
import { PiBowlFoodDuotone } from "react-icons/pi";
import { IoFastFood } from "react-icons/io5";
import { MdOutlineEmojiFoodBeverage } from "react-icons/md";
import { GiFruitBowl } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { IoSettings } from "react-icons/io5";

interface SidebarProps {
  isLoggedIn: boolean;
}

export const Sidebar = ({ isLoggedIn }: SidebarProps) => {
  const location = useLocation();

  const mainNavItems: NavItem[] = [
    { label: 'Khám phá', path: '/recipes', icon: <IoMdSearch /> },
    { label: 'Công thức của tôi', path: '/my-recipes', icon: <FaHeart /> },
    { label: 'Danh sách mua', path: '/shopping-list', icon: <TiShoppingCart />, badge: 0 },
    { label: 'Lên kế hoạch bữa', path: '/meal-planner', icon: <TbCalendarWeek /> },
  ];

  const categoryItems: NavItem[] = [
    { label: 'Các món ăn Việt', path: '/recipes?category=vietnamese', icon: <PiBowlFoodDuotone /> },
    { label: 'Ăn chay', path: '/recipes?category=vegetarian', icon: <GiFruitBowl /> },
    { label: 'Nước ngoài', path: '/recipes?category=international', icon: <IoFastFood /> },
    { label: 'Tráng miệng', path: '/recipes?category=dessert', icon: <MdOutlineEmojiFoodBeverage />},
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
              icon= {<CgProfile />}
              isActive={location.pathname === '/profile'}
            />
            <NavLink
              to="/settings"
              label="Cài đặt"
              icon={<IoSettings />}
              isActive={location.pathname === '/settings'}
            />
          </div>
        )}
      </nav>
    </aside>
  );
};
