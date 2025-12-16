import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { MainLayout } from './layouts/MainLayout';
import { AuthProvider } from './context/AuthContext';
import { LoadingProvider } from './context/LoadingContext';
import { MoviesProvider } from './context/MovieContext';
import { LoadingScreen } from './components/LoadingScreen';

function App() {
  return (
    <LoadingProvider>
      <AuthProvider>
        <MoviesProvider>
          <LoadingScreen />
          <RouterProvider router={router} />
        </MoviesProvider>
      </AuthProvider>
    </LoadingProvider>
  );
};

export default App