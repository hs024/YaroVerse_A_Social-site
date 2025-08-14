import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "../redux/userSlice";

// Define all possible nav items
const allNavItems = [
  { to: "/", label: "Home", protected: false },
  { to: "/videos", label: "Videos", protected: false },
  { to: "/images", label: "Images", protected: false },
  { to: "/friends", label: "Friends", protected: true },
  { to: "/status", label: "Status", protected: true },
  { to: "/upload", label: "Upload", protected: true },
  { to: "/settings", label: "Settings", protected: true },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const users = useSelector((state) => state.user.users);

  // If we have a logged in user, fetch their full details on mount
  useEffect(() => {
    if (currentUser && !users[currentUser.id]) {
      dispatch(fetchUserDetails(currentUser.id));
    }
  }, [currentUser, users, dispatch]);

  const notificationCount = 3;

  // Filter nav items based on login state
  const navItems = allNavItems.filter(
    (item) => !item.protected || (item.protected && currentUser)
  );

  const profileUser = currentUser ? users[currentUser.id] || currentUser : null;

  return (
    <nav className="bg-white/80 backdrop-blur shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Site name */}
        <div className="text-2xl font-extrabold text-purple-600 tracking-tight">
          Dattebayo
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-purple-600 hover:text-purple-800 focus:outline-none"
        >
          <svg
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex gap-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-3 py-1 rounded-lg font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                }`
              }
              end={item.to === "/"}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Right: Notification & Profile */}
        <div className="flex items-center gap-3">
          {currentUser && (
            <NavLink
              to="/notifications"
              className="relative p-2 rounded-full hover:bg-purple-50 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-purple-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full px-1.5">
                  {notificationCount}
                </span>
              )}
            </NavLink>
          )}

          {profileUser ? (
            <NavLink
              to={`/user/${profileUser.id}`}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-purple-100 text-purple-700 font-semibold shadow hover:bg-purple-200 transition"
            >
              {profileUser.avatar && (
                <img
                  src={profileUser.avatar}
                  alt={profileUser.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
              )}
              {profileUser.name || "My Profile"}
            </NavLink>
          ) : (
            <NavLink
              to="/login"
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-pink-400 to-purple-500 text-white font-semibold shadow hover:from-purple-500 hover:to-pink-400 transition"
            >
              Login
            </NavLink>
          )}
        </div>
      </div>

      {/* Mobile Nav Links */}
      {isOpen && (
        <div className="md:hidden px-4 pb-3 pt-2 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md font-medium transition ${
                  isActive
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                }`
              }
              end={item.to === "/"}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}
