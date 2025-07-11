import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Search, ChevronDown, Filter, ArrowUpDown, Eye, Calendar, X, Plus, MoreHorizontal, Edit, Trash2, ArrowDown, ArrowUp } from 'lucide-react';
import { 
  useGetObjectivesQuery,
  useCreateObjectiveMutation,
  useGetPerformanceReviewQuery,
  useApproveObjectiveCompletionMutation,
  useRejectObjectiveCompletionMutation,
  useGetUpcomingObjectivesQuery,
  useDeleteObjectiveMutation
} from '../redux/slices/api/objectiveApiSlice';
import { useGetOrganizationRatingQuery } from '../redux/slices/api/analyticsApiSlice';
import { selectCurrentUser } from '../redux/slices/authSlice';

const PerformanceDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentQuarter, setCurrentQuarter] = useState('Q2-2025');
   const { user, auth } = useSelector((state) => ({
    user: selectCurrentUser(state),
    auth: state.auth
  }));
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch organization rating
  const {
    data: orgRating,
    isLoading: orgRatingLoading,
    isError: orgRatingError
  } = useGetOrganizationRatingQuery();

  // Calculate performance score from organization rating (1-5 scale)
  const performanceScore = orgRatingLoading
    ? 0
    : orgRatingError
    ? 0
    : orgRating?.rating
    ? orgRating.rating.toFixed(1)
    : 3.7; // Fallback to static value if no data

  // Dynamic department performance from API
  const departmentPerformance = orgRatingLoading || orgRatingError
    ? []
    : orgRating?.departmentRatings
        ?.filter(dept => dept.totalUsers > 0 || dept.totalObjectives > 0)
        ?.map(dept => ({
          name: dept.departmentName,
          score: dept.rating,
          color: dept.rating > 3 ? 'bg-blue-400' : dept.rating > 1 ? 'bg-orange-300' : 'bg-red-300'
        })) || [];

  // Dynamic traffic review from API
  const trafficReview = orgRatingLoading || orgRatingError
    ? []
    : orgRating?.departmentRatings
        ?.map(dept => ({
          department: dept.departmentName,
          completed: dept.totalObjectives > 0 ? Math.round((dept.rating / 5) * dept.totalObjectives) : 0,
          total: dept.totalObjectives > 0 ? dept.totalObjectives : 100, // Fallback to 100 if no objectives
          percentage: dept.totalObjectives > 0 ? Math.round((dept.rating / 5) * 100) : 0
        })) || [];

  // Hardcoded metrics (replace with API data if available)
  const metrics = [
    {
      title: 'Overall Performance Score',
      value: orgRatingLoading ? 'Loading...' : orgRatingError ? 'Error' : `${performanceScore}/5.0`,
      change: '0.3%',
      changeType: 'increase',
      period: 'increase vs last quarter'
    },
    {
      title: 'Review Completion Rate',
      value: '87%', // Replace with performanceReview.completionRate if available
      change: '12%',
      changeType: 'increase',
      period: 'increase vs last quarter'
    },
    {
      title: 'High Performance Retention',
      value: '92%', // Replace with performanceReview.retentionRate if available
      change: '3%',
      changeType: 'decrease',
      period: 'decrease vs last quarter'
    }
  ];

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
    return name ? colors[name.length % colors.length] : 'bg-gray-500';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  // Format upcoming objectives for display
  const formattedDeadlines = upcomingObjectives.map(obj => ({
    id: obj.id,
    title: obj.title,
    subtitle: obj.description,
    lastUpdated: `Last updated: ${new Date(obj.updatedAt).toLocaleDateString()}`
  }));

  // Get performance metrics from review data
  const completionRate = performanceReview.completionRate || 87;
  const retentionRate = performanceReview.retentionRate || 92;

  // Filter employees by search term
  const filteredEmployees = performanceReview.performanceReviews?.filter(employee =>
    employee.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleRowClick = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleSubmit = () => {
    console.log('Submitting employee data:', selectedEmployee);
    handleCloseModal();
  };

  // Performance rating chart data (use org rating for current quarter)
  const performanceRatingData = [85, 78, 92, 88, 85, orgRating?.rating * 20 || 90]; // Scale 1-5 to 0-100 for chart

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="">
        {/* Top Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</div>
                  <div className="flex items-center text-sm">
                    <span className={`flex items-center ${
                      metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <span className="mr-1">
                        {metric.changeType === 'increase' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                      </span>
                      {metric.change}
                    </span>
                    <span className="text-gray-500 ml-1">{metric.period}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Department Performance Section */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Department Performance</h2>
              <button className="text-sm text-blue-600 hover:text-blue-800"></button>
            </div>
          </div>
          <div className="p-6">
            {orgRatingLoading ? (
              <div className="text-center text-gray-600">Loading...</div>
            ) : orgRatingError ? (
              <div className="text-center text-red-600">Error loading department data</div>
            ) : departmentPerformance.length === 0 ? (
              <div className="text-center text-gray-600">No department data available</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {departmentPerformance.map((dept, index) => (
                  <div key={index} className={`${dept.color} rounded-lg p-4 text-center`}>
                    <div className="text-white text-xs font-medium mb-2">{dept.name}</div>
                    <div className="text-white text-2xl font-bold">{dept.score.toFixed(1)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Performance Rating and Traffic Review */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Rating Chart */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Performance Rating</h3>
            </div>
            <div className="p-6">
              <div className="flex items-end justify-between h-40">
                {performanceRatingData.map((height, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="bg-green-500 rounded-t-sm mb-2 w-8"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-xs text-gray-500">Q{index + 1}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">2024-25: {orgRating?.rating?.toFixed(1) || '2.4'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Traffic Review */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Traffic Review</h3>
            </div>
            <div className="p-6">
              {orgRatingLoading ? (
                <div className="text-center text-gray-600">Loading...</div>
              ) : orgRatingError ? (
                <div className="text-center text-red-600">Error loading traffic data</div>
              ) : trafficReview.length === 0 ? (
                <div className="text-center text-gray-600">No traffic data available</div>
              ) : (
                <div className="space-y-4">
                  {trafficReview.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">{item.department}</span>
                          <span className="text-sm text-gray-500">{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {item.completed}/{item.total} Completed
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Performance Review Table */}
       
      </div>
    </div>
  );
};

export default PerformanceDashboard;