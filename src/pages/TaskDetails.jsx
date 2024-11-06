
import React, { useState, useEffect } from "react";
import { FaTasks } from "react-icons/fa";
import { MdTaskAlt } from "react-icons/md";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import Tabs from "../components/Tabs";
import {
  useGetSingleTaskQuery,
  useUpdateSubTaskItemMutation, useUpdateSubTaskMutation, useDeleteSubTaskMutation
} from "../redux/slices/api/taskApiSlice";
import Loading from "../components/Loader";
import Button from "../components/Button";
import Modal from "../components/ModalWrapper";
import ConfirmModal from "../components/ConfirmModal"

const TABS = [{ title: "Activities/Timeline", icon: <FaTasks /> }];

const TaskDetails = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetSingleTaskQuery(id);
  const [selected, setSelected] = useState(0);
  const [expandedSubTask, setExpandedSubTask] = useState(null);
  const [editingObjective, setEditingObjective] = useState(null);
  const [updateSubTaskItem, { isLoading: isUpdating }] = useUpdateSubTaskItemMutation();
  const [editingSubtask, setEditingSubtask] = useState(null);
  const [updateSubTask, { isLoading: isUpdatingSubTask }] = useUpdateSubTaskMutation();
  const [deleteSubTask, { isLoading: isDeleting }] = useDeleteSubTaskMutation(); // Define the delete subtask mutation

 

  const [localTaskData, setLocalTaskData] = useState(null);

  useEffect(() => {
    if (data) {
      setLocalTaskData(data.task);
    }
  }, [data]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subTaskToDelete, setSubTaskToDelete] = useState(null);

  const openModal = (subTaskId) => {
    setSubTaskToDelete(subTaskId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    // Call the delete function and close the modal
    handleDeleteSubtask(subTaskToDelete);
    setIsModalOpen(false);
    setSubTaskToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setSubTaskToDelete(null);
  };

  const handleDeleteSubtask = async (subTaskId) => {
    try {
      await deleteSubTask({ taskId: id, subTaskId }).unwrap();
      setLocalTaskData(prevData => ({
        ...prevData,
        subTasks: prevData.subTasks.filter(subTask => subTask._id !== subTaskId),
      }));
      toast.success("Subtask deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete subtask");
    }
  };


  const handleObjectiveUpdate = async (subTaskId, objectiveId, updatedObjective) => {
    try {
      const result = await updateSubTaskItem({
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

  const handleUpdateSubtask = async () => {
    if (!editingSubtask) {
      console.error("No subtask is currently being edited.");
      toast.error("No subtask selected for update.");
      return;
    }
  
    console.log("Updating subtask ID:", editingSubtask._id);
    console.log("Current editing subtask data:", editingSubtask); // Log current state
  
    try {
      const updatedSubtask = {
        title: editingSubtask.title,
        tag: editingSubtask.tag,
        date: editingSubtask.date,
        stage: editingSubtask.stage,
        objectives: editingSubtask.objectives,
      };
  
      console.log("Data to send for update:", updatedSubtask); // Log the data sent to API
  
      const result = await updateSubTask({
        taskId: id,
        subTaskId: editingSubtask._id,
        updateData: updatedSubtask,
      }).unwrap();
  
      console.log(result); // Log the result to see the response
  
      toast.success("Subtask updated successfully");
      setLocalTaskData(prevData => ({
        ...prevData,
        subTasks: prevData.subTasks.map(subTask =>
          subTask._id === editingSubtask._id ? { ...editingSubtask } : subTask
        ),
      }));
      setEditingSubtask(null);
    } catch (error) {
      console.error("Error updating subtask:", error); // Log the error for debugging
      toast.error("An error occurred while updating the subtask.");
    }
  };
  
  
  
  

  const handleAddObjective = () => {
    setEditingSubtask(prevSubtask => {
      const newObjective = { _id: Date.now().toString(), description: "", status: "todo" };
      return {
        ...prevSubtask,
        objectives: [...prevSubtask.objectives, newObjective],
      };
    });
  };
  
  

  const handleRemoveObjective = (objectiveId) => {
    setEditingSubtask(prevSubtask => ({
      ...prevSubtask,
      objectives: prevSubtask.objectives.filter(
        objective => objective._id !== objectiveId
      ),
    }));
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
                <p className="text-gray-600 font-semibold text-sm">SUB-TASKS </p>
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
                              <button onClick={() => setEditingSubtask(subTask)} className="text-blue-500 underline">
                        Edit
                      </button>

                      <button onClick={() => openModal(subTask._id)} className="text-red-500 underline ml-2">
        Delete
      </button>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleSubTask(subTask._id)}
                            className="text-blue-500 underline"
                          >
                            {expandedSubTask === subTask._id ? "Hide" : "Show"} Task Items 1
                          </button>
                        </div>

                        {/* Edit Subtask Modal */}
{editingSubtask && (
  <Modal onClose={() => setEditingSubtask(null)} open={!!editingSubtask}>
    <h2 className="text-lg font-semibold mb-4">Edit Subtask</h2>
    
    <div className="mb-4">
      <label htmlFor="subtask-title" className="block text-sm font-medium text-gray-700">
        Title
      </label>
      <input
        id="subtask-title"
        type="text"
        value={editingSubtask.title}
        onChange={(e) =>
          setEditingSubtask({ ...editingSubtask, title: e.target.value })
        }
        placeholder="Enter subtask title"
        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>

    <div className="mb-4">
      <label htmlFor="subtask-tag" className="block text-sm font-medium text-gray-700">
        Tag
      </label>
      <input
        id="subtask-tag"
        type="text"
        value={editingSubtask.tag}
        onChange={(e) =>
          setEditingSubtask({ ...editingSubtask, tag: e.target.value })
        }
        placeholder="Enter subtask tag"
        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>


    <div className="space-y-4 mb-4">
      {editingSubtask.objectives.map((objective) => (
        <div key={objective._id} className="flex items-center justify-between border rounded-md p-2 bg-gray-50">
          <input
            type="text"
            value={objective.description}
            onChange={(e) => {
              const updatedObjectives = editingSubtask.objectives.map((obj) =>
                obj._id === objective._id
                  ? { ...obj, description: e.target.value }
                  : obj
              );
              setEditingSubtask({ ...editingSubtask, objectives: updatedObjectives });
            }}
            placeholder="Objective Description"
            className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            onClick={() => handleRemoveObjective(objective._id)}
            className="ml-2 bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
          >
            Remove
          </button>
        </div>
      ))}
    </div>

    <div className="flex justify-end">
      <button
        onClick={handleUpdateSubtask}
        disabled={isUpdating}
        className={`bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 ${
          isUpdating ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isUpdating ? "Updating..." : "Save Changes"}
      </button>
    </div>
  </Modal>
)}


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

                   {/* Confirmation modal */}
      {isModalOpen && (
        <ConfirmModal 
          message="Are you sure you want to delete this subtask?" 
          onConfirm={handleConfirmDelete} 
          onCancel={handleCancelDelete} 
        />
      )}
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
