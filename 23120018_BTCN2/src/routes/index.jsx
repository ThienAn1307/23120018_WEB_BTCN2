import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { MovieDetailPage } from '../pages/MovieDetailPage';
import { MainLayout } from '@/layouts/MainLayout';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ProfilePage } from '../pages/ProfilePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: '/movie-detail',
        element: <MovieDetailPage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      }
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: 'register',
    element: <RegisterPage />,
  }
]);