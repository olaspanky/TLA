import React, { useState, useEffect } from "react";
import { FaTasks } from "react-icons/fa";
import { MdTaskAlt } from "react-icons/md";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import Tabs from "../components/Tabs";
import AddComment from "../components/AddComment";
import {
  useGetSingleTaskQuery,
  useUpdateSubTaskItemMutation,
  useUpdateSubTaskMutation,
  useDeleteSubTaskMutation,
  useAddCommentToSubTaskMutation,
} from "../redux/slices/api/taskApiSlice";
import Loading from "../components/Loader";
import Button from "../components/Button";
import Modal from "../components/ModalWrapper";
import ConfirmModal from "../components/ConfirmModal";
import { useSelector } from "react-redux"; // or from your state management library

const TABS = [{ title: "Activities/Timeline", icon: <FaTasks /> }];

const TaskDetails = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetSingleTaskQuery(id);
  const [selected, setSelected] = useState(0);
  const [expandedSubTask, setExpandedSubTask] = useState(null);
  const [editingObjective, setEditingObjective] = useState(null);
  const [editingSubtask, setEditingSubtask] = useState(null);
  const [subTaskToDelete, setSubTaskToDelete] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [activeSubTaskId, setActiveSubTaskId] = useState(null);
  const [localTaskData, setLocalTaskData] = useState(null);
  const [rating, setRating] = useState(5); // Default rating
  const [reaction, setReaction] = useState("thumbs_up"); // Default reaction
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(null); // Track visibility of comments for each subtask
  const { user } = useSelector((state) => state.auth); // Get current user data from Redux

  const [updateSubTaskItem, { isLoading: isUpdating }] =
    useUpdateSubTaskItemMutation();

  const [updateSubTask, { isLoading: isUpdatingSubTask }] =
    useUpdateSubTaskMutation();
  const [deleteSubTask, { isLoading: isDeleting }] = useDeleteSubTaskMutation();
  const [addCommentToSubTask, { isLoading: isAddingComment }] =
    useAddCommentToSubTaskMutation();

  useEffect(() => {
    if (data) {
      setLocalTaskData(data.task);
    }
  }, [data]);

  // Add Comment to Subtask
  const handleAddComment = async () => {
    console.log("Task ID:", id);
    console.log("Active SubTask ID:", activeSubTaskId);
    if (!newComment.trim() || !activeSubTaskId) {
      toast.error("Please enter a comment and select a subtask.");
      return;
    }

    try {
      const commentData = {
        text: newComment,
        author: user?.name || "Unknown User",  // Dynamically pass the current user's name
        rating,
        reaction,
      };

      await addCommentToSubTask({
        id, // Ensure this is passed correctly
        subTaskId: activeSubTaskId,
        ...commentData, // Spread the comment data
      }).unwrap();

      setLocalTaskData((prevData) => ({
        ...prevData,
        subTasks: prevData.subTasks.map((subTask) =>
          subTask._id === activeSubTaskId
            ? {
                ...subTask,
                comments: [
                  ...(subTask.comments || []),
                  { ...commentData, timestamp: new Date() },
                ],
              }
            : subTask
        ),
      }));

      setNewComment("");
      toast.success("Comment added successfully.");
    } catch (error) {
      toast.error(error.message || "Failed to add comment.");
    }
  };

  // Delete Subtask
  const openModal = (subTaskId) => {
    setSubTaskToDelete(subTaskId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!subTaskToDelete) return;

    try {
      await deleteSubTask({ taskId: id, subTaskId: subTaskToDelete }).unwrap();
      setLocalTaskData((prevData) => ({
        ...prevData,
        subTasks: prevData.subTasks.filter(
          (subTask) => subTask._id !== subTaskToDelete
        ),
      }));
      toast.success("Subtask deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete subtask");
    } finally {
      setIsModalOpen(false);
      setSubTaskToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setSubTaskToDelete(null);
  };

  // Update Subtask and Objectives
  const handleObjectiveUpdate = async (
    subTaskId,
    objectiveId,
    updatedObjective
  ) => {
    try {
      await updateSubTaskItem({
        taskId: id,
        subTaskId,
        objectiveId,
        updateData: updatedObjective,
      }).unwrap();

      setLocalTaskData((prevData) => ({
        ...prevData,
        subTasks: prevData.subTasks.map((subTask) =>
          subTask._id === subTaskId
            ? {
                ...subTask,
                objectives: subTask.objectives.map((objective) =>
                  objective._id === objectiveId ? updatedObjective : objective
                ),
              }
            : subTask
        ),
      }));

      toast.success("Objective updated successfully");
      setEditingObjective(null);
    } catch (error) {
      toast.error(error.message || "Failed to update objective");
    }
  };

  const handleUpdateSubtask = async () => {
    if (!editingSubtask) {
      toast.error("No subtask selected for update.");
      return;
    }

    try {
      const updatedSubtask = {
        ...editingSubtask,
        objectives: editingSubtask.objectives,
      };

      await updateSubTask({
        taskId: id,
        subTaskId: editingSubtask._id,
        updateData: updatedSubtask,
      }).unwrap();

      setLocalTaskData((prevData) => ({
        ...prevData,
        subTasks: prevData.subTasks.map((subTask) =>
          subTask._id === editingSubtask._id ? updatedSubtask : subTask
        ),
      }));

      toast.success("Subtask updated successfully");
      setEditingSubtask(null);
    } catch (error) {
      toast.error(error.message || "Failed to update subtask.");
    }
  };

  const toggleSubTask = (subTaskId) => {
    setExpandedSubTask((prev) => (prev === subTaskId ? null : subTaskId));
  };

  const handleRemoveObjective = (objectiveId) => {
    setEditingSubtask((prevSubtask) => ({
      ...prevSubtask,
      objectives: prevSubtask.objectives.filter(
        (objective) => objective._id !== objectiveId
      ),
    }));
  };

  const handleAcceptTaskAsCompleted = async (subTaskId) => {
    // Find the specific subtask being updated
    const subTaskToUpdate = localTaskData.subTasks.find(
      (subTask) => subTask._id === subTaskId
    );

    if (!subTaskToUpdate) {
      toast.error("Subtask not found.");
      return;
    }

    try {
      // Prepare the updated subtask data
      const updatedSubtask = {
        ...subTaskToUpdate,
        stage: "completed",
      };

      // Send the update request to the backend
      await updateSubTask({
        taskId: id,
        subTaskId,
        updateData: updatedSubtask,
      }).unwrap();

      // Update the local state
      setLocalTaskData((prevData) => ({
        ...prevData,
        subTasks: prevData.subTasks.map((subTask) =>
          subTask._id === subTaskId ? updatedSubtask : subTask
        ),
      }));

      toast.success("Subtask marked as completed!");
    } catch (error) {
      console.error("Error updating subtask stage:", error);
      toast.error("Failed to update subtask. Please try again.");
    }
  };

  const filteredSubTasks = localTaskData?.subTasks?.filter((subTask) => {
    if (user?.role === "admin") {
      return true; // Admin can see all tasks
    }
    // Regular user can only see tasks assigned to them
    return subTask.team?.includes(user._id);
  });

  // Delete Subtask
 



  // Render loading
  if (isLoading) return <Loading />;
  return (
    <div className="w-full flex flex-col gap-4 mb-4 overflow-y-hidden">
      <h1 className="text-3xl text-gray-800 font-bold">
        {localTaskData?.title}
      </h1>

      <Tabs tabs={TABS} setSelected={setSelected}>
        {selected === 0 && (
          <div className="w-full flex flex-col md:flex-row gap-6 bg-white shadow-md p-8 overflow-y-auto rounded-lg">
            <div className="w-full md:w-1/2 space-y-8">
              <div className="space-y-6 py-6">
                <p className="text-gray-600 font-semibold text-sm">
                  SUB-TASKS{" "}
                </p>
                <div className="space-y-8">
                  {filteredSubTasks?.map((subTask, index) => {
                    const totalObjectives = subTask?.objectives?.length || 0;
                    const completedObjectives = subTask?.objectives?.filter(
                      (obj) => obj.status === "completed"
                    ).length;
                    const completionPercentage =
                      totalObjectives === 0
                        ? 0
                        : Math.round(
                            (completedObjectives / totalObjectives) * 100
                          );

                    // Disable all except the first subtask by default
                    let isDisabled = index > 0;

                    // Check the previous subtask
                    if (index > 0) {
                      const previousSubTask =
                        localTaskData?.subTasks[index - 1];
                      const previousTotalObjectives =
                        previousSubTask?.objectives?.length || 0;
                      const previousCompletedObjectives =
                        previousSubTask?.objectives?.filter(
                          (obj) => obj.status === "completed"
                        ).length;
                      const previousCompletionPercentage =
                        previousTotalObjectives === 0
                          ? 0
                          : Math.round(
                              (previousCompletedObjectives /
                                previousTotalObjectives) *
                                100
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
                              <MdTaskAlt
                                className="text-indigo-600"
                                size={26}
                              />
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
                                <p className="text-gray-500 font-semibold text-sm">
                                  Due Date{" "}
                                  <span className="text-indigo-600">
                                    Due:{" "}
                                    {new Date(
                                      subTask.completionDate
                                    ).toDateString()}
                                  </span>
                                </p>
                              </div>

                              <p className="text-gray-700 font-medium">
                                {subTask?.title}
                              </p>
                              <button
                                onClick={() => setEditingSubtask(subTask)}
                                className="text-blue-500 underline"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() => openModal(subTask._id)}
                                className="text-red-500 underline ml-2"
                              >
                                Delete
                              </button>

                              <button
                                onClick={() => setActiveSubTaskId(subTask._id)} // Set active subtask ID when clicked
                                className="text-blue-500 underline"
                              >
                                Add Comment
                              </button>
                            </div>
                          </div>

                          <button
                            onClick={() => toggleSubTask(subTask._id)}
                            className="text-blue-500 underline"
                          >
                            {expandedSubTask === subTask._id ? "Hide" : "Show"}{" "}
                            Task Items 1
                          </button>
                        </div>

                        {completionPercentage >= 80 && (
  <button
    onClick={() => {
      if (user?.role === "admin") {
        handleAcceptTaskAsCompleted(subTask._id);
      } else {
        toast.info("Task is marked for review. Please wait for the admin.");
      }
    }}
    disabled={subTask.stage === "completed"} // Disable button if stage is "completed"
    className={`py-1 px-3 rounded-md ${
      subTask.stage === "completed"
        ? "bg-gray-400 text-white cursor-not-allowed"
        : "bg-green-500 text-white hover:bg-green-600"
    }`}
  >
    {subTask.stage === "completed"
      ? "Task Accepted, Completed"
      : user?.role === "admin"
      ? "Accept Task as Completed"
      : "Task Marked for Review"}
  </button>
)}


                        {/* Edit Subtask Modal */}
                        {editingSubtask && (
                          <Modal
                            onClose={() => setEditingSubtask(null)}
                            open={!!editingSubtask}
                          >
                            <div className="relative">
                              {/* Close Button */}
                              <button
                                onClick={() => setEditingSubtask(null)}
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-6 h-6"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>

                              <h2 className="text-lg font-semibold mb-4">
                                Edit Subtask
                              </h2>

                              {/* Title Input */}
                              <div className="mb-4">
                                <label
                                  htmlFor="subtask-title"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Title
                                </label>
                                <input
                                  id="subtask-title"
                                  type="text"
                                  value={editingSubtask.title}
                                  onChange={(e) => {
                                    setEditingSubtask({
                                      ...editingSubtask,
                                      title: e.target.value,
                                    });
                                  }}
                                  placeholder="Enter subtask title"
                                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                              </div>

                              {/* Tag Input */}
                              {/* <div className="mb-4">
  <label htmlFor="subtask-stage" className="block text-sm font-medium text-gray-700">
    Stage
  </label>
  <select
    value={editingSubtask.stage}
    onChange={(e) =>
      setEditingSubtask({
        ...editingSubtask,
        stage: e.target.value, // Update the stage directly
      })
    }
    className="border border-gray-300 rounded-md p-2"
  >
    <option value="todo">To Do</option>
    <option value="in progress">In Progress</option>
    <option value="completed">Completed</option>
  </select>
</div> */}

                              {/* Objective Inputs */}
                              <div className="space-y-4 mb-4">
                                {editingSubtask.objectives.map((objective) => (
                                  <div
                                    key={objective._id}
                                    className="flex items-center justify-between border rounded-md p-2 bg-gray-50"
                                  >
                                    <input
                                      type="text"
                                      value={objective.description}
                                      onChange={(e) => {
                                        const updatedObjectives =
                                          editingSubtask.objectives.map((obj) =>
                                            obj._id === objective._id
                                              ? {
                                                  ...obj,
                                                  description: e.target.value,
                                                }
                                              : obj
                                          );
                                        setEditingSubtask({
                                          ...editingSubtask,
                                          objectives: updatedObjectives,
                                        });
                                      }}
                                      placeholder="Objective Description"
                                      className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <button
                                      onClick={() =>
                                        handleRemoveObjective(objective._id)
                                      }
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
                                    isUpdating
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                  }`}
                                >
                                  {isUpdating ? "Updating..." : "Save Changes"}
                                </button>
                              </div>
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
                              <p className="text-gray-600 font-semibold text-sm">
                                Task Items
                              </p>
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

            {/* comment box */}
            <div className="w-full md:w-1/2 space-y-8">
              {/* Only show comment section when a subtask is selected */}
              {activeSubTaskId && (
                <>
                  <div className="p-4 border rounded-lg shadow-sm">
                    <h2 className="font-semibold text-lg">Add Comment</h2>

                    {/* Textarea for comment */}
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full border rounded-md p-2 mt-2 resize-none h-32 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Write your comment here..."
                    />

                    {/* Button to add comment */}
                    <button
                      onClick={handleAddComment}
                      disabled={
                        isAddingComment ||
                        !activeSubTaskId ||
                        !newComment.trim()
                      }
                      className={`mt-4 w-full p-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50 ${
                        isAddingComment ||
                        !activeSubTaskId ||
                        !newComment.trim()
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {isAddingComment ? "Adding Comment..." : "Add Comment"}
                    </button>
                  </div>

                  {/* Display added comments for the active subtask */}
                  {localTaskData?.subTasks?.map((subTask, subTaskIndex) => {
                    return subTask._id === activeSubTaskId ? (
                      <div key={subTask._id} className="mt-4">
                        <h3 className="text-lg font-semibold">
                          Comments for subtask {subTaskIndex + 1}:
                        </h3>
                        {subTask?.comments?.length > 0 ? (
                          <div className="space-y-4">
                            {subTask.comments.map((comment, index) => (
                              <div
                                key={index}
                                className="p-4 border rounded-lg shadow-sm bg-gray-50"
                              >
                                <p className="text-sm text-gray-700">
                                  {index + 1}. {comment.text}
                                </p>
                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                  <span>{comment.author}</span>
                                  <span>•</span>
                                  <span>
                                    {new Date(
                                      comment.timestamp
                                    ).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">
                            No comments yet.
                          </p>
                        )}
                      </div>
                    ) : null;
                  })}
                </>
              )}
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
          <div className="relative flex flex-col gap-4">
            {/* Close Button */}

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
            <div className="flex gap-3 w-full">
              <button
                onClick={() =>
                  handleObjectiveUpdate(
                    editingObjective.subTaskId,
                    editingObjective.objective._id,
                    editingObjective.objective
                  )
                }
                className="bg-blue-600 text-white p-2 w-full rounded-md"
              >
                Save
              </button>

              <button
                onClick={() => setEditingObjective(null)}
                className="bg-red-600 text-white p-2 w-full rounded-md"
              >
                Close{" "}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TaskDetails;
