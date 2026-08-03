import { createBrowserRouter, Navigate } from "react-router-dom";

import AppLayout from "../layout/AppLayout";
import AuthRequiredPage from "../pages/AuthRequiredPage";
import LoginPage from "../pages/LoginPage";
import PasswordEditPage from "../pages/PasswordEditPage";
import PostCreatePage from "../pages/PostCreatePage";
import PostDetailPage from "../pages/PostDetailPage";
import PostEditPage from "../pages/PostEditPage";
import PostsPage from "../pages/PostsPage";
import ProfileEditPage from "../pages/ProfileEditPage";
import SignupPage from "../pages/SignupPage";
import ProtectedRoute from "../routes/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/posts" replace />,
      },
      {
        path: "login",
        element: <LoginPage />,
        handle: { header: { profile: "none" } },
      },
      {
        path: "signup",
        element: <SignupPage />,
        handle: {
          header: {
            showBackButton: true,
            backLabel: "로그인 페이지로 돌아가기",
            profile: "none",
          },
        },
      },
      {
        path: "posts",
        element: <PostsPage />,
        handle: { header: { profile: "menu" } },
      },
      {
        path: "auth-required",
        element: <AuthRequiredPage />,
        handle: { header: { profile: "none" } },
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "posts/new",
            element: <PostCreatePage />,
            handle: {
              header: {
                showBackButton: true,
                backLabel: "게시글 목록으로 돌아가기",
                profile: "menu",
              },
            },
          },
          {
            path: "posts/:postId",
            element: <PostDetailPage />,
            handle: {
              header: {
                showBackButton: true,
                backLabel: "게시글 목록으로 돌아가기",
                profile: "menu",
              },
            },
          },
          {
            path: "posts/:postId/edit",
            element: <PostEditPage />,
            handle: {
              header: {
                showBackButton: true,
                backLabel: "이전 페이지로 돌아가기",
                profile: "menu",
              },
            },
          },
          {
            path: "profile/edit",
            element: <ProfileEditPage />,
            handle: { header: { profile: "menu" } },
          },
          {
            path: "profile/password",
            element: <PasswordEditPage />,
            handle: { header: { profile: "menu" } },
          },
        ],
      },
    ],
  },
]);
