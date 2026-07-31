import { createBrowserRouter, Navigate } from "react-router-dom";

import AuthRequiredPage from "../pages/AuthRequiredPage";
import LoginPage from "../pages/LoginPage";
import PasswordEditPage from "../pages/PasswordEditPage";
import PostCreatePage from "../pages/PostCreatePage";
import PostDetailPage from "../pages/PostDetailPage";
import PostEditPage from "../pages/PostEditPage";
import PostsPage from "../pages/PostsPage";
import ProfileEditPage from "../pages/ProfileEditPage";
import SignupPage from "../pages/SignupPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/posts" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/posts",
    element: <PostsPage />,
  },
  {
    path: "/posts/new",
    element: <PostCreatePage />,
  },
  {
    path: "/posts/:postId",
    element: <PostDetailPage />,
  },
  {
    path: "/posts/:postId/edit",
    element: <PostEditPage />,
  },
  {
    path: "/profile/edit",
    element: <ProfileEditPage />,
  },
  {
    path: "/profile/password",
    element: <PasswordEditPage />,
  },
  {
    path: "/auth-required",
    element: <AuthRequiredPage />,
  },
]);
