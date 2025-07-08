import React, { useState, useEffect } from "react";
import { FaTasks } from "react-icons/fa";
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
  useDeleteCommentFromSubTaskMutation, // Import the new hook
} from "../redux/slices/api/taskApiSlice";
import Loading from "../components/Loader";
import Modal from "../components/ModalWrapper";
import ConfirmModal from "../components/ConfirmModal";
import { useSelector } from "react-redux";
import {
  TaskIcon,
  EditIcon,
  DeleteIcon,
  CommentIcon,
  ExpandMoreIcon,
  ExpandLessIcon,
  BackIcon,
} from "../components/Icon";
import { useNavigate } from "react-router-dom";
import selectCurrentUser from "../redux/slices/authSlice";

const TABS = [{ title: "Activities/Timeline", icon: <FaTasks /> }];

const TaskDetails = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetSingleTaskQuery(id);
   const { user, auth } = useSelector((state) => ({
    user: selectCurrentUser(state),
    auth: state.auth
  }));
  const [state, setState] = useState({
    selectedTab: 0,
    expandedSubTask: null,
    editingObjective: null,
    editingSubtask: null,
    subTaskToDelete: null,
    activeSubTaskId: null,
    localTaskData: null,
    newComment: "",
    rating: 5,
    reaction: "thumbs_up",
    isModalOpen: false,
    commentsCollapsed: {}, // New state to track collapsed comments per subtask
    commentToDelete: null, // Track comment to delete
  });

  console.log("user role is", user.role)

  const [updateSubTaskItem] = useUpdateSubTaskItemMutation();
  const [updateSubTask] = useUpdateSubTaskMutation();
  const [deleteSubTask] = useDeleteSubTaskMutation();
  const [addCommentToSubTask] = useAddCommentToSubTaskMutation();
  const [deleteCommentFromSubTask] = useDeleteCommentFromSubTaskMutation();

  useEffect(() => {
    if (data) {
      setState(prev => ({
        ...prev,
        localTaskData: data.task,
        commentsCollapsed: data.task.subTasks.reduce((acc, subTask) => ({
          ...acc,
          [subTask._id]: true, // Default to collapsed
        }), {}),
      }));
    }
  }, [data]);

  const handleStateUpdate = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const handleAddComment = async () => {
    const { newComment, activeSubTaskId, localTaskData, rating, reaction } = state;
    if (!newComment.trim() || !activeSubTaskId) {
      toast.error("Please enter a comment and select a subtask.");
      return;
    }
  
    try {
      const commentData = {
        text: newComment,
        author: user?.name || "Unknown User",
        rating,
        reaction,
        timestamp: new Date().toISOString(),
      };
  
      const result = await addCommentToSubTask({
        id,
        subTaskId: activeSubTaskId,
        ...commentData,
      }).unwrap();
  
      const updatedSubTasks = localTaskData.subTasks.map(subTask =>
        subTask._id === activeSubTaskId
          ? { ...subTask, comments: [...(subTask.comments || []), result.comment] } // Use returned comment with _id
          : subTask
      );
  
      handleStateUpdate({
        localTaskData: { ...localTaskData, subTasks: updatedSubTasks },
        newComment: "",
      });
      toast.success("Comment added successfully.");
    } catch (error) {
      toast.error(error.message || "Failed to add comment.");
    }
  };

  const handleDeleteComment = async () => {
    const { commentToDelete, localTaskData } = state;
    if (!commentToDelete) return;

    const { subTaskId, commentId } = commentToDelete;

    try {
      await deleteCommentFromSubTask({
        taskId: id,
        subTaskId,
        commentId,
      }).unwrap();

      const updatedSubTasks = localTaskData.subTasks.map(subTask =>
        subTask._id === subTaskId
          ? {
              ...subTask,
              comments: subTask.comments.filter(comment => comment._id !== commentId),
            }
          : subTask
      );

      handleStateUpdate({
        localTaskData: { ...localTaskData, subTasks: updatedSubTasks },
        commentToDelete: null,
        isModalOpen: false,
      });
      toast.success("Comment deleted successfully.");
    } catch (error) {
      toast.error(error.message || "Failed to delete comment.");
    }
  };

  const handleSubTaskAction = async (action, subTaskId, updateData = null) => {
    try {
      switch (action) {
        case "delete":
          await deleteSubTask({ taskId: id, subTaskId }).unwrap();
          handleStateUpdate({
            localTaskData: {
              ...state.localTaskData,
              subTasks: state.localTaskData.subTasks.filter(
                subTask => subTask._id !== subTaskId
              ),
            },
            isModalOpen: false,
            subTaskToDelete: null,
          });
          toast.success("Subtask deleted successfully");
          break;

        case "update":
          await updateSubTask({
            taskId: id,
            subTaskId,
            updateData,
          }).unwrap();
          handleStateUpdate({
            localTaskData: {
              ...state.localTaskData,
              subTasks: state.localTaskData.subTasks.map(subTask =>
                subTask._id === updateData._id ? updateData : subTask
              ),
            },
            editingSubtask: null,
          });
          toast.success("Subtask updated successfully");
          break;

        case "complete":
          const updatedSubtask = {
            ...state.localTaskData.subTasks.find(subTask => subTask._id === subTaskId),
            stage: "completed",
          };
          await updateSubTask({
            taskId: id,
            subTaskId,
            updateData: updatedSubtask,
          }).unwrap();
          handleStateUpdate({
            localTaskData: {
              ...state.localTaskData,
              subTasks: state.localTaskData.subTasks.map(subTask =>
                subTask._id === subTaskId ? updatedSubtask : subTask
              ),
            },
          });
          toast.success("Subtask marked as completed!");
          break;
      }
    } catch (error) {
      toast.error(error.message || `Failed to ${action} subtask`);
    }
  };

  const filteredSubTasks = state.localTaskData?.subTasks?.filter(subTask =>
    user?.role === "superadmin" ? true : subTask.team?.includes(user?._id)
  ) || [];

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="w-full flex flex-col gap-4 mb-4 overflow-y-hidden">
      <button
        onClick={handleBack}
        className="flex items-center py-2 text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <BackIcon className="mr-2" />
        Back
      </button>

      <h1 className="text-3xl text-gray-800 font-bold">
        {state.localTaskData?.title}
      </h1>

      <Tabs tabs={TABS} setSelected={selected => handleStateUpdate({ selectedTab: selected })}>
        {state.selectedTab === 0 && (
          <div className="w-full flex flex-col md:flex-row gap-6 bg-white shadow-md p-8 overflow-y-auto rounded-lg">
            <div className="w-full md:w-1/2 space-y-8">
              <div className="space-y-6 py-6">
                <p className="text-gray-600 font-semibold text-sm">SUB-TASKS</p>
                <div className="space-y-8">
                  {filteredSubTasks?.map((subTask, index) => (
                    <SubTaskItem
                      key={subTask._id}
                      subTask={subTask}
                      index={index}
                      state={state}
                      user={user}
                      formatDate={formatDate}
                      handleStateUpdate={handleStateUpdate}
                      handleSubTaskAction={handleSubTaskAction}
                    />
                  ))}
                  {state.isModalOpen && !state.commentToDelete && (
                    <ConfirmModal
                      message="Are you sure you want to delete this subtask?"
                      onConfirm={() => handleSubTaskAction("delete", state.subTaskToDelete)}
                      onCancel={() => handleStateUpdate({ isModalOpen: false, subTaskToDelete: null })}
                    />
                  )}
                  {state.isModalOpen && state.commentToDelete && (
                    <ConfirmModal
                      message="Are you sure you want to delete this comment?"
                      onConfirm={handleDeleteComment}
                      onCancel={() => handleStateUpdate({ isModalOpen: false, commentToDelete: null })}
                    />
                  )}
                </div>
              </div>
            </div>

            <CommentSection
              state={state}
              handleAddComment={handleAddComment}
              handleStateUpdate={handleStateUpdate}
              formatDate={formatDate}
              user={user}
            />
          </div>
        )}
      </Tabs>

      <EditObjectiveModal
        state={state}
        handleStateUpdate={handleStateUpdate}
        updateSubTaskItem={updateSubTaskItem}
        id={id}
      />
    </div>
  );
};

const SubTaskItem = ({ subTask, index, state, user, formatDate, handleStateUpdate, handleSubTaskAction }) => {
  const totalObjectives = subTask.objectives?.length || 0;
  const completedObjectives = subTask.objectives?.filter(obj => obj.status === "completed").length;
  const completionPercentage = totalObjectives ? Math.round((completedObjectives / totalObjectives) * 100) : 0;
  const isDisabled = index > 0 && state.localTaskData?.subTasks[index - 1]?.objectives?.filter(obj => obj.status === "completed").length < 8;

  return (
    <div className={`flex flex-col gap-4 p-4 border rounded-lg shadow-sm ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}>
      <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 w-full">
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
              <TaskIcon className="text-indigo-600" />
            </div>

            <div className="flex-grow space-y-2">
              <h3 className="text-gray-800 font-semibold text-base">
                {subTask.title || "Untitled Task"}
              </h3>

              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">{formatDate(subTask.date)}</span>
                <span className="px-3 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-700 font-medium">
                  {subTask.tag || "No Tag"}
                </span>
                <span className="text-sm text-gray-500">
                  Objectives: <span className="text-indigo-600 font-semibold">{completionPercentage}%</span>
                </span>
                <span className="text-sm text-gray-500">
                  Due: <span className="text-red-500 font-semibold">{formatDate(subTask.completionDate)}</span>
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <button onClick={() => handleStateUpdate({ editingSubtask: subTask })} className="text-blue-500 hover:text-blue-600 transition-colors flex items-center space-x-1 text-sm">
                  <EditIcon className="mr-1" /> Edit
                </button>
                <button onClick={() => handleStateUpdate({ subTaskToDelete: subTask._id, isModalOpen: true })} className="text-red-500 hover:text-red-600 transition-colors flex items-center space-x-1 text-sm">
                  <DeleteIcon className="mr-1" /> Delete
                </button>
                <button onClick={() => handleStateUpdate({ activeSubTaskId: state.activeSubTaskId === subTask._id ? null : subTask._id })} className="text-green-500 hover:text-green-600 transition-colors flex items-center space-x-1 text-sm">
                  <CommentIcon className="mr-1" />
                  {state.activeSubTaskId === subTask._id ? "Cancel" : "Add Comment"}
                </button>
              </div>
            </div>

            <button onClick={() => handleStateUpdate({ expandedSubTask: state.expandedSubTask === subTask._id ? null : subTask._id })} className="text-gray-500 hover:text-indigo-600 transition-colors flex items-center space-x-1 text-sm">
              {state.expandedSubTask === subTask._id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              <span>{state.expandedSubTask === subTask._id ? "Hide Tasks" : "Show Tasks"}</span>
            </button>
          </div>
        </div>
      </div>

      {completionPercentage >= 80 && (
       <button
       onClick={() => (user?.role === "superadmin" || user?.role === "admin") ? handleSubTaskAction("complete", subTask._id) : toast.info("Task marked for review")}
       disabled={subTask.stage === "completed"}
       className={`py-1 px-3 rounded-md ${subTask.stage === "completed" ? "bg-gray-400 text-white cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600"}`}
     >
       {subTask.stage === "completed" ? "Task Accepted" : (user?.role === "superadmin" || user?.role === "admin") ? "Accept Task" : "Under Review"}
     </button>     )}

      {state.editingSubtask?._id === subTask._id && (
        <EditSubTaskModal
          subTask={state.editingSubtask}
          handleStateUpdate={handleStateUpdate}
          handleSubTaskAction={handleSubTaskAction}
        />
      )}

      {state.expandedSubTask === subTask._id && (
        <SubTaskDetails
          subTask={subTask}
          isDisabled={isDisabled}
          completionPercentage={completionPercentage}
          handleStateUpdate={handleStateUpdate}
        />
      )}
    </div>
  );
};

const EditSubTaskModal = ({ subTask, handleStateUpdate, handleSubTaskAction }) => {
  const [localSubTask, setLocalSubTask] = useState(subTask);

  const handleUpdate = () => {
    handleSubTaskAction("update", subTask._id, localSubTask);
  };

  return (
    <Modal onClose={() => handleStateUpdate({ editingSubtask: null })} open={true}>
      <div className="relative">
        <button onClick={() => handleStateUpdate({ editingSubtask: null })} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          ✕
        </button>
        <h2 className="text-lg font-semibold mb-4">Edit Subtask</h2>
        <input
          value={localSubTask.title}
          onChange={e => setLocalSubTask(prev => ({ ...prev, title: e.target.value }))}
          className="w-full border rounded-md p-2 mb-4"
          placeholder="Subtask title"
        />
        <div className="space-y-4 mb-4">
          {localSubTask.objectives.map(objective => (
            <div key={objective._id} className="flex items-center justify-between border rounded-md p-2 bg-gray-50">
              <input
                value={objective.description}
                onChange={e => {
                  const updated = localSubTask.objectives.map(obj =>
                    obj._id === objective._id ? { ...obj, description: e.target.value } : obj
                  );
                  setLocalSubTask(prev => ({ ...prev, objectives: updated }));
                }}
                className="flex-1 border rounded-md p-2"
              />
              <button
                onClick={() => setLocalSubTask(prev => ({
                  ...prev,
                  objectives: prev.objectives.filter(obj => obj._id !== objective._id),
                }))}
                className="ml-2 bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button onClick={handleUpdate} className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
          Save Changes
        </button>
      </div>
    </Modal>
  );
};

const SubTaskDetails = ({ subTask, isDisabled, completionPercentage, handleStateUpdate }) => (
  <div>
    <div className="mt-4 space-y-2">
      <p className="text-gray-600 font-semibold text-sm">Task Items</p>
      {subTask.objectives?.map(objective => (
        <div key={objective._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm">
          <span>{objective.description}</span>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              objective.status === "completed" ? "bg-green-100 text-green-700" :
              objective.status === "in progress" ? "bg-yellow-100 text-yellow-700" :
              "bg-gray-100 text-gray-600"
            }`}>
              {objective.status}
            </span>
            <button
              onClick={() => !isDisabled && handleStateUpdate({ editingObjective: { subTaskId: subTask._id, objective } })}
              className={`text-blue-500 underline ${isDisabled ? "pointer-events-none" : ""}`}
            >
              Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CommentSection = ({ state, handleAddComment, handleStateUpdate, formatDate, user }) => {
  const toggleComments = (subTaskId) => {
    handleStateUpdate({
      commentsCollapsed: {
        ...state.commentsCollapsed,
        [subTaskId]: !state.commentsCollapsed[subTaskId],
      },
    });
  };

  return (
    <div className="w-full md:w-1/2 space-y-8">
      {state.activeSubTaskId && (
        <div className="p-4 border rounded-lg shadow-sm">
          <h2 className="font-semibold text-lg">Add Comment</h2>
          <textarea
            value={state.newComment}
            onChange={e => handleStateUpdate({ newComment: e.target.value })}
            className="w-full border rounded-md p-2 mt-2 h-32 focus:ring-indigo-500"
            placeholder="Write your comment here..."
          />
          <button
            onClick={handleAddComment}
            disabled={!state.newComment.trim()}
            className="mt-4 w-full p-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Add Comment
          </button>
        </div>
      )}

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Comments:</h3>
        {state.localTaskData?.subTasks?.map(subTask => (
          <div key={subTask._id} className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-medium text-green-500">{subTask.title} Comments:</h4>
              <button
                onClick={() => toggleComments(subTask._id)}
                className="text-gray-500 hover:text-indigo-600 flex items-center"
              >
                {state.commentsCollapsed[subTask._id] ? (
                  <>
                    <ExpandMoreIcon size={16} />
                    <span className="ml-1 text-sm">Show</span>
                  </>
                ) : (
                  <>
                    <ExpandLessIcon size={16} />
                    <span className="ml-1 text-sm">Hide</span>
                  </>
                )}
              </button>
            </div>
            {!state.commentsCollapsed[subTask._id] && (
              <div className="space-y-4">
                {subTask.comments?.length > 0 ? (
                  subTask.comments.map((comment, index) => (
                    <div key={comment._id || index} className="p-4 border rounded-lg shadow-sm bg-gray-50 flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-700">{index + 1}. {comment.text}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <span>{comment.author}</span>
                          <span>•</span>
                          <span>{formatDate(comment.timestamp)}</span>
                        </div>
                      </div>
                      {(user?.role === "superAdmin" || user?.name === comment.author) && (
                        <button
                          onClick={() => handleStateUpdate({
                            commentToDelete: { subTaskId: subTask._id, commentId: comment._id },
                            isModalOpen: true,
                          })}
                          className="text-red-500 hover:text-red-600 flex items-center"
                        >
                          <DeleteIcon size={16} />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No comments yet.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const EditObjectiveModal = ({ state, handleStateUpdate, updateSubTaskItem, id }) => {
  const handleSave = async () => {
    const { subTaskId, objective } = state.editingObjective;
    try {
      await updateSubTaskItem({
        taskId: id,
        subTaskId,
        objectiveId: objective._id,
        updateData: objective,
      }).unwrap();

      handleStateUpdate({ editingObjective: null });
      toast.success("Objective updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update objective");
    }
  };

  return (
    state.editingObjective && (
      <Modal onClose={() => handleStateUpdate({ editingObjective: null })} open={true}>
        <div className="relative flex flex-col gap-4">
          <input
            type="text"
            value={state.editingObjective.objective.description}
            onChange={e =>
              handleStateUpdate({
                editingObjective: {
                  ...state.editingObjective,
                  objective: { ...state.editingObjective.objective, description: e.target.value },
                },
              })
            }
            className="border rounded-md p-2"
          />
          <select
            value={state.editingObjective.objective.status}
            onChange={e =>
              handleStateUpdate({
                editingObjective: {
                  ...state.editingObjective,
                  objective: { ...state.editingObjective.objective, status: e.target.value },
                },
              })
            }
            className="border rounded-md p-2"
          >
            {["todo", "in progress", "completed"].map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <div className="flex gap-3 w-full">
            <button onClick={handleSave} className="bg-blue-600 text-white p-2 w-full rounded-md">
              Save
            </button>
            <button onClick={() => handleStateUpdate({ editingObjective: null })} className="bg-red-600 text-white p-2 w-full rounded-md">
              Close
            </button>
          </div>
        </div>
      </Modal>
    )
  );
};

export default TaskDetails;