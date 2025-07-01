import React from 'react';
  import { Filter } from 'lucide-react';
import { useGetDepartmentMemberRatingsQuery } from '../../redux/slices/api/analyticsApiSlice';
import { useGetDepartmentsQuery } from '../../redux/slices/api/departmentApiSlice';

const PerformanceTrackingDashboard = () => {
  // Get current user from Redux store
  const { user } = useSelector((state) => state.auth);

  // Fetch departments data
  const { 
    data: departments, 
    isLoading: isDeptLoading, 
    isError: isDeptError 
  } = useGetDepartmentsQuery();

  // Find the department where current user is head
  const userDepartment = departments?.find(
    (dept) => dept.head && dept.head._id === user?.id
  );

  // Determine department ID (prioritize user's department, fallback to first department for admins)
  const departmentId = userDepartment?._id || 
    (user?.role === 'admin' && departments?.[0]?._id) || 
    null;

  // Fetch department member ratings
  const { 
    data: teamMembersData, 
    isLoading: isMembersLoading, 
    isError: isMembersError,
    error: membersError 
  } = useGetDepartmentMemberRatingsQuery(departmentId, {
    skip: !departmentId // Skip query if no departmentId
  });

  // Extract memberRatings from teamMembersData
  const teamMembers = teamMembersData?.memberRatings || [];

  // Combined loading state
  const isLoading = isDeptLoading || isMembersLoading;
  // Combined error state
  const isError = isDeptError || isMembersError;

  // Derive top performers from team members
  const topPerformers = teamMembers
    ? [...teamMembers]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4)
        .map((member) => ({
          name: member.name || '',
          percentage: Math.round((member.rating / 800) * 100),
          avatar: member.avatar || (member.name ? member.name.split(' ').map(n => n.charAt(0)).join('').slice(0, 2).toUpperCase() : ''),
        }))
    : [];

  const getBarHeight = (rating) => {
    const maxRating = 800;
    return (rating / maxRating) * 100;
  };

  const getAvatarColor = (name) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500',
      'bg-orange-500', 'bg-pink-500', 'bg-indigo-500'
    ];
    return colors[name.length % colors.length];
  };

  // Handle loading state
  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">Loading...</div>;
  }

  // Handle error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        Error: {membersError?.data?.message || membersError?.toString() || 'Failed to load data'}
      </div>
    );
  }

  // Handle no department assigned
  if (!departmentId) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        {!user ? 'Please log in' : 'You are not assigned to any department'}
      </div>
    );
  }

  // Handle no team members
  if (!teamMembers.length) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        No team members found for this department
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with department name */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Performance Tracking</h1>
            {userDepartment && (
              <p className="text-sm text-gray-500 mt-1">
                Department: {userDepartment.name}
              </p>
            )}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={16} />
            <span>Filter</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Team Rating Bar Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Team Rating</h2>
              <span className="text-sm text-gray-500">Updated at 04:23</span>
            </div>
            
            <div className="flex items-end justify-between gap-4 h-80 relative">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="w-full flex flex-col items-center justify-end h-64 mb-4">
                    <div 
                      className="w-full bg-green-500 rounded-t-sm transition-all duration-500 ease-out"
                      style={{ height: `${getBarHeight(member.rating)}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 font-medium leading-tight">
                      {member.name.split(' ')[0] || ''}
                    </p>
                    <p className="text-xs text-gray-600 leading-tight">
                      {member.name.split(' ')[1] || ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Y-axis labels */}
            <div className="absolute left-2 top-20 flex flex-col justify-between h-64 text-xs text-gray-400">
              <span>1000.00</span>
              <span>800.00</span>
              <span>600.00</span>
              <span>400.00</span>
              <span>200.00</span>
              <span>0</span>
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Performers</h2>
            
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${getAvatarColor(performer.name)} flex items-center justify-center text-white text-sm font-medium`}>
                    {performer.avatar || performer.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{performer.name}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{performer.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Rating Line Chart */}
        <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Team Rating Trend</h2>
            <span className="text-sm text-gray-500">Updated at 04:23</span>
          </div>
          
          <div className="relative h-64">
            <svg className="w-full h-full" viewBox="0 0 600 200">
              {/* Grid lines */}
              {[0, 20, 40, 60, 80, 100, 120].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={200 - (y / 120) * 180}
                  x2="600"
                  y2={200 - (y / 120) * 180}
                  stroke="#f3f4f6"
                  strokeWidth="1"
                />
              ))}
              
              {/* Line chart */}
              <path
                d="M 0 180 Q 120 160 240 120 Q 360 80 480 40 Q 540 20 600 20"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                className="drop-shadow-sm"
              />
              
              {/* Data points */}
              {[
                { x: 0, y: 180 },
                { x: 120, y: 160 },
                { x: 240, y: 120 },
                { x: 360, y: 80 },
                { x: 480, y: 40 },
                { x: 600, y: 20 }
              ].map((point, index) => (
                <circle
                  key={index}
                  cx={point.x}
                  cy={point.y}
                  r="3"
                  fill="#3b82f6"
                  className="drop-shadow-sm"
                />
              ))}
            </svg>
            
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 flex flex-col justify-between h-full text-xs text-gray-400 -ml-8">
              <span>120</span>
              <span>100</span>
              <span>80</span>
              <span>60</span>
              <span>40</span>
              <span>20</span>
              <span>0</span>
            </div>
            
            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-gray-400 -mb-6">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTrackingDashboard;