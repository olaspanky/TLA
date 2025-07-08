
import { createSlice } from "@reduxjs/toolkit";

const loadAuthState = () => {
  try {
    const serializedState = localStorage.getItem("authState");
    if (serializedState === null) {
      return {
        accounts: [],
        activeAccount: null,
        isSidebarOpen: false,
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.warn("Failed to load auth state from localStorage", err);
    return {
      accounts: [],
      activeAccount: null,
      isSidebarOpen: false,
    };
  }
};

const initialState = loadAuthState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      const existingAccountIndex = state.accounts.findIndex(
        (account) => account.user.email === user.email
      );

      const newAccount = { user, token };

      if (existingAccountIndex >= 0) {
     
        state.accounts[existingAccountIndex] = newAccount;
      } else {
  
        state.accounts.push(newAccount);
      }


      state.activeAccount = newAccount;


      localStorage.setItem(
        "authState",
        JSON.stringify({
          accounts: state.accounts,
          activeAccount: state.activeAccount,
          isSidebarOpen: state.isSidebarOpen,
        })
      );
    },
    switchAccount: (state, action) => {
      const accountIndex = action.payload;
      if (accountIndex >= 0 && accountIndex < state.accounts.length) {
        state.activeAccount = state.accounts[accountIndex];
        localStorage.setItem("authState", JSON.stringify(state));
      }
    },
    removeAccount: (state, action) => {
      const accountIndex = action.payload;
      if (accountIndex >= 0 && accountIndex < state.accounts.length) {
        const isRemovingActive =
          state.accounts[accountIndex].user.email ===
          state.activeAccount?.user?.email;

        state.accounts.splice(accountIndex, 1);

        if (isRemovingActive) {
          state.activeAccount =
            state.accounts.length > 0 ? state.accounts[0] : null;
        }

        localStorage.setItem("authState", JSON.stringify(state));
      }
    },
    logout: (state) => {
      if (state.activeAccount) {
        const email = state.activeAccount.user.email;
        state.accounts = state.accounts.filter(
          (account) => account.user.email !== email
        );
        state.activeAccount =
          state.accounts.length > 0 ? state.accounts[0] : null;

        localStorage.setItem("authState", JSON.stringify(state));
      }
    },
    logoutAll: (state) => {
      state.accounts = [];
      state.activeAccount = null;
      localStorage.removeItem("authState");
    },
    setOpenSidebar: (state, action) => {
      state.isSidebarOpen = action.payload;
   
      localStorage.setItem("authState", JSON.stringify(state));
    },
    clearActiveAccount: (state) => {
      state.activeAccount = null;
    },
  },
});

export const {
  setCredentials,
  switchAccount,
  removeAccount,
  logout,
  logoutAll,
  setOpenSidebar,
  clearActiveAccount,
} = authSlice.actions;


export const selectCurrentUser = (state) => state.auth.activeAccount?.user;
export const selectCurrentToken = (state) => state.auth.activeAccount?.token;
export const selectAccounts = (state) => state.auth.accounts;
export const selectIsSidebarOpen = (state) => state.auth.isSidebarOpen;

export default authSlice.reducer;
