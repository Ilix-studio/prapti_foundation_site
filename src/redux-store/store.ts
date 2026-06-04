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
import { apiSlice } from "./services/apiSlice";

// Side-effect registrations: each injectEndpoints call runs at module import time.
// These imports are required so the endpoints are registered before any hook is called.
import "./services/adminApi";
import "./services/awardApi";
import "./services/blogApi";
import "./services/categoryApi";
import "./services/cloudinaryApi";
import "./services/contactApi";
import "./services/copyResourceApi";
import "./services/impactApi";
import "./services/photoApi";
import "./services/rescueApi";
import "./services/testimonialApi";
import "./services/videoApi";
import "./services/visitorApi";
import "./services/volunteerApi";
import "./services/editorApi";

const idbStorage = createIdbStorage("prapti-foundation-db");

const persistConfig = {
  key: "root",
  version: 1,
  storage: idbStorage,
  whitelist: ["auth"],
  blacklist: [apiSlice.reducerPath],
};

const rootReducer = combineReducers({
  auth: authReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
