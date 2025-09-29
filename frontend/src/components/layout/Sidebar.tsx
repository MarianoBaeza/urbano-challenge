import { BookOpen, Home, LogOut, Users } from 'react-feather';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import authService from '../../services/AuthService';
import SidebarItem from './SidebarItem';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  className: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const { authenticatedUser, setAuthenticatedUser } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    setAuthenticatedUser(undefined);
    navigate('/login');
  };

  return (
    <div className={`sidebar ${className} bg-[url('/assets/sidemenu-bg.jpg')]`}>
      <Link to="/">
        <img
          src="/assets/urbano-logo-white.png"
          alt="Logo"
          className="h-16 mx-auto my-6 object-contain"
        />
      </Link>
      <nav className="mt-5 flex flex-col gap-3 flex-grow">
        <SidebarItem to="/">
          <span className="flex items-center gap-2">
            <Home /> Dashboard
          </span>
        </SidebarItem>
        <SidebarItem to="/courses">
          <span className="flex items-center gap-2">
            <BookOpen /> Courses
          </span>
        </SidebarItem>
        {authenticatedUser?.role === 'admin' ? (
          <SidebarItem to="/users">
            <span className="flex items-center gap-2">
              <Users /> Users
            </span>
          </SidebarItem>
        ) : null}
      </nav>
      <button
        className="text-white rounded-md p-3 transition-colors flex gap-3 justify-center items-center font-semibold focus:outline-none"
        onClick={handleLogout}
      >
        <LogOut className="text-white" /> Logout
      </button>
    </div>
  );
}
