import React, { useState, useRef, useEffect } from "react";
import {
  MdDashboard,
  MdOutlinePendingActions,
  MdTaskAlt,
  MdSettings,
  MdNotifications,
  MdClose,
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
  { label: "Admin", link: "admin", icon: <MdTaskAlt /> },

];

const Topbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const notificationsPanelRef = useRef(null);

  console.log("user is", user)

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

  // Close notifications panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsPanelRef.current && !notificationsPanelRef.current.contains(event.target)) {
        if (!event.target.closest('.notification-bell')) {
          setShowNotificationsPanel(false);
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

  const NavLink = ({ el }) => (
    <Link
      to={el.link}
      onClick={closeSidebar}
      className={clsx(
        "flex items-center text-white text-base px-4 py-2 hover:text-blue-300",
        path === el.link.split("/")[0] ? "text-blue-300 underline" : ""
      )}
    >
      <span>{el.label}</span>
    </Link>
  );

  return (
    <div className="w-full h-[40vh] bg-[#000A48] flex flex-col gap-12 p-5 2xl:px-72 px-20 ">
      {/* Top Section: Logo and Search */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logo} className="w-20" alt="Logo" />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="search anything"
              className="bg-[#2A406F] text-white placeholder-gray-400 rounded-full px-4 py-1 focus:outline-none"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">Q</span>
          </div>
          
          {/* Notification Bell */}
          <div className="relative notification-bell">
            <button
              className="text-white cursor-pointer relative"
              onClick={() => setShowNotificationsPanel(!showNotificationsPanel)}
              aria-label="Notifications"
            >
              <MdNotifications size={24} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
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
      </div>

      {/* Greeting and Navigation */}
      <div className="flex justify-between items-center mt-4">
       <div className="relative overflow-hidden p-4">
  {/* Background decoration */}
  <div className="absolute inset-0 "></div>
  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-xl"></div>
  
  {/* Content */}
  <div className="relative z-10 space-y-2">
    {/* Welcome greeting */}
    <div className="flex items-center gap-2">
      <div className="w-1.5 h-1.5  rounded-full animate-pulse"></div>
      <h1 className="text-lg font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
        Hi, {user?.name || "Gbolade"}
      </h1>
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-200 border border-blue-500/30">
        {user?.role || "Team Member"}
      </span>
    </div>
    
    {/* Department and description */}
    <div className="ml-4 space-y-1">
      {user?.department?.name && (
        <p className="text-slate-400 text-xs font-medium">{user.department.name || "Not assigned"}</p>
      )}
      <p className="text-slate-300 text-sm">Track Your Objectives Progress</p>
    </div>
  </div>
</div>
        <div className="flex gap-4">
          {getFilteredLinks().map((link) => (
            <NavLink el={link} key={link.link} />
          ))}
        </div>
      </div>

      {/* Notifications Panel - Left Side */}
      {showNotificationsPanel && (
        <div 
          ref={notificationsPanelRef}
          className="fixed top-0 left-0 h-full w-80 bg-[#2A406F] shadow-lg z-50 overflow-y-auto transition-transform duration-300 ease-in-out"
        >
          <div className="p-4 border-b border-gray-600 flex justify-between items-center">
            <h3 className="text-white text-lg font-semibold">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-blue-300 text-sm hover:underline"
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
            <div className="p-4 text-white text-center">Loading notifications...</div>
          ) : error ? (
            <div className="p-4 text-white text-center">Error loading notifications</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-white text-center">No notifications</div>
          ) : (
            <div className="divide-y divide-gray-600">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={clsx(
                    "p-4 hover:bg-[#3A507F] cursor-pointer",
                    !notif.read ? "bg-[#1E2B4D]" : ""
                  )}
                  onClick={() => !notif.read && handleMarkAsRead(notif.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {!notif.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <p className="text-white text-sm">{notif.message}</p>
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