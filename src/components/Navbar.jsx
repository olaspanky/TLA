import React, { useState, useRef, useEffect } from "react";
import {
  MdDashboard,
  MdOutlinePendingActions,
  MdTaskAlt,
  MdSettings,
  MdNotifications,
  MdClose,
  MdMenu,
} from "react-icons/md";
import { FaTasks, FaUsers, FaSignOutAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setOpenSidebar, logout } from "../redux/slices/authSlice";
import {
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from "../redux/slices/api/notificationsApiSlice";
import clsx from "clsx";
import logo from "/plogoo.png";

// Define links for each role
const staffLinks = [
  { label: "Home", link: "dashboard", icon: <MdDashboard /> },
  { label: "Objectives", link: "tasks", icon: <FaTasks /> },
  { label: "Progress Tracking", link: "progress", icon: <MdOutlinePendingActions /> },
  { label: "Development plan", link: "development", icon: <MdTaskAlt /> },
];

const adminLinks = [
  ...staffLinks,
  { label: "Team objectives", link: "admin2", icon: <FaUsers /> },
];

const superAdminLinks = [
  { label: "Home", link: "dashboard", icon: <MdDashboard /> },
  { label: "Organisation Performance", link: "sadmin2", icon: <MdDashboard /> },
  { label: "User Management", link: "sadmin1", icon: <MdTaskAlt /> },
  { label: "Progress Tracking", link: "progress", icon: <MdOutlinePendingActions /> },
  { label: "Development plan", link: "sadmin3", icon: <MdTaskAlt /> },
  { label: " Departments", link: "admin", icon: <MdTaskAlt /> },
];

const Topbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const notificationsPanelRef = useRef(null);
  const mobileMenuRef = useRef(null);

  console.log("user is", user);

  // Notification API hooks
  const { 
    data: notifications = [], 
    isLoading, 
    error, 
    refetch 
  } = useGetNotificationsQuery({
    limit: 10,
    page: 1,
    unreadOnly: false,
  });

  const { data: unreadCountData } = useGetUnreadNotificationCountQuery();
  const unreadCount = unreadCountData?.count || 0;
  
  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();
  const [markAllNotificationsAsRead] = useMarkAllNotificationsAsReadMutation();

  const closeSidebar = () => dispatch(setOpenSidebar(false));

  const handleLogout = () => {
    dispatch(logout());
    setIsUserDropdownOpen(false);
    navigate("/log-in");
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead().unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsPanelRef.current && !notificationsPanelRef.current.contains(event.target)) {
        if (!event.target.closest('.notification-bell')) {
          setShowNotificationsPanel(false);
        }
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        if (!event.target.closest('.mobile-menu-trigger')) {
          setIsMobileMenuOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getFilteredLinks = () => {
    if (user.role === "staff") return staffLinks;
    if (user.role === "super_admin") return superAdminLinks;
    if (user.role === "admin" || "manager") return adminLinks;
    return staffLinks;
  };

  const NavLink = ({ el, isMobile = false }) => (
    <Link
      to={el.link}
      onClick={() => {
        closeSidebar();
        if (isMobile) setIsMobileMenuOpen(false);
      }}
      className={clsx(
        "flex items-center text-white hover:text-blue-300 transition-colors",
        isMobile 
          ? "text-[8px] xl:text-sm px-4 py-3 border-b border-gray-600/50 last:border-b-0" 
          : "text-[8px] xl:text-sm px-2 lg:px-4 py-2",
        path === el.link.split("/")[0] ? "text-blue-300 underline" : ""
      )}
    >
      {isMobile && <span className="mr-3">{el.icon}</span>}
      <span className="truncate">{el.label}</span>
    </Link>
  );

  return (
    <div className="w-full h-[40vh] xl:h-[30vh] bg-[#000A48] flex flex-col gap-4 sm:gap-3 md:gap-3 lg:gap-3 p-3  px-9 xl:px-20">
      {/* Top Section: Logo, Search, and Actions */}
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} className="w-12 sm:w-16 md:w-20" alt="Logo" />
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="search anything"
              className="bg-[#2A406F] text-white placeholder-gray-400 rounded-full px-3 lg:px-4 py-1 lg:py-2 focus:outline-none text-sm w-32 lg:w-auto"
            />
            <span className="absolute right-2 lg:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">Q</span>
          </div>
          
          {/* Notification Bell */}
          <div className="relative">
            <button
              className="notification-bell text-white hover:text-blue-300 relative"
              onClick={() => setShowNotificationsPanel(!showNotificationsPanel)}
              aria-label="Notifications"
            >
              <MdNotifications size={24} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </div>
          
          {/* Settings Icon */}
          {(user?.isAdmin || user?.role === "super_admin") && (
            <Link to="/admin2" className="text-white hover:text-blue-300" aria-label="Settings">
              <MdSettings size={24} />
            </Link>
          )}
          
          {/* User Icon with Dropdown */}
          <div className="relative">
            <div
              className="w-8 h-8 rounded-full bg-gray-300 cursor-pointer"
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              aria-label="User profile"
            ></div>
            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-[#2A406F] rounded-md shadow-lg z-10">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left text-white text-sm px-4 py-2 hover:bg-[#3A507F] rounded-md"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-trigger md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <MdMenu size={24} />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="md:hidden bg-red-400 fixed top-0 right-0 h-full w-64 bg-[#2A406F] shadow-lg z-50 overflow-y-auto transition-transform duration-300 ease-in-out"
        >
          <div className="p-4 border-b border-gray-600 flex justify-between items-center">
            <h3 className="text-white text-lg font-semibold">Menu</h3>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white hover:text-gray-300"
            >
              <MdClose size={20} />
            </button>
          </div>
          
          {/* Mobile Search */}
          <div className="p-4 border-b border-gray-600">
            <div className="relative">
              <input
                type="text"
                placeholder="search anything"
                className="w-full bg-[#1E2B4D] text-white placeholder-gray-400 rounded-full px-4 py-2 focus:outline-none text-sm"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">Q</span>
            </div>
          </div>

          {/* Mobile Navigation Links */}
          <div className="py-2">
            {getFilteredLinks().map((link) => (
              <NavLink el={link} key={link.link} isMobile={true} />
            ))}
          </div>

          {/* Mobile Actions */}
          <div className="p-4 border-t border-gray-600 space-y-3">
            {/* Notification Button */}
            <button
              className="flex items-center w-full text-left text-white text-sm px-4 py-2 hover:bg-[#3A507F] rounded-md"
              onClick={() => {
                setShowNotificationsPanel(true);
                setIsMobileMenuOpen(false);
              }}
            >
              <MdNotifications className="mr-3" />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Settings */}
            {(user?.isAdmin || user?.role === "super_admin") && (
              <Link 
                to="/admin2" 
                className="flex items-center w-full text-left text-white text-sm px-4 py-2 hover:bg-[#3A507F] rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MdSettings className="mr-3" />
                Settings
              </Link>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center w-full text-left text-white text-sm px-4 py-2 hover:bg-[#3A507F] rounded-md"
            >
              <FaSignOutAlt className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Greeting and Desktop Navigation */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-0 mt-1 sm:mt-2 bg-red-7">
        {/* Greeting Section */}
        <div className="relative overflow-hidden w-auto ">
          {/* Background decoration */}
          
          {/* Content */}
          <div className="relative z-10 space-y-1 sm:space-y-2 p-2 sm:p-3 md:p-4">
            {/* Welcome greeting */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <div className="flex items-center gap-2">
                <div className=" bg-blue-500 rounded-full animate-pulse"></div>
                <h1 className="text-sm sm:text-base md:text-xs font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                  Hi, {user?.name || "Gbolade"}
                </h1>
              </div>
              <span className="text-xs inline-flex items-center px-2 py-0.5 rounded-full  font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-200 border border-blue-500/30 w-fit">
                {user?.role || "Team Member"}
              </span>
            </div>
            
            {/* Department and description */}
            <div className="ml-2 sm:ml-3 md:ml-4 space-y-0.5 sm:space-y-1">
              {user?.department?.name && (
                <p className="text-slate-400 text-xs font-medium truncate">
                  {user.department.name || "Not assigned"}
                </p>
              )}
              <p className="text-slate-300 text-xs ">
                Track Your Objectives Progress
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden text-[2px] lg:flex gap-2 xl:gap-4 flex-wrap">
          {getFilteredLinks().map((link) => (
            <NavLink el={link} key={link.link} />
          ))}
        </div>
      </div>

      {/* Notifications Panel */}
      {showNotificationsPanel && (
        <div 
          ref={notificationsPanelRef}
          className="fixed top-0 left-0 h-full w-full sm:w-80 md:w-96 bg-[#2A406F] shadow-lg z-50 overflow-y-auto transition-transform duration-300 ease-in-out"
        >
          <div className="p-3 sm:p-4 border-b border-gray-600 flex justify-between items-center">
            <h3 className="text-white text-base sm:text-lg font-semibold">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-blue-300 text-xs sm:text-sm hover:underline"
                >
                  Mark all as read
                </button>
              )}
              <button 
                onClick={() => setShowNotificationsPanel(false)}
                className="text-white hover:text-gray-300"
              >
                <MdClose size={20} />
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="p-4 text-white text-center text-sm">Loading notifications...</div>
          ) : error ? (
            <div className="p-4 text-white text-center text-sm">Error loading notifications</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-white text-center text-sm">No notifications</div>
          ) : (
            <div className="divide-y divide-gray-600">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={clsx(
                    "p-3 sm:p-4 hover:bg-[#3A507F] cursor-pointer transition-colors",
                    !notif.read ? "bg-[#1E2B4D]" : ""
                  )}
                  onClick={() => !notif.read && handleMarkAsRead(notif.id)}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="mt-1 flex-shrink-0">
                      {!notif.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs sm:text-sm break-words">
                        {notif.message}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Topbar;