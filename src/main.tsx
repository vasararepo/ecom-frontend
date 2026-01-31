import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

import App from "./App";
import { store } from "./store";
import "./Styles/theme.css";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <>
          <App />

          
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            pauseOnHover
            closeOnClick
            newestOnTop
          />
        </>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
