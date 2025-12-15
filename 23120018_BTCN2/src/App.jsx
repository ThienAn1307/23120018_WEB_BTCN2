import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { MainLayout } from './layouts/MainLayout';
import { AuthProvider } from './context/AuthContext';
import { LoadingProvider } from './context/LoadingContext';
import { LoadingScreen } from './components/LoadingScreen';

function App() {
  return (
    <LoadingProvider>
      <AuthProvider>
        <LoadingScreen />
        <RouterProvider router={router} />
      </AuthProvider>
    </LoadingProvider>
  );
};

export default App