import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  Edit2,
} from 'lucide-react';
import {
  useGetUsersQuery,
  useUpdateUserMutation,
} from '../../redux/slices/api/usersApiSlice';
import { useGetDepartmentsQuery } from '../../redux/slices/api/departmentApiSlice';
import { toast } from 'sonner';

const AdminUsers = () => {
  const {
    data: usersData,
    isLoading: isUsersLoading,
    error: usersError,
    refetch,
  } = useGetUsersQuery();
  const { data: departmentsData, isLoading: isDepartmentsLoading } = useGetDepartmentsQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [editUserIds, setEditUserIds] = useState(new Set());
  const [editFormData, setEditFormData] = useState({});
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const usersPerPage = 10;

  // Role options (match backend roles)
  const roleOptions = ['admin', 'manager', 'staff'];

  // Department options
  const departmentOptions = useMemo(() => {
    if (!departmentsData) return [];
    return departmentsData.map((dept) => ({ id: dept._id, name: dept.name }));
  }, [departmentsData]);

  // Handle sorting
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

// Update the sort function to use the helper
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
        ? getDepartmentName(a.department)
        : a[sortConfig.key];
    const valueB =
      sortConfig.key === 'department'
        ? getDepartmentName(b.department)
        : b[sortConfig.key];
    if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });
}, [usersData?.users, searchTerm, sortConfig, departmentOptions]);

  // Sort and filter users
  
  // Pagination logic
  const totalPages = Math.ceil(sortedAndFilteredUsers.length / usersPerPage);
  const paginatedUsers = sortedAndFilteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle edit click
  const handleEditClick = (user) => {
    console.log('Editing user:', user); // Debug
    setEditUserIds((prev) => new Set(prev).add(user._id));
    setEditFormData((prev) => ({
      ...prev,
      [user._id]: {
        role: user.role || '',
        department: user.department?._id || '',
      },
    }));
  };

  // Handle edit form change
  const handleEditFormChange = (userId, e) => {
    const { name, value } = e.target;
    console.log('Form change:', { userId, name, value }); // Debug
    setEditFormData((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [name]: value,
      },
    }));
  };

  // Handle update user
  const handleUpdateUser = async (userId) => {
    const userData = editFormData[userId];
    if (!userData?.role) {
      toast.error('Role is required');
      return;
    }

    if (!roleOptions.includes(userData.role)) {
      toast.error('Invalid role selected');
      return;
    }

    setUpdatingUserId(userId);
    try {
      const payload = {
        id: userId,
        role: userData.role,
        department: userData.department || null,
      };
      console.log('Updating user with payload:', payload); // Debug
      await updateUser(payload).unwrap();
      toast.success('User updated successfully');
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
      console.error('Update error:', err); // Debug
      const errorMessage =
        err?.data?.message ||
        (err.status === 400
          ? 'Invalid input data'
          : err.status === 404
          ? 'User not found'
          : 'Failed to update user');
      toast.error(errorMessage);
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Handle cancel edit
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

  // Render sort icon
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline ml-1" />
    );
  };

  console.log("user is", usersData)

  // Capitalize role for display
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">User Management</h1>

      {/* Search Bar */}
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

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                onClick={() => handleSort('name')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              >
                Name {renderSortIcon('name')}
              </th>
              <th
                onClick={() => handleSort('email')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              >
                Email {renderSortIcon('email')}
              </th>
              <th
                onClick={() => handleSort('role')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              >
                Role {renderSortIcon('role')}
              </th>
              <th
                onClick={() => handleSort('department')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              >
                Department {renderSortIcon('department')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
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
                        value={editFormData[user._id]?.role || ''}
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
      value={editFormData[user._id]?.department || ''}
      onChange={(e) => handleEditFormChange(user._id, e)}
      className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      disabled={isDepartmentsLoading || departmentOptions.length === 0}
    >
      <option value="">No Department</option>
      {departmentOptions.map((dept) => (
        <option key={dept.id} value={dept.id}>
          {dept.name}
        </option>
      ))}
    </select>
  ) : (
    getDepartmentName(user.department)
  )}
</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {editUserIds.has(user._id) ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdateUser(user._id)}
                          disabled={updatingUserId === user._id}
                          className={`px-3 py-1 text-sm font-medium rounded-md ${
                            updatingUserId === user._id
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          } transition-colors`}
                        >
                          {updatingUserId === user._id ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => handleCancelEdit(user._id)}
                          className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEditClick(user)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * usersPerPage + 1} to{' '}
            {Math.min(currentPage * usersPerPage, sortedAndFilteredUsers.length)} of{' '}
            {sortedAndFilteredUsers.length} users
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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