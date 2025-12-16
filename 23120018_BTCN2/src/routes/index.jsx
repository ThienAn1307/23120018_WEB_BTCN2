import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { MovieDetailPage } from '../pages/MovieDetailPage';
import { PersonDetailPage } from '../pages/PersonDetailPage';
import { SearchPage } from '../pages/SearchPage';
import { MainLayout } from '@/layouts/MainLayout';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ProfilePage } from '../pages/ProfilePage';
import { FavoritesPage } from '../pages/FavoritesPage';

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
        path: '/person-detail',
        element: <PersonDetailPage />,
      },
      {
        path: '/search',
        element: <SearchPage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '/favorites',
        element: <FavoritesPage />,
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