import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { Fragment, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import TaskDetails from "./pages/TaskDetails";
import Tasks from "./pages/Tasks2";
import Trash from "./pages/Trash";
import Users from "./pages/Users";
import Dashboard from "./pages/dashboard";
import Dashboard2 from "./pages/dashboard2";
import Progress from "./pages/Progress";
import Development from "./pages/Development";
import Register from "./pages/Register";
import Rating from "./pages/Rating";
import Admin from "./pages/Admindash";
import Admin2 from "./pages/Adminobj";
import Admin3 from "./pages/AdminPT";
import SAdmin1 from "./pages/SAdmin1";
import SAdmin2 from "./pages/SAdmin2";
import SAdmin3 from "./pages/Admindevelopment";
import { setOpenSidebar } from "./redux/slices/authSlice";

function Layout() {
  const { user } = useSelector((state) => state.auth);

  const location = useLocation();

  return user ? (
    <div className='w-full h-screen flex flex-col md:flex-row'>
    

      <div className='flex-1 overflow-y-auto pb-12'>
        <Navbar />

        <div className='z-30  2xl:mt-[-100px] lg:mt-[-60px]  2xl:mx-20 mx-9 rounded-lg shadow-md'> 
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to='/log-in' state={{ from: location }} replace />
  );
}

const MobileSidebar = () => {
  const { isSidebarOpen } = useSelector((state) => state.auth);
  const mobileMenuRef = useRef(null);
  const dispatch = useDispatch();

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  return (
    <>
      <Transition
        show={isSidebarOpen}
        as={Fragment}
        enter='transition-opacity duration-700'
        enterFrom='opacity-x-10'
        enterTo='opacity-x-100'
        leave='transition-opacity duration-700'
        leaveFrom='opacity-x-100'
        leaveTo='opacity-x-0'
      >
        {(ref) => (
          <div
            ref={(node) => (mobileMenuRef.current = node)}
            className={clsx(
              "md:hidden w-full h-full bg-black/40 transition-all duration-700 transform ",
              isSidebarOpen ? "translate-x-0" : "translate-x-full"
            )}
            onClick={() => closeSidebar()}
          >
            <div className='bg-white w-3/4 h-full'>
              <div className='w-full flex justify-end px-5 mt-5'>
                <button
                  onClick={() => closeSidebar()}
                  className='flex justify-end items-end'
                >
                  <IoClose size={25} />
                </button>
              </div>

              <div className='-mt-10'>
                <Sidebar />
              </div>
            </div>
          </div>
        )}
      </Transition>
    </>
  );
};

function App() {
  return (
    <main className='w-full min-h-screen bg-[#f3f4f6] '>
      <Routes>
        <Route element={<Layout />}>
          <Route index path='/' element={<Navigate to='/dashboard' />} />
          <Route path='/dashboard' element={<Dashboard2 />} />
          <Route path='/dashboard2' element={<Dashboard />} />
          <Route path='/progress' element={<Progress />} />
          <Route path='/development' element={<Development />} />
          <Route path='/tasks' element={<Tasks />} />
          <Route path='/completed/:status' element={<Tasks />} />
          <Route path='/in-progress/:status' element={<Tasks />} />
          <Route path='/todo/:status' element={<Tasks />} />
          <Route path='/team' element={<Users />} />
          <Route path='/trashed' element={<Trash />} />
          <Route path='/task/:id' element={<TaskDetails />} />
          <Route path='/rating' element={<Rating />} />
          <Route path='/admin' element={<Admin />} />
          <Route path='/admin2' element={<Admin2 />} />
          <Route path='/admin3' element={<Admin3 />} />
          <Route path='/sadmin1' element={<SAdmin1 />} />
          <Route path='/sadmin2' element={<SAdmin2 />} />
          <Route path='/sadmin3' element={<SAdmin3 />} />
        </Route>

        <Route path='/log-in' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>

      <Toaster richColors />
    </main>
  );
}

export default App;
