import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Login from "./screens/Login.tsx";
import Register from "./screens/Register.tsx";
import Content from "./components/Content.tsx";
import Modal from "./components/Modal.tsx";
import AppError from "./screens/AppError.tsx";
// import Imageview from "./components/Imageview.tsx";
// import Modal from "./components/Modal.tsx";
import { action as loginAction } from "./screens/Login.tsx";
import { action as uploadAction } from "./screens/Upload.tsx";
import Upload from "./screens/Upload.tsx";
import Update from "./screens/Update.tsx";
const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <AppError />,
    children: [
      {
        path: "/",
        element: <Content />,
        children: [
          {
            path: "/img/:id",
            element: <Modal />,
            errorElement: <AppError />,
          },
          {
            path: "/register",
            element: <Register />,
            errorElement: <AppError />,
          },

          {
            path: "/login",
            element: <Login />,
            action: loginAction,
            errorElement: <AppError />,
          },
          {
            path: "/upload",
            element: <Upload />,
            action: uploadAction,
            errorElement: <AppError />,
          },
          {
            path: "/img/update/:id",
            element: <Update />,
            errorElement: <AppError />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
