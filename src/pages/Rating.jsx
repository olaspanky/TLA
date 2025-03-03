import React from "react";
import { useGetDashboardStatsQuery } from "../redux/slices/api/taskApiSlice";

const UserPerformance = () => {
  const { data, isLoading, error } = useGetDashboardStatsQuery();

  const calculateTaskCompletion = (userId) => {
    if (!data || !Array.isArray(data.last10Task)) return 0;

    const userTasks = data.last10Task.filter(
      (task) =>
        task.team &&
        task.team.some((user) => user._id === userId) &&
        !task.isTrashed
    );

    const completedTasks = userTasks.filter((task) => task.stage === "COMPLETED"); // Ensure case matches backend
    const completionPercentage = (completedTasks.length / userTasks.length) * 100;

    return isNaN(completionPercentage) ? 0 : completionPercentage.toFixed(2);
  };

  const calculateSubtaskCompletion = (userId) => {
    if (!data || !Array.isArray(data.last10Task)) return 0;

    let totalSubtasks = 0;
    let completedSubtasks = 0;

    data.last10Task.forEach((task) => {
      if (!task.subTasks || !Array.isArray(task.subTasks)) return;

      task.subTasks.forEach((subtask) => {
        const subtaskBelongsToUser = subtask.team && subtask.team.includes(userId);

        if (subtaskBelongsToUser && !task.isTrashed) {
          totalSubtasks++;
          if (subtask.stage === "completed") {
            completedSubtasks++;
          }
        }
      });
    });

    if (totalSubtasks === 0) return 0;

    const percentage = (completedSubtasks / totalSubtasks) * 100;
    return percentage.toFixed(2);
  };

  const getTrafficLightColor = (percentage) => {
    if (percentage <= 30) return "bg-red-500";
    if (percentage <= 69) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data: {error.message}</div>;
  }

  // Log data for debugging
  console.log("Dashboard Data:", data);

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b">
        <h2 className="text-xl font-semibold text-gray-800">User Performance Overview</h2>
      </div>
      <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b">
        <div className="flex items-center">
          <div className="h-5 w-5 rounded-full bg-red-500 mr-2"></div>
          <span className="text-sm text-gray-600">0-30% Subtask Completion</span>
        </div>
        <div className="flex items-center">
          <div className="h-5 w-5 rounded-full bg-yellow-500 mr-2"></div>
          <span className="text-sm text-gray-600">31-69% Subtask Completion</span>
        </div>
        <div className="flex items-center">
          <div className="h-5 w-5 rounded-full bg-green-500 mr-2"></div>
          <span className="text-sm text-gray-600">70-100% Subtask Completion</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        {data?.users?.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Completion (%)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtask Completion (%)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Traffic Light</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.users.map((user) => {
                const taskCompletion = calculateTaskCompletion(user._id);
                const subtaskCompletion = calculateSubtaskCompletion(user._id);
                const trafficLightColor = getTrafficLightColor(subtaskCompletion);

                return (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.name} {user.isAdmin && !user.isSuperAdmin ? "(Admin)" : user.isSuperAdmin ? "(SuperAdmin)" : ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold">
                      {taskCompletion}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                      {subtaskCompletion}%
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`h-5 w-5 rounded-full ${trafficLightColor} mx-auto`}
                        title={`Subtask Completion: ${subtaskCompletion}%`}
                      ></div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="px-6 py-4 text-gray-500">No team members to display.</div>
        )}
      </div>
    </div>
  );
};

export default UserPerformance;