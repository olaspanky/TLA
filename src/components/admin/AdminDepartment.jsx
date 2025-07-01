import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  Edit2,
  Plus,
  X,
} from 'lucide-react';
import {
  useCreateDepartmentMutation,
  useGetDepartmentsQuery,
  useUpdateDepartmentMutation,
} from '../../redux/slices/api/departmentApiSlice';
import { useGetUsersQuery } from '../../redux/slices/api/usersApiSlice';
import { toast } from 'sonner';

const AdminDepartments = () => {
  // API Queries
  const { data: departmentsData, isLoading, error, refetch } = useGetDepartmentsQuery();
  const { data: usersData, isLoading: isUsersLoading } = useGetUsersQuery();
  const [createDepartment, { isLoading: isCreating }] = useCreateDepartmentMutation();
  const [updateDepartment, { isLoading: isUpdating }] = useUpdateDepartmentMutation();

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [editDepartmentId, setEditDepartmentId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', head: '' });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({ name: '', head: '' });
  const departmentsPerPage = 10;

  // Get eligible department heads (managers and admins)
  const eligibleHeads = useMemo(() => {
    if (!usersData?.users) return [];
    const heads = usersData.users
      .filter((user) => {
        const role = user.role?.toLowerCase();
        return ['admin', 'manager'].includes(role);
      })
      .map((user) => ({
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      }));
    console.log('Eligible heads:', heads); // Debug
    return heads;
  }, [usersData?.users]);

  // Check for unique department name
  const isDepartmentNameUnique = (name, currentDepartmentId = null) => {
    if (!departmentsData || !name?.trim()) return false;
    return !departmentsData.some(
      (dept) =>
        dept.name.toLowerCase() === name.toLowerCase().trim() &&
        dept._id !== currentDepartmentId
    );
  };

  // Validate head ID
  const isValidHead = (headId) => {
    return !headId || eligibleHeads.some((head) => head.id === headId);
  };

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Render head information
const renderHeadInfo = (head) => {
  if (!head) return 'No head assigned';
  
  if (typeof head === 'object' && head.name && head.role) {
    return `${head.name} (${head.role})`;
  }
  
  if (typeof head === 'string') {
    const headUser = eligibleHeads.find((h) => h.id === head);
    return headUser ? `${headUser.name} (${headUser.role})` : 'No head assigned';
  }
  
  return 'Invalid head data';
};

  // Sort and filter departments
  const sortedAndFilteredDepartments = useMemo(() => {
    if (!departmentsData) return [];

    let filteredDepartments = departmentsData.filter((department) =>
      department.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedDepartments = filteredDepartments.sort((a, b) => {
      const key = sortConfig.key;
      const valueA =
        key === 'head' ? renderHeadInfo(a.head) : a[key];
      const valueB =
        key === 'head' ? renderHeadInfo(b.head) : b[key];
      if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    console.log('Sorted departments:', sortedDepartments); // Debug
    return sortedDepartments;
  }, [departmentsData, searchTerm, sortConfig, eligibleHeads]);

  // Pagination logic
  const totalPages = Math.ceil(sortedAndFilteredDepartments.length / departmentsPerPage);
  const paginatedDepartments = sortedAndFilteredDepartments.slice(
    (currentPage - 1) * departmentsPerPage,
    currentPage * departmentsPerPage
  );

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle edit click
  const handleEditClick = (department) => {
    console.log('Editing department:', department); // Debug
    setEditDepartmentId(department._id);
    setEditFormData({
      name: department.name,
      head: department.head || '',
    });
  };

  // Handle edit form change
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    console.log('Edit form change:', { name, value }); // Debug
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle create form change
  const handleCreateFormChange = (e) => {
    const { name, value } = e.target;
    console.log('Create form change:', { name, value }); // Debug
    setCreateFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle create department
  const handleCreateDepartment = async () => {
    if (!createFormData.name.trim()) {
      toast.error('Department name is required');
      return;
    }

    if (!isDepartmentNameUnique(createFormData.name)) {
      toast.error('Department name must be unique');
      return;
    }

    if (!isValidHead(createFormData.head)) {
      toast.error('Invalid department head selected');
      return;
    }

    try {
      const payload = {
        name: createFormData.name.trim(),
        head: createFormData.head || null,
      };
      console.log('Creating department:', payload); // Debug
      await createDepartment(payload).unwrap();
      toast.success('Department created successfully');
      setIsCreateModalOpen(false);
      setCreateFormData({ name: '', head: '' });
      refetch();
    } catch (err) {
      console.error('Create error:', err); // Debug
      toast.error(err?.data?.message || 'Failed to create department');
    }
  };

  // Handle update department
  const handleUpdateDepartment = async () => {
    if (!editFormData.name.trim()) {
      toast.error('Department name is required');
      return;
    }

    if (!isDepartmentNameUnique(editFormData.name, editDepartmentId)) {
      toast.error('Department name must be unique');
      return;
    }

    if (!isValidHead(editFormData.head)) {
      toast.error('Invalid department head selected');
      return;
    }

    try {
      const payload = {
        id: editDepartmentId,
        name: editFormData.name.trim(),
        head: editFormData.head || null,
      };
      console.log('Updating department:', payload); // Debug
      await updateDepartment(payload).unwrap();
      toast.success('Department updated successfully');
      setEditDepartmentId(null);
      setEditFormData({ name: '', head: '' });
      refetch();
    } catch (err) {
      console.error('Update error:', err); // Debug
      const errorMessage =
        err?.data?.message ||
        (err.status === 405
          ? 'Method not allowed. Check if the server supports PATCH for updates.'
          : err.status === 404
          ? 'Department or head not found'
          : 'Failed to update department');
      toast.error(errorMessage);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditDepartmentId(null);
    setEditFormData({ name: '', head: '' });
  };

  // Handle cancel create
  const handleCancelCreate = () => {
    setIsCreateModalOpen(false);
    setCreateFormData({ name: '', head: '' });
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

  if (isLoading || isUsersLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading departments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-600">
        <AlertCircle className="w-8 h-8 mr-2" />
        Error: {error?.data?.message || 'Failed to load departments'}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Department Management</h1>
        <button
          onClick={() => {
            console.log('Add Department clicked'); // Debug
            setIsCreateModalOpen(true);
          }}
          className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
          disabled={isUsersLoading}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Department
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by department name..."
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
                onClick={() => handleSort('head')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              >
                Head {renderSortIcon('head')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedDepartments.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                  No departments found.
                </td>
              </tr>
            ) : (
              paginatedDepartments.map((department) => (
                <tr key={department._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editDepartmentId === department._id ? (
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleEditFormChange}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter department name"
                      />
                    ) : (
                      department.name
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {editDepartmentId === department._id ? (
                      <>
                        <select
                          name="head"
                          value={editFormData.head}
                          onChange={handleEditFormChange}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">No Head</option>
                          {eligibleHeads.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.name} ({user.role})
                            </option>
                          ))}
                        </select>
                        {eligibleHeads.length === 0 && !isUsersLoading && (
                          <p className="mt-1 text-sm text-red-600">
                            No eligible heads (admin or manager) available
                          </p>
                        )}
                      </>
                    ) : (
                      renderHeadInfo(department.head)
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {editDepartmentId === department._id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleUpdateDepartment}
                          disabled={isUpdating}
                          className={`px-3 py-1 text-sm font-medium rounded-md ${
                            isUpdating
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          } transition-colors`}
                        >
                          {isUpdating ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEditClick(department)}
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
            Showing {(currentPage - 1) * departmentsPerPage + 1} to{' '}
            {Math.min(currentPage * departmentsPerPage, sortedAndFilteredDepartments.length)} of{' '}
            {sortedAndFilteredDepartments.length} departments
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

      {/* Create Department Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Create Department</h3>
              <button
                onClick={handleCancelCreate}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Department Name</label>
                <input
                  type="text"
                  name="name"
                  value={createFormData.name}
                  onChange={handleCreateFormChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter department name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department Head</label>
                <select
                  name="head"
                  value={createFormData.head}
                  onChange={handleCreateFormChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">No Head</option>
                  {eligibleHeads.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
                {eligibleHeads.length === 0 && !isUsersLoading && (
                  <p className="mt-1 text-sm text-red-600">
                    No eligible heads (admin or manager) available
                  </p>
                )}
              </div>
            </form>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleCancelCreate}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDepartment}
                disabled={isCreating || !createFormData.name.trim()}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isCreating || !createFormData.name.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isCreating ? 'Creating...' : 'Create Department'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDepartments;