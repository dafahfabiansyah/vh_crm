import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./authSlice";

// Configure Redux Persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // only persist auth
};

const rootReducer = combineReducers({
  auth: authReducer,
  // Add other reducers here
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values in the specified paths for redux-persist
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }), // thunk is included by default in getDefaultMiddleware
  // devTools: process.env.NODE_ENV !== "production",
  devTools: import.meta.env.NODE_ENV!== "production",
});

// Create persistor
export const persistor = persistStore(store);

export default store;
