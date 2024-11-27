import React, { useState } from "react";
import { toast } from "sonner";

const AddComment = ({ taskId, activeSubTaskId, setActiveSubTaskId, addCommentToSubTask, updateTaskData }) => {
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(5); // Default rating
  const [reaction, setReaction] = useState("thumbs_up"); // Default reaction
  const [isAddingComment, setIsAddingComment] = useState(false);

  const handleAddComment = async () => {
    if (!newComment.trim() || !activeSubTaskId) {
      toast.error("Please enter a comment and select a subtask.");
      return;
    }

    try {
      setIsAddingComment(true);
      const commentData = {
        text: newComment,
        author: "User123", // Replace with actual user data
        rating,
        reaction,
      };

      await addCommentToSubTask({
        id: taskId, // Task ID
        subTaskId: activeSubTaskId,
        ...commentData, // Spread comment data
      }).unwrap();

      updateTaskData(activeSubTaskId, {
        ...commentData,
        timestamp: new Date(),
      });

      setNewComment("");
      toast.success("Comment added successfully.");
    } catch (error) {
      toast.error(error.message || "Failed to add comment.");
    } finally {
      setIsAddingComment(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="font-semibold text-lg">Add Comment</h2>
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="w-full border rounded-md p-2 mt-2"
        placeholder="Write your comment here..."
      />
      <button
        onClick={handleAddComment}
        disabled={isAddingComment || !activeSubTaskId}
        className={`mt-4 w-full p-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 ${
          isAddingComment ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isAddingComment ? "Adding Comment..." : "Add Comment"}
      </button>
    </div>
  );
};

export default AddComment;
