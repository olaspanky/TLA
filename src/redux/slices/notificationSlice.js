import { createSlice } from '@reduxjs/toolkit';
import { notificationsApiSlice } from './api/notificationsApiSlice';

const initialState = {
  notifications: [],
  unreadCount: 0,
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Optional: Add any additional reducers if needed
    resetNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle getNotifications
    builder
      .addMatcher(
        notificationsApiSlice.endpoints.getNotifications.matchPending,
        (state) => {
          state.status = 'loading';
        }
      )
      .addMatcher(
        notificationsApiSlice.endpoints.getNotifications.matchFulfilled,
        (state, action) => {
          state.status = 'succeeded';
          state.notifications = action.payload; // Assuming payload is the list of notifications
        }
      )
      .addMatcher(
        notificationsApiSlice.endpoints.getNotifications.matchRejected,
        (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        }
      );

    // Handle getUnreadCount
    builder
      .addMatcher(
        notificationsApiSlice.endpoints.getUnreadCount.matchPending,
        (state) => {
          state.status = 'loading';
        }
      )
      .addMatcher(
        notificationsApiSlice.endpoints.getUnreadCount.matchFulfilled,
        (state, action) => {
          state.status = 'succeeded';
          state.unreadCount = action.payload; // Assuming payload is the unread count
        }
      )
      .addMatcher(
        notificationsApiSlice.endpoints.getUnreadCount.matchRejected,
        (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        }
      );

    // Handle markNotificationAsRead
    builder
      .addMatcher(
        notificationsApiSlice.endpoints.markNotificationAsRead.matchFulfilled,
        (state, action) => {
          state.status = 'succeeded';
          // Optionally update notifications list if needed
          state.notifications = state.notifications.map((notif) =>
            notif.id === action.meta.arg ? { ...notif, read: true } : notif
          );
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      )
      .addMatcher(
        notificationsApiSlice.endpoints.markNotificationAsRead.matchRejected,
        (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        }
      );

    // Handle markAllNotificationsAsRead
    builder
      .addMatcher(
        notificationsApiSlice.endpoints.markAllNotificationsAsRead.matchFulfilled,
        (state) => {
          state.status = 'succeeded';
          state.notifications = state.notifications.map((notif) => ({
            ...notif,
            read: true,
          }));
          state.unreadCount = 0;
        }
      )
      .addMatcher(
        notificationsApiSlice.endpoints.markAllNotificationsAsRead.matchRejected,
        (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        }
      );

    // Handle updateNotificationPreferences
    builder
      .addMatcher(
        notificationsApiSlice.endpoints.updateNotificationPreferences.matchFulfilled,
        (state) => {
          state.status = 'succeeded';
        }
      )
      .addMatcher(
        notificationsApiSlice.endpoints.updateNotificationPreferences.matchRejected,
        (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        }
      );
  },
});

export const { resetNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;