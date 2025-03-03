import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { BsChevronExpand } from "react-icons/bs";
import clsx from "clsx";
import { getInitials } from "../../utils";
import { MdCheck } from "react-icons/md";
import { useGetTeamListQuery } from "../../redux/slices/api/userApiSlice";
import { useSelector } from "react-redux";

const UserList = ({ setTeam, team }) => {
  const { data, isLoading, error } = useGetTeamListQuery();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { user } = useSelector((state) => state.auth);

  // Ensure data is an array, fallback to empty if undefined
  const safeData = Array.isArray(data) ? data : [];

  const handleChange = (el) => {
    const validUsers = (Array.isArray(el) ? el : []).filter(u => u && u._id);
    setSelectedUsers(validUsers);
    setTeam(validUsers.map(u => u._id));
  };

  useEffect(() => {
    if (isLoading || error || !user) return;

    // Convert team IDs to full user objects if team is an array of IDs
    let initialSelected = [];
    if (team?.length > 0) {
      initialSelected = safeData.filter(u => team.includes(u._id));
    }

    // If no valid team members, default to current user
    if (!initialSelected.length) {
      const currentUserInData = safeData.find(u => u._id === user._id);
      initialSelected = currentUserInData ? [currentUserInData] : [user];
    }

    // Only update if the selected users have changed
    if (JSON.stringify(initialSelected) !== JSON.stringify(selectedUsers)) {
      setSelectedUsers(initialSelected);
      setTeam(initialSelected.map(u => u._id));
    }
  }, [data, isLoading, error, user, team]); // Removed setTeam from dependencies

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error loading users: {error.message}</div>;

  return (
    <div>
      <p className='text-gray-700'>Assign Task To: </p>
      <Listbox
        value={selectedUsers}
        onChange={handleChange}
        multiple
      >
        <div className='relative mt-1'>
          <Listbox.Button className='relative w-full cursor-default rounded bg-white pl-3 pr-10 text-left px-3 py-2.5 2xl:py-3 border border-gray-300 sm:text-sm'>
            <span className='block truncate'>
              {selectedUsers.length > 0
                ? selectedUsers.map(u => u.name).join(", ")
                : "Select users..."}
            </span>
            <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
              <BsChevronExpand className='h-5 w-5 text-gray-400' aria-hidden='true' />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Listbox.Options className='z-50 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm'>
              {safeData.length > 0 ? (
                safeData.map((user, index) => (
                  <Listbox.Option
                    key={user._id || index}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                      }`
                    }
                    value={user}
                  >
                    {({ selected }) => (
                      <>
                        <div
                          className={clsx(
                            "flex items-center gap-2 truncate",
                            selected ? "font-medium" : "font-normal"
                          )}
                        >
                          <div className='w-6 h-6 rounded-full text-white flex items-center justify-center bg-violet-600'>
                            <span className='text-center text-[10px]'>
                              {getInitials(user.name || "Unknown")}
                            </span>
                          </div>
                          <span>{user.name || "Unnamed User"}</span>
                        </div>
                        {selected && (
                          <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600'>
                            <MdCheck className='h-5 w-5' aria-hidden='true' />
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))
              ) : (
                <div className="py-2 pl-10 text-gray-500">No users available</div>
              )}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default UserList;