
import React, { useState, useEffect } from "react";
import { FaTasks } from "react-icons/fa";
import { MdTaskAlt } from "react-icons/md";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import Tabs from "../components/Tabs";
import {
  useGetSingleTaskQuery,
  useUpdateSubTaskMutation,
} from "../redux/slices/api/taskApiSlice";
import Loading from "../components/Loader";
import Button from "../components/Button";
import Modal from "../components/ModalWrapper";

const TABS = [{ title: "Activities/Timeline", icon: <FaTasks /> }];

const TaskDetails = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetSingleTaskQuery(id);
  const [selected, setSelected] = useState(0);
  const [expandedSubTask, setExpandedSubTask] = useState(null);
  const [editingObjective, setEditingObjective] = useState(null);
  const [updateSubTask, { isLoading: isUpdating }] = useUpdateSubTaskMutation();
  const [localTaskData, setLocalTaskData] = useState(null);

  useEffect(() => {
    if (data) {
      setLocalTaskData(data.task);
    }
  }, [data]);


  const handleObjectiveUpdate = async (subTaskId, objectiveId, updatedObjective) => {
    try {
      const result = await updateSubTask({
        taskId: id,
        subTaskId,
        objectiveId,
        updateData: {
          status: updatedObjective.status.toLowerCase(),
          description: updatedObjective.description,
        },
      }).unwrap();

      // Update local state accordingly
      setLocalTaskData(prevData => {
        const updatedTask = {
          ...prevData,
          subTasks: prevData.subTasks.map((subTask) =>
            subTask._id === subTaskId
              ? {
                  ...subTask,
                  objectives: subTask.objectives.map((objective) =>
                    objective._id === objectiveId
                      ? { ...objective, status: updatedObjective.status.toLowerCase(), description: updatedObjective.description }
                      : objective
                  ),
                }
              : subTask
          ),
        };
        return updatedTask;
      });

      toast.success("Objective updated successfully");
      setEditingObjective(null);
    } catch (error) {
      toast.error(error.message || "Failed to update objective");
    }
  };

  const handleStageChange = async (subTaskId, newStage) => {
    try {
      await updateSubTask({
        taskId: id,
        subTaskId,
        updateData: { stage: newStage },
      }).unwrap();

      toast.success("Subtask stage updated");
    } catch (error) {
      toast.error(error.message || "Failed to update subtask");
    }
  };

  if (isLoading) return <Loading />;


  const toggleSubTask = (subTaskId) => {
    if (expandedSubTask === subTaskId) {
      setExpandedSubTask(null);
    } else {
      setExpandedSubTask(subTaskId);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 mb-4 overflow-y-hidden">
      <h1 className="text-3xl text-gray-800 font-bold">{localTaskData?.title}</h1>

      <Tabs tabs={TABS} setSelected={setSelected}>
        {selected === 0 && (
          <div className="w-full flex flex-col md:flex-row gap-6 bg-white shadow-md p-8 overflow-y-auto rounded-lg">
            <div className="w-full md:w-1/2 space-y-8">
              <div className="space-y-6 py-6">
                <p className="text-gray-600 font-semibold text-sm">SUB-TASKS lol</p>
                <div className="space-y-8">
                {localTaskData?.subTasks?.map((subTask, index) => {
    const totalObjectives = subTask?.objectives?.length || 0;
    const completedObjectives = subTask?.objectives?.filter(
      (obj) => obj.status === "completed"
    ).length;
    const completionPercentage =
      totalObjectives === 0
        ? 0
        : Math.round((completedObjectives / totalObjectives) * 100);

    // Disable all except the first subtask by default
    let isDisabled = index > 0;

    // Check the previous subtask
    if (index > 0) {
      const previousSubTask = localTaskData?.subTasks[index - 1];
      const previousTotalObjectives = previousSubTask?.objectives?.length || 0;
      const previousCompletedObjectives = previousSubTask?.objectives?.filter(
        (obj) => obj.status === "completed"
      ).length;
      const previousCompletionPercentage =
        previousTotalObjectives === 0
          ? 0
          : Math.round(
              (previousCompletedObjectives / previousTotalObjectives) * 100
            );

      // Enable only if the previous subtask has >= 80% objectives completed
      if (previousCompletionPercentage >= 80) {
        isDisabled = false;
      }
    }

                    return (
                      <div
                        key={subTask._id}
                        className={`flex flex-col gap-4 p-4 border rounded-lg shadow-sm ${
                          isDisabled ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-100">
                              <MdTaskAlt className="text-indigo-600" size={26} />
                            </div>
                            <div className="space-y-1">
                              <div className="flex gap-2 items-center">
                                <span className="text-sm text-gray-500">
                                  {new Date(subTask?.date).toDateString()}
                                </span>
                                <span className="px-3 py-1 text-sm rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                                  {subTask?.tag}
                                </span>
                                <p className="text-gray-500 font-semibold text-sm">
                                Objectives Completed:{" "}
                                <span className="text-indigo-600">
                                  {completionPercentage}%
                                </span>
                              </p>
                              </div>
                              <p className="text-gray-700 font-medium">{subTask?.title}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleSubTask(subTask._id)}
                            className="text-blue-500 underline"
                          >
                            {expandedSubTask === subTask._id ? "Hide" : "Show"} Task Items 1
                          </button>
                        </div>

                        {expandedSubTask === subTask._id && (
                          <div>
                            {/* <div className="flex items-center justify-between">
                              <p className="text-gray-500 font-semibold text-sm">
                                Objectives Completed:{" "}
                                <span className="text-indigo-600">
                                  {completionPercentage}%
                                </span>
                              </p>
                              {completionPercentage >= 80 && (
                                <p className="text-green-600 text-xs font-bold">Congratulations! you can now proceed to the next stage of development</p>
                              )}
                            </div> */}

                            {/* Objectives */}
                            <div className="mt-4 space-y-2">
                              <p className="text-gray-600 font-semibold text-sm">Task Items</p>
                              {subTask?.objectives?.map((objective) => (
                                <div
                                  key={objective._id}
                                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm"
                                >
                                  <span>{objective.description}</span>
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`px-2 py-0.5 text-xs rounded-full ${
                                        objective.status === "completed"
                                          ? "bg-green-100 text-green-700"
                                          : objective.status === "in progress"
                                          ? "bg-yellow-100 text-yellow-700"
                                          : "bg-gray-100 text-gray-600"
                                      }`}
                                    >
                                      {objective.status}
                                    </span>
                                    <button
                                      onClick={() =>
                                        !isDisabled &&
                                        setEditingObjective({
                                          subTaskId: subTask._id,
                                          objective,
                                        })
                                      }
                                      className={`text-blue-500 underline ${
                                        isDisabled ? "pointer-events-none" : ""
                                      }`}
                                      disabled={isDisabled}
                                    >
                                      Edit
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </Tabs>

      {/* Objective Edit Modal */}
      {editingObjective && (
        <Modal
          title="Edit Objective"
          onClose={() => setEditingObjective(null)}
          open={!!editingObjective}
        >
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={editingObjective.objective.description}
              onChange={(e) =>
                setEditingObjective({
                  ...editingObjective,
                  objective: {
                    ...editingObjective.objective,
                    description: e.target.value,
                  },
                })
              }
              className="border border-gray-300 rounded-md p-2"
              placeholder="Objective description"
            />
            <select
              value={editingObjective.objective.status}
              onChange={(e) =>
                setEditingObjective({
                  ...editingObjective,
                  objective: {
                    ...editingObjective.objective,
                    status: e.target.value,
                  },
                })
              }
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="todo">To Do</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <button
              onClick={() =>
                handleObjectiveUpdate(
                  editingObjective.subTaskId,
                  editingObjective.objective._id,
                  editingObjective.objective
                )
              }
              className="bg-indigo-600 text-white p-2 rounded-md"
            >
              Save
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TaskDetails;
