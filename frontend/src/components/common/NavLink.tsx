import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface NavLinkProps {
  to: string;
  label: string;
  icon?: ReactNode;
  badge?: number;
  isActive?: boolean;
}

export const NavLink = ({ to, label, icon, badge, isActive = false }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
        isActive
          ? 'bg-[#FF6900] text-white'
          : 'text-gray-700 hover:bg-[#FF6900]/10 hover:text-[#FF6900]'
      }`}
    >
      {icon && <span className="mr-3">{icon}</span>}
      <span className="flex-1">{label}</span>
      {badge !== undefined && (
        <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
          {badge}
        </span>
      )}
    </Link>
  );
};
