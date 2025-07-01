import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Search, ChevronDown, Filter, ArrowUpDown, Eye, Calendar, X, Plus, MoreHorizontal, Edit, Trash2, ArrowDown } from 'lucide-react';
import { 
  useGetObjectivesQuery,
  useCreateObjectiveMutation,
  useGetPerformanceReviewQuery,
  useApproveObjectiveCompletionMutation,
  useRejectObjectiveCompletionMutation,
  useGetUpcomingObjectivesQuery,
  useDeleteObjectiveMutation
} from '../redux/slices/api/objectiveApiSlice'; // Adjust the import path as needed

const PerformanceDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
    const [currentQuarter, setCurrentQuarter] = useState('Q2-2025'); // Default to Q2-2025
    const { user } = useSelector((state) => state.auth);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const metrics = [
    {
      title: 'Overall Performance Score',
      value: '3.7/5.0',
      change: '0.3%',
      changeType: 'increase',
      period: 'increase vs last quarter'
    },
    {
      title: 'Review Completion Rate',
      value: '87%',
      change: '12%',
      changeType: 'increase',
      period: 'increase vs last quarter'
    },
    {
      title: 'High Performance Retention',
      value: '92%',
      change: '3%',
      changeType: 'decrease',
      period: 'decrease vs last quarter'
    }
  ];

  const departmentPerformance = [
    { name: 'Consulting & Development', score: 4.2, color: 'bg-blue-400' },
    { name: 'Growth', score: 3.8, color: 'bg-green-400' },
    { name: 'HR', score: 3.5, color: 'bg-orange-300' },
    { name: 'Partnership', score: 2.9, color: 'bg-red-300' },
    { name: 'Finance', score: 3.7, color: 'bg-blue-300' },
    { name: 'Marketing', score: 4.0, color: 'bg-green-300' }
  ];

  const trafficReview = [
    { department: 'Consulting & Development', completed: 76, total: 100, percentage: 76 },
    { department: 'Growth', completed: 84, total: 100, percentage: 84 },
    { department: 'Human Resource', completed: 78, total: 100, percentage: 78 },
    { department: 'Partnership', completed: 45, total: 100, percentage: 45 },
    { department: 'Finance', completed: 55, total: 100, percentage: 55 },
    { department: 'Marketing', completed: 47, total: 100, percentage: 47 }
  ];

  const employees = [
    {
      id: 1,
      name: 'Ayodej Alaran',
      role: 'Chief Executive Officer',
      department: 'General',
      manager: 'Ayodej Alaran',
      dueDate: 'Just now',
      dueDateFormatted: 'July 25, 2025',
      status: 'Completed',
      avatar: '👨‍💼'
    },
    {
      id: 2,
      name: 'Owolola Thompson',
      role: 'Global Human Resource',
      department: 'Human Resource',
      manager: 'Ayodej Alaran',
      dueDate: 'A minute ago',
      dueDateFormatted: 'July 25, 2025',
      status: 'In Progress',
      avatar: '👩‍💼'
    },
    {
      id: 3,
      name: 'Adeoye Sobande',
      role: 'Chief Product Officer',
      department: 'Consulting & Development',
      manager: 'Ayodej Alaran',
      dueDate: '1 hour ago',
      dueDateFormatted: 'July 24, 2025',
      status: 'Completed',
      avatar: '👨‍💻'
    },
    {
      id: 4,
      name: 'Adesola Arowolo',
      role: 'Chief Growth Officer',
      department: 'Growth',
      manager: 'Ayodej Alaran',
      dueDate: 'Yesterday',
      dueDateFormatted: 'July 24, 2025',
      status: 'In Progress',
      avatar: '👩‍💻'
    },
    {
      id: 5,
      name: 'Julie Wole-Ajyi',
      role: 'Head of Marketing',
      department: 'Marketing',
      manager: 'Ayodej Alaran',
      dueDate: 'May 2, 2025',
      dueDateFormatted: 'May 2, 2025',
      status: 'Overdue',
      avatar: '👩‍🎨'
    },
    {
      id: 6,
      name: 'Lanre Awolokun',
      role: 'Growth Manager',
      department: 'Growth',
      manager: 'Adesola Arowolo',
      dueDate: 'Just now',
      dueDateFormatted: 'July 25, 2025',
      status: 'In Progress',
      avatar: '👨‍📊'
    }
  ];

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
  } = useGetUpcomingObjectivesQuery(7); // Default to 7 days

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
  const performanceScore = performanceReview.averageScore || 3.7;
  const completionRate = performanceReview.completionRate || 87;
  const retentionRate = performanceReview.retentionRate || 92;

  // Filter employees by search term
  const filteredEmployees = performanceReview.performanceReviews?.filter(employee =>
    employee.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  console.log("filtered emp is", filteredEmployees)
  console.log("filtered user is", user)

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
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
                        {metric.changeType === 'increase' ? '↗' : '↘'}
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
              <h2 className="text-lg font-semibold text-gray-900">Department performance</h2>
              <button className="text-sm text-blue-600 hover:text-blue-800">Create a chart</button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {departmentPerformance.map((dept, index) => (
                <div key={index} className={`${dept.color} rounded-lg p-4 text-center`}>
                  <div className="text-white text-xs font-medium mb-2">{dept.name}</div>
                  <div className="text-white text-2xl font-bold">{dept.score}</div>
                </div>
              ))}
            </div>
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
                {[85, 78, 92, 88, 85, 90].map((height, index) => (
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
                  <span className="text-sm text-gray-600">2024-25: 545.3k</span>
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
            </div>
          </div>
        </div>

        {/* Performance Review Exceptions Table */}
         <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                 <div className="p-6 border-b border-gray-200">
                   <div className="flex items-center justify-between">
                     <h3 className="text-lg font-semibold text-gray-900">Performance Review Exceptions</h3>
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
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                               {employee.user.department}
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                               {employee.user.manager || 'N/A'}
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap">
                               <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(employee.performanceStatus)}`}>
                                 {employee.performanceStatus}
                               </span>
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                               {new Date(performanceReview.endDate).toLocaleDateString()}
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap">
                               <div className="flex items-center gap-2">
                                 <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                                   <Edit size={14} className="text-gray-600" />
                                 </button>
                                 <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                                   <Eye size={14} className="text-gray-600" />
                                 </button>
                                 <button 
                                   onClick={() => handleDelete(employee.user._id)}
                                   className="p-1 hover:bg-gray-100 rounded transition-colors"
                                 >
                                   <Trash2 size={14} className="text-gray-600" />
                                 </button>
                               </div>
                             </td>
                           </tr>
                         ))
                       )}
                     </tbody>
                   </table>
                 </div>
               </div>

        {/* Employee Details Modal */}
        {isModalOpen && selectedEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Employee Details</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee name
                  </label>
                  <div className="relative">
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none">
                      <option>{selectedEmployee.name}</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <div className="relative">
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none">
                      <option>{selectedEmployee.role}</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <div className="relative">
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none">
                      <option>{selectedEmployee.department}</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manager
                  </label>
                  <div className="relative">
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none">
                      <option>{selectedEmployee.manager}</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={selectedEmployee.dueDateFormatted}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      readOnly
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="relative">
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none">
                      <option>{selectedEmployee.status}</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceDashboard;