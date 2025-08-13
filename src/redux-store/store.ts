// src/redux-store/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import createIdbStorage from "redux-persist-indexeddb-storage";

import authReducer from "./slices/authSlice";

import { blogApi } from "./services/blogApi";
import { cloudinaryApi } from "./services/cloudinaryApi";
import { adminAuthApi } from "./services/adminApi";
import { volunteerApi } from "./services/volunteerApi";
import { contactApi } from "./services/contactApi";
//New
import { photoApi } from "./services/photoApi";
import { videoApi } from "./services/videoApi";
import { visitorApi } from "./services/visitorApi";
import { categoryApi } from "./services/categoryApi";
//
import { totalImpactApi } from "./services/impactApi";

// Create IndexedDB storage for redux-persist
const idbStorage = createIdbStorage("prapti-foundation-db");

// Configure persist options for our root reducer
const persistConfig = {
  key: "root",
  version: 1,
  storage: idbStorage,
  whitelist: ["auth"], // Only persist auth state to avoid persisting API cache
};

const rootReducer = combineReducers({
  auth: authReducer,
  [adminAuthApi.reducerPath]: adminAuthApi.reducer,
  [blogApi.reducerPath]: blogApi.reducer,
  [cloudinaryApi.reducerPath]: cloudinaryApi.reducer,
  [volunteerApi.reducerPath]: volunteerApi.reducer,
  [contactApi.reducerPath]: contactApi.reducer,
  //
  [categoryApi.reducerPath]: categoryApi.reducer,
  [photoApi.reducerPath]: photoApi.reducer,
  [videoApi.reducerPath]: videoApi.reducer,
  [visitorApi.reducerPath]: visitorApi.reducer,
  //
  [totalImpactApi.reducerPath]: totalImpactApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Redux Persist middleware needs these actions to be ignored
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      adminAuthApi.middleware,
      blogApi.middleware,
      cloudinaryApi.middleware,
      volunteerApi.middleware,
      contactApi.middleware,
      categoryApi.middleware,
      photoApi.middleware,
      videoApi.middleware,
      visitorApi.middleware,
      totalImpactApi.middleware
    ),
});

// Create persistor for use with PersistGate
export const persistor = persistStore(store);

// Setup listeners for automatic refetching
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
