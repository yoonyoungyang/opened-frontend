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
        handle: { title: "로그인", header: { profile: "none" } },
      },
      {
        path: "signup",
        element: <SignupPage />,
        handle: {
          title: "회원가입",
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
        handle: { title: "게시글 목록", header: { profile: "menu" } },
      },
      {
        path: "auth-required",
        element: <AuthRequiredPage />,
        handle: { title: "로그인 필요", header: { profile: "none" } },
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "posts/new",
            element: <PostCreatePage />,
            handle: {
              title: "게시글 생성",
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
              title: "게시글 상세",
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
              title: "게시글 수정",
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
            handle: {
              title: "회원 정보 수정",
              header: { profile: "menu" },
            },
          },
          {
            path: "profile/password",
            element: <PasswordEditPage />,
            handle: {
              title: "비밀번호 변경",
              header: { profile: "menu" },
            },
          },
        ],
      },
    ],
  },
]);
