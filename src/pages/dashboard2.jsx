// import React, { useState } from 'react';
// import { Search, User, Filter, Plus, Calendar, MessageSquare, MoreHorizontal, ExternalLink, X, Edit2, ChevronDown, ChevronUp } from 'lucide-react';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { 
//   useGetObjectivesQuery, 
//   useAddObjectiveCommentMutation, 
//   useUpdateObjectiveMutation,
//   useAcceptObjectiveMutation,
//   useDeclineObjectiveMutation,
//   useUpdateObjectiveProgressMutation
// } from '../redux/slices/api/objectiveApiSlice';
// import { useGetUserRatingQuery } from '../redux/slices/api/analyticsApiSlice';
// import Guage from '../components/GaugeChart';
// import { toast } from 'sonner';
// import { selectCurrentUser } from '../redux/slices/authSlice';

// const Dashboard = () => {
//   const [activeTab, setActiveTab] = useState('Home');
//   const [commentInput, setCommentInput] = useState('');
//   const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
//   const [selectedObjectiveId, setSelectedObjectiveId] = useState(null);
//   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
//   const [isDepartmentWarningModalOpen, setIsDepartmentWarningModalOpen] = useState(false);
//   const [updateFormData, setUpdateFormData] = useState({
//     title: '',
//     description: '',
//     priorityLevel: 'Medium',
//     startDate: '',
//     endDate: '',
//     subObjectives: [],
//   });
//   const [openCommentDropdowns, setOpenCommentDropdowns] = useState({});
//   const [openProgressDropdowns, setOpenProgressDropdowns] = useState({});
//   const { user, auth } = useSelector((state) => ({
//     user: selectCurrentUser(state),
//     auth: state.auth
//   }));
//     const navigate = useNavigate();

//   // Fetch objectives and mutations
//   const { data: objectives = [], isLoading, isError, error } = useGetObjectivesQuery();
//   const [addComment, { isLoading: isCommenting }] = useAddObjectiveCommentMutation();
//   const [updateObjective, { isLoading: isUpdating }] = useUpdateObjectiveMutation();
//   const [acceptObjective, { isLoading: isAccepting }] = useAcceptObjectiveMutation();
//   const [declineObjective, { isLoading: isDeclining }] = useDeclineObjectiveMutation();
//   const [updateObjectiveProgress, { isLoading: isUpdatingProgress }] = useUpdateObjectiveProgressMutation();

//   // Fetch user rating
//   const { 
//     data: userRatingData, 
//     isLoading: isRatingLoading, 
//     isError: isRatingError, 
//     error: ratingError 
//   } = useGetUserRatingQuery(user?.id);

//   // Calculate goal completion based on sub-objectives
//   const calculateGoalCompletion = () => {
//     let totalTasks = 0;
//     let completedTasks = 0;

//     objectives.forEach((objective) => {
//       if (objective.subObjectives && Array.isArray(objective.subObjectives)) {
//         console.log(`Objective ${objective._id} subObjectives:`, objective.subObjectives); // Debug subObjectives structure
//         totalTasks += objective.subObjectives.length;

//         // Check if the objective itself is marked as "Completed"
//         if (objective.status === 'Completed') {
//           completedTasks += objective.subObjectives.length; // Assume all sub-objectives are completed
//         } else {
//           // Count completed sub-objectives based on status or progress
//           completedTasks += objective.subObjectives.filter((subObjective) => {
//             // Adjust this condition based on your subObjectives structure
//             return (
//               subObjective.status === 'completed' || 
//               subObjective.status === 'Completed' || 
//               subObjective.progress === 100 || 
//               subObjective.isCompleted === true
//             );
//           }).length;
//         }
//       }
//     });

//     console.log(`Total tasks: ${totalTasks}, Completed tasks: ${completedTasks}`); // Debug calculation
//     console.log('User object:', user);

//     if (totalTasks === 0) return 'No tasks available'; // Handle no tasks case
//     const completionPercentage = Math.round((completedTasks / totalTasks) * 100);
//     return `${completionPercentage}%`;
//   };

//   // Stats data
//   const performanceScore = userRatingData ? (userRatingData.rating / 20).toFixed(1) : 0; // Convert 0-100 to 0-5 scale
//   const gaugeValue = userRatingData ? userRatingData.rating : 0; // Use raw rating (0-100) for gauge
//   const goalCompletion = calculateGoalCompletion(); // Dynamic calculation
//   const skillGrowth = 'No data from your manager';
//   const feedbackScore = 'No feedback score from manager';


//   const tabs = ['Home', 'Objectives', 'Progress Tracking', 'Development plan'];

//   // Handle error toast for objectives fetch
//   React.useEffect(() => {
//     if (isError) {
//       const errorMessage = error?.data?.message || 'Failed to load objectives';
//       toast.error(errorMessage);
//     }
//   }, [isError, error]);

//   // Handle error toast for rating fetch
//   React.useEffect(() => {
//     if (isRatingError) {
//       const errorMessage = ratingError?.data?.message || 'Failed to load performance rating';
//       toast.error(errorMessage);
//     }
//   }, [isRatingError, ratingError]);

//   // Debug objectives data
//   React.useEffect(() => {
//     console.log('Objectives data:', objectives);
//     console.log('User rating data:', userRatingData);
//   }, [objectives, userRatingData]);

//   // Handle Add Objective button
//   const handleAddObjective = () => {
//     if (!user?.department) {
//       setIsDepartmentWarningModalOpen(true);
//       return;
//     }
//     navigate('/tasks');
//   };

//   // Close department warning modal
//   const handleCloseDepartmentWarningModal = () => {
//     setIsDepartmentWarningModalOpen(false);
//   };

//   // Handle comment input change
//   const handleCommentChange = (e) => {
//     setCommentInput(e.target.value);
//   };

  // // Open comment modal and set objective ID
  // const handleOpenCommentModal = (objectiveId) => {
  //   if (!objectiveId || typeof objectiveId !== 'string') {
  //     toast.error('Invalid objective ID');
  //     return;
  //   }
  //   setSelectedObjectiveId(objectiveId);
  //   setCommentInput('');
  //   setIsCommentModalOpen(true);
  // };

  

//   // Close comment modal
//   const handleCloseCommentModal = () => {
//     setIsCommentModalOpen(false);
//     setSelectedObjectiveId(null);
//     setCommentInput('');
//   };

//   // Handle comment submission
//   const handleAddComment = async () => {
//     if (!selectedObjectiveId) {
//       toast.error('No objective selected');
//       return;
//     }

//     const text = commentInput.trim();
//     if (!text) {
//       toast.error('Comment cannot be empty');
//       return;
//     }

//     try {
//       await addComment({ id: selectedObjectiveId, text }).unwrap();
//       toast.success('Comment added successfully');
//       handleCloseCommentModal();
//     } catch (err) {
//       const errorMessage = err?.data?.message || 'Failed to add comment';
//       toast.error(errorMessage);
//     }
//   };

//   // Open update modal and pre-fill form
  // const handleOpenUpdateModal = (objective) => {
  //   if (!objective._id || typeof objective._id !== 'string') {
  //     toast.error('Invalid objective ID');
  //     return;
  //   }
  //   setSelectedObjectiveId(objective._id);
  //   setUpdateFormData({
  //     title: objective.title || '',
  //     description: objective.description || '',
  //     priorityLevel: objective.priorityLevel || 'Medium',
  //     startDate: objective.startDate ? new Date(objective.startDate).toISOString().split('T')[0] : '',
  //     endDate: objective.endDate ? new Date(objective.endDate).toISOString().split('T')[0] : '',
  //     subObjectives: objective.subObjectives || [],
  //   });
  //   setIsUpdateModalOpen(true);
  // };

//   // Close update modal
//   const handleCloseUpdateModal = () => {
//     setIsUpdateModalOpen(false);
//     setSelectedObjectiveId(null);
//     setUpdateFormData({
//       title: '',
//       description: '',
//       priorityLevel: 'Medium',
//       startDate: '',
//       endDate: '',
//       subObjectives: [],
//     });
//   };

//   // Handle update form input change
//   const handleUpdateFormChange = (e) => {
//     const { name, value } = e.target;
//     setUpdateFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle update submission
//   const handleUpdateObjective = async () => {
//     if (!selectedObjectiveId) {
//       toast.error('No objective selected');
//       return;
//     }

//     if (!updateFormData.title.trim()) {
//       toast.error('Title is required');
//       return;
//     }

//     try {
//       await updateObjective({
//         id: selectedObjectiveId,
//         ...updateFormData,
//       }).unwrap();
//       toast.success('Objective updated successfully');
//       handleCloseUpdateModal();
//     } catch (err) {
//       const errorMessage = err?.data?.message || 'Failed to update objective';
//       toast.error(errorMessage);
//     }
//   };

//   // Handle accept objective
//   const handleAcceptObjective = async (objectiveId, token) => {
//     if (!objectiveId || !token) {
//       toast.error('Invalid objective ID or token');
//       return;
//     }

//     try {
//       await acceptObjective({ objectiveId, token }).unwrap();
//       toast.success('Objective accepted successfully');
//     } catch (err) {
//       const errorMessage = err?.data?.message || 'Failed to accept objective';
//       toast.error(errorMessage);
//     }
//   };

//   // Handle decline objective
//   const handleDeclineObjective = async (objectiveId, token) => {
//     if (!objectiveId || !token) {
//       toast.error('Invalid objective ID or token');
//       return;
//     }

//     try {
//       await declineObjective({ objectiveId, token }).unwrap();
//       toast.success('Objective declined successfully');
//     } catch (err) {
//       const errorMessage = err?.data?.message || 'Failed to decline objective';
//       toast.error(errorMessage);
//     }
//   };

//   // Toggle comment dropdown
//   const toggleCommentDropdown = (objectiveId) => {
//     setOpenCommentDropdowns((prev) => ({
//       ...prev,
//       [objectiveId]: !prev[objectiveId],
//     }));
//   };

//   // Toggle progress dropdown
//   const toggleProgressDropdown = (objectiveId) => {
//     setOpenProgressDropdowns((prev) => ({
//       ...prev,
//       [objectiveId]: !prev[objectiveId],
//     }));
//   };

//   // Handle progress update
//   const handleUpdateProgress = async (objectiveId, progress) => {
//     try {
//       await updateObjectiveProgress({ id: objectiveId, progress }).unwrap();
//       toast.success('Progress updated successfully');
//       setOpenProgressDropdowns((prev) => ({ ...prev, [objectiveId]: false }));
//     } catch (err) {
//       const errorMessage = err?.data?.message || 'Failed to update progress';
//       toast.error(errorMessage);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 rounded-md">
//       <main className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-8">
//           <h1 className="text-2xl font-semibold text-gray-900">
//             Welcome, {user?.name || user?.firstName || 'User'}
//           </h1>
//           <p className="text-gray-600">Track and manage your objectives with ease</p>
//         </div>

//         <div className="bg-white rounded-lg shadow p-6 mb-8">
//           <div className="flex items-start justify-between">
//             <div>
//               <h2 className="text-lg font-medium text-gray-900 mb-2">Your Performance Score</h2>
//               <p className="text-sm text-gray-500 mb-4">
//                 Based on your goals, feedback, and peer recognition
//               </p>
//               {isRatingLoading ? (
//                 <p className="text-sm text-gray-600">Loading performance score...</p>
//               ) : isRatingError ? (
//                 <p className="text-sm text-red-600">Error loading performance score</p>
//               ) : (
//                 <div className="flex items-baseline space-x-2">
//                   <span className="text-4xl font-bold text-gray-900">{performanceScore}</span>
//                   <span className="text-sm text-gray-500">/5.0 (Exceeds Expectations)</span>
//                 </div>
//               )}
//             </div>
//             <div className="flex-shrink-0 p-4">
//               <Guage value={gaugeValue} />
//             </div>
//           </div>
//         </div>

//        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div key="goal-completion" className="bg-white rounded-lg shadow p-6">
//             <h3 className="text-sm font-medium text-gray-500 mb-2">Goal Completion</h3>
//             <div className="flex items-baseline space-x-2">
//               <span className="text-3xl font-bold text-gray-900">{goalCompletion}</span>
//             </div>
//           </div>
//           <div key="skill-growth" className="bg-white rounded-lg shadow p-6">
//             <h3 className="text-sm font-medium text-gray-500 mb-2">Skill Growth</h3>
//             <div className="flex items-baseline space-x-2">
//               <span className="text-lg text-gray-600">{skillGrowth}</span>
//             </div>
//           </div>
//           <div key="feedback-score" className="bg-white rounded-lg shadow p-6">
//             <h3 className="text-sm font-medium text-gray-500 mb-2">Feedback Score</h3>
//             <div className="flex items-baseline space-x-2">
//               <span className="text-lg text-gray-600">{feedbackScore}</span>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow">
//           <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
//             <h2 className="text-lg font-medium text-gray-900">Your Objectives</h2>
//             <div className="flex space-x-3">
//               <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
//                 <Filter className="w-4 h-4 mr-2" />
//                 Filter
//               </button>
//               <button
//                 onClick={handleAddObjective}
//                 className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
//               >
//                 <Plus className="w-4 h-4 mr-2" />
//                 Add Objective
//               </button>
//             </div>
//           </div>

//           <div className="divide-y divide-gray-200">
//             {isLoading ? (
//               <div key="loading" className="p-6 text-center text-gray-600">Loading objectives...</div>
//             ) : isError ? (
//               <div key="error" className="p-6 text-center text-red-600">Failed to load objectives</div>
//             ) : objectives.length === 0 ? (
//               <div key="empty" className="p-6 text-center text-gray-600">No objectives found. Add one to get started!</div>
//             ) : (
//               objectives.map((objective) => (
//                 <div key={objective._id} className="p-6">
//                   <div className="flex items-start justify-between mb-3">
//                     <div className="flex items-center">
// <h3 className="text-base font-medium text-gray-900">{objective.title.substring(0, 50)}...</h3>

//                       <span
//                         className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${
//                           objective.status === 'pending'
//                             ? 'bg-yellow-100 text-yellow-800'
//                             : objective.status === 'accepted'
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-red-100 text-red-800'
//                         }`}
//                       >
//                         {objective.status || 'Unknown'}
//                       </span>
//                     </div>


//                     <div className='flex gap-3'>
//                        <p className="text-xs text-gray-600 mb-4">{objective.assignedTo.name}</p>
//                                       <div className="relative">
//                       <button
//                         onClick={() => toggleProgressDropdown(objective._id)}
//                         className="text-white hover:text-gray-600 transition-colors flex bg-blue-500 rounded-md"
//                       >
//                         <MoreHorizontal className="w-5 h-5" />

//                         <span className='text-xs'>Update Progress</span>
//                       </button>
//                       {openProgressDropdowns[objective._id] && (
//                         <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
//                           <select
//                             value={objective.progress || 0}
//                             onChange={(e) => handleUpdateProgress(objective._id, parseInt(e.target.value))}
//                             className="w-full p-2 text-sm text-gray-700 bg-white border-none focus:outline-none"
//                             disabled={isUpdatingProgress}
//                           >
//                             <option value={0}>0%</option>
//                             <option value={25}>25%</option>
//                             <option value={50}>50%</option>
//                             <option value={75}>75%</option>
//                           </select>
//                         </div>
//                       )} 
//                     </div>
//                     </div>
                    
                                     

//                   </div>

//                   <p className="text-sm text-gray-600 mb-4">{objective.description}</p>

//                   <div className="mb-4">
//                     <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
//                       <span>{objective.progress || 0}%</span>
//                       <span>Last updated: {new Date(objective.lastUpdated || objective.startDate).toLocaleDateString()}</span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div
//                         className="bg-blue-600 h-2 rounded-full transition-all duration-500"
//                         style={{ width: `${objective.progress || 0}%` }}
//                       ></div>
//                     </div>
//                   </div>

//                   <div className="mb-4">
//                     <button
//                       onClick={() => toggleCommentDropdown(objective._id)}
//                       className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
//                     >
//                       {openCommentDropdowns[objective._id] ? (
//                         <>
//                           <ChevronUp className="w-4 h-4 mr-1" />
//                           Hide Comments
//                         </>
//                       ) : (
//                         <>
//                           <ChevronDown className="w-4 h-4 mr-1" />
//                           Show Comments ({objective.comments?.length || 0})
//                         </>
//                       )}
//                     </button>
//                   </div>
// {openCommentDropdowns[objective._id] && (
//   <div className="ml-4 mb-4 border-l-2 border-gray-200 pl-4">
//     {objective.comments?.length > 0 ? (
//       objective.comments.map((comment) => (
//         <div key={comment._id} className="mb-3 last:mb-0">
//           <p className="text-sm text-gray-800 mb-1 leading-relaxed">
//             {comment.text}
//           </p>
//           <div className="flex items-center justify-between text-xs text-gray-500">
//             <span className="font-medium text-gray-700">
//               {comment.author.name}
//             </span>
//             <time dateTime={comment.date} className="text-gray-400">
//               {new Date(comment.date).toLocaleString()}
//             </time>
//           </div>
//         </div>
//       ))
//     ) : (
//       <div className="py-2">
//         <p className="text-sm text-gray-500 italic">No comments yet.</p>
//       </div>
//     )}
//   </div>
// )}

//                   <div className="flex items-center justify-between text-sm">
//                     <div className="flex items-center text-gray-500">
//                       <Calendar className="w-4 h-4 mr-1" />
//                       Due: {new Date(objective.endDate).toLocaleDateString()}
//                     </div>
//                     <div className="flex space-x-3">
//                       {objective.status === 'pending' && (
//                         <>
//                           <button
//                             onClick={() => handleAcceptObjective(objective._id, objective.token)}
//                             disabled={isAccepting}
//                             className={`text-sm font-medium ${
//                               isAccepting
//                                 ? 'text-gray-400 cursor-not-allowed'
//                                 : 'text-green-600 hover:text-green-800'
//                             } transition-colors`}
//                           >
//                             Accept
//                           </button>
//                           <button
//                             onClick={() => handleDeclineObjective(objective._id, objective.token)}
//                             disabled={isDeclining}
//                             className={`text-sm font-medium ${
//                               isDeclining
//                                 ? 'text-gray-400 cursor-not-allowed'
//                                 : 'text-red-600 hover:text-red-800'
//                             } transition-colors`}
//                           >
//                             Decline
//                           </button>
//                         </>
//                       )}
//                       <button className="text-gray-400 hover:text-gray-600 transition-colors">
//                         <ExternalLink className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => handleOpenCommentModal(objective._id)}
//                         className="text-gray-400 hover:text-gray-600 transition-colors"
//                       >
//                         <MessageSquare className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => handleOpenUpdateModal(objective)}
//                         className="text-gray-400 hover:text-gray-600 transition-colors"
//                       >
//                         <Edit2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </main>

//       {/* Comment Modal */}
//       {isCommentModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-medium text-gray-900">Add Comment</h3>
//               <button
//                 onClick={handleCloseCommentModal}
//                 className="text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <div className="mb-4">
//               <input
//                 type="text"
//                 value={commentInput}
//                 onChange={handleCommentChange}
//                 placeholder="Enter your comment..."
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 autoFocus
//               />
//             </div>
//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={handleCloseCommentModal}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleAddComment}
//                 disabled={isCommenting || !commentInput.trim()}
//                 className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
//                   isCommenting || !commentInput.trim()
//                     ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                     : 'bg-blue-600 text-white hover:bg-blue-700'
//                 }`}
//               >
//                 {isCommenting ? 'Posting...' : 'Post Comment'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Update Modal */}
//       {isUpdateModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-medium text-gray-900">Update Objective</h3>
//               <button
//                 onClick={handleCloseUpdateModal}
//                 className="text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <form className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Title</label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={updateFormData.title}
//                   onChange={handleUpdateFormChange}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Enter objective title"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Description</label>
//                 <textarea
//                   name="description"
//                   value={updateFormData.description}
//                   onChange={handleUpdateFormChange}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Enter objective description"
//                   rows="3"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Priority Level</label>
//                 <select
//                   name="priorityLevel"
//                   value={updateFormData.priorityLevel}
//                   onChange={handleUpdateFormChange}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="Low">Low</option>
//                   <option value="Medium">Medium</option>
//                   <option value="High">High</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Start Date</label>
//                 <input
//                   type="date"
//                   name="startDate"
//                   value={updateFormData.startDate}
//                   onChange={handleUpdateFormChange}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">End Date</label>
//                 <input
//                   type="date"
//                   name="endDate"
//                   value={updateFormData.endDate}
//                   onChange={handleUpdateFormChange}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </form>
//             <div className="flex justify-end space-x-3 mt-6">
//               <button
//                 onClick={handleCloseUpdateModal}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleUpdateObjective}
//                 disabled={isUpdating || !updateFormData.title.trim()}
//                 className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
//                   isUpdating || !updateFormData.title.trim()
//                     ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                     : 'bg-blue-600 text-white hover:bg-blue-700'
//                 }`}
//               >
//                 {isUpdating ? 'Updating...' : 'Update Objective'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Department Warning Modal */}
//       {isDepartmentWarningModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-medium text-gray-900">No Department Assigned</h3>
//               <button
//                 onClick={handleCloseDepartmentWarningModal}
//                 className="text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <p className="text-sm text-gray-600 mb-4">
//               You are yet to be assigned a department. Please contact your administrator to get assigned to a department before adding objectives.
//             </p>
//             <div className="flex justify-end">
//               <button
//                 onClick={handleCloseDepartmentWarningModal}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState } from "react";
import {
  Search,
  User,
  Filter,
  Plus,
  Calendar,
  MessageSquare,
  MoreHorizontal,
  ExternalLink,
  X,
  Edit2,
  ChevronDown,
  ChevronUp,
  Trash2, Loader
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useGetObjectivesQuery,
  useAddObjectiveCommentMutation,
  useUpdateObjectiveMutation,
  useAcceptObjectiveMutation,
  useDeclineObjectiveMutation,
  useUpdateObjectiveProgressMutation,
  useDeleteObjectiveMutation, // Added for delete functionality
} from "../redux/slices/api/objectiveApiSlice";
import { useGetUserRatingQuery } from "../redux/slices/api/analyticsApiSlice";
import Guage from "../components/GaugeChart";
import { toast } from "sonner";
import { selectCurrentUser } from "../redux/slices/authSlice";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const [commentInput, setCommentInput] = useState("");
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedObjectiveId, setSelectedObjectiveId] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDepartmentWarningModalOpen, setIsDepartmentWarningModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // New state for delete confirmation
  const [updateFormData, setUpdateFormData] = useState({
    title: "",
    description: "",
    priorityLevel: "Medium",
    startDate: "",
    endDate: "",
    subObjectives: [],
  });
  const [openCommentDropdowns, setOpenCommentDropdowns] = useState({});
  const [openProgressDropdowns, setOpenProgressDropdowns] = useState({});
  const [openActionDropdowns, setOpenActionDropdowns] = useState({}); // New state for action dropdown
  const { user, auth } = useSelector((state) => ({
    user: selectCurrentUser(state),
    auth: state.auth,
  }));
  const navigate = useNavigate();

  // Fetch objectives and mutations
  const { data: objectives = [], isLoading, isError, error } = useGetObjectivesQuery();
  const [addComment, { isLoading: isCommenting }] = useAddObjectiveCommentMutation();
  const [updateObjective, { isLoading: isUpdating }] = useUpdateObjectiveMutation();
  const [acceptObjective, { isLoading: isAccepting }] = useAcceptObjectiveMutation();
  const [declineObjective, { isLoading: isDeclining }] = useDeclineObjectiveMutation();
  const [updateObjectiveProgress, { isLoading: isUpdatingProgress }] = useUpdateObjectiveProgressMutation();
  const [deleteObjective, { isLoading: isDeleting }] = useDeleteObjectiveMutation(); // Added delete mutation

  // Fetch user rating
  const {
    data: userRatingData,
    isLoading: isRatingLoading,
    isError: isRatingError,
    error: ratingError,
  } = useGetUserRatingQuery(user?.id);

  // Calculate goal completion
  const calculateGoalCompletion = () => {
    let totalTasks = 0;
    let completedTasks = 0;

    objectives.forEach((objective) => {
      if (objective.subObjectives && Array.isArray(objective.subObjectives)) {
        totalTasks += objective.subObjectives.length;
        if (objective.status === "Completed") {
          completedTasks += objective.subObjectives.length;
        } else {
          completedTasks += objective.subObjectives.filter((subObjective) => {
            return (
              subObjective.status === "completed" ||
              subObjective.status === "Completed" ||
              subObjective.progress === 100 ||
              subObjective.isCompleted === true
            );
          }).length;
        }
      }
    });

    if (totalTasks === 0) return "No tasks available";
    const completionPercentage = Math.round((completedTasks / totalTasks) * 100);
    return `${completionPercentage}%`;
  };

  // Stats data
  const performanceScore = userRatingData ? (userRatingData.rating / 20).toFixed(1) : 0;
  const gaugeValue = userRatingData ? userRatingData.rating : 0;
  const goalCompletion = calculateGoalCompletion();
  const skillGrowth = "No data from your manager";
  const feedbackScore = "No feedback score from manager";

  const tabs = ["Home", "Objectives", "Progress Tracking", "Development plan"];

  // Handle error toasts
  React.useEffect(() => {
    if (isError) {
      const errorMessage = error?.data?.message || "Failed to load objectives";
      toast.error(errorMessage);
    }
  }, [isError, error]);

  React.useEffect(() => {
    if (isRatingError) {
      const errorMessage = ratingError?.data?.message || "Failed to load performance rating";
      toast.error(errorMessage);
    }
  }, [isRatingError, ratingError]);

  // Debug data
  React.useEffect(() => {
    console.log("Objectives data:", objectives);
    console.log("User rating data:", userRatingData);
  }, [objectives, userRatingData]);

  // Handle Add Objective
  const handleAddObjective = () => {
    if (!user?.department) {
      setIsDepartmentWarningModalOpen(true);
      return;
    }
    navigate("/tasks");
  };

  // Modal handlers
  const handleCloseDepartmentWarningModal = () => setIsDepartmentWarningModalOpen(false);
  const handleCloseCommentModal = () => {
    setIsCommentModalOpen(false);
    setSelectedObjectiveId(null);
    setCommentInput("");
  };
  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedObjectiveId(null);
    setUpdateFormData({
      title: "",
      description: "",
      priorityLevel: "Medium",
      startDate: "",
      endDate: "",
      subObjectives: [],
    });
  };
  const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);

  // Form handlers
  const handleCommentChange = (e) => setCommentInput(e.target.value);
  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Mutation handlers
  const handleAddComment = async () => {
    if (!selectedObjectiveId || !commentInput.trim()) {
      toast.error("Invalid objective ID or empty comment");
      return;
    }
    try {
      await addComment({ id: selectedObjectiveId, text: commentInput.trim() }).unwrap();
      toast.success("Comment added successfully");
      handleCloseCommentModal();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add comment");
    }
  };
  const handleOpenUpdateModal = (objective) => {
    if (!objective._id || typeof objective._id !== 'string') {
      toast.error('Invalid objective ID');
      return;
    }
    setSelectedObjectiveId(objective._id);
    setUpdateFormData({
      title: objective.title || '',
      description: objective.description || '',
      priorityLevel: objective.priorityLevel || 'Medium',
      startDate: objective.startDate ? new Date(objective.startDate).toISOString().split('T')[0] : '',
      endDate: objective.endDate ? new Date(objective.endDate).toISOString().split('T')[0] : '',
      subObjectives: objective.subObjectives || [],
    });
    setIsUpdateModalOpen(true);
  };

  const handleUpdateObjective = async () => {
    if (!selectedObjectiveId || !updateFormData.title.trim()) {
      toast.error("Invalid objective ID or missing title");
      return;
    }
    try {
      await updateObjective({ id: selectedObjectiveId, ...updateFormData }).unwrap();
      toast.success("Objective updated successfully");
      handleCloseUpdateModal();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update objective");
    }
  };

  const handleAcceptObjective = async (objectiveId, token) => {
    if (!objectiveId || !token) {
      toast.error("Invalid objective ID or token");
      return;
    }
    try {
      await acceptObjective({ objectiveId, token }).unwrap();
      toast.success("Objective accepted successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to accept objective");
    }
  };

  

  const handleDeclineObjective = async (objectiveId, token) => {
    if (!objectiveId || !token) {
      toast.error("Invalid objective ID or token");
      return;
    }
    try {
      await declineObjective({ objectiveId, token }).unwrap();
      toast.success("Objective declined successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to decline objective");
    }
  };

const handleOpenCommentModal = (objectiveId) => {
    if (!objectiveId || typeof objectiveId !== 'string') {
      toast.error('Invalid objective ID');
      return;
    }
    setSelectedObjectiveId(objectiveId);
    setCommentInput('');
    setIsCommentModalOpen(true);
  };


  const handleDeleteObjective = async (objectiveId) => {
    if (!objectiveId) {
      toast.error("Invalid objective ID");
      return;
    }
    try {
      await deleteObjective(objectiveId).unwrap(); // Pass ID directly as per mutation
      toast.success("Objective deleted successfully");
      handleCloseDeleteModal();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete objective");
    }
  };

  

  // Toggle handlers
  const toggleCommentDropdown = (objectiveId) =>
    setOpenCommentDropdowns((prev) => ({ ...prev, [objectiveId]: !prev[objectiveId] }));
  const toggleProgressDropdown = (objectiveId) =>
    setOpenProgressDropdowns((prev) => ({ ...prev, [objectiveId]: !prev[objectiveId] }));
  const toggleActionDropdown = (objectiveId) =>
    setOpenActionDropdowns((prev) => ({ ...prev, [objectiveId]: !prev[objectiveId] }));

  // Progress update
  const handleUpdateProgress = async (objectiveId, progress) => {
    try {
      await updateObjectiveProgress({ id: objectiveId, progress }).unwrap();
      toast.success("Progress updated successfully");
      toggleProgressDropdown(objectiveId);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update progress");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 rounded-md">
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome, {user?.name || user?.firstName || "User"}
          </h1>
          <p className="text-gray-600">Track and manage your objectives with ease</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Your Performance Score</h2>
              <p className="text-sm text-gray-500 mb-4">
                Based on your goals, feedback, and peer recognition
              </p>
              {isRatingLoading ? (
                <p className="text-sm text-gray-600">Loading performance score...</p>
              ) : isRatingError ? (
                <p className="text-sm text-red-600">Error loading performance score</p>
              ) : (
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold text-gray-900">{performanceScore}</span>
                  <span className="text-sm text-gray-500">/5.0 (Exceeds Expectations)</span>
                </div>
              )}
            </div>
            <div className="flex-shrink-0 p-4">
              <Guage value={gaugeValue} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Goal Completion</h3>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-gray-900">{goalCompletion}</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Skill Growth</h3>
            <div className="flex items-baseline space-x-2">
              <span className="text-lg text-gray-600">{skillGrowth}</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Feedback Score</h3>
            <div className="flex items-baseline space-x-2">
              <span className="text-lg text-gray-600">{feedbackScore}</span>
            </div>
          </div>
        </div>

        <div className=" ">
          <div className="px-6 py-4 border-b  flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Your Objectives</h2>
            <div className="flex space-x-3">
              <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
              <button
                onClick={handleAddObjective}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Objective
              </button>
            </div>
          </div>

          <div className=" flex flex-col gap-5">
            {isLoading ? (
              <div className="p-6 text-center text-gray-600">Loading objectives...</div>
            ) : isError ? (
              <div className="p-6 text-center text-red-600">Failed to load objectives</div>
            ) : objectives.length === 0 ? (
              <div className="p-6 text-center text-gray-600">No objectives found. Add one to get started!</div>
            ) : (
              objectives.map((objective) => (
                <div key={objective._id} className="p-6 border border-gray-200 shadow-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <h3 className="text-base font-medium text-gray-900">
                        {objective.title.substring(0, 50)}...
                      </h3>
                      <span
                        className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${
                          objective.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : objective.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {objective.status || "Unknown"}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <p className="text-xs text-gray-600 mb-4">{objective.assignedTo.name}</p>
                    
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{objective.description}</p>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>{objective.progress || 0}%</span>
                      <span>
                        Last updated: {new Date(objective.lastUpdated || objective.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${objective.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <button
                      onClick={() => toggleCommentDropdown(objective._id)}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {openCommentDropdowns[objective._id] ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-1" />
                          Hide Comments
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-1" />
                          Show Comments ({objective.comments?.length || 0})
                        </>
                      )}
                    </button>
                  </div>
                  {openCommentDropdowns[objective._id] && (
                    <div className="ml-4 mb-4 border-l-2 border-gray-200 pl-4">
                      {objective.comments?.length > 0 ? (
                        objective.comments.map((comment) => (
                          <div key={comment._id} className="mb-3 last:mb-0">
                            <p className="text-sm text-gray-800 mb-1 leading-relaxed">{comment.text}</p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span className="font-medium text-gray-700">{comment.author.name}</span>
                              <time dateTime={comment.date} className="text-gray-400">
                                {new Date(comment.date).toLocaleString()}
                              </time>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-2">
                          <p className="text-sm text-gray-500 italic">No comments yet.</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      Due: {new Date(objective.endDate).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-3">
                      {objective.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleAcceptObjective(objective._id, objective.token)}
                            disabled={isAccepting}
                            className={`text-sm font-medium ${
                              isAccepting
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-green-600 hover:text-green-800"
                            } transition-colors`}
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleDeclineObjective(objective._id, objective.token)}
                            disabled={isDeclining}
                            className={`text-sm font-medium ${
                              isDeclining
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-red-600 hover:text-red-800"
                            } transition-colors`}
                          >
                            Decline
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleOpenCommentModal(objective._id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    <div className="relative">
                        <button
                          onClick={() => toggleActionDropdown(objective._id)}
                          className="text-white hover:text-gray-600 transition-colors flex bg-blue-900 rounded-md p-1"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        {openActionDropdowns[objective._id] && (
                          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 animate-fadeIn">
                            <button
                              onClick={() => {
                                setSelectedObjectiveId(objective._id);
                                setIsDeleteModalOpen(true);
                                toggleActionDropdown(objective._id);
                              }}
                              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </button>
                            <button
                              onClick={() => {
                                handleOpenUpdateModal(objective);
                                toggleActionDropdown(objective._id);
                              }}
                              className="flex w-full items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                              <Edit2 className="w-4 h-4 mr-2" />
                              Edit
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => toggleProgressDropdown(objective._id)}
                          className="text-white hover:text-gray-600 transition-colors flex bg-blue-900 rounded-md p-1"
                        >
                          <Loader className="w-5 h-5" />
                        </button>
                        {openProgressDropdowns[objective._id] && (
                          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                            <select
                              value={objective.progress || 0}
                              onChange={(e) => handleUpdateProgress(objective._id, parseInt(e.target.value))}
                              className="w-full p-2 text-sm text-gray-700 bg-white border-none focus:outline-none"
                              disabled={isUpdatingProgress}
                            >
                              <option value={0}>0%</option>
                              <option value={25}>25%</option>
                              <option value={50}>50%</option>
                              <option value={75}>75%</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {isCommentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add Comment</h3>
              <button onClick={handleCloseCommentModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              type="text"
              value={commentInput}
              onChange={handleCommentChange}
              placeholder="Enter your comment..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={handleCloseCommentModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddComment}
                disabled={isCommenting || !commentInput.trim()}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  isCommenting || !commentInput.trim()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isCommenting ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Update Objective</h3>
              <button onClick={handleCloseUpdateModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={updateFormData.title}
                  onChange={handleUpdateFormChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter objective title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={updateFormData.description}
                  onChange={handleUpdateFormChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter objective description"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Priority Level</label>
                <select
                  name="priorityLevel"
                  value={updateFormData.priorityLevel}
                  onChange={handleUpdateFormChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={updateFormData.startDate}
                  onChange={handleUpdateFormChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={updateFormData.endDate}
                  onChange={handleUpdateFormChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </form>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleCloseUpdateModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateObjective}
                disabled={isUpdating || !updateFormData.title.trim()}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  isUpdating || !updateFormData.title.trim()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isUpdating ? "Updating..." : "Update Objective"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
              <button onClick={handleCloseDeleteModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this objective? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseDeleteModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteObjective(selectedObjectiveId)}
                disabled={isDeleting}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  isDeleting
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDepartmentWarningModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">No Department Assigned</h3>
              <button onClick={handleCloseDepartmentWarningModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              You are yet to be assigned a department. Please contact your administrator to get assigned to a department before adding objectives.
            </p>
            <div className="flex justify-end">
              <button
                onClick={handleCloseDepartmentWarningModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;