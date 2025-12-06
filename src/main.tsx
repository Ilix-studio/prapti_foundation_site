import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { persistor, store } from "./redux-store/store.ts";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleReCaptchaProvider } from "@wojtekmaj/react-recaptcha-v3";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <GoogleReCaptchaProvider
            reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
          >
            <App />
          </GoogleReCaptchaProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
);
