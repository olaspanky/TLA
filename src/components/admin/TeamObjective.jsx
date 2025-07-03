import React, { useState } from 'react';
import { Filter, Plus, MoreHorizontal, Edit, Trash2, Eye, ArrowUp, ArrowDown, X, ExternalLink } from 'lucide-react';
import { useSelector } from 'react-redux';
import { 
  useGetObjectivesQuery,
  useCreateObjectiveMutation,
  useGetPerformanceReviewQuery,
  useApproveObjectiveCompletionMutation,
  useRejectObjectiveCompletionMutation,
  useGetUpcomingObjectivesQuery,
  useDeleteObjectiveMutation,
} from '../../redux/slices/api/objectiveApiSlice';
import { useGetDepartmentRatingQuery } from '../../redux/slices/api/analyticsApiSlice'; // Import the department rating hook

// ObjectiveModal Component (unchanged for brevity, same as provided)
const ObjectiveModal = ({ isOpen, onClose, objective }) => {
  const [selectedRating, setSelectedRating] = useState('75%');
  const [assignedTo, setAssignedTo] = useState(objective?.assignedTo);

  if (!isOpen || !objective) return null;

  // Debug log for objective
  console.log('ObjectiveModal objective:', objective);

  // Format dates
  const endDate = objective.endDate
    ? new Date(objective.endDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Not specified';

  // Calculate progress
  const progressValue =
    objective.progress !== undefined
      ? objective.progress
      : objective.subObjectives?.length > 0
      ? Math.round(
          (objective.subObjectives.filter((subObj) => subObj.completed).length /
            objective.subObjectives.length) *
            100
        )
      : 0;

  const getProgressColor = (progress) => {
    if (progress >= 70) return 'bg-green-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusBadge = (completed) => {
    if (completed) {
      return 'bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium';
    }
    return 'bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-medium';
  };

  const getStatusText = (completed) => {
    return completed ? 'Done' : '50%';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Deadlines</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={20} />
            </button>
          </div>
          
          {/* Lag Objectives Section */}
          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-900 mb-3">Lag Objectives</h3>
            <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
              <span>Assigned to: {objective.assignedTo || 'Unassigned'}</span>
              <span>Due Date: {endDate}</span>
              <div className="flex items-center">
                <span className="mr-2">Progress:</span>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getProgressColor(progressValue)}`}
                    style={{ width: `${progressValue}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Main Objective Card */}
            <div className="border border-gray-200 rounded-lg p-4 bg-white flex justify-between items-center">
              <h4 className="text-base font-medium text-gray-900">
                {objective.title || 'No title provided'}
              </h4>
              <button className="text-gray-400 hover:text-gray-600">
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Lead Objectives Section */}
        <div className="p-6">
          <h3 className="text-base font-medium text-gray-900 mb-4">Lead Objectives</h3>
          {objective.subObjectives && objective.subObjectives.length > 0 ? (
            <div className="space-y-3">
              {objective.subObjectives.map((subObj, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={subObj.completed || false}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      onChange={() => {}}
                    />
                    <span
                      className={`text-sm ${
                        subObj.completed ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}
                    >
                      {subObj.title || 'Untitled task'}
                    </span>
                  </div>
                  <span className={getStatusBadge(subObj.completed)}>
                    {getStatusText(subObj.completed)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No key results defined for this objective</p>
          )}
        </div>

        {/* Bottom Section */}
        <div className="p-6 border-t border-gray-200 bg-white">
          <div className="flex justify-between items-end">
            <div className="flex gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assigned to</label>
                <input
                  type="text"
                  value={assignedTo}
                  readOnly
                  className="w-48 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ratings</label>
                <select
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="75%">75%</option>
                  <option value="80%">80%</option>
                  <option value="85%">85%</option>
                  <option value="90%">90%</option>
                  <option value="95%">95%</option>
                  <option value="100%">100%</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ComprehensivePerformanceDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentQuarter, setCurrentQuarter] = useState('Q2-2025');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState(null);
  const { user } = useSelector((state) => state.auth);

  // Fetch data using RTK Query hooks
  const {
    data: objectives = [],
    isLoading: objectivesLoading,
    isError: objectivesError,
    refetch: refetchObjectives
  } = useGetObjectivesQuery();

  const {
    data: performanceReview = {},
    isLoading: reviewLoading,
    isError: reviewError
  } = useGetPerformanceReviewQuery(currentQuarter);

  const {
    data: upcomingObjectives = [],
    isLoading: upcomingLoading,
    isError: upcomingError
  } = useGetUpcomingObjectivesQuery(7);

  // Fetch department rating for Development and Tech (ID: 68581c5e5e0f68e44a3f6d74)
  const {
    data: departmentRating,
    isLoading: deptRatingLoading,
    isError: deptRatingError
  } = useGetDepartmentRatingQuery('68581c5e5e0f68e44a3f6d74');

  // Log data for debugging
  console.log("Performance Review:", performanceReview);
  console.log("Upcoming Objectives Data:", upcomingObjectives);
  console.log("Department Rating:", departmentRating);

  // Mutation hooks
  const [createObjective] = useCreateObjectiveMutation();
  const [approveObjective] = useApproveObjectiveCompletionMutation();
  const [rejectObjective] = useRejectObjectiveCompletionMutation();
  const [deleteObjective] = useDeleteObjectiveMutation();

  // Available quarters for dropdown
  const quarters = ['Q1-2025', 'Q2-2025', 'Q3-2025', 'Q4-2025', 'Q1-2024', 'Q2-2024', 'Q3-2024', 'Q4-2024'];

  const getAvatarColor = (name) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
      'bg-orange-500', 'bg-pink-500', 'bg-indigo-500',
      'bg-red-500', 'bg-yellow-500', 'bg-teal-500'
    ];
    return colors[name.length % colors.length];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Excellent':
        return 'text-green-600 bg-green-50';
      case 'Good':
        return 'text-blue-600 bg-blue-50';
      case 'Needs Improvement':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const handleAddObjective = async () => {
    try {
      const newObjective = {
        title: "New Objective",
        description: "Objective description",
        dueDate: new Date().toISOString(),
        priority: "Medium"
      };
      await createObjective(newObjective).unwrap();
      refetchObjectives();
    } catch (err) {
      console.error("Failed to create objective:", err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveObjective(id).unwrap();
      refetchObjectives();
    } catch (err) {
      console.error("Failed to approve objective:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteObjective(id).unwrap();
      refetchObjectives();
    } catch (err) {
      console.error("Failed to delete objective:", err);
    }
  };

  const handleOpenModal = (objective) => {
    setSelectedObjective(objective);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedObjective(null);
  };

  // Format upcoming objectives for display
  const formattedDeadlines = upcomingObjectives.map((obj) => ({
    id: obj._id,
    title: obj.title,
    description: obj.description,
    subObjectives: obj.subObjectives || [],
    priorityLevel: obj.priorityLevel,
    startDate: obj.startDate,
    endDate: obj.endDate,
    progress: obj.progress,
    assignedTo: obj.assignedTo?.name,
    assignedToName: obj.assignedTo?.name || 'Unassigned',
    lastUpdated: `Last updated: ${new Date(obj.updatedAt).toLocaleDateString()}`,
    updatedAt: obj.updatedAt
  }));

  // Use department rating for performance score, scaled to /5.0 if necessary
  const performanceScore = deptRatingLoading
    ? 0
    : deptRatingError
    ? 0
    : departmentRating?.averageRating
    ? (departmentRating.averageRating / 20).toFixed(1) // Scale 0-100 to 0-5
    : 0;

  const completionRate = performanceReview.completionRate || 0;
  const retentionRate = performanceReview.retentionRate || 0;

  // Filter employees by search term
  const filteredEmployees = performanceReview.performanceReviews?.filter(employee =>
    employee.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  console.log("Filtered Employees:", filteredEmployees);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Overall Performance Score</h3>
            <div className="flex items-baseline gap-1">
              {deptRatingLoading ? (
                <span className="text-3xl font-bold text-gray-900">Loading...</span>
              ) : deptRatingError ? (
                <span className="text-3xl font-bold text-red-600">Error</span>
              ) : (
                <>
                  <span className="text-3xl font-bold text-gray-900">{performanceScore}</span>
                  <span className="text-xl text-gray-500">/5.0</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUp size={12} className="text-green-500" />
              <span className="text-xs text-green-600">0.3% increase vs last quarter</span>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Review Completion Rate</h3>
            <div className="text-3xl font-bold text-gray-900 mb-2">{completionRate}%</div>
            <div className="flex items-center gap-1">
              <ArrowUp size={12} className="text-green-500" />
              <span className="text-xs text-green-600">12% increase vs last quarter</span>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">High Performer Retention</h3>
            <div className="text-3xl font-bold text-gray-900 mb-2">{retentionRate}%</div>
            <div className="flex items-center gap-1">
              <ArrowDown size={12} className="text-red-500" />
              <span className="text-xs text-red-600"> decrease vs last quarter</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900-4">Progress tracking</h3>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - (performanceScore / 5))}`} // Update to use performanceScore
                    className="text-green-500 transition-all duration-300"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56 * 0.25} ${2 * Math.PI * 56 * 0.75}`}
                    strokeDashoffset="0"
                    className="text-blue-900 transition-all duration-300"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">{Math.round(performanceScore * 20)}/100</span>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Upcoming Deadlines</h3>
            {upcomingLoading ? (
              <p>Loading upcoming objectives...</p>
            ) : upcomingError ? (
              <p>Error loading upcoming objectives</p>
            ) : (
              <div className="space-y-4">
                {formattedDeadlines.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleOpenModal(item)}
                    className="cursor-pointer gap-2 border-b border-gray-100 last:border-b-0 pb-4 last:pb-0 hover:bg-gray-50 transition-colors"
                  >
                    <h4 className="font-medium text-gray-900 text-sm leading-tight mb-1">{item.title.substring(0, 70)}...</h4>
                    <div className="flex justify-between">
                      <p className="text-xs text-gray-600 mb-2">{item.subtitle}</p>
                      <p className="text-xs text-gray-500">{item.lastUpdated}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Performance Review Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Performance Review</h3>
              <div className="flex items-center gap-3">
                <select
                  value={currentQuarter}
                  onChange={(e) => setCurrentQuarter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {quarters.map((q) => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter size={16} />
                  <span className="text-sm">Filter</span>
                </button>
                <button 
                  onClick={handleAddObjective}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus size={16} />
                  <span className="text-sm">Add Objectives</span>
                </button>
              </div>
            </div>
          </div>

          {/* Table Controls */}
          <div className="p-4 border-b border-gray-100 flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Plus size={16} className="text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-600" />
              <MoreHorizontal size={16} className="text-gray-600" />
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by employee name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {reviewLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-600">Loading...</td>
                  </tr>
                ) : reviewError ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-red-600">
                      Error loading performance reviews{reviewError.status === 401 ? ': Please log in again' : ''}
                    </td>
                  </tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-600">No employees found</td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee) => (
                    <tr key={employee.user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${getAvatarColor(employee.user.name)} flex items-center justify-center text-white text-xs font-medium`}>
                            {employee.user.name.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{employee.user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {employee.user.role || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {employee.user.department.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {employee.user.reportingTo.length > 0 ? employee.user.reportingTo[0].name : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(employee.performanceStatus)}`}>
                          {employee.performanceStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(performanceReview.endDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ObjectiveModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        objective={selectedObjective}
      />
    </div>
  );
};

export default ComprehensivePerformanceDashboard;