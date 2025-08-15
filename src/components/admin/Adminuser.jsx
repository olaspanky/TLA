import { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  Edit2,
  User,
  X,
} from 'lucide-react';
import {
  useGetUsersQuery,
  useUpdateUserMutation,
  useToggleUserStatusMutation,
  useAssignUserDetailsMutation,
} from '../../redux/slices/api/usersApiSlice';
import { useGetDepartmentsQuery } from '../../redux/slices/api/departmentApiSlice';
import { selectCurrentUser } from "../../redux/slices/authSlice"; 
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

const AdminUsers = () => {
  const currentUser = useSelector(selectCurrentUser);
  const authState = useSelector((state) => state.auth);

  console.log("Current auth state:", authState);
  console.log("Current user:", currentUser);
  const {
    data: usersData,
    isLoading: isUsersLoading,
    error: usersError,
    refetch,
  } = useGetUsersQuery();
  const { data: departmentsData, isLoading: isDepartmentsLoading } = useGetDepartmentsQuery();
  const [updateUser] = useUpdateUserMutation();
  const [toggleUserStatus, { isLoading: isTogglingStatus }] = useToggleUserStatusMutation();
  const [assignUserDetails, { isLoading: isAssigningUser }] = useAssignUserDetailsMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [editUserIds, setEditUserIds] = useState(new Set());
  const [editFormData, setEditFormData] = useState({});
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [isSubObjectiveModalOpen, setIsSubObjectiveModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const usersPerPage = 10;

  const roleOptions = ['admin', 'manager', 'staff'];

  const departmentOptions = useMemo(() => {
    if (!departmentsData) return [];
    return departmentsData.map((dept) => ({ id: dept._id, name: dept.name }));
  }, [departmentsData]);

  const userOptions = useMemo(() => {
    if (!usersData?.users) return [];
    return usersData.users
      .filter((u) => ['admin', 'manager'].includes(u.role))
      .map((u) => ({ id: u._id, name: u.name, email: u.email, role: u.role }));
  }, [usersData?.users]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getDepartmentName = (departmentId) => {
    if (!departmentId) return 'No department';
    const dept = departmentOptions.find((d) => d.id === departmentId);
    return dept ? dept.name : 'Unknown department';
  };

  const getReportingToName = (reportingTo) => {
    if (!reportingTo || reportingTo.length === 0) return 'None';
    const reportingToId = reportingTo[0]; 
    const manager = userOptions.find((u) => u.id === reportingToId);
    return manager ? `${manager.name} (${manager.email})` : 'Unknown';
  };

  const sortedAndFilteredUsers = useMemo(() => {
    if (!usersData?.users) return [];

    let filteredUsers = usersData.users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filteredUsers.sort((a, b) => {
      const valueA =
        sortConfig.key === 'department'
          ? getDepartmentName(a.department?._id || a.department)
          : sortConfig.key === 'isActive'
          ? a.isActive.toString()
          : sortConfig.key === 'reportingTo'
          ? getReportingToName(a.reportingTo)
          : a[sortConfig.key];
      const valueB =
        sortConfig.key === 'department'
          ? getDepartmentName(b.department?._id || b.department)
          : sortConfig.key === 'isActive'
          ? b.isActive.toString()
          : sortConfig.key === 'reportingTo'
          ? getReportingToName(b.reportingTo)
          : b[sortConfig.key];
      if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [usersData?.users, searchTerm, sortConfig, departmentOptions, userOptions]);

  const totalPages = Math.ceil(sortedAndFilteredUsers.length / usersPerPage);
  const paginatedUsers = sortedAndFilteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEditClick = (user) => {
    setEditUserIds((prev) => new Set(prev).add(user._id));
    setEditFormData((prev) => ({
      ...prev,
      [user._id]: {
        role: user.role || "",
        department: user.department?._id || user.department || "",
        reportingTo:
          user.reportingTo && user.reportingTo.length > 0
            ? user.reportingTo[0]
            : "",
      },
    }));
  };

  const handleEditFormChange = (userId, e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [name]: value,
      },
    }));
  };

  const handleUpdateUser = async (userId) => {
    console.log("Current user:", currentUser);

    const userData = editFormData[userId];
    console.log("User data being edited:", userData);
    if (!userData?.role) {
      toast.error("Role is required");
      return;
    }

    if (!roleOptions.includes(userData.role)) {
      toast.error("Invalid role selected");
      return;
    }

    if (
      currentUser?.role === "super_admin" &&
      userData.reportingTo !== undefined
    ) {
      if (userData.reportingTo !== "") {
        const selectedUser = userOptions.find(
          (u) => u.id === userData.reportingTo
        );
        if (!selectedUser) {
          toast.error(
            "Selected reporting manager is invalid or does not exist"
          );
          return;
        }
        if (!["admin", "manager"].includes(selectedUser.role)) {
          toast.error('Reporting manager must have role "admin" or "manager"');
          return;
        }
        if (userData.reportingTo === userId) {
          toast.error("User cannot report to themselves");
          return;
        }
      }
    }

    setUpdatingUserId(userId);
    try {
      const payload = {
        id: userId,
        role: userData.role,
        departmentId: userData.department || null,
      };

  
      if (currentUser?.role === "super_admin") {
        payload.reportingTo = userData.reportingTo ?? null;
      }

      console.log("Submitting payload:", payload);
      await assignUserDetails(payload).unwrap();
      toast.success("User details assigned successfully");

      setEditUserIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });

      setEditFormData((prev) => {
        const newData = { ...prev };
        delete newData[userId];
        return newData;
      });

      refetch();
    } catch (err) {
      const errorMessage =
        err?.data?.error ||
        err?.data?.message ||
        (err.status === 400
          ? "Invalid input data. Please check the reporting manager selection."
          : err.status === 403
          ? "Only super_admin can assign reportingTo"
          : err.status === 404
          ? "User or department not found"
          : "Failed to assign user details");
      toast.error(errorMessage);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleCancelEdit = (userId) => {
    setEditUserIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(userId);
      return newSet;
    });
    setEditFormData((prev) => {
      const newData = { ...prev };
      delete newData[userId];
      return newData;
    });
  };

  const handleToggleUserStatus = async (userId) => {
    if (!userId) {
      toast.error('Invalid user ID');
      return;
    }

    setUpdatingUserId(userId);
    try {
      const response = await toggleUserStatus(userId).unwrap();
      toast.success(response.message || 'User status toggled successfully');
      refetch();
    } catch (err) {
      const errorMessage =
        err?.data?.message ||
        (err.status === 400
          ? 'Bad request'
          : err.status === 401
          ? 'Unauthorized'
          : err.status === 403
          ? 'Forbidden'
          : err.status === 404
          ? 'User not found'
          : 'Failed to toggle user status');
      toast.error(errorMessage);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleOpenSubObjectiveModal = (user) => {
    setSelectedUser(user);
    setIsSubObjectiveModalOpen(true);
  };

  const handleCloseSubObjectiveModal = () => {
    setIsSubObjectiveModalOpen(false);
    setSelectedUser(null);
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline ml-1" />
    );
  };

  const capitalizeRole = (role) => {
    if (!role) return '';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  if (isUsersLoading || isDepartmentsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading users...</span>
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="flex justify-center items-center h-64 text-red-600">
        <AlertCircle className="w-8 h-8 mr-2" />
        Error: {usersError?.data?.message || 'Failed to load users'}
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        User Management
      </h1>

      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                onClick={() => handleSort("name")}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              >
                Name {renderSortIcon("name")}
              </th>
              <th
                onClick={() => handleSort("email")}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              >
                Email {renderSortIcon("email")}
              </th>
              <th
                onClick={() => handleSort("role")}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              >
                Role {renderSortIcon("role")}
              </th>
              <th
                onClick={() => handleSort("department")}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              >
                Department {renderSortIcon("department")}
              </th>
              <th
                onClick={() => handleSort("reportingTo")}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              >
                Reports To {renderSortIcon("reportingTo")}
              </th>
              <th
                onClick={() => handleSort("isActive")}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              >
                Status {renderSortIcon("isActive")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {editUserIds.has(user._id) ? (
                      <select
                        name="role"
                        value={editFormData[user._id]?.role || ""}
                        onChange={(e) => handleEditFormChange(user._id, e)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Role</option>
                        {roleOptions.map((role) => (
                          <option key={role} value={role}>
                            {capitalizeRole(role)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      capitalizeRole(user.role)
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {editUserIds.has(user._id) ? (
                      <select
                        name="department"
                        value={editFormData[user._id]?.department || ""}
                        onChange={(e) => handleEditFormChange(user._id, e)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={
                          isDepartmentsLoading || departmentOptions.length === 0
                        }
                      >
                        <option value="">No Department</option>
                        {departmentOptions.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      getDepartmentName(user.department?._id || user.department)
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {editUserIds.has(user._id) ? (
                      <select
                        name="reportingTo"
                        value={editFormData[user._id]?.reportingTo ?? ""}
                        onChange={(e) => {
                          handleEditFormChange(user._id, e);
                          e.target.blur();
                        }}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={userOptions.length === 0}
                      >
                        <option value="">None</option>
                        {userOptions
                          .filter((u) => u.id !== user._id)
                          .map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.name} ({u.email}) - {capitalizeRole(u.role)}
                            </option>
                          ))}
                      </select>
                    ) : user.reportingTo && user.reportingTo.length > 0 ? (
                      usersData?.users?.find(
                        (u) => u._id === user.reportingTo[0]
                      )?.name || "Unknown"
                    ) : (
                      "None"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.isActive ? "Active" : "Inactive"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      {editUserIds.has(user._id) ? (
                        <>
                          <button
                            onClick={() => handleUpdateUser(user._id)}
                            disabled={
                              updatingUserId === user._id || isAssigningUser
                            }
                            className={`px-3 py-1 text-sm font-medium rounded-md ${
                              updatingUserId === user._id || isAssigningUser
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            } transition-colors`}
                          >
                            {updatingUserId === user._id || isAssigningUser
                              ? "Saving..."
                              : "Save"}
                          </button>
                          <button
                            onClick={() => handleCancelEdit(user._id)}
                            className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditClick(user)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            title="Edit User"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleUserStatus(user._id)}
                            disabled={
                              updatingUserId === user._id || isTogglingStatus
                            }
                            className={`px-3 py-1 text-sm font-medium rounded-md ${
                              updatingUserId === user._id || isTogglingStatus
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : user.isActive
                                ? "bg-red-600 text-white hover:bg-red-700"
                                : "bg-green-600 text-white hover:bg-green-700"
                            } transition-colors`}
                            title={
                              user.isActive
                                ? "Deactivate User"
                                : "Activate User"
                            }
                          >
                            {updatingUserId === user._id || isTogglingStatus
                              ? "Toggling..."
                              : user.isActive
                              ? "Deactivate"
                              : "Activate"}
                          </button>
                          <button
                            onClick={() => handleOpenSubObjectiveModal(user)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            title="View Sub-Objectives"
                            disabled={!user.SubObjective}
                          >
                            <User className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isSubObjectiveModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Sub-Objectives for {selectedUser.name}
              </h3>
              <button
                onClick={handleCloseSubObjectiveModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {selectedUser.SubObjective ? (
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    Sub-Objective
                  </h4>
                  <p className="text-sm text-gray-600">
                    <strong>Title:</strong>{" "}
                    {selectedUser.SubObjective.title || "No title"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Description:</strong>{" "}
                    {selectedUser.SubObjective.description || "No description"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Status:</strong>{" "}
                    {selectedUser.SubObjective.status || "Unknown"}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  No sub-objectives assigned.
                </p>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={handleCloseSubObjectiveModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * usersPerPage + 1} to{" "}
            {Math.min(
              currentPage * usersPerPage,
              sortedAndFilteredUsers.length
            )}{" "}
            of {sortedAndFilteredUsers.length} users
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;