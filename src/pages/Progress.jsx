import React, { useState, useEffect } from 'react';
import {
  Filter,
  Plus,
  Calendar,
  ExternalLink,
  MessageSquare,
  MoreHorizontal,
  X,
  Edit2,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  useGetDepartmentObjectivesQuery,
  useAddObjectiveCommentMutation,
  useUpdateObjectiveMutation,
  useAcceptObjectiveMutation,
  useDeclineObjectiveMutation,
  useUpdateObjectiveProgressMutation,
  useApproveObjectiveCompletionMutation,
  useRejectObjectiveCompletionMutation,
} from '../redux/slices/api/objectiveApiSlice';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { selectCurrentUser } from '../redux/slices/authSlice';

const ProgressTracking = () => {
  const navigate = useNavigate();
   const { user, auth } = useSelector((state) => ({
    user: selectCurrentUser(state),
    auth: state.auth
  }));
  const isAdmin = user?.role === 'admin'; // Check if user is an admin
  const [isActionLoading, setIsActionLoading] = useState({});
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [viewedObjectives, setViewedObjectives] = useState({});
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priorityLevel: '',
    sortBy: 'createdAt',
    order: 'desc',
    page: 1,
    limit: 10,
    progressRange: '',
  });
  const [commentInput, setCommentInput] = useState('');
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedObjectiveId, setSelectedObjectiveId] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    title: '',
    description: '',
    priorityLevel: 'Medium',
    startDate: '',
    endDate: '',
    subObjectives: [],
  });
  const [openCommentDropdowns, setOpenCommentDropdowns] = useState({});
  const [openProgressDropdowns, setOpenProgressDropdowns] = useState({});

  const departmentId = user?.department?._id || '60d0fe4f5311236168a109ca';
  const { data: objectivesData, isLoading, isError, error, refetch } = useGetDepartmentObjectivesQuery({
    departmentId,
    ...filters,
  });
  const [addComment, { isLoading: isCommenting }] = useAddObjectiveCommentMutation();
  const [updateObjective, { isLoading: isUpdating }] = useUpdateObjectiveMutation();
  const [acceptObjective, { isLoading: isAccepting }] = useAcceptObjectiveMutation();
  const [declineObjective, { isLoading: isDeclining }] = useDeclineObjectiveMutation();
  const [updateObjectiveProgress, { isLoading: isUpdatingProgress }] = useUpdateObjectiveProgressMutation();
  const [approveObjectiveCompletion, { isLoading: isApprovingCompletion }] = useApproveObjectiveCompletionMutation();
  const [rejectObjectiveCompletion, { isLoading: isRejectingCompletion }] = useRejectObjectiveCompletionMutation();

  useEffect(() => {
    if (isError) {
      console.error('Error fetching objectives:', error);
      toast.error(error?.data?.error || 'Failed to load objectives');
    }
  }, [isError, error]);

  const normalizeUrl = (url) => {
    if (!url) return null;
    return url.replace(/([^:]\/)\/+/g, '$1');
  };

  const handleAcceptObjective = async (objective) => {
    if (!objective._id || !objective.acceptLink) {
      toast.error('Invalid objective ID or accept link');
      return;
    }

    if (!viewedObjectives[objective._id]) {
      toast.error('Please view task details before accepting');
      return;
    }

    setIsActionLoading((prev) => ({ ...prev, [objective._id]: true }));
    const normalizedUrl = normalizeUrl(`https://${objective.acceptLink}`);

    try {
      const response = await fetch(normalizedUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to accept objective');
      }

      toast.success(`Objective "${objective.title}" accepted successfully!`, {
        position: 'top-right',
        duration: 5000,
      });
      refetch();
    } catch (err) {
      console.error('Error accepting objective:', err);
      toast.error(
        err.message.includes('Failed to fetch')
          ? 'Network error: Unable to connect to the server.'
          : err.message || 'Failed to accept objective',
        { position: 'top-right', duration: 5000 }
      );

      try {
        await acceptObjective({ objectiveId: objective._id }).unwrap();
        toast.success(`Objective "${objective.title}" accepted successfully via fallback!`, {
          position: 'top-right',
          duration: 5000,
        });
        refetch();
      } catch (fallbackErr) {
        toast.error(fallbackErr?.data?.message || 'Fallback failed: Unable to accept objective');
      }
    } finally {
      setIsActionLoading((prev) => ({ ...prev, [objective._id]: false }));
    }
  };

  const handleDeclineObjective = async (objective) => {
    if (!objective._id || !objective.declineLink) {
      toast.error('Invalid objective ID or decline link');
      return;
    }

    if (!viewedObjectives[objective._id]) {
      toast.error('Please view task details before declining');
      return;
    }

    setIsActionLoading((prev) => ({ ...prev, [objective._id]: true }));
    const normalizedUrl = normalizeUrl(`https://${objective.declineLink}`);

    try {
      const response = await fetch(normalizedUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to decline objective');
      }

      toast.success(`Objective "${objective.title}" declined successfully!`, {
        position: 'top-right',
        duration: 5000,
      });
      refetch();
    } catch (err) {
      console.error('Error declining objective:', err);
      toast.error(
        err.message.includes('Failed to fetch')
          ? 'Network error: Unable to connect to the server.'
          : err.message || 'Failed to decline objective',
        { position: 'top-right', duration: 5000 }
      );

      try {
        await declineObjective({ objectiveId: objective._id }).unwrap();
        toast.success(`Objective "${objective.title}" declined successfully via fallback!`, {
          position: 'top-right',
          duration: 5000,
        });
        refetch();
      } catch (fallbackErr) {
        toast.error(fallbackErr?.data?.message || 'Fallback failed: Unable to decline objective');
      }
    } finally {
      setIsActionLoading((prev) => ({ ...prev, [objective._id]: false }));
    }
  };

  const handleApproveCompletion = async (objective) => {
    if (!isAdmin) {
      toast.error('Only admins can approve task completion');
      return;
    }

    if (!objective._id) {
      toast.error('Invalid objective ID');
      return;
    }

    if (!viewedObjectives[objective._id]) {
      toast.error('Please view task details before approving completion');
      return;
    }

    setIsActionLoading((prev) => ({ ...prev, [objective._id]: true }));

    try {
      await approveObjectiveCompletion(objective._id).unwrap();
      toast.success(`Objective "${objective.title}" completion approved successfully!`, {
        position: 'top-right',
        duration: 5000,
      });
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to approve objective completion');
    } finally {
      setIsActionLoading((prev) => ({ ...prev, [objective._id]: false }));
    }
  };

  const handleRejectCompletion = async (objective) => {
    if (!isAdmin) {
      toast.error('Only admins can reject task completion');
      return;
    }

    if (!objective._id) {
      toast.error('Invalid objective ID');
      return;
    }

    if (!viewedObjectives[objective._id]) {
      toast.error('Please view task details before rejecting completion');
      return;
    }

    setIsActionLoading((prev) => ({ ...prev, [objective._id]: true }));

    try {
      await rejectObjectiveCompletion(objective._id).unwrap();
      toast.success(`Objective "${objective.title}" completion rejected successfully!`, {
        position: 'top-right',
        duration: 5000,
      });
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to reject objective completion');
    } finally {
      setIsActionLoading((prev) => ({ ...prev, [objective._id]: false }));
    }
  };

  const handleFilter = () => {
    setIsFilterModalOpen(true);
  };

  const handleCloseFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const handleAddObjectives = () => {
    console.log('Add Objectives clicked');
    navigate('/tasks');
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleApplyFilters = () => {
    refetch();
    setIsFilterModalOpen(false);
  };

  const handleCommentChange = (e) => {
    setCommentInput(e.target.value);
  };

  const handleOpenCommentModal = (objectiveId) => {
    if (!objectiveId || typeof objectiveId !== 'string') {
      toast.error('Invalid objective ID');
      return;
    }
    setSelectedObjectiveId(objectiveId);
    setCommentInput('');
    setIsCommentModalOpen(true);
  };

  const handleCloseCommentModal = () => {
    setIsCommentModalOpen(false);
    setSelectedObjectiveId(null);
    setCommentInput('');
  };

  const handleAddComment = async () => {
    if (!selectedObjectiveId) {
      toast.error('No objective selected');
      return;
    }

    const text = commentInput.trim();
    if (!text) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      await addComment({ id: selectedObjectiveId, text }).unwrap();
      toast.success('Comment added successfully');
      refetch();
      handleCloseCommentModal();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to add comment');
    }
  };

  const handleOpenUpdateModal = (objective) => {
    if (!objective._id || typeof objective._id !== 'string') {
      toast.error('Invalid objective ID');
      return;
    }
    setSelectedObjectiveId(objective._id);
    setUpdateFormData({
      title: objective.title || '',
      description: objective.description || '',
      priorityLevel: objective.priorityLevel || 'Medium',
      startDate: objective.startDate ? new Date(objective.startDate).toISOString().split('T')[0] : '',
      endDate: objective.endDate ? new Date(objective.endDate).toISOString().split('T')[0] : '',
      subObjectives: objective.subObjectives || [],
    });
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedObjectiveId(null);
    setUpdateFormData({
      title: '',
      description: '',
      priorityLevel: 'Medium',
      startDate: '',
      endDate: '',
      subObjectives: [],
    });
  };

  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateObjective = async () => {
    if (!selectedObjectiveId) {
      toast.error('No objective selected');
      return;
    }

    if (!updateFormData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      await updateObjective({
        id: selectedObjectiveId,
        ...updateFormData,
      }).unwrap();
      toast.success('Objective updated successfully');
      refetch();
      handleCloseUpdateModal();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update objective');
    }
  };

  const toggleCommentDropdown = (objectiveId) => {
    setOpenCommentDropdowns((prev) => ({
      ...prev,
      [objectiveId]: !prev[objectiveId],
    }));
  };

  const toggleProgressDropdown = (objectiveId) => {
    setOpenProgressDropdowns((prev) => ({
      ...prev,
      [objectiveId]: !prev[objectiveId],
    }));
  };

  const handleUpdateProgress = async (objectiveId, progress) => {
    try {
      await updateObjectiveProgress({ id: objectiveId, progress }).unwrap();
      toast.success('Progress updated successfully');
      refetch();
      setOpenProgressDropdowns((prev) => ({ ...prev, [objectiveId]: false }));
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update progress');
    }
  };

  const handleOpenTaskModal = (objective) => {
    if (!objective._id) {
      toast.error('Invalid objective ID');
      return;
    }
    setSelectedObjective(objective);
    setIsTaskModalOpen(true);
    setViewedObjectives((prev) => ({ ...prev, [objective._id]: true }));
  };

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setSelectedObjective(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 rounded-lg">
      <div className="">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Progress Tracking</h1>
          <div>
            <button
              onClick={handleFilter}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
            <button
              onClick={handleAddObjectives}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Objectives
            </button>
          </div>
        </div>

        {/* Filter Modal */}
        {isFilterModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Filter Objectives</h3>
                <button
                  onClick={handleCloseFilterModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Search</label>
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search by title or description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All</option>
                    <option value="Pending Acceptance">Pending Acceptance</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority Level</label>
                  <select
                    name="priorityLevel"
                    value={filters.priorityLevel}
                    onChange={handleFilterChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Progress Range</label>
                  <select
                    name="progressRange"
                    value={filters.progressRange}
                    onChange={handleFilterChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All</option>
                    <option value="75-100">75-100%</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sort By</label>
                  <select
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleFilterChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="createdAt">Created At</option>
                    <option value="progress">Progress</option>
                    <option value="endDate">Due Date</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Order</label>
                  <select
                    name="order"
                    value={filters.order}
                    onChange={handleFilterChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </form>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleCloseFilterModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Objectives List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center text-gray-600">Loading objectives...</div>
          ) : isError ? (
            <div className="text-center text-red-600">You are not assigned to any department yet!</div>
          ) : objectivesData?.objectives?.length === 0 ? (
            <div className="text-center text-gray-600">No objectives found.</div>
          ) : (
            objectivesData?.objectives.map((objective) => (
              <div key={objective._id} className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <h2
                      onClick={() => handleOpenTaskModal(objective)}
                      className="text-lg font-medium text-gray-900 leading-tight cursor-pointer hover:text-blue-600 transition-colors"
                    >
                      {objective.title.substring(0, 50)}...
                    </h2>
                    <span
                      className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${
                        objective.status === 'Pending Acceptance'
                          ? 'bg-yellow-100 text-yellow-800'
                          : objective.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : objective.status === 'Accepted'
                          ? 'bg-green-100 text-green-800'
                          : objective.status === 'Declined'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {objective.status || 'Unknown'}
                    </span>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => toggleProgressDropdown(objective._id)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                    {openProgressDropdowns[objective._id] && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                        <select
                          value={objective.progress || 0}
                          onChange={(e) => handleUpdateProgress(objective._id, parseInt(e.target.value))}
                          className="w-full p-2 text-sm text-gray-700 bg-white border-none focus:outline-none"
                          disabled={isUpdatingProgress}
                        >
                          <option value={0}>0%</option>
                          <option value={25}>25%</option>
                          <option value={50}>50%</option>
                          <option value={75}>75%</option>
                          <option value={100}>100%</option>
                        </select>
                      </div>
                    )}
                  </div>
                                                        <p className="text-xs text-gray-600 mb-4">{objective.assignedTo.name}</p>

                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">{objective.description}</p>
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>{objective.progress || 0}%</span>
                    <span>Last updated: {new Date(objective.updatedAt || objective.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${objective.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
                <div className="mb-4">
                  <button
                    onClick={() => toggleCommentDropdown(objective._id)}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {openCommentDropdowns[objective._id] ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-1" />
                        Hide Comments
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-1" />
                        Show Comments ({objective.comments?.length || 0})
                      </>
                    )}
                  </button>
                </div>
                {openCommentDropdowns[objective._id] && (
                  <div className="ml-4 mb-4 border-l-2 border-gray-200 pl-4">
                    {objective.comments?.length > 0 ? (
                      objective.comments.map((comment) => (
                        <div key={comment._id} className="mb-3">
                          <p className="text-sm text-gray-800">{comment.text}</p>
                          <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-600">No comments yet.</p>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">Due: {new Date(objective.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleOpenTaskModal(objective)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="View Task Details"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                    {objective.status === 'Pending Acceptance' && objective.progress < 75 ? (
                      <>
                        <button
                          onClick={() => handleAcceptObjective(objective)}
                          disabled={isActionLoading[objective._id] || isLoading || !viewedObjectives[objective._id]}
                          className={`text-sm font-medium ${
                            isActionLoading[objective._id] || isLoading || !viewedObjectives[objective._id]
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-green-600 hover:text-green-800'
                          } transition-colors`}
                        >
                          {isActionLoading[objective._id] ? 'Accepting...' : 'Accept'}
                        </button>
                        <button
                          onClick={() => handleDeclineObjective(objective)}
                          disabled={isActionLoading[objective._id] || isLoading || !viewedObjectives[objective._id]}
                          className={`text-sm font-medium ${
                            isActionLoading[objective._id] || isLoading || !viewedObjectives[objective._id]
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-red-600 hover:text-red-800'
                          } transition-colors`}
                        >
                          {isActionLoading[objective._id] ? 'Declining...' : 'Decline'}
                        </button>
                      </>
                    ) : objective.progress >= 75 ? (
                      <button
                        onClick={() => handleOpenTaskModal(objective)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Review Task
                      </button>
                    ) : null}
                    <button
                      onClick={() => handleOpenCommentModal(objective._id)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenUpdateModal(objective)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {!isLoading && !isError && objectivesData?.totalPages > 1 && (
          <div className="mt-6 flex justify-center space-x-2">
            <button
              onClick={() => handlePageChange(filters.page - 1)}
              disabled={filters.page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm">
              Page {filters.page} of {objectivesData?.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(filters.page + 1)}
              disabled={filters.page === objectivesData?.totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {/* Task Details Modal */}
        {isTaskModalOpen && selectedObjective && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-5xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Task Details: {selectedObjective.title}</h3>
                <button
                  onClick={handleCloseTaskModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4 grid grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Objective ID</h4>
                  <p className="text-sm text-gray-600">{selectedObjective._id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Title</h4>
                  <p className="text-sm text-gray-600">{selectedObjective.title}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Description</h4>
                  <p className="text-sm text-gray-600">{selectedObjective.description || 'No description provided.'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Status</h4>
                  <p className="text-sm text-gray-600">{selectedObjective.status || 'Unknown'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Priority Level</h4>
                  <p className="text-sm text-gray-600">{selectedObjective.priorityLevel || 'Medium'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Progress</h4>
                  <p className="text-sm text-gray-600">{selectedObjective.progress || 0}%</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Start Date</h4>
                  <p className="text-sm text-gray-600">
                    {selectedObjective.startDate
                      ? new Date(selectedObjective.startDate).toLocaleDateString()
                      : 'Not set'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">End Date</h4>
                  <p className="text-sm text-gray-600">
                    {selectedObjective.endDate
                      ? new Date(selectedObjective.endDate).toLocaleDateString()
                      : 'Not set'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">{isAdmin ? 'Created By' : 'Manager'}</h4>
                  <p className="text-sm text-gray-600">
                    {isAdmin
                      ? `${selectedObjective.createdBy?.name} (${selectedObjective.createdBy?.email})`
                      : user?.manager
                        ? `${user.manager.name} (${user.manager.email})`
                        : 'No manager assigned'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Assigned To</h4>
                  <p className="text-sm text-gray-600">
                    {selectedObjective.assignedTo?.name} ({selectedObjective.assignedTo?.email})
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Created At</h4>
                  <p className="text-sm text-gray-600">{new Date(selectedObjective.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Updated At</h4>
                  <p className="text-sm text-gray-600">{new Date(selectedObjective.updatedAt).toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Tasks (Sub-Objectives)</h4>
                  {selectedObjective.subObjectives?.length > 0 ? (
                    <ul className="list-disc pl-5 text-sm text-gray-600">
                      {selectedObjective.subObjectives.map((subObjective, index) => (
                        <li key={index} className="mb-2">
                          <span className="font-medium">{subObjective.title || `Task ${index + 1}`}</span>
                          {subObjective.description && `: ${subObjective.description}`}
                          {subObjective.status && (
                            <span className="ml-2 text-xs text-gray-500">({subObjective.status})</span>
                          )}
                          {subObjective.dueDate && (
                            <span className="ml-2 text-xs text-gray-500">
                              Due: {new Date(subObjective.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-600">No tasks assigned to this objective.</p>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Comments</h4>
                  {selectedObjective.comments?.length > 0 ? (
                    <ul className="list-disc pl-5 text-sm text-gray-600">
                      {selectedObjective.comments.map((comment) => (
                        <li key={comment._id} className="mb-2">
                          <p>{comment.text}</p>
                          <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-600">No comments available.</p>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Progress Notes</h4>
                  {selectedObjective.progressNotes?.length > 0 ? (
                    <ul className="list-disc pl-5 text-sm text-gray-600">
                      {selectedObjective.progressNotes.map((note, index) => (
                        <li key={index} className="mb-2">
                          <p>{note.text || `Note ${index + 1}`}</p>
                          <p className="text-xs text-gray-500">
                            {note.createdAt ? new Date(note.createdAt).toLocaleString() : 'Date not available'}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-600">No progress notes available.</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end mt-6 space-x-3">
                {isAdmin && selectedObjective.progress >= 75 && (
                  <>
                    <button
                      onClick={() => handleApproveCompletion(selectedObjective)}
                      disabled={
                        isActionLoading[selectedObjective._id] ||
                        isApprovingCompletion ||
                        !viewedObjectives[selectedObjective._id]
                      }
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActionLoading[selectedObjective._id] ||
                        isApprovingCompletion ||
                        !viewedObjectives[selectedObjective._id]
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {isActionLoading[selectedObjective._id] || isApprovingCompletion
                        ? 'Approving...'
                        : 'Approve Completion'}
                    </button>
                    <button
                      onClick={() => handleRejectCompletion(selectedObjective)}
                      disabled={
                        isActionLoading[selectedObjective._id] ||
                        isRejectingCompletion ||
                        !viewedObjectives[selectedObjective._id]
                      }
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActionLoading[selectedObjective._id] ||
                        isRejectingCompletion ||
                        !viewedObjectives[selectedObjective._id]
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                    >
                      {isActionLoading[selectedObjective._id] || isRejectingCompletion
                        ? 'Rejecting...'
                        : 'Reject Completion'}
                    </button>
                  </>
                )}
                <button
                  onClick={handleCloseTaskModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Comment Modal */}
        {isCommentModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add Comment</h3>
                <button
                  onClick={handleCloseCommentModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  value={commentInput}
                  onChange={handleCommentChange}
                  placeholder="Enter your comment..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCloseCommentModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddComment}
                  disabled={isCommenting || !commentInput.trim()}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    isCommenting || !commentInput.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isCommenting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Update Modal */}
        {isUpdateModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Update Objective</h3>
                <button
                  onClick={handleCloseUpdateModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={updateFormData.title}
                    onChange={handleUpdateFormChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter objective title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={updateFormData.description}
                    onChange={handleUpdateFormChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter objective description"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority Level</label>
                  <select
                    name="priorityLevel"
                    value={updateFormData.priorityLevel}
                    onChange={handleUpdateFormChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={updateFormData.startDate}
                    onChange={handleUpdateFormChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={updateFormData.endDate}
                    onChange={handleUpdateFormChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </form>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleCloseUpdateModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateObjective}
                  disabled={isUpdating || !updateFormData.title.trim()}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    isUpdating || !updateFormData.title.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isUpdating ? 'Updating...' : 'Update Objective'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTracking;