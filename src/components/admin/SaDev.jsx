import React, { useState } from 'react';
import { useGetDevelopmentNeedsQuery, useReviewDevelopmentNeedMutation } from '../../redux/slices/api/developmentApiSlice';

const DevelopmentActivities = () => {
  const { data: activities = [], isLoading, error, refetch } = useGetDevelopmentNeedsQuery();
  const [reviewDevelopmentNeed, { isLoading: isReviewLoading }] = useReviewDevelopmentNeedMutation();
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewComment, setReviewComment] = useState('');
  const [notification, setNotification] = useState(null);

  const getInitials = (requestedBy) => {
    const name = requestedBy?.name || 'Unknown User';
    if (typeof name !== 'string' || !name.trim()) return 'UN';
    const parts = name.split(' ').filter(part => part.trim().length > 0);
    if (parts.length === 0) return 'UN';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
  };

  const getAvatarColor = (requestedBy) => {
    const colors = [
      'bg-purple-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-indigo-500',
      'bg-pink-500',
      'bg-teal-500',
    ];
    const name = requestedBy?.name || 'Unknown User';
    const index = name.length % colors.length;
    return colors[index];
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown date';
    const now = new Date();
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';

    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;

    return date.toLocaleDateString();
  };

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedActivity(null);
    setReviewComment('');
    setNotification(null);
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleApprove = async () => {
    try {
      await reviewDevelopmentNeed({
        id: selectedActivity._id,
        status: 'accepted',
        comment: reviewComment || 'Approved'
      }).unwrap();
      setSelectedActivity(prev => ({ ...prev, approvalStatus: 'accepted' }));
      showNotification('success', 'Development plan approved successfully!');
      refetch(); // Refetch to update the list
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } catch (error) {
      console.error('Error approving development need:', error);
      console.log('Full error details:', error.data);
      showNotification('error', 'Failed to approve development plan. Please try again.');
    }
  };

  const handleDecline = async () => {
    try {
      await reviewDevelopmentNeed({
        id: selectedActivity._id,
        status: 'rejected',
        comment: reviewComment || 'Declined'
      }).unwrap();
      setSelectedActivity(prev => ({ ...prev, approvalStatus: 'rejected' }));
      showNotification('success', 'Development plan declined successfully!');
      refetch(); // Refetch to update the list
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } catch (error) {
      console.error('Error declining development need:', error);
      console.log('Full error details:', error.data);
      showNotification('error', 'Failed to decline development plan. Please try again.');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center text-red-500">
        <p>Error loading activities</p>
        <p className="text-sm text-gray-500 mt-1">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="bg-white h-screen rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Activities</h2>
      </div>
      <div className="overflow-y-auto max-h-[calc(100vh-120px)]">
        {activities.map((activity) => (
          <div
            key={activity._id}
            className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors flex items-center cursor-pointer"
            onClick={() => handleActivityClick(activity)}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${getAvatarColor(activity.requestedBy)} mr-3 flex-shrink-0`}
            >
              {getInitials(activity.requestedBy)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 truncate">
                <span className="font-medium">{activity.requestedBy?.name || 'Unknown User'}</span> submitted development plan
              </p>
              <div className="flex items-center mt-1 space-x-2">
                <p className="text-xs text-gray-500">{getTimeAgo(activity.createdAt)}</p>
                {activity.approvalStatus && (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    activity.approvalStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : activity.approvalStatus === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {activity.approvalStatus}
                  </span>
                )}
              </div>
              {activity.budgetArea && (
                <p className="text-xs text-gray-400 mt-1">
                  Budget Area: {activity.budgetArea}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      {activities.length === 0 && !isLoading && (
        <div className="p-8 text-center text-gray-500">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No development activities found</p>
          <p className="text-gray-400 text-xs mt-1">Activities will appear here when team members submit development plans</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            {/* Notification */}
            {notification && (
              <div className={`absolute top-4 left-4 right-4 z-10 p-3 rounded-md border ${
                notification.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {notification.type === 'success' ? (
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{notification.message}</p>
                  </div>
                  <button
                    onClick={() => setNotification(null)}
                    className="ml-auto -mx-1.5 -my-1.5 rounded-md p-1.5 hover:bg-gray-100 focus:outline-none"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            {/* Modal Header */}
            <div className={`p-6 border-b border-gray-200 flex items-center justify-between ${notification ? 'mt-16' : ''}`}>
              <h2 className="text-xl font-semibold text-gray-900">Development Plan Details</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isReviewLoading}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Requester Info */}
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium ${getAvatarColor(selectedActivity.requestedBy)}`}>
                  {getInitials(selectedActivity.requestedBy)}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{selectedActivity.requestedBy?.name || 'Unknown User'}</h3>
                  <p className="text-sm text-gray-500">{selectedActivity.requestedBy?.email || 'No email provided'}</p>
                </div>
              </div>

              {/* Development Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Development Need</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                      {selectedActivity.needs || 'No details provided'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Budget Area</label>
                    <p className="text-sm text-gray-900">
                      {selectedActivity.budgetArea || 'Not specified'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost</label>
                    <p className="text-sm text-gray-900 font-medium">
                      {formatCurrency(selectedActivity.cost)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      selectedActivity.approvalStatus === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : selectedActivity.approvalStatus === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedActivity.approvalStatus || 'pending'}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Objective ID</label>
                    <p className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">
                      {selectedActivity.objectiveId || 'Not linked'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Submitted</label>
                    <p className="text-sm text-gray-900">
                      {getTimeAgo(selectedActivity.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Review History */}
              {selectedActivity.reviewedBy && selectedActivity.reviewedBy.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Review History</label>
                  <div className="space-y-3">
                    {selectedActivity.reviewedBy.map((review, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm text-gray-900">{review.reviewer}</span>
                          <span className="text-xs text-gray-500">{review.role}</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            review.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : review.status === 'declined'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {review.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-gray-700">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Review Comment Section */}
              {selectedActivity.approvalStatus === 'pending' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Comment <span className="text-gray-400">(optional)</span>
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Add a comment about your decision..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    disabled={isReviewLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This comment will be visible to the requester and in the review history.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            {selectedActivity.approvalStatus === 'pending' && (
              <div className="p-6 border-t border-gray-200 flex space-x-3 justify-end">
                <button
                  onClick={handleDecline}
                  disabled={isReviewLoading}
                  className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isReviewLoading ? 'Processing...' : 'Decline'}
                </button>
                <button
                  onClick={handleApprove}
                  disabled={isReviewLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isReviewLoading ? 'Processing...' : 'Approve'}
                </button>
              </div>
            )}

            {selectedActivity.approvalStatus !== 'pending' && (
              <div className="p-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DevelopmentActivities;