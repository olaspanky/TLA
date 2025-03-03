// import React from "react";
// import {
//   MdDashboard,
//   MdOutlineAddTask,
//   MdOutlinePendingActions,
//   MdSettings,
//   MdTaskAlt,
// } from "react-icons/md";
// import { FaTasks, FaTrashAlt, FaUsers } from "react-icons/fa";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useLocation } from "react-router-dom";
// import { setOpenSidebar } from "../redux/slices/authSlice";
// import clsx from "clsx";
// import logo from "/logo.png"

// const linkData = [
//   {
//     label: "Dashboard",
//     link: "dashboard",
//     icon: <MdDashboard />,
//   },
//   {
//     label: "Objectives",
//     link: "tasks",
//     icon: <FaTasks />,
//   },
//   {
//     label: "Completed",
//     link: "completed/completed",
//     icon: <MdTaskAlt />,
//   },
//   {
//     label: "In Progress",
//     link: "in-progress/in progress",
//     icon: <MdOutlinePendingActions />,
//   },
//   {
//     label: "To Do",
//     link: "todo/todo",
//     icon: <MdOutlinePendingActions />,
//   },
//   {
//     label: "Team",
//     link: "team",
//     icon: <FaUsers />,
//   },
//   {
//     label: "User Ratings",
//     link: "rating",
//     icon: <FaUsers />,
//   },
// ];

// const Sidebar = () => {
//   const { user } = useSelector((state) => state.auth);

//   const dispatch = useDispatch();
//   const location = useLocation();

//   const path = location.pathname.split("/")[1];

//   const sidebarLinks = (user?.isAdmin || user?.isSuperAdmin) ? linkData : linkData.slice(0, 5);
//   const closeSidebar = () => {
//     dispatch(setOpenSidebar(false));
//   };

//   const NavLink = ({ el }) => {
//     return (
//       <Link
//         to={el.link}
//         onClick={closeSidebar}
//         className={clsx(
//           "w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-full items-center text-gray-800 text-base hover:bg-[#2564ed2d]",
//           path === el.link.split("/")[0] ? "bg-blue-700 text-neutral-100" : ""
//         )}
//       >
//         {el.icon}
//         <span className='hover:text-[#2564ed]'>{el.label}</span>
//       </Link>
//     );
//   };
//   return (
//     <div className='w-full  h-full flex flex-col gap-6 p-5'>
//       <h1 className='flex gap-1 items-center'>
//         <p className=' p-2 rounded-full'>
//           {/* <MdOutlineAddTask className='text-white text-2xl font-black' /> */}
//           <img src={logo} className='text-white text-2xl font-black w-20'/>
//         </p>
//         {/* <span className='text-2xl font-bold text-black'>Traffic Light TMS</span> */}
//       </h1>

//       <div className='flex-1 flex flex-col gap-y-5 py-8'>
//         {sidebarLinks.map((link) => (
//           <NavLink el={link} key={link.label} />
//         ))}
//       </div>

//       <div className=''>
//         <button className='w-full flex gap-2 p-2 items-center text-lg text-gray-800'>
//           <MdSettings />
//           <span>Settings</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;


import React from "react";
import {
  MdDashboard,
  MdOutlineAddTask,
  MdOutlinePendingActions,
  MdSettings,
  MdTaskAlt,
} from "react-icons/md";
import { FaTasks, FaTrashAlt, FaUsers } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setOpenSidebar } from "../redux/slices/authSlice";
import clsx from "clsx";
import logo from "/logo.png";

// Base links for all users
const baseLinks = [
  {
    label: "Dashboard",
    link: "dashboard",
    icon: <MdDashboard />,
  },
  {
    label: "Objectives",
    link: "tasks",
    icon: <FaTasks />,
  },
  {
    label: "Completed",
    link: "completed/completed",
    icon: <MdTaskAlt />,
  },
  {
    label: "In Progress",
    link: "in-progress/in progress",
    icon: <MdOutlinePendingActions />,
  },
  {
    label: "To Do",
    link: "todo/todo",
    icon: <MdOutlinePendingActions />,
  },
];

// Admin-specific links
const adminLinks = [
  {
    label: "Team",
    link: "team",
    icon: <FaUsers />,
    adminOnly: true
  },
  {
    label: "User Ratings",
    link: "rating",
    icon: <FaUsers />,
    adminOnly: true
  },
];

// Super Admin exclusive links
const superAdminLinks = [
  {
    label: "Settings",
    link: "settings",
    icon: <MdSettings />,
    superAdminOnly: true
  }
];

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const path = location.pathname.split("/")[1];

  const closeSidebar = () => dispatch(setOpenSidebar(false));

  // Combine links based on user role
  const getFilteredLinks = () => {
    let links = [...baseLinks];
    
    if (user?.isAdmin || user?.isSuperAdmin) {
      links = [...links, ...adminLinks];
    }
    
    if (user?.isSuperAdmin) {
      links = [...links, ...superAdminLinks];
    }
    
    return links;
  };

  const NavLink = ({ el }) => (
    <Link
      to={el.link}
      onClick={closeSidebar}
      className={clsx(
        "w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-full items-center text-gray-800 text-base hover:bg-[#2564ed2d]",
        path === el.link.split("/")[0] ? "bg-blue-700 text-neutral-100" : ""
      )}
    >
      {el.icon}
      <span className='hover:text-[#2564ed]'>{el.label}</span>
    </Link>
  );

  return (
    <div className='w-full h-full flex flex-col gap-6 p-5'>
      <h1 className='flex gap-1 items-center'>
        <p className='p-2 rounded-full'>
          <img src={logo} className='text-white text-2xl font-black w-20' alt="Logo" />
        </p>
      </h1>

      <div className='flex-1 flex flex-col gap-y-5 py-8'>
        {getFilteredLinks().map((link) => (
          <NavLink el={link} key={link.label} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;